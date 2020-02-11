import React, { Component } from 'react';
import { getRandom, dayHelper } from '../helpers/constans';
import Footer from './footer';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssrDone: false,
      message: getRandom(dayHelper())
    };
  }

  componentDidMount() {
    this.setState({ ssrDone: true });
  }

  updateContent = () => {
    this.setState({ message: getRandom(dayHelper()) });
  };

  render() {
    const { ssrDone, message } = this.state;
    if (!ssrDone) {
      return <div>loading...</div>;
    }
    return (
      <div className="aligner">
        <div className="item">
          <h3 className="tagline">Should I Deploy Today?</h3>
          <h2 id="text">{message}</h2>
          <button type="button" id="reload" onClick={this.updateContent}>
            Hit me again
          </button>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Widget;
