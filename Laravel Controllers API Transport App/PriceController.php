<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\SettingPrice;
use App\Price;
use Carbon\Carbon;

class PriceController extends Controller
{
    public $successStatus = 200;
    
    public $daysSpanish = [
        0 => 'Domingo',
        1 => 'Lunes',
        2 => 'Martes',
        3 => 'Miercoles',
        4 => 'Jueves',
        5 => 'Viernes',
        6 => 'Sábado',
    ];

    public function tripCalculate($km)
    {
        $km = str_replace(".", "", $km);
        $priceSetting = SettingPrice::find(1);
        $dateNow = Carbon::now();
        $dateDay = $this->daysSpanish[$dateNow->dayOfWeek];
        $dateHour = $dateNow->hour.':'.$dateNow->minute.':00';
        $prices = Price::GetPrice($dateDay, $dateHour)->get();

        $convertedKm = $km / 1000;
        
        $total_km = 0;
        $totalDelivery = 0;
        $total = 0;

        if ($convertedKm >= $priceSetting->limit_km) {
            $total_km = $convertedKm * $priceSetting->price_pkm;
            $total = $priceSetting->price_base + $total_km;
            $total_km = round($total_km);
            $totalDelivery = $total * $priceSetting->value_delivery;

        } else {
            $total = $priceSetting->price_base;
            $totalDelivery = $total * $priceSetting->value_delivery;
        }

        if ($prices) {
            foreach ($prices as $p) {
                $total = $total * $p->value_multi;
                $totalDelivery = ($total * $p->value_multi) * $priceSetting->value_delivery;
            }
        }

        $total = round($total);
        $totalDelivery = round($totalDelivery);

        $success['price_base'] = round($priceSetting->price_base);
            $success['total_km'] = $total_km;
            $success['total'] = $total;
            $success['totalDelivery'] = $totalDelivery;

        return response()->json(['success'=>$success], $this->successStatus);

    }
}
