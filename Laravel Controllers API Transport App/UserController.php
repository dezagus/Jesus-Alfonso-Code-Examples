<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Driver;
use App\VirtualWalletDriver;
use App\Vehicle;
use App\Documentation;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use DB;
use Hashids\Hashids;
use App\Referred;

class UserController extends Controller
{

  public $successStatus = 200;

   /**
   * login api
   *
   * @return \Illuminate\Http\Response
   */
  public function login()
  {
      $userLogin = User::where('phone', request('email'))->first();

      if (isset($userLogin)) {
        # code...
      }else{
      $userLogin = User::where('phone', '+'.request('email').'')->first();

      }

      if(Auth::attempt(['email' => $userLogin->email, 'password' => request('password')])){
          $user = Auth::user();
          $success['token'] =  $user->createToken('MyApp')->accessToken;
          return response()->json(['success' => $success], $this->successStatus);
      }
      else{
          return response()->json(['error'=>'Unauthorised'], 401);
      }
  }

  public function logout()
  {

    DB::table('exponent_push_notification_interests')
    ->where('key', 'App.User.'.Auth::user()->id.'')
    ->delete();
    
    DB::table('oauth_access_tokens')
        ->where('user_id', Auth::user()->id)
        ->update([
            'revoked' => true
        ]);

    return response()->json('success', 200);
  }

  public function checkNotifications()
  {
    $checkNotification = DB::table('exponent_push_notification_interests')
        ->where('key', 'App.User.'.Auth::user()->id.'')
        ->first();

        if (isset($checkNotification) == true) {
          return response()->json(1, 200);
        } else {
          return response()->json(0, 200);
        }
  }

   /**
   * Register api
   *
   * @return \Illuminate\Http\Response
   */
  public function register(Request $request)
  {
    $random = mt_rand(100000,999999);
    $gender = true;
    $user = new User;

    $checkUserEmail = User::where('email', $request->email)->get();
    $checkUserPhone = User::where('phone', $request->codeZone.$request->phone)->get();

    if (count($checkUserEmail) > 0) {
      return response()->json('email', $this->successStatus);
    }
    if (count($checkUserPhone) > 0) {
      return response()->json('phone', $this->successStatus);
    }

    if (isset($request->referredCode) == true) {  

      $hashids = new Hashids('', 5);

      $test = $hashids->decode($request->referredCode);

      if (count($test) > 0) {
        $check = substr($test[0] , -1);

        $userCheck = User::find($check);

        if (isset($userCheck)) {
          $success['referred'] = true;

          $user->referred_id = $check;
        }else{
          $success['referred'] = false;
        }
      }else{
        $success['referred'] = false;
      }
    }

    if ($request->checkedM == true) {
        $gender = true;
    }

    if ($request->checkedF == true) {
        $gender = false;
    }

    $user->name = $request->name;
    $user->last_name = $request->last_name;
    $user->phone = $request->codeZone.$request->phone;
    $user->gender = $gender ;
    $user->email = $request->email;
    $user->password = bcrypt($random);

    $user->save();

    $documentation = new Documentation;
    $documentation->user_id = $user->id;
    $documentation->save();

    $driver = new Driver;
    $driver->user_id = $user->id;
    $driver->save();

    $virtualWalletDriver = new VirtualWalletDriver;
    $virtualWalletDriver->driver_id = $driver->id;
    $virtualWalletDriver->total_pending = 0;
    $virtualWalletDriver->total_commission = 0;
    $virtualWalletDriver->total_paid = 0;
    $virtualWalletDriver->save();

    $randomRef = mt_rand(00001, 10000);

    $hashids = new Hashids('', 5);

    $codeRef = $hashids->encode($randomRef.$user->id);

    $referred = new Referred;
    $referred->user_id = $user->id;
    $referred->code = $codeRef;
    $referred->usage = 3;
    $referred->save();

    $success['token'] =  $user->createToken('MyApp')->accessToken;
    $success['name'] =  $user->name;

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.sendinblue.com/v3/transactionalSMS/sms",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => "{\"sender\":\"Berater\",\"recipient\":\"".preg_replace('/[^0-9]/', '', $request->codeZone.$request->phone)."\",\"content\":\"Gracias por registrarte en Berater, esta es tu clave: ".$random."\",\"type\":\"transactional\"}",
      CURLOPT_HTTPHEADER => array(
        "accept: application/json",
        "api-key: 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",
        "content-type: application/json"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    $success['smsSuccess'] =  $response;
    $success['smsError'] =  $err;
    
    return response()->json(['success'=>$success], $this->successStatus);
  }

  public function resetPassword(Request $request)
  {
    $random = mt_rand(100000,999999);

    $user = User::where('phone', $request->phone)->first();

    if (isset($user)) {
      $user->password = bcrypt($random);
      $user->save();

      $curl = curl_init();

      curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.sendinblue.com/v3/transactionalSMS/sms",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"sender\":\"Berater\",\"recipient\":\"".preg_replace('/[^0-9]/', '', $user->phone)."\",\"content\":\"Gracias por registrarte en Berater, esta es tu clave: ".$random."\",\"type\":\"transactional\"}",
        CURLOPT_HTTPHEADER => array(
          "accept: application/json",
          "api-key: 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",
          "content-type: application/json"
        ),
      ));

      $response = curl_exec($curl);
      $err = curl_error($curl);

      curl_close($curl);

      return response()->json($user, 200);
    }else{
      return response()->json('notfound', 200);
    }

  }

