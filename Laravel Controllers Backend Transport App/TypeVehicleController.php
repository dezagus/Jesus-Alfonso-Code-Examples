<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TypeVehicle;

class TypeVehicleController extends Controller
{
    public function index()
    {
        $user = \Auth::user();
        
        $typeVehicles = TypeVehicle::all();
        
        return view('admin.typevehicle.index', compact('typeVehicles', 'user'));
    }

    public function store(Request $request)
    {
        $typeVehicle = new TypeVehicle;
        $typeVehicle->name = $request->name;
        $typeVehicle->commission = $request->commission;
        $typeVehicle->save();

        return redirect()->back()->with('message', 'Se ha creado el tipo de vehiculo correctamente.');

    }

    public function edit(TypeVehicle $typeVehicle, Request $request)
    {
        $user = \Auth::user();

        return view('admin.typevehicle.edit', compact('user', 'typeVehicle'));
    }

    public function update(TypeVehicle $typeVehicle, Request $request)
    {
        $typeVehicle->name = $request->name;
        $typeVehicle->commission = $request->commission;
        $typeVehicle->save();

        return redirect()->back()->with('message','Se ha actualizado correctamente el tipo de vehiculo.');
    }
}
