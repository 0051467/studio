// src/lib/i18nUtils.ts
import type { EventCategory, TournamentStatus, MatchStatus } from '@/types';

export const translateTournamentStatus = (status: TournamentStatus | string): string => {
  // Ensure status is a valid key or handle it gracefully
  const validStatus = status as TournamentStatus;
  const map: Record<TournamentStatus, string> = {
    Draft: 'Bản nháp',
    Published: 'Đã công bố',
    'In Progress': 'Đang diễn ra', // Exact match for 'In Progress'
    Completed: 'Đã hoàn thành',
    Canceled: 'Đã hủy',
  };
  return map[validStatus] || status.toString();
};

export const translateEventType = (type: EventCategory['type']): string => {
  const map: Record<EventCategory['type'], string> = {
    Singles: 'Đơn',
    Doubles: 'Đôi',
  };
  return map[type] || type;
};

export const translateEventGender = (gender: EventCategory['gender']): string => {
  const map: Record<EventCategory['gender'], string> = {
    Men: 'Nam',
    Women: 'Nữ',
    Mixed: 'Hỗn hợp',
    Any: 'Bất kỳ',
  };
  return map[gender] || gender;
};

export const translateMatchStatus = (status: MatchStatus | string): string => {
  const validStatus = status as MatchStatus;
  const map: Record<MatchStatus, string> = {
    Upcoming: 'Sắp diễn ra',
    Live: 'Trực tiếp',
    Completed: 'Đã hoàn thành',
    Walkover: 'Bỏ cuộc (W.O.)',
    Retired: 'Xin thua (Ret.)',
  };
  return map[validStatus] || status.toString();
};
