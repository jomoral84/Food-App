 // const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

 import axios from 'axios';
 import { proxy } from '../config';

 export default class Recipe {

     constructor(id) {

         this.id = id;
     }

     async getRecipe() {
         try {

             const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
             this.title = res.data.recipe.title;
             this.author = res.data.recipe.publisher;
             this.img = res.data.recipe.image_url;
             this.url = res.data.recipe.source_url;
             this.ingredients = res.data.recipe.ingredients;



         } catch (err) {
             alert("Error");
         }

     }


     calcTime() {
         // Assuming that we need 15 min for each 3 ingredients
         const numIng = this.ingredients.length;
         const periods = Math.ceil(numIng / 3);
         this.time = periods * 15;

     }

     calcServings() {
         this.servings = 4;
     }

     parseIngredients() {
         const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
         const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
         const units = [...unitShort, 'kg', 'g'];


         const newIngredients = this.ingredients.map(el => {

             // 1. Unificar unidades de peso

             let ingredient = el.toLowerCase();
             unitLong.forEach((unit, i) => {

                 ingredient = ingredient.replace(unit, unitShort[i]);
             });

             // 2. Quitar parentesis

             ingredient = ingredient.replace(/ *\([^)]*\) */g, ''); // Regular Expression para eliminar el parentisis de un texto

             // 3. Divivir ingredientes en: cantidad, unidad e ingrediente

             const arrIng = ingredient.split(' ');
             const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

             let objIng;

             if (unitIndex > -1) {
                 // Si existe una unidad
                 const arrCount = arrIng.slice(0, unitIndex);

                 let count;

                 if (arrCount.length === 1) {
                     count = eval(arrIng[0].replace('-', '+'));
                 } else {
                     count = eval(arrIng.slice(0, unitIndex).join('+'));

                 }

                 objIng = {
                     count,
                     unit: arrIng[unitIndex],
                     ingredient: arrIng.slice(unitIndex + 1).join(' ')
                 };


             } else if (parseInt(arrIng[0], 10)) {
                 // Si no hay unidad pero el primer elemento es un numero
                 objIng = {
                     count: parseInt(arrIng[0], 10),
                     unit: '',
                     ingredient: arrIng.slice(1).join(' ')

                 }


             } else if (unitIndex === -1) {
                 // Si no hay unidad y no hay primer elemento 
                 objIng = {
                     count: 1,
                     unit: '',
                     ingredient
                 }
             }

             return objIng;

         });

         this.ingredients = newIngredients;
     }


     updateServings(type) {
         // Servings
         const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

         /*
           const newServings = type;

            if (type === 'dec') {
             this.servings = this.servings - 1; 
           } else {
             this.servings = this.servings + 1;
           }   
           */
         // Ingredients
         this.ingredients.forEach(ing => {
             ing.count *= (newServings / this.servings);
         });

         this.servings = newServings;
     }

 }