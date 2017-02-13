<?php

use App\Role;
use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();
        for ($i = 0; $i < 10; $i++){
            $user = factory(App\User::class)->make();
            $user->setPasswordAttribute('password');
            $user->save();
            $user->attachRole(Role::where('name','student')->firstOrFail());
        }
        for ($i = 0; $i < 5; $i++){
            $user = factory(App\User::class)->make();
            $user->setPasswordAttribute('password');
            $user->username = $faker->userName;
            $user->save();
            $user->attachRole(Role::where('name','teacher')->firstOrFail());
        }
    }
}
