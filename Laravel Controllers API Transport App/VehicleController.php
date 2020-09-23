<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Vehicle;
use App\Events\PrintVehicle;

class VehicleController extends Controller
{
  public $successStatus = 200;

  public function getVehicle()
  {
    $user = \Auth::user();

    $vehicle = Vehicle::where('user_id', $user->id)->first();

    return response()->json($vehicle, $this->successStatus);
  }

  public function storeVehicle(Request $request)
  {
    $user = \Auth::user();

    if (isset($request->vehicle_id) != null) {
        $vehicle = Vehicle::find($request->vehicle_id);
    } else {
        $vehicle = new Vehicle;
    }

    $vehicle->user_id = $user->id;
    $vehicle->type_vehicle_id = $request->type_vehicle_id;
    $vehicle->brand = $request->brand;
    $vehicle->model = $request->model;
    $vehicle->year = $request->year;
    $vehicle->color = $request->color;
    $vehicle->patent = $request->patent;
    $vehicle->save();

    return response()->json($vehicle, $this->successStatus);
  }

  public function printVehicles(Request $request)
    {
        $vehicle = [
            'driver_id' => $request->driver_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'heading' => $request->heading,
        ];

        event(new PrintVehicle($vehicle));

        return response()->json($vehicle, $this->successStatus);

    }

}
