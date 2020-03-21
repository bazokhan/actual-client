import React from 'react';
import PropTypes from 'prop-types';
import styles from './ItemCard.module.scss';
import {
  colorizeString,
  isDarkColor,
  shadeColor
} from '../../helpers/colorHelpers';

const ItemCard = ({ title, children, style }) => {
  const initials = title
    .split(' ')
    ?.reduce(
      (prev, word, index, array) =>
        array.length <= 1 ? array[0]?.slice(0, 2) : prev + word.slice(0, 1),
      ''
    );

  const baseColor = colorizeString(title);
  return (
    <div className={styles.cardContainer} style={style}>
      <div className={styles.cardHeader}>
        <div
          className={styles.initials}
          style={{
            background: `linear-gradient(${baseColor} 0%, ${shadeColor(
              baseColor,
              isDarkColor(baseColor) ? 60 : -60
            )} 50%)`,
            color: isDarkColor(baseColor) ? '#fff' : '#333'
          }}
        >
          {initials.toUpperCase()}
        </div>
        <p>{title}</p>
      </div>
      {children}
    </div>
  );
};

ItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

ItemCard.defaultProps = {
  style: {}
};

export default ItemCard;
