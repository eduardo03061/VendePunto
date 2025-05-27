<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CodeController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PurchasesAndSalesController;
use App\Http\Controllers\DashboardController;


Route::post('/code/generate', [CodeController::class, 'generate']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [InventoryController::class, 'getCategories'])->name('api.categories');
});


Route::post('/login', function (Request $request) {
    // Validar los datos recibidos
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required']
    ]);

    // Intentar autenticar al usuario con las credenciales
    if (Auth::attempt($credentials)) {
        $user = Auth::user();

        // Generar un token si la autenticación es exitosa
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // Si las credenciales no son válidas
    return response()->json([
        'message' => 'Credenciales incorrectas'
    ], 401);
});



Route::middleware('auth:sanctum')->get('/inventory', [InventoryController::class, 'getInventory']);
//Route::middleware('auth:sanctum')->get('/inventory/item/:id', [InventoryController::class, 'getItem']);
Route::middleware('auth:sanctum')->post('/inventory/new-item', [InventoryController::class, 'newItem']);



Route::middleware('auth:sanctum')->get('/sales', [PurchasesAndSalesController::class, 'getSales']);
Route::middleware('auth:sanctum')->get('/last-sale', [PurchasesAndSalesController::class, 'getLastSale']);
Route::middleware('auth:sanctum')->post('/sales/add-item', [PurchasesAndSalesController::class, 'addItem']);

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'home']);