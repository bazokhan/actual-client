import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './SelectCell.module.scss';
import SelectableDiv from '../../../../../../ui/SelectableDiv/SelectableDiv';

const SelectCell = ({ className, defaultValue, options, children, mutate }) => {
  const [loading, setLoading] = useState(false);

  const onChange = async opt => {
    setLoading(true);
    try {
      await mutate(opt);
    } catch (ex) {
      console.log(ex);
    }
    console.log(opt);
    setLoading(false);
  };

  return (
    <div
      className={cx(
        className,
        styles.selectCell,
        loading ? styles.loading : ''
      )}
    >
      <SelectableDiv
        defaultValue={defaultValue}
        onChange={onChange}
        options={options}
      >
        {children}
      </SelectableDiv>
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
