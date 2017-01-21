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
  $('#newRecipeList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  // Select Recipe Checkbox click
  //$('#newRecipeList table tbody').on('click', 'td .recipeCheckbox', selectRecipe);

  // Start recipe update process
  $('#newRecipeList table tbody').on('click', 'td a.linkedituser', editRecipeInfo);

  // Cancel edit recipe
  $('#btnCancelEditRecipe').on('click', togglePanels);

  // Send updated recipe to database
  $('#btnUpdateRecipe').on('click', updateRecipe);
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
      //tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '">' + this.name + '</a></td>';
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.cuisine + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a> / <a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
      tableContent += '</tr>';
    });

    // inject the whole content string into our existing HTML table

    $('#newRecipeList table tbody').html(tableContent);
  });

};

function editRecipeInfo(event) {
  event.preventDefault();

  if($('#addRecipePanel').is(':visible')) {
    togglePanels();
  }

  var _id = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = recipeListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
  // Get our Recipe Object
  var thisRecipeObject = recipeListData[arrayPosition];

  // Populate edit recipe panel
  $('#editName').val(thisRecipeObject.name);
  $('#editCuisine').val(thisRecipeObject.cuisine);
  $('#editDescription').val(thisRecipeObject.description);
  $('#editPicture').val(thisRecipeObject.picture);
  $('#editMeat1').val(thisRecipeObject.meats.one);
  $('#editMeat2').val(thisRecipeObject.meats.two);
  $('#editMeat3').val(thisRecipeObject.meats.three);
  $('#editMeat4').val(thisRecipeObject.meats.four);
  $('#editVeggies1').val(thisRecipeObject.veggies.one);
  $('#editVeggies2').val(thisRecipeObject.veggies.two);
  $('#editVeggies3').val(thisRecipeObject.veggies.three);
  $('#editVeggies4').val(thisRecipeObject.veggies.four);
  $('#editSpices1').val(thisRecipeObject.spices.one);
  $('#editSpices2').val(thisRecipeObject.spices.two);
  $('#editSpices3').val(thisRecipeObject.spices.three);
  $('#editSpices4').val(thisRecipeObject.spices.four);
  $('#editCondiments1').val(thisRecipeObject.condiments.one);
  $('#editCondiments2').val(thisRecipeObject.condiments.two);
  $('#editCondiments3').val(thisRecipeObject.condiments.three);
  $('#editCondiments4').val(thisRecipeObject.condiments.four);
  $('#editDry1').val(thisRecipeObject.dry.one);
  $('#editDry2').val(thisRecipeObject.dry.two);
  $('#editDry3').val(thisRecipeObject.dry.three);
  $('#editDry4').val(thisRecipeObject.dry.four);
  $('#editOther1').val(thisRecipeObject.other.one);
  $('#editOther2').val(thisRecipeObject.other.two);
  $('#editOther3').val(thisRecipeObject.other.three);
  $('#editOther4').val(thisRecipeObject.other.four);

  $('#editRecipe').attr('rel', thisRecipeObject._id);


}; // end of editRecipeInfo function

function togglePanels(){
  $('#addRecipePanel').toggle();
  $('#editRecipePanel').toggle();
};

// Gets list of ingredients from each object in database for use in selectRecipe()
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

// function to remove empty key/value pairs from newRecipe object below
function remover(input) {
  for (var cat in input) {
    for (var ings in input[cat]){
      if (input[cat][ings] === "") {
        delete input[cat][ings];
      }
    }
  }
  return input;
};


