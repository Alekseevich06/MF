import './dashboard.css';
import { PreloaderStats } from './PreloaderStats';
import { UserHeaderWidget } from './widgets/UserHeaderWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';
import { TopBooksWidget } from './widgets/TopBooksWidget';
import { RecentAuthorsWidget } from './widgets/RecentAuthorsWidget';
import { SalesChartWidget } from './widgets/SalesChartWidget';
import { CategoryBreakdownWidget } from './widgets/CategoryBreakdownWidget';
import { ReadingTimeWidget } from './widgets/ReadingTimeWidget';
import { RecommendationsWidget } from './widgets/RecommendationsWidget';
import { ActivityFeedWidget } from './widgets/ActivityFeedWidget';
import { SimilarBooksWidget } from './widgets/SimilarBooksWidget';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <UserHeaderWidget />
        <NotificationsWidget />
        <TopBooksWidget />
        <RecentAuthorsWidget />
        <SalesChartWidget />
        <CategoryBreakdownWidget />
        <ReadingTimeWidget />
        <RecommendationsWidget />
        <ActivityFeedWidget />
        <SimilarBooksWidget />
      </div>
      <PreloaderStats />
    </div>
  );
}