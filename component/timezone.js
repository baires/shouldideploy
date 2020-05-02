import React from "react";
import moment from 'moment-timezone';

export default class Timezone extends React.Component {

  /**
   * On change timezone propagate new timezone value
   * @return void
   */
  onChange = (event) => {
    this.props.onChange(event.target.value);
  }

  /**
   * Build options list
   * @return JSX.Element[]
   */
  options = () => {
    return (moment.tz.names().map((name, index) => {
      return <option value={name} key={index}>{name}</option>;
    }));
  }

  /**
   * Render timezone selector
   * @return JSX.Element[]
   */
  render() {
    return (
      <select value={this.props.timezone} onChange={this.onChange}>
        {this.options()}
      </select>
    );
  }
}
