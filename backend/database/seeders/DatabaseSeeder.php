<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Fixture;
use App\Models\Gameweek;
use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Team;
use App\Services\FantasyScoreService;
use Illuminate\Database\Seeder;
use League\Csv\Reader;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // TEAMS
        $teamsCsv = Reader::createFromPath(storage_path().'/app/teams.csv', 'r');
        $teamsCsv->setHeaderOffset(0);
        $teamsRows = $teamsCsv->getRecords();
        foreach($teamsRows as $teamData){
            Team::create($teamData);
        }

        $teams = Team::all()->pluck('id','sm_id');

        // PLAYERS
        $positions = [0,'GK','D','M','F'];
        $playersjson = file_get_contents(storage_path().'/app/players.json');
        $players = json_decode($playersjson);
//        $playerPositions = [];
        unset($playersjson);
        foreach($players as $playerData){
            Player::create([
                'id' => $playerData->id,
                'name' => $playerData->web_name,
                'team_id' => $playerData->team,
                'position' => $positions[$playerData->element_type],
            ]);
//            $playerPositions[$playerData->id] = $positions[$playerData->element_type];
        }

        // GAMEWEEKS
        $gameweeksCsv = Reader::createFromPath(storage_path().'/app/gameweeks.csv', 'r');
        $gameweeksCsv->setHeaderOffset(0);

        $gameweeksRows = $gameweeksCsv->getRecords();
        foreach($gameweeksRows as $gameweekData){
            $gameweekData['start'] = Carbon::parse($gameweekData['start'])->timestamp;
            $gameweekData['end'] = Carbon::parse($gameweekData['end'])->timestamp;
            Gameweek::create($gameweekData);
        }

        // FIXTURES
        $fixturesjson = file_get_contents(storage_path().'/app/fixtures.json');
        $fixtures = json_decode($fixturesjson);
        unset($fixturesjson);
        $scoringService = new FantasyScoreService();
        foreach($fixtures as $fixtureData){
            Fixture::create([
                "id" => $fixtureData->id,
                "kickoff_time" => Carbon::parse($fixtureData->kickoff_time)->timestamp,
                "goals_away" => $fixtureData->goals_away,
                "goals_home" => $fixtureData->goals_home,
                "gameweek_id" => $fixtureData->gameweek_id,
                "team_away" => $fixtureData->team_away,
                "team_home" => $fixtureData->team_home
            ]);
            foreach ($fixtureData->stats as $stat){
                $name = $stat->s;
                if($name!=='bps'){
                    foreach ($stat->a as $a){
                        PlayerStat::create([
                            'stat_name' => $name,
                            'value' => $a->value,
                            'points' => $scoringService->getStatScore($name,$a->value),
                            'player_id' => $a->element,
                            'fixture_id' => $fixtureData->id
                        ]);
                    }
                    foreach ($stat->h as $h){
                        PlayerStat::create([
                            'stat_name' => $name,
                            'value' => $h->value,
                            'points' => $scoringService->getStatScore($name,$a->value),
                            'player_id' => $h->element,
                            'fixture_id' => $fixtureData->id
                        ]);
                    }

                }

            }
        }
    }
}
