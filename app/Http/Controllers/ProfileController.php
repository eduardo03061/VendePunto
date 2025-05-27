<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Code;
use App\Models\Subscriptions;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */

    public function welcome(Request $request): Response
    {
        $user = Auth::user();
        $code = Code::where('user_id', $user->id)->first();
        if (!$code) {
            $subscription = Subscriptions::find(3);
            return Inertia::render('Profile/Welcome', [
                'auth' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ],
                'subscription' => [
                    'name' => $subscription->name,
                    'description' => $subscription->description
                ]
            ]);
        }
        $subscription = Subscriptions::find($code->subscription_id);
        return Inertia::render('Profile/Welcome', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ],
            'subscription' => [
                'name' => $subscription->name,
                'description' => $subscription->description
            ]
        ]);
    }

    public function info(Request $request): Response
    {
        $user = Auth::user();
        return Inertia::render('Profile/Info', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ]
        ]);
    }

    public function registerinfo(Request $request): RedirectResponse
    {
        //dd($request);
        $user = Auth::user();
        $companyName = str_replace(' ', '_', $request->get('companyName'));
        $category = $request->get('category');
        $description = $request->get('description');
        $contactNumber = $request->get('contactNumber');

        $company = new Company();
        $company->name = $companyName;
        $company->description = $description;
        $company->phone = $contactNumber;
        $company->category = $category;
        $company->save();

        $companyUser = new CompanyUser();
        $companyUser->company_id = $company->id;
        $companyUser->user_id = $user->id;
        $companyUser->save();

        $code = Code::where('user_id', $user->id)->first();
        $code->update(['company_id' => $company->id]);

        return redirect(route('dashboard', absolute: false));
    }

    public function edit(Request $request): Response
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        $roles = $user->roles;
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
