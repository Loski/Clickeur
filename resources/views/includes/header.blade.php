<nav class="navbar navbar-toggleable-md navbar-light bg-faded col-12">
  <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="{{ URL::to('/')}}"><img src="includes/img/logo.png" class="img-responsive"> <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="{{URL::to('/ues')}}">Mes UEs</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="{{ URL::to('/questionnaires/5')}}">Mes Questionnaires</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="{{ URL::to('/questionnaires')}}">Ajouter un questionnaire</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="text" placeholder="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>