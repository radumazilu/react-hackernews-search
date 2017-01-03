import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = '';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 20;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      query: DEFAULT_QUERY,
      page: DEFAULT_PAGE,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page === 0 ? [] : this.state.result.hits;
    const updatedHits = [ ...oldHits, ...hits ];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(query, page) {
    // The ES6 expression ` ` concatenates the strings.
    // Example: https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value, page: 0 });
  }

  onSearchSubmit(event) {
    const { query, page } = this.state;
    this.fetchSearchTopStories(query, page);
    event.preventDefault();
  }

  componentDidMount() {
    const { query, page } = this.state;
    this.fetchSearchTopStories(query, page);
  }

  render() {
    const { result, query } = this.state;
    const page = result ? result.page : 0;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {/* Conditional operator (condition ? action-if-true : action-if-false) */}
        { result ? <Table list={result.hits} /* pattern={query} */ /> : null }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(query, page + 1)}>More</Button>
        </div>
      </div>
    );
  }
}

/* Function used to search on the front / user end
  const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
*/

const Search = (props) => {
  const { value, onChange, onSubmit, children } = props;
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">{children}</button>
    </form>
  );
};

const Table = (props) => {
  const { list, /* pattern */ } = props;
  return (
    <div className="table">
    { list/* .filter(isSearched(pattern)) */.map((item) =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}><a href={item.url} target="_blank">{item.title}</a></span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '15%' }}>{item.num_comments}</span>
          <span style={{ width: '15%' }}>{item.points}</span>
        </div>
      ) }
    </div>
  );
};

const Button = (props) => {
  const { onClick, children } = props;
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default App;
