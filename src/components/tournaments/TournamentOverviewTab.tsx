// src/components/tournaments/TournamentOverviewTab.tsx
"use client";

import type { Tournament, TournamentStatus } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTournaments } from "@/contexts/TournamentContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, DollarSign, Award, Edit, BarChart3 } from "lucide-react";
import Image from "next/image";

interface TournamentOverviewTabProps {
  tournament: Tournament;
}

export function TournamentOverviewTab({ tournament }: TournamentOverviewTabProps) {
  const { updateTournament } = useTournaments();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: TournamentStatus) => {
    updateTournament(tournament.id, { status: newStatus });
    toast({
        title: "Status Updated",
        description: `Tournament "${tournament.name}" status changed to ${newStatus}.`,
    });
  };
  
  const detailItem = (IconComponent: React.ElementType, label: string, value?: string | number | null, isDate?: boolean) => {
    if (!value && value !== 0) return null;
    const displayValue = isDate && typeof value === 'string' ? new Date(value).toLocaleDateString() : value;
    return (
        <div className="flex items-start space-x-3">
            <IconComponent className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{String(displayValue)}</p>
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
                        alt={`${tournament.name} Poster`} 
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
                        <CardDescription>Organized by {tournament.organizerName}</CardDescription>
                    </div>
                     <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/tournaments/${tournament.id}/edit`}> {/* Assuming an edit page */}
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {detailItem(Calendar, "Dates", `${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}`)}
                {tournament.venues.map(venue => detailItem(MapPin, `Venue: ${venue.name}`, venue.address, false))}
                {detailItem(Users, "Participants (Total)", tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0))}
                {detailItem(DollarSign, "Prize Money", tournament.prizeMoney)}
                {detailItem(Award, "Level/Type", tournament.level)}
                {detailItem(Calendar, "Entry Deadline", tournament.entryDeadline, true)}
                
                <div className="flex items-start space-x-3">
                     <BarChart3 className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                     <div>
                        <p className="text-sm font-medium text-foreground">Status</p>
                        <Select value={tournament.status} onValueChange={(value: TournamentStatus) => handleStatusChange(value)}>
                            <SelectTrigger className="w-[180px] mt-1">
                                <SelectValue placeholder="Set status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Published">Published</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Canceled">Canceled</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                {tournament.websiteUrl && detailItem(LinkIcon, "Official Website", tournament.websiteUrl)}
                {tournament.socialMediaUrl && detailItem(Users, "Social Media", tournament.socialMediaUrl)}


            </CardContent>
             <CardFooter className="border-t pt-6">
                <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
             </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.eventCategories.length}</p>
                    <p className="text-sm text-muted-foreground">Event Categories</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.eventCategories.reduce((sum, ec) => sum + ec.players.length, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                     <p className="text-2xl font-bold">{tournament.eventCategories.reduce((sum, ec) => sum + ec.matches.length, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Matches</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{tournament.venues.reduce((sum, v) => sum + (v.numberOfCourts || 0), 0)}</p>
                    <p className="text-sm text-muted-foreground">Available Courts</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}

// Dummy LinkIcon for placeholder
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

