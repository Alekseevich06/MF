import { hello } from '@bookhub/shared-ui';

export function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>BookHub Shell</h1>
      <p>Message from shared-ui: {hello()}</p>
    </div>
  );
}
