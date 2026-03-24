import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export default class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Section failed to render:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="paper-card p-6 text-center max-w-md w-full">
            <p className="font-marker text-2xl text-ink mb-2">could not load this section</p>
            <p className="font-hand text-pencil mb-5">please try again.</p>
            <Button variant="paper" onClick={this.handleRetry}>retry</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
