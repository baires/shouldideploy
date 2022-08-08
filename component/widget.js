import React from 'react'
import { getRandom, dayHelper } from '../helpers/constans'
export default class Widget extends React.Component {
  /**
   * Set default state element based on props
   * @param {any} props
   */
  constructor(props) {
    super(props)

    this.state = {
      timezone: this.props.now.timezone,
      reason: this.props.initialReason
    }
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
      })
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onSpacePressOrClick)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onSpacePressOrClick)
  }

  /**
   * On hitting Space reload reasons
   * @return void
   */
  onSpacePressOrClick = (event) => {
    if (event.type === 'click' || event?.keyCode == 32) {
      let reasons = this.getReasons()
      this.setState({ reason: getRandom(reasons) })
    }
  }

  /**
   * Get reasons according to current time
   * @return string[]
   */
  getReasons() {
    return dayHelper(this.props.now)
  }

  /**
   * Render widget
   * @return JSX.Element
   */
  render() {
    return (
      <div className="item">
        <h3 className="tagline">Should I Deploy Today?</h3>
        <h2 id="text" className="reason">
          {this.state.reason}
        </h2>
        <span id="reload" onClick={this.onSpacePressOrClick}>
          Hit <span className="space-btn">Space</span> or Click
        </span>
      </div>
    )
  }
}
