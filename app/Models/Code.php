<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Code extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 
        'company_id',
        'user_id',
        'subcription_days',
        'subscription_id',
        'redeemed_at',
        'expires_at',
    ];
}