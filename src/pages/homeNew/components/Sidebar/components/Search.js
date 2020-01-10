import React from 'react';
import PropTypes from 'prop-types';

const Search = ({ filterBySearch }) => (
  <div className="form-group">
    <label className="form-label label-sm" htmlFor="search">
      Search
      <input
        className="form-input input-sm"
        id="search"
        type="text"
        onChange={e => {
          const query = e.target.value;
          return query
            ? filterBySearch(t => {
                return t.searchString.includes(query.toLowerCase());
              })
            : filterBySearch(t => t);
        }}
        placeholder="Search"
      />
    </label>
  </div>
);

Search.propTypes = {
  filterBySearch: PropTypes.func.isRequired
};

export default Search;
