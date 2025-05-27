<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRemainingFieldsToPurchasesAndSalesTable extends Migration
{
    public function up()
{
    Schema::table('purchases_and_sales', function (Blueprint $table) {
        // Campos temporales
        if (!Schema::hasColumn('purchases_and_sales', 'closed_at')) {
            $table->datetime('closed_at')->nullable()->after('status');
        }

        // Verificar y agregar customer_id si no existe (como respaldo)
        if (!Schema::hasColumn('purchases_and_sales', 'customer_id')) {
            $table->foreignId('customer_id')->nullable()->after('company_id'); // Ajusta según tu estructura real
        }

        // Verificar y agregar employee_id
        if (!Schema::hasColumn('purchases_and_sales', 'employee_id')) {
            $table->foreignId('employee_id')->nullable()->after('customer_id'); // Ahora customer_id existe
        }

    });
}

    // public function down()
    // {
    //     Schema::table('purchases_and_sales', function (Blueprint $table) {
    //         // Eliminar solo los campos agregados en esta migración
    //         $table->dropColumn([
    //             'closed_at',
    //             'store_id',
    //             'shipping_method',
    //             'tracking_number',
    //             'shipping_cost',
    //             'refunded_from_id',
    //             'refund_reason',
    //             'loyalty_points_used',
    //             'loyalty_points_earned'
    //         ]);

    //         // Eliminar foreign keys específicas
    //         $table->dropForeign(['store_id']);
    //         $table->dropForeign(['refunded_from_id']);
    //     });
    // }
}