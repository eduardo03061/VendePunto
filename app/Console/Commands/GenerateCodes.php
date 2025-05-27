<?php

namespace App\Console\Commands;

use App\Models\Code;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateCodes extends Command
{
    protected $signature = 'generate:codes {amount=10}'; // Cantidad por defecto: 10

    protected $description = 'Generates redeemable codes';

    public function handle()
    {
        $amount = $this->argument('amount');

        for ($i = 0; $i < $amount; $i++) {
            $code = new Code();
            $code->code = strtoupper(Str::random(10)); // Ejemplo: Código alfanumérico de 10 caracteres
            $code->save();
            $this->info("Generated code: " . $code->code);
        }

        $this->info("{$amount} codes generated successfully.");
    }
}