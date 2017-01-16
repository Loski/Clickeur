<?php
	include('head.php');
?>
	<div class="container">
		<div class="row" id="connexion">
				<span class="icon" id="teaching">
					<i class="fa fa-cc-mastercard fa-5x" aria-hidden="true"></i>
					<form class="form-horizontal" style="display: none;">
						<fieldset>
							<!-- Form Name -->
							<legend>Connexion</legend>
							<!-- Text input-->
							<div class="form-group">
							  <input id="id_compte" name="id_compte" placeholder="Numéro de compte" class="form-control input-md" required="" type="text">
							  <span class="help-block">Entrez votre numéro de compte</span>  
							</div>
							<!-- Password input-->
							<div class="form-group">
							    <input id="id_password" name="id_password" placeholder="Mot de passe" class="form-control input-md" required="" type="password">
							</div>
							<button type="submit" class="btn btn-primary">Se connecter</button>
						</fieldset>
					</form>
				</span>
				<span class="icon rounded" id="student">
					<i class="fa fa-graduation-cap fa-5x" aria-hidden="true"></i>
					<form class="form-horizontal" style="display: none;">
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
					</form>
				</span>
		</div>
	</div>
<?php 
	include('tail.php')
?>