import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styles from './HeaderDropdown.module.scss';
import UserIcon from '../../images/user.png';

const HeaderDropdown = ({ image, links, className }) => {
  const history = useHistory();
  const [isOpen, setOpen] = useState(false);
  const [dropDown, setDropDown] = useState(null);

  const handleOutsideClick = e => {
    if (dropDown !== e.target && isOpen) {
      setOpen(false);
    }
  };

  const toggleDropdown = () => setOpen(!isOpen);

  const handleRoute = (route, disabled) => {
    if (disabled) return null;
    history.push(route);
    setOpen(false);
    return null;
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen, dropDown]);

  return (
    <div className={cx(styles.container, styles[className])}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cx(styles.profilePicture, styles.basicButton)}
      >
        <img src={image} alt="profile pic" />
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          ref={ref => {
            setDropDown(ref);
          }}
        >
          <ul>
            {links.map(({ text, icon: Icon, route, disabled }) => {
              const linkStyle = cx(styles.link, {
                [styles.disabled]: disabled
              });

              return (
                <li className={linkStyle} key={text}>
                  <button
                    type="button"
                    className={cx(styles.basicButton, styles.profileButton)}
                    onClick={() => handleRoute(route, disabled)}
                  >
                    <img
                      src={Icon || UserIcon}
                      className={styles.icon}
                      alt="icon"
                    />
                    <p>{text}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

HeaderDropdown.propTypes = {
  image: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
  className: PropTypes.string
};

HeaderDropdown.defaultProps = {
  className: 'collapsed'
};

export default HeaderDropdown;
