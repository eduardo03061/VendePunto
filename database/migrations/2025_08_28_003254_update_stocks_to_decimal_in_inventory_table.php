<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStocksToDecimalInInventoryTable extends Migration
{
    public function up()
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->decimal('stocks', 10, 2)->default(0.00)->change(); // 10 dígitos en total, 2 decimales
        });
    }

    public function down()
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->integer('stocks')->default(0)->change();
        });
    }
}
