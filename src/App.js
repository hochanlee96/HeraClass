import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Home from './containers/Home/Home';
import Layout from './components/hoc/Layout/Layout';
import StudioSearch from './containers/StudioSearch/StudioSearch';
import StudioDetail from './containers/StudioDetail/StudioDetail';
import Logout from './components/Auth/Logout/Logout';
import MyPage from './containers/MyPage/MyPage';
import Auth from './containers/Auth/Auth';
import Favorites from './containers/Favorites/Favorites';
import Profile from './containers/Profile/Profile';
import About from './containers/About/About';
import Pricing from './containers/Pricing/Pricing';
import Contact from './containers/Contact/Contact';
import * as authActions from './store/actions/auth';

function App() {
  const username = useSelector(state => state.auth.username);
  const dispatch = useDispatch();

  //auto login or logout functionality when refreshed
  useEffect(() => {
    dispatch(authActions.authCheckState());
  }, [dispatch])


  let routes = (
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/about" exact component={About} />
      <Route path="/pricing" exact component={Pricing} />
      <Route path="/contact" exact component={Contact} />
      <Route path="/detail/:studioId" component={StudioDetail} />
      <Route path="/studio-search" exact component={StudioSearch} />
      <Route path="/my-page" exact component={MyPage} />
      <Route path="/favorites" exact component={Favorites} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/" exact component={Home} />
      <Redirect to="/home" />
    </Switch>)

  if (!username) {
    routes = (
      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/pricing" exact component={Pricing} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/detail/:studioId" component={StudioDetail} />
        <Route path="/studio-search" exact component={StudioSearch} />
        <Route path="/my-page" exact component={Auth} />
        <Route path="/favorites" exact component={Auth} />
        <Route path="/profile" exact component={Auth} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/" exact component={Home} />
        <Redirect to="/home" />
      </Switch>)
  }

  return (
    <Layout>
      {routes}
    </Layout>
  );
}

export default withRouter(App);
