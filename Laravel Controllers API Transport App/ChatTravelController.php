<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\TicketTravel;
use App\ChatTravel;
use App\User;
use App\Driver;
use App\Events\ChatTravelEvent;
use App\Events\ChatSupportEvent;
use App\Notifications\RememberDashboard;

class ChatTravelController extends Controller
{

    public function getChatTravels(TicketTravel $ticketTravel)
    {
        $chatsTravel = $ticketTravel->chatsTravel;

        return response()->json($chatsTravel, 200);
    }

    public function sendMessagePassenger(TicketTravel $ticketTravel, Request $request)
    {
        $chatTravel = new ChatTravel;
        $chatTravel->ticket_travel_id = $ticketTravel->id;
        $chatTravel->message = $request->message;
        $chatTravel->passenger = 1;
        $chatTravel->save();

        $userNotify = Driver::find($ticketTravel->driver_id)->user;

        $title = 'Nuevo Mensaje';
        $content = $chatTravel->message;
        
        $checkToken = \DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$userNotify->id.'')->first();

        if(isset($checkToken)){

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


        }

        event(new ChatTravelEvent($chatTravel));
        
        return response()->json($chatTravel, 200);
    }

    public function sendMessageDriver(TicketTravel $ticketTravel, Request $request)
    {
        $chatTravel = new ChatTravel;
        $chatTravel->ticket_travel_id = $ticketTravel->id;
        $chatTravel->message = $request->message;
        $chatTravel->driver = 1;
        $chatTravel->save();

        $user = User::find($ticketTravel->passenger_id);

        $title = 'Nuevo Mensaje';
        $content = $chatTravel->message;

        $checkToken = \DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first();

        if(isset($checkToken)){
            
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


        event(new ChatTravelEvent($chatTravel));
        return response()->json($chatTravel, 200);
    }
}
