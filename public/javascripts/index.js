// Recipe list data array for filling in info box
var recipeListData = [];
var selectedRecipes = [];

// DOM Ready
$(document).ready(function(){

  // Populate the recipe table on initial page load
  populateTable();

  // Recipe name link click
  $('#recipeList table tbody').on('click', 'td a.linkshowuser', showRecipeInfo);

  // Select Recipe Checkbox click
  $('#recipeList table tbody').on('click', 'td .recipeCheckbox', selectRecipe);

  // Select all Recipes
  $('#selectAll').on('click', selectAllRecipes);

  // Print Grocery List
  $('#btnPrintList').on('click', printList);

  // Select Cuisine function - which recipes are displayed in the table
  $('#cuisine-select').change(selectCuisine);

  // Search function
  $('#btnSearch').on('click', searchRecipes);
});

// Functions
// all functions for manipulating the page and selecting recipes are first. then all functions for priting the menu and list

function populateTable(){
  var tableContent = '';
  // empty array to store all of our cuisine types
  var cuisines = [];
  // empty string to eventually store our select cuisine menu data
  var cuisineContent = '';

  // jquery AJAX call for JSON
  $.getJSON('/recipes/recipelist', function (data){

    // adds all recipe info from database to the global variable
    recipeListData = data;

    // for each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      // this checks the global selectedRecipes to see if the recipe has been selected already
      // if it has, it puts it in the table with a checked checkbox
      if (selectedRecipes.indexOf(this.name) === -1) {
        tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox"></td>';
      } else {
        tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox" checked></td>';
      }
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
      tableContent += '<td>' + this.cuisine + '</td>';
      tableContent += '</tr>';
    });

    // inject the whole content string into our existing HTML table
    $('#recipeList table tbody').html(tableContent);

    // create cuisine array to populate the select cuisine menu
    $.each(data, function(i){
      if (cuisines.indexOf(this.cuisine)=== -1) {
        cuisines.push(this.cuisine);
      }
    });

    // this function populates the Select Cuisine menu with all of the cuisines from the global recipeListData
    (function(){
      cuisineContent += '<option value="select" selected>All Cuisines</option>';
      cuisines.forEach(function(item){
        cuisineContent += '<option value="' + item +'">' + item + "</option>";
      });
      //menuContent += '</select>';
    })();

    $('#cuisine-select select').html(cuisineContent);
  });
};

// Allows the user to select which recipes are displayed in the table by cuisine
function selectCuisine(){
  //console.log($('select[name="cuisine"]').val());
  if ($('select[name="cuisine"]').val() === "select"){
    populateTable();
  } else {
    var tableContent = '';
    // jquery AJAX call for JSON
    $.getJSON('/recipes/recipelist', function (data){
      // adds all recipe info from database to the global variable
      recipeListData = data;

      // for each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
        if (this.cuisine === $('select[name="cuisine"]').val()){
          tableContent += '<tr>';
          if (selectedRecipes.indexOf(this.name) === -1) {
            tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox"></td>';
          } else {
            tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox" checked></td>';
          }
          tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
          tableContent += '<td>' + this.cuisine + '</td>';
          tableContent += '</tr>';
        }
      });

      // inject the whole content string into our existing HTML table
      $('#recipeList table tbody').html(tableContent);
    });
  }
}

function searchRecipes() {
  if ($('#search').val() === "") {
    populateTable();
  } else {
    var input = $('#search').val();
    var tableContent = '';
    $.getJSON('/recipes/recipelist', function (data){
      recipeListData = data;
      $.each(data, function(){
        if (this.name.indexOf(input) > -1){
          tableContent += '<tr>';
          if (selectedRecipes.indexOf(this.name) === -1) {
              tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox"></td>';
            } else {
              tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox" checked></td>';
            }
          tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
          tableContent += '<td>' + this.cuisine + '</td>';
          tableContent += '</tr>';
        }
      });
      $('#recipeList table tbody').html(tableContent);
    });
  }
}

// function to remove unselected recipes from selectedRecipes array
var splicer = function (arr, target) {
  arr.splice(arr.indexOf(target), 1);
};

