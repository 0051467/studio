// src/app/dashboard/tournaments/[id]/manage/layout.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTournaments } from '@/contexts/TournamentContext';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, ListChecks, Users, GitFork, CalendarDays, ClipboardList, Eye } from 'lucide-react';
import type { Tournament } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Trophy, href: 'overview' },
  { id: 'events', label: 'Events', icon: ListChecks, href: 'events' },
  { id: 'players', label: 'Players', icon: Users, href: 'players' },
  { id: 'draws', label: 'Draws', icon: GitFork, href: 'draws' },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays, href: 'schedule' },
  { id: 'scores', label: 'Scores', icon: ClipboardList, href: 'scores' },
];

export default function TournamentManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
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
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The tournament you are looking for does not exist or could not be loaded.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const activeTab = pathname.split('/').pop() || 'overview';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Tournaments</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <p className="text-muted-foreground">Manage all aspects of your tournament.</p>
        </div>
        <Button variant="outline" asChild>
            <Link href={`/tournaments/${tournament.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> View Public Page
            </Link>
        </Button>
      </div>

      <Tabs value={activeTab} 
        onValueChange={(value) => router.push(`/dashboard/tournaments/${tournament.id}/manage/${value}`)} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {navItems.map(item => (
            <TabsTrigger key={item.id} value={item.id}>
              <item.icon className="mr-2 h-4 w-4 hidden sm:inline-block" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Content is rendered by the specific page: [id]/manage/[tab]/page.tsx */}
        <div className="mt-6">
            {children}
        </div>

      </Tabs>
    </div>
  );
}
