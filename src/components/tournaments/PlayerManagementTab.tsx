// src/components/tournaments/PlayerManagementTab.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Tournament, EventCategory, Player } from "@/types";
import { useTournaments } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit3, Trash2, Users, ListFilter, ArrowUpDown, Star } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '../ui/checkbox';
import { translateEventGender, translateEventType } from '@/lib/i18nUtils';

const playerSchema = z.object({
  name: z.string().min(2, "Tên vận động viên là bắt buộc."),
  club: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dateOfBirth: z.string().optional(), // Consider using a date picker if more validation is needed
  seedNumber: z.coerce.number().int().min(0, "Hạt giống phải là số không âm.").optional(),
});

type PlayerFormData = z.infer<typeof playerSchema>;

interface PlayerManagementTabProps {
  tournament: Tournament;
}

export function PlayerManagementTab({ tournament }: PlayerManagementTabProps) {
  const { 
    addPlayerToEvent, 
    removePlayerFromEvent, 
    updatePlayerInEvent, 
    updateEventCategory,
    getEventCategoryById 
  } = useTournaments();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
  });

  useEffect(() => {
    const eventIdFromQuery = searchParams.get('eventId');
    if (eventIdFromQuery && tournament.eventCategories.some(ec => ec.id === eventIdFromQuery)) {
      setSelectedEventId(eventIdFromQuery);
    } else if (tournament.eventCategories.length > 0) {
      setSelectedEventId(tournament.eventCategories[0].id);
    }
  }, [searchParams, tournament.eventCategories]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return getEventCategoryById(tournament.id, selectedEventId) || null;
  }, [selectedEventId, tournament.id, getEventCategoryById]);

  const openNewPlayerForm = () => {
    reset({ name: "", club: "", seedNumber: 0 });
    setEditingPlayer(null);
    setIsPlayerFormOpen(true);
  };

  const openEditPlayerForm = (player: Player) => {
    reset({ 
      name: player.name, 
      club: player.club, 
      gender: player.gender, 
      dateOfBirth: player.dateOfBirth, 
      seedNumber: player.seedNumber || 0,
    });
    setEditingPlayer(player);
    setIsPlayerFormOpen(true);
  };

  const onPlayerSubmit = (data: PlayerFormData) => {
    if (!selectedEventId) return;

    const playerData: Omit<Player, 'id'> = {
        name: data.name,
        club: data.club,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        seedNumber: data.seedNumber && data.seedNumber > 0 ? data.seedNumber : undefined,
    };

    if (editingPlayer) {
      updatePlayerInEvent(tournament.id, selectedEventId, editingPlayer.id, playerData);
      toast({ title: "Vận động viên được cập nhật", description: `Vận động viên "${data.name}" đã được cập nhật.` });
    } else {
      addPlayerToEvent(tournament.id, selectedEventId, playerData);
      toast({ title: "Vận động viên được thêm", description: `Vận động viên "${data.name}" đã được thêm.` });
    }
    setIsPlayerFormOpen(false);
    setEditingPlayer(null);
  };

  const handlePlayerDelete = (playerId: string, playerName: string) => {
    if (!selectedEventId) return;
    removePlayerFromEvent(tournament.id, selectedEventId, playerId);
    toast({ title: "Vận động viên đã bị xóa", description: `Vận động viên "${playerName}" đã bị xóa.`, variant: "destructive" });
  };
  
  const handleSeedChange = (playerId: string, seedNum?: number) => {
    if (!selectedEventId) return;
    updatePlayerInEvent(tournament.id, selectedEventId, playerId, { seedNumber: seedNum });
    
    const player = selectedEvent?.players.find(p => p.id === playerId);
    if (player) {
        const currentEvent = getEventCategoryById(tournament.id, selectedEventId);
        if (currentEvent) {
            let updatedSeeds = [...currentEvent.seeds];
            if (seedNum && seedNum > 0) {
                if (!updatedSeeds.includes(playerId)) updatedSeeds.push(playerId);
            } else {
                updatedSeeds = updatedSeeds.filter(id => id !== playerId);
            }
            updateEventCategory(tournament.id, selectedEventId, { seeds: updatedSeeds });
        }
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Vận động viên</CardTitle>
          <CardDescription>Thêm, chỉnh sửa, hoặc xóa vận động viên cho các hạng mục sự kiện.</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.eventCategories.length === 0 ? (
            <p>Không có hạng mục sự kiện nào trong giải đấu này. Vui lòng thêm hạng mục sự kiện trước.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-select">Chọn Hạng mục Sự kiện</Label>
                <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
                  <SelectTrigger id="event-select" className="mt-1">
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
                <>
                  <div className="flex justify-between items-center mt-4">
                    <h3 className="text-xl font-semibold">{selectedEvent.name} - Danh sách Vận động viên</h3>
                    <Button onClick={openNewPlayerForm} disabled={selectedEvent.drawGenerated}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Thêm Vận động viên
                    </Button>
                  </div>
                  {selectedEvent.drawGenerated && (
                    <p className="text-sm text-destructive">Nhánh đấu đã được tạo. Không thể thêm/xóa vận động viên.</p>
                  )}

                  {selectedEvent.players.length === 0 ? (
                    <p className="text-muted-foreground mt-2">Chưa có vận động viên nào trong hạng mục này.</p>
                  ) : (
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên</TableHead>
                          <TableHead>CLB</TableHead>
                          <TableHead className="w-[100px] text-center">Hạt giống</TableHead>
                          <TableHead className="text-right w-[120px]">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.players.map(player => (
                          <TableRow key={player.id}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.club || 'N/A'}</TableCell>
                            <TableCell className="text-center">
                                <Input 
                                    type="number"
                                    min="0"
                                    value={player.seedNumber || ""}
                                    onChange={(e) => handleSeedChange(player.id, e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-16 mx-auto h-8 text-sm text-center"
                                    disabled={selectedEvent.drawGenerated}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openEditPlayerForm(player)} disabled={selectedEvent.drawGenerated}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePlayerDelete(player.id, player.name)} disabled={selectedEvent.drawGenerated}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPlayerFormOpen} onOpenChange={setIsPlayerFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingPlayer ? "Chỉnh sửa Vận động viên" : "Thêm Vận động viên Mới"}</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết cho vận động viên.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onPlayerSubmit)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Tên Vận động viên</Label>
              <Input id="name" {...register("name")} placeholder="Nguyễn Văn A" className="mt-1"/>
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="club">CLB (Tùy chọn)</Label>
              <Input id="club" {...register("club")} placeholder="CLB Cầu lông XYZ" className="mt-1"/>
            </div>
             <div>
              <Label htmlFor="seedNumber">Hạt giống (0 nếu không)</Label>
              <Input id="seedNumber" type="number" min="0" {...register("seedNumber")} placeholder="0" className="mt-1"/>
               {errors.seedNumber && <p className="text-sm text-destructive mt-1">{errors.seedNumber.message}</p>}
            </div>
            {/* Add fields for gender, dateOfBirth if needed, using Controller for Select or Calendar */}
            <DialogFooter>
              <Button type="submit">{editingPlayer ? "Cập nhật" : "Thêm Vận động viên"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
