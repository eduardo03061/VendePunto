<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;
use App\Models\RoleUser;
use App\Models\Code;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Subscriptions;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use \DateTime;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                //'company' => 'required|string|max:255',
                'subscription_code' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);


            if ($request->subscription_code == 'VendePunto-7D') {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'subscription_ends_at' => now()->addDays(7),
                ]);
                event(new Registered($user));
                $roleUser = new RoleUser();
                $roleUser->roles_id = 1;
                $roleUser->user_id = $user->id;
                $roleUser->save();


                // Enviar correo con la plantilla especificada
                $template = 'mail.welcome'; // Cambia esto a la plantilla que desees usar
                $data = [
                    'name' => $user->name
                ];
                Mail::to($request->email)->send(new ContactoMail($request->name, 'Registro exitoso', $template, $data));
               

                Auth::login($user);

                Code::create([

                    'user_id' => $user->id,
                    'redeemed_at' => now(),
                    'subscription_id' => 3,
                    'subcription_days' => 7
                ]);

                return redirect(route('profile.welcome', absolute: false));
            }
            $code = Code::where('code', $request->subscription_code)->where('user_id', null)->first();
            if (!$code) {
                return back()->withErrors(['subscription_code' => 'Invalid code.']);
            }
            //Update code with user_id and redeemed_at


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'subscription_ends_at' => now()->addDays($code->subcription_days),
            ]);
            event(new Registered($user));
            $code->update(['user_id' => $user->id, 'redeemed_at' => now()]);
            $roleUser = new RoleUser();
            $roleUser->roles_id = 1;
            $roleUser->user_id = $user->id;
            $roleUser->save();

            $template = 'mail.welcome'; // Cambia esto a la plantilla que desees usar
            $data = [
                'name' => $user->name
            ];
            Mail::to($request->email)->send(new ContactoMail($request->name, 'Registro exitoso', $template, $data));

            /*
            $company = new Company();
            $company->name =$request->company;
            $company->description = '';
            $company->save();

            $companyUser = new CompanyUser();
            $companyUser->company_id = $company->id;
            $companyUser->user_id = $user->id;
            $companyUser->save(); 
            */


            Auth::login($user);

            return redirect(route('profile.welcome', absolute: false));
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function addUser(Request $request)
    {
        try {
            //dd($request->all());
            $request->validate([
                'name' => 'required|string|max:255',
                'company' => 'required',
                'rol' => 'required|string|max:255',
                'subscription_ends_at' => 'required|date',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', Rules\Password::defaults()],
            ]);

            //Validar si el codigo de suscripcion le permite agregar a mas usuarios
            $code = Code::where('company_id', $request->company)->first();
            if (!$code) {
                return back()->withErrors(['subscription_code' => 'Invalid code.']);
            }
            $subscription = Subscriptions::where('id', $code->subscription_id)->first();
            $users = CompanyUser::where('company_id', $request->company)->count();
          
            if ($subscription->cantUsers <= $users) {
                return back()->withErrors(['subscription_code' => 'No puedes agregar mas usuarios']);
            } 
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'subscription_ends_at' => new DateTime($request->subscription_ends_at),
            ]);
            event(new Registered($user));
            $company = Company::where('id', $request->company)->first();

            $companyUser = new CompanyUser();
            $companyUser->company_id = $company->id;
            $companyUser->user_id = $user->id;
            $companyUser->save();


            $roleUser = new RoleUser();
            $roleUser->roles_id = intval($request->rol);
            $roleUser->user_id = $user->id;
            $roleUser->save();

            $template = 'mail.welcome';
           
            $data = [
                'name' => $user->name
            ];
            Mail::to($request->email)->send(new ContactoMail($request->name, 'Registro exitoso', $template, $data));

            return response()->json(['message'=>'Usuario agregado correctamente',200
        ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
