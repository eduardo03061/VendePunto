<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInventoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id(); 
            $table->string('name');
            $table->unsignedBigInteger('category')->nullable();
            $table->foreign('category')->references('id')->on('categories');
            
            $table->string('barCode');
            $table->string('sku');
            $table->string('image')->nullable();
            $table->bigInteger('company_id')->unsigned();
            $table->text('description');
            $table->string('salesUnit');
            $table->boolean('showInStore')->default(false);
            $table->integer('stocks')->unsigned();
            $table->decimal('purchasePrice', 8, 2)->nullable();
            $table->decimal('sellingPrice', 8, 2);
            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory');
    }
}
