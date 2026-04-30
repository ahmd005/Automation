<?php

namespace App\Models;

use App\Models\Connection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;

    

    protected $fillable = [
        'type',
        'x_pos',
        'y_pos',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    // connections where this node is the source
    public function outgoingConnections()
    {
        return $this->hasMany(Connection::class, 'from_node_id');
    }

    // connections where this node is the target
    public function incomingConnections()
    {
        return $this->hasMany(Connection::class, 'to_node_id');
    }
}
