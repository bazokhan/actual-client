import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import styles from './Login.module.scss';
import loginGql from '../gql/login.gql';
import signupGql from '../gql/signup.gql';

const Login = () => {
  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginWithEmail, setLoginWithEmail] = useState(true);
  const [message, setMessage] = useState(null);

  const history = useHistory();

  const toggleLogin = () => {
    setLogin(!login);
    setMessage(null);
  };

  const [loginMutation] = useMutation(loginGql, {
    onCompleted: data => {
      if (data && data.login) {
        localStorage.setItem('auth_token', data.login);
        history.push('/');
      }
    },
    onError: err => {
      setMessage({ type: 'error', text: err.message });
    },
    variables: {
      credentials: { name, email, password }
    }
  });

  const [signupMutation] = useMutation(signupGql, {
    onCompleted: async data => {
      if (data && data.createUser) {
        setMessage({
          type: 'success',
          text: `User ${data.createUser.name} created successfully. Please login.`
        });
      }
      await loginMutation();
    },
    onError: err => {
      setMessage({ type: 'error', text: err.message });
    },
    variables: {
      user: { name, email, password }
    }
  });

  const confirm = async () => {
    try {
      if (login) {
        await loginMutation();
      } else {
        await signupMutation();
      }
    } catch (ex) {
      setMessage({ type: 'error', text: ex.message });
    }
  };

  return (
    <div className={styles.container}>
      {message && (
        <div
          className={message.type === 'error' ? styles.error : styles.success}
        >
          {message.text}
        </div>
      )}
      <h4 className={styles.title}>
        {login
          ? `Login with ${loginWithEmail ? 'email' : 'username'}`
          : 'Sign Up'}
      </h4>
      <div className="form-group">
        {login && (
          <label className="form-switch" htmlFor="switch">
            <input
              checked={loginWithEmail}
              id="switch"
              type="checkbox"
              onChange={() => setLoginWithEmail(!loginWithEmail)}
            />
            <i className="form-icon" />{' '}
            {loginWithEmail
              ? 'switch off to login with username'
              : 'switch on to login with email'}
          </label>
        )}
        {(!login || (login && !loginWithEmail)) && (
          <label className="form-label label-lg" htmlFor="name">
            Name
            <input
              className="form-input input-lg"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              placeholder="Your name"
            />
          </label>
        )}
        {(!login || (login && loginWithEmail)) && (
          <label className="form-label label-lg" htmlFor="email">
            Email
            <input
              className="form-input input-lg"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="text"
              placeholder="Your email address"
            />
          </label>
        )}
        <label className="form-label label-lg" htmlFor="password">
          Password
          <input
            className="form-input input-lg"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Choose a safe password"
          />
        </label>
      </div>
      <div className="btn-group btn-group-block">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => confirm()}
        >
          {login ? 'login' : 'create account'}
        </button>
        <button type="button" className="btn" onClick={() => toggleLogin()}>
          {login ? 'need to create an account?' : 'already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default Login;
