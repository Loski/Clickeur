@extends('layouts.master')

@section('title', 'Page Title')
@section('content')
<div class="container top_elem">
	<div class="row" id="connexion">
		<span class="icon flat" id="student">
			{!! Form::open(array('url' => 'api/auth', 'class' => "form-horizontal")) !!}
				<fieldset>
					<!-- Form Name -->
					<legend>Connexion</legend>
					<!-- Text input-->
					<div class="form-group">
					  <input id="username" name="username" placeholder="Identifiant" class="form-control form-control-lg" required="" type="text">
					</div>
					<div class="form-group">
					  <input id="password" name="password" placeholder="Mot de passe" class="form-control form-control-lg" required="" type="password">
					</div>
					<button type="submit" class="btn btn-primary btn-lg">Se connecter</button>
				</fieldset>
			{!! Form::close() !!}
		</span>
	</div>
</div>
@endsection