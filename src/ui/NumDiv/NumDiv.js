import React from 'react';
import PropTypes from 'prop-types';

const NumDiv = ({ num, title, style }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
      width: '100%'
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: '1.3em',
        marginRight: '5px',
        fontWeight: '900',
        ...style
      }}
    >
      {num}
    </p>
    {title && <p style={{ margin: 0 }}>{title}</p>}
  </div>
);

NumDiv.propTypes = {
  num: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object
};

NumDiv.defaultProps = {
  style: {}
};

export default NumDiv;
