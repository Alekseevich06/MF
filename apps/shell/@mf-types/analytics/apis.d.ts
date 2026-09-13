
    export type RemoteKeys = 'analytics/AuthorsMF';
    type PackageType<T> = T extends 'analytics/AuthorsMF' ? typeof import('analytics/AuthorsMF') :any;