<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class Company extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'companies';

    protected $fillable = [
        'id',
        'name',
        'description',
        'phone',
        'category',
        'rSocial',
        'rfc',
        'address',
        'logoImage',
        'coverImage',
        'created_at',
        'updated_at'
    ];
}
