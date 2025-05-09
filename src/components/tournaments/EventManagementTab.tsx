// src/components/tournaments/EventManagementTab.tsx
"use client";

import React, { useState } from 'react';
import type { Tournament, EventCategory } from "@/types";
import { useTournaments } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, Users, GitBranch } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { translateEventType, translateEventGender } from '@/lib/i18nUtils';

const eventCategorySchema = z.object({
  name: z.string().min(3, "Tên sự kiện là bắt buộc (VD: Đơn Nam U19)"),
  type: z.enum(["Singles", "Doubles"], { required_error: "Loại sự kiện là bắt buộc." }),
  gender: z.enum(["Men", "Women", "Mixed", "Any"], { required_error: "Giới tính là bắt buộc." }),
  ageGroup: z.string().optional(),
});

type EventCategoryFormData = z.infer<typeof eventCategorySchema>;

interface EventManagementTabProps {
  tournament: Tournament;
}

export function EventManagementTab({ tournament }: EventManagementTabProps) {
  const { addEventCategory, updateEventCategory, deleteEventCategory } = useTournaments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventCategory | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EventCategoryFormData>({
    resolver: zodResolver(eventCategorySchema),
    defaultValues: { type: "Singles", gender: "Any" }
  });

  const openEditForm = (event: EventCategory) => {
    reset({ name: event.name, type: event.type, gender: event.gender, ageGroup: event.ageGroup });
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    reset({ name: "", type: "Singles", gender: "Any", ageGroup: "" });
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const onSubmit = (data: EventCategoryFormData) => {
    if (editingEvent) {
      updateEventCategory(tournament.id, editingEvent.id, data);
      toast({ title: "Sự kiện đã được cập nhật", description: `Sự kiện "${data.name}" đã được cập nhật.` });
    } else {
      addEventCategory(tournament.id, data);
      toast({ title: "Sự kiện đã được thêm", description: `Sự kiện "${data.name}" đã được thêm.` });
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string, eventName: string) => {
    deleteEventCategory(tournament.id, eventId);
    toast({ title: "Sự kiện đã được xóa", description: `Sự kiện "${eventName}" đã được xóa.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Hạng mục Sự kiện</h2>
        <Button onClick={openNewForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm Hạng mục Sự kiện
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Chỉnh sửa Hạng mục Sự kiện" : "Thêm Hạng mục Sự kiện Mới"}</DialogTitle>
            <DialogDescription>
              Xác định chi tiết cho hạng mục sự kiện này trong giải đấu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Tên Sự kiện</Label>
              <Input id="name" {...register("name")} placeholder="VD: Đơn Nam U19" className="mt-1"/>
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Loại</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="type" className="mt-1">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Singles">Đơn</SelectItem>
                        <SelectItem value="Doubles">Đôi</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Men">Nam</SelectItem>
                        <SelectItem value="Women">Nữ</SelectItem>
                        <SelectItem value="Mixed">Hỗn hợp</SelectItem>
                        <SelectItem value="Any">Bất kỳ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="ageGroup">Nhóm tuổi (Tùy chọn)</Label>
              <Input id="ageGroup" {...register("ageGroup")} placeholder="VD: U19, Masters 40+" className="mt-1"/>
              {errors.ageGroup && <p className="text-sm text-destructive mt-1">{errors.ageGroup.message}</p>}
            </div>

            <DialogFooter>
              <Button type="submit">{editingEvent ? "Cập nhật Sự kiện" : "Thêm Sự kiện"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {tournament.eventCategories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Chưa có Hạng mục Sự kiện nào</CardTitle>
            <CardDescription>Thêm các hạng mục sự kiện để xác định các cuộc thi trong giải đấu.</CardDescription>
          </CardHeader>
          <CardContent>
            Nhấp vào "Thêm Hạng mục Sự kiện" để bắt đầu.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tournament.eventCategories.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{event.name}</CardTitle>
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEditForm(event)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id, event.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Loại: {translateEventType(event.type)}, Giới tính: {translateEventGender(event.gender)}, Nhóm tuổi: {event.ageGroup || "Bất kỳ"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {event.players.length} Vận động viên
                  </span>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/dashboard/tournaments/${tournament.id}/manage/events/${event.id}`}>
                        <Users className="mr-2 h-4 w-4" /> Quản lý Vận động viên
                    </Link>
                  </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
