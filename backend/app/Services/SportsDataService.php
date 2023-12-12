<?php

namespace App\Services;

use App\Models\Fixture;
use App\Models\Gameweek;
use App\Models\Team;
use Illuminate\Support\Facades\Http;

class SportsDataService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://api.sportmonks.com/v3/';
        $this->apiKey = env('SPORTSMONKS_API_KEY');
    }

    public function getPremierLeagueFixtures($startDate, $endDate)
    {
        $endpoint = 'fixtures/between/' . $startDate . '/' . $endDate;
        $url = $this->baseUrl . $endpoint;

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $this->apiKey,
        ])->get($url);

        $matches = $response->json();
        $teams = Team::all();
        $gameweeks = Gameweek::all();
        foreach ($matches['data'] as $match){
            $fixture = Fixture::where('sm_id',$match['id'])->first();
            if(empty($fixture)){
                $gameweek = $gameweeks->where('start','>',$match['date'])->where('end','<',$match['date'])->first();
                $fixture = new Fixture([
                    'name' => $match['name'],
                    'kickoff_time' => $match['date'],
                    'gameweek_id' => $gameweek->id,
                    'team_home' => $teams->where('sm_id',$match['team_home_id']),
                    'team_away' => $teams->where('sm_id',$match['team_away_id']),
                ]);
                $fixture->save();
            }
        }
        return $matches;
    }

    public function getFixtureStats(Fixture $fixture){
        $endpoint = 'fixtures/...';
        $url = $this->baseUrl . $endpoint;

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $this->apiKey,
        ])->get($url);
        $stats = $response->json();
        foreach ($stats['data'] as $stat){

        }
    }
}
