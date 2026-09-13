import type { AnalyticsMFProps } from '@bookhub/contracts';

export default function AnalyticsMF({ locale }: AnalyticsMFProps) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Analytics MF</h1>
      <p>Locale: {locale}</p>
    </div>
  );
}