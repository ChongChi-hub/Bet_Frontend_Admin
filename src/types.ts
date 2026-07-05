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
  openTime?: string;
  matchTime: string;
  prizePool: number;
  matchStage?: string;
  criterionType?: string;
  criterionLabel?: string;
  status: 'PENDING' | 'OPEN' | 'LOCKED' | 'SETTLED';
  finalResult?: string;
  finalNote?: string;
}

export interface Prediction {
  id: number;
  match: Match;
  user: User;
  predictedValue: string;
  createdAt: string;
}
