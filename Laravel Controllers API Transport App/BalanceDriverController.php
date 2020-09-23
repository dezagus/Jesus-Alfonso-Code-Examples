<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\BalanceDriver;
use App\UserCreditCard;
use App\User;
use Stripe;

class BalanceDriverController extends Controller
{
    public function store(Request $request)
    {
        $user = \Auth::user();
        $driver = $user->driver;

        $balances = $driver->balancesReverse->first();

        $card = UserCreditCard::where('tokenCard', $request->tokenCard)->first();

        if (isset($card) == true) {
            # code...
        }else{

            $card = new UserCreditCard;
            $card->user_id = $user->id;
            $card->name = $request->name;
            $card->brand = $request->brand;
            $card->favorite = 1;
            $card->last4 = $request->last4;
            $card->tokenCard = $request->tokenCard;
            $card->save();

        }

        if (!empty($balances) == true) {

            $lastBalance = $driver->balancesReverse->first();

            $stripe = Stripe::charges()->create([
                'source' => $request->tokenCard,
                'currency' => 'EUR',
                'amount' => $request->total
            ]);

            $balance = new BalanceDriver;
            $balance->driver_id = $driver->id;
            $balance->last_balance = $lastBalance->actual_balance;
            $balance->actual_balance = $lastBalance->actual_balance - $request->total;
            $balance->in = true;
            $balance->reason = 'Pago de comisiones';
            $balance->save();

            $driver->total_paid = $driver->total_paid + $request->total;
            $driver->total_commission = 0;
            $driver->save();

            return response()->json($balance, 200);

        }else{

            $stripe = Stripe::charges()->create([
                'source' => $request->tokenCard,
                'currency' => 'EUR',
                'amount' => $request->total
            ]);

            $balance = new BalanceDriver;
            $balance->driver_id = $driver->id;
            $balance->last_balance = 0;
            $balance->actual_balance = $request->total;
            $balance->in = true;
            $balance->reason = 'Pago de comisiones';
            $balance->save();

            $driver->total_paid = $driver->total_paid + $request->total;
            $driver->total_commission = 0;
            $driver->save();

            return response()->json($balance, 200);

        }
    }

    public function getBalance()
    {
        $user = \Auth::user();
        $driver = \Auth::user()->driver;

        $success['balance'] = $driver->balancesReverse->first() ?? 0; 

        $success['balancePayments'] = $driver->balancesReverse()->where('in', 1)->get(); 

        return response($success, 200);
    }
}
