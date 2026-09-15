import { useWidgetData } from '../useWidgetData';
import { fetchActivityFeed } from '../../../api/mockApi';

export function ActivityFeedWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:activity',
    priority: 'low',
    fetch: fetchActivityFeed,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Активность</h3>
      <ul className="widget-list">
        {data.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}