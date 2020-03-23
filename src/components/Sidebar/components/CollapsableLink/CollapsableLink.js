import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import styles from './CollapsableLink.module.scss';

const CollapsableLink = ({
  type,
  onClick,
  icon: Icon,
  route,
  text,
  hover,
  openHorizontally,
  closedVertically,
  hasOpenChildren,
  mainColor
}) => {
  return type === 'button' ? (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        styles.link,
        closedVertically ? styles.closedVertically : '',
        hasOpenChildren ? styles.active : ''
      )}
      style={
        hasOpenChildren
          ? {
              backgroundColor: `rgba(${mainColor}, 0.1)`,
              borderRight: `solid 2px ${mainColor}`
            }
          : {}
      }
      data-tip={hover || text}
    >
      {Icon && (
        <span className={styles.iconLink}>
          {typeof Icon === 'function' || typeof Icon === 'object' ? (
            <Icon />
          ) : (
            <img alt={text} src={Icon} />
          )}
        </span>
      )}
      <span
        className={cx(
          styles.textLink,
          openHorizontally ? styles.openHorizontally : ''
        )}
      >
        {text}
      </span>
    </button>
  ) : (
    <NavLink
      exact
      to={route}
      className={cx(
        styles.link,
        closedVertically ? styles.closedVertically : ''
      )}
      data-tip={hover || text}
      activeStyle={{
        backgroundColor: `rgba(${mainColor}, 0.1)`,
        borderRight: `solid 2px ${mainColor}`
      }}
      activeClassName={styles.active}
    >
      {Icon && (
        <span className={styles.iconLink}>
          {typeof Icon === 'function' || typeof Icon === 'object' ? (
            <Icon />
          ) : (
            <img alt={text} src={Icon} />
          )}
        </span>
      )}
      <span
        className={cx(
          styles.textLink,
          openHorizontally ? styles.openHorizontally : ''
        )}
      >
        {text}
      </span>
    </NavLink>
  );
};

CollapsableLink.propTypes = {
  type: PropTypes.oneOf(['link', 'button']),
  route: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object,
  text: PropTypes.string,
  hover: PropTypes.string,
  openHorizontally: PropTypes.bool,
  closedVertically: PropTypes.bool,
  hasOpenChildren: PropTypes.bool,
  mainColor: PropTypes.string
};

CollapsableLink.defaultProps = {
  type: 'link',
  route: '#',
  onClick: () => {},
  icon: null,
  text: '',
  hover: '',
  openHorizontally: false,
  closedVertically: false,
  hasOpenChildren: false,
  mainColor: '#007bff'
};

export default CollapsableLink;
