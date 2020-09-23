<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BalanceDriver;
use App\Driver;

class BalanceDriverController extends Controller
{
    public function index()
    {
        $user = \Auth::user();

        $drivers = Driver::all();

        return view('admin.finances.balancedriver.index', compact('drivers', 'user'));
    }
}
