<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class PurchasesAndSales extends Authenticatable
{
    use Notifiable;

    protected $table = 'purchases_and_sales';

    protected $fillable = [
        'id',
        'payment_method',
        'card_last_four',
        'type',
        'user_id',
        'quantity',
        'company_id',
        'status',
        // Nuevos campos
        'transaction_date',
        'total_amount',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'currency',
        'transaction_id',
        'authorization_code',
        'payment_status',
        'customer_id',
        'employee_id',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    //relación aquí ▼
    public function records()
    {
        return $this->hasMany(RecordsPurchasesAndSales::class, 'id_sales');
    }
}
