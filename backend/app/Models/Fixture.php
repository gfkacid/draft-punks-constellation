<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fixture extends Model
{
    use HasFactory;

    public $fillable = ["id","kickoff_time","goals_away","goals_home","gameweek_id","team_away","team_home"];

    public function gameweek() {
        return $this->belongsTo(Gameweek::class,'gameweek_id');
    }

    public function stats() {
        return $this->hasMany(PlayerStat::class,'fixture_id');
    }

    public function teamHome(){
        return $this->belongsTo(Team::class,'team_home');
    }

    public function teamAway(){
        return $this->belongsTo(Team::class,'team_away');
    }


}
