<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TicketSupport;
use App\ChatSupport;
use App\Events\ChatSupportEvent;

class ChatSupportController extends Controller
{
    public function index()
    {
        $user = \Auth::user();

        return view('admin.chat.index', compact('user'));
    }

    public function getPendingTicketSupport()
    {
        $ticket = TicketSupport::where('status', 1)->with('user')->get();

        return response()->json($ticket, 200);
    }

    public function getChatsTicketSupport(TicketSupport $ticketSupport)
    {
        $data['ticketSupport'] = $ticketSupport;
        $data['chatsSupport'] = $ticketSupport->chatSupport;
        $ticketSupport->readAdmin = NULL;
        $ticketSupport->save();
        return response()->json($data, 200);
    }

    public function saveTicketSupport(Request $request, TicketSupport $ticketSupport)
    {
        $ticketSupport->comments = $request->reasonClose;
        $ticketSupport->status = 2;
        $ticketSupport->save();

        return response()->json($ticketSupport, 200);
    }

    public function sendMessageAdminTicketSupport(Request $request, TicketSupport $ticketSupport)
    {
        $chatSupport = new ChatSupport;
        $chatSupport->ticket_support_id = $ticketSupport->id;
        $chatSupport->message = $request->messageAdmin;
        $chatSupport->admin = 1;
        $chatSupport->save();

        $ticketSupport->read = 1;
        $ticketSupport->save();

        event(new ChatSupportEvent($chatSupport));

        return response()->json($chatSupport, 200);
    }
}
