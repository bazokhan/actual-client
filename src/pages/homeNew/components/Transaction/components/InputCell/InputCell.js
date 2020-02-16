/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './InputCell.module.scss';

const InputCell = ({ defaultValue, className, mutate, color }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);
  return (
    <div className={cx(className, loading ? styles.loading : '')}>
      <div className={styles.editable}>
        {editMode ? (
          <form
            onSubmit={async e => {
              e.preventDefault();
              setLoading(true);
              try {
                await mutate(value);
              } catch (ex) {
                console.log(ex);
              }
              setLoading(false);
              setEditMode(false);
            }}
          >
            <input
              ref={inputRef}
              style={
                color
                  ? { width: '100%', outline: 'none', color }
                  : { width: '100%', outline: 'none' }
              }
              type="text"
              tabIndex={0}
              onChange={e => setValue(e.target.value)}
              value={value}
              onBlur={async e => {
                e.preventDefault();
                setLoading(true);
                try {
                  await mutate(value);
                } catch (ex) {
                  console.log(ex);
                }
                setLoading(false);
                setEditMode(false);
              }}
            />
          </form>
        ) : (
          <div
            style={
              color
                ? { width: '100%', outline: 'none', color }
                : { width: '100%', outline: 'none' }
            }
            tabIndex={0}
            onClick={() => setEditMode(true)}
            onFocus={() => setEditMode(true)}
          >
            {value}
          </div>
        )}
      </div>
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
