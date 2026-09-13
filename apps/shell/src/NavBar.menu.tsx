
import { Link } from 'react-router-dom';


const menu = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Авторы', path: '/authors' },
    { name: 'Аналитика', path: '/analytics' },
  ];

export function NavBarMenu() {
    return (
        <nav>
      {menu.map(({ name, path }) => (
        <Link key={path} to={path} style={{ marginRight: 12 }}>
          {name}
        </Link>
      ))}
    </nav>
    )
}