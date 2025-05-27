<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Categories;

class Inventory extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'inventory';

    protected $fillable = [
        'id', 'name', 'category', 'barCode', 'company_id', 'sku', 'description', 'showInStore','salesUnit', 'stocks', 'purchasePrice', 'sellingPrice', 'user_id', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'stocks' => 'decimal:2', 
        'purchasePrice' => 'decimal:2',
        'sellingPrice' => 'decimal:2'
    ];
    
    public static $rules = [
        'stocks' => 'required|numeric|between:-99999999.99,99999999.99',
    ];


    public function category()
    {
        return $this->belongsTo(Categories::class, 'category', 'id');
    }

    public function records() {
        return $this->hasMany(RecordsPurchasesAndSales::class, 'id_item');
    }

}
