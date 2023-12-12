<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;
    public function team() {
        return $this->belongsTo(Team::class);
    }

    public function stats() {
        return $this->hasMany(PlayerStat::class,'player_id');
    }

    public function picks() {
        return $this->hasMany(Pick::class);
    }

    public function scopeOfPosition($query,$pos){
        return $query->where('position',$pos);
    }

    public function scopeOfTeam($query,$team){
        return $query->whereHas('team',function($q) use($team){
            return $q->where('name',$team);
        });
    }
}
