import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Logout.module.scss';

const Login = () => {
  const history = useHistory();

  const confirm = () => {
    localStorage.removeItem('auth_token');
    history.push('/auth');
  };
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Log out ?</h4>
      <div className="form-group">
        <div className="btn-group btn-group-block">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => confirm()}
          >
            Confirm
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => history.goBack()}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
