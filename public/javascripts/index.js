// Recipe list data array for filling in info box
var recipeListData = [];

// DOM Ready
$(document).ready(function(){

  // Populate the user table on initial page load
  populateTable();

  // Recipe name link click
  $('#recipeList table tbody').on('click', 'td a.linkshowuser', showRecipeInfo);

  // Select Recipe Checkbox click
  $('#recipeList table tbody').on('click', 'td .recipeCheckbox', selectRecipe);
});

// Functions

function populateTable(){

  //empty content string
  var tableContent = '';

  // jquery AJAX call for JSON
  $.getJSON('/users/userlist', function (data){

    // adds all user info from database to the global variable
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

    // need different data outputs on home and newrecipe pages
    // easiest to make two js files and call the appropriate one on each page?
    $('#recipeList table tbody').html(tableContent);
    $('#newRecipeList table tbody').html(tableContent);
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

// Select recipe and add to grocery list
function selectRecipe() {

    var thisRecipeId = $(this).attr('id'); // this gets the #id from the checkbox: e.g.,LarbCheckbox, Chicken_TacosCheckbox

    var thisRecipeClass = thisRecipeId.replace('Checkbox', ''); // this strips out Checkbox: eg, Larb, Chicken_Tacos
    var thisRecipeName = thisRecipeClass.replace(/[_]/g, ' '); // this replaces _ with a space: eg, Larb, Chicken Tacos
    var arrayPosition = recipeListData.map(function(arrayItem) {return arrayItem.name; }).indexOf(thisRecipeName);
    var thisRecipeObject = recipeListData[arrayPosition];

    // Populate or remove from grocery list
    if ($('#' + thisRecipeId).is(':checked')) {
      $('#groceryMeats').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.meats));
      $('#groceryVeggies').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.veggies));
      $('#grocerySpices').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.spices));
      $('#groceryCondiments').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.condiments));
      $('#groceryDry').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.dry));
      $('#groceryOther').append("<div class=" + thisRecipeClass + ">" + ingredientList(thisRecipeObject.other));
    } else {
      $('.' + thisRecipeClass).remove();
    }
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
    // $('#groceryMeats').append(ingredientList(thisRecipeObject.meats));

};
