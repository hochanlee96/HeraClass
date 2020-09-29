import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Home from './containers/Home/Home';
import Layout from './components/hoc/Layout/Layout';
import ClassList from './containers/ClassList/ClassList';
import ClassDetail from './containers/ClassDetail/ClassDetail';
import Logout from './components/Auth/Logout/Logout';
import MyPage from './containers/MyPage/MyPage';
import * as authActions from './store/actions/auth';

function App() {
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();

  //auto login or logout functionality when refreshed
  useEffect(() => {
    dispatch(authActions.authCheckState());
  }, [dispatch])

  useEffect(() => {
    dispatch(authActions.fetchUserData(userId));
  }, [dispatch, userId])

  let routes = (
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/detail/:classId" component={ClassDetail} />
      <Route path="/class-list" exact component={ClassList} />
      <Route path="/my-page" exact component={MyPage} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/" exact component={Home} />
      <Redirect to="/home" />
    </Switch>)

  return (
    <Layout>
      {routes}
    </Layout>
  );
}

export default withRouter(App);
