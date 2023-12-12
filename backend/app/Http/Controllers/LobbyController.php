<?php

namespace App\Http\Controllers;
use App\Models\Entry;
use App\Models\Gameweek;
use App\Models\Pick;
use App\Models\Tournament;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LobbyController extends Controller
{
    public function tournaments() {
        $tournaments = Tournament::whereNot('status','Ended')
            ->with(['host','gameweekStart','gameweekEnd'])
            ->withCount('entries')
            ->orderBy('start_gw_id')
            ->get();
        return response()->json($tournaments);
    }

    public function register(Request $request){
        $tournament = Tournament::findOrFail($request->get('tournament_id'));
        if(Carbon::now()->gte(Carbon::createFromTimestamp($tournament->registration_end))){
            return response()->json(['status' => 'error' , 'msg' => 'Registration is closed'] , 500);
        }
        $entry = new Entry([
            'tournament_id' => $tournament->id,
            'user_id' => 1,
            'squad_token_id' => $request->get('token_id')
        ]);
        $entry->save();
        $tournament->prizepool = $tournament->prizepoo + ($tournament->buy_in * 0.9);
        $tournament->save();
        return response()->json(['status' => 'success']);
    }

    public function createTournament(Request $request){
        $this->validate($request,[
            'name' => 'required',
            'buy_in' => 'required|numeric|min:1',
            'min_entries' => 'required|numeric|min:2|max:64',
            'max_entries' => 'required|numeric|min:2|max:64',
            'start_gw_id' => 'required|exists:gameweeks,id',
            'end_gw_id' => 'required|exists:gameweeks,id',
        ]);
        $gwStart = Gameweek::find($request->get('start_gw_id'));
        $tournament = new Tournament($request->all());
//        $tournament->host_id =
        $tournament->is_user_created = 1;
        $tournament->registration_end = Carbon::createFromTimestamp($gwStart->start)->subHour()->timestamp;
        $tournament->save();
    }

    public function pickSquad(Request $request){
        $this->validate($request,[
            'tournament_id' => 'required|exists:tournaments,id',
            'token_id' => 'required|exists:entries,squad_token_id',
            'picks' => 'required|array|size:15'
        ]);
        $entry = Entry::where('squad_token_id',$request->get('token_id'))->firstOrFail();
        foreach ($request->get('picks') as $playerPick){
            $pick = new Pick([
                'tournament_id' => $request->get('tournament_id'),
                'entry_id' => $entry->id,
                'player_id'=> $playerPick,
            ]);
            $pick->save();
        }
        return response()->json(['status' => 'success']);
    }

    public function tournamentInfo($id){
        $tournament = Tournament::where('id',$id)->with(['gameweekStart','gameweekEnd','entries' => function($q){
            return $q->with(['user','picks.player'])->orderByDesc('points');
        }])->firstOrFail();
        $tournament->status = Carbon::parse($tournament->gameweekStart->start - 3600)->gt(Carbon::now()) ? 'Registering' :
            (Carbon::parse($tournament->gameweekEnd->end)->lt(Carbon::now()) ? 'Ended' : 'Running');
        return response()->json($tournament);
    }
}
