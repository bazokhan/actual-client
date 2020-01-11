/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, useHistory } from 'react-router-dom';

const AuthRoute = props => {
  const authToken = localStorage.getItem('auth_token');
  const history = useHistory();
  if (!authToken && history) history.push('/auth');
  if (!authToken && !history) return null;
  return <Route {...props} />;
};

export default AuthRoute;
