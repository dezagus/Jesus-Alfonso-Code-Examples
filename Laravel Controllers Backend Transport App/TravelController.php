<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Driver;
use App\Referred;
use App\User;
use App\Travel;
use App\TicketTravel;
use App\ChatTravel;
use App\VirtualWalletDriver;
use App\BalanceUser;
use App\BalanceDriver;
use App\Waypoint;
use App\Events\NewTravel;
use App\Events\MessagePushed;
use App\Events\TravelCanceled;
use App\Events\AcceptTravel;
use App\Events\DriverArrived;
use App\Events\StartTravel;
use App\Events\EndTravel;
use Illuminate\Support\Facades\Log;
use App\Notifications\RememberDashboard;
use Notification;
use Stripe;
class TravelController extends Controller
{
    public $successStatus = 200;

    public function todayTravels()
    {
        $data = [];

        $travels = Travel::whereDate('created_at', \Carbon\Carbon::today())->get();

        $checkDriver = \Auth::user()->driver;

        if(isset($checkDriver)){
            $travelsDriver =  Travel::where('driver_id', $checkDriver->id)
            ->whereDate('created_at', \Carbon\Carbon::today())
            ->get();

            $totalToday = $travelsDriver->sum('total');

            $commission = $totalToday * $checkDriver->vehicle->typeVehicle->commission / 100;

            $data['comission'] = $commission;

        }

        $data['travels'] = $travels;

        return response()->json($data, 200);
    }

    public function storeBalance(Request $request)
    {
        $user = \Auth::user();

        $lastBalance = $user->balancesReverse->first();
        
        if ($request->total === 0 ) {
            return response()->json('total 0', 200);
        }

        if ($lastBalance->actual_balance < $request->total) {
            return response()->json('saldo insuficiente', 200);
        }else{
            $travel = new Travel;
            $travel->user_id = $user->id;
            $travel->origin_address = $request->origin_address;
            $travel->destiny_address = $request->destiny_address;
            $travel->distance = $request->distance;
            $travel->origin_lat = $request->origin_lat;
            $travel->origin_lng = $request->origin_lng;
            $travel->destiny_lat = $request->destiny_lat;
            $travel->destiny_lng = $request->destiny_lng;
            $travel->price_base = $request->price_base;
            $travel->price_km = $request->price_km;
            $travel->price_time = 0;
            $travel->total = $request->total;
            $travel->final_total = 0;
            $travel->cc = true;
            $travel->save();

            $balance = new BalanceUser;
            $balance->user_id = $user->id;
            $balance->travel_id = $travel->id;
            $balance->last_balance = $lastBalance->actual_balance;
            $balance->actual_balance = $lastBalance->actual_balance - $request->total;
            $balance->out = true;
            $balance->reason = 'Pago de viaje a '.$travel->destiny_address.'';
            $balance->save();

            event(new MessagePushed($travel));
            event(new NewTravel($travel));

            $dataWaypoint = [];
            
            if (isset($request->waypoints)) {
                for ($i=0; $i < count($request->waypoints) ; $i++) {
                    $dataWaypoint[$i] = [
                    'travel_id' => $travel->id,
                    'location' => $request->waypoints[$i]['address'],
                    'lng' => $request->waypoints[$i]['longitude'],
                    'lat' => $request->waypoints[$i]['latitude'],
                    ];
                }
            }

            Waypoint::insert($dataWaypoint);

            return response()->json($travel, $this->successStatus);
        }
    }

    public function getLastTravel()
    {
        $travels = Travel::where('driver_id', null)->where('status', 1)->orderBy('id', 'desc')->get();

        return response()->json($travels, 200);
    }

    public function store(Request $request)
    {
        $user = \Auth::user();

        if ($request->total === 0 ) {
            return response()->json('total 0', 200);
        }
        
        $travel = new Travel;
        $travel->user_id = $user->id;
        $travel->origin_address = $request->origin_address;
        $travel->destiny_address = $request->destiny_address;
        $travel->distance = $request->distance;
        $travel->origin_lat = $request->origin_lat;
        $travel->origin_lng = $request->origin_lng;
        $travel->destiny_lat = $request->destiny_lat;
        $travel->destiny_lng = $request->destiny_lng;
        $travel->price_base = $request->price_base;
        $travel->price_km = $request->price_km;
        $travel->commentsDelivery = $request->commentsDelivery;
        $travel->price_time = 0;
        if (count($request->waypoints) > 0) {
        $travel->total = $request->totalDelivery;
        $travel->waypointed = 1;
        } else {
        $travel->total = $request->total;
        }
        $travel->final_total = 0;
        $travel->save();

        $dataWaypoint = [];

        for ($i=0; $i < count($request->waypoints) ; $i++) {
            $dataWaypoint[$i] = [
               'travel_id' => $travel->id,
               'location' => $request->waypoints[$i]['address'],
               'lng' => $request->waypoints[$i]['longitude'],
               'lat' => $request->waypoints[$i]['latitude'],
            ];
        }

        Waypoint::insert($dataWaypoint);
      
        if(isset($request->commentsDelivery)){

        } else {
            event(new MessagePushed($travel));
            event(new NewTravel($travel));
        }

        $title = 'Nuevo viaje disponible';
        $content = $travel->origin_address;

        $driversConnected = Driver::where('offline', false)->get();

        foreach ($driversConnected as $driver) {

            $checkDriver = \DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$driver->user->id.'')->first();

            if(isset($checkDriver)){
                
                $payload = array(
                    'to' => ''.\DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$driver->user->id.'')->first()->value.'',
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
        }


        return response()->json($travel, $this->successStatus);
    }

