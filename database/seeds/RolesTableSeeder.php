<?php

use App\Role;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $student = new Role();
        $student->name         = 'student';
        $student->display_name = 'Student'; // optional
        $student->description  = 'The user is a student'; // optional
        $student->save();

        $teacher = new Role();
        $teacher->name         = 'teacher';
        $teacher->display_name = 'Teacher'; // optional
        $teacher->description  = 'The user is a teacher'; // optional
        $teacher->save();

        $admin = new Role();
        $admin->name         = 'admin';
        $admin->display_name = 'User Administrator'; // optional
        $admin->description  = 'User is allowed to manage and edit other users'; // optional
        $admin->save();
    }
}
