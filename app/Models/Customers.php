<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'nickname',
        'description',
        'notes',
        'created_at',
        'updated_at',
    ];
}