/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ onClose, message }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 2000);
  });
  return (
    <div className="toast toast-primary">
      <button
        type="button"
        onClick={onClose}
        className="btn btn-clear float-right"
      />
      {message}
    </div>
  );
};

Toast.propTypes = {
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

export default Toast;
