import type { Locale } from '../domain';

export interface AuthorsMFProps {
    initialAuthorId?: string
    locale: Locale
    onBookClick: (bookId: string) => void
}

export interface AuthorsMFHandle {
    mount(el: HTMLElement, props: AuthorsMFProps): void;
    unmount(): void;
}