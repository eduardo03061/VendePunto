import React from 'react';
import {Link, Head} from '@inertiajs/react';

export default function Checkout({plan}) {
    console.log('plan', plan)
    return (
        <>
            <Head title="Confirmar Suscripción"/>
            <div className="min-h-screen py-12 bg-black">
                <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-8">
                    <h1 className="text-4xl font-bold mb-6">Confirmar Suscripción</h1>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Plan Seleccionado:</h2>
                        <p className="text-xl mt-4">{planName(plan)}</p>
                    </div>

                    <div className="mb-8">
                        <p className="text-lg">
                            Estás a punto de suscribirte al plan <strong>{planName(plan)}</strong>. Confirma para
                            proceder con el pago o continuar con el proceso de suscripción.
                        </p>
                    </div>

                    <div className="flex justify-between">
                        <Link
                             href={route('payment', {plan})}
                            className="btn bg-gray-200 text-black hover:bg-gray-300 transition px-6 py-2 rounded-md"
                        >
                            Volver a los Planes
                        </Link>

                        <Link
                            href={route('payment', {plan})}
                            className="btn bg-blue-600 text-white hover:bg-blue-700 transition px-6 py-2 rounded-md"
                        >
                            Confirmar y Pagar
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// Helper function to format plan name
function planName(plan) {
    switch (plan) {
        case 'basic':
            return 'Básico - $9/mes';
        case 'standard':
            return 'Estándar - $29/mes';
        case 'premium':
            return 'Premium - $59/mes';
        case 'enterprise':
            return 'Empresarial - $99/mes';
        default:
            return 'Desconocido';
    }
}
