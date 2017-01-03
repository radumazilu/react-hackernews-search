import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import Search from './components/Search';
// import Table from './components/Table';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'radumazilu',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {

  constructor(props) {
    // super(props) extends the props of the Component class
    super(props);

    this.state = {
      list: list,
      query: '',
    };

    // binding the function to this component
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { query, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        <Table list={list} pattern={query} />
      </div>
    );
  }
}

const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
/*

  This is a higher order function (a function that returns another function).
  It is the short, ES6 version of:

    function isSearched(query) {
      return function(item) {
        return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      };
    }

*/

/* The search component does not use internal state.
   Therefore, it doesn't have to be a ES6 class.
   It can remain a functional stateless component.

   A functional stateless component can be written like this:

  function Search(props) {
    const { value, onChange, children } = props;
    return (
      <form>
        { children }
        <input type="text" value={value} onChange={onChange} />
      </form>
    );
  }

OR using ES6 simplyfications:
*/

const Search = (props) => {
  const { value, onChange, children } = props;
  return (
    <form>
      { children }
      <input type="text" value={value} onChange={onChange} target='_blank' />
    </form>
  );
};

/* Again, we don't need internal state for the table component yet,
   so we can write it either as a ES6 class or as a functional stateless component.

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
*/

const Table = (props) => {
  const { list, pattern } = props;
  return (
    <div className="table">
    { list.filter(isSearched(pattern)).map((item) =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '15%' }}>{item.num_comments}</span>
          <span style={{ width: '15%' }}>{item.points}</span>
        </div>
      ) }
    </div>
  );
};

export default App;
