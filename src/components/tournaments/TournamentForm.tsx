// src/components/tournaments/TournamentForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tournament } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const tournamentFormSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters."),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
  venuesInput: z.string().min(3, "Venue name is required."), // Simplified: single venue name
  organizerName: z.string().min(2, "Organizer name is required."),
  organizerContact: z.string().optional(),
  prizeMoney: z.string().optional(),
  level: z.string().optional(),
  entryDeadline: z.date().optional(),
  posterUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  websiteUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  socialMediaUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

interface TournamentFormProps {
  tournament?: Tournament; // For editing
  onSubmit: (data: TournamentFormValues) => void;
  submitButtonText?: string;
}

export function TournamentForm({ tournament, onSubmit, submitButtonText = "Create Tournament" }: TournamentFormProps) {
  const { toast } = useToast();
  const defaultValues: Partial<TournamentFormValues> = tournament 
    ? {
        ...tournament,
        startDate: new Date(tournament.startDate),
        endDate: new Date(tournament.endDate),
        venuesInput: tournament.venues[0]?.name || "", // Simplified
        entryDeadline: tournament.entryDeadline ? new Date(tournament.entryDeadline) : undefined,
      } 
    : {
      posterUrl: '', // Ensure empty strings for optional URL fields if not provided
      websiteUrl: '',
      socialMediaUrl: '',
    };

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function handleFormSubmit(data: TournamentFormValues) {
    onSubmit(data);
    toast({
      title: tournament ? "Tournament Updated!" : "Tournament Created!",
      description: `"${data.name}" has been successfully ${tournament ? 'updated' : 'created'}.`,
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{tournament ? "Edit Tournament" : "Create New Tournament"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Yonex Taipei Open 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="venuesInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Stadium" {...field} />
                  </FormControl>
                  <FormDescription>Primary venue. More can be added in advanced settings.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., City Badminton Association" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="organizerContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Contact (Email/Phone)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="prizeMoney"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prize Money (Overall)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., $10,000 USD" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tournament Level/Type</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., National, BWF Grade 3" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="entryDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Entry Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date (Optional)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Poster/Banner URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/poster.jpg" {...field} data-ai-hint="tournament poster" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/tournament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialMediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/tournament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
