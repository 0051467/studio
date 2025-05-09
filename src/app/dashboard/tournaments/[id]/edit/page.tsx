// src/app/dashboard/tournaments/[id]/edit/page.tsx
"use client";

import { TournamentForm } from "@/components/tournaments/TournamentForm";
import { useTournaments } from "@/contexts/TournamentContext";
import { useParams, useRouter } from "next/navigation";
import type { Tournament } from "@/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TournamentFormData = Omit<Tournament, 'id' | 'status' | 'eventCategories' | 'venues'> & { venuesInput: string };

export default function EditTournamentPage() {
  const { getTournamentById, updateTournament } = useTournaments();
  const router = useRouter();
  const params = useParams();
  const tournamentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournamentId) {
      const foundTournament = getTournamentById(tournamentId);
      setTournament(foundTournament);
    }
    setLoading(false);
  }, [tournamentId, getTournamentById]);

  const handleSubmit = (data: TournamentFormData) => {
    if (!tournamentId) return;
    
    const processedData = {
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      endDate: data.endDate.toISOString().split('T')[0],
      entryDeadline: data.entryDeadline ? data.entryDeadline.toISOString().split('T')[0] : undefined,
    };
    
    // Transform venuesInput back to venues array (simple case: one venue)
    const updatedTournamentData: Partial<Tournament> = {
        ...processedData,
        venues: [{ 
            id: tournament?.venues[0]?.id || uuidv4(), // Keep existing venue ID or generate new
            name: data.venuesInput, 
            address: tournament?.venues[0]?.address || '', // Preserve or add other venue fields
            numberOfCourts: tournament?.venues[0]?.numberOfCourts || 0 
        }],
    };
    // Remove venuesInput as it's not part of Tournament type
    delete (updatedTournamentData as any).venuesInput;


    updateTournament(tournamentId, updatedTournamentData);
    router.push(`/dashboard/tournaments/${tournamentId}/manage/overview`);
  };

  if (loading) {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (!tournament) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Không tìm thấy Giải đấu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không thể tải chi tiết giải đấu để chỉnh sửa.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <TournamentForm tournament={tournament} onSubmit={handleSubmit} submitButtonText="Cập nhật Giải đấu" />
    </div>
  );
}

// Helper, ideally in a utils file if used elsewhere
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
