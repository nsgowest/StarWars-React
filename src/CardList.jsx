/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { setCharacters, deleteCharacters } from './actions/charactersActions';
import { setSearchText } from './actions/searchActions';
import { getFilms } from './actions/filmsActions';
import makeDelay from './utils/makeDelay';
import Card from './Card';

function CardList({
  characters, hasMoreItems, appElement, setSearch, setCharactersList, isFetching, getFilms,
}) {
  useEffect(() => {
    getFilms();
  }, [getFilms]);

  const needShowCard = (
    characters.length !== 0
  );

  const loadMore = () => {
    if (!isFetching) {
      setCharactersList();
    }
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
  };

  return (
    <>
      <div className="form">
        <input
          type="text"
          className="input"
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSubmit}
        />
        <button type="submit" className="searchButton" />
      </div>
      <ul className="cardList">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMoreItems}
        >
          {needShowCard
            ? (characters.map(({ name, url, films, homeworld, species, gender, birth_year }) => (
              <Card
                name={name}
                url={url}
                key={name}
                films={films}
                homeworld={homeworld}
                appElement={appElement}
                species={species}
                gender={gender}
                birthYear={birth_year}
              />
            )))
            : <div className="noCharactersFound animated fadeIn">No characters found.</div>}
        </InfiniteScroll>
      </ul>
    </>
  );
}

const mapStateToProps = (state) => {
  let { hasMoreItems } = state.characters;
  let { characters } = state.characters;
  let { isFetching } = state.characters;
  let { films } = state.films;
  return {
    characters,
    hasMoreItems,
    isFetching,
    films,
  };
};

const mapDispatchToProps = (dispatch) => {
  const searchDebounced = makeDelay(() => dispatch(setCharacters()), 1000);

  return {
    setCharactersList: () => {
      dispatch(setCharacters());
    },
    setSearch: (searchQuery) => {
      dispatch(deleteCharacters());
      dispatch(setSearchText(searchQuery));
      searchDebounced();
    },
    getFilms: () => {
      dispatch(getFilms());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardList);
