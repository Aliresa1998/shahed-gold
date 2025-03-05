import { Component } from "react";

class VisibilityTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
    };

    // Bind the handler function to the instance so it has access to "this"
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
  }

  handleVisibilityChange() {
    const isVisible = !document.hidden;
    if (isVisible !== this.state.isVisible) {
      this.setState({ isVisible });
      if (isVisible) {
        this.props.handleMinimize(true);
      } else {
        this.props.handleMinimize(false);
      }
    }
  }

  render() {
    return null;
  }
}

export default VisibilityTracker;
