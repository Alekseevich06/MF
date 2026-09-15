import { useWidgetData } from '../useWidgetData';
import { fetchSalesChart } from '../../../api/mockApi';

export function SalesChartWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:sales-chart',
    priority: 'high',
    fetch: fetchSalesChart,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  const total = data.points.reduce((sum, p) => sum + p.value, 0);
  const avg = Math.round(total / data.points.length);

  return (
    <div className="widget">
      <h3>Продажи (30 дней)</h3>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{total}</div>
      <small style={{ color: '#666' }}>
        {data.points.length} точек · в среднем {avg}/день
      </small>
    </div>
  );
}