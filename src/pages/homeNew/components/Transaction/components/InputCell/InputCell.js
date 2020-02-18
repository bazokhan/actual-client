/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { EditableDiv } from 'ui';
import styles from './InputCell.module.scss';

const InputCell = ({ defaultValue, className, mutate, color }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={cx(className, loading ? styles.loading : '')}>
      <EditableDiv
        defaultValue={defaultValue}
        color={color}
        rtl
        onSubmit={async value => {
          setLoading(true);
          try {
            await mutate(value);
          } catch (ex) {
            console.log(ex);
          }
          setLoading(false);
        }}
      />
    </div>
  );
};

InputCell.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired,
  color: PropTypes.string
};

InputCell.defaultProps = {
  color: null
};

export default InputCell;
