<?php

namespace App\Services;

use App\Models\Entry;
use App\Models\Fixture;
use App\Models\Gameweek;
use App\Models\Player;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class FantasyScoreService
{
    protected $scoring = [
        'assists' => 3,
        'bonus' => 1,
        'clean_sheets_DEF' => 4,
        'clean_sheets_FWD' => 0,
        'clean_sheets_GKP' => 4,
        'clean_sheets_MID' => 1,
        'concede_limit' => 2,
        'goals_conceded_DEF' => -1,
        'goals_conceded_FWD' => 0,
        'goals_conceded_GKP' => -1,
        'goals_conceded_MID' => 0,
        'goals_scored_DEF' => 6,
        'goals_scored_FWD' => 4,
        'goals_scored_GKP' => 6,
        'goals_scored_MID' => 5,
        'long_play' => 2,
        'long_play_limit' =>60,
        'own_goals' => -2,
        'penalties_missed' => -2,
        'penalties_saved' => 5,
        'red_cards' => -3,
        'saves' => 1,
        'saves_limit' => 3,
        'short_play' => 1,
        'yellow_cards' => -1,
    ];

    public function getStatScore($stat,$value) {
        $score = 0;
        if(empty($this->scoring[$stat])) return $score;
        $score = $this->scoring[$stat] * $value;
        return $score;
    }

    public function updateEntryPoints(Entry $entry) {
        $tournament = $entry->tournament()->with(['gameweekStart','gameweekEnd'])->first();
        if($tournament->gameweekStart->end < Carbon::now()->timestamp)return 0;
        $points = 0;
        $picks = $entry->picks;
        $pickPoints = [];
        $players = Player::whereIn('id',$picks->pluck('player_id')->toArray())->get();
        $gameweekLimit = Gameweek::where('end','<',Carbon::now()->timestamp)
            ->where('id','<=',$tournament->gameweekEnd->id)
            ->orderByDesc('end')
            ->first();
        $fixtures = Fixture::where('gameweek_id','>=',$tournament->gameweekStart->id)
            ->where('gameweek_id','<=',$gameweekLimit->id)
            ->with(['stats', function($q) use($players){
                return $q->whereIn('player_id',$players->pluck('id')->toArray());
            }])
            ->get();
        foreach($fixtures as $fixture){
            foreach ($fixture->stats as $stat){
                $points+= $stat->points;
                $pickPoints[$stat->player_id]+= $stat->points;
            }
        }
        foreach ($pickPoints as $id=>$pps){
            $pick = $picks->firstWhere('player_id',$id);
            $pick->points = $pps;
            $pick->save();
        }
        $entry->points = $points;
        $entry->save();
        return $entry;
    }

    public function calculateGameweekStats(Gameweek $gameweek) {
        $fixtures = $gameweek->fixtures()->with('stats')->get();
        $pointsBalance = [];
        foreach ($fixtures as $fixture){
            $fixtureStats = $fixture->stats;
        }
    }
}
