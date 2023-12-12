<?php

use App\Http\Controllers\LobbyController;
use App\Http\Controllers\PremiershipController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/premiership-data',[PremiershipController::class,'getPremiershipData']);
Route::get('/lobby',[LobbyController::class,'tournaments']);
Route::get('/tournament-info/{id}',[LobbyController::class,'tournamentInfo']);
Route::post('/register',[LobbyController::class,'register']);
Route::post('/create-tournament',[LobbyController::class,'createTournament']);
Route::post('/pick-squad',[LobbyController::class,'pickSquad']);
Route::post('/user-auth',[UserController::class,'userAuth']);
