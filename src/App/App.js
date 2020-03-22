/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/Main.scss';
import './styles/spectre.min.scss';
import './styles/spectre-exp.min.scss';
import './styles/spectre-icons.min.scss';
import '../fonts/Changa-VariableFont_wght.ttf';
import Sidebar from 'components/Sidebar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { DataContext } from './context';
import styles from './App.module.scss';
import client from './client';
import AuthRoute from './AuthRoute';
import { routes, authRoutes } from './routes';
import useOldDatabase from './useOldDatabase';

const App = () => {
  const { loading, DataContextValue } = useOldDatabase();

  if (loading) return <div className={styles.loading}>Loading..</div>;

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <DataContext.Provider value={DataContextValue}>
          <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
              <Suspense
                fallback={<div className={styles.loading}>Loading..</div>}
              >
                <Switch>
                  {routes.map(route => (
                    <Route
                      key={route.path}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  ))}
                  {authRoutes.map(route => (
                    <AuthRoute
                      key={route.path}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  ))}
                </Switch>
              </Suspense>
            </div>
          </div>
        </DataContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
