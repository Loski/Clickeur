$(document).ready(function() {
   
  $('#teaching').on('mouseenter', function(){
  	$('#teaching i').hide();
  	$('#teaching form').show();
  });

  $('#student').on('mouseenter', function(){
    $('#student i').hide();
    $('#student form').show();
  });
  
  $('body').on('click','.delete', function(){
      //if($(".delete").eq($(this))>=2)
        $(this).parent().parent().remove();
  })

  $('body').on('click', '.new_Rep', function(){
    var numRep =  $(this).closest( ".question" ).find('.reponse').length + 1;
    var numQuestion =  $(".question").index($(this).closest( ".question" )) + 1;

    if(numRep>=0 && numRep<=6)
    {
      var balise = `
            <div class="form-group row reponse">
              <label for="reponse_${numRep}_question_${numQuestion}" class="col-2 col-form-label">Réponse ${numRep}</label>
              <div class="col-6">
                <textarea  name="reponse_${numRep}_question_${numQuestion}" class="form-control" required></textarea>
              </div>
              <div class="col-3 offset-1">
                <label class="col-form-label reponse_valide">
                    <input  class="form-check" type="checkbox" id="cbox1_reponse_${numRep}_question_${numQuestion}" value="checkbox1">
                    Réponse correcte.
                  </label>
                <i class="fa fa-trash-o fa-2x delete" aria-hidden="true"></i>
              </div>
            </div>
            `;

      $(this).closest( ".question" ).find('.reponseList').eq(0).append(balise);
    }
    else
    {
      $("#errorAddingRep").remove();

      var balise = `<div id="errorAddingRep"> Pas plus de 6 réponses
      </div>
            `;

      $(this).closest( ".question" ).find('.reponseList').eq(0).append(balise);
    }

  })

  $('body').on('click','#new_Quest',function(){
     
    var numQuestion =  $(".question").length +1;

    if(numQuestion>=0 && numQuestion<=6)
    {
      var balise = `
      <div class="question" id="question_${numQuestion}">
        <div class="form-group row ">
          <label for="question_${numQuestion}_input" class="col-2 col-form-label">Question ${numQuestion}</label>
          <div class="col-10">
            <input type="text" autocapitalize="sentences" required class="form-control" placeholder="Question" name="question_${numQuestion}_input" id="question_${numQuestion}_input">
          </div>
        </div>
        <div class="reponseList">
          <div class="form-group row reponse">
            <label for="reponse_1_question_${numQuestion}" class="col-2 col-form-label">Réponse 1</label>
            <div class="col-6">
              <textarea  name="reponse_1_question_${numQuestion}" class="form-control" required></textarea>
            </div>
            <div class="col-3 offset-1">
              <label class="col-form-label reponse_valide">
                  <input  class="form-check" type="checkbox" id="cbox1_reponse_1_question_${numQuestion}" value="checkbox1">
                  Réponse correcte.
                </label>
              <i class="fa fa-trash-o fa-2x delete" aria-hidden="true"></i>
            </div>
          </div>
          <div class="form-group row reponse">
            <label for="reponse_2_question_${numQuestion}" class="col-2 col-form-label">Réponse 2</label>
            <div class="col-6">
              <textarea  name="reponse_2_question_${numQuestion}" class="form-control" required></textarea>
            </div>
            <div class="col-3 offset-1">
              <label class="col-form-label reponse_valide">
                  <input  class="form-check" type="checkbox" id="cbox1_reponse_2_question_${numQuestion}" value="checkbox2">
                  Réponse correcte.
              </label>
              <i class="fa fa-trash-o fa-2x delete" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      <button type="button" class="btn btn-primary new_Rep">Nouvelle réponse</button>
      </div>
            `;

      //$(this).closest( "fieldset" ).append(balise);
      $(this).before(balise);
    }
    else
    {
      $("#errorAddingQuest").remove();

      var balise = `<div id="errorAddingQuest"> Pas plus de 6 questions
      </div>
            `;

      $(this).closest( "fieldset" ).append(balise);
    }
  })
    
    $('.selectpicker').selectpicker({
      style: 'btn-info',
      size: 4
    });

});