// Select recipe and add to grocery list and menu plan
function selectRecipe() {
    var thisRecipeId = $(this).attr('id'); // this gets the #id from the checkbox: e.g.,LarbCheckbox, Chicken_TacosCheckbox
    var thisRecipeClass = thisRecipeId.replace('Checkbox', ''); // this strips out Checkbox: eg, Larb, Chicken_Tacos
    var thisRecipeName = thisRecipeClass.replace(/[_]/g, ' '); // this replaces _ with a space: eg, Larb, Chicken Tacos
    var arrayPosition = recipeListData.map(function(arrayItem) {return arrayItem.name; }).indexOf(thisRecipeName);
    var thisRecipeObject = recipeListData[arrayPosition];

    // Add or remove from Grocery List, Menu Plan
    if ($('#' + thisRecipeId).is(':checked')) {
      selectedRecipes.push(thisRecipeName);
      $('#menu-plan').append('<p class="' + thisRecipeClass + '">' + thisRecipeName + '</p>');
      if (!$('#selected-meals').is(':visible')) {
        $('#selected-meals').toggle();
      }
    } else {
      splicer(selectedRecipes, thisRecipeName);
      $('.' + thisRecipeClass).remove();
    }
};

// Lets user select all visible recipes to add to grocery list and menu plan
function selectAllRecipes(){
  $.each($('.recipeCheckbox'), (function(i, item){
    $(item).click();
  }));
}

// Show Recipe Info
function showRecipeInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve recipe name from link rel attribute
    var thisRecipeName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = recipeListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisRecipeName);

    // Get our Recipe Object
    var thisRecipeObject = recipeListData[arrayPosition];

    //Populate Info Box
    $('#recipeName').text(thisRecipeObject.name);
    //$('#recipePicture').html('<img src=' + thisRecipeObject.picture + '>');
    $('#recipeDescription').text(thisRecipeObject.description);
    $('#recipeRating').text(thisRecipeObject.rating);
    var requiredIngredients = ingredientPlucker(thisRecipeObject.ingredients) + "<br><strong>" + thisRecipeObject.companionname + "</strong></br>" + ingredientPlucker(thisRecipeObject.companion);
    // $('#recipeIngredients').html(ingredientPlucker(thisRecipeObject.ingredients));
    // $('#recipeIngredients').html(thisRecipeObject.companionname);
    // $('#recipeIngredients').html(ingredientPlucker(thisRecipeObject.companion));
    $('#recipeIngredients').html(requiredIngredients);
};

// beginning of Printing Menu and List functions

// printList needs to show menu plan & ingredients plus grocery list of ingredients
// all in new window for easy printing
function printList(){
  var win = window.open();
  win.document.write('<html><head><title>Grocery List</title><link rel="stylesheet" type="text/css" href="/public/stylesheets/style.css"><link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></head><body>');
  var printedCoverPage = "<div id='print-cover-page'><h2>Weekly Menu Plan</h2>" + printCoverPage(selectedRecipes, recipeListData) + "</div>";
  var printedRecipePages = "<div id='print-recipe-pages'><h2>Recipes and Instructions</h2>" + printRecipePages(selectedRecipes, recipeListData) + "</div>";
  var printedGroceryList = "<div id='print-grocery-list'><h2>Grocery List</h2>" + "<br>" + printGroceryList(selectedRecipes, recipeListData) + "</div>";
  win.document.write(printedCoverPage);
  win.document.write(printedRecipePages);
  win.document.write(printedGroceryList);
  win.document.write('<script src="/public/javascripts/print.js"></script></body></html>');
}

// this creates the text for the cover page of the printed material using the selectedRecipes array
function printCoverPage(selectedRecipes, recipeListData) {
  var coverString = "";
  selectedRecipes.forEach(function(item){
    var arrayPosition = recipeListData.map(function(arrayItem) {return arrayItem.name;}).indexOf(item);
    var thisRecipeObject = recipeListData[arrayPosition];
    coverString += "<h4>" + thisRecipeObject.name + "</h4>";
    coverString += "<p>" + thisRecipeObject.description + "</p>";
  })
  return coverString;
}

