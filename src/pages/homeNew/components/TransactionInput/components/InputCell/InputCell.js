import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './InputCell.module.scss';

const InputCell = ({ html, className, onBlur }) => {
  const [loading, setLoading] = useState(false);
  return (
    <ContentEditable
      className={cx(className, loading ? styles.loading : '')}
      disabled={loading}
      tabIndex={0}
      onBlur={e => {
        setLoading(true);
        try {
          onBlur(e.currentTarget.textContent);
        } catch (ex) {
          console.log(ex);
        }
        setLoading(false);
      }}
      html={html || ''}
    />
  );
};

InputCell.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default InputCell;
