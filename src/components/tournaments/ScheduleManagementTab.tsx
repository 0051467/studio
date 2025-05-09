// src/components/tournaments/ScheduleManagementTab.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Tournament, EventCategory, Match, Player } from "@/types";
import { useTournaments } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Edit3, Save, Clock } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { translateEventGender, translateEventType, translateMatchStatus } from '@/lib/i18nUtils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';


const scheduleSchema = z.object({
  startTimeDate: z.date().optional().nullable(),
  startTimeHour: z.string().regex(/^([01]\d|2[0-3])$/, "Giờ không hợp lệ").optional().nullable(),
  startTimeMinute: z.string().regex(/^[0-5]\d$/, "Phút không hợp lệ").optional().nullable(),
  court: z.string().optional().nullable(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleManagementTabProps {
  tournament: Tournament;
}

export function ScheduleManagementTab({ tournament }: ScheduleManagementTabProps) {
  const { updateMatchDetails, getEventCategoryById } = useTournaments();
  const { toast } = useToast();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

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

  const openScheduleForm = (match: Match) => {
    setEditingMatch(match);
    let initialDate = null;
    let initialHour = "";
    let initialMinute = "";

    if (match.startTime) {
        try {
            const parsedDate = parseISO(match.startTime);
            initialDate = parsedDate;
            initialHour = format(parsedDate, "HH");
            initialMinute = format(parsedDate, "mm");
        } catch (e) {
            console.error("Lỗi phân tích ngày giờ:", e);
        }
    }

    reset({
      startTimeDate: initialDate,
      startTimeHour: initialHour,
      startTimeMinute: initialMinute,
      court: match.court || "",
    });
    setIsScheduleFormOpen(true);
  };

  const onScheduleSubmit = (data: ScheduleFormData) => {
    if (!selectedEventId || !editingMatch) return;
    
    let newStartTimeISO: string | undefined = undefined;
    if (data.startTimeDate && data.startTimeHour && data.startTimeMinute) {
        const year = data.startTimeDate.getFullYear();
        const month = data.startTimeDate.getMonth();
        const day = data.startTimeDate.getDate();
        const hour = parseInt(data.startTimeHour, 10);
        const minute = parseInt(data.startTimeMinute, 10);
        newStartTimeISO = new Date(year, month, day, hour, minute).toISOString();
    }


    updateMatchDetails(tournament.id, selectedEventId, editingMatch.id, {
      startTime: newStartTimeISO,
      court: data.court || undefined,
    });
    toast({ title: "Lịch thi đấu đã được cập nhật", description: `Lịch thi đấu cho trận đã được cập nhật.` });
    setIsScheduleFormOpen(false);
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
          <CardTitle>Quản lý Lịch thi đấu</CardTitle>
          <CardDescription>Xếp lịch và sân cho các trận đấu.</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.eventCategories.length === 0 ? (
            <p>Không có hạng mục sự kiện nào. Vui lòng thêm hạng mục sự kiện trước.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-select-schedule">Chọn Hạng mục Sự kiện</Label>
                <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
                  <SelectTrigger id="event-select-schedule" className="mt-1">
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
                  <h3 className="text-xl font-semibold">Lịch thi đấu cho: {selectedEvent.name}</h3>
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
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Sân</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.matches.filter(m => !m.isBye).map(match => (
                          <TableRow key={match.id}>
                            <TableCell>R{match.round}-{match.matchNumber}</TableCell>
                            <TableCell>{getPlayerName(match.player1Id)}</TableCell>
                            <TableCell>{getPlayerName(match.player2Id)}</TableCell>
                            <TableCell>
                              {match.startTime ? format(parseISO(match.startTime), "Pp", { locale: vi }) : 'Chưa xếp lịch'}
                            </TableCell>
                            <TableCell>{match.court || 'Chưa xếp sân'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => openScheduleForm(match)}>
                                <Edit3 className="mr-2 h-4 w-4" /> Xếp lịch
                              </Button>
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

      <Dialog open={isScheduleFormOpen} onOpenChange={setIsScheduleFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xếp lịch cho Trận đấu</DialogTitle>
             {editingMatch && (
                <DialogDescription>
                    Vòng {editingMatch.round} - Trận {editingMatch.matchNumber}: {getPlayerName(editingMatch.player1Id)} vs {getPlayerName(editingMatch.player2Id)}
                </DialogDescription>
            )}
          </DialogHeader>
          {editingMatch && (
            <form onSubmit={handleSubmit(onScheduleSubmit)} className="space-y-6 py-4">
                <div>
                    <Label>Ngày thi đấu</Label>
                    <Controller
                        name="startTimeDate"
                        control={control}
                        render={({ field }) => (
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal mt-1",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="startTimeHour">Giờ (HH)</Label>
                        <Input id="startTimeHour" type="text" placeholder="VD: 09" {...register("startTimeHour")} className="mt-1"/>
                        {errors.startTimeHour && <p className="text-sm text-destructive mt-1">{errors.startTimeHour.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="startTimeMinute">Phút (mm)</Label>
                        <Input id="startTimeMinute" type="text" placeholder="VD: 30" {...register("startTimeMinute")} className="mt-1"/>
                        {errors.startTimeMinute && <p className="text-sm text-destructive mt-1">{errors.startTimeMinute.message}</p>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="court">Sân thi đấu (Tùy chọn)</Label>
                    <Input id="court" {...register("court")} placeholder="VD: Sân 1" className="mt-1"/>
                </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsScheduleFormOpen(false)}>Hủy</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/> Lưu Lịch</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
