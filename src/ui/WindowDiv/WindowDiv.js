/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaRegWindowRestore, FaWindowMaximize } from 'react-icons/fa';
import styles from './WindowDiv.module.scss';

const WindowDiv = React.forwardRef(
  ({ children, onExpand, onMinimize, onRestore, title }, ref) => {
    const [mode, setMode] = useState('original');
    const className = useMemo(
      () =>
        mode === 'fullScreen'
          ? styles.fullScreen
          : mode === 'minimized'
          ? styles.minimized
          : styles.original,
      [mode]
    );

    return (
      <div className={className}>
        <div className={styles.navbar}>
          {mode === 'fullScreen' && <h2>{title}</h2>}
          <button
            type="button"
            onClick={() => {
              if (mode === 'original') {
                setMode('fullScreen');
                onExpand();
              } else if (mode === 'fullScreen') {
                setMode('original');
                onRestore();
              }
            }}
          >
            {mode === 'fullScreen' ? (
              <FaRegWindowRestore />
            ) : (
              <FaWindowMaximize />
            )}
          </button>
        </div>
        <div className={styles.body} ref={ref}>
          {children}
        </div>
      </div>
    );
  }
);

WindowDiv.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onExpand: PropTypes.func,
  onMinimize: PropTypes.func,
  onRestore: PropTypes.func
};

WindowDiv.defaultProps = {
  title: '',
  onExpand: () => {},
  onMinimize: () => {},
  onRestore: () => {}
};

export default WindowDiv;
