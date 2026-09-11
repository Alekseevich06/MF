import type { Locale } from '../domain';

export interface AnalyticsMFProps {
  locale: Locale;
  initialDateRange: { from: string; to: string }
  onExportRequested: (reportId: string) => void
}

export interface AnalyticsMFHandle {
  mount(el: HTMLElement, props: AnalyticsMFProps): void;
  unmount(): void;
}