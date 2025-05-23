// src/app/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournaments } from "@/contexts/TournamentContext";
import { PlusCircle, Edit3, Trash2, Eye, Calendar, Users, MapPin } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { translateTournamentStatus } from "@/lib/i18nUtils";


export default function DashboardPage() {
  const { tournaments, deleteTournament } = useTournaments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Giải đấu của tôi</h1>
        <Button asChild>
          <Link href="/dashboard/tournaments/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo Giải đấu Mới
          </Link>
        </Button>
      </div>

      {tournaments.length === 0 ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Chưa có giải đấu nào!</CardTitle>
            <CardDescription>Bắt đầu bằng cách tạo giải đấu đầu tiên của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/tournaments/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Tạo Giải đấu Mới
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                    tournament.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                    tournament.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    tournament.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700' /* Canceled */
                  }`}>{translateTournamentStatus(tournament.status)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/tournaments/${tournament.id}/manage/overview`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Quản lý
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/tournaments/${tournament.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" /> Xem công khai
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn giải đấu "{tournament.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTournament(tournament.id)}>
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