    public function uploadPhotoPackage(Travel $travel, Request $request)
    {
        $photo = time().'1wpts.jpg';
        $request->file('photo')->move(public_path('images'), $photo);
        $travel->photoDelivery = $photo;
        $travel->save();

        event(new MessagePushed($travel));
        event(new NewTravel($travel));

        return response()->json($travel, $this->successStatus);
    }

    public function received(Travel $travel)
    {
        $travel->received = true;
        $travel->save();

        $userNotify = Driver::find($travel->driver_id)->user;

        if(isset($travel->commentsDelivery)){
            $title = 'Te han entregado el paquete.';
            $content = ' ';
    
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

        return response()->json($travel, 200);
    }

    public function storeWaypoints(Type $var = null)
    {
        $user = \Auth::user();

        if ($request->total === 0 ) {
            return response()->json('total 0', 200);
        }

        $travel = new Travel;
        $travel->user_id = $user->id;
        $travel->origin_address = $request->origin_address;
        $travel->destiny_address = $request->destiny_address;
        $travel->distance = $request->distance;
        $travel->origin_lat = $request->origin_lat;
        $travel->origin_lng = $request->origin_lng;
        $travel->destiny_lat = $request->destiny_lat;
        $travel->destiny_lng = $request->destiny_lng;
        $travel->price_base = $request->price_base;
        $travel->price_km = $request->price_km;
        $travel->price_time = 0;
        $travel->total = $request->total;
        $travel->final_total = 0;
        $travel->save();

        event(new MessagePushed($travel));
        event(new NewTravel($travel));

        return response()->json($travel, $this->successStatus);
    }

    public function show(Travel $travel)
    {
        $user = \Auth::user();

        return view('admin.travel.show', compact('travel', 'user'));
    }

    public function showPublic(Travel $travel)
    {
        return view('publicTravel', compact('travel'));
    }

    public function CancelTravel(Travel $travel)
    {
        $user = \Auth::user();

        $travel->status = 4;
        $travel->save();

        $isBalance = BalanceUser::where('travel_id', $travel->id)->first();

        if (isset($isBalance) == true) {
            $lastBalance = $user->balancesReverse->first();

            $balance = new BalanceUser;
            $balance->user_id = $user->id;
            $balance->travel_id = $travel->id;
            $balance->last_balance = $lastBalance->actual_balance;
            $balance->actual_balance = $lastBalance->actual_balance + $travel->total;
            $balance->in = true;
            $balance->reason = 'DevoluciÃ³n por cancelaciÃ³n de viaje '.$travel->destiny_address.'.';
            $balance->save();
        }

        event(new TravelCanceled($travel));

        return response()->json([$travel], $this->successStatus);
    }

    public function GetTravel(Travel $travel)
    {
        $travel1 = Travel::where('id', $travel->id)->with(['driver', 'user', 'waypoints'])->first();
        
        return response()->json($travel1, $this->successStatus);
    }

    public function AcceptTravel(Travel $travel, Driver $driver)
    {
        $travel->driver_id = $driver->id;
        $travel->status = 2;
        $travel->save();

        $ticketTravel = new TicketTravel;
        $ticketTravel->travel_id = $travel->id;
        $ticketTravel->passenger_id = $travel->user_id;
        $ticketTravel->driver_id = $travel->driver_id;
        $ticketTravel->save();

        $travel->ticket_travel_id = $ticketTravel->id;
        $travel->save();

        $travel1 = Travel::where('id', $travel->id)->with('driver', 'user')->first();

        event(new AcceptTravel($travel1));

        $lastBalance = $driver->balancesReverse->first();

        $commission = $travel->total * $driver->vehicle->typeVehicle->commission / 100;
        
        if ($travel->cc == null) {
            if (isset($lastBalance)) {
                $balance = new BalanceDriver;
                $balance->driver_id = $travel->driver_id;
                $balance->travel_id = $travel->id;
                $balance->last_balance = $lastBalance->actual_balance;
                $balance->actual_balance = $lastBalance->actual_balance + $commission;
                $balance->out = true;
                $balance->reason = 'ComisiÃ³n de viaje en efectivo a '.$travel->destiny_address.'';
                $balance->save();

                $driver->total_commission = $driver->total_commission + $balance->actual_balance;
                $driver->save();

            }else{

                $balance = new BalanceDriver;
                $balance->driver_id = $travel->driver_id;
                $balance->travel_id = $travel->id;
                $balance->last_balance = 0;
                $balance->actual_balance = 0 + $commission;
                $balance->out = true;
                $balance->reason = 'ComisiÃ³n de viaje en efectivo a '.$travel->destiny_address.'';
                $balance->save();

                $driver->total_commission = $driver->total_commission + $balance->actual_balance;
                $driver->save();
            }
        }

        return response()->json($travel1, $this->successStatus);
    }

    public function DriverArrived(Travel $travel)
    {
        $travel->status = 3;
        $travel->save();

        event(new DriverArrived($travel));

        $user = User::find($travel->user_id);
        $driver = Driver::find($travel->driver_id);

        $title = 'Nuestro conductor ha llegado al punto de partida.';
        $content = ''.$driver->vehicle->brand.' '.$driver->vehicle->model.' '.$driver->vehicle->color.' '.$driver->vehicle->patent.'.';

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

        return response()->json($travel, 200);
    }

    public function StartTravel(Travel $travel)
    {
        $travel->status = 5;
        $travel->save();

        event(new StartTravel($travel));

        $user = User::find($travel->user_id);
        $driver = Driver::find($travel->driver_id);

        $title = 'El conductor ha iniciado el viaje.';
        $content = 'En camino a '.$travel->destiny_address.'';

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

        return response()->json($travel, 200);
    }

    public function EndTravel(Travel $travel)
    {

        $user = User::find($travel->user_id);
        $driver = Driver::find($travel->driver_id);

        $virtualWalletEdit = VirtualWalletDriver::where('driver_id', $driver->id)->first();

        $commission = $travel->total * $driver->vehicle->typeVehicle->commission / 100;
        $totalDriver = $travel->total - $commission;

        $virtualWalletEdit->total_pending = $virtualWalletEdit->total_pending + $totalDriver;
        $virtualWalletEdit->total_commission = $virtualWalletEdit->total_commission + $commission;
        $virtualWalletEdit->save();

        $title = 'Viaje finalizado, muchas gracias.';
        $content = 'Ingresa para ver mas detalles y calificar al conductor.';

        $checkDevice = \DB::table('exponent_push_notification_interests')->where('key', 'App.User.'.$user->id.'')->first();

        if(isset($checkDevice)){
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

       


        if (count($user->travelsFinished) == 0) {

            $referredUserCode = Referred::find($user->referred_id);
                
                if (isset($referredUserCode) == true) {
                    
                    if ($referredUserCode->usage > 1) {
                        $referredUserCode->usage = $referredUserCode->usage - 1;
                        $referredUserCode->save();

                    }else{
                        $referredUserCode->usage = 3;
                        $referredUserCode->save();
    
                        $balances = $user->balancesReverse->first();
    
                        if (!empty($balances) == true) {
                
                            $lastBalance = $user->balancesReverse->first();
                
                            $balance = new BalanceUser;
                            $balance->user_id = $user->referred_id;
                            $balance->last_balance = $lastBalance->actual_balance;
                            $balance->actual_balance = $lastBalance->actual_balance + 25;
                            $balance->in = true;
                            $balance->reason = 'Cobro de promociÃ³n referido.';
                            $balance->save();
                
                        }else{
                            $balance = new BalanceUser;
                            $balance->user_id = $user->referred_id;
                            $balance->last_balance = 0;
                            $balance->actual_balance = 25;
                            $balance->in = true;
                            $balance->reason = 'Cobro de promociÃ³n referido.';
                            $balance->save();
                
                        }
                    }
                }
            }

            $travel->status = 6;
            $travel->save();
            
            event(new EndTravel($travel));


            return response()->json($travel, 200);

    }

    public function getTravels()
    {
        $travels = Travel::where('user_id', \Auth::user()->id)
        ->where('status', 6)
        ->orderBy('created_at','desc')
        ->with(['driver', 'waypoints'])
        ->take(10)
        ->get();

        return response()->json($travels, 200);

    }

    public function getTravelsDriver(){

        $travels = Travel::where('driver_id', \Auth::user()->driver->id)
        ->where('status', 6)
        ->orderBy('created_at','desc')
        ->with(['driver', 'waypoints'])
        ->take(10)
        ->get();

        return response()->json($travels, 200);

    }

    public function getTravelsWp()
    {
        $travels = Travel::where('user_id', \Auth::user()->id)
        ->where('status', 6)
        ->where('waypointed', 1)
        ->orderBy('created_at','desc')
        ->with(['driver', 'waypoints'])
        ->take(10)
        ->get();

        return response()->json($travels, 200);
    }
}
