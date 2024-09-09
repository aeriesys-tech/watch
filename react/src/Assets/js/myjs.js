document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // Show/hide navbar
        nav.classList.toggle("show_sidebar");
        // Change icon
        toggle.classList.toggle("bx-x");
        // Add padding to body
        bodypd.classList.toggle("body-pd");
        // Optional: Add padding to header
        // headerpd.classList.toggle('body-pd')
      });
    } else {
      console.error("Element not found in DOM");
    }
  };

  // Call the function to show navbar
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  // Active link color change
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      this.classList.add("active1");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // jQuery DataTables initialization
  $(document).ready(function () {
    $('#example').DataTable({
      'info': false,
      'paging': false,
      'columnDefs': [{
        'targets': [0, 6],
        'searchable': false,
        'orderable': false
      }],
      'order': [
        [1, 'asc']
      ],
      'searching': false
    });

    $('.dt-column-title:first').addClass('d-flex');
    $('tbody>tr>td').addClass('px-3 p-2');
    $('tbody>tr>th').removeClass('px-4');
  });
});
