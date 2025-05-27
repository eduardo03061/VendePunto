import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Welcome({auth,subscription}) {
    const [haveSubscriptionCode, setHaveSubscriptionCode] = useState(false);
    console.log('subscription',subscription);
    
    return (
        <div className="min-h-screen text-white flex flex-col justify-center items-center relative overflow-hidden">
            {/* Fondo con confeti */}
            <div className="absolute z-0 inset-0 flex justify-center items-center object-cover max-w-full min-h-screen justify-between mt-0">
                    <img
                        src="/assets/fondo-registro-vp.png"
                        alt="Welcome"
                        className="max-w-full object-cover shadow-lg min-h-screen mx-8 opacity-75"/>
            </div>

            {/* Contenido central */}
            <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                    ¡Disfruta tu plan {subscription.name}
                    <br/>
                    {auth.user.name}!
                </h1>

                <section className="inline py-8" >
                    <div className="bg-gray-900 p-8 rounded-lg shadow-lg inline-block text-left">
                        <h2 className="text-2xl text-center font-semibold mb-4">{subscription.name}</h2>
                        <p>Tu plan incluye:</p>
                        <ul className="list-disc list-inside white" dangerouslySetInnerHTML={{ __html: subscription.description }} />
                    </div>
                    <div className="pt-8">
                        <Link
                            href={route('profile.info')}
                            className="w-full btn text-2xl py-3 rounded-lg font-bold transition">
                            Ingresar datos de mi tienda
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
