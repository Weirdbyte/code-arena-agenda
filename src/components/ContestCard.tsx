import { Contest } from '@/types/contest';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

const getPlatformColor = (platform: Contest['platform']) => {
  switch (platform) {
    case 'Codeforces':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'CodeChef':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'LeetCode':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'AtCoder':
      return 'bg-purple-500 hover:bg-purple-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getTimeUntilStart = (startTime: Date): string => {
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h`;
  return 'starting soon';
};

export const ContestCard = ({ contest }: ContestCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-2 text-card-foreground">
              {contest.name}
            </h3>
            <Badge 
              variant="secondary" 
              className={`${getPlatformColor(contest.platform)} text-white border-0`}
            >
              {contest.platform}
            </Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium text-primary">
              {getTimeUntilStart(contest.startTime)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDateTime(contest.startTime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Duration: {formatDuration(contest.duration)}</span>
          </div>
          
          <Button 
            asChild 
            className="w-full mt-4" 
            size="sm"
          >
            <a 
              href={contest.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <span>Join Contest</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};