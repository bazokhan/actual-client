/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback
} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import styles from './Bar.module.scss';
import Avatar from './components/Avatar';
import NotificationPopup from './components/NotificationPopup';
import placeholder from './images/images.png';
import LogoutIcon from './images/Logout.svg';
import pageLinks from './routes';
import { ServiceContext } from '../../App/hooks/useServicesContext';

const Bar = ({
  profile,
  notifications,
  markAsRead,
  redirectFunc,
  userProfiles,
  settingsList
}) => {
  const { activeService, author } = useContext(ServiceContext);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notificationRef, setNotificationRef] = useState(null);

  const openPopup = () => setNotificationOpen(true);
  const closePopup = useCallback(
    e => {
      const insidePopup =
        notificationRef === e.target || notificationRef.contains(e.target);
      if (!insidePopup) {
        setNotificationOpen(false);
      }
    },
    [notificationRef]
  );

  useEffect(() => {
    if (notificationRef) {
      document.addEventListener('click', closePopup);
      return () => {
        document.removeEventListener('click', closePopup);
      };
    }
    return () => {
      document.removeEventListener('click', closePopup);
    };
  }, [closePopup, notificationRef]);

  const unreads = useMemo(
    () => notifications.filter(({ read }) => !read).length,
    [notifications]
  );

  const isAdmin = useMemo(
    () =>
      author?.role === 'SUPERADMIN' || author?.id === activeService?.owner?.id,
    [activeService, author]
  );

  return (
    <div className={styles.container}>
      {isNotificationOpen && (
        <NotificationPopup
          notifications={notifications}
          setRef={setNotificationRef}
          className={styles.noy}
          markAsRead={markAsRead}
        />
      )}
      <div className={styles.body}>
        {pageLinks?.map(pageLink => {
          const { route, exact, text, icon, userRule } = pageLink;
          if (userRule === 'ADMIN' && !isAdmin) return null;
          return (
            <NavLink
              key={route}
              exact={exact}
              className={styles.link}
              activeClassName={styles.active}
              to={route}
              onClick={e => redirectFunc({ e, route })}
            >
              <div className={styles.icon}>
                {icon || <img src={placeholder} alt={text} />}
              </div>
              <div className={styles.text}>
                {(text?.length > 6 ? `${text.slice(0, 7)}..` : text) || '?'}
              </div>
            </NavLink>
          );
        })}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={cx(styles.button, styles.notificationWrapper)}
          onClick={openPopup}
        >
          <FaBell className={styles.textLink} />
          {unreads > 0 && <span className={styles.dot}>{unreads}</span>}
        </button>
        <Avatar
          profile={profile}
          userProfiles={userProfiles}
          settingsList={settingsList}
        />
        <Link to="/" className={styles.logo}>
          Actual
        </Link>
      </div>
    </div>
  );
};

Bar.propTypes = {
  profile: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string
  }),
  notifications: PropTypes.array,
  markAsRead: PropTypes.func,
  redirectFunc: PropTypes.func,
  userProfiles: PropTypes.array,
  settingsList: PropTypes.array
};

Bar.defaultProps = {
  profile: null,
  notifications: [],
  markAsRead: () => {},
  redirectFunc: () => {},
  userProfiles: [],
  settingsList: [
    {
      text: 'Logout',
      icon: LogoutIcon,
      route: '/auth/logout'
    }
  ]
};

export default Bar;
