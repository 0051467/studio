// src/app/dashboard/tournaments/[id]/manage/page.tsx
"use client";
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ManageTournamentBasePage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (tournamentId) {
      router.replace(`/dashboard/tournaments/${tournamentId}/manage/overview`);
    }
  }, [router, tournamentId]);

  return null; // Or a loading state
}
