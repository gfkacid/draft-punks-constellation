<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gameweek extends Model
{
    use HasFactory;
    public $table = 'gameweeks';
    public $fillable = ['id','name','start','end'];

    public function fixtures() {
        return $this->hasMany(Fixture::class,'gameweek_id');
    }
}
