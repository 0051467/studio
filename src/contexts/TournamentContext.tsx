// src/contexts/TournamentContext.tsx
"use client";

import type { Tournament, EventCategory, Player, Match, Score, TournamentStatus } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { translateTournamentStatus } from '@/lib/i18nUtils'; // Not used here, but good for UI


interface TournamentContextType {
  tournaments: Tournament[];
  addTournament: (tournamentData: Omit<Tournament, 'id' | 'status' | 'eventCategories' | 'venues'> & { venuesInput: string }) => Tournament;
  getTournamentById: (id: string) => Tournament | undefined;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  
  addEventCategory: (tournamentId: string, eventData: Omit<EventCategory, 'id' | 'players' | 'matches' | 'drawGenerated' | 'seeds'>) => EventCategory | undefined;
  getEventCategoryById: (tournamentId: string, eventCategoryId: string) => EventCategory | undefined;
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
    name: 'Giải Yonex Demo Mở rộng 2024',
    startDate: '2024-09-15',
    endDate: '2024-09-20',
    venues: [{ id: uuidv4(), name: 'Nhà thi đấu Thành phố', address: '123 Main St, Anytown', numberOfCourts: 6 }],
    organizerName: 'CLB Cầu lông XYZ',
    organizerContact: 'info@badminton.xyz',
    prizeMoney: '$5,000',
    level: 'Khu vực',
    entryDeadline: '2024-09-01',
    status: 'Published',
    eventCategories: [
      { 
        id: 'ms-demo', 
        name: "Đơn Nam", 
        type: 'Singles', 
        gender: 'Men', 
        players: [
          { id: 'player1', name: 'John Doe', club: 'Alpha Club', seedNumber: 1 },
          { id: 'player2', name: 'Mike Smith', club: 'Beta Club', seedNumber: 2 },
          { id: 'player3', name: 'Peter Jones', club: 'Gamma Club' },
          { id: 'player4', name: 'David Lee', club: 'Delta Club' },
        ], 
        matches: [], 
        drawGenerated: false,
        seeds: ['player1', 'player2'], // IDs of seeded players
      },
      { id: 'wd-demo', name: "Đôi Nữ", type: 'Doubles', gender: 'Women', players: [], matches: [], drawGenerated: false, seeds: [] },
    ],
    posterUrl: 'https://picsum.photos/seed/poster1/400/600',
    websiteUrl: 'https://example.com',
  },
  {
    id: 'local-cup-2025',
    name: 'Cúp CLB Địa phương 2025',
    startDate: '2025-01-10',
    endDate: '2025-01-12',
    venues: [{ id: uuidv4(), name: 'Hội trường Cộng đồng', address: '456 Oak Ave, Sometown', numberOfCourts: 3 }],
    organizerName: 'Hiệp hội Cầu lông Sometown',
    status: 'Draft',
    eventCategories: [],
  }
];


