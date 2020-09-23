<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Waypoint;
use App\Travel;
use App\User;
use App\Notifications\RememberDashboard;
use App\Events\DriverArrived;

class WaypointController extends Controller
{
    public function done(Request $request)
    {
        $waypoint = Waypoint::where('travel_id', $request->id)->where('done', NULL)->first();

        if (isset($waypoint)) {
            $waypoint->done = true;
            $waypoint->save();    # code...
        }

        $waypointCount = Waypoint::where('travel_id', $request->id)->where('done', NULL)->count();

        $travel = Travel::find($request->id);
        $user = User::find($travel->user_id);

        if ($waypointCount === 1) {
            
            $title = 'Ya hemos entregado un paquete.';
            $content = 'Entregado en '.$travel->destiny_address.'.';

            $payload = array(
                'to' => ''.\DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first()->value.'',
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

        } else {
            $title = 'Ya hemos entregado un paquete.';
            if (isset($waypoint->location)) {
                $content = 'Entregado en '.$waypoint->location.'.';
            }else{
                $content = 'Entregado en '.$travel->destiny_address.'.';

            }
            
            $payload = array(
                'to' => ''.\DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first()->value.'',
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
        }

        return response()->json($waypoint, 200);
    }
}
