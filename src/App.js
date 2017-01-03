import React, { Component } from 'react';
import { sortBy } from 'lodash';
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

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      page: DEFAULT_PAGE,
      searchKey: '',
      // isLoading decides if the Loading... div is shown or not
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [ ...oldHits, ...hits ];
    this.setState({ results: { ...this.state.results, [searchKey]: { hits: updatedHits, page } }, isLoading: false });
  }

  fetchSearchTopStories(query, page) {
    this.setState({ isLoading: true })
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
    this.setState({ searchKey: query });
    if (this.needsToSearchTopStories(query)) {
      this.fetchSearchTopStories(query, page);
    }
    event.preventDefault();
  }

  needsToSearchTopStories(query) {
    return !this.state.results[query];
  }

  onSort(sortKey) {
    const isSortReverse = sortKey === this.state.sortKey ? true : false
    this.setState({ sortKey: sortKey, isSortReverse: isSortReverse });
  }

  componentDidMount() {
    const { query, page } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopStories(query, page);
  }

  render() {
    const { results, query, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[searchKey]) ? results[searchKey].page : 0;
    const list = (results && results[searchKey]) ? results[searchKey].hits : [];
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </Search>
        </div>
        <div className="title">
          {searchKey ? <h2>Showing stories about <span className="subject">{searchKey}</span></h2> : <h2>Showing <span className="subject">all</span> stories</h2> }
        </div>
        {/* Conditional operator (condition ? action-if-true : action-if-false) */}
        {/*
            No need for conditional operator (like this: { results ? <Table list={list} /> : null } ),
            because we initialise the list with [] if there are no results.
        */}
        <Table list={list} sortKey={sortKey} onSort={this.onSort} isSortReverse={isSortReverse} />
        <div className="interactions">
          {/* { isLoading === true ? <Loading /> : <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button> } */}
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

/* Function used to search on the front / user end
  const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
*/

const Loading = () => {
  return (
    <div>
      <i className="fa fa-spinner" aria-hidden="true"></i>
    </div>
  );
};

const Search = (props) => {
  const { value, onChange, onSubmit, children } = props;
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} placeholder="Search Here" />
      <button type="submit">{children}</button>
    </form>
  );
};

const Table = (props) => {
  const { list, sortKey, onSort, isSortReverse } = props;
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? SORTS[sortKey](list).reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>Title</Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>Author</Sort>
        </span>
        <span style={{ width: '15%' }}>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>Comments</Sort>
        </span>
        <span style={{ width: '15%' }}>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>Points</Sort>
        </span>
      </div>
    { reverseSortedList/* .filter(isSearched(pattern)) */.map((item) =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}><a href={item.url} target="_blank" className="subject">{item.title}</a></span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '15%' }}>{item.num_comments}</span>
          <span style={{ width: '15%' }}>{item.points}</span>
        </div>
      ) }
    </div>
  );
};

const Sort = (props) => {
  const { sortKey, onSort, children, activeSortKey } = props;
  const sortClass = ["button-inline"];
  if (sortKey === activeSortKey) {
    sortClass.push("button-active");
  }
  return (
    // className doesn't get applied to a component. It only gets applied to html elements. Pass it as a prop
    <Button className={sortClass.join(" ")} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

const Button = (props) => {
  const { onClick, children, className } = props;
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const withLoading = (Component) => ({ isLoading, ...props }) => {
  return (
    isLoading ? <Loading /> : <Component { ...props } />
  );
}

// This is a Higher Order Component (A component that does something to another and returns it)
// It renders <Loading /> or <Component /> based on the 'isLoading' state (see the withLoading() function)
const ButtonWithLoading = withLoading(Button)

export default App;

export {
  Button,
  Search,
  Table,
};
