class GlobalErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Oops! Something went wrong. Please refresh the page. 🌟</div>;
      }
      return this.props.children;
    }
  }
  
  window.GlobalErrorBoundary = GlobalErrorBoundary;
  