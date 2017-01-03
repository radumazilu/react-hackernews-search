import React, { Component } from 'react';
import logo from './logo.svg';
import '../App.css';

function isSearched(query) {
  return function(item) {
    return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  };
}

class Table extends Component {
  render() {
    const { list, pattern } = this.props;
    return (
      <div>
      { this.props.list.filter(isSearched(this.props.pattern)).map((item) =>
          <div key={item.objectID}>
            <span><a href={item.url} target="_blank">{item.title}</a></span>
            <p>by</p>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </div>
        ) }
      </div>
    );
  }
}

export default Table;
