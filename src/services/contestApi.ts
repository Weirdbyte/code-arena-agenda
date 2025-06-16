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
  
  // Generate dynamic dates for upcoming contests
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // CodeChef Starters typically happen on Wednesdays
  const nextWednesday = new Date(today);
  const daysToWednesday = (3 - today.getDay() + 7) % 7;
  if (daysToWednesday === 0) nextWednesday.setDate(today.getDate() + 7); // If today is Wednesday, get next Wednesday
  else nextWednesday.setDate(today.getDate() + daysToWednesday);
  nextWednesday.setHours(20, 0, 0, 0); // 8 PM IST
  
  // CodeChef Cook-Off typically happens on Sundays
  const nextSunday = new Date(today);
  const daysToSunday = (7 - today.getDay()) % 7;
  if (daysToSunday === 0) nextSunday.setDate(today.getDate() + 7); // If today is Sunday, get next Sunday
  else nextSunday.setDate(today.getDate() + daysToSunday);
  nextSunday.setHours(21, 30, 0, 0); // 9:30 PM IST

  const mockContests: Contest[] = [
    {
      id: 'cc-starters-' + nextWednesday.getTime(),
      name: 'CodeChef Starters',
      platform: 'CodeChef',
      startTime: nextWednesday,
      duration: 180, // 3 hours
      url: 'https://www.codechef.com/contests',
      status: 'upcoming',
    },
    {
      id: 'cc-cookoff-' + nextSunday.getTime(),
      name: 'CodeChef Cook-Off',
      platform: 'CodeChef',
      startTime: nextSunday,
      duration: 150, // 2.5 hours
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
  
  // Generate dynamic dates for upcoming contests
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // LeetCode Weekly contests happen on Sundays at 10:30 AM EST
  const nextSunday = new Date(today);
  const daysToSunday = (7 - today.getDay()) % 7;
  if (daysToSunday === 0) nextSunday.setDate(today.getDate() + 7);
  else nextSunday.setDate(today.getDate() + daysToSunday);
  nextSunday.setHours(10, 30, 0, 0); // 10:30 AM EST
  
  // LeetCode Biweekly contests happen every other Saturday at 8:00 PM EST
  const nextSaturday = new Date(today);
  const daysToSaturday = (6 - today.getDay() + 7) % 7;
  if (daysToSaturday === 0) nextSaturday.setDate(today.getDate() + 7);
  else nextSaturday.setDate(today.getDate() + daysToSaturday);
  nextSaturday.setHours(20, 0, 0, 0); // 8:00 PM EST

  const weekNumber = Math.floor((now.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const biweeklyNumber = Math.floor(weekNumber / 2) + 130;
  
  const mockContests: Contest[] = [
    {
      id: 'lc-weekly-' + (weekNumber + 400),
      name: `Weekly Contest ${weekNumber + 400}`,
      platform: 'LeetCode',
      startTime: nextSunday,
      duration: 90, // 1.5 hours
      url: 'https://leetcode.com/contest/',
      status: 'upcoming',
    },
    {
      id: 'lc-biweekly-' + biweeklyNumber,
      name: `Biweekly Contest ${biweeklyNumber}`,
      platform: 'LeetCode',
      startTime: nextSaturday,
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

// Add AtCoder API support
export const fetchAtCoder = async (): Promise<Contest[]> => {
  // AtCoder doesn't have a reliable CORS-enabled API, using mock data
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // AtCoder Beginner Contest typically happens on Saturdays at 21:00 JST
  const nextSaturday = new Date(today);
  const daysToSaturday = (6 - today.getDay() + 7) % 7;
  if (daysToSaturday === 0) nextSaturday.setDate(today.getDate() + 7);
  else nextSaturday.setDate(today.getDate() + daysToSaturday);
  nextSaturday.setHours(21, 0, 0, 0); // 9:00 PM JST
  
  const contestNumber = Math.floor((now.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 340;
  
  const mockContests: Contest[] = [
    {
      id: 'ac-abc-' + contestNumber,
      name: `AtCoder Beginner Contest ${contestNumber}`,
      platform: 'AtCoder',
      startTime: nextSaturday,
      duration: 100, // 100 minutes
      url: 'https://atcoder.jp/contests/',
      status: 'upcoming',
    },
  ];

  return mockContests.filter(contest => {
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return contest.startTime >= now && contest.startTime <= nextWeek;
  });
};

export const fetchAllContests = async (): Promise<Contest[]> => {
  try {
    const [codeforces, codechef, leetcode, atcoder] = await Promise.all([
      fetchCodeforces(),
      fetchCodeChef(),
      fetchLeetCode(),
      fetchAtCoder(),
    ]);

    const allContests = [...codeforces, ...codechef, ...leetcode, ...atcoder];
    
    // Sort by start time
    return allContests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error('Error fetching contests:', error);
    return [];
  }
};