// this function creates the text for the printed recipe pages using the selectedRecipes array
function printRecipePages(selectedRecipes, recipeListData){
  var recipeString = "";
  selectedRecipes.forEach(function(item){
    var arrayPosition = recipeListData.map(function(arrayItem) {return arrayItem.name;}).indexOf(item);
    var thisRecipeObject = recipeListData[arrayPosition];
    // recipe name
    recipeString += "<div class='print-full-recipe'><div class='print-recipe-pages-name'><h4>" + thisRecipeObject.name + "</h4></div>";
    // ingredients
    recipeString += "<div class='print-recipe-pages-ingredients'>"
    recipeString += ingredientPlucker(thisRecipeObject.ingredients);
    recipeString += "<br><strong>" + thisRecipeObject.companionname + "</strong><br>";
    recipeString += ingredientPlucker(thisRecipeObject.companion);
    recipeString += "</div>";
    // recipe text
    recipeString += "<div class='print-recipe-pages-recipe'>" + thisRecipeObject.recipe + "</div></div>";
  });
  return recipeString;
}

// Creates grocery list text for the printed pages using selectedRecipes array
function printGroceryList(selectedRecipes, recipeListData){
  var groceryString = "";
  var meatGroceries = [];
  var veggieGroceries = [];
  var dryGroceries = [];
  var spiceGroceries = [];
  var condimentGroceries = [];
  var otherGroceries = [];

  selectedRecipes.forEach(function(item){
    var arrayPosition = recipeListData.map(function(arrayItem) {return arrayItem.name;}).indexOf(item);
    var thisRecipeObject = recipeListData[arrayPosition];
    meatGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.meats));
    meatGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.meats));
    veggieGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.veggies));
    veggieGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.veggies));
    dryGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.dry));
    dryGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.dry));
    spiceGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.spices));
    spiceGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.spices));
    condimentGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.condiments));
    condimentGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.condiments));
    otherGroceries.push(categoryIngredientPlucker(thisRecipeObject.ingredients.other));
    otherGroceries.push(categoryIngredientPlucker(thisRecipeObject.companion.other));
  });
  groceryString += "<strong>Meats</strong><br>" + meatGroceries + addlSpace(4) + "<strong>Veggies</strong><br>" + veggieGroceries + addlSpace(4) + "<strong>Dry Goods</strong><br>" + dryGroceries
    + addlSpace(4) + "<strong>Spices</strong><br>" + spiceGroceries + addlSpace(4) + "<strong>Condiments</strong><br>" + condimentGroceries + addlSpace(4) + "<strong>Other</strong><br>" + otherGroceries;
  groceryString = groceryString.replace(/,/g, '');
  groceryString = groceryString.replace(/None/g, ''); // this still leaves a blank line in the printed list =(
  return groceryString;
}

// Adds blank lines for use in the grocery list
function addlSpace(input) {
  var oneLine = "__________________________________" + "<br>";
  var manyLines = "";
  for (var i = 0; i < input; i++) {
    manyLines += oneLine;
  }
  manyLines += "<br>";
  return manyLines;
}

// this gets a clean list of ingredients from thisRecipeObject
// ingredient object -> category array -> inner array with each ingredient
// e.g., thisRecipeObject.ingredients
var ingredientPlucker = function(ingredients) {
  var ingredientText = "";
  for (var key in ingredients){
    ingredients[key].forEach(function(outer){
      outer.forEach(function(item){
        if (item.length > 1) {
          ingredientText += item + "<br>";
        }
      })
    })
  }
  return ingredientText;
}

//this gets a list of ingredients from the category level of thisRecipeObject
//e.g., thisRecipeObject.ingredients.meats
var categoryIngredientPlucker = function(category) {
  var ingredientText = "";
  category.forEach(function(element){
    element.forEach(function(item){
      if (item.length > 1) {
        ingredientText += item + "<br>";
      }
    });
  });
  return ingredientText;
}
