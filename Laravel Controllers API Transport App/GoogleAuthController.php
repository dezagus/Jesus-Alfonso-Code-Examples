<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log;
use Socialite;

class GoogleAuthController extends Controller
{
    public $successStatus = 200;

        public function CheckLogin(Request $request)
    {
        $userSearch = User::where('email', $request->email)->first();
            
        if ($userSearch) {
            if($userSearch->facebook == NULL)
                {
                    $data = [
                        'error' => 1
                    ];
                    return response()->json($data, 200);
                }else{
                    if (Auth::attempt(['email' => $userSearch->email, 'password' => $request->password])) {
                        $user = Auth::user();
                        $success['token'] =  $user->createToken('MyApp')->accessToken;

                        return response()->json(['success' => $success], $this->successStatus);
                    }
            }
        } else {

            $createUser = new User;
            $createUser->name = $request->name;
            $createUser->password = bcrypt($request->password);
            $createUser->email = $request->email;
            $createUser->google = true;
            $createUser->save(); 

            $success['token'] =  $createUser->createToken('MyApp')->accessToken;
            $success['name'] =  $createUser->name;

            return response()->json(['success'=>$success], $this->successStatus);
        }
    }
 
}
