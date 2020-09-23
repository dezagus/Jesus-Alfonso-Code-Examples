<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\RateUser;
use App\User;
use App\Travel;
use App\Notifications\RememberDashboard;

class RateUserController extends Controller
{

    public $successStatus = 200;

    public function storeRate(Request $request)
    {
        $rateUser = new RateUser;
        $rateUser->travel_id = $request->travel_id;
        $rateUser->qualifier_id = $request->qualifier_id;
        $rateUser->user_id = $request->user_id;
        $rateUser->rate = $request->rate;
        $rateUser->save();

        $travel = Travel::find($request->travel_id);

        $userNotify = User::find($rateUser->user_id);

        $title = 'Te han calificado.';
        $content = 'Has conseguido '.$request->rate.' estrellas de tu viaje a '.$travel->destiny_address.'.';

        $payload = array(
            'to' => ''.\DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$userNotify->id.'')->first()->value.'',
            'sound' => 'default',
            'title' => $title,
            'body' => $content,
            'priority'=>'high',
            'channelId' => 'chat-messages'
        );

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://exp.host/--/api/v2/push/send",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => array(
                "Accept: application/json",
                "Accept-Encoding: gzip, deflate",
                "Content-Type: application/json",
                "cache-control: no-cache",
                "host: exp.host"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        
        return response()->json($travel, $this->successStatus);

    }
}
