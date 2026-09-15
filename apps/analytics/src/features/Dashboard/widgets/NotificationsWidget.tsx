import { useWidgetData } from '../useWidgetData';
import { fetchNotifications } from '../../../api/mockApi';

export function NotificationsWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:notifications',
    priority: 'high',
    fetch: fetchNotifications,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Уведомления ({data.count})</h3>
      <ul className="widget-list">
        {data.items.slice(0, 3).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}