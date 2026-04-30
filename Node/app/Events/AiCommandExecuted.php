<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels; // الاسم الصحيح ينتهي بـ s

class AiCommandExecuted implements ShouldBroadcast
{
    // هنا قمنا بتغييرها لتطابق الـ use فوق
    use Dispatchable, InteractsWithSockets, SerializesModels; 

    public $payload;

    public function __construct($payload)
    {
        $this->payload = $payload;
    }

    public function broadcastOn()
    {
        return new Channel('ai-commands');
    }
}




