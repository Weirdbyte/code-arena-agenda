import { Contest } from '@/types/contest';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface ContestFiltersProps {
  selectedPlatforms: Contest['platform'][];
  onPlatformToggle: (platform: Contest['platform']) => void;
  onClearFilters: () => void;
  contestCounts: Record<Contest['platform'], number>;
}

const platforms: Contest['platform'][] = ['Codeforces', 'CodeChef', 'LeetCode', 'AtCoder'];

const getPlatformColor = (platform: Contest['platform'], isSelected: boolean) => {
  const baseColors = {
    Codeforces: isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    CodeChef: isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    LeetCode: isSelected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    AtCoder: isSelected ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  };
  
  return baseColors[platform];
};

export const ContestFilters = ({ 
  selectedPlatforms, 
  onPlatformToggle, 
  onClearFilters,
  contestCounts 
}: ContestFiltersProps) => {
  const hasActiveFilters = selectedPlatforms.length > 0;

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Filter by Platform</h2>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform);
          const count = contestCounts[platform] || 0;
          
          return (
            <Badge
              key={platform}
              variant="outline"
              className={`cursor-pointer transition-colors duration-200 ${getPlatformColor(platform, isSelected)} ${
                count === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => count > 0 && onPlatformToggle(platform)}
            >
              {platform} ({count})
            </Badge>
          );
        })}
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 text-sm text-muted-foreground">
          Showing contests from: {selectedPlatforms.join(', ')}
        </div>
      )}
    </div>
  );
};