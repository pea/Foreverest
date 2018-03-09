import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadApp, updatePageTitle } from 'actions/app'
import styles from 'components/nav/styles.scss'
import { TimelineMax } from 'gsap'
import { Link } from 'react-router-dom'
var FontAwesome = require('react-fontawesome')

type Props = {
  dispatch: () => void,
  loaded: boolean,
  pageTitle: string
}

export class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBurgerClick = this.handleBurgerClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(loadApp());
  }

  props: Props;

  timeline: null;

  handleBurgerClick() {
    this.timeline = new TimelineMax()
      .to(this.menu, 0, { display: 'block', left: '-75vw' }, 0)
      .to(this.menu, '0.3', { left: '+=75vw' }, 0)
      .fromTo(this.overlay, '0.3', { css: { display: 'block', autoAlpha: 0 } }, { css: { display: 'block', autoAlpha: 1 } }, 0);
  }

  handleOverlayClick() {
    if (this.timeline !== null) {
      this.timeline.reverse();
    }
  }

  handleMenuClick(event) {
    if (this.timeline !== null && event.target.nodeName == 'A') {
      this.timeline.reverse();
      this.props.dispatch(updatePageTitle(''));
    }
  }

  render() {
    if (!this.props.loaded) {
      return null;
    }

    return (
      <div>
        <div className={styles.nav}>
          <div className={styles.burger} onClick={this.handleBurgerClick}>
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
          <div className={styles.title}>
            {this.props.pageTitle}
          </div>
        </div>
        <div className={styles.menu} onClick={(e) => this.handleMenuClick(e)} ref={(input) => { this.menu = input; }}>
          <ul>
            <li><div className={styles.icon}><FontAwesome name='map' /></div><Link to="/">My Progress</Link></li>
            <li><div className={styles.icon}><FontAwesome name='plug' /></div><Link to="/connect">Connect with Strava</Link></li>
          </ul>
        </div>
        <div className={styles.overlay} onClick={this.handleOverlayClick} ref={(input) => { this.overlay = input; }} />
      </div>
    );
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded,
    pageTitle: state.app.pageTitle
  };
}

export default connect(mapStateToProperties)(AppContainer);