// Add Recipe
function addRecipe(event) {
    event.preventDefault();

    // Compile all Recipe info into one object
    var newRecipe = {
        'name': $('#addRecipePanel fieldset input#inputName').val(),
        'cuisine': $('#addRecipePanel fieldset input#inputCuisine').val(),
        'description': $('#addRecipePanel fieldset input#inputDescription').val(),
        'picture': $('#addRecipePanel fieldset input#inputPicture').val(),
        'meats': {
          'one': $('#addRecipePanel fieldset input#inputMeat1').val(),
          'two': $('#addRecipePanel fieldset input#inputMeat2').val(),
          'three': $('#addRecipePanel fieldset input#inputMeat3').val(),
          'four': $('#addRecipePanel fieldset input#inputMeat4').val()
        },
        'veggies': {
          'one': $('#addRecipePanel fieldset input#inputVeggies1').val(),
          'two': $('#addRecipePanel fieldset input#inputVeggies2').val(),
          'three': $('#addRecipePanel fieldset input#inputVeggies3').val(),
          'four': $('#addRecipePanel fieldset input#inputVeggies4').val()
        },
        'spices': {
          'one': $('#addRecipePanel fieldset input#inputSpices1').val(),
          'two': $('#addRecipePanel fieldset input#inputSpices2').val(),
          'three': $('#addRecipePanel fieldset input#inputSpices3').val(),
          'four': $('#addRecipePanel fieldset input#inputSpices4').val()
        },
        'condiments': {
          'one': $('#addRecipePanel fieldset input#inputCondiments1').val(),
          'two': $('#addRecipePanel fieldset input#inputCondiments2').val(),
          'three': $('#addRecipePanel fieldset input#inputCondiments3').val(),
          'four': $('#addRecipePanel fieldset input#inputCondiments4').val()
        },
        'dry': {
          'one': $('#addRecipePanel fieldset input#inputDry1').val(),
          'two': $('#addRecipePanel fieldset input#inputDry2').val(),
          'three': $('#addRecipePanel fieldset input#inputDry3').val(),
          'four': $('#addRecipePanel fieldset input#inputDry4').val()
        },
        'other': {
          'one': $('#addRecipePanel fieldset input#inputOther1').val(),
          'two': $('#addRecipePanel fieldset input#inputOther2').val(),
          'three': $('#addRecipePanel fieldset input#inputOther3').val(),
          'four': $('#addRecipePanel fieldset input#inputOther4').val()
        }
      };

     newRecipe = remover(newRecipe);

        // Use AJAX to post the object to our addrecipe service
        $.ajax({
            type: 'POST',
            data: newRecipe,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addRecipe fieldset input').val('');

                //show successful message
                $('#addRecipe').append("<span class='textTimer'>Recipe was added successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
                }, 2000);

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
      };

// Update Recipe once edited
function updateRecipe(event) {
  event.preventDefault();

  // Compile all Recipe info into one object
  var updatedRecipe = {
      'name': $('#editRecipe fieldset input#editName').val(),
      'cuisine': $('#editRecipe fieldset input#editCuisine').val(),
      'description': $('#editRecipe fieldset input#editDescription').val(),
      'picture': $('#editRecipe fieldset input#editPicture').val(),
      'meats': {
        'one': $('#editRecipe fieldset input#editMeat1').val(),
        'two': $('#editRecipe fieldset input#editMeat2').val(),
        'three': $('#editRecipe fieldset input#editMeat3').val(),
        'four': $('#editRecipe fieldset input#editMeat4').val()
      },
      'veggies': {
        'one': $('#editRecipe fieldset input#editVeggies1').val(),
        'two': $('#editRecipe fieldset input#editVeggies2').val(),
        'three': $('#editRecipe fieldset input#editVeggies3').val(),
        'four': $('#editRecipe fieldset input#editVeggies4').val()
      },
      'spices': {
        'one': $('#editRecipe fieldset input#editSpices1').val(),
        'two': $('#editRecipe fieldset input#editSpices2').val(),
        'three': $('#editRecipe fieldset input#editSpices3').val(),
        'four': $('#editRecipe fieldset input#editSpices4').val()
      },
      'condiments': {
        'one': $('#editRecipe fieldset input#editCondiments1').val(),
        'two': $('#editRecipe fieldset input#editCondiments2').val(),
        'three': $('#editRecipe fieldset input#editCondiments3').val(),
        'four': $('#editRecipe fieldset input#editCondiments4').val()
      },
      'dry': {
        'one': $('#editRecipe fieldset input#editDry1').val(),
        'two': $('#editRecipe fieldset input#editDry2').val(),
        'three': $('#editRecipe fieldset input#editDry3').val(),
        'four': $('#editRecipe fieldset input#editDry4').val()
      },
      'other': {
        'one': $('#editRecipe fieldset input#editOther1').val(),
        'two': $('#editRecipe fieldset input#editOther2').val(),
        'three': $('#editRecipe fieldset input#editOther3').val(),
        'four': $('#editRecipe fieldset input#editOther4').val()
      }
    };

    updatedRecipe = remover(updatedRecipe);

      // Use AJAX to post the object to our adduser service
      $.ajax({
          type: 'PUT',
          data: updatedRecipe,
          url: '/users/updaterecipe/' + $('#editRecipe').attr('rel'),
          dataType: 'JSON'
      }).done(function( response ) {
          // Check for successful (blank) response
          if (response.msg === '') {

              // Clear the form inputs
              $('#editRecipe fieldset input').val('');

              //show successful message
              $('#editRecipe').append("<span class='textTimer'>Recipe was updated successfully!</span>");
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

// Delete Recipe
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this recipe?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {

              //show successful message
              if($('#addRecipePanel').is(':visible')) {
                $('#addRecipe').append("<span class='textTimer'>Recipe was deleted successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
                }, 2000);
              } else {
                $('#editRecipe').append("<span class='textTimer'>Recipe was deleted successfully!</span>");
                setTimeout( function(){
                  $('.textTimer').remove();
              }, 2000);
            }

            } else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
