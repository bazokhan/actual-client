/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FaRegWindowRestore, FaWindowMaximize } from 'react-icons/fa';
import styles from './WindowDiv.module.scss';

const WindowDiv = forwardRef(
  (
    { children, onExpand, onMinimize, onRestore, title, alwaysShowTitle },
    ref
  ) => {
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
          {(mode === 'fullScreen' || alwaysShowTitle) && <h2>{title}</h2>}
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
          {React.Children.toArray(children)?.map(child =>
            React.cloneElement(child, { mode })
          )}
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
  onRestore: PropTypes.func,
  alwaysShowTitle: PropTypes.bool
};

WindowDiv.defaultProps = {
  title: '',
  onExpand: () => {},
  onMinimize: () => {},
  onRestore: () => {},
  alwaysShowTitle: false
};

export default WindowDiv;
