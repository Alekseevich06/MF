import { useWidgetData } from '../useWidgetData';
import { fetchReadingTime } from '../../../api/mockApi';

export function ReadingTimeWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:reading-time',
    priority: 'low',
    fetch: fetchReadingTime,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Время чтения</h3>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{data.totalHours}ч</div>
      <small style={{ color: '#666' }}>{data.avgPerDay}ч в день</small>
    </div>
  );
}