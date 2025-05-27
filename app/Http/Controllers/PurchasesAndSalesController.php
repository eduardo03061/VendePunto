<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Events\PurchaseRecordCreated;
use App\Models\PurchasesAndSales;
use App\Models\RecordsPurchasesAndSales;
use App\Models\CompanyUser;
use App\Models\Company;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class PurchasesAndSalesController extends Controller
{
    // En PurchasesAndSalesController.php
    public function SalesList()
    {
        $user = Auth::user();
        $company = CompanyUser::where('user_id', $user->id)->first();

        $sales = PurchasesAndSales::with(['user' => function ($query) {
            $query->select('id', 'name'); // Optimización: traer solo datos necesarios
        }])
            ->where('company_id', $company->company_id)
            ->where('type', 'sales')
            ->orderBy('created_at', 'DESC')
            ->get();

        return Inertia::render('Sales/List', [
            'sales' => $sales,
            'roles' => $user->roles
        ]);
    }


    public function PurchasesList()
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;

        $user_id = $user->id;
        $company = CompanyUser::where('user_id', '=', $user_id)->first();
        $purchases = PurchasesAndSales::where('company_id', '=', $company->company_id)->where('type', '=', 'purchases')->orderBy('id', 'DESC')->get();


        return Inertia::render('Purchases/List', [
            'purchases' => $purchases,
            'roles' => $roles,
        ]);
    }

    public function PurchasesCreate(Request $request)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;
        $company = CompanyUser::where('user_id', '=', $user->id)->first();

        $items = Inventory::where('company_id', '=', $company->company_id)->get();

        $purchase = new PurchasesAndSales();
        $purchase->payment_method = 'efectivo';
        $purchase->type = 'purchases';
        $purchase->quantity = 0;
        $purchase->user_id = $user->id;
        $purchase->company_id = $company->company_id;
        $purchase->status = 'pendiente';
        $purchase->created_at = now();
        $purchase->save();

        $purchaseId = $purchase->id;

        if ($purchase) {
            // La inserción fue exitosa
            return Inertia::render('Purchases/Create', [
                'items' => $items,
                'roles' => $roles,
                'message' => 'Compra registrada con éxito.',
                'purchase_id' => $purchaseId
            ]);
        } else {
            // La inserción falló
            return Inertia::render('Purchases/Create', [

                'error' => 'Error al registrar la compra.'
            ]);
        }
    }

    public function addToPurchaseCart(Request $request)
    {
        $purchaseId = $request->input('purchase_id');
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $item = Inventory::findOrFail($productId);

        // Crear el registro en records_purchases_and_sales
        $record = new RecordsPurchasesAndSales();
        $record->name = $item->name;
        $record->kg = $quantity;
        $record->id_sales = $purchaseId;
        $record->id_item = $item->id;
        $record->price = $item->purchasePrice;
        $record->created_at = now();
        $record->save();

        event(new PurchaseRecordCreated($purchaseId, $record));

        // Obtener los datos para la vista
        $user = Auth::user();
        $roles = $user->roles;
        $company = CompanyUser::where('user_id', '=', $user->id)->first();
        $items = Inventory::where('company_id', '=', $company->company_id)->get();
        $purchaseId = $request->input('purchase_id');

        // Respuesta Inertia.js
        return Inertia::render('Purchases/Create', [
            'auth' => $user,
            'roles' => $roles,
            'items' => $items,
            'purchase_id' => $purchaseId,
            'record' => $record, // Asegúrate de pasar el nuevo registro a la vista
        ]);
    }


    // En PurchasesAndSalesController.php
    public function SalesCreate(Request $request)
    {
        // A. Obtener usuario autenticado
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // B. Obtener compañía del usuario
        $company = CompanyUser::where('user_id', $user->id)->first();
        if (!$company) {
            return back()->with('error', 'Usuario sin compañía asociada');
        }

        // C. Crear la venta con id_user
        $sale = PurchasesAndSales::create([
            'payment_method' => 'efectivo',
            'type' => 'sales',
            'quantity' => 0,
            'user_id' => $user->id,
            'company_id' => $company->company_id,
            'status' => 'pendiente'
        ]);

        // D. Redirigir a la edición de la venta recién creada
        return redirect()->route('sales.edit', $sale->id);
    }

    public function getPendingSale()
    {
        $user = Auth::user();
        $company = CompanyUser::where('user_id', $user->id)->first();

        $pendingSale = PurchasesAndSales::where('company_id', $company->company_id)
            ->where('type', 'sales')
            ->where('status', 'pendiente')
            ->first();

        return response()->json([
            'pendingSale' => $pendingSale,
            'items' => $pendingSale ? RecordsPurchasesAndSales::where('id_sales', $pendingSale->id)->get() : []
        ]);
    }

    public function SalesPrint($id)
    {
        $sale = PurchasesAndSales::where('id', '=', $id)->first();
        $items = RecordsPurchasesAndSales::where('id_sales', '=', $id)->get();
        
        $user_id = Auth::user()->id;
        $company_id = CompanyUser::where('user_id', '=', $user_id)->first();
        $companyData = Company::where('id', '=', $company_id->company_id)->first();
      
        return Inertia::render('Sales/Print', [
            'sale' => $sale,
            'items' => $items,
            'company'=>$companyData 
        ]);
    }


    public function PurchasesShow($id)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;
        $purschaces = RecordsPurchasesAndSales::where('id_sales', '=', $id)->get();


        return Inertia::render('Purchases/Details', [
            'purschaces' => $purschaces,
            'roles' => $roles,
        ]);
    }

    public function SalesShow($id)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;
        $sales = RecordsPurchasesAndSales::where('id_sales', '=', $id)->get();

        return Inertia::render('Sales/Details', [
            'sales' => $sales,
            'roles' => $roles,
        ]);
    }

    public function getCartUpdates(Request $request)
    {
        $purchaseId = $request->input('purchase_id');
        $currentCount = $request->input('count');

        // Obtener todos los registros de la compra
        $cartItems = RecordsPurchasesAndSales::where('id_sales', $purchaseId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Contar la cantidad total de registros
        $totalCount = $cartItems->count();

        // Verificar si hay nuevos registros
        if ($totalCount > $currentCount) {


            /// Mapear los elementos para incluir las propiedades necesarias
            $cartItems = $cartItems->map(function ($item) {
                return [
                    'name' => $item->name,
                    'cant' => $item->kg,
                    'id_item' => $item->id_item,
                    'price' => $item->price, // Asumo que 'price' es la columna que quieres usar para 'purchasePrice'
                    'purchasePrice' => $item->price, // Agregar purchasePrice
                ];
            });

            return response()->json([
                'has_updates' => $totalCount > $currentCount,
                'items' => $cartItems
            ]);
        } else {
            // No hay nuevos registros
            return response()->json([
                'has_updates' => false,
            ]);
        }
    }


    public function PurchasesStorage(Request $request)
    {
        try {
            //dd($request);
            if ($request->user()) {
                $user_id = Auth::user()->id;
                $company_id = CompanyUser::where('user_id', '=', $user_id)->first();

                // Obtener el ID de la compra de la solicitud
                $purchaseId = $request->input('purchase_id');

                // Buscar la compra existente
                $purchase = PurchasesAndSales::findOrFail($purchaseId);

                // Actualizar los datos de la compra
                $purchase->quantity = $request->get('totalSales');
                $purchase->status = 'concretado'; // Cambiar el status
                $purchase->save();


                $tempSessionId = $request->input('temp_session_id');
                $records = RecordsPurchasesAndSales::where('temp_session_id', $tempSessionId)->get();


                //Restar el inventario
                $itemsJson = $request->input('itemsToSale');
                $totalSales = 0;
                //dd($itemsJson);
                foreach ($itemsJson as $itemJson) {

                    $item = Inventory::findOrFail($itemJson['id']);

                    $item->stocks = $item->stocks + $itemJson['cant'];

                    $item->update();

                    //dd($item);
                    $registros = new RecordsPurchasesAndSales();

                    $registros->name = $itemJson['name'];
                    $registros->kg = $itemJson['cant'];
                    $registros->id_sales = $purchaseId;
                    $registros->id_item = $item['id'];
                    $registros->price = $item->purchasePrice;
                    $registros->created_at = strtotime($request->get('date'));
                    $registros->id_sales = $purchaseId;
                    $registros->save();

                    broadcast(new PurchaseRecordCreated($purchaseId, $registros))->toOthers();
                }

                $mensaje = "Compra actualizada correctamente";
                return back()->with('mensaje', $mensaje);
            } else {
                return view('welcome');
            }
        } catch (\Exception $e) {
            dd($e);
            $mensaje = "error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }




    public function FinalizeSale(Request $request, $saleId)
    {
        try {

            $validated = $request->validate([
                'total' => 'required|numeric',
                'subtotal' => 'required|numeric|min:0',
                'discount' => 'required|numeric|min:0',
                'payment_method' => 'required|string|in:efectivo,card',
                'card_last_four' => 'required_if:payment_method,card|string|size:4',
                'received_amount' => 'required_if:payment_method,efectivo|numeric|min:0',
                'client_timezone' => 'required|string',
                 'client_local_time' => 'required|date',
                'items' => 'required|array',
                'items.*.id' => 'required|exists:inventory,id',
                'items.*.cant' => 'required|numeric|min:0.1',
                'items.*.sellingPrice' => 'required|numeric|min:0',
                'items.*.name' => 'required|string'
            ]);

            $clientTime = Carbon::parse($validated['client_local_time'])
            ->setTimezone($validated['client_timezone'])
            ->utc();

            // Actualizar venta
            $sale = PurchasesAndSales::findOrFail($saleId);
            $sale->quantity = $validated['total'];
            $sale->subtotal = $validated['subtotal'];
            $sale->discount_amount = $validated['discount'];
            $sale->payment_method = $validated['payment_method'];
            $sale->card_last_four = $validated['card_last_four'] ?? null;
            $sale->status = 'completado';
            $sale->closed_at = $clientTime;
            $sale->save();

            //productos
            // Eliminar registros antiguos (si existen)
            RecordsPurchasesAndSales::where('id_sales', $saleId)->delete();

            // Crear nuevos registros de productos
            foreach ($validated['items'] as $item) {
                // Registrar en records_purchases_and_sales
                $record = RecordsPurchasesAndSales::create([
                    'id_sales' => $saleId,
                    'id_item' => $item['id'],
                    'name' => $item['name'],
                    'kg' => $item['cant'],
                    'price' => $item['sellingPrice'],
                    'status' => 'completado'
                ]);

                // Actualizar inventario
                $inventoryItem = Inventory::find($item['id']);
                if (!$inventoryItem) {
                    throw new \Exception("Producto no encontrado: {$item['id']}");
                }

                // if ($inventoryItem->stocks < $item['cant']) {
                //     throw new \Exception("Stock insuficiente para {$inventoryItem->name}");
                // }

                $inventoryItem->decrement('stocks', $item['cant']);
            }
            return redirect()->route('sales.list')->with('success', 'Venta completada');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function SalesEdit($saleId)
    {
        $sale = PurchasesAndSales::with('records')->findOrFail($saleId);

        // Obtener categorías de la compañía
        $categories = Inventory::where('company_id', $sale->company_id)
            ->with('category') // Asumiendo relación category en Inventory
            ->get()
            ->pluck('category')
            ->unique()
            ->values();

        return Inertia::render('Sales/Create', [
            'items' => Inventory::where('company_id', $sale->company_id)->get(),
            'categories' => $categories, // 👈 Pasar categorías
            'initialItems' => $sale->records->map(function ($record) {
                return [
                    'id' => $record->id_item,
                    'cant' => $record->kg,
                    'name' => $record->name,
                    'sellingPrice' => $record->price,
                    'stock' => $record->inventory->stocks ?? 0
                ];
            }),
            'saleId' => $saleId,
            'roles' => Auth::user()->roles
        ]);
    }


    public function SalesPreview($saleId, Request $request)
    {
        $sale = PurchasesAndSales::findOrFail($saleId);
        $user = Auth::user();

        RecordsPurchasesAndSales::where('id_sales', $saleId)->delete();

        foreach ($request->itemsToSale as $item) {
            RecordsPurchasesAndSales::create([
                'id_sales' => $saleId,
                'id_item' => $item['id'],
                'name' => $item['name'],
                'kg' => $item['cant'],
                'price' => $item['sellingPrice'],
                'status' => 'pendiente'
            ]);
        }

        $inventoryItem = Inventory::find($item['id']);
        $inventoryItem->stocks -= $item['cant'];
        $inventoryItem->save();

        return Inertia::render('Sales/Preview', [
            'items' => $request->itemsToSale,
            'total' => $request->total,
            'sale' => $sale,
            'roles' => $user->roles
        ]);
    }

    public function CancelSale($id)
    {
        try {
            // Eliminar registros relacionados primero
            RecordsPurchasesAndSales::where('id_sales', $id)->delete();

            // Eliminar la venta principal
            PurchasesAndSales::findOrFail($id)->delete();

            return redirect()->route('sales.list')->with('success', 'Venta eliminada completamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar la venta: ' . $e->getMessage());
        }
    }

    /**
     * Api endpoints
     */
    public function getLastSale(Request $request)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        $company = CompanyUser::where('user_id', '=', $user->id)->first();

        // Obtener la última venta
        $sale = PurchasesAndSales::where('company_id', '=', $company->company_id)
            ->where('type', '=', 'sales')
            ->orderBy('id', 'DESC')
            ->first();

        // Retornar la última venta
        return response()->json($sale);
    }

    public function addItem(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'sale_id' => 'required|exists:purchases_and_sales,id', // Asegúrate de que la venta exista
            'barcode' => 'required|string', // Validar el código de barras
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 422);
        }

        // Obtener los datos de la solicitud
        $saleId = $request->input('sale_id');
        $barcode = $request->input('barcode');

        // Aquí puedes buscar el artículo por su código de barras
        $item = Inventory::where('barcode', $barcode)->first();

        if (!$item) {
            return response()->json([
                'error' => 'Artículo no encontrado.',
            ], 404);
        }

        // Agregar el artículo a la venta
        $sale = PurchasesAndSales::find($saleId);


        $item->stocks = $item->stocks - 1;

        $item->update();

        //dd($item);
        $registros = new RecordsPurchasesAndSales();

        $registros->name = $item->name;
        $registros->kg = 1;


        $registros->id_sales = $sale->id;
        $registros->id_item = $item->id;

        $registros->price = $item->sellingPrice;
        $registros->created_at = '2024-10-12 08:45:38';
        $registros->save();
        return response()->json([
            'message' => 'Artículo agregado a la venta.',
            'name' => $item->name, // Devolver el nombre del artículo agregado
        ], 200);
    }

    // public function handlePurchase(Request $request)
    // {
    //     // Valida los datos recibidos en la solicitud
    //     $request->validate([
    //         'productName' => 'required|string',
    //         'date' => 'required|date',
    //         'totalSales' => 'required|numeric',
    //         'itemsToSale' => 'required|array',
    //     ]);

    //     // Crea un nuevo registro de compra
    //     $purchase = Purchase::create([
    //         'productName' => $request->productName,
    //         'date' => $request->date,
    //         'totalSales' => $request->totalSales,
    //     ]);

    //     // Agrega los items al carrito (puedes usar una relación many-to-many o guardar los items como JSON en un campo)
    //     foreach ($request->itemsToSale as $item) {
    //         $item = Inventory::findOrFail($itemJson['id']);
    //         $item->stocks = $item->stocks + $itemJson['cant'];
    //         $item->update();
    //     }

    //     // Puedes devolver una respuesta al frontend si es necesario
    //     return response()->json(['message' => 'Compra registrada correctamente'], 200);
    // }

    // public function handleSale(Request $request)
    // {
    //     // Valida los datos recibidos en la solicitud
    //     $request->validate([
    //         // ... (campos para la venta)
    //     ]);

    //     // Crea un nuevo registro de venta
    //     $sale = Sale::create([
    //         // ... (campos para la venta)
    //     ]);

    //     // Agrega los items al carrito (puedes usar una relación many-to-many o guardar los items como JSON en un campo)
    //     foreach ($request->itemsToSale as $item) {
    //         $item = Inventory::findOrFail($itemJson['id']);
    //         $item->stocks = $item->stocks - $itemJson['cant'];
    //         $item->update();
    //     }

    //     // Puedes devolver una respuesta al frontend si es necesario
    //     return response()->json(['message' => 'Venta registrada correctamente'], 200);
    // }


    public function getSales(Request $request)
    {
        $user = Auth::user();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }


        $user_id = $user->id;
        $company = CompanyUser::where('user_id', '=', $user_id)->first();
        $sales = PurchasesAndSales::where('company_id', '=', $company->company_id)->where('type', '=', 'sales')->orderBy('id', 'DESC')->get();

        return response()->json($sales);
    }
}
