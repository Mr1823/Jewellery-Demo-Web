import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
          background: "#fff"
        }}>
          <h1 style={{ fontSize: "24px", marginBottom: "12px", color: "#333" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#666", marginBottom: "20px", maxWidth: "400px" }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 32px",
              background: "#c6a255",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
