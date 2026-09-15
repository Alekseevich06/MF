import { useWidgetData } from '../useWidgetData';
import { fetchSimilarBooks } from '../../../api/mockApi';

export function SimilarBooksWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:similar-books',
    priority: 'low',
    fetch: fetchSimilarBooks,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Похожие книги</h3>
      <ul className="widget-list">
        {data.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}