
// APP GLOBAL
// Para una correcta instalacion del servidor nodeJs y componentes seguir los pasos de la clase 133. 
// Instalar las ultimas versiones de todo.


// Para activar el Developer Server y correr la aplicacion se debe ingresar a la consola de node.js
// y utilizar el comando C:\Users\Jorge\Desktop\Javascript Projects\9-forkify\starter>npm run start


// http://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements , renderLoader , clearLoader } from './views/base';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';


// Global state of the app //

const state = {};


/////////////////////////////  SEARCH CONTROLLER  ///////////////////////////////////////  

const controlSearch = async() => {
    // PASO 1: Get query from View
    const query = searchView.getInput();
    console.log(query);


    if (query) {
     // PASO 2: New Search object and add to state
     state.search = new Search(query);

     // PASO 3: Prepare UI for results
     searchView.clearInput();
     searchView.clearResults();
     renderLoader(elements.searchRes);


     // PASO 4: Search for recipes
     await state.search.getResults();


     // PASO 5: Show result on UI
     clearLoader();
     searchView.renderResults(state.search.result);
     console.log(state.search.result);

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



///////////////////////////  RECIPE CONTROLLER  ///////////////////////////////


const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');  // Quita el simbolo # al id
	

	if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected items
        if (state.search) searchView.highlightSelected(id);
        
        // Create new Recipe Object
        state.recipe = new Recipe(id);


        try {

 		// Get recipe data and parse ingredients
 		await state.recipe.getRecipe();
 		state.recipe.parseIngredients();

        // Calculate serving and time

        state.recipe.calcTime();
        state.recipe.calcServings();

         // Show the complete recipe

         clearLoader();
         recipeView.renderRecipe(
         	state.recipe,
         	state.likes.isLiked(id)

         	);



     } catch (error) {
     	alert ('Error procesando la receta!');
     	console.log(error);
     }
 }
};

/* 
window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
*/ 

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));



////////////////////////////// LIST CONTROLLER /////////////////////////////////////////

const controlList = () => {
     // Crear una nueva lista si no hay una
     if (!state.list) {
     	state.list = new List();
     }

     // Añadir cada ingrediente a la lista y en el UI
     state.recipe.ingredients.forEach(el => {
     	const item = state.list.addItem(el.count, el.unit, el.ingredient);
     	listView.renderItem(item);
     });
 }

// Manejo de botones "delete" y "update" de los items de la lista 

elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;


// Manejo de boton "delete"

  if(e.target.matches('.shopping__delete, .shopping__delete *')) {    // "*" Significa cualquiera de sus "childs"
  	
  	state.list.deleteItem(id);
  listView.deleteItem(id);

} else if (e.target.matches('.shopping__count-value')) {
	const val = parseFloat(e.target.value, 10);
	state.list.updateCount(id, val);

}

});  


///////////////////////////   LIKES CONTROLLER  ///////////////////////////////////////////





const controlLikes = () => {
	
	if (!state.likes) {
		state.likes = new Likes();
	}

	const currentID = state.recipe.id;

     // El usuario todavia no ha likeado algun recipe
     if (!state.likes.isLiked(currentID)) {
         // Add like to the state
         const newLike = state.likes.addLike(
         	currentID,
         	state.recipe.title,
         	state.recipe.author,
         	state.recipe.img
         	);
         
         // Toggle like button
         likesView.toogleLikeBtn(true);         



         // Add like to UI list
         likesView.renderLike(newLike);
         console.log(state.likes);


     // El usuario ha likeado algun recipe
 } else {

       // Remove like to the state
       state.likes.deleteLike(currentID);
         // Toggle like button
         likesView.toogleLikeBtn(false); 
         // Remove like to UI list
         likesView.deleteLike(currentID);
     
         
     }

     likesView.toggleLikeMenu(state.likes.getNumLikes());

 };


 // Recupera los likes que se dieron cada vez que se actualiza la pagina 

 window.addEventListener('load', () => {
 	state.likes = new Likes();
 	
    // Recupera los likes que se dieron
    state.likes.readStorage();

 	// Toogle like menu buttons
 	likesView.toggleLikeMenu(state.likes.getNumLikes());

 	// Muestra los likes ya existentes en pantalla
 	state.likes.likes.forEach(like => likesView.renderLike(like));

 });

// Manejo de los botones "+" , "- ", y "add shopping list"

elements.recipe.addEventListener('click', e => {
	if(e.target.matches('.btn-decrease, .btn-decrease *')) {
         // Decrease button clicked
         
         if (state.recipe.servings > 1) {
         	state.recipe.updateServings('dec');
         	recipeView.updateServingsIngredients(state.recipe);
         }

     } else if(e.target.matches('.btn-increase, .btn-increase *')) {
         // Increase button clicked
         state.recipe.updateServings('inc');
         recipeView.updateServingsIngredients(state.recipe);
     } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

     	controlList();
     } else if (e.target.matches('.recipe__love, .recipe__love *')) {
     	controlLikes();
     }
 });


