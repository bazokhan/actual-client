import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.scss';

// https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
const isDarkColor = hexCode => {
  if (!/#/.test(hexCode)) return new Error('Only hex codes are accpetable');
  const c = hexCode.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  // eslint-disable-next-line no-bitwise
  const r = (rgb >> 16) & 0xff; // extract red
  // eslint-disable-next-line no-bitwise
  const g = (rgb >> 8) & 0xff; // extract green
  // eslint-disable-next-line no-bitwise
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 140 /* ranges between 0, 255 */) {
    // pick a different colour
    return true;
  }
  return false;
};

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
