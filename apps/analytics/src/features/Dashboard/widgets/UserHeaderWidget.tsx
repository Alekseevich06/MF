import { useWidgetData } from '../useWidgetData';
import { fetchUserHeader } from '../../../api/mockApi';

export function UserHeaderWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:user-header',
    priority: 'critical',
    ttlMs: 60_000,
    fetch: fetchUserHeader,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Пользователь</h3>
      <img src={data.avatarUrl} alt="" width={40} style={{ borderRadius: '50%' }} />
      <div>{data.name}</div>
      <small>{data.role}</small>
    </div>
  );
}