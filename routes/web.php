<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::resource('ue','UeController');


Route::get('/', function () {
    return view('page');
});

Route::get('/login', function () {
    return view('page');
});

Route::get('/ues', function () {
    return view('ues')->with('ues', \App\Ue::all());
});

Route::get('/questionnaires', function () {
    return View::make('questionnaires')->with('ues', \App\Ue::all());
});

Route::get('/questionnaires/{id}', function(){
	$json = '{
  "libelle": "Albert Einstein",
  "question1": {
    "libelle": "Quel est la date de naissance de Albert Einstein ?",
    "reponse": [
      "1900",
      "1871",
      "1880"
    ]
  },
  "question2": {
    "libelle": "Quel est sa principale découverte scientifique",
    "reponse": [
      "La relativé restreinte",
      "L\'électricité",
      "la relativé général"
    ]
  }
}';
	return View::make('questionnairesList');
});