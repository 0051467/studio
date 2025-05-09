// src/app/dashboard/tournaments/new/page.tsx
"use client";

import { TournamentForm } from "@/components/tournaments/TournamentForm";
import { useTournaments } from "@/contexts/TournamentContext";
import { useRouter } from "next/navigation"; // Corrected import
import type { Tournament } from "@/types";

// Define the type for form data, aligning with TournamentForm's expected input
type TournamentFormData = Omit<Tournament, 'id' | 'status' | 'eventCategories' | 'venues'> & { venuesInput: string };


export default function NewTournamentPage() {
  const { addTournament } = useTournaments();
  const router = useRouter();

  const handleSubmit = (data: TournamentFormData) => {
    // Convert dates to string format if they are Date objects
    const processedData = {
      ...data,
      startDate: data.startDate.toISOString().split('T')[0], // YYYY-MM-DD
      endDate: data.endDate.toISOString().split('T')[0], // YYYY-MM-DD
      entryDeadline: data.entryDeadline ? data.entryDeadline.toISOString().split('T')[0] : undefined,
    };
    const newTournament = addTournament(processedData);
    router.push(`/dashboard/tournaments/${newTournament.id}/manage/overview`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <TournamentForm onSubmit={handleSubmit} />
    </div>
  );
}
