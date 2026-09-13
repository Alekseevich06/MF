declare module 'catalog/CatalogMF' {
    import type { ComponentType } from 'react';
    import type { CatalogMFProps, AuthorsMFProps } from '@bookhub/contracts';
  
    const CatalogMF: ComponentType<CatalogMFProps>;
    export default CatalogMF;

  }

  declare module 'authors/AuthorsMF' {
    import type { ComponentType } from 'react';
    import type { AuthorsMFProps } from '@bookhub/contracts';
  
    const AuthorsMF: ComponentType<AuthorsMFProps>;
    export default AuthorsMF;

  }

  declare module 'analytics/AnalyticsMF' {
    import type { ComponentType } from 'react';
    import type { AnalyticsMFProps } from '@bookhub/contracts';
  
    const AnalyticsMF: ComponentType<AnalyticsMFProps>;
    export default AnalyticsMF;

  }