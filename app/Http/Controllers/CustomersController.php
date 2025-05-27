<?php

namespace App\Http\Controllers;

use App\Models\CompanyUser;
use App\Models\Customers;
use App\Models\Inventory;
use App\Models\PurchasesAndSales;
use App\Models\RecordsPurchasesAndSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomersController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request): Response
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si el usuario está autenticado
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;
        $company_id = CompanyUser::where('user_id', $user->id)->first()->company_id;
        $customers = Customers::where('company_id', $company_id)->get();

        // Obtener el valor de búsqueda del query string (si existe)
        $search = $request->query('search');

        // Construir la consulta de inventario con la relación a las categorías
        $customersQuery = Customers::where('company_id', $company_id);

        // Si existe un término de búsqueda, agregar una cláusula where para el campo 'name'
        if ($search) {
            $customersQuery->where('name', 'like', '%' . $search . '%');
        }

        // Paginar los resultados (6 por página en este caso)
        $customers = $customersQuery->paginate(6);

        return Inertia::render('Customers/Index', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ],
            'roles' => $roles,
            'customers' => $customers->items(),
            'pagination' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
                'next_page_url' => $customers->nextPageUrl(),
                'prev_page_url' => $customers->previousPageUrl(),
            ],
        ]);
    }
}
