<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class ProfileController extends Controller
{
    public function index(User $user)
    {
        return view('admin.profile.index', compact('user'));
    }
}
