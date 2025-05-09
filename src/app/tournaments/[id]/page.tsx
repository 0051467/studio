// src/app/tournaments/[id]/page.tsx
"use client";

import { useTournaments } from "@/contexts/TournamentContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import type { Tournament, EventCategory, Match } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Award, Trophy, ListChecks, Eye, ExternalLink, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { translateTournamentStatus, translateEventType, translateEventGender, translateMatchStatus } from "@/lib/i18nUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PublicTournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTournamentById } = useTournaments();
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const tournamentId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (tournamentId) {
      const foundTournament = getTournamentById(tournamentId);
      // Only show public-facing statuses
      if (foundTournament && ['Published', 'In Progress', 'Completed'].includes(foundTournament.status)) {
        setTournament(foundTournament);
      } else if (foundTournament) { // Tournament exists but not public
        setTournament(undefined); // Treat as not found for public
      }
    }
    setLoading(false);
  }, [tournamentId, getTournamentById]);
  
  const getPlayerNameFromEvent = (event: EventCategory, playerId?: string): string => {
    if (!playerId) return 'N/A';
    if (playerId.startsWith('bye-')) return 'MIỄN ĐẤU';
    const player = event.players.find(p => p.id === playerId);
    return player?.name || 'Không xác định';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showSidebarTrigger={false} />
        <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-8 w-1/3 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showSidebarTrigger={false} />
        <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Không tìm thấy Giải đấu</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Giải đấu bạn đang tìm kiếm không tồn tại, đang ở chế độ riêng tư hoặc đã bị xóa.</p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/tournaments"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Danh sách Giải đấu</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const detailItem = (IconComponent: React.ElementType, label: string, value?: string | number | null, isDate?: boolean, isLink?: boolean) => {
    if (!value && value !== 0) return null;
    let displayValue: React.ReactNode = String(value);
    if (isDate && typeof value === 'string') {
      try { displayValue = format(parseISO(value), "PPP", { locale: vi }); } 
      catch (e) { displayValue = "Ngày không hợp lệ"; }
    } else if (isLink && typeof value === 'string') {
        displayValue = <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all flex items-center">{value} <ExternalLink className="ml-1 h-3 w-3"/></a>;
    }
    return (
        <div className="flex items-start space-x-3">
            <IconComponent className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-sm text-muted-foreground">{displayValue}</p></div>
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSidebarTrigger={false} />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/tournaments"><ArrowLeft className="mr-2 h-4 w-4" /> Tất cả Giải đấu</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tournament Header and Poster */}
            <Card className="overflow-hidden shadow-lg">
              {tournament.posterUrl && (
                <div className="relative w-full h-72 bg-muted">
                  <Image src={tournament.posterUrl} alt={`Áp phích ${tournament.name}`} layout="fill" objectFit="cover" data-ai-hint="tournament poster event" />
                </div>
              )}
              <CardHeader className="border-b">
                <CardTitle className="text-3xl font-bold">{tournament.name}</CardTitle>
                <CardDescription>Tổ chức bởi {tournament.organizerName}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {detailItem(Calendar, "Thời gian", `${format(parseISO(tournament.startDate), "dd/MM/yy", { locale: vi })} - ${format(parseISO(tournament.endDate), "dd/MM/yyyy", { locale: vi })}`)}
                {tournament.venues.map(venue => detailItem(MapPin, `Địa điểm: ${venue.name}`, venue.address, false))}
                {detailItem(Users, "Tổng số VĐV (dự kiến)", tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0))}
                {detailItem(DollarSign, "Tiền thưởng", tournament.prizeMoney)}
                {detailItem(Award, "Cấp độ/Loại", tournament.level)}
                {detailItem(Calendar, "Hạn chót Đăng ký", tournament.entryDeadline, true)}
                 <div className="flex items-start space-x-3">
                    <Trophy className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div><p className="text-sm font-medium text-foreground">Trạng thái</p><p className="text-sm text-muted-foreground">{translateTournamentStatus(tournament.status)}</p></div>
                </div>
              </CardContent>
              {(tournament.websiteUrl || tournament.socialMediaUrl) && (
                <CardFooter className="border-t pt-4 flex flex-wrap gap-4">
                    {tournament.websiteUrl && detailItem(ExternalLink, "Trang web chính thức", tournament.websiteUrl, false, true)}
                    {tournament.socialMediaUrl && detailItem(Users, "Mạng xã hội", tournament.socialMediaUrl, false, true)}
                </CardFooter>
              )}
            </Card>

            {/* Event Categories and Draws/Matches */}
            <Card>
              <CardHeader>
                <CardTitle>Các Hạng mục Thi đấu</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.eventCategories.length === 0 ? (
                  <p className="text-muted-foreground">Chưa có hạng mục thi đấu nào được công bố.</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {tournament.eventCategories.map((event) => (
                      <AccordionItem value={event.id} key={event.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-primary" />
                            <span>{event.name} ({translateEventType(event.type)}, {translateEventGender(event.gender)}) - {event.players.length} VĐV</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pr-2">
                          {!event.drawGenerated ? (
                            <p className="text-sm text-muted-foreground py-4">Nhánh đấu cho hạng mục này chưa được công bố.</p>
                          ) : event.matches.length === 0 ? (
                             <p className="text-sm text-muted-foreground py-4">Chưa có trận đấu nào được tạo cho hạng mục này.</p>
                          ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="w-[80px]">Trận</TableHead>
                                    <TableHead>VĐV 1</TableHead>
                                    <TableHead>VĐV 2</TableHead>
                                    <TableHead>Tỷ số</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Sân</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {event.matches.filter(m => m.round === 1).sort((a,b)=> a.matchNumber-b.matchNumber).map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell>V1-{match.matchNumber}</TableCell>
                                        <TableCell className={match.winnerId === match.player1Id ? 'font-bold':''}>{getPlayerNameFromEvent(event, match.player1Id)}</TableCell>
                                        <TableCell className={match.winnerId === match.player2Id ? 'font-bold':''}>{getPlayerNameFromEvent(event, match.player2Id)}</TableCell>
                                        <TableCell>
                                        {match.score ? 
                                            `${match.score.set1Player1??'-'}-${match.score.set1Player2??'-'}, ${match.score.set2Player1??'-'}-${match.score.set2Player2??'-'}` +
                                            ((match.score.set3Player1 !== undefined && match.score.set3Player1 !== null) || (match.score.set3Player2 !== undefined && match.score.set3Player2 !== null) ? `, ${match.score.set3Player1??'-'}-${match.score.set3Player2??'-'}` : '')
                                            : (match.isBye ? 'MIỄN ĐẤU' : 'Chưa có')}
                                        </TableCell>
                                        <TableCell>{match.startTime ? format(parseISO(match.startTime), 'HH:mm dd/MM', {locale: vi}) : '-'}</TableCell>
                                        <TableCell>{match.court || '-'}</TableCell>
                                        <TableCell>{translateMatchStatus(match.status)}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                                {/* Placeholder for further rounds or full bracket view */}
                                {event.matches.some(m => m.round > 1) && <p className="text-sm text-muted-foreground mt-2">Hiển thị các vòng tiếp theo sẽ được thêm sau.</p>}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info - if any additional contextual info is needed */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle>Thông tin thêm</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Thông tin chi tiết về các nhà tài trợ, quy định giải đấu, hoặc các thông báo khác có thể được hiển thị ở đây.
                    </p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t mt-auto">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trình quản lý MatchPoint. Bảo lưu mọi quyền.
          </p>
        </div>
      </footer>
    </div>
  );
}

