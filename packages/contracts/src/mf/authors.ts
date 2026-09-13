import type { ComponentType } from 'react';
import type { Locale } from '../domain';

export interface AuthorsMFProps {
    initialAuthorId?: string
    locale: Locale
    onBookClick: (bookId: string) => void
}

export type AuthorsMF = ComponentType<AuthorsMFProps>;