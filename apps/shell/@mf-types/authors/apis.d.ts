
    export type RemoteKeys = 'authors/AuthorsMF';
    type PackageType<T> = T extends 'authors/AuthorsMF' ? typeof import('authors/AuthorsMF') :any;