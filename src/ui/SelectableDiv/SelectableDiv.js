/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const SelectableDiv = ({
  defaultValue,
  onChange,
  options,
  children,
  style
}) => {
  const resetStyles = {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    background: 'none',
    fontSize: 'var(--size-3)',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    width: '100%',
    height: '100%'
  };

  const customStyles = {
    container: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      zIndex: '5',
      margin: 'var(--size-0) var(--size-2)'
    }),
    control: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      border: 'dashed 2px var(--main-color)',
      color: 'var(--main-color)',
      minHeight: '20px',
      height: '100%'
    }),
    input: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      color: 'var(--main-color)',
      justifyConetn: 'flex-start'
    }),
    singleValue: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      justifyConetn: 'flex-start',
      color: 'var(--main-color)'
    }),
    placeholder: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      justifyConetn: 'flex-start'
    }),
    option: (originalStyles, { isSelected }) => ({
      ...originalStyles,
      ...resetStyles,
      padding: 'var(--padding-1)',
      color: isSelected ? 'white' : 'var(--main-color)',
      background: isSelected ? 'var(--main-color' : 'transparent',
      textAlign: 'right',
      cursor: 'pointer'
    }),
    menu: originalStyles => ({
      ...originalStyles,
      background: 'white'
    }),
    dropdownIndicator: originalStyles => ({
      ...originalStyles,
      ...resetStyles,
      color: 'var(--light-main-color)',
      cursor: 'pointer',
      ':hover': {
        color: 'var(--main-color)'
      }
    })
  };

  const inputRef = useRef();
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);

  return editMode ? (
    <Select
      ref={inputRef}
      onBlur={() => setEditMode(false)}
      value={defaultValue}
      onChange={async opt => {
        try {
          await onChange(opt);
          setEditMode(false);
        } catch (ex) {
          console.log(ex);
        }
      }}
      options={options}
      styles={{ ...style, ...customStyles }}
    />
  ) : (
    <div
      onClick={() => setEditMode(true)}
      onFocus={() => setEditMode(true)}
      tabIndex={0}
      style={{
        ...style,
        width: '100%',
        padding: '0',
        height: '100%',
        display: 'flex'
      }}
    >
      {children}
    </div>
  );
};

SelectableDiv.propTypes = {
  defaultValue: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

SelectableDiv.defaultProps = {
  style: {}
};

export default SelectableDiv;
