<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\TypeVehicle;

class TypeVehicleController extends Controller
{

    public function getTypeVehicle()
    {
        $typeVehicles = TypeVehicle::all();
        
        return response()->json($typeVehicles, 200);

    }
}
