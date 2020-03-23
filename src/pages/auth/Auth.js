import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthRoute from 'App/AuthRoute';
import Login from './login';
import Logout from './logout';

const Auth = () => {
  const authToken = localStorage.getItem('auth_token');
  return (
    <Switch>
      <Route path="/auth" exact component={authToken ? Logout : Login} />
      {!authToken && <Route path="/auth/login" exact component={Login} />}
      {authToken && <AuthRoute path="/auth/logout" exact component={Logout} />}
      <AuthRoute
        path="/auth/:notfound"
        component={() => <div>404! Not found.</div>}
      />
    </Switch>
  );
};

export default Auth;
