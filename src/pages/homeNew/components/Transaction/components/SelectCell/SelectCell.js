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
      outline: 'none',
      border: 'none',
      width: '100%',
      zIndex: '5',
      boxSizing: 'border-box',
      margin: 'var(--size-0) var(--size-2)'
    }),
    control: originalStyles => ({
      ...originalStyles,
      border: 'dashed 2px var(--main-color)',
      borderRadius: '0',
      outline: 'none',
      color: 'var(--main-color)',
      boxSizing: 'border-box',
      boxShadow: 'none'
    }),
    input: originalStyles => ({
      ...originalStyles,
      border: 'none',
      outline: 'none',
      color: 'var(--main-color)',
      boxSizing: 'border-box',
      justifyConetn: 'flex-start',
      display: 'flex'
    }),
    singleValue: originalStyles => ({
      ...originalStyles,
      justifyConetn: 'flex-start',
      display: 'flex',
      color: 'var(--main-color)'
    }),
    placeholder: originalStyles => ({
      ...originalStyles,
      justifyConetn: 'flex-start',
      display: 'flex'
    }),
    option: (originalStyles, { isSelected }) => ({
      ...originalStyles,
      color: isSelected ? 'white' : 'var(--main-color)',
      textAlign: 'right',
      cursor: 'pointer'
    }),
    menu: originalStyles => ({
      ...originalStyles,
      background: 'white'
    }),
    dropdownIndicator: originalStyles => ({
      ...originalStyles,
      color: 'var(--light-main-color)',
      cursor: 'pointer',
      ':hover': {
        color: 'var(--main-color)'
      }
    })
  };

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);

  const onChange = async opt => {
    setLoading(true);
    try {
      await mutate(opt);
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
    setEditMode(false);
  };

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
        onBlur={() => setEditMode(false)}
        value={defaultValue}
        onChange={onChange}
        options={options}
        styles={customStyles}
      />
    </div>
  ) : (
    <div
      className={cx(className, styles.valueCell, loading ? styles.loading : '')}
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
  className: PropTypes.string,
  mutate: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired
};

SelectCell.defaultProps = {
  className: ''
};

export default SelectCell;
