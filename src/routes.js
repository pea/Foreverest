import React from 'react'
import { Switch, Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'store/index'
import Layout from 'containers/layout'
import Progress from 'pages/Progress/index'
import Connect from 'pages/Connect/index'

const routes = (
  <ConnectedRouter history={history}>
    <Layout>
      <Switch>
        <Route exact path='/' component={Progress} />
        <Route exact path='/connect' component={Connect} />
      </Switch>
    </Layout>
  </ConnectedRouter>
)

export default routes
