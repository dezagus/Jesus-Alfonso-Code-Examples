<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\PushNotification;
use App\User;
use Notification;
use App\Notifications\RememberDashboard;

class PushNotificationsController extends Controller
{
    public function index()
    {
        $user = \Auth::user();
        $notifications = PushNotification::all();
        return view('admin.pushnotifications.index', compact('user', 'notifications'));
    }

    public function store(Request $request)
    {
        $notification = new PushNotification;
        $notification->title = $request->title;
        $notification->content = $request->content;
        $notification->destination = $request->destination;
        $notification->save();
        
        $users = User::all();
        $title = $request->title;
        $content = $request->content;

        foreach ($users as $u) {
             $u->notify(new RememberDashboard($title, $content));
        }

        return redirect('/admin/pushnotifications')->with('message','Notificaciones enviadas correctamente.');
    }
}
