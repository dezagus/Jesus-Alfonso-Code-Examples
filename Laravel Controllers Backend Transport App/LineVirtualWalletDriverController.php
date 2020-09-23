<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\VirtualWalletDriver;
use App\LineVirtualWalletDriver;
use App\Travel;
use App\Driver;

class LineVirtualWalletDriverController extends Controller
{
    
    public function store(VirtualWalletDriver $virtualWalletDriver, Request $request)
    {
        
        $lineVirtualWalletDriver = new LineVirtualWalletDriver;
        $lineVirtualWalletDriver->virtual_wallet_driver_id = $virtualWalletDriver->id;
        $lineVirtualWalletDriver->total_driver = $request->balance;
        $lineVirtualWalletDriver->commission = $request->have;
        $lineVirtualWalletDriver->paid = 1;
        $lineVirtualWalletDriver->total = $request->due;
        $lineVirtualWalletDriver->save();

        $driver = Driver::find($virtualWalletDriver->driver_id);

        $travelsFinished = $driver->travelsFinished()->where('line_virtual_wallet_driver', null)->whereRaw('DATE_FORMAT(created_at, "%Y-%m-%d") between "'.$request->from.'" AND  "'.$request->to.'" ')->get(); 

        for ($i=0; $i < count($travelsFinished); $i++) { 
            $travelsFinished[$i]->line_virtual_wallet_driver = $lineVirtualWalletDriver->id;
            $travelsFinished[$i]->save();
        }

        $virtualWalletDriver->total_pending = $virtualWalletDriver->total_pending - $request->balance;
        $virtualWalletDriver->total_commission = $virtualWalletDriver->total_commission + $request->have;
        $virtualWalletDriver->total_paid = $virtualWalletDriver->total_paid + $request->balance;
        $virtualWalletDriver->last_payment = $lineVirtualWalletDriver->created_at;
        $virtualWalletDriver->save();

        return redirect('admin/virtualWalletDriver/show/'.$virtualWalletDriver->id.'')->with('message', 'Pago creado correctamente.');
    }

        public function show(LineVirtualWalletDriver $lineVirtualWalletDriver)
        {
            $user = \Auth::user();

            $travels = Travel::where('line_virtual_wallet_driver', $lineVirtualWalletDriver->id)->get();

            return view('admin.finances.linevirtualwalletdriver.show', compact('lineVirtualWalletDriver', 'user', 'travels'));
        }
    }
