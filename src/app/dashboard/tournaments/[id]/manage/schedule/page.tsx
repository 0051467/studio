// src/app/dashboard/tournaments/[id]/manage/schedule/page.tsx
"use client";

import { ScheduleManagementTab } from "@/components/tournaments/ScheduleManagementTab";
import { useTournaments } from "@/contexts/TournamentContext";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tournament } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentSchedulePage() {
  const params = useParams();
  const { getTournamentById } = useTournaments();
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const tournamentId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (tournamentId) {
      const foundTournament = getTournamentById(tournamentId);
      setTournament(foundTournament);
    }
    setLoading(false);
  }, [tournamentId, getTournamentById]);

  if (loading) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />;
  }

  if (!tournament) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không tìm thấy Giải đấu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không thể tải chi tiết giải đấu để quản lý lịch thi đấu.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <ScheduleManagementTab tournament={tournament} />;
}
