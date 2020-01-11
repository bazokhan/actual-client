import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthRoute from 'App/AuthRoute';
import Login from './login';
import Logout from './logout';

const Auth = () => {
  return (
    <Switch>
      <Route path="/auth" exact component={Login} />
      <AuthRoute path="/auth/logout" component={Logout} />
    </Switch>
  );
};

export default Auth;
