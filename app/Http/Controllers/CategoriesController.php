<?php

namespace App\Http\Controllers;

use App\Models\CompanyUser;
use App\Models\Inventory;
use App\Models\Categories;
use App\Models\PurchasesAndSales;
use App\Models\RecordsPurchasesAndSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesController extends Controller
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

        $company_id = CompanyUser::where('user_id', '=', $user->id)->first();
        $categories = Categories::where('company_id', $company_id->id)->get();


        // Pasar los datos al componente Inertia
        return Inertia::render('Categories/List', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ],
            'roles' => $roles,
            'categories' => $categories
        ]);
    }

    public function storage(Request $request)
    {
        try {
            $user_id = $request->user()->id;
            $company_id = CompanyUser::where('user_id', '=', $user_id)->first();

            $categoryExist = Categories::where('company_id', $company_id->id)->whereRaw('LOWER(name) = ?', [strtolower($request->get('name'))])->first();
            if ($categoryExist) {
                $mensaje = "Esa categoria ya la registraste";
                return back()->with('mensaje', $mensaje);
            }
            $category = new Categories();
            $category->name = $request->get('name');
            $category->description = $request->get('description');
            $category->url = '/' . strtolower(str_replace(' ', '-', $request->get('name')));
            $category->higher_category_id = $request->get('category');
            $category->company_id = $company_id->id;

            $category->save();

            $mensaje = "Correctamente creado";
            return back()->with('mensaje', $mensaje);
        } catch (\Exception $e) {
            dd($e->getMessage());
            $mensaje = "Error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $categoryExist = Categories::findOrFail($id);
            if ($categoryExist) {
                $categoryExist->name = $request->get('name');
                $categoryExist->description = $request->get('description');
                $categoryExist->url = '/' . strtolower(str_replace(' ', '-', $request->get('name')));
                $categoryExist->higher_category_id = $request->get('category');


                $categoryExist->touch();
                $categoryExist->update();
            }

            $mensaje = "Categoria no encontrada";
            return back()->with('mensaje', $mensaje);
        } catch (\Exception $e) {
            dd($e->getMessage());
            $mensaje = "Error al crear solicitud";
            return back()->with('mensaje', $mensaje);
        }
    }


}
