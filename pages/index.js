import React from 'react'
import Head from 'next/head'
import {
  shouldIDeploy,
  shouldIDeployFavIcon,
  shouldIDeployAnswerImage
} from '../helpers/constants'
import Time from '../helpers/time'
import Widget from '../component/widget'
import Footer from '../component/footer'
import Router from 'next/router'

class Page extends React.Component {
  constructor(props) {
    super(props)

    let timezoneError = false

    if (!Time.zoneExists(this.props.timezone)) {
      timezoneError = true
    }
    this.state = {
      timezone: timezoneError ? 'UTC' : this.props.timezone,
      now: new Time(timezoneError ? 'UTC' : this.props.timezone)
    }
  }

  static async getInitialProps(request) {
    let timezone = request.query.tz || 'UTC'

    return {
      timezone: timezone
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
          <title>Should I Deploy Today?</title>
        </Head>
        <div
          className={`wrapper ${
            !shouldIDeploy(this.state.now) && 'its-friday'
          }`}
        >
          <Widget now={this.state.now} />
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
