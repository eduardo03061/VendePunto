<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Categories extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'categories';
    protected $fillable = [
        'name', 'description', 'url', 'company_id', 'higher_category_id'
    ];

    public function inventory()
    {
        return $this->belongsToMany(Inventory::class)
            ->using(Categories::class)
            ->withPivot([
                'category',
                'id'
            ]);

    }

}


