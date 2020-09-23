<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\VirtualWalletDriver;
use App\LineVirtualWalletDriver;
use App\Travel;
use App\Driver;

class VirtualWalletDriverController extends Controller
{
    public function index()
    {
        $user = \Auth::user();

        $virtualWallet = VirtualWalletDriver::all();

        return view('admin.finances.virtualwallet.index', compact('user', 'virtualWallet'));
    }

    public function show(VirtualWalletDriver $virtualWalletDriver)
    {
        $user = \Auth::user();

        return view('admin.finances.virtualwallet.show', compact('virtualWalletDriver', 'user'));
    }

    public function create(VirtualWalletDriver $virtualWalletDriver, Request $request)
    {
        $user = \Auth::user();

        if (empty($request->from)) {
            $date = \Carbon\Carbon::now();
            $from = date('Y-m-d', strtotime($date.' -7 days'));
        } else {
            $from = date('Y-m-d', strtotime($request->from));
        }
  
        $to = date('Y-m-d', strtotime($request->to.' +1 days'));

        $driver = Driver::find($virtualWalletDriver->driver_id);

        $travelsFinished = $driver->travelsFinished()->where('cc', '!=', false)->where('line_virtual_wallet_driver', null)->whereRaw('DATE_FORMAT(created_at, "%Y-%m-%d") between "'.$from.'" AND  "'.$to.'" ')->get(); 

        $totalPending = $travelsFinished->sum('total');

        return view('admin.finances.virtualwallet.create', compact('virtualWalletDriver', 'driver', 'travelsFinished', 'user' ,'from', 'to', 'totalPending'));
    }

}
