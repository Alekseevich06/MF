import type { AnalyticsMFProps } from '@bookhub/contracts';
import { Dashboard } from './features/Dashboard/Dashboard';

export default function AnalyticsMF({ locale }: AnalyticsMFProps) {
  return (
    <div>
      <h1>Analytics ({locale})</h1>
      <Dashboard />
    </div>
  );
}