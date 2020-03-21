import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import styles from './Navbar.module.scss';

const Navbar = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.navbar}>
      {links.map(link => (
        <NavLink
          key={link.path}
          className={styles.navbarLink}
          activeClassName={styles.active}
          to={link.path}
        >
          <div>{link.icon}</div>
          {isOpen && <p>{link.label}</p>}
        </NavLink>
      ))}
      <button
        type="button"
        className={cx(
          'btn btn-action btn-sm btn-primary',
          styles.collapseButton
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
    </div>
  );
};

Navbar.propTypes = {
  links: PropTypes.array.isRequired
};

export default Navbar;
