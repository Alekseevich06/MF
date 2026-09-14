import type { Locale } from "@bookhub/contracts";
import { useInit } from "./hooks/useInit";
import { AUTHORS } from '../../api/mockData';
import { Checkbox } from "@bookhub/shared-ui";


interface IBooksByAuthorsProps {
    locale: Locale
    onBookClick: (id: string) => void
}

export function BooksByAuthors({ locale, onBookClick }: IBooksByAuthorsProps) {

    const {booksByAuthor, selectedAuthorIds, selectedAuthor, status} = useInit()
  
   
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '50px'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
        {AUTHORS.map(el => 
            <div>
                <Checkbox onChange={() => selectedAuthor(el.id)} checked={selectedAuthorIds.has(el.id)} >{el.name}</Checkbox>
            </div>

        )}
        </div>
        
        {/* BooksView: зависит от status */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
        {[...booksByAuthor.entries()].map(([authorId, authorBooks]) => {
      const author = AUTHORS.find((a) => a.id === authorId);
      return (
        <div key={authorId}>
          <h3>{author?.name ?? authorId} ({authorBooks.length} книг)</h3>
          <div>
            {authorBooks?.map((book) => (
              <div key={book.id} onClick={() => onBookClick(book.id)}>
                {book.title}
              </div>
            ))}
          </div>
        </div>
      );
    })}
        {status === 'loading' && <div>Загрузка</div>}
        {status === 'error' && <div>Ошибка</div>}
        {status === 'idle' && <div>Выберите автора/ов</div>}
        </div>
      </div>
    );
  }