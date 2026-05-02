import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background p-10 font-mono text-foreground">
          <h1 className="mb-4 font-display text-3xl font-bold text-destructive">
            App crashed
          </h1>
          <pre className="whitespace-pre-wrap text-sm">{this.state.error.message}</pre>
          <pre className="mt-4 whitespace-pre-wrap text-xs text-muted-foreground">
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-6 py-2 font-display font-semibold text-primary-foreground"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
