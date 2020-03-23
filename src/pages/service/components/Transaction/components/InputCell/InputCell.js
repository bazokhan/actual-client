import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { EditableDiv } from 'ui';
import styles from './InputCell.module.scss';

const InputCell = ({ defaultValue, className, mutate, color }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async value => {
    setLoading(true);
    try {
      await mutate(value);
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  return (
    <div
      className={cx(className, styles.container, loading ? styles.loading : '')}
    >
      <EditableDiv
        defaultValue={defaultValue}
        color={color}
        rtl
        onSubmit={onSubmit}
      />
    </div>
  );
};

InputCell.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  className: PropTypes.string,
  mutate: PropTypes.func.isRequired,
  color: PropTypes.string
};

InputCell.defaultProps = {
  color: null,
  className: ''
};

export default InputCell;
