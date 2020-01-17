import React from 'react';
import PropTypes from 'prop-types';
import { FaDotCircle, FaRegDotCircle } from 'react-icons/fa';

const Pagination = ({ steps, setActiveIndex, activeIndex }) => {
  return (
    <ul className="pagination" style={{ width: '80%' }}>
      <li className="page-item page-prev">
        <button
          type="button"
          className="btn btn-link btn-lg"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
        >
          <div className="page-item-subtitle">Previous</div>
          {steps[activeIndex - 1] && (
            <div className="page-item-title h5">
              {steps[activeIndex - 1].label}
            </div>
          )}
        </button>
      </li>

      {steps.map(step => (
        <li key={step.index} className="page-item active">
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => setActiveIndex(step.index)}
          >
            {activeIndex === step.index ? <FaDotCircle /> : <FaRegDotCircle />}
          </button>
        </li>
      ))}

      <li className="page-item page-next">
        <button
          type="button"
          className="btn btn-link btn-lg"
          disabled={activeIndex === steps.length - 1}
          onClick={() =>
            setActiveIndex(Math.min(steps.length - 1, activeIndex + 1))
          }
        >
          <div className="page-item-subtitle">Next</div>
          {steps[activeIndex + 1] && (
            <div className="page-item-title h5">
              {steps[activeIndex + 1].label}
            </div>
          )}
        </button>
      </li>
    </ul>
  );
};

Pagination.propTypes = {
  steps: PropTypes.array.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired
};

export default Pagination;
