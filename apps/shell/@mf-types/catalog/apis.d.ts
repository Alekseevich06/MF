
    export type RemoteKeys = 'catalog/CatalogMF';
    type PackageType<T> = T extends 'catalog/CatalogMF' ? typeof import('catalog/CatalogMF') :any;