<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Referred;
use Hashids\Hashids;

class ReferredController extends Controller
{
    public function index()
    {
        $referred = Referred::all();
        $user = \Auth::user();

        return view('admin.referred.index', compact('referred', 'user'));
    }

    public function generate()
    {
        $users = User::all();

        $counter = 0;

        for ($i=0; $i < count($users); $i++) {
            
            $random = mt_rand(00001, 10000);

            $hashids = new Hashids('', 5);

            $code = $hashids->encode($random.$users[$i]->id);

            // decode $test = $hashids->decode($code);
            /* tomar el id $check = substr($test[0] , -1); */

            if(isset($users[$i]->referredCode) == true)
            {
                if($users[$i]->referredCode->usage <= 2) {
                    //empty
                }
                else{
                    $referred = Referred::where('user_id', $users[$i]->id)->first();
                    $referred->user_id = $users[$i]->id;
                    $referred->code = $code;
                    $referred->save();

                    $counter++;

                    $data['message'] = 'Se han actualizado un total de '.$counter.' códigos.';

                }
            }else{
                $referred = new Referred;
                $referred->user_id = $users[$i]->id;
                $referred->code = $code;
                $referred->usage = 3;
                $referred->save();

                $counter++;

                $data['message'] = 'Se han creado un total de '.$counter.' códigos.';

            }
        }

        
        return response()->json($data, 200);
    }
}
