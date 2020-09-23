<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\ChatSupport;
use App\TicketSupport;
use App\Events\ChatSupportEvent;
use App\Events\NewTicketSupport;
use App\Notifications\RememberDashboard;

class ChatSupportController extends Controller
{
    public function getUserTicketSupport()
    {
        $user = \Auth::user();

        return response()->json($user->ticketSupport, 200);
    }

    public function getChatSupport(TicketSupport $ticketSupport)
    {
        $chatsSupport = $ticketSupport->chatsSupport;
        $ticketSupport->read = NULL;
        $ticketSupport->save();

        return response()->json($chatsSupport, 200);
    }

    public function storeTicketSupport(Request $request)
    {
        $user = \Auth::user();

        $ticketSupport = new TicketSupport;
        $ticketSupport->user_id = $user->id;
        $ticketSupport->status = 1;
        $ticketSupport->description = $request->description;
        $ticketSupport->save();

        $ticketSupport->readAdmin = 1;
        $ticketSupport->save();

        event(new NewTicketSupport($ticketSupport));

        return response()->json($ticketSupport, 200);
    }

    public function sendMessageUser(TicketSupport $ticketSupport, Request $request)
    {
        $chatSupport = new ChatSupport;
        $chatSupport->ticket_support_id = $ticketSupport->id;
        $chatSupport->message = $request->message;
        $chatSupport->user = 1;
        $chatSupport->save();

        $user = \App\User::find($ticketSupport->user_id);

        $checkToken = \DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first();

        if(isset($checkToken)){

            $payload = array(
                'to' => ''.\DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first()->value.'',
                'sound' => 'default',
                'title' => 'Nuevo mensaje recibido',
                'body' => $request->message,
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

        event(new ChatSupportEvent($chatSupport));

        return response()->json($chatSupport, 200);
    }

  /*   public function sendMessageAdmin(TicketSupport $ticketSupport, Request $request)
    {
        $chatTravel = new ChatTravel;
        $chatTravel->ticket_support_id = $ticketTravel->id;
        $chatTravel->message = $request->message;
        $chatTravel->driver = 1;
        $chatTravel->save();

        $user = User::find($ticketTravel->passenger_id);

        $title = 'Nuevo Mensaje';
        $content = $chatTravel->message;

        $user->notify(new RememberDashboard($title, $content));

        event(new ChatTravelEvent($chatTravel));

        return response()->json($chatTravel, 200);
    } */
}
