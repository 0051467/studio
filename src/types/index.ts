export interface Venue {
  id: string;
  name: string;
  address: string;
  numberOfCourts: number;
}

export interface EventCategory {
  id: string;
  name: string; // e.g., "Men's Singles", "U15 Women's Doubles"
  type: 'Singles' | 'Doubles';
  gender: 'Men' | 'Women' | 'Mixed' | 'Any'; // 'Any' for age categories like U13
  ageGroup?: string; // e.g., "U13", "Masters 40+"
  players: Player[]; // Registered players/pairs for this event
  matches: Match[];
  drawGenerated: boolean;
  seeds: string[]; // Array of player IDs that are seeded
}

export interface Player {
  id: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other'; // Optional for simplicity, might be inferred by category
  dateOfBirth?: string; // YYYY-MM-DD
  club?: string;
  seedNumber?: number; // Optional seed number for tournaments
  // For doubles, a player entry might represent a pair
  partnerName?: string; // If it's a doubles pair registered together
  // Player ID could be a national ID or internal ID
  playerId?: string; 
}

export interface Match {
  id: string;
  round: number; // e.g., 1 for R32, 2 for R16
  matchNumber: number; // Unique within a round
  player1Id?: string; // ID of Player or a placeholder like "BYE" or "TBD"
  player2Id?: string; // ID of Player or a placeholder
  player1Name?: string; // Denormalized for easy display
  player2Name?: string; // Denormalized for easy display
  // For doubles, player1Id could be pairId1, or we denormalize names
  // player1PartnerId?: string;
  // player2PartnerId?: string;
  score?: Score;
  winnerId?: string;
  court?: string;
  startTime?: string; // ISO date string
  status: 'Upcoming' | 'Live' | 'Completed' | 'Walkover' | 'Retired';
  isBye?: boolean;
}

export interface Score {
  set1Player1: number | null;
  set1Player2: number | null;
  set2Player1: number | null;
  set2Player2: number | null;
  set3Player1?: number | null; // Optional third set
  set3Player2?: number | null;
}

export type TournamentStatus = 'Draft' | 'Published' | 'In Progress' | 'Completed' | 'Canceled';
export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Walkover' | 'Retired';


export interface Tournament {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  venues: Venue[];
  organizerName: string;
  organizerContact?: string;
  organizerLogoUrl?: string;
  prizeMoney?: string;
  level?: string; // e.g., "Local Club", "Regional"
  entryDeadline?: string; // YYYY-MM-DD
  entryFee?: string;
  posterUrl?: string;
  websiteUrl?: string;
  socialMediaUrl?: string;
  status: TournamentStatus;
  eventCategories: EventCategory[];
}

