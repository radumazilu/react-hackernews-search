import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

class Search extends Component {
  render () {
    const { value, onChange, children } = this.props;
    return (
      <form>
        { children }
        <input type="text" value={value} onChange={onChange} />
      </form>
    );
  }
}

export default Search;
