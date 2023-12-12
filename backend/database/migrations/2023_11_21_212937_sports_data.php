<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /* SPORTS DATA */

        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name');
//            $table->unsignedBigInteger('sm_id')->unique();
            $table->string('color')->nullable();
            $table->string('crest')->nullable();
            $table->timestamps();
        });

        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
//            $table->unsignedBigInteger('sm_id')->unique();
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('price')->nullable();
            $table->string('position');
            $table->foreign('team_id')->references('id')->on('teams');
            $table->timestamps();
        });

        Schema::create('gameweeks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('start');
            $table->integer('end');
            $table->timestamps();
        });

        Schema::create('fixtures', function (Blueprint $table) {
            $table->id();
//            $table->unsignedBigInteger('sm_id')->unique();
            $table->integer('kickoff_time');
            $table->unsignedBigInteger('gameweek_id');
            $table->unsignedBigInteger('team_home');
            $table->unsignedBigInteger('team_away');
            //$table->unsignedInteger('status')->default(0); // 0 = pending | 1 = running | 2 = ended | 3 = postponed | 4 = cancelled
//            $table->string('result'); // tracks home team, so values are W / D / L
            $table->unsignedSmallInteger('goals_home')->nullable();
            $table->unsignedSmallInteger('goals_away')->nullable();
            $table->foreign('gameweek_id')->references('id')->on('gameweeks');
            $table->foreign('team_home')->references('id')->on('teams');
            $table->foreign('team_away')->references('id')->on('teams');
            $table->timestamps();
        });

        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->string('stat_name');
            $table->integer('value')->default(0);
            $table->integer('points')->default(0);
            $table->unsignedBigInteger('player_id');
            $table->unsignedBigInteger('fixture_id');
            $table->foreign('player_id')->references('id')->on('players');
            $table->foreign('fixture_id')->references('id')->on('fixtures');
            $table->timestamps();
        });

        /* TOURNAMENT DATA */
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_user_created')->default(1);
            $table->unsignedBigInteger('host_id')->nullable();
            $table->unsignedBigInteger('buy_in'); //
            $table->unsignedBigInteger('start_gw_id');
            $table->unsignedBigInteger('end_gw_id');
            $table->integer('registration_end');
            $table->string('status')->default('Registering'); // Rergistering | Running | Ended | Cancelled
            $table->unsignedInteger('entries')->default(0);
            $table->unsignedInteger('min_entries')->default(2);
            $table->unsignedInteger('max_entries')->default(64);
            $table->unsignedBigInteger('prize_pool')->default(0);
            $table->foreign('host_id')->references('id')->on('users');
            $table->foreign('start_gw_id')->references('id')->on('gameweeks');
            $table->foreign('end_gw_id')->references('id')->on('gameweeks');
            $table->timestamps();
        });

        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('squad_token_id')->nullable();
            $table->integer('points')->default(0);
//            $table->unsignedInteger('standing')->default(1);
            $table->foreign('tournament_id')->references('id')->on('tournaments');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });

        Schema::create('picks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->unsignedBigInteger('entry_id');
            $table->unsignedBigInteger('player_id');
            $table->integer('points')->default(0);
            $table->foreign('tournament_id')->references('id')->on('tournaments');
            $table->foreign('entry_id')->references('id')->on('entries');
            $table->foreign('player_id')->references('id')->on('players');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('picks');
        Schema::dropIfExists('entries');
        Schema::dropIfExists('tournaments');
        Schema::dropIfExists('player_stats');
        Schema::dropIfExists('fixtures');
        Schema::dropIfExists('gameweeks');
        Schema::dropIfExists('players');
        Schema::dropIfExists('teams');
    }
};
