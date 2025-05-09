// src/components/tournaments/TournamentOverviewTab.tsx
"use client";

import type { Tournament, TournamentStatus } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTournaments } from "@/contexts/TournamentContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, DollarSign, Award, Edit, BarChart3, Link as LinkIconLucide } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from 'date-fns/locale';
import { translateTournamentStatus } from "@/lib/i18nUtils";


interface TournamentOverviewTabProps {
  tournament: Tournament;
}

export function TournamentOverviewTab({ tournament }: TournamentOverviewTabProps) {
  const { updateTournament } = useTournaments();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: TournamentStatus) => {
    updateTournament(tournament.id, { status: newStatus });
    const translatedStatus = translateTournamentStatus(newStatus);
    toast({
        title: "Trạng thái đã được cập nhật",
        description: `Trạng thái giải đấu "${tournament.name}" đã được thay đổi thành ${translatedStatus}.`,
    });
  };
  
  const detailItem = (IconComponent: React.ElementType, label: string, value?: string | number | null, isDate?: boolean, isLink?: boolean) => {
    if (!value && value !== 0) return null;
    
    let displayValue: React.ReactNode = String(value);
    if (isDate && typeof value === 'string') {
      try {
        displayValue = format(new Date(value), "PPP", { locale: vi });
      } catch (e) {
        displayValue = "Ngày không hợp lệ";
      }
    } else if (isLink && typeof value === 'string') {
        displayValue = <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{value}</a>;
    }


    return (
        <div className="flex items-start space-x-3">
            <IconComponent className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{displayValue}</p>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
        <Card className="overflow-hidden shadow-lg">
            {tournament.posterUrl && (
                 <div className="relative w-full h-60 bg-muted">
                    <Image 
                        src={tournament.posterUrl} 
                        alt={`Áp phích ${tournament.name}`} 
                        layout="fill" 
                        objectFit="cover"
                        data-ai-hint="tournament poster"
                    />
                 </div>
            )}
            <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <CardTitle className="text-2xl">{tournament.name}</CardTitle>
                        <CardDescription>Tổ chức bởi {tournament.organizerName}</CardDescription>
                    </div>
                     <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/tournaments/${tournament.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa Chi tiết
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {detailItem(Calendar, "Ngày", `${format(new Date(tournament.startDate), "PPP", { locale: vi })} - ${format(new Date(tournament.endDate), "PPP", { locale: vi })}`)}
                {tournament.venues.map(venue => detailItem(MapPin, `Địa điểm: ${venue.name}`, venue.address, false))}
                {detailItem(Users, "Tổng số Người tham gia", tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0))}
                {detailItem(DollarSign, "Tiền thưởng", tournament.prizeMoney)}
                {detailItem(Award, "Cấp độ/Loại", tournament.level)}
                {detailItem(Calendar, "Hạn chót Đăng ký", tournament.entryDeadline, true)}
                
                <div className="flex items-start space-x-3">
                     <BarChart3 className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                     <div>
                        <p className="text-sm font-medium text-foreground">Trạng thái</p>
                        <Select value={tournament.status} onValueChange={(value: TournamentStatus) => handleStatusChange(value)}>
                            <SelectTrigger className="w-[180px] mt-1">
                                <SelectValue placeholder="Đặt trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Bản nháp</SelectItem>
                                <SelectItem value="Published">Đã công bố</SelectItem>
                                <SelectItem value="In Progress">Đang diễn ra</SelectItem>
                                <SelectItem value="Completed">Đã hoàn thành</SelectItem>
                                <SelectItem value="Canceled">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                {tournament.websiteUrl && detailItem(LinkIconLucide, "Trang web chính thức", tournament.websiteUrl, false, true)}
                {tournament.socialMediaUrl && detailItem(Users, "Mạng xã hội", tournament.socialMediaUrl, false, true)}

            </CardContent>
             <CardFooter className="border-t pt-6">
                <p className="text-xs text-muted-foreground">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
             </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.eventCategories.length}</p>
                    <p className="text-sm text-muted-foreground">Hạng mục Sự kiện</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0)}</p>
                    <p className="text-sm text-muted-foreground">Tổng Vận động viên</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                     <p className="text-2xl font-bold">{tournament.eventCategories.reduce((sum, ec) => sum + ec.matches.length, 0)}</p>
                    <p className="text-sm text-muted-foreground">Tổng Trận đấu</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.venues.reduce((sum, v) => sum + (v.numberOfCourts || 0), 0)}</p>
                    <p className="text-sm text-muted-foreground">Sân có sẵn</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
