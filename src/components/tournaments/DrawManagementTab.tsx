// src/components/tournaments/DrawManagementTab.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Tournament, EventCategory, Match, Player } from "@/types";
import { useTournaments } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitFork, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { translateEventGender, translateEventType, translateMatchStatus } from '@/lib/i18nUtils';

interface DrawManagementTabProps {
  tournament: Tournament;
}

export function DrawManagementTab({ tournament }: DrawManagementTabProps) {
  const { generateKnockoutDraw, getEventCategoryById } = useTournaments();
  const { toast } = useToast();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (tournament.eventCategories.length > 0) {
      setSelectedEventId(tournament.eventCategories[0].id);
    }
  }, [tournament.eventCategories]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    // Tournament object might be stale here if not re-fetched or context not perfectly synced.
    // For this example, assume `getTournamentById` from context returns the latest.
    const currentTournament = useTournaments().getTournamentById(tournament.id);
    return currentTournament?.eventCategories.find(ec => ec.id === selectedEventId) || null;
  }, [selectedEventId, tournament.id, useTournaments().getTournamentById]);

  const handleGenerateDraw = () => {
    if (!selectedEventId) return;
    if ((selectedEvent?.players.length || 0) < 2) {
        toast({ title: "Không đủ Vận động viên", description: "Cần ít nhất 2 vận động viên để tạo nhánh đấu.", variant: "destructive"});
        return;
    }
    generateKnockoutDraw(tournament.id, selectedEventId);
    toast({ title: "Nhánh đấu đã được tạo", description: `Nhánh đấu cho ${selectedEvent?.name} đã được tạo thành công.` });
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
          <CardTitle>Quản lý Nhánh đấu</CardTitle>
          <CardDescription>Tạo và xem nhánh đấu cho các hạng mục sự kiện.</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.eventCategories.length === 0 ? (
            <p>Không có hạng mục sự kiện nào. Vui lòng thêm hạng mục sự kiện trước.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-select-draw">Chọn Hạng mục Sự kiện</Label>
                <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
                  <SelectTrigger id="event-select-draw" className="mt-1">
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Nhánh đấu cho: {selectedEvent.name}</h3>
                    {!selectedEvent.drawGenerated ? (
                      <Button onClick={handleGenerateDraw} disabled={(selectedEvent.players.length || 0) < 2}>
                        <GitFork className="mr-2 h-4 w-4" /> Tạo Nhánh đấu
                      </Button>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        <span>Nhánh đấu đã được tạo</span>
                      </div>
                    )}
                  </div>
                  
                  {(selectedEvent.players.length || 0) < 2 && !selectedEvent.drawGenerated && (
                     <p className="text-sm text-yellow-600 flex items-center"><AlertTriangle className="h-4 w-4 mr-2"/> Cần ít nhất 2 VĐV để tạo nhánh đấu.</p>
                  )}

                  {selectedEvent.matches.length === 0 && selectedEvent.drawGenerated && (
                    <p className="text-muted-foreground">Không có trận đấu nào được tạo (có thể do không đủ VĐV).</p>
                  )}
                  
                  {selectedEvent.matches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Danh sách Trận đấu (Vòng 1)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Trận số</TableHead>
                              <TableHead>Vận động viên 1</TableHead>
                              <TableHead>Vận động viên 2</TableHead>
                              <TableHead>Tỷ số</TableHead>
                              <TableHead>Trạng thái</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEvent.matches
                               .filter(match => match.round === 1)
                               .sort((a,b) => a.matchNumber - b.matchNumber)
                               .map(match => (
                              <TableRow key={match.id}>
                                <TableCell>{match.matchNumber}</TableCell>
                                <TableCell className={match.winnerId === match.player1Id ? 'font-bold' : ''}>{getPlayerName(match.player1Id)}</TableCell>
                                <TableCell className={match.winnerId === match.player2Id ? 'font-bold' : ''}>{getPlayerName(match.player2Id)}</TableCell>
                                <TableCell>
                                  {match.score ? 
                                    `${match.score.set1Player1}-${match.score.set1Player2}, ${match.score.set2Player1}-${match.score.set2Player2}` +
                                    (match.score.set3Player1 !== undefined ? `, ${match.score.set3Player1}-${match.score.set3Player2}` : '')
                                    : 'Chưa có'}
                                </TableCell>
                                <TableCell>{translateMatchStatus(match.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                  {/* TODO: Add visualization for bracket if desired */}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Basic Label component if not already globally available or imported from ui
const Label = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-gray-700 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";
