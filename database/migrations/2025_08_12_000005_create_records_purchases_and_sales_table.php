<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordsPurchasesAndSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('records_purchases_and_sales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('id_sales')->unsigned();

            $table->string('name');

            $table->decimal('kg', 8, 2);

            $table->bigInteger('id_item')->unsigned();
            $table->foreign('id_item')->references('id')->on('inventory')->onDelete("cascade");

            $table->decimal('price', 8, 2);
            $table->timestamps();
            $table->string('status', 255)->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('records_purchases_and_sales');
    }
}
