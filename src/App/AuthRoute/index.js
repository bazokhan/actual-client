/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { Route, useHistory } from 'react-router-dom';

const AuthRoute = props => {
  const authToken = useMemo(() => localStorage.getItem('auth_token'), [
    localStorage
  ]);
  const history = useHistory();
  if (!authToken && history) history.push('/auth');
  if (!authToken && !history) return null;
  return <Route {...props} />;
};

export default AuthRoute;
