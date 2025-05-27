<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable; 
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Pedidos;

class RegistrosPedidos extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'registros_pedidos';
    protected $fillable = [
        'tipo', 'medida', 'cantidad','id_pedido','nota'
    ];

    public function nomina(){ 
        return $this->belongsTo(Pedidos::class);
    }
}
