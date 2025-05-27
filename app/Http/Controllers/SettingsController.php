<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\CompanyUser;
use App\Models\Roles;
use App\Models\Inventory;
use App\Models\Code;
use App\Models\Subscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request): Response
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        $companyUser = CompanyUser::where('user_id', '=', $user->id)->first();
        //Buscar en la tabla codes  el ultimo codigo asignado a este usuario
        $code = Code::where('company_id', $companyUser->company_id)->orderBy('id', 'desc')->first();

        //Buscar la suscripcion de la empresa

        $subscription = Subscriptions::where('id', $code->subscription_id)->first();

        // Verificar si se ha obtenido correctamente el usuario
        if (!$user instanceof \App\Models\User) {
            abort(401, 'Usuario no autenticado.');
        }

        // Obtener los roles del usuario
        $roles = $user->roles;


        $company = Company::where('id', '=', $companyUser->company_id)->first();
        $items = Inventory::where('company_id', $companyUser->id)->get();
        //Create query to get all users in the company with the same company_id and get all users total information with role
        $allUsers = CompanyUser::where('company_id', $companyUser->company_id)
            ->orderBy('id', 'asc') // Ordenar por user_id de menor a mayor
            ->get();
        $users = [];
        foreach ($allUsers as $user) {
            $users[] = User::where('id', $user->user_id)->with('roles')->first();
        }

        $allRoles = Roles::all();



        return Inertia::render('Settings/Index', [
            'items' => $items,
            'roles' => $roles,
            'subscription' => $subscription,
            'company' => $company,
            'users' => $users,
            'allRoles' => $allRoles,
        ]);
    }

    public function accountUpdate(Request $request)
    {
        try {
            // Validar los datos de entrada
            //dd($request->all());
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
                'phone' => 'nullable|string|max:15',
                'company' => 'nullable|string|max:255',
                'rSocial' => 'nullable|string|max:255',
                'RFC' => 'nullable|string|max:255',
            ]);

            //Actualizar el usuario recibido
            $user = User::where('email', $request->email)->first();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->save();
            //dd($request->all());
            //Actualizar la compañia recibida
            $companyUser = CompanyUser::where('user_id', $user->id)->first();
            //dd($companyUser->company_id);
            $company = Company::where('id', $companyUser->company_id)->first();


            $company->name = str_replace(' ', '_', $request->company);
            $company->rSocial = $request->rSocial;
            $company->RFC = $request->RFC;
            $company->save();
            //dd($company);
            return back()->with([
                'message' => 'Actualizado con exito.',
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Error al actualizar la cuenta: ' . $e->getMessage());
        }
    }

    public function updateCompany(Request $request)
    {
        try {
            // 1) Validación
            $request->validate([
                'logoImage'   => 'nullable|image|max:2048',
                'coverImage'  => 'nullable|image|max:2048',
                'description' => 'required|string',
            ]);

            // 2) Obtenemos la empresa del usuario logueado
            $companyUser = CompanyUser::where('user_id', Auth::id())->firstOrFail();
            $company     = Company::findOrFail($companyUser->company_id);

            // Directorio base para esta empresa
            $baseRelativePath = 'uploads/companies/' . $company->id;
            $baseFullPath     = public_path($baseRelativePath);

            // Asegurarnos de que el directorio existe
            if (! is_dir($baseFullPath)) {
                mkdir($baseFullPath, 0755, true);
            }

            // 3) Procesar logoImage
            if ($request->hasFile('logoImage')) {
                // Borrar anterior si existe
                if ($company->logoImage) {
                    $oldLogoPath = public_path($company->logoImage);
                    if (file_exists($oldLogoPath)) {
                        unlink($oldLogoPath);
                    }
                }

                // Subir nuevo
                $image     = $request->file('logoImage');
                $filename  = time() . '_logo.' . $image->getClientOriginalExtension();
                $image->move($baseFullPath, $filename);

                // Guardar ruta relativa en BD
                $company->logoImage = $baseRelativePath . '/' . $filename;
            }

            // 4) Procesar coverImage
            if ($request->hasFile('coverImage')) {
                if ($company->coverImage) {
                    $oldCoverPath = public_path($company->coverImage);
                    if (file_exists($oldCoverPath)) {
                        unlink($oldCoverPath);
                    }
                }

                $image     = $request->file('coverImage');
                $filename  = time() . '_cover.' . $image->getClientOriginalExtension();
                $image->move($baseFullPath, $filename);

                $company->coverImage = $baseRelativePath . '/' . $filename;
            }

            // 5) Actualizar descripción
            $company->description = $request->input('description');
            $company->save();

            // 6) Redirigir con éxito
            return back()->with('message', 'Perfil de empresa actualizado correctamente.');
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return back()
                ->withErrors($ve->errors())
                ->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar la cuenta: ' . $e->getMessage());
        }
    }
}
