import { useWidgetData } from '../useWidgetData';
import { fetchRecommendations } from '../../../api/mockApi';

export function RecommendationsWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:recommendations',
    priority: 'low',
    fetch: fetchRecommendations,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Рекомендации</h3>
      <ul className="widget-list">
        {data.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}