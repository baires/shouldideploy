import React from 'react'
import Head from 'next/head'
import {
  shouldIDeploy,
  shouldIDeployFavIcon,
  shouldIDeployAnswerImage,
  getRandom,
  dayHelper
} from '../helpers/constans'
import Time from '../helpers/time'
import Widget from '../component/widget'
import Footer from '../component/footer'
import Router from 'next/router'

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timezone: this.props.timezone,
      now: Time.validOrNull(this.props.timezone)
    }
  }

  static async getInitialProps(request) {
    const { tz } = request.query
    const timezone = tz && Time.zoneExists(tz) ? tz : 'UTC'
    const now = Time.validOrNull(timezone)

    return {
      timezone: timezone,
      initialReason: getRandom(dayHelper(now))
    }
  }

  changeTimeZone = (timezone) => {
    if (!Time.zoneExists(this.props.timezone)) {
      return
    }
    let newUrl = new URL(location)
    newUrl.searchParams.set('tz', timezone)

    Router.push(newUrl.pathname + newUrl.search)
    this.setState({
      timezone: timezone,
      now: new Time(timezone)
    })
  }

  render() {
    return (
      <>
        <Head>
          <link
            rel="icon"
            type="image/png"
            href={shouldIDeployFavIcon(this.state.now)}
            sizes="32x32"
          />
          <meta
            property="og:image"
            content={shouldIDeployAnswerImage(this.state.now)}
          />
          <title>Should I Deploy Ion Today?</title>
        </Head>
        <div
          className={`wrapper ${
            !shouldIDeploy(this.state.now) && 'its-friday'
          }`}
        >
          <Widget
            initialReason={this.props.initialReason}
            now={this.state.now}
          />
          <div className="meta">
            <Footer
              timezone={this.state.timezone}
              changeTimeZone={this.changeTimeZone}
            />
          </div>
        </div>
      </>
    )
  }
}

export default Page
