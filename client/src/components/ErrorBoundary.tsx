import { Component, ReactNode, ErrorInfo } from 'react';
import { handleError } from '../utils/handleError';

// 1. Define the type for the component's props
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    handleError(
      error,
      'A critical UI error occurred. The team has been notified.'
    );
    console.log('Component stack trace:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Oops! Something went wrong.</h1>
          <p>
            We've been notified and are looking into it. Please try refreshing
            the page.
          </p>
        </div>
      );
    }

    // If no error, render the children as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
