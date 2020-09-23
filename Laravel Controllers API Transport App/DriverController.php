<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DriverController extends Controller
{
  public $successStatus = 200;

  public function driverOnline()
  {
    $user = \Auth::user();
    $user->driver->offline = false;
    $user->driver->save();

    return response()->json(['success' => $user->driver], $this->successStatus);

  }

  public function driverDisconnect()
  {
    $user = \Auth::user();
    $user->driver->offline = true;
    $user->driver->save();

    return response()->json($user->driver, $this->successStatus);

  }

}
