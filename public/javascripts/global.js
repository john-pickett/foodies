// Recipe list data array for filling in info box
var recipeListData = [];

// DOM Ready
$(document).ready(function(){

  // Populate the user table on initial page load
  populateTable();

  // Recipe name link click
  $('#recipeList table tbody').on('click', 'td a.linkshowuser', showRecipeInfo);

  // Add Recipe button click
  $('#btnAddRecipe').on('click', addRecipe);

  // Delete Recipe link click
  $('#recipeList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

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
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // inject the whole content string into our existing HTML table
    $('#recipeList table tbody').html(tableContent);
  });

};

// Gets list of ingredients from each object in database for use in showRecipeInfo()
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

// Add Recipe
function addRecipe(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'name': $('#addUser fieldset input#inputName').val(),
            'cuisine': $('#addUser fieldset input#inputCuisine').val()
            // 'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            // 'age': $('#addUser fieldset input#inputUserAge').val(),
            // 'location': $('#addUser fieldset input#inputUserLocation').val(),
            // 'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
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
            }
            else {
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
