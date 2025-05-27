
import { Head, Link } from '@inertiajs/react';

export default function WelcomeLayout({ auth, children }) {

    return (
        <>
            <Head>
                <title>VendePunto</title>
                <link rel="icon" type="image/svg+xml" href="/assets/vendepunto-logo.png" />
            </Head>
            <div className="text-gray-800 min-h-screen bg-welcome">
                <div className="relative flex flex-col min-h-screen">
                    <div className="w-full  mx-auto px-6 flex-grow">
                        <header className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div>
                                    <Link
                                        href={'/'}
                                    >
                                        <img src="/assets/vendepunto-logo.png" className='w-1/2' alt="logo" />
                                    </Link>
                                </div>
                            </div>

                            <nav
                                className="fixed top-0 right-0 mt-4 ml-8 mr-4 justify-end flex gap-4 align-center">
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
                                            className="primary-btn"
                                        >
                                            Iniciar sesión
                                        </Link>

                                        <Link
                                            href={route('register.page',{plan: 'vip'})}
                                            className="btn text-xl"
                                        >
                                            Registrarme
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="white py-8">
                            {children}
                        </main>
                    </div>

                    <footer className="py-8 text-center text-sm text-gray-600 border-t border-gray-700">
                       <div className='flex justify-center gap-6 pb-4'>
                            <Link
                                href={route('faqs')}
                                className=""
                            >
                                Preguntas frecuentes
                            </Link>
                            <Link
                                href={route('privacidad')}
                                className=""
                            >
                                Aviso de privacidad
                            </Link>
                            <Link
                                href={route('terminos')}
                                className=""
                            >
                                Términos y condiciones
                            </Link>
                       </div>
                        © DealApp POS 2025. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}
