// src/components/tournaments/ScoreManagementTab.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Tournament, EventCategory, Match, Player, Score } from "@/types";
import { useTournaments } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Edit3, Save, XCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { translateEventGender, translateEventType, translateMatchStatus } from '@/lib/i18nUtils';

const scoreSchema = z.object({
  set1Player1: z.coerce.number().int().min(0).nullable(),
  set1Player2: z.coerce.number().int().min(0).nullable(),
  set2Player1: z.coerce.number().int().min(0).nullable(),
  set2Player2: z.coerce.number().int().min(0).nullable(),
  set3Player1: z.coerce.number().int().min(0).optional().nullable(),
  set3Player2: z.coerce.number().int().min(0).optional().nullable(),
  winnerId: z.string().min(1, "Phải chọn người thắng cuộc."),
});
type ScoreFormData = z.infer<typeof scoreSchema>;

interface ScoreManagementTabProps {
  tournament: Tournament;
}

export function ScoreManagementTab({ tournament }: ScoreManagementTabProps) {
  const { setMatchScore, getEventCategoryById } = useTournaments();
  const { toast } = useToast();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isScoreFormOpen, setIsScoreFormOpen] = useState(false);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
  });
  
  const watchedScores = watch(["set1Player1", "set1Player2", "set2Player1", "set2Player2", "set3Player1", "set3Player2"]);


  useEffect(() => {
    if (tournament.eventCategories.length > 0) {
      setSelectedEventId(tournament.eventCategories[0].id);
    }
  }, [tournament.eventCategories]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    const currentTournament = useTournaments().getTournamentById(tournament.id);
    return currentTournament?.eventCategories.find(ec => ec.id === selectedEventId) || null;
  }, [selectedEventId, tournament.id, useTournaments().getTournamentById]);

  const openScoreForm = (match: Match) => {
    setEditingMatch(match);
    reset({
      set1Player1: match.score?.set1Player1 ?? null,
      set1Player2: match.score?.set1Player2 ?? null,
      set2Player1: match.score?.set2Player1 ?? null,
      set2Player2: match.score?.set2Player2 ?? null,
      set3Player1: match.score?.set3Player1 ?? null,
      set3Player2: match.score?.set3Player2 ?? null,
      winnerId: match.winnerId || "",
    });
    setIsScoreFormOpen(true);
  };

  const onScoreSubmit = (data: ScoreFormData) => {
    if (!selectedEventId || !editingMatch) return;

    const scoreData: Score = {
      set1Player1: data.set1Player1,
      set1Player2: data.set1Player2,
      set2Player1: data.set2Player1,
      set2Player2: data.set2Player2,
    };
    if (data.set3Player1 !== undefined || data.set3Player2 !== undefined) {
      scoreData.set3Player1 = data.set3Player1;
      scoreData.set3Player2 = data.set3Player2;
    }
    
    // Basic validation for winner based on scores
    let p1Sets = 0;
    let p2Sets = 0;
    if (data.set1Player1 !== null && data.set1Player2 !== null && data.set1Player1 > data.set1Player2) p1Sets++; else if (data.set1Player1 !== null && data.set1Player2 !== null) p2Sets++;
    if (data.set2Player1 !== null && data.set2Player2 !== null && data.set2Player1 > data.set2Player2) p1Sets++; else if (data.set2Player1 !== null && data.set2Player2 !== null) p2Sets++;
    if (data.set3Player1 !== null && data.set3Player2 !== null && data.set3Player1 > data.set3Player2) p1Sets++; else if (data.set3Player1 !== null && data.set3Player2 !== null) p2Sets++;

    const calculatedWinnerId = p1Sets > p2Sets ? editingMatch.player1Id : (p2Sets > p1Sets ? editingMatch.player2Id : undefined);
    
    if (data.winnerId !== calculatedWinnerId && calculatedWinnerId !== undefined && p1Sets !== p2Sets ) { // only check if sets are decisive
        toast({
            title: "Kiểm tra Người thắng",
            description: "Người thắng cuộc được chọn không khớp với tỷ số đã nhập. Vui lòng kiểm tra lại.",
            variant: "destructive"
        });
        return;
    }
    if (!data.winnerId) {
         toast({ title: "Lỗi", description: "Vui lòng chọn người thắng cuộc.", variant: "destructive" });
        return;
    }


    setMatchScore(tournament.id, selectedEventId, editingMatch.id, scoreData, data.winnerId);
    toast({ title: "Tỷ số được cập nhật", description: `Tỷ số cho trận đấu đã được cập nhật.` });
    setIsScoreFormOpen(false);
    setEditingMatch(null);
  };
  
  const getPlayerName = (playerId?: string): string => {
    if (!playerId) return 'N/A';
    if (playerId.startsWith('bye-')) return 'MIỄN ĐẤU';
    const player = selectedEvent?.players.find(p => p.id === playerId);
    return player?.name || 'Không xác định';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Tỷ số</CardTitle>
          <CardDescription>Nhập và cập nhật tỷ số cho các trận đấu.</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.eventCategories.length === 0 ? (
            <p>Không có hạng mục sự kiện nào. Vui lòng thêm hạng mục sự kiện trước.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-select-score">Chọn Hạng mục Sự kiện</Label>
                <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
                  <SelectTrigger id="event-select-score" className="mt-1">
                    <SelectValue placeholder="Chọn một hạng mục sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournament.eventCategories.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} ({translateEventType(event.type)}, {translateEventGender(event.gender)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEvent && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Tỷ số cho: {selectedEvent.name}</h3>
                  {!selectedEvent.drawGenerated && (
                    <p className="text-muted-foreground mt-2">Nhánh đấu chưa được tạo cho hạng mục này.</p>
                  )}
                  {selectedEvent.drawGenerated && selectedEvent.matches.length === 0 && (
                     <p className="text-muted-foreground mt-2">Không có trận đấu nào trong nhánh đấu.</p>
                  )}

                  {selectedEvent.matches.length > 0 && (
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trận</TableHead>
                          <TableHead>VĐV 1</TableHead>
                          <TableHead>VĐV 2</TableHead>
                          <TableHead>Tỷ số</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.matches.map(match => (
                          <TableRow key={match.id}>
                            <TableCell>R{match.round}-{match.matchNumber}</TableCell>
                            <TableCell className={match.winnerId === match.player1Id ? 'font-bold':''}>{getPlayerName(match.player1Id)}</TableCell>
                            <TableCell className={match.winnerId === match.player2Id ? 'font-bold':''}>{getPlayerName(match.player2Id)}</TableCell>
                            <TableCell>
                              {match.score ? 
                                `${match.score.set1Player1 ?? '-'}-${match.score.set1Player2 ?? '-'}, ${match.score.set2Player1 ?? '-'}-${match.score.set2Player2 ?? '-'}` +
                                ((match.score.set3Player1 !== undefined && match.score.set3Player1 !== null) || (match.score.set3Player2 !== undefined && match.score.set3Player2 !== null) ? `, ${match.score.set3Player1 ?? '-'}-${match.score.set3Player2 ?? '-'}` : '')
                                : 'Chưa có'}
                            </TableCell>
                            <TableCell>{translateMatchStatus(match.status)}</TableCell>
                            <TableCell className="text-right">
                              {!match.isBye && (
                                <Button variant="outline" size="sm" onClick={() => openScoreForm(match)}>
                                  <Edit3 className="mr-2 h-4 w-4" /> {match.score ? 'Sửa' : 'Nhập'} Tỷ số
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isScoreFormOpen} onOpenChange={setIsScoreFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nhập Tỷ số cho Trận đấu</DialogTitle>
            {editingMatch && (
                <DialogDescription>
                    Vòng {editingMatch.round} - Trận {editingMatch.matchNumber}: {getPlayerName(editingMatch.player1Id)} vs {getPlayerName(editingMatch.player2Id)}
                </DialogDescription>
            )}
          </DialogHeader>
          {editingMatch && (
            <form onSubmit={handleSubmit(onScoreSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-x-2 gap-y-4 items-center">
                    <Label></Label>
                    <Label className="text-center font-semibold">{getPlayerName(editingMatch.player1Id)}</Label>
                    <Label className="text-center font-semibold">{getPlayerName(editingMatch.player2Id)}</Label>

                    <Label htmlFor="set1Player1" className="self-center">Set 1</Label>
                    <Input id="set1Player1" type="number" {...register("set1Player1")} className="text-center" />
                    <Input id="set1Player2" type="number" {...register("set1Player2")} className="text-center" />
                    {errors.set1Player1 && <p className="col-span-3 text-xs text-destructive mt-1">{errors.set1Player1.message}</p>}
                    {errors.set1Player2 && <p className="col-span-3 text-xs text-destructive mt-1">{errors.set1Player2.message}</p>}


                    <Label htmlFor="set2Player1" className="self-center">Set 2</Label>
                    <Input id="set2Player1" type="number" {...register("set2Player1")} className="text-center" />
                    <Input id="set2Player2" type="number" {...register("set2Player2")} className="text-center" />
                     {errors.set2Player1 && <p className="col-span-3 text-xs text-destructive mt-1">{errors.set2Player1.message}</p>}
                    {errors.set2Player2 && <p className="col-span-3 text-xs text-destructive mt-1">{errors.set2Player2.message}</p>}

                    {(watchedScores[0] !== null && watchedScores[1] !== null && watchedScores[0] !== watchedScores[1] &&
                      watchedScores[2] !== null && watchedScores[3] !== null && watchedScores[2] !== watchedScores[3] &&
                     ((watchedScores[0] > watchedScores[1] && watchedScores[2] < watchedScores[3]) || (watchedScores[0] < watchedScores[1] && watchedScores[2] > watchedScores[3]))
                    ) && (
                        <>
                            <Label htmlFor="set3Player1" className="self-center">Set 3 (Nếu có)</Label>
                            <Input id="set3Player1" type="number" {...register("set3Player1")} className="text-center" />
                            <Input id="set3Player2" type="number" {...register("set3Player2")} className="text-center" />
                        </>
                    )}
                </div>

                 <div>
                    <Label htmlFor="winnerId">Người thắng cuộc</Label>
                    <Controller
                        name="winnerId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="winnerId" className="mt-1">
                                    <SelectValue placeholder="Chọn người thắng cuộc" />
                                </SelectTrigger>
                                <SelectContent>
                                    {editingMatch.player1Id && <SelectItem value={editingMatch.player1Id}>{getPlayerName(editingMatch.player1Id)}</SelectItem>}
                                    {editingMatch.player2Id && <SelectItem value={editingMatch.player2Id}>{getPlayerName(editingMatch.player2Id)}</SelectItem>}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.winnerId && <p className="text-sm text-destructive mt-1">{errors.winnerId.message}</p>}
                </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsScoreFormOpen(false)}>Hủy</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/> Lưu Tỷ số</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
