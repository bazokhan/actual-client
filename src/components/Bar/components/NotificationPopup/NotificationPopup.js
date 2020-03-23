import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import styles from './Notification.module.scss';

const NotificationPopup = ({ setRef, notifications, markAsRead }) => (
  <div className={styles.popup} ref={node => setRef(node)}>
    <header className={styles.header}>
      <span>All notifications</span>
      <button type="button" className={styles.buttons} onClick={markAsRead}>
        Mark All As Read
      </button>
      <Link to="/notifications/settings" className={styles.buttons}>
        Settings
      </Link>
    </header>
    <div className={styles.container}>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <Link
            to={notification.link}
            key={notification.id}
            className={cx(styles.notificationContainer, {
              [styles.unread]: !notification.read
            })}
          >
            <div>
              <p className={styles.messageType}>
                <span className={styles.icon}>
                  <FaBell />
                </span>
                {/* <span className={styles.text}>notification</span> */}
                <span className={styles.text}>• {notification.time}</span>
                <span className={styles.icon}>
                  <FaAngleDown />
                </span>
              </p>
              <p className={styles.name}>{notification.userName}</p>
              <p className={styles.notificationMessage}>
                {notification.notificationBody}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p className={styles.emptyState}>No notifications</p>
      )}
    </div>
    <footer className={styles.footer}>
      <Link to="/notifications"> See All</Link>
    </footer>
  </div>
);

NotificationPopup.propTypes = {
  setRef: PropTypes.func.isRequired,
  markAsRead: PropTypes.func,
  notifications: PropTypes.array
};

NotificationPopup.defaultProps = {
  notifications: [],
  markAsRead: () => {}
};

export default NotificationPopup;
