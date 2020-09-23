<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\SettingPrice;
use App\Price;

class PriceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $price = SettingPrice::first();
        $prices_table = Price::orderBy('created_at', 'desc')->get();
        return view('admin.prices.index', compact('user', 'price', 'prices_table'));
    }

    public function store(Request $request)
    {
        $time_ini = \Carbon\Carbon::parse($request->start_time);
        $time_inistore = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $time_ini, 'Europe/London')->format('H:i');
        
        $time_fin = \Carbon\Carbon::parse($request->end_time);
        $time_finstore = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $time_fin, 'Europe/London')->format('H:i');
        
        $settings = Price::create([
            'day' => $request->day,
            'start_time' => $time_inistore,
            'end_time' => $time_finstore,
            'value_multi' => $request->value_multi,
        ]);

        return redirect('/admin/prices')->with('message','Tarifa horaria creada correctamente.');
    }

    public function update(Request $request)
    {
        $input = $request->all();
        unset($input['_token']);

        $settings = SettingPrice::where('id', 1)->update($input);

        return redirect('/admin/prices')->with('message','Tarifa actualizada correctamente.');
    }
}
