import { Route, Switch } from 'react-router'

import Connect from 'pages/Connect/index'
import { ConnectedRouter } from 'connected-react-router'
import Index from 'pages/Index/index'
import Layout from 'containers/layout'
import Progress from 'pages/Progress/index'
import React from 'react'
import { history } from 'store/index'

const routes = (
  <ConnectedRouter history={history}>
    <Layout>
      <Switch>
        <Route exact path='/' component={Index} />
        <Route exact path='/progress' component={Progress} />
        <Route exact path='/connect' component={Connect} />
      </Switch>
    </Layout>
  </ConnectedRouter>
)

export default routes
