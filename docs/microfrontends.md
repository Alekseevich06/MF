# Микрофронтенды BookHub

## Решения

### Интеграция
[ESM imports / Module Federation] — потому что ...

Нам нужен автоматический singleton React и versioning shared deps. MF даёт это из коробки, ценой сложности настройки. Мы готовы платить, потому что независимые релизы — ключевое требование

### Композиция
[как shell загружает MF] — потому что ...

manifest.json — единый источник правды для версий. Shell читает его один раз при загрузке. Версионирование не в URL, а в manifest — это позволяет менять версии без передеплоя shell

### Роутинг

Back button должен работать предсказуемо. Shell — единый владелец глобального URL, MF владеют своими namespace'ами. Это предотвращает race conditions в History API

### Точка входа MF
MF экспортирует React-компонент (`ComponentType<Props>`). Все MF на React, поэтому
`mount/unmount` не нужен — shell рендерит MF как обычный компонент в своём дереве.
Плюсы: React Context и hooks работают между shell и MF, React DevTools показывает
всё дерево, нет двойного React-корня.
### Dev / Prod
Manifest — единый источник URL'ов. В dev — localhost, в prod — CDN. Меняется через env-переменные при сборке

## Схема
[ASCII-диаграмма]

┌─────────────────────────────────────────────────────────────────┐
│                         Браузер                                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    Shell (localhost:3000)                 │    │
│  │                                                           │    │
│  │  <React.StrictMode>                                       │    │
│  │    <BrowserRouter>                                        │    │
│  │      <EventBusProvider>                                   │    │
│  │        <PreloaderProvider>                                │    │
│  │          <Routes>                                         │    │
│  │            <Route path="/catalog/*"                       │    │
│  │              element={<CatalogMF {...props} />} />        │    │
│  │            <Route path="/authors/*"                       │    │
│  │              element={<AuthorsMF {...props} />} />        │    │
│  │            <Route path="/analytics/*"                     │    │
│  │              element={<AnalyticsMF {...props} />} />      │    │
│  │          </Routes>                                        │    │
│  │        </PreloaderProvider>                               │    │
│  │      </EventBusProvider>                                  │    │
│  │    </BrowserRouter>                                       │    │
│  │  </React.StrictMode>                                      │    │
│  │                                                           │    │
│  │  Одно React-дерево. MF — просто компоненты.                │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Catalog MF   │  │ Authors MF   │  │ Analytics MF │          │
│  │ :3001        │  │ :3002        │  │ :3003        │          │
│  │              │  │              │  │              │          │
│  │ export const │  │ export const │  │ export const │          │
│  │ CatalogMF:   │  │ AuthorsMF:   │  │ AnalyticsMF: │          │
│  │ FC<Props>    │  │ FC<Props>    │  │ FC<Props>    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                  │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  Event Bus  │  ← MF эмитят и слушают       │
│                    │  (shared)   │     через React Context      │
│                    └─────────────┘                              │
│                                                                   │
│                    ┌──────────────┐                              │
│                    │  Preloader   │  ← MF запрашивают данные     │
│                    │  (shared)    │     через React Context      │
│                    └──────────────┘                              │
│                                                                   │
│                    ┌──────────────┐                              │
│                    │  Manifest    │  ← Shell читает URL'ы MF     │
│                    │  .json       │     при загрузке             │
│                    └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘

## Что теряем
1. Сложность настройки (2-3 дня)
2. Debug через несколько MF
3. Versioning shared deps — строгий контроль
4. Координация команд через contracts
5. E2E-тесты сложнее