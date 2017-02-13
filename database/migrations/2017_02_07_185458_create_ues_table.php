<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUesTable extends Migration {

	public function up()
	{
		Schema::create('ues', function(Blueprint $table) {
			$table->increments('id');
			$table->string('code_ue')->unique();
			$table->string('name');
			$table->timestamps();
		});
	}

	public function down()
	{
		Schema::drop('ues');
	}
}