   /**
   * details api
   *
   * @return \Illuminate\Http\Response
   */
  public function details()
  {
      $user = User::where('id', Auth::user()->id)->with('driver')->first();
      
      $vehicle = Vehicle::where('user_id', $user->id)->first();

      if (isset($vehicle)) {
        $vehicleReady = true;
      } else {
        $vehicleReady = false;
      }

      return response()->json(['success' => $user, 'vehicleReady' => $vehicleReady], $this->successStatus);
  }

  public function documentationGet(Request $request)
  {
      $user = Auth::user();

      return response()->json(['success' => $user->documentation], $this->successStatus);
  }

  public function documentationStore(Request $request)
  {
      $user = Auth::user();
      $random = Str::random(8);
      $documentation = Documentation::firstOrCreate(['user_id' => $user->id]);
        Log::debug($request);
      if ($request->checklicense_path == true) {
          if ($request->hasFile('license_path')) {
            $license_path = time().'1-'.$request->file('license_path')->getClientOriginalName().'.jpg';
            $request->file('license_path')->move(public_path('images/doc'), $license_path);
            $documentation->license_path = $license_path;
            $documentation->status_license = 0;

          }
    
      }

      if ($request->checkvehiclelicense_path == true) {
        if ($request->hasFile('vehiclelicense_path')) {
            $vehiclelicense_path = time().'2-'.@$request->file('vehiclelicense_path')->getClientOriginalName().'.jpg';
            $request->file('vehiclelicense_path')->move(public_path('images/doc'), $vehiclelicense_path);
            $documentation->vehiclelicense_path = $vehiclelicense_path;
            $documentation->status_vehiclelicense = 0;
          }
        
    }

      if ($request->checkinsuranse_path == true) {
        if ($request->hasFile('insuranse_path')) {
            $insuranse_path = time().'3-'.@$request->file('insuranse_path')->getClientOriginalName().'.jpg';
            $request->file('insuranse_path')->move(public_path('images/doc'), $insuranse_path);
            $documentation->insuranse_path = $insuranse_path;
            $documentation->status_insuranse = 0;
        }
    }

      if ($request->checkvtv_path == true) {
        if ($request->hasFile('vtv_path')) {
            $vtv_path = time().'4-'.@$request->file('vtv_path')->getClientOriginalName().'.jpg';
            $request->file('vtv_path')->move(public_path('images/doc'), $vtv_path);
            $documentation->vtv_path = $vtv_path;
            $documentation->status_vtv = 0;
        }
    }

    if ($request->checklicense_path1 == true) {
      if ($request->hasFile('license_path1')) {
        $license_path1 = time().'1-'.$request->file('license_path1')->getClientOriginalName().'.jpg';
        $request->file('license_path1')->move(public_path('images/doc'), $license_path1);
        $documentation->license_path1 = $license_path1;
        $documentation->status_license1 = 0;

      }

  }

  if ($request->checkvehiclelicense_path1 == true) {
    if ($request->hasFile('vehiclelicense_path1')) {
        $vehiclelicense_path1 = time().'2-'.@$request->file('vehiclelicense_path1')->getClientOriginalName().'.jpg';
        $request->file('vehiclelicense_path1')->move(public_path('images/doc'), $vehiclelicense_path1);
        $documentation->vehiclelicense_path1 = $vehiclelicense_path1;
        $documentation->status_vehiclelicense1 = 0;
      }
    
}

  if ($request->checkinsuranse_path1 == true) {
    if ($request->hasFile('insuranse_path1')) {
        $insuranse_path1 = time().'3-'.@$request->file('insuranse_path1')->getClientOriginalName().'.jpg';
        $request->file('insuranse_path1')->move(public_path('images/doc'), $insuranse_path1);
        $documentation->insuranse_path1 = $insuranse_path1;
        $documentation->status_insuranse1 = 0;
    }
}

  if ($request->checkvtv_path1 == true) {
    if ($request->hasFile('vtv_path1')) {
        $vtv_path1 = time().'4-'.@$request->file('vtv_path1')->getClientOriginalName().'.jpg';
        $request->file('vtv_path1')->move(public_path('images/doc'), $vtv_path1);
        $documentation->vtv_path1 = $vtv_path1;
        $documentation->status_vtv1 = 0;
    }
}

      if ($request->checkfront_img_path == true) {
        if ($request->hasFile('front_img_path')) {
            $front_img_path = time().'5-'.@$request->file('front_img_path')->getClientOriginalName().'.jpg';
            $request->file('front_img_path')->move(public_path('images/doc'), $front_img_path);
            $documentation->front_img_path = $front_img_path;
            $documentation->status_front = 0;
        }
    }

      if ($request->checkback_img_path == true) {
        if ($request->hasFile('front_img_path')) {
            $back_img_path = time().'6-'.@$request->file('front_img_path')->getClientOriginalName().'.jpg';
            $request->file('back_img_path')->move(public_path('images/doc'), $back_img_path);
            $documentation->back_img_path = $back_img_path;
            $documentation->status_back = 0;
        }
        
    }

      if ($request->checkleft_img_path == true) {
        if ($request->hasFile('left_img_path')) {
            $left_img_path = time().'7-'.@$request->file('left_img_path')->getClientOriginalName().'.jpg';
        $request->file('left_img_path')->move(public_path('images/doc'), $left_img_path);
        $documentation->left_img_path = $left_img_path;
        $documentation->status_left = 0;
      }
        
    }

      if ($request->checkright_img_path == true) {
        if ($request->hasFile('right_img_path')) {

        $right_img_path = time().'8-'.@$request->file('right_img_path')->getClientOriginalName().'.jpg';
        $request->file('right_img_path')->move(public_path('images/doc'), $right_img_path);
        $documentation->right_img_path = $right_img_path;
        $documentation->status_right = 0;
      }
    }
      

      $documentation->user_id = $user->id;
      $documentation->license = $request->license;
      $documentation->vehiclelicense = $request->vehicle;
      $documentation->insuranse = $request->insuranse;
      $documentation->vtv = $request->vtv;
      $documentation->save();

  
      $driver = Driver::where('user_id', $user->id)->first();
      $driver->user_id = $user->id;
      $driver->documentation_id = $documentation->id;
      $driver->save();

      return response()->json(['success' => $user], $this->successStatus);
  }

  public function driverTrigger()
  {
    $user = \Auth::user();
    $user->driver->offline = false;
    $user->driver->save();

    return response()->json(['success' => $user->driver], $this->successStatus);

  }

  public function updateProfile(Request $request)
  {
    $user = \Auth::user();

    $user->name = $request->name;
    $user->last_name = $request->last_name;
    $user->phone = $request->phone;
    $user->email = $request->email;
    $user->save();

    return response()->json($user,200);
  }

  public function updateProfilePhoto(Request $request)
  {
    $user = \Auth::user();

    $photo = time().'1doc.jpg';
    $request->file('photo')->move(public_path('images'), $photo);
    $user->photo = $photo;
    $user->save();

    return response()->json($user,200);

  }

}
