<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIconsTable extends Migration
{
    
    public function up()
    {
        Schema::create('icons', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del icono
            $table->string('value'); // Ruta o nombre del archivo SVG/PNG
            $table->timestamps();
        });
    }

   
    public function down()
    {
        Schema::dropIfExists('icons');
    }
}
