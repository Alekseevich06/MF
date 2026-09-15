import { useWidgetData } from '../useWidgetData';
import { fetchTopBooks } from '../../../api/mockApi';

export function TopBooksWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:top-books',
    priority: 'high',
    fetch: fetchTopBooks,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Топ книг</h3>
      <ol className="widget-list">
        {data.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ol>
    </div>
  );
}