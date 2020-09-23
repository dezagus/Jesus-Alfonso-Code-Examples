<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\BalanceUser;
use App\UserCreditCard;
use App\User;
use Stripe;

class BalanceUserController extends Controller
{
    public function store(Request $request)
    {
        $user = \Auth::user();

        $balances = $user->balancesReverse->first();

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

            $lastBalance = $user->balancesReverse->first();

            $stripe = Stripe::charges()->create([
                'source' => $request->tokenCard,
                'currency' => 'EUR',
                'amount' => $request->total
            ]);

            $balance = new BalanceUser;
            $balance->user_id = $user->id;
            $balance->last_balance = $lastBalance->actual_balance;
            $balance->actual_balance = $lastBalance->actual_balance + $request->total;
            $balance->in = true;
            $balance->reason = 'Carga de saldo';
            $balance->save();

            return response()->json($balance, 200);

        }else{

            $stripe = Stripe::charges()->create([
                'source' => $request->tokenCard,
                'currency' => 'EUR',
                'amount' => $request->total
            ]);

            $balance = new BalanceUser;
            $balance->user_id = $user->id;
            $balance->last_balance = 0;
            $balance->actual_balance = $request->total;
            $balance->in = true;
            $balance->reason = 'Carga de saldo';
            $balance->save();

            return response()->json($balance, 200);

        }
    }

    public function getBalance()
    {
        $user = \Auth::user();

        $balances = $user->balancesReverse->first() ?? 0;

        return response($balances, 200);
    }
}
