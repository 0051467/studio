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

const eventCategorySchema = z.object({
  name: z.string().min(3, "Event name is required (e.g., Men's Singles U19)"),
  type: z.enum(["Singles", "Doubles"], { required_error: "Event type is required." }),
  gender: z.enum(["Men", "Women", "Mixed", "Any"], { required_error: "Gender is required." }),
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
      toast({ title: "Event Updated", description: `Event "${data.name}" has been updated.` });
    } else {
      addEventCategory(tournament.id, data);
      toast({ title: "Event Added", description: `Event "${data.name}" has been added.` });
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string, eventName: string) => {
    deleteEventCategory(tournament.id, eventId);
    toast({ title: "Event Deleted", description: `Event "${eventName}" has been deleted.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Event Categories</h2>
        <Button onClick={openNewForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Event Category
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event Category" : "Add New Event Category"}</DialogTitle>
            <DialogDescription>
              Define the details for this event category within the tournament.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g., Men's Singles U19" className="mt-1"/>
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="type" className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Singles">Singles</SelectItem>
                        <SelectItem value="Doubles">Doubles</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                        <SelectItem value="Any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="ageGroup">Age Group (Optional)</Label>
              <Input id="ageGroup" {...register("ageGroup")} placeholder="e.g., U19, Masters 40+" className="mt-1"/>
              {errors.ageGroup && <p className="text-sm text-destructive mt-1">{errors.ageGroup.message}</p>}
            </div>

            <DialogFooter>
              <Button type="submit">{editingEvent ? "Update Event" : "Add Event"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {tournament.eventCategories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Event Categories Yet</CardTitle>
            <CardDescription>Add event categories to define the competitions within the tournament.</CardDescription>
          </CardHeader>
          <CardContent>
            Click "Add Event Category" to get started.
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
                  Type: {event.type}, Gender: {event.gender}, Age Group: {event.ageGroup || "Any"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {event.players.length} Players
                  </span>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/dashboard/tournaments/${tournament.id}/manage/events/${event.id}`}>
                        <Users className="mr-2 h-4 w-4" /> Manage Players
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
