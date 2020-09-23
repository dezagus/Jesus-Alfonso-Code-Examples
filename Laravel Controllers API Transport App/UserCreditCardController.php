<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\UserCreditCard;

class UserCreditCardController extends Controller
{

    public function getCreditCards()
    {
        $user = \Auth::user();

        $creditCards = UserCreditCard::where('user_id', $user->id)->get();
        
        return response()->json($creditCards, 200);

    }

    public function store(Request $request)
    {
        $user = \Auth::user();

        $card = new UserCreditCard;
        $card->user_id = $user->id;
        $card->name = $request->name;
        $card->brand = $request->brand;
        $card->last4 = $request->last4;
        $card->tokenCard = $request->tokenCard;
        $card->save();

        return response()->json($card, 200);

    }

    public function delete($card)
    {
        $user = \Auth::user();

        $creditCard = UserCreditCard::where('tokenCard', $card)->first();

        $creditCard->delete();

        return response()->json($card, 200);

    }

    public function makeFavorite($card)
    {
        $user = \Auth::user();

        $userCreditCard = UserCreditCard::where('user_id', $user->id)->get();

        foreach ($userCreditCard as $uc) {
            $uc->favorite = 0;
            $uc->save();
        }

        $creditCard = UserCreditCard::where('tokenCard', $card)->first();

        $creditCard->favorite = 1;
        $creditCard->save();

        return response()->json($card, 200);

    }
}
