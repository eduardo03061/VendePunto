<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PurchasesAndSalesController;
use App\Http\Controllers\CodeController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StoresController;
use App\Http\Controllers\PageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;


/***
 * Vistas de la pagina principal
 */
Route::get('/registro', [PageController::class, 'register'])->name('register.page');
Route::get('/privacidad', [PageController::class, 'privacidad'])->name('privacidad');
Route::get('/terminos', [PageController::class, 'terminos'])->name('terminos');
Route::get('/faqs', [PageController::class, 'faqs'])->name('faqs');

//Route::get('/select-plans', [PageController::class, 'index'])->name('plans');
Route::get('/subscribe/{plan}', [PageController::class, 'subscribe'])->name('subscribe');
Route::get('/payment/{plan}', [PageController::class, 'payment'])->name('payment');
Route::post('/payment', [PageController::class, 'paymentPocess'])->name('payment.process');


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest');;

Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/Inventory', [InventoryController::class, 'index'])->name('inventory.list');
    Route::get('/Inventory/new-item', [InventoryController::class, 'create'])->name('inventory.create');
    Route::post('/Inventory/new-item', [InventoryController::class, 'storage'])->name('inventory.storage');
    Route::post('/Inventory/edit/{id}', [InventoryController::class, 'update'])->name('inventory.update');
    Route::post('/Inventory/Delete/{id}', [InventoryController::class, 'delete'])->name('inventory.delete');
    Route::get('/Inventory/export', [InventoryController::class, 'export'])->name('inventory.export');
    Route::get('/inventory/search', [InventoryController::class, 'search'])->name('inventory.search');


    // Crear nueva venta
    Route::post('/Sales', [PurchasesAndSalesController::class, 'SalesCreate'])->name('sales.store');
    Route::get('/Sales/create', [PurchasesAndSalesController::class, 'SalesCreate'])->name('sales.create');
    // Reanudar venta existente
    Route::get('/Sales/{sale}/edit', [PurchasesAndSalesController::class, 'SalesEdit'])->name('sales.edit');
    Route::post('/Sales/{sale}/preview', [PurchasesAndSalesController::class, 'SalesPreview'])->name('sales.preview');
    Route::get('/Sales/{sale}/edit', [PurchasesAndSalesController::class, 'SalesEdit'])->name('sales.edit');
    Route::get('/Sales/list', [PurchasesAndSalesController::class, 'SalesList'])->name('sales.list');
    Route::get('/Sales/Details/{id}', [PurchasesAndSalesController::class, 'SalesShow'])->name('sales.showdetails');
    Route::get('/Sales/Print/{id}', [PurchasesAndSalesController::class, 'SalesPrint'])->name('sales.print');
    Route::post('/Sales/{sale}/finalize', [PurchasesAndSalesController::class, 'FinalizeSale'])->name('sales.finalize');
    Route::delete('/sales/{sale}', [PurchasesAndSalesController::class, 'CancelSale'])->name('sales.delete');


    Route::get('/Purchases/list', [PurchasesAndSalesController::class, 'PurchasesList'])->name('purchases.list');
    Route::get('/Purchases/new-purchase', [PurchasesAndSalesController::class, 'PurchasesCreate'])->name('purchases.create');
    Route::post('/Purchases/store-purchase', [PurchasesAndSalesController::class, 'PurchasesStorage'])->name('purchases.storage');
    Route::get('/Purchases/Details/{id}', [PurchasesAndSalesController::class, 'PurchasesShow'])->name('purchases.showdetails');
    Route::post('/purchases/add-to-cart', [PurchasesAndSalesController::class, 'addToPurchaseCart'])->name('purchases.add-to-cart');
    Route::post('/purchases/finalize', [PurchasesAndSalesController::class, 'finalizePurchase'])->name('purchases.finalize');
    Route::get('/purchases/get-cart-updates', [PurchasesAndSalesController::class, 'getCartUpdates'])->name('purchases.get-cart-updates');

    Route::get('/Purchases/add-to-cart-test/{purchase_id}', function ($purchase_id) {
        return Inertia::render('AddToCartTest', [
            'purchase_id' => $purchase_id
        ]);
    })->name('add-to-cart-test');

    Route::post('/Webhook/purchase', [PurchasesAndSalesController::class, 'handlePurchase'])->name('webhook.purchase');
    Route::post('/Webhook/sale', [PurchasesAndSalesController::class, 'handleSale'])->name('webhook.sale');


    Route::get('/Categories/list', [CategoriesController::class, 'index'])->name('categories.list');
    Route::post('/Categories/new-category', [CategoriesController::class, 'storage'])->name('categories.storage');
    Route::post('/Categories/edit/{id}', [CategoriesController::class, 'update'])->name('categories.update');



    Route::get('/Customers',[CustomersController::class, 'index'])->name('customers.list');
});
Route::get('/Tienda/{name}', [StoresController::class, 'StoresIndex'])->name('stores.index');

Route::get('/features', [StoresController::class, 'features'])->name('features');
Route::middleware('auth')->group(function () {
    Route::get('/profile/welcome', [ProfileController::class, 'welcome'])->name('profile.welcome');
    Route::get('/profile/info', [ProfileController::class, 'info'])->name('profile.info');
    Route::post('/profile/register-info', [ProfileController::class, 'registerinfo'])->name('profile.registerinfo');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
});

Route::middleware(['auth', 'subscription'])->group(function () {
    // Rutas que requieren suscripción
    Route::get('/Settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/Settings/account-update', [SettingsController::class, 'accountUpdate'])->name('settings.accountUpdate');
    Route::post('/Settings/add-user', [RegisteredUserController::class, 'addUser'])->name('settings.addUser');
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard'); 

    Route::post('/Settings/update-company', [SettingsController::class, 'updateCompany'])->name('company.updateProfile');
});

Route::post('/redeem-code', [CodeController::class, 'redeem'])->name('code.redeem')->middleware('auth'); // Protegida por autenticación
Route::get('/redeem', [PageController::class, 'redeem'])->name('redeem')->middleware('auth'); // Vista para actualizar la suscripción

require __DIR__ . '/auth.php';
