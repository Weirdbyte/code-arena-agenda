import { useState, useEffect } from 'react';
import { Contest } from '@/types/contest';
import { fetchAllContests } from '@/services/contestApi';
import { ContestCard } from '@/components/ContestCard';
import { ContestFilters } from '@/components/ContestFilters';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Contest['platform'][]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const loadContests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const fetchedContests = await fetchAllContests();
      setContests(fetchedContests);
      
      toast({
        title: "Contests loaded",
        description: `Found ${fetchedContests.length} upcoming contests`,
      });
    } catch (error) {
      console.error('Error loading contests:', error);
      toast({
        title: "Error loading contests",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, []);

  useEffect(() => {
    if (selectedPlatforms.length === 0) {
      setFilteredContests(contests);
    } else {
      setFilteredContests(contests.filter(contest => 
        selectedPlatforms.includes(contest.platform)
      ));
    }
  }, [contests, selectedPlatforms]);

  const handlePlatformToggle = (platform: Contest['platform']) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleClearFilters = () => {
    setSelectedPlatforms([]);
  };

  const getContestCounts = () => {
    const counts: Record<Contest['platform'], number> = {
      Codeforces: 0,
      CodeChef: 0,
      LeetCode: 0,
      AtCoder: 0,
    };
    
    contests.forEach(contest => {
      counts[contest.platform]++;
    });
    
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Coding Contest Tracker
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Stay updated with upcoming programming contests from top platforms
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next 7 days</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadContests(true)}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ContestFilters
          selectedPlatforms={selectedPlatforms}
          onPlatformToggle={handlePlatformToggle}
          onClearFilters={handleClearFilters}
          contestCounts={getContestCounts()}
        />

        {/* Contest Grid */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No contests found</h3>
            <p className="text-muted-foreground">
              {selectedPlatforms.length > 0 
                ? `No upcoming contests found for selected platforms in the next 7 days.`
                : `No upcoming contests found in the next 7 days.`
              }
            </p>
            {selectedPlatforms.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Upcoming Contests ({filteredContests.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Data refreshed automatically. Times shown in your local timezone.</p>
          <p className="mt-2">
            Platforms: Codeforces (live API) • CodeChef, LeetCode & AtCoder (realistic schedule-based data)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;