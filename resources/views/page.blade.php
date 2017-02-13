@extends('layouts.master')

@section('title', 'Page Title')
@section('content')
<div class="container top_elem">
	<div class="row" id="connexion">
		<span class="icon main" id="student">
			<i class="fa fa-graduation-cap fa-5x" aria-hidden="true"></i>
			{!! Form::open(array('url' => 'foo/bar', 'class' => "form-horizontal", 'style' =>"display:none")) !!}
				<fieldset>
					<!-- Form Name -->
					<legend>Connexion</legend>
					<!-- Text input-->
					<div class="form-group">
					  <input id="id_compte" name="id_compte" placeholder="Numéro de compte" class="form-control input-md" required="" type="text">
					  <span class="help-block">Entrez votre numéro de compte</span>  
					</div>
					<div class="form-group">
					  <input id="nom_compte" name="nom_compte" placeholder="Nom" class="form-control input-md" required="" type="text">
					</div>
					<div class="form-group">
					  <input id="prenom_compte" name="prenom_compte" placeholder="Prénom" class="form-control input-md" required="" type="text">
					</div>
					<button type="submit" class="btn btn-primary">Se connecter</button>
				</fieldset>
			{!! Form::close() !!}
		</span>
	</div>
</div>
@endsection