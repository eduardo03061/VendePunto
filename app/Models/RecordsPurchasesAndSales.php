<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class RecordsPurchasesAndSales extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'records_purchases_and_sales';
    protected $fillable = [
        'name', 'id_sales','kg','id_item','price', 'status'
    ];

    public function sale()
{
    return $this->belongsTo(PurchasesAndSales::class, 'id_sales');
}

}
