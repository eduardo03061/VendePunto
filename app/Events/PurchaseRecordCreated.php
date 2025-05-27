<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PurchaseRecordCreated implements ShouldBroadcast  // <-- Agrega ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $purchase_id;
    public $new_record;

    /**
     * Create a new event instance.
     */
    public function __construct($purchaseId, $record)
    {
        $this->purchase_id = $purchaseId;
        $this->new_record = $record;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('purchase.' . $this->purchase_id);
    }


    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'purchase_id' => $this->purchase_id,
            'new_record' => $this->new_record,
        ];
    }
}
