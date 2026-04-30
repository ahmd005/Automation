<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connection extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_node_id',
        'to_node_id',
    ];

    public function fromNode()
    {
        return $this->belongsTo(Node::class, 'from_node_id');
    }

    public function toNode()
    {
        return $this->belongsTo(Node::class, 'to_node_id');
    }
}
