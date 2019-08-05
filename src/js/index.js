import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
/*
Global state of app
 - search object
 - current recipe object
 - shopping list object
 - liked recipes

*/

const state = {};

const controlSearch = async () => {
  // Grab query from view
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    // Search for recupes

    await state.search.getResults();

    //Render results on UI
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
