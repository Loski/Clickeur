@extends('layouts.master')

@section('title', 'Page Title')
@section('content')

<div class="container main">

	<div id="quest_List">
		<div class="box_title">LISTE DES QUESTIONNAIRES</div>
		<div class="list_header">
			<div>UE</div>
			<div>TITRE DU QUESTIONNAIRE</div>
			<div>DATE ?</div>
		</div>

		<div class="questionnaire_Row">
			<div class="UE"><a href="#">UE</a></div>
			<div class="quest_title">TITRE DU QUEST</div>
			<div class="quest_date">DATE ?</div>
		</div>
	</div>


	<!-- Si get Quest -->
	<div class="questionnaire_Display">
		<div id="launch_quest">Démarrer le QCM</div>

		<div id="UE"><a href="#">UE</a></div>
		<div id="quest_title">TITRE DU QUEST</div>
		<div id="quest_date">DATE ?</div>
		<div id="question_list">LISTE QUESTIONS
			<div>TITRE QUESTION
				<div class="reponse"><span class="rep_valide">0</span>REP</div>
				<div class="reponse">REP</div>
				<div class="reponse">REP</div>
			</div>
		</div>
	</div>

</div>
@endsection