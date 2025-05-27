<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\PurchasesAndSales;
use App\Models\RecordsPurchasesAndSales;
use App\Models\Company;
use App\Models\Categories;
use App\Models\Inventory;
use App\Models\User;
use Auth;
use Inertia\Inertia;

class StoresController extends Controller
{
    public function StoresIndex($name)
    {
        $store = Company::where('name', '=', $name)->first();
        $items = Inventory::where('company_id', '=', $store->id)
                          ->where('showInStore', '=', 1)
                          ->with('category') // Relación con la categoría
                          ->get();
        $categories = Categories::where('company_id', '=', $store->id)->get();

        return Inertia::render('Stores/Index', [
            'store' => $store,
            'items' => $items,
            'categories' => $categories
        ]);
    }
}