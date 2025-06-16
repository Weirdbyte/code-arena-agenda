import { Contest, ContestApiResponse } from '@/types/contest';

const CODEFORCES_API = 'https://codeforces.com/api/contest.list';

export const fetchCodeforces = async (): Promise<Contest[]> => {
  try {
    const response = await fetch(CODEFORCES_API);
    const data: ContestApiResponse = await response.json();
    
    if (data.status !== 'OK' || !data.result) {
      throw new Error('Failed to fetch Codeforces contests');
    }

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return data.result
      .filter((contest: any) => {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        return startTime >= now && startTime <= nextWeek && contest.phase === 'BEFORE';
      })
      .map((contest: any) => ({
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: 'Codeforces' as const,
        startTime: new Date(contest.startTimeSeconds * 1000),
        duration: contest.durationSeconds / 60,
        url: `https://codeforces.com/contest/${contest.id}`,
        status: 'upcoming' as const,
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

export const fetchCodeChef = async (): Promise<Contest[]> => {
  // CodeChef doesn't have a reliable public API, so we'll use mock data
  // In a real app, you might use web scraping or unofficial APIs
  const mockContests: Contest[] = [
    {
      id: 'cc-starter-next',
      name: 'CodeChef Starters',
      platform: 'CodeChef',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 180, // 3 hours
      url: 'https://www.codechef.com/contests',
      status: 'upcoming',
    },
    {
      id: 'cc-lunchtime',
      name: 'March Lunchtime',
      platform: 'CodeChef',
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: 180,
      url: 'https://www.codechef.com/contests',
      status: 'upcoming',
    },
  ];

  return mockContests.filter(contest => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return contest.startTime >= now && contest.startTime <= nextWeek;
  });
};

export const fetchLeetCode = async (): Promise<Contest[]> => {
  // LeetCode doesn't have a public API, using mock data
  const mockContests: Contest[] = [
    {
      id: 'lc-weekly-401',
      name: 'Weekly Contest 401',
      platform: 'LeetCode',
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      duration: 90, // 1.5 hours
      url: 'https://leetcode.com/contest/',
      status: 'upcoming',
    },
    {
      id: 'lc-biweekly-130',
      name: 'Biweekly Contest 130',
      platform: 'LeetCode',
      startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      duration: 90,
      url: 'https://leetcode.com/contest/',
      status: 'upcoming',
    },
  ];

  return mockContests.filter(contest => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return contest.startTime >= now && contest.startTime <= nextWeek;
  });
};

export const fetchAllContests = async (): Promise<Contest[]> => {
  try {
    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeforces(),
      fetchCodeChef(),
      fetchLeetCode(),
    ]);

    const allContests = [...codeforces, ...codechef, ...leetcode];
    
    // Sort by start time
    return allContests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error('Error fetching contests:', error);
    return [];
  }
};