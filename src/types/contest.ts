export interface Contest {
  id: string;
  name: string;
  platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'AtCoder';
  startTime: Date;
  duration: number; // in minutes
  url: string;
  status: 'upcoming' | 'running' | 'finished';
}

export interface ContestApiResponse {
  status: string;
  result?: any[];
}