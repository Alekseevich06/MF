import { Component, type ErrorInfo, type ReactNode } from 'react';

interface MFBoundaryProps {
  name: string;                        // имя MF для логов и UI
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface MFBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class MFBoundary extends Component<MFBoundaryProps, MFBoundaryState> {
  state: MFBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<MFBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[MFBoundary:${this.props.name}]`, error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return <DefaultFallback name={this.props.name} error={this.state.error} onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ name, error, onRetry }: { name: string; error: Error; onRetry: () => void }) {
  return (
    <div style={{ padding: 16, border: '1px solid #c33', background: '#fff5f5', borderRadius: 4 }}>
      <strong>MF «{name}» не загрузился</strong>
      <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>{error.message}</p>
      <button onClick={onRetry}>Попробовать снова</button>
    </div>
  );
}