// Recipe list data array for filling in info box
var recipeListData = [];

// DOM Ready
$(document).ready(function(){

  // Populate the user table on initial page load
  populateTable();

  // Recipe name link click
  //$('#newRecipeList table tbody').on('click', 'td a.linkshowuser', showRecipeInfo);

  // Add Recipe button click
  $('#btnAddRecipe').on('click', addRecipe);

  // Delete Recipe link click
  $('#newRecipeList table tbody').on('click', 'td a.linkdeleteuser', deleteRecipe);

  // Select Recipe Checkbox click
  //$('#newRecipeList table tbody').on('click', 'td .recipeCheckbox', selectRecipe);

  // Start recipe update process
  $('#newRecipeList table tbody').on('click', 'td a.linkedituser', editRecipeInfo);

  // Cancel edit recipe
  $('#btnCancelEditRecipe').on('click', togglePanels);

  // Send updated recipe to database
  $('#btnUpdateRecipe').on('click', updateRecipe);

  // Toggle Edit/Delete Options
  $('#newRecipeList table thead').on('click', 'th a.editToggle', toggleDelete);

  // Clear all inputs
  $('#btnClear').on('click', clearAll);
});

// Functions

function populateTable(){

  //empty content string
  var tableContent = '';

  // jquery AJAX call for JSON
  $.getJSON('/recipes/recipelist', function (data){

    // adds all user info from database to the global variable
    recipeListData = data;

    // for each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      //tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.cuisine + '</td>';
      tableContent += '<td><a href="#" style="color: white; background-color: red; padding: 2px;" class="linkdeleteuser deleterecipe" rel="' + this._id + '">Delete?</a> <a href="#" class="linkedituser editrecipe" rel="' + this._id + '">Edit</a></td>';
      tableContent += '</tr>';
    });

    // inject the whole content string into our existing HTML table
    $('#newRecipeList table tbody').html(tableContent);
  });
};

function toggleDelete(event) {
  event.preventDefault();
  $('.deleterecipe').toggle();
  $('.editrecipe').toggle();
}

// This populates the edit recipe panel with the recipe's info
function editRecipeInfo(event) {
  event.preventDefault();

  if($('.addRecipePanel').is(':visible')) {
    togglePanels();
  }

  // clear any inputs in Add & Edit Recipe Panel
  $('.addRecipe fieldset input').val('');
  $('.addRecipe fieldset textarea').val('');
  $('.editRecipe fieldset input').val('');
  $('.editRecipe fieldset textarea').val('');

  var _id = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = recipeListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
  // Get our Recipe Object
  var thisRecipeObject = recipeListData[arrayPosition];
  // Populate Edit Recipe Panel
  $('#editName').val(thisRecipeObject.name);
  $('#editCuisine').val(thisRecipeObject.cuisine);
  $('#editDescription').val(thisRecipeObject.description);
  $('#editPicture').val(thisRecipeObject.picture);
  $('#editRating').val(thisRecipeObject.rating);
  $('#editRecipeText').val(thisRecipeObject.recipe);
  $('#editServing').val(thisRecipeObject.serving);
  $('#editTags').val(thisRecipeObject.tags);
  $('#editMeats').val(ingredientList(thisRecipeObject.ingredients.meats));
  $('#editVeggies').val(ingredientList(thisRecipeObject.ingredients.veggies));
  $('#editSpices').val(ingredientList(thisRecipeObject.ingredients.spices));
  $('#editCondiments').val(ingredientList(thisRecipeObject.ingredients.condiments));
  $('#editDry').val(ingredientList(thisRecipeObject.ingredients.dry));
  $('#editOther').val(ingredientList(thisRecipeObject.ingredients.other));
  $('#editCompanion').val(thisRecipeObject.companionname);
  $('#editCompanionMeats').val(ingredientList(thisRecipeObject.companion.meats));
  $('#editCompanionVeggies').val(ingredientList(thisRecipeObject.companion.veggies));
  $('#editCompanionSpices').val(ingredientList(thisRecipeObject.companion.spices));
  $('#editCompanionCondiments').val(ingredientList(thisRecipeObject.companion.condiments));
  $('#editCompanionDry').val(ingredientList(thisRecipeObject.companion.dry));
  $('#editCompanionOther').val(ingredientList(thisRecipeObject.companion.other));

  $('.editRecipe').attr('rel', thisRecipeObject._id);


}; // end of editRecipeInfo function

function togglePanels(){
  $('.addRecipePanel').toggle();
  $('.editRecipePanel').toggle();
};

// Gets list of ingredients from each category in thisRecipeObject
var ingredientList = function(list) {
  var ingredients = "";
  list.forEach(function(item){
    ingredients += item + ";";
  })
  return ingredients;
};

// this takes a comma-separated string of ingredients, and turns them into
// an array of arrays to store in the database and recipe object.
// used to split by commas, hence the name. now splits by semi-colons
// kept the name commaSplitter because colonSplitter sounds painful
function commaSplitter(list) {
  var newArr = [];
  var currentArr = [];
  list = list.split(';');
  for (var i = 0; i < list.length; i++) {
    if (list[i].charAt(0) === " "){
     list[i] = list[i].replace(" ", "");
    }
   currentArr.push(list[i]);
   newArr.push(currentArr);
   currentArr = [];
  }
  return newArr;
}

function clearAll(event) {
  event.preventDefault;
  $('.addRecipe fieldset input').val('');
  $('.addRecipe fieldset textarea').val('');
  $('.editRecipe fieldset input').val('');
  $('.editRecipe fieldset textarea').val('');
}

