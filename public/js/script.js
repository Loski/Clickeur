$(document).ready(function() {
   $('#teaching').on('mouseenter', function(){
   		$('#teaching i').hide();
   		$('#teaching form').show();
   });

      $('#student').on('mouseenter', function(){
   		$('#student i').hide();
   		$('#student form').show();
   });

    var nouveau_champ = function(nom, categorie, donnee){
    $("#"+ nom).append( "" );
  }
  $('.delete').on('click', function(){
    $(this).parent().parent().remove();
  })
  $('#nom_ue').selectpicker("show");
});