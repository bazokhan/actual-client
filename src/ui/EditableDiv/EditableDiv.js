/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EditableDiv.module.scss';

const EditableDiv = ({ defaultValue, onSubmit, color, rtl }) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);
  return (
    <div className={styles.editable}>
      {editMode ? (
        <form
          onSubmit={async e => {
            e.preventDefault();
            await onSubmit(value);
            setEditMode(false);
          }}
        >
          <input
            ref={inputRef}
            style={
              color
                ? {
                    color,
                    textAlign: rtl ? 'right' : 'left'
                  }
                : { textAlign: rtl ? 'right' : 'left' }
            }
            type="text"
            tabIndex={0}
            onChange={e => setValue(e.target.value)}
            value={value}
            onBlur={async () => {
              await onSubmit(value);
              setEditMode(false);
            }}
          />
        </form>
      ) : (
        <div
          style={
            color
              ? { color, textAlign: rtl ? 'right' : 'left' }
              : { textAlign: rtl ? 'right' : 'left' }
          }
          tabIndex={0}
          onClick={() => setEditMode(true)}
          onFocus={() => setEditMode(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
};

EditableDiv.propTypes = {
  defaultValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  color: PropTypes.string,
  rtl: PropTypes.bool
};

EditableDiv.defaultProps = {
  defaultValue: '',
  color: null,
  rtl: false
};

export default EditableDiv;