// Add Recipe
function addRecipe(event) {
    event.preventDefault();

    // Compile all Recipe info into one object
    var newRecipe = {
        'name': $('.addRecipePanel fieldset input#inputName').val(),
        'cuisine': $('.addRecipePanel fieldset input#inputCuisine').val(),
        'description': $('.addRecipePanel fieldset textarea#inputDescription').val(),
        'picture': $('.addRecipePanel fieldset input#inputPicture').val(),
        'rating': $('.addRecipePanel fieldset input#inputRating').val(),
        'recipe': $('.addRecipePanel fieldset textarea#inputRecipeText').val(),
        'serving': $('.addRecipePanel fieldset input#inputServing').val(),
        'tags': $('.addRecipePanel fieldset input#inputTags').val(),
        'ingredients': {
          'meats': commaSplitter($('.addRecipePanel fieldset textarea#inputMeats').val()),
          'veggies': commaSplitter($('.addRecipePanel fieldset textarea#inputVeggies').val()),
          'spices': commaSplitter($('.addRecipePanel fieldset textarea#inputSpices').val()),
          'condiments': commaSplitter($('.addRecipePanel fieldset textarea#inputCondiments').val()),
          'dry': commaSplitter($('.addRecipePanel fieldset textarea#inputDry').val()),
          'other': commaSplitter($('.addRecipePanel fieldset textarea#inputOther').val()),
        },
        'companionname': $('.addRecipePanel fieldset textarea#inputCompanion').val(),
        'companion': {
          'meats': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionMeats').val()),
          'veggies': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionVeggies').val()),
          'spices': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionSpices').val()),
          'condiments': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionCondiments').val()),
          'dry': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionDry').val()),
          'other': commaSplitter($('.addRecipePanel fieldset textarea#inputCompanionOther').val())
        }
      };

        // Use AJAX to post the object to our addrecipe service
        $.ajax({
            type: 'POST',
            data: newRecipe,
            url: '/recipes/addrecipe',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('.addRecipe fieldset input').val('');
                $('.addRecipe fieldset textarea').val('');

                //show successful message
                $('.addRecipe').append("<span class='textTimer'>Recipe was added successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
                }, 2000);

                // Update the table
                populateTable();
            } else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
      };

// Update Recipe in database once it has been edited
function updateRecipe(event) {
  event.preventDefault();

  // Compile all Recipe info into one object
  var updatedRecipe = {
      'name': $('.editRecipePanel fieldset input#editName').val(),
      'cuisine': $('.editRecipePanel fieldset input#editCuisine').val(),
      'description': $('.editRecipePanel fieldset textarea#editDescription').val(),
      'picture': $('.editRecipePanel fieldset input#editPicture').val(),
      'rating': $('.editRecipePanel fieldset input#editRating').val(),
      'recipe': $('.editRecipePanel fieldset textarea#editRecipeText').val(),
      'serving': $('.editRecipePanel fieldset input#editServing').val(),
      'tags': $('.editRecipePanel fieldset input#editTags').val(),
      'ingredients': {
        'meats': commaSplitter($('.editRecipePanel fieldset textarea#editMeats').val()),
        'veggies': commaSplitter($('.editRecipePanel fieldset textarea#editVeggies').val()),
        'spices': commaSplitter($('.editRecipePanel fieldset textarea#editSpices').val()),
        'condiments': commaSplitter($('.editRecipePanel fieldset textarea#editCondiments').val()),
        'dry': commaSplitter($('.editRecipePanel fieldset textarea#editDry').val()),
        'other': commaSplitter($('.editRecipePanel fieldset textarea#editOther').val()),
      },
      'companionname': $('.editRecipePanel fieldset textarea#editCompanion').val(),
      'companion': {
        'meats': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionMeats').val()),
        'veggies': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionVeggies').val()),
        'spices': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionSpices').val()),
        'condiments': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionCondiments').val()),
        'dry': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionDry').val()),
        'other': commaSplitter($('.editRecipePanel fieldset textarea#editCompanionOther').val())
      }
    };

      // Use AJAX to post the object to our Add Recipe service
      $.ajax({
          type: 'PUT',
          data: updatedRecipe,
          url: '/recipes/updaterecipe/' + $('.editRecipe').attr('rel'),
          dataType: 'JSON'
      }).done(function( response ) {
          // Check for successful (blank) response
          if (response.msg === '') {

              // Clear the form inputs
              $('.editRecipe fieldset input').val('');
              $('.editRecipe fieldset textarea').val('');

              //show successful message
              $('.editRecipe').append("<span class='textTimer'>Recipe was updated successfully!</span>");
              setTimeout( function(){
                $('.textTimer').remove();
              }, 2000);
              populateTable();
          } else {
              // If something goes wrong, alert the error message that our service returned
              alert('Error: ' + response.msg);
          }
      });
  };

// Delete Recipe
function deleteRecipe(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this recipe?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/recipes/deleterecipe/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
              //show successful message
              if($('.addRecipePanel').is(':visible')) {
                $('.addRecipe').append("<span class='textTimer'>Recipe was deleted successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
                }, 2000);
                $('.addRecipe fieldset input').val('');
                $('.addRecipe fieldset textarea').val('');
              } else {
                $('.editRecipe').append("<span class='textTimer'>Recipe was deleted successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
              }, 2000);
              $('.editRecipe fieldset input').val('');
              $('.editRecipe fieldset textarea').val('');
            }
            } else {
                alert('Error: ' + response.msg);
            }
            populateTable();

        });
    }
    else {
        return false;
    }
};
