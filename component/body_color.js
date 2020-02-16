import React from "react";

class BodyColor extends React.Component {
  componentDidMount() {
    const { bodyClass } = this.props;
    document.body.classList.add(bodyClass);
  }

  render() {
    return <body className={this.props.bodyClass}>{this.props.children}</body>;
  }
}
export default BodyColor;
