/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlaceholderDiv.module.scss';

const PlaceholderDiv = ({ number, height }) => (
  <div className={styles.placeholder} style={{ height }}>
    {Array(number)
      .fill(0)
      .map((_, index) => (
        <div key={index} style={{ height: height / number - 16 }} />
      ))}
  </div>
);

PlaceholderDiv.propTypes = {
  number: PropTypes.number,
  height: PropTypes.number
};

PlaceholderDiv.defaultProps = {
  number: 4,
  height: 64
};

export default PlaceholderDiv;
