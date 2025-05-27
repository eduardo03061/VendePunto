<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Icon;
use App\Models\CompanyUser;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\InventoryExport;


class InventoryController extends Controller
{
    /**
     * Display the user's profile form.
     */


    public function index(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::user();

            // Verificar si se ha obtenido correctamente el usuario
            if (!$user instanceof \App\Models\User) {
                abort(401, 'Usuario no autenticado.');
            }

            // Obtener los roles del usuario
            $roles = $user->roles;

            // Obtener el valor de búsqueda del query string (si existe)
            $search = $request->query('search');

            // Construir la consulta de inventario con la relación a las categorías
            $inventoryQuery = Inventory::with('category') // Cargar la relación con categorías
            ->where('user_id', $user->id);

            // Si existe un término de búsqueda, agregar una cláusula where para el campo 'name'
            if ($search) {
                $inventoryQuery->where('name', 'like', '%' . $search . '%');
            }

            // Paginar los resultados (6 por página en este caso)
            $inventory = $inventoryQuery->paginate(6);

            // Devolver la vista con los datos paginados y los roles del usuario
            return Inertia::render('Inventory/List', [
                'items' => $inventory->items(),
                'icons' => Icon::all(), // Obtener todos los iconos
                'roles' => $roles,
                'categories' => Categories::all(), // Listar todas las categorías disponibles
                'search' => $search, // Pasar el término de búsqueda a la vista
                'pagination' => [
                    'current_page' => $inventory->currentPage(),
                    'last_page' => $inventory->lastPage(),
                    'per_page' => $inventory->perPage(),
                    'total' => $inventory->total(),
                    'next_page_url' => $inventory->nextPageUrl(),
                    'prev_page_url' => $inventory->previousPageUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }

    // En InventoryController.php
public function getCategories()
{
    try {
        return response()->json([
            'success' => true,
            'data' => Categories::all()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Error obteniendo categorías'
        ], 500);
    }
}


    public function search(Request $request)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener el valor de búsqueda del query string (si existe)
        $search = $request->query('search');

        // Construir la consulta de inventario
        $inventoryQuery = Inventory::where('user_id', $user->id);

        // Si existe un término de búsqueda, agregar una cláusula where para el campo 'name'
        if ($search) {
            $inventoryQuery->where('name', 'like', '%' . $search . '%');
        }

        // Obtener los resultados sin paginación
        $inventory = $inventoryQuery->get();

        // Devolver los resultados como JSON
        return response()->json($inventory);
    }


    public function export()
    {
        //return Excel::download(new InventoryExport, 'inventory.xlsx');
        return Excel::download(new InventoryExport, 'inventory.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function create()
    {
        return Inertia::render('Inventory/Create');
    }


    public function storage(Request $request)
    {
        try {
            //dd($request);
            if ($request->user()) {
                // Obtener todos los campos del formulario
                $name = $request->get('name');
                $category = $request->get('category');
                $barCode = $request->get('barCode');
                $sku = $request->get('sku');
                $description = $request->get('description');
                $salesUnit = $request->get('salesUnit');
                $showInStore = $request->get('showInStore');
                //dd($request);
                $stocks = $request->get('stocks');
                $purchasePrice = $request->get('purchasePrice');
                $sellingPrice = $request->get('sellingPrice');
                $user_id = $request->user()->id;
                $company_id = CompanyUser::where('user_id', '=', $user_id)->first();
                $filename = '';


                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $filename = time() . '.' . $image->getClientOriginalExtension();
                    $path = public_path('uploads/items/company/' . $company_id->id);
                    $image->move($path, $filename);
                }
                //dd($path);


                //dd($filename);
                // Encontrar al usuario
                $user = User::findOrFail($user_id);

                // Crear un nuevo registro de inventario
                $inventory = new Inventory();

                $inventory->name = $name;
                $inventory->category = $category;
                $inventory->barCode = $barCode;
                $inventory->sku = $sku;
                $inventory->image = "uploads/items/company/" . $company_id->id . "/" . $filename;
                $inventory->company_id = $company_id->id;
                $inventory->description = $description;
                $inventory->showInStore = $showInStore;
                $inventory->salesUnit = $salesUnit;
                $inventory->stocks = $stocks;
                $inventory->purchasePrice = $purchasePrice;
                $inventory->sellingPrice = $sellingPrice;
                $inventory->user_id = $user->id; // Asignar ID del usuario

                // Guardar el registro de inventario en la base de datos
                $inventory->save();

                $mensaje = "Correctamente creado";
                return back()->with('mensaje', $mensaje);
            } else {
                return view('welcome');
            }
        } catch (\Exception $e) {
            dd($e);
            $mensaje = "Error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            //dd($request);
            $item = Inventory::findOrFail($id);

            $item->name = $request->get('name');
            $item->category = $request->get('category');
            $item->barCode = $request->get('barCode');
            $item->sku = $request->get('sku');
            $item->description = $request->get('description');
            $item->salesUnit = $request->get('salesUnit');
            $item->stocks = $request->get('stocks');
            $item->purchasePrice = $request->get('purchasePrice');

            if ($request->hasFile('image')) {
                $user_id = $request->user()->id;
                $company_id = CompanyUser::where('user_id', '=', $user_id)->first();


                $image = $request->file('image');
                $filename = time() . '.' . $image->getClientOriginalExtension();
                $path = public_path('uploads/items/company/' . $company_id->id);
                $image->move($path, $filename);
                $item->image = "uploads/items/company/" . $company_id->id . "/" . $filename;
            }

            $item->sellingPrice = $request->get('sellingPrice');
            $item->touch();
            $item->update();

            $mensaje = "Actualizado con éxito";
            return back()->with('mensaje', $mensaje);
        } catch (\Exception $e) {
            $mensaje = "Error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $item = Inventory::findOrFail($id);
            $item->delete();

            return redirect()->back()->with('message', 'Se eliminó con exito');
        } catch (\Exception $e) {
            $mensaje = "Error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }

    /**
     * Endpoints Api
     */

    public function getInventory(Request $request)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;

        // Obtener el valor de búsqueda del query string (si existe)
        $search = $request->query('search');

        // Construir la consulta de inventario
        $inventoryQuery = Inventory::where('user_id', $user->id);

        // Si existe un término de búsqueda, agregar una cláusula where para el campo 'name'
        if ($search) {
            $inventoryQuery->where('name', 'like', '%' . $search . '%');
        }

        // Paginar los resultados (3 por página en este caso)
        //$inventory = $inventoryQuery->paginate(3);
        $inventory = $inventoryQuery->get();
        // Devolver la vista con los datos paginados y los roles del usuario
        /**
         * current_page' => $inventory->currentPage(),
         * 'last_page' => $inventory->lastPage(),
         * 'per_page' => $inventory->perPage(),
         * 'total' => $inventory->total(),
         * 'next_page_url' => $inventory->nextPageUrl(),
         * 'prev_page_url' => $inventory->previousPageUrl(),
         */
        //return response()->json($inventory->items());
        return response()->json($inventory);
    }

    public function newItem(Request $request)
    {
        try {
            // Verifica si el usuario está autenticado

            if (!$request->user()) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Recibir todos los campos del formulario
            $name = $request->get('name');
            $category = $request->get('category');
            $barCode = $request->get('barcode');
            $sku = $request->get('sku');
            $description = $request->get('description');
            $salesUnit = $request->get('salesUnit');
            $showInStore = $request->get('showInStore', false); // Ejemplo de valor predeterminado
            $stocks = $request->get('stock');
            $purchasePrice = $request->get('purchasePrice');
            $sellingPrice = $request->get('sellingPrice');
            $user_id = $request->user()->id;
            $company_id = CompanyUser::where('user_id', '=', $user_id)->first();
            $filename = '';

            // Manejar la carga de la imagen
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '.' . $image->getClientOriginalExtension();
                $relativePath = 'uploads/items/company/' . $company_id->id;

                // Define la ruta completa para mover el archivo
                $path = public_path($relativePath);
                $image->move($path, $filename);

                // Guarda solo la ruta relativa en la base de datos

            }
            // Crear un nuevo registro de inventario
            $inventory = new Inventory();
            $inventory->name = $name;
            $inventory->category = $category;
            $inventory->barCode = $barCode;
            $inventory->sku = $sku;
            $inventory->image = $relativePath . '/' . $filename;
            $inventory->company_id = $company_id->id;
            $inventory->description = $description;
            $inventory->showInStore = $showInStore;
            $inventory->salesUnit = $salesUnit;
            $inventory->stocks = $stocks;
            $inventory->purchasePrice = $purchasePrice;
            $inventory->sellingPrice = $sellingPrice;
            $inventory->user_id = $user_id;

            // Guardar el registro de inventario en la base de datos
            $inventory->save();

            return response()->json([
                'message' => 'Artículo creado exitosamente',
                'data' => $inventory,
            ], 201);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Error al crear artículo', 'details' => $e->getMessage()], 500);
        }
    }

}
