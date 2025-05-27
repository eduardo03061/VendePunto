import {Link, Head} from '@inertiajs/react';
import {ShoppingCartIcon, CreditCardIcon, ChartBarIcon} from '@heroicons/react/24/outline';

export default function SelectPlans({auth}) {
    return (
        <>
            <Head title="Selecciona tu Plan - VendePunto"/>
            <div className="text-gray-800 min-h-screen bg-black">
                <div className="relative flex flex-col min-h-screen">
                    <div className="w-full  mx-auto px-6 flex-grow">

                        <header className="flex items-center justify-between py-10">
                            <div className="flex items-center">
                                <ShoppingCartIcon className="h-10 w-10 text-blue-600 mr-3"/>
                                <span className="text-2xl font-bold text-blue-600">Vende-Punto</span>
                            </div>

                            <nav
                                className="fixed top-0 right-0 mt-4 ml-8 mr-4 space-y-2 justify-end flex gap-4 align-center">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="float-end rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition text-right"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-4 py-2 border-2 text-lg white transition text-right"
                                        >
                                            Log in
                                        </Link>

                                        <Link
                                            href={route('welcome')}
                                            className="btn rounded-md px-4 py-2 bg-gray-200 text-lg text-gray-800 hover:bg-gray-300 transition text-right"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="py-20 text-white bg-black">
                            <div className='px-8'>
                                <h1 className="text-5xl text-start mb-10 capitalize">
                                    Selecciona el plan de suscripción que más se ajuste a tu negocio
                                </h1>
                                <p className="text-3xl text-start mb-12">
                                    Encuentra la solución perfecta para tu punto de venta.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <PlanCard
                                        title="Básico"
                                        price="$9/mes"
                                        description="Ideal para pequeñas tiendas que están comenzando."
                                        features={["1 usuario", "Soporte básico", "Funcionalidades esenciales"]}
                                        link={route('subscribe', {plan: 'basic'})}
                                    />
                                    <PlanCard
                                        title="Estándar"
                                        price="$29/mes"
                                        description="Para negocios en crecimiento con mayores necesidades."
                                        features={["3 usuarios", "Soporte estándar", "Reportes básicos"]}
                                        link={route('subscribe', {plan: 'standard'})}
                                    />
                                    <PlanCard
                                        title="Premium"
                                        price="$59/mes"
                                        description="Para negocios medianos que buscan funciones avanzadas."
                                        features={["5 usuarios", "Soporte premium", "Análisis avanzado"]}
                                        link={route('subscribe', {plan: 'premium'})}
                                    />
                                    <PlanCard
                                        title="Empresarial"
                                        price="$99/mes"
                                        description="La solución definitiva para grandes empresas."
                                        features={["Usuarios ilimitados", "Soporte dedicado", "Funciones personalizadas"]}
                                        link={route('subscribe', {plan: 'enterprise'})}
                                    />
                                </div>
                            </div>
                        </main>
                    </div>

                    <footer className="py-8 text-center text-sm text-gray-600 border-t border-gray-200">
                        © DealApp POS 2024. Todos los derechos reservados.
                    </footer>
                </div>
            </div>
        </>
    );
}

function PlanCard({title, price, description, features, link}) {
    return (
        <div className="border-4 rounded-lg shadow-md p-8 bg-white text-black">
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-xl font-semibold mb-4">{price}</p>
            <p className="mb-4">{description}</p>
            <ul className="list-disc ml-6 mb-4">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <Link
                href={link}
                className="btn rounded-md px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Seleccionar
            </Link>
        </div>
    );
}
