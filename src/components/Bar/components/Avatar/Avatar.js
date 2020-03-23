/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './Avatar.module.scss';
import UserIcon from '../../images/placeholder-user.png';

const Avatar = ({ profile, userProfiles, settingsList }) => {
  const [profilesToggleOpen, setProfilesToggle] = useState(false);
  const [toggleReF, setToggleReF] = useState(null);

  const openPopup = () => setProfilesToggle(true);
  const closePopup = useCallback(
    e => {
      const insidePopup =
        toggleReF === e.target || toggleReF.contains(e.target);
      if (!insidePopup) {
        setProfilesToggle(false);
      }
    },
    [toggleReF]
  );

  useEffect(() => {
    if (toggleReF) {
      document.addEventListener('click', closePopup);
      return () => {
        document.removeEventListener('click', closePopup);
      };
    }
    return () => {
      document.removeEventListener('click', closePopup);
    };
  }, [toggleReF, closePopup]);

  return (
    <>
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => openPopup()}
          className={cx(styles.profilePicture, styles.button)}
        >
          <img src={profile?.picture || UserIcon} alt={profile?.name || ''} />
        </button>
      </div>
      {profilesToggleOpen && (
        <div
          ref={node => setToggleReF(node)}
          className={styles.profilesContainer}
        >
          {userProfiles && userProfiles.length > 0 && (
            <div className={styles.profiles}>
              <p className={styles.title}>Profiles</p>
              {userProfiles?.map(({ type, name, picture }) => (
                <a
                  href={process.env[`REACT_APP_${type}_URL`] || '/'}
                  className={styles.profile}
                >
                  <img
                    src={picture || UserIcon}
                    alt={name || ''}
                    className={styles.profilePicture}
                  />
                  <span>
                    <p>{name || ''} </p>
                    <p>
                      {`${type.charAt(0).toUpperCase() +
                        type.slice(1).toLowerCase()} Account`}
                    </p>
                  </span>
                </a>
              ))}
            </div>
          )}
          <div className={styles.settings}>
            <p className={styles.title}>Settings</p>
            <div className={styles.links}>
              {settingsList.map(({ route, text, icon: Icon }) => (
                <Link to={route} className={styles.link}>
                  {typeof Icon === 'function' || typeof Icon === 'object' ? (
                    <Icon />
                  ) : (
                    <img src={Icon} alt={text} />
                  )}
                  <p>{text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Avatar.propTypes = {
  profile: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string
  }),
  userProfiles: PropTypes.array.isRequired,
  settingsList: PropTypes.array.isRequired
};

Avatar.defaultProps = {
  profile: {
    picture: UserIcon,
    name: ''
  }
};

export default Avatar;
