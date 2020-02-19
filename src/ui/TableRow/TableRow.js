/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './TableRow.module.scss';

const TableRow = ({ cells, className, style }) => {
  return (
    <div className={cx(styles.tableRow, className)} style={style}>
      {cells.map(cell => (
        <div
          className={cx(styles.tableCell, styles[cell.size || 'md'])}
          key={cell.name}
        >
          {cell.condition
            ? cell.condition()
              ? cell.component
              : null
            : cell.component}
        </div>
      ))}
    </div>
  );
};

TableRow.propTypes = {
  cells: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.string,
      condition: PropTypes.func,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
        .isRequired
    })
  ).isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

TableRow.defaultProps = {
  className: '',
  style: {}
};

export default TableRow;
