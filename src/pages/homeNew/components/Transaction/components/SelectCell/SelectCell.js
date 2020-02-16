/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './SelectCell.module.scss';

const SelectCell = ({ className, defaultValue, options, children, mutate }) => {
  const customStyles = {
    container: originalStyles => ({
      ...originalStyles,
      width: '100%',
      border: 'dashed 1px var(--main-color)'
    }),
    control: originalStyles => ({
      ...originalStyles,
      color: 'var(--main-color)'
    }),
    input: originalStyles => ({
      ...originalStyles,
      color: 'var(--main-color)'
    }),
    menu: originalStyles => ({
      ...originalStyles
    })
  };

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);

  // useEffect(() => {
  //   setLoading(false);
  // }, [defaultValue]);

  return editMode ? (
    <div
      className={cx(
        className,
        styles.selectCell,
        loading ? styles.loading : ''
      )}
    >
      <Select
        ref={inputRef}
        onBlur={async () => {
          setLoading(true);
          try {
            await mutate(selectedOption);
          } catch (ex) {
            console.log(ex);
          }
          setLoading(false);
          setEditMode(false);
        }}
        value={selectedOption}
        onChange={opt => setSelectedOption(opt)}
        options={options}
        styles={customStyles}
        defaultMenuIsOpen
      />
    </div>
  ) : (
    <div
      className={cx(
        className,
        styles.selectCell,
        loading ? styles.loading : ''
      )}
      onClick={() => setEditMode(true)}
      onFocus={() => setEditMode(true)}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

SelectCell.propTypes = {
  defaultValue: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired
};

export default SelectCell;
