@extends('layouts.master')

@section('title', 'Page Title')
@section('content')

<div class="container main">
	<form id="questionnaire">
		{!! Form::open(array('url' => 'foo/bar', 'class' => "form-horizontal", 'style' =>"display:none")) !!}
		<fieldset>
			<legend>Ajouter un nouveau questionnaire</legend>
			<div class="row">
				<select class="selectpicker col-6"  data-live-search="true" name ="nom_ue" id="nom_ue">
					<option selected value="0">Pas d'UE sélectionné</option>
				</select>
				<label for="new_ue" class="col-2 col-form-label">Créer un nouvelle UE</label>
				<div class="col-4">
					<input type="text" class="form-control" placeholder="Nom UE" name="new_ue" id="new_ue">
				</div>
			</div>
			<div class="row">
				<select class="selectpicker col-6" data-live-search="true" name ="seance_ue" id="seance_ue">
					<option selected value="0">Créer une nouvelle séance</option>
					<!--fetch seance -->
				</select>
			<label for="new_seance" class="col-2 col-form-label">Nouvelle séance</label>
				<div class="col-4">
					<input type="datetime" class="form-control" placeholder="Date séance" name="new_seance" id="new_seance">
				</div>
			</div>
			<div class="question" id="question_1">
				<div class="form-group row ">
					<label for="question_1_input" class="col-2 col-form-label">Question 1</label>
					<div class="col-10">
						<input type="text" autocapitalize="sentences" required class="form-control" placeholder="Question" name="question_1_input" id="question_1_input">
					</div>
				</div>
				<div class="reponseList">
					<div class="form-group row reponse">
						<label for="reponse_1_question_1" class="col-2 col-form-label">Réponse 1</label>
						<div class="col-6">
							<textarea  name="reponse_1_question_1" class="form-control" required></textarea>
						</div>
						<div class="col-3 offset-1">
							<label class="col-form-label reponse_valide">
					  			<input  class="form-check" type="checkbox" id="cbox1_reponse_1_question_1" value="checkbox1">
					  			Réponse correcte.
					  		</label>
					  	<i class="fa fa-trash-o fa-2x delete" aria-hidden="true"></i>
						</div>
					</div>
					<div class="form-group row reponse">
						<label for="reponse_2_question_1" class="col-2 col-form-label">Réponse 2</label>
						<div class="col-6">
							<textarea  name="reponse_2_question_1" class="form-control" required></textarea>
						</div>
						<div class="col-3 offset-1">
							<label class="col-form-label reponse_valide">
					  			<input  class="form-check" type="checkbox" id="cbox1_reponse_2_question_1" value="checkbox2">
					  			Réponse correcte.
							</label>
							<i class="fa fa-trash-o fa-2x delete" aria-hidden="true"></i>
						</div>
					</div>
				</div>
			<button type="button" class="btn btn-primary new_Rep">Nouvelle réponse</button>
			</div>
			<button type="button" id="new_Quest" class="btn btn-primary">Nouvelle question</button>
		</fieldset>
		{!! Form::close() !!}
		<button type="submit" class="btn btn-primary">Enregistrer</button>
	</form>
</div>
@endsection