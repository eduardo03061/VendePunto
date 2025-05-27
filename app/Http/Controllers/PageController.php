<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the user's profile form.
     */

    public function register(Request $request): Response
    {

        return Inertia::render('Page/Registro');
    }

    public function subscribe($plan)
    {
        // Lógica de suscripción según el plan
        // Ejemplo: redirigir a la página de pago con el plan seleccionado


        return Inertia::render('Page/Checkout', [
            'plan' => $plan
        ]);
    }


    public function payment($plan)
    {
        // Obtén la información del plan y el precio
        $planDetails = $this->getPlanDetails($plan);

        if (!$planDetails) {
            return redirect()->route('plans')->withErrors('El plan seleccionado no es válido.');
        }

        // Renderiza la página de pago
        return Inertia::render('Page/Checkout-Payment', [
            'plan' => $plan,
            'planDetails' => $planDetails,
        ]);
    }

    public function paymentPocess(Request $request)
    {
        // Validar la información del pago (por ejemplo, tarjeta de crédito, datos de usuario, etc.)
        $validated = $request->validate([
            'plan' => 'required|string',
            'payment_method' => 'required|string', // Dependiendo de los métodos de pago que uses
        ]);

        // Aquí integrarías la pasarela de pago (Stripe, PayPal, etc.)
        $paymentResult = $this->processPayment($validated['payment_method'], $validated['plan']);

        if ($paymentResult['status'] === 'success') {
            // Si el pago fue exitoso, redirigir al usuario a su dashboard o a una página de confirmación
            return redirect()->route('dashboard')->with('success', 'Suscripción completada correctamente.');
        }

        // Si el pago falla, redirigir de nuevo a la página de pago con un error
        return redirect()->back()->withErrors('El pago ha fallado, por favor inténtalo de nuevo.');
    }

    /**
     * Devuelve los detalles del plan basado en el nombre del plan.
     *
     * @param string $plan
     * @return array|null
     */
    private function getPlanDetails($plan)
    {
        $plans = [
            'basic' => [
                'name' => 'Básico',
                'price' => 9,
                'description' => 'Plan básico con funcionalidades esenciales.',
            ],
            'standard' => [
                'name' => 'Estándar',
                'price' => 29,
                'description' => 'Plan estándar para negocios en crecimiento.',
            ],
            'premium' => [
                'name' => 'Premium',
                'price' => 59,
                'description' => 'Plan premium con todas las funciones avanzadas.',
            ],
            'enterprise' => [
                'name' => 'Empresarial',
                'price' => 99,
                'description' => 'Plan para grandes empresas con soporte dedicado.',
            ],
        ];

        return $plans[$plan] ?? null;
    }

    /**
     * Simula el procesamiento de un pago.
     *
     * @param string $paymentMethod
     * @param string $plan
     * @return array
     */
    private function processPayment($paymentMethod, $plan)
    {
        // Aquí integras la pasarela de pago real, por ejemplo con Stripe o PayPal
        // Este es solo un ejemplo de simulación de un pago exitoso
        return [
            'status' => 'success',
            'transaction_id' => 'txn_123456',
        ];
    }

    public function privacidad(Request $request): Response
    {

        return Inertia::render('Page/Privacidad');
    }

    public function redeem(Request $request): Response
    {
        $user = Auth::user();
        $roles = $user->roles;
        return Inertia::render('Redeem/Index', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
                ],
            'roles' => $roles
        ]);
    }

    public function terminos(Request $request): Response
    {

        return Inertia::render('Page/Terminos');
    }

    public function faqs(Request $request): Response
    {

        return Inertia::render('Page/Faqs');
    }
}
