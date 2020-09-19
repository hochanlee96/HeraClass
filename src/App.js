import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Home from './containers/Home/Home';
import ClassList from './containers/ClassList/ClassList';

function App() {

  let routes = (
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/class-list" exact component={ClassList} />
      <Route path="/" exact component={Home} />
      <Redirect to="/home" />
    </Switch>)

  return (
    <div>
      {routes}
    </div>
  );
}

export default withRouter(App);
