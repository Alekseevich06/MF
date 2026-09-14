import type { Book } from "@bookhub/contracts";
import { useEffect, useState } from "react";
import { fetchBooksPage } from "../../../api/booksApi";
import { mapWithLimit } from "@bookhub/async-utils";
import { isAbortError } from "@bookhub/preloader";


type Status = 'idle' | 'loading' | 'success' | 'error'


export const useInit = () => {
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<Set<string>>(new Set());;
    const [booksByAuthor, setBooksByAuthor] = useState<Map<string, Book[]>>(new Map());
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
        if (selectedAuthorIds.size === 0) {
          setStatus('idle');
          setBooksByAuthor(new Map());
          return;
        }
    
        setStatus('loading');
        setError(null);

        const controller = new AbortController();
    
        load(controller);

        return () => {
            controller.abort()
        }
      }, [selectedAuthorIds]);

      async function load(controller: AbortController) {
        try {
          const {data, meta} = await fetchBooksPage([...selectedAuthorIds], 1, 12, controller.signal);

          console.log(data, meta);
          

          if(meta.totalPages === 1) {
            groupBooksByAuthor(data);
            setStatus('success');
            return
          }

          const remainingPages = Array.from(
            { length: meta.totalPages - 1 },
            (_, i) => i + 2
          );

          const restPages = await mapWithLimit(remainingPages, 3, (page) =>
            fetchBooksPage([...selectedAuthorIds], page, 12, controller.signal)
          );

          const allBooks = [
            ...data,
            ...restPages.flatMap((p) => p.data),
          ];

        groupBooksByAuthor(allBooks);
            setStatus('success');
          
        } catch (err) {
        if (isAbortError(err)) return;
          setError(err as Error);
          setStatus('error');
        }
      }

      function selectedAuthor(id:string){
        setSelectedAuthorIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id);
              } else {
                next.add(id);
              }
              return next;

        })
      }

      function groupBooksByAuthor(books: Book[]) {
        const map = new Map<string, Book[]>();
        const seenIds = new Set<string>();
      
        for (const book of books) {
          if (seenIds.has(book.id)) continue;   // дедупликация
          seenIds.add(book.id);
      
          const list = map.get(book.authorId);
          if (list) {
            list.push(book);                     // добавляем к существующему массиву
          } else {
            map.set(book.authorId, [book]);      // создаём новый массив
          }
        }
      
        setBooksByAuthor(map);
      }

    return {
        selectedAuthorIds,
        booksByAuthor,
        status,
        error,
        selectedAuthor
    }
}