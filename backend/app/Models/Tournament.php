<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    public function entries() {
        return $this->hasMany(Entry::class);
    }

    public function host() {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function gameweekStart() {
        return $this->belongsTo(Gameweek::class,'start_gw_id');
    }

    public function gameweekEnd() {
        return $this->belongsTo(Gameweek::class,'end_gw_id');
    }
}
