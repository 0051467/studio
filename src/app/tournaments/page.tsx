// src/app/tournaments/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournaments } from "@/contexts/TournamentContext";
import { Calendar, MapPin, Users, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { translateTournamentStatus } from "@/lib/i18nUtils";

export default function PublicTournamentsPage() {
  const { tournaments } = useTournaments();
  const publicTournaments = tournaments.filter(t => t.status === 'Published' || t.status === 'In Progress' || t.status === 'Completed');

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSidebarTrigger={false} />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Các Giải đấu Công khai</h1>

        {publicTournaments.length === 0 ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Không có giải đấu nào đang diễn ra hoặc sắp tới.</CardTitle>
              <CardDescription>Vui lòng kiểm tra lại sau!</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicTournaments.map((tournament) => (
              <Card key={tournament.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                {tournament.posterUrl && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={tournament.posterUrl} 
                      alt={`Áp phích ${tournament.name}`} 
                      layout="fill" 
                      objectFit="cover" 
                      className="rounded-t-lg"
                      data-ai-hint="tournament poster event" 
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" /> {tournament.venues[0]?.name || 'Địa điểm chưa xác định'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(tournament.startDate).toLocaleDateString('vi-VN')} - {new Date(tournament.endDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0)} VĐV</span>
                  </div>
                  <div className="text-sm">
                    Trạng thái: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tournament.status === 'Published' ? 'bg-green-100 text-green-700' : 
                      tournament.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      tournament.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700' // Fallback for other statuses
                    }`}>{translateTournamentStatus(tournament.status)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/tournaments/${tournament.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> Xem Chi tiết Giải đấu
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
