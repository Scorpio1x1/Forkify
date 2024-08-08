import * as model from './model';
import recipeView from './views/recipeView';
import icons from 'url:../img/icons.svg';
import 'core-js/stable'; // Polifilling 
import 'regenerator-runtime/runtime'; // Polifilling 
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE } from './config';

//if (module.hot) {
//  module.hot.accept();
//}


const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    // Guard Clause
    if (!id) return;
    // Loading recipe
    recipeView.renderSpinner();
    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id); // its an async function
    const recipe = model.state.recipe;
    //console.log(recipe);

    // Rendering recipe
    recipeView.render(model.state.recipe);


  } catch (err) {
    //alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {

    // get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // Load search results
    await model.loadSearchResults(query);

    // Render Results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
    //console.log(model.state.search.results);

  } catch (err) {
    console.error(err);
  }
};

controlSearchResults();

const controlPagination = function (goToPage) {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render New pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Updating the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    // temp

    // close form winodw
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();

    }, MODAL_CLOSE)

    // Success
    addRecipeView.renderMessage();


    // Render Bookmark
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

  } catch (err) {
    console.error('uhoh', err);
    addRecipeView.renderError(err.message);
  }



  // Upload new recipe data
}

// initialization function with their handlers 
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();


const mes = document.querySelector('.recipe');
const f = `<p class="width-size">Rotate Screen as it is too narrow for this application</p>`;
/*
const width = window.innerWidth;
if (width < 660) {
  window.alert('Your screen width is too small! Rotate screen!');
  mes.insertAdjacentHTML('beforeend', f);
}
*/








/* same as above
window.addEventListener('hashchange', showRecipe);
window.addEventListener('load', showRecipe)
*/