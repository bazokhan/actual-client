import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthRoute from 'App/AuthRoute';
import Login from './login';
import Logout from './logout';

const Auth = () => {
  return (
    <Switch>
      <Route path="/auth" exact component={Login} />
      <AuthRoute path="/auth/logout" exact component={Logout} />
      <AuthRoute
        path="/auth/:notfound"
        component={<div>404! Not found.</div>}
      />
    </Switch>
  );
};

export default Auth;
