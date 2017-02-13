<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUeUserTable extends Migration {

	public function up()
	{
		Schema::create('ue_user', function(Blueprint $table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->integer('ue_id')->unsigned();
		});
	}

	public function down()
	{
		Schema::drop('ue_user');
	}
}