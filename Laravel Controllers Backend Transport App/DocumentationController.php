<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Driver;

class DocumentationController extends Controller
{
    public function approveDocument(Driver $driver, $value)
    {
        $backName = $value.'1';
        $driver->documentation->$value = 1;
        $driver->documentation->$backName = 1;
        $driver->documentation->save();

        return redirect('/admin/driver/show/'.$driver->id)->with('message','Documentación aprobada correctamente.');
    }

    public function rejectDocument(Driver $driver, $value)
    {
        $backName = $value.'1';
        $driver->documentation->$value = 2;
        $driver->documentation->$backName = 2;
        $driver->documentation->save();

        return redirect('/admin/driver/show/'.$driver->id)->with('message','Documentación rechazada correctamente.');
    }
}
