import React from 'react';
import PropTypes from 'prop-types';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import styles from './Notification.module.scss';

const Notification = ({
  notification: { time, userName, notificationBody }
}) => {
  return (
    <div className={styles.notificationContainer}>
      <div>
        <p className={styles.messageType}>
          <span className={styles.icon}>
            <FaBell />
          </span>
          <span className={styles.text}>notification</span>
          <span>• {time}</span>
          <span className={styles.icon}>
            <FaAngleDown />
          </span>
        </p>
        <p className={styles.name}>{userName}</p>
        <p className={styles.notificationMessage}>{notificationBody}</p>
      </div>
    </div>
  );
};
Notification.propTypes = {
  notification: PropTypes.object.isRequired
};

export default Notification;
