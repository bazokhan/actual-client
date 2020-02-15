import React from 'react';
import PropTypes from 'prop-types';
import FILTERS from 'App/constants/Filters';

const Search = ({ filterBy }) => (
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
            ? filterBy(FILTERS.SEARCH, t => {
                return t.searchString.includes(query.toLowerCase());
              })
            : filterBy(FILTERS.SEARCH, t => t);
        }}
        placeholder="Search"
      />
    </label>
  </div>
);

Search.propTypes = {
  filterBy: PropTypes.func.isRequired
};

export default Search;
