// src/contexts/TournamentContext.tsx
"use client";

import type { Tournament, EventCategory, Player, Match, Score, TournamentStatus } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TournamentContextType {
  tournaments: Tournament[];
  addTournament: (tournamentData: Omit<Tournament, 'id' | 'status' | 'eventCategories' | 'venues'> & { venuesInput: string }) => Tournament;
  getTournamentById: (id: string) => Tournament | undefined;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  
  addEventCategory: (tournamentId: string, eventData: Omit<EventCategory, 'id' | 'players' | 'matches' | 'drawGenerated' | 'seeds'>) => EventCategory | undefined;
  updateEventCategory: (tournamentId: string, eventId: string, updates: Partial<EventCategory>) => void;
  deleteEventCategory: (tournamentId: string, eventId: string) => void;

  addPlayerToEvent: (tournamentId: string, eventCategoryId: string, playerData: Omit<Player, 'id'>) => Player | undefined;
  removePlayerFromEvent: (tournamentId: string, eventCategoryId: string, playerId: string) => void;
  updatePlayerInEvent: (tournamentId: string, eventCategoryId: string, playerId: string, updates: Partial<Player>) => void;
  
  generateKnockoutDraw: (tournamentId: string, eventCategoryId: string) => void;
  updateMatchDetails: (tournamentId: string, eventCategoryId: string, matchId: string, updates: Partial<Match>) => void;
  setMatchScore: (tournamentId: string, eventCategoryId: string, matchId: string, score: Score, winnerId: string) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const initialTournaments: Tournament[] = [
  {
    id: 'yonex-demo-2024',
    name: 'Yonex Demo Open 2024',
    startDate: '2024-09-15',
    endDate: '2024-09-20',
    venues: [{ id: uuidv4(), name: 'City Arena', address: '123 Main St, Anytown', numberOfCourts: 6 }],
    organizerName: 'Badminton Club XYZ',
    organizerContact: 'info@badminton.xyz',
    prizeMoney: '$5,000',
    level: 'Regional',
    entryDeadline: '2024-09-01',
    status: 'Published',
    eventCategories: [
      { 
        id: 'ms-demo', 
        name: "Men's Singles", 
        type: 'Singles', 
        gender: 'Men', 
        players: [
          { id: 'player1', name: 'John Doe', club: 'Alpha Club' },
          { id: 'player2', name: 'Mike Smith', club: 'Beta Club' },
          { id: 'player3', name: 'Peter Jones', club: 'Gamma Club' },
          { id: 'player4', name: 'David Lee', club: 'Delta Club' },
        ], 
        matches: [], 
        drawGenerated: false,
        seeds: [],
      },
      { id: 'wd-demo', name: "Women's Doubles", type: 'Doubles', gender: 'Women', players: [], matches: [], drawGenerated: false, seeds: [] },
    ],
    posterUrl: 'https://picsum.photos/seed/poster1/400/600',
    websiteUrl: 'https://example.com',
  },
  {
    id: 'local-cup-2025',
    name: 'Local Club Cup 2025',
    startDate: '2025-01-10',
    endDate: '2025-01-12',
    venues: [{ id: uuidv4(), name: 'Community Hall', address: '456 Oak Ave, Sometown', numberOfCourts: 3 }],
    organizerName: 'Sometown Badminton Association',
    status: 'Draft',
    eventCategories: [],
  }
];


export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTournaments = localStorage.getItem('tournaments');
      return savedTournaments ? JSON.parse(savedTournaments) : initialTournaments;
    }
    return initialTournaments;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tournaments', JSON.stringify(tournaments));
    }
  }, [tournaments]);

  const addTournament = useCallback((tournamentData: Omit<Tournament, 'id' | 'status' | 'eventCategories' | 'venues'> & { venuesInput: string }): Tournament => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: uuidv4(),
      status: 'Draft',
      eventCategories: [],
      venues: [{id: uuidv4(), name: tournamentData.venuesInput, address: '', numberOfCourts: 0}] // Simplified venue
    };
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  }, []);

  const getTournamentById = useCallback((id: string): Tournament | undefined => {
    return tournaments.find(t => t.id === id);
  }, [tournaments]);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  
  const deleteTournament = useCallback((id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
  }, []);

  const addEventCategory = useCallback((tournamentId: string, eventData: Omit<EventCategory, 'id' | 'players' | 'matches' | 'drawGenerated' | 'seeds'>): EventCategory | undefined => {
    const newEventCategory: EventCategory = { ...eventData, id: uuidv4(), players: [], matches: [], drawGenerated: false, seeds: [] };
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, eventCategories: [...t.eventCategories, newEventCategory] };
      }
      return t;
    }));
    return newEventCategory;
  }, []);

  const updateEventCategory = useCallback((tournamentId: string, eventId: string, updates: Partial<EventCategory>) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(tournament => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            eventCategories: tournament.eventCategories.map(event =>
              event.id === eventId ? { ...event, ...updates } : event
            ),
          };
        }
        return tournament;
      })
    );
  }, []);

  const deleteEventCategory = useCallback((tournamentId: string, eventId: string) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(tournament => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            eventCategories: tournament.eventCategories.filter(event => event.id !== eventId),
          };
        }
        return tournament;
      })
    );
  }, []);
  
  const addPlayerToEvent = useCallback((tournamentId: string, eventCategoryId: string, playerData: Omit<Player, 'id'>): Player | undefined => {
    const newPlayer: Player = { ...playerData, id: uuidv4() };
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          eventCategories: t.eventCategories.map(ec => {
            if (ec.id === eventCategoryId) {
              return { ...ec, players: [...ec.players, newPlayer] };
            }
            return ec;
          })
        };
      }
      return t;
    }));
    return newPlayer;
  }, []);

  const removePlayerFromEvent = useCallback((tournamentId: string, eventCategoryId: string, playerId: string) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(tournament => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            eventCategories: tournament.eventCategories.map(event => {
              if (event.id === eventCategoryId) {
                return { ...event, players: event.players.filter(p => p.id !== playerId) };
              }
              return event;
            }),
          };
        }
        return tournament;
      })
    );
  }, []);

  const updatePlayerInEvent = useCallback((tournamentId: string, eventCategoryId: string, playerId: string, updates: Partial<Player>) => {
     setTournaments(prevTournaments =>
      prevTournaments.map(tournament => {
        if (tournament.id === tournamentId) {
          return {
            ...tournament,
            eventCategories: tournament.eventCategories.map(event => {
              if (event.id === eventCategoryId) {
                return { ...event, players: event.players.map(p => p.id === playerId ? {...p, ...updates} : p) };
              }
              return event;
            }),
          };
        }
        return tournament;
      })
    );
  }, [])

  const generateKnockoutDraw = useCallback((tournamentId: string, eventCategoryId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          eventCategories: t.eventCategories.map(ec => {
            if (ec.id === eventCategoryId && ec.players.length > 1) {
              const players = [...ec.players]; // Shuffle or use seeding later
              
              // Simplified seeding: first N players are seeds if specified
              const seededPlayers = ec.seeds.map(seedId => players.find(p => p.id === seedId)).filter(Boolean) as Player[];
              const unseededPlayers = players.filter(p => !ec.seeds.includes(p.id));
              
              // Simple shuffle for unseeded players
              for (let i = unseededPlayers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [unseededPlayers[i], unseededPlayers[j]] = [unseededPlayers[j], unseededPlayers[i]];
              }

              // Correctly order players for draw generation: seeds first, then shuffled unseeded
              const orderedPlayers = [...seededPlayers, ...unseededPlayers];

              let numPlayers = orderedPlayers.length;
              let rounds = Math.ceil(Math.log2(numPlayers));
              let bracketSize = Math.pow(2, rounds);
              let byes = bracketSize - numPlayers;

              const matches: Match[] = [];
              let currentRoundPlayers = [...orderedPlayers];
              
              // Distribute byes, typically among seeded players or top players
              // For MVP: simply add placeholders for byes at the end
              for(let i = 0; i < byes; i++) {
                currentRoundPlayers.push({ id: `bye-${i}`, name: 'BYE' });
              }
              
              // Shuffle again after adding byes to mix them, except for top seeds if strongly seeded
              // Simplified: just pair them up
              for (let i = 0; i < bracketSize / 2; i++) {
                const player1 = currentRoundPlayers[i*2];
                const player2 = currentRoundPlayers[i*2+1];
                
                matches.push({
                  id: uuidv4(),
                  round: 1,
                  matchNumber: i + 1,
                  player1Id: player1.id,
                  player1Name: player1.name,
                  player2Id: player2.id,
                  player2Name: player2.name,
                  status: 'Upcoming',
                  isBye: player1.name === 'BYE' || player2.name === 'BYE'
                });
              }
              
              // If a match has a BYE, automatically advance the other player
              // This logic would be more complex for subsequent rounds
              // For MVP, we only generate round 1.
              const round1Matches = matches.map(match => {
                if(match.isBye) {
                  if (match.player1Name === 'BYE' && match.player2Id) {
                    return { ...match, winnerId: match.player2Id, status: 'Completed' as TournamentStatus};
                  }
                  if (match.player2Name === 'BYE' && match.player1Id) {
                     return { ...match, winnerId: match.player1Id, status: 'Completed' as TournamentStatus};
                  }
                }
                return match;
              });


              return { ...ec, matches: round1Matches, drawGenerated: true };
            }
            return ec;
          })
        };
      }
      return t;
    }));
  }, []);
  
  const updateMatchDetails = useCallback((tournamentId: string, eventCategoryId: string, matchId: string, updates: Partial<Match>) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          eventCategories: t.eventCategories.map(ec => {
            if (ec.id === eventCategoryId) {
              return { ...ec, matches: ec.matches.map(m => m.id === matchId ? { ...m, ...updates } : m) };
            }
            return ec;
          })
        };
      }
      return t;
    }));
  }, []);

  const setMatchScore = useCallback((tournamentId: string, eventCategoryId: string, matchId: string, score: Score, winnerId: string) => {
    updateMatchDetails(tournamentId, eventCategoryId, matchId, { score, winnerId, status: 'Completed' });
    // Basic progression logic: find next match for winner (highly simplified for MVP)
    // This needs a proper bracket traversal logic for a full implementation.
    // For MVP, this just marks the match as complete.
  }, [updateMatchDetails]);


  return (
    <TournamentContext.Provider value={{ 
      tournaments, addTournament, getTournamentById, updateTournament, deleteTournament,
      addEventCategory, updateEventCategory, deleteEventCategory,
      addPlayerToEvent, removePlayerFromEvent, updatePlayerInEvent,
      generateKnockoutDraw, updateMatchDetails, setMatchScore
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = (): TournamentContextType => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};
