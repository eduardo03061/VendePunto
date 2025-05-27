<?php

namespace App\Http\Controllers;

use App\Models\CompanyUser;
use App\Models\Inventory;
use App\Models\PurchasesAndSales;
use App\Models\RecordsPurchasesAndSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si el usuario está autenticado
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;

        // Consultar las ventas mensuales
        $salesData = PurchasesAndSales::selectRaw("DATE_FORMAT(created_at, '%M') as month, MONTH(created_at) as month_number, SUM(quantity) as sales")
            ->where('type', 'sales')
            ->groupByRaw("DATE_FORMAT(created_at, '%M'), MONTH(created_at)")
            ->orderByRaw('month_number')
            ->get();

        // Consultar las compras por categoría

        $salesForCategory = RecordsPurchasesAndSales::join('purchases_and_sales', 'records_purchases_and_sales.id_sales', '=', 'purchases_and_sales.id')
            ->join('inventory', 'records_purchases_and_sales.id_item', '=', 'inventory.id') // Unión con la tabla de inventario
            ->join('categories', 'inventory.category', '=', 'categories.id') // Unión con la tabla de categorías
            ->selectRaw('categories.name as category, SUM(records_purchases_and_sales.kg) as purchases') // Obtener el nombre de la categoría
            ->where('purchases_and_sales.type', 'sales') // Filtrar por tipo "sales"
            ->groupBy('categories.name') // Agrupar por el nombre de la categoría
            ->orderBy('categories.name') // Ordenar por el nombre de la categoría
            ->get();

        // Pasar los datos al componente Inertia

         return redirect()->route('sales.list');
          /*return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ],
            'roles' => $roles,
            'salesData' => $salesData,
            'salesForCategory' => $salesForCategory,
            'status' => session('status'),
        ]);
          */
    }

    /*
     * EndPoints Api
     */
    public function home(Request $request)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }
        $inventory = Inventory::where('user_id', $user->id)->get();


        $company = CompanyUser::where('user_id', '=', $user->id)->first();
        $sales = PurchasesAndSales::where('company_id', '=', $company->company_id)->where('type', '=', 'sales')->orderBy('id', 'DESC')->get();

        return response()->json(['inventory' => $inventory,
            'sales' => $sales]);
    }
}
