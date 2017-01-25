// Recipe list data array for filling in info box
var recipeListData = [];

// DOM Ready
$(document).ready(function(){

  // Populate the recipe table on initial page load
  populateTable();

  // Recipe name link click
  $('#recipeList table tbody').on('click', 'td a.linkshowuser', showRecipeInfo);

  // Select Recipe Checkbox click
  $('#recipeList table tbody').on('click', 'td .recipeCheckbox', selectRecipe);

  // Print Grocery List
  $('#btnPrintList').on('click', printList);

  // Select Cuisine function
  $('#cuisine-select').change(selectCuisine);
});

// Functions

function selectCuisine(){
  //console.log($('select[name="cuisine"]').val());
  if ($('select[name="cuisine"]').val() === "select"){
    populateTable();
  } else {
    var tableContent = '';
    // jquery AJAX call for JSON
    $.getJSON('/users/userlist', function (data){
      // adds all recipe info from database to the global variable
      recipeListData = data;

      // for each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
        if (this.cuisine === $('select[name="cuisine"]').val()){
          tableContent += '<tr>';
          tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox"></td>';
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



// Adds blank lines for use in the grocery list
function addlSpace(input) {
  var oneLine = "__________________________________" + "<br>";
  var manyLines = "";
  for (var i = 0; i < input; i++) {
    manyLines += oneLine;
  }
  return manyLines;
}

// Retrieves info from grocery list for easier printing
function groceryCats(){
  var groceryInfo = "";
  var groceryCats = ['Meats', 'Veggies', 'Spices', 'Condiments', 'Dry', 'Other' ];
  groceryCats.forEach(function(cat){
    groceryInfo += '<strong>' + cat + '</strong>' + $('#grocery' + cat).html() + addlSpace(4);
  });
  return groceryInfo;
}

// printList needs to show menu plan & ingredients plus grocery list of ingredients
// all in new window for easy printing
function printList(){
  var win = window.open();
  win.document.write('<html><head><title>Grocery List</title><link rel="stylesheet" type="text/css" href="/public/stylesheets/style.css"><link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></head><body>');
  var printCoverPage = "<div id='print-cover-page'><strong>Weekly Menu Plan</strong>" + $('#cover-page').html() + "</div>"
  var printMenuPlan = "<div id='print-recipe-pages'>" + '<strong>Recipes and Instructions</strong>' + $('#menu-plan').html() + addlSpace(4) + "</div>";
  var printGroceryList = "<div id='print-grocery-list'><strong>Grocery List</strong>" + "<br>" + groceryCats() + "</div>";
  win.document.write(printCoverPage);
  win.document.write(printMenuPlan);
  win.document.write(printGroceryList);
  //win.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script><script src="/public/javascripts/print.js"></script></body></html>');
  win.document.write('<script src="/public/javascripts/print.js"></script></body></html>');
}



function populateTable(){

  //empty content string
  var tableContent = '';
  // empty array to store all of our cuisine types
  var cuisines = [];
  // empty string to eventually store our select cuisine menu data
  var cuisineContent = '';

  // jquery AJAX call for JSON
  $.getJSON('/users/userlist', function (data){

    // adds all recipe info from database to the global variable
    recipeListData = data;

    // for each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><input type="checkbox" id="' + this.name.replace(/\s+/g, '_') + 'Checkbox" class="recipeCheckbox"></td>';
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

    (function(){
      cuisineContent += '<option value="select" selected>Select Cuisine</option>';
      cuisines.forEach(function(item){
        cuisineContent += '<option value="' + item +'">' + item + "</option>";
      });
      //menuContent += '</select>';
    })();

    $('#cuisine-select select').html(cuisineContent);

  });

};

// Gets a clean list of ingredients from thisRecipeObject for use in selectRecipe()
var ingredientList = function(list) {
  var ingredients = "";
  for (var key in list){
    ingredients += list[key] + "<br>";
  }
  return ingredients;
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
      $('#groceryMeats').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.meats));
      $('#groceryVeggies').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.veggies));
      $('#grocerySpices').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.spices));
      $('#groceryCondiments').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.condiments));
      $('#groceryDry').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.dry));
      $('#groceryOther').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.other));
      $('#menu-plan').append("<div class=" + thisRecipeClass + ">" + thisRecipeName);
      $('#cover-page').append("<div class=" +  thisRecipeClass + "><p><strong>" + thisRecipeName + "</strong>");
      $('#cover-page').append("<div class=" + thisRecipeClass + ">" + thisRecipeObject.description + "</p>");
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.meats));
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.veggies));
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.spices));
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.condiments));
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.dry));
      // $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.other));
    } else {
      $('.' + thisRecipeClass).remove();
    }

    // Add or remove recipe from Menu Plan
    // if ($('#' + thisRecipeId).is(':checked')) {
    //   $('#menu-plan').append("<div class=" + thisRecipeClass + ">" + thisRecipeName);
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.meats));
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.veggies));
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.spices));
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.condiments));
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.dry));
    //   $('#cover-page').append("<div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.other));
    // } else {
    //   $('.' + thisRecipeClass).remove();
    // }

    // Add or remove from Cover Page
    // if ($('#' + thisRecipeId).is(':checked')) {
    //   $('#cover-page').append("div class=" +  thisRecipeClass + ">" + ingredientList(thisRecipeObject.meats));
    // } else {
    //
    // }
};

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
    $('#recipePicture').html('<img src=' + thisRecipeObject.picture + '>');
    $('#recipeDescription').text(thisRecipeObject.description);
    $('#recipeRating').text(thisRecipeObject.rating);
    // $('#groceryMeats').append(ingredientList(thisRecipeObject.meats));

};
