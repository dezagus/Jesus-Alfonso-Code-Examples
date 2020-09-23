<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\User;
use App\Referred;
use Hashids\Hashids;
use App\Http\Controllers\Controller;

class ReferredController extends Controller
{
    public function index()
    {
        $referred = Referred::all();
        $user = \Auth::user();

        return view('admin.referred.index', compact('referred', 'user'));
    }

    public function getReferredCode()
    {

        $user = \Auth::user();

        $code = $user->referredCode;

        $data['refferedCode'] = $code;

        return response()->json($data, 200);
    }
}
