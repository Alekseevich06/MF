import type { ComponentType } from 'react';
import type { Locale } from '../domain';

export interface AnalyticsMFProps {
  locale: Locale;
  initialDateRange: { from: string; to: string }
  onExportRequested: (reportId: string) => void
}

export type AnalyticsMF = ComponentType<AnalyticsMFProps>;