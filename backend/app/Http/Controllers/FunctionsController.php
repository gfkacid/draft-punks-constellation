<?php

namespace App\Http\Controllers;
use App\Models\Gameweek;
use Carbon\Carbon;

class FunctionsController extends Controller
{
    public function getCurrentGameweek() {
        // get the current gameweek id
        $gameweeks = Gameweek::orderBy('start');
        $currentGameweek = null;
        $now = Carbon::now();
        foreach ($gameweeks as $gameweek){
            if($gameweek->start->lt($now) && $gameweek->end->gt($now)){
                $currentGameweek = $gameweek;
                break;
            }
            if($gameweek->start->lt($now)){

            }
        }
        //
    }
}
