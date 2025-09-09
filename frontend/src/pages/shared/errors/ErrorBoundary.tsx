/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Component } from 'react';
import ErrorPage from './ErrorPage';
import { useLocation } from 'react-router-dom';

//* ErrorBoundaryState definition
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: React.ReactNode, location?: any }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  //* Reset error state when the route changes
  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

//? Wrapper Functional Component to provide location to ErrorBoundary
const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation(); //? Use the location hook to track the current route

  return <ErrorBoundary location={location}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;