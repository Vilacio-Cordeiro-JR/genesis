import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
  failed: boolean;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main role="alert" className="min-h-screen bg-[#070707] text-gray-200 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-heading font-black text-2xl text-white uppercase">Algo deu errado</h1>
        <p className="text-gray-400 max-w-md">Não foi possível exibir a página agora. Recarregue ou tente novamente em instantes.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-genesis-accent text-genesis-surface font-extrabold">Recarregar</button>
      </main>
    );
  }
}
