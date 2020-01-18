import React from 'react';
import Select from 'react-select';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './SelectCell.module.scss';

const customStyles = {
  container: originalStyles => ({
    ...originalStyles,
    width: '120px',
    position: 'absolute'
  }),
  control: () => ({
    display: 'flex',
    flexGrow: '1',
    backgroundColor: 'rgba(217, 245, 255, 0.1)'
  }),
  input: originalStyles => ({
    ...originalStyles,
    backgroundColor: 'rgba(217, 245, 255, 0.1)'
  })
};

const SelectCell = ({ className, value, onChange, options, onBlur }) => (
  <div className={cx(className, styles.selectCell)}>
    <Select
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      options={options}
      styles={customStyles}
      tabIndex={0}
    />
  </div>
);

SelectCell.propTypes = {
  value: PropTypes.object,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  onBlur: PropTypes.func.isRequired
};

SelectCell.defaultProps = {
  value: null
};

export default SelectCell;
