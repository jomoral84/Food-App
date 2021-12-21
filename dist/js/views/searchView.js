import { elements } from './base';


export const getInput = () => elements.searchInput.value;


export const clearInput = () => { 
	elements.searchInput.value = ''; 
};  

export const clearResults = () => {
	elements.searchResList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};


export const highlightSelected = id => {                  // Este metodo selecciona un item de la lista y lo deja marcado
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};


export const limitRecipeTitle = (title, limit = 17) => {        // Este metodo transforma un titulo largo en uno mas corto

	const newTitle = [];

	if (title.length > limit) {
       title.split(' ').reduce( (acc, cur) => {       // acc = acumulador , cur = current 

       	if (acc + cur.length <= limit) {
       		newTitle.push(cur);
       	}

       	return acc + cur.length;

       }, 0);

     // Return the result

     return `${newTitle.join(' ')}...`;
 }
 return title;
}



const renderRecipe = recipe => {
	
	const markup = `

	<li>
	<a class="results__link" href="#${recipe.recipe_id}">
	<figure class="results__fig">
	<img src="${recipe.image_url}" alt="${recipe.title}">
	</figure>
	<div class="results__data">
	<h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
	<p class="results__author">${recipe.publisher}</p>
	</div>
	</a>
	</li>
	`;


   elements.searchResList.insertAdjacentHTML('beforeend', markup); // EL método insertAdjacentHTML() de la interfaz Element, analiza la cadena de texto introducida 
                                                                   // como cadena HTML o XML e inserta al árbol DOM los nodos resultantes de dicho análisis en 
                                                                   // la posición especificada. Sintaxis: element.insertAdjacentHTML(posición, texto); 
};                                                                 // 'beforeend': Justo dentro del elemento, después de su último elemento hijo.


const createButton = (page, type) => `

<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1} </span>
<svg class="search__icon">
<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
</svg>

</button>    

`;


// Funcion que realiza la paginacion de recipes

const renderButtons = (page, numResults, resPerPage) => {

     const pages = Math.ceil(numResults / resPerPage);           // Math.ceil redondea por ejemplo 8,2 paginas en 8

     let button;

     if (page === 1 && pages > 1) {

     	button = createButton(page, 'next');
     } else if (page < pages) {

     	button = `
     	${createButton(page, 'prev')}
     	${createButton(page, 'next')}
     	`;

     } else if (page === pages && pages > 1) {

     	button = createButton(page, 'prev');
     } 

     elements.searchResPages.insertAdjacentHTML('afterbegin', button);
 };



// Funcion que calcula la cantidad de recipes por pagina

export const renderResults = (recipes , page = 1, resPerPage = 10) => {

     // Muestra los resultados de la actual pagina

     const start = (page - 1) * resPerPage;
     const end = page * resPerPage;
     recipes.slice(start, end).forEach(renderRecipe);

    // Muestra los botones de la paginacion
    renderButtons(page, recipes.length, resPerPage);



};



