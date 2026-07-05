export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  totalBalance: number;
}

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  matchTime: string;
  prizePool: number;
  matchStage: string;
  criterionType: string | null;
  criterionLabel: string | null;
  status: 'OPEN' | 'LOCKED' | 'SETTLED';
  finalResult: string | null;
  finalNote?: string;
}

export interface Prediction {
  id: number;
  match: Match;
  user: User;
  predictedValue: string;
  createdAt: string;
}
