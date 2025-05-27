import React from 'react';
import {useForm, Head, Link} from '@inertiajs/react';

export default function CheckoutPayment({plan, planDetails}) {
    const {data, setData, post, processing, errors} = useForm({
        plan: plan,
        payment_method: '', // Aquí seleccionas el método de pago
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('payment.process'));
    };

    return (
        <>
            <Head title="Pagar Suscripción"/>
            <div className="min-h-screen bg-black py-12">
                <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-8">
                    <h1 className="text-4xl font-bold mb-6">Pagar Suscripción</h1>
                    <h2 className="text-2xl font-semibold">Plan: {planDetails.name}</h2>
                    <p className="text-xl mt-4 mb-6">Precio: ${planDetails.price}/mes</p>

                    <form onSubmit={submit}>
                        <div className="mb-6">
                            <label className="block text-lg font-medium mb-2">Método de Pago</label>
                            <input
                                type="text"
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                                className="w-full border-2 border-gray-300 p-2 rounded-md"
                                placeholder="Tarjeta de crédito, PayPal, etc."
                            />
                            {errors.payment_method && <p className="text-red-600 mt-2">{errors.payment_method}</p>}
                        </div>

                        <button
                            type="submit"
                            className="btn bg-blue-600 text-white hover:bg-blue-700 transition px-6 py-2 rounded-md"
                            disabled={processing}
                        >
                            Pagar ${planDetails.price}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
