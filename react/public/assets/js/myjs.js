  document.addEventListener("DOMContentLoaded", function(event) {
   
const showNavbar = (toggleId, navId, bodyId, headerId) =>{
const toggle = document.getElementById(toggleId),
nav = document.getElementById(navId),
bodypd = document.getElementById(bodyId),
headerpd = document.getElementById(headerId)

// Validate that all variables exist
if(toggle && nav && bodypd && headerpd){
toggle.addEventListener('click', ()=>{
// show navbar
nav.classList.toggle('show_sidebar')
// change icon
toggle.classList.toggle('bx-x')
// add padding to body
bodypd.classList.toggle('body-pd')
// add padding to header
//headerpd.classList.toggle('body-pd')
})
}
}

showNavbar('header-toggle','nav-bar','body-pd','header')

/*===== LINK ACTIVE =====*/
const linkColor = document.querySelectorAll('.nav_link')

function colorLink(){
if(linkColor){
linkColor.forEach(l=> l.classList.remove('active'))
this.classList.add('active')
this.classList.add('active1')
}
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))

 // Your code to run since DOM is loaded and ready
});
$(document).ready(function () {
     $('#example').DataTable({
        "info": false,
        "paging": false,
         /*'columnDefs': [{
        'orderable': false,
        'targets': 0 /* 1st one, start by the right * /
    }],
         order: [[2, 'asc']], 
    stateSave: false,
    language: {
        "url": "https://cdn.datatables.net/plug-ins/1.10.11/i18n/Russian.json"
    }
    ,*/
        'columnDefs': [{
    'targets': [0,6],
    'searchable': false,
    'orderable': false,
  }],
  'order': [
    [1, 'asc']
  ],
            "searching": false,
            

        });
     $('.dt-column-title:first').addClass('d-flex');
     $('tbody>tr>td').addClass('px-3 p-2');
     $('tbody>tr>th').removeClass('px-4');
  

});

/*if($(".card_profile_bg_image .row>*").width() == "100%")
{
    alert(1);
    $(".card-text-profile span").css("fontSize", "1.3rem");
}
else
{
    alert("no");
}*/