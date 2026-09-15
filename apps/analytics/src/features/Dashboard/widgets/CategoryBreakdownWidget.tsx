import { useWidgetData } from '../useWidgetData';
import { fetchCategoryBreakdown } from '../../../api/mockApi';

export function CategoryBreakdownWidget() {
  const { data, status } = useWidgetData({
    key: 'analytics:categories',
    priority: 'low',
    fetch: fetchCategoryBreakdown,
  });

  if (status === 'loading') return <div className="widget widget-loading">Загрузка...</div>;
  if (status === 'error' || !data) return <div className="widget widget-error">Ошибка</div>;

  return (
    <div className="widget">
      <h3>Категории</h3>
      {data.map((item) => (
        <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span>{item.category}</span>
          <span>{item.count}</span>
        </div>
      ))}
    </div>
  );
}