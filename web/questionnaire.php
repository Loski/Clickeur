<?php
	include('head.php');
?>
<div class="container">
	<form>
		<fieldset>
			<legend>Ajouter un nouveau questionnaire</legend>
			<div class="form-group row">
				<select class="selectpicker"  data-live-search="true" name ="nom_ue" id="nom_ue">
					<option selected value="0">Pas d'UE sélectionné</option>
					<!--fetch ue -->
				</select>
			</div>
			<div class="form-group row">
				<select class="selectpicker"  data-live-search="true" name ="seance_ue" id="seance_ue">
					<option selected value="0">Créer une nouvelle séance</option>
					<!--fetch seance -->
				</select>
			</div>
			<div class="form-group row">
				<label for="question_1" class="col-2 col-form-label">Question</label>
				<div class="col-10">
					<input type="text" autocapitalize="sentences" class="form-control" placeholder="Question" name="question_1" id="question_1">
				</div>
			</div>
			<div class="form-group row">
				<label for="reponse_1" class="col-2 col-form-label">Réponse</label>
				<div class="col-10">
					<textarea  name="reponse_1" class="form-control" required></textarea>
					<label class="col-2 col-form-label">
			  			<input  class="form-check" type="checkbox" id="cbox1" value="checkbox1">
			  			Réponse correcte.
					</label>
				</div>
			</div>
		</fieldset>
	</form>
</div>

<?php 
	include('tail.php')
?>