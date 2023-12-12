<?php

namespace App\Http\Controllers;
use App\Models\Fixture;
use App\Models\Gameweek;
use App\Models\Player;
use App\Models\Team;
use Carbon\Carbon;

class PremiershipController extends Controller
{
    public function getPremiershipData() {
        $gameweeks = Gameweek::all();
        $fixtures = Fixture::with(['teamHome','teamAway'])->orderBy('kickoff_time')->get();
        $teams = Team::all();
        $players = Player::all();
        $current_gameweek = null;

        return response()->json(compact('gameweeks','fixtures','teams','players','current_gameweek'));
    }

    public function getGameweekFixtures($gameweekId) {
        $gameweek = Gameweek::findOrFail($gameweekId);
        $fixtures = Fixture::where('gameweek_id',$gameweek->id)->orderBy('kickoff_time')->get();
        return response()->json($fixtures);
    }

    public function getPlayerStats() {

    }
}
