$('body').on('click', '#menu_toggle', function(e) {
    e.preventDefault();
    $('body').toggleClass('nav-md nav-sm');
    setContentHeight();
  });