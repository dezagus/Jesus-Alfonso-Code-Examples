<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\RateDriver;
use App\User;
use App\Travel;
use App\Driver;
use App\Notifications\RememberDashboard;

class RateDriverController extends Controller
{
    public function storeRate(Request $request)
    {
        $rateDriver = new RateDriver;
        $rateDriver->travel_id = $request->travel_id;
        $rateDriver->user_id = $request->user_id;
        $rateDriver->driver_id = $request->driver_id;
        $rateDriver->rate = $request->rate;
        $rateDriver->comfort = $request->comfort;
        $rateDriver->route = $request->route;
        $rateDriver->service = $request->service;
        $rateDriver->cleaning = $request->cleaning;
        $rateDriver->save();

        $travel = Travel::find($request->travel_id);

        $userNotify = Driver::find($rateDriver->driver_id)->user;

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

    public function getAverage(Driver $driver)
    {
        $rateDriver = RateDriver::where('driver_id', $driver->id)->get();
        $travels = Travel::where('driver_id', $driver->id)->count();

        $sum = $rateDriver->sum('rate');

        if ($sum == 0) {
            $average = 0;
        }else{
            $average = $sum / $rateDriver->count();

        }

        \Carbon\Carbon::setLocale('es');

        $data['average'] = $average;
        $data['ant'] = \Carbon\Carbon::parse($driver->created_at)->longAbsoluteDiffForHumans(\Carbon\Carbon::now());
        $data['travels'] = $travels;

        return response()->json($data, 200);
    }
}
