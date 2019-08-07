import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
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

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // Search for recupes

      await state.search.getResults();

      //Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something went wrong');
      console.log(error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/* 
Recipe Controller
*/

const controlRecipe = async () => {
  // Grab the ID from the url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Changes to UI

    //Highlight selected
    if (state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);

    try {
      //Get Recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      state.recipe.calcTime();
      state.recipe.calcServing();

      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log(error);
      alert('Error, Processing recipe');
    }
  }
};

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

//Handles recipes button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  }
});

window.l = new List();
