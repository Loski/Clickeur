<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Eloquent\Model;

class CreateForeignKeys extends Migration {

	public function up()
	{
		Schema::table('ue_user', function(Blueprint $table) {
			$table->foreign('user_id')->references('id')->on('users')
						->onDelete('cascade')
						->onUpdate('cascade');
		});
		Schema::table('ue_user', function(Blueprint $table) {
			$table->foreign('ue_id')->references('id')->on('ues')
						->onDelete('cascade')
						->onUpdate('cascade');
		});
	}

	public function down()
	{
		Schema::table('ue_user', function(Blueprint $table) {
			$table->dropForeign('ue_user_user_id_foreign');
		});
		Schema::table('ue_user', function(Blueprint $table) {
			$table->dropForeign('ue_user_ue_id_foreign');
		});
	}
}