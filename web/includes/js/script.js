$(document).ready(function() {
   $('#teaching').on('mouseenter', function(){
   		$('#teaching i').hide();
   		$('#teaching form').show();
   });

      $('#student').on('mouseenter', function(){
   		$('#student i').hide();
   		$('#student form').show();
   });

    var nouveau_Champ_ajax = function(nom, categorie, donnee){
    $("#"+ nom).append( "<input type=text name=categorie_"  +  nom + "[] placeholder=\"Nom de la catégorie\"  class=\"form-control\" value=\""+ categorie +"\" ><br/>" );
    $("#"+ nom).append( "<input type=text name="  +  nom + "[]  placeholder=Donnée  class=\"form-control\" value=\""+ donnee +"\" ><br/>" );
}
});