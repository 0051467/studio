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
import { vi } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

const tournamentFormSchema = z.object({
  name: z.string().min(3, "Tên giải đấu phải có ít nhất 3 ký tự."),
  startDate: z.date({ required_error: "Ngày bắt đầu là bắt buộc."}),
  endDate: z.date({ required_error: "Ngày kết thúc là bắt buộc."}),
  venuesInput: z.string().min(3, "Tên địa điểm là bắt buộc."), 
  organizerName: z.string().min(2, "Tên ban tổ chức là bắt buộc."),
  organizerContact: z.string().optional(),
  prizeMoney: z.string().optional(),
  level: z.string().optional(),
  entryDeadline: z.date().optional(),
  posterUrl: z.string().url("Phải là một URL hợp lệ.").optional().or(z.literal('')),
  websiteUrl: z.string().url("Phải là một URL hợp lệ.").optional().or(z.literal('')),
  socialMediaUrl: z.string().url("Phải là một URL hợp lệ.").optional().or(z.literal('')),
}).refine(data => data.endDate >= data.startDate, {
  message: "Ngày kết thúc không thể trước ngày bắt đầu.",
  path: ["endDate"],
});

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

interface TournamentFormProps {
  tournament?: Tournament; 
  onSubmit: (data: TournamentFormValues) => void;
  submitButtonText?: string;
}

export function TournamentForm({ tournament, onSubmit, submitButtonText = "Tạo Giải đấu" }: TournamentFormProps) {
  const { toast } = useToast();
  const defaultValues: Partial<TournamentFormValues> = tournament 
    ? {
        ...tournament,
        startDate: new Date(tournament.startDate),
        endDate: new Date(tournament.endDate),
        venuesInput: tournament.venues[0]?.name || "", 
        entryDeadline: tournament.entryDeadline ? new Date(tournament.entryDeadline) : undefined,
      } 
    : {
      posterUrl: '', 
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
      title: tournament ? "Giải đấu đã được cập nhật!" : "Giải đấu đã được tạo!",
      description: `"${data.name}" đã được ${tournament ? 'cập nhật' : 'tạo'} thành công.`,
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{tournament ? "Chỉnh sửa Giải đấu" : "Tạo Giải đấu Mới"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Giải đấu</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Giải Yonex Đài Bắc Mở rộng 2025" {...field} />
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
                    <FormLabel>Ngày Bắt đầu</FormLabel>
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
                              format(field.value, "PPP", { locale: vi })
                            ) : (
                              <span>Chọn một ngày</span>
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
                          locale={vi}
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
                    <FormLabel>Ngày Kết thúc</FormLabel>
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
                              format(field.value, "PPP", { locale: vi })
                            ) : (
                              <span>Chọn một ngày</span>
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
                          locale={vi}
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
                  <FormLabel>Tên Địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Sân vận động Quốc gia" {...field} />
                  </FormControl>
                  <FormDescription>Địa điểm chính. Có thể thêm nhiều hơn trong cài đặt nâng cao.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Ban tổ chức</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Hiệp hội Cầu lông Thành phố" {...field} />
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
                  <FormLabel>Liên hệ Ban tổ chức (Email/Điện thoại)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: contact@example.com" {...field} />
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
                    <FormLabel>Tổng Giải thưởng</FormLabel>
                    <FormControl>
                        <Input placeholder="VD: 10,000 USD" {...field} />
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
                    <FormLabel>Cấp độ/Loại Giải đấu</FormLabel>
                    <FormControl>
                        <Input placeholder="VD: Quốc gia, BWF Cấp độ 3" {...field} />
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
                  <FormLabel>Hạn chót Đăng ký</FormLabel>
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
                            format(field.value, "PPP", { locale: vi })
                          ) : (
                            <span>Chọn một ngày (Tùy chọn)</span>
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
                        locale={vi}
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
                  <FormLabel>URL Áp phích/Banner Giải đấu</FormLabel>
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
                  <FormLabel>URL Trang web Chính thức</FormLabel>
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
                  <FormLabel>Liên kết Mạng xã hội</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/tournament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Đang lưu..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
