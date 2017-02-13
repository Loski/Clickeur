<?php

use App\User;
use Dingo\Api\Routing\Router;
use Tymon\JWTAuth\Facades\JWTAuth;

/** @var Router $api */
$api = app(Router::class);

$api->version('v1', function (Router $api) {

    $api->post('/auth', 'App\Http\Controllers\AuthenticateController@authenticate');
    $api->get('/token', 'App\Http\Controllers\AuthenticateController@getToken');
    $api->post('/logout', 'App\Http\Controllers\AuthenticateController@logout');
    // Authenticated only
    $api->group(['middleware' => 'jwt.auth'], function (Router $api) {
        $api->get('/user', 'App\Http\Controllers\AuthenticateController@authenticatedUser');

        $api->resource('ues', 'App\Http\Controllers\UeController', ['only' => ['index', 'show', 'store', 'update', 'destroy']]);

        // Authenticated student only
        $api->group(['middleware' => 'role:student'], function (Router $api) {
            $api->get('/student', function () {
                return response()->json('student');
            });
        });

        // Authenticated teacher only
        $api->group(['middleware' => 'role:teacher'], function (Router $api) {
            $api->get('/teacher', function () {
                return response()->json('teacher');
            });
        });

        $api->get('protected', function () {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json(['auth' => $user, 'role' => User::find($user->id)->roles()->first()]);
        });


        $api->get('refresh', [
            'middleware' => 'jwt.refresh',
            function () {
                return response()->json([
                    'message' => 'By accessing this endpoint, you can refresh your access token at each request. Check out this response headers!'
                ]);
            }
        ]);
    });
});
