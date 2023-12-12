<?php

namespace App\Http\Controllers;
use App\Models\Entry;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function userAuth(Request $request) {
        $address = $request->get('address');
        $user = User::where('address',$address)->first();
        if(empty($user)){
            $user = new User([
                'address' => $address,
                'name' => $request->get('name'),
                'login_type' => $request->get('login_type'),
                'image' => $request->get('image')
            ]);
            $user->save();
        }
        $entries = Entry::where('user_id',$user->id)->with(['tournament','picks.player'])->get();
        return response()->json(compact('user','entries'));
    }

    public function getUserEntries(Request $request) {
        $address = $request->get('address');
        $user = User::where('address',$address)->first();
        $entries = Entry::where('user_id',$user->id)->with(['tournament','picks.player'])->get();

        return response()->json(compact('entries'));
    }
}
