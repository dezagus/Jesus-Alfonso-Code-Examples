<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Driver;
use App\Documentation;

class DriverController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        $drivers = Driver::orderBy('id', 'asc')->get();
        
        return view('admin.drivers.index', compact('user', 'drivers'));
    }

    public function show(Driver $driver)
    {
        $user = Auth::user();

        if ($driver->viewed != true) {
            $driver->viewed = true;
            $driver->save();
        }

        $documentation = Documentation::where('user_id', $driver->user_id)->first();
        return view('admin.drivers.show', compact('user', 'driver', 'documentation'));
    }

    public function updateDriver(Request $request, Driver $driver)
    {
        $driver->user->name = $request->name;
        $driver->user->last_name = $request->last_name;
        $driver->user->phone = $request->phone;
        $driver->user->email = $request->email;
        $driver->user->save();

        return redirect('/admin/driver/show/'.$driver->id)->with('message', 'Se ha editado correctamente al conductor');
    }

    public function approve(Driver $driver)
    {
        $driver->validated = 1;
        $driver->save();

        return redirect('/admin/driver/show/'.$driver->id)->with('message', 'Se ha aprobado correctamente al conductor');
    }

    public function disapprove(Driver $driver)
    {
        $driver->validated = 2;
        $driver->save();

        return redirect('/admin/driver/show/'.$driver->id)->with('message', 'Se ha desaprobado correctamente al conductor');
    }

    public function banDriver(Driver $driver, $value)
    {
        if ($value == 'true') {
            $driver->banned = 1;
            $driver->save();
        return redirect()->back()->with('message', 'Se ha dado de baja correctamente');

        } else {
            $driver->banned = null;
            $driver->save();
        return redirect()->back()->with('message', 'Se ha dado de alta correctamente');

        }
        

    }
}
