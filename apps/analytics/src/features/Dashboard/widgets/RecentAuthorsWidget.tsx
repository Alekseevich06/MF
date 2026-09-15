import { useWidgetData } from '../useWidgetData';
import { fetchRecentAuthors } from '../../../api/mockApi';

export function RecentAuthorsWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:recent-authors',
    priority: 'high',
    fetch: fetchRecentAuthors,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Авторы</h3>
      <ul className="widget-list">
        {data.map((author) => (
          <li key={author.id}>{author.name}</li>
        ))}
      </ul>
    </div>
  );
}