// DOM Ready

// $(document).ready(function(){
//   console.log("Heyo!");
// });

// No jquery document ready
// window.onload = function() {
//   console.log("Heyo!");
// }

window.onload = printPage();

function printPage() {
  console.log("Hello this is printPage");
  window.print();
};
