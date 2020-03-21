import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.scss';
import { isDarkColor } from '../../helpers/colorHelpers';

const Tag = ({ type, children, color, justifyContent, style }) => {
  return (
    <div
      className={styles.tag}
      style={
        type === 'outlined'
          ? {
              ...style,
              borderColor: `var(--main-color)`,
              color,
              justifyContent
            }
          : {
              ...style,
              borderColor: `transparent`,
              backgroundColor: color,
              color: isDarkColor(color) ? '#fff' : '#333',
              justifyContent,
              boxShadow: `0 3px 6px 0 ${color}32`
            }
      }
    >
      {children}
    </div>
  );
};

Tag.propTypes = {
  type: PropTypes.oneOf(['solid', 'outlined']),
  justifyContent: PropTypes.oneOf([
    'center',
    'space-around',
    'space-between',
    'flex-start',
    'flex-end'
  ]),
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

Tag.defaultProps = {
  type: 'solid',
  justifyContent: 'center',
  style: {}
};

export default Tag;
