<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class Front extends Controller {

    public function index() {
        return view('home', array('page' => 'home'));
    }
    
    public function search($query) {
        return view('products', array('page' => 'products'));
    }

}
