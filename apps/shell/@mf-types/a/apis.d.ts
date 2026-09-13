
    export type RemoteKeys = 'a/CatalogMF';
    type PackageType<T> = T extends 'a/CatalogMF' ? typeof import('a/CatalogMF') :any;