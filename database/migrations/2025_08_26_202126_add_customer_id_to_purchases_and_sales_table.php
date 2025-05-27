<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('purchases_and_sales', function (Blueprint $table) {
        // Agregar customer_id si no existe
        if (!Schema::hasColumn('purchases_and_sales', 'customer_id')) {
            $table->foreignId('customer_id')->nullable()->after('company_id'); // Ajusta el "after" según tu estructura
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases_and_sales', function (Blueprint $table) {
            //
        });
    }
};
