import type { Book } from "@bookhub/contracts";
import { useEffect, useState } from "react";
import { fetchBooksPage } from "../../../api/booksApi";
import { mapWithLimit } from "@bookhub/async-utils";
import { isAbortError } from "@bookhub/preloader";


type Status = 'idle' | 'loading' | 'success' | 'error'


export const useInit = () => {
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<Set<string>>(new Set());;
    const [books, setBooks] = useState<Book[]>([]);
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
        if (selectedAuthorIds.size === 0) {
          setStatus('idle');
          setBooks([]);
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
            setBooks(data);
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

            setBooks(allBooks);
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


    return {
        selectedAuthorIds,
        books,
        status,
        error,
        selectedAuthor
    }
}