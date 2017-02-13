<?php

use App\Role;
use App\Ue;
use Illuminate\Database\Seeder;

class UesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Ue::class, 5)->create()->each(function (Ue $ue) {
            $ue->users()->saveMany(
                Role::where('name', 'student')->first()->users()->get()->random(5)
            );
            $ue->users()->saveMany(
                Role::where('name', 'teacher')->first()->users()->get()->random(2)
            );
        });
    }
}
