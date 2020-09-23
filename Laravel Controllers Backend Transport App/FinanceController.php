<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\VirtualWalletDriver;

class FinanceController extends Controller
{
    public function index()
    {
        $user = \Auth::user();

        $virtualWallet = VirtualWalletDriver::all();

        return view('admin.finances.index', compact('user', 'virtualWallet'));
    }
}
