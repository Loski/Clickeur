<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use Illuminate\Support\Facades\Hash;

$factory->define(App\User::class, function (Faker\Generator $faker) {

    return [
        'username' => $faker->numberBetween(3500000,3700000),
        'lastName' => $faker->lastName,
        'firstName' => $faker->firstName,
        'password' => Hash::make('password'),
    ];
});
$factory->define(App\Ue::class, function (Faker\Generator $faker) {

    return [
        'name' => $faker->sentence,
        'code_ue' => $faker->regexify('^[1-5]I[0-9]{3}'),
    ];
});
