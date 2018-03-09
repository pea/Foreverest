import Nav from 'components/nav/index'
import React from 'react'
import styles from 'css/styles.scss'

type Props = {
  children: any
}

const Layout = (props: Props) =>
  <div>
    <div className={styles.wrapper} style={{height: `${window.innerHeight - 60}px`}}>
    <Nav />
      {props.children}
    </div>
  </div>

export default Layout