export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTournaments = localStorage.getItem('tournaments');
      try {
        if (savedTournaments) {
          const parsedTournaments = JSON.parse(savedTournaments);
          return Array.isArray(parsedTournaments) ? parsedTournaments : initialTournaments;
        }
      } catch (error) {
        console.error("Lỗi khi phân tích giải đấu từ localStorage:", error);
        return initialTournaments;
      }
      return initialTournaments;
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
      venues: [{id: uuidv4(), name: tournamentData.venuesInput, address: '', numberOfCourts: 0}] 
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
  
  const getEventCategoryById = useCallback((tournamentId: string, eventCategoryId: string): EventCategory | undefined => {
    const tournament = getTournamentById(tournamentId);
    return tournament?.eventCategories.find(ec => ec.id === eventCategoryId);
  }, [getTournamentById]);


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
              // If player is seeded (has seedNumber), add their ID to ec.seeds
              const newSeeds = playerData.seedNumber && !ec.seeds.includes(newPlayer.id)
                                ? [...ec.seeds, newPlayer.id]
                                : ec.seeds;
              return { ...ec, players: [...ec.players, newPlayer], seeds: newSeeds };
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
                return { 
                  ...event, 
                  players: event.players.filter(p => p.id !== playerId),
                  seeds: event.seeds.filter(seedId => seedId !== playerId) // Remove from seeds if present
                };
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
                let newSeeds = [...event.seeds];
                const playerIndex = event.players.findIndex(p => p.id === playerId);
                if (playerIndex === -1) return event;

                const updatedPlayer = { ...event.players[playerIndex], ...updates };
                
                if (updates.hasOwnProperty('seedNumber')) { // Check if seedNumber is part of updates
                  if (updates.seedNumber && updates.seedNumber > 0) {
                    if (!newSeeds.includes(playerId)) newSeeds.push(playerId);
                  } else {
                    newSeeds = newSeeds.filter(id => id !== playerId);
                  }
                }
                
                const newPlayers = [...event.players];
                newPlayers[playerIndex] = updatedPlayer;

                return { ...event, players: newPlayers, seeds: newSeeds };
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
              const allPlayers = [...ec.players]; 
              
              // Separate seeded and unseeded players
              const seededPlayerObjects = ec.seeds
                .map(seedId => allPlayers.find(p => p.id === seedId))
                .filter((p): p is Player => !!p) // Type guard
                .sort((a, b) => (a.seedNumber || Infinity) - (b.seedNumber || Infinity));
              
              const unseededPlayerObjects = allPlayers.filter(p => !ec.seeds.includes(p.id));
              
              // Shuffle unseeded players
              for (let i = unseededPlayerObjects.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [unseededPlayerObjects[i], unseededPlayerObjects[j]] = [unseededPlayerObjects[j], unseededPlayerObjects[i]];
              }

              // Combine lists: sorted seeded players first, then shuffled unseeded players
              const orderedPlayers = [...seededPlayerObjects, ...unseededPlayerObjects];

              let numPlayers = orderedPlayers.length;
              let rounds = Math.ceil(Math.log2(numPlayers)); // Smallest power of 2 >= numPlayers
              let bracketSize = Math.pow(2, rounds);
              let byes = bracketSize - numPlayers;

              const matches: Match[] = [];
              let currentRoundPlayers: (Player | { id: string; name: string })[] = [...orderedPlayers];
              
              // Distribute byes (typically among top seeds, but here simplified)
              // Add placeholders for byes at the end of the player list before pairing
              for(let i = 0; i < byes; i++) {
                // Ideally, byes are assigned strategically. Here, just adding placeholders.
                // For a more standard seeding, byes would be matched with lower seeds or unseeded players.
                // This simplified version adds byes to make pairs.
                currentRoundPlayers.push({ id: `bye-${i}`, name: 'MIỄN ĐẤU' });
              }
              
              // Create initial round matches
              for (let i = 0; i < bracketSize / 2; i++) {
                const player1 = currentRoundPlayers[i*2];
                const player2 = currentRoundPlayers[i*2+1];
                
                const matchIsBye = player1.name === 'MIỄN ĐẤU' || player2.name === 'MIỄN ĐẤU';
                let winnerIfBye: string | undefined = undefined;
                if (matchIsBye) {
                  winnerIfBye = player1.name === 'MIỄN ĐẤU' ? player2.id : player1.id;
                }

                matches.push({
                  id: uuidv4(),
                  round: 1,
                  matchNumber: i + 1,
                  player1Id: player1.id,
                  player1Name: player1.name,
                  player2Id: player2.id,
                  player2Name: player2.name,
                  status: matchIsBye ? 'Completed' : 'Upcoming',
                  isBye: matchIsBye,
                  winnerId: winnerIfBye
                });
              }
              
              // Note: This only generates the first round.
              // Advancing players to subsequent rounds needs more logic.
              return { ...ec, matches: matches, drawGenerated: true };
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
  }, [updateMatchDetails]);


  return (
    <TournamentContext.Provider value={{ 
      tournaments, addTournament, getTournamentById, updateTournament, deleteTournament,
      addEventCategory, getEventCategoryById, updateEventCategory, deleteEventCategory,
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
    throw new Error('useTournaments phải được sử dụng bên trong một TournamentProvider');
  }
  return context;
};

