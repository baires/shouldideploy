import React from "react";
import { getRandom, dayHelper } from "../helpers/constans";
export default class Widget extends React.Component {

  /**
   * Set default state element based on props
   * @param {any} props
   */
  constructor(props)
  {
    super(props);

    this.state = {
        timezone: this.props.now.timezone,
        reason: getRandom(this.getReasons())
    };
  }

  /**
   * On props change update state
   * @param {any} nextProps
   * @return void
   */
  componentDidUpdate(nextProps) {
    if (nextProps.now.timezone !== this.state.timezone) {
        this.setState({
            timezone: nextProps.now.timezone,
            reason: getRandom(this.getReasons())
        });
    }
  }

  /**
   * Get reasons according to current time
   * @return string[]
   */
  getReasons() {
    return dayHelper(this.props.now);
  }

  /**
   * On click reload reasons
   * @return void
   */
  onClick = () => {
      let reasons = this.getReasons();
      this.setState({ reason: getRandom(reasons) });
  }

  /**
   * Render widget
   * @return JSX.Element
   */
  render() {
    return (
        <div className="item">
          <h3 className="tagline">Should I Deploy Today?</h3>
          <h2 id="text">{this.state.reason}</h2>
          <button type="button" id="reload" onClick={this.onClick}>
            Hit me again
          </button>
        </div>
    );
  }
}
