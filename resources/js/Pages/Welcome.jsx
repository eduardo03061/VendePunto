import { Link } from '@inertiajs/react';
import { ShoppingCartIcon, CreditCardIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import WelcomeLayout from '@/Layouts/WelcomeLayout';

export default function Welcome({ auth }) {
    return (
        <WelcomeLayout
            auth={auth} >
            <div className='sm:px-8 block md:flex items-center'>
                <div className='w-full mb-8 md:w-1/2 sm:mr-8 sm
                :pr-8'>
                    <h1 className="text-7xl md:text-6xl text-start mb-10">
                    El punto de venta que sí entiende tu negocio                    
                    </h1>
                    <p className='text-1xl md:text-2xl'>
                    Cobra, controla tu inventario y vende más. 
                    Desde changarros hasta pymes, todo desde tu tablet o celular.
                    </p> 
                </div>

                <div className='w-full md:w-1/2'>
                    <div>
                        <img  src="/assets/img/vender-img.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-center gap-8">
                <div className='border-2 white primary-btn bold rounded-full px-4 hover:bg-primary'>POS</div>
                <div className='border-2 white primary-btn bold rounded-full px-4 hover:bg-primary'>Inventario</div>
                <div className='border-2 white primary-btn bold rounded-full px-4 hover:bg-primary'>Catálogo</div>
                <div className='border-2 white primary-btn bold rounded-full px-4 hover:bg-primary'>Registro</div>
            </div> */}


            <div className='separador'></div>
                <div className='mt-8'>
                    <div>
                        <p className="text-4xl md:text-3xl text-center gray mb-12">Con VendePunto tu negocio es:</p>
                    </div>   

                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 text-left">

                        <FeatureCard

                            title="Rápido"
                            description="Venta rápida y sencilla desde tu celular"
                        />
                        <FeatureCard

                            title="Controlado"
                            description="Inventario en tiempo real sin complicaciones"
                        />
                        <FeatureCard

                            title="Informado"
                            description="Reportes que entiendes, no que te confunden"
                        />
                        <FeatureCard

                            title="Móvil"
                            description="Funciona sin internet"
                        />
                        <FeatureCard

                            title="Ordenado"
                            description="Catálogo con imágenes y categorías"
                        />
                        <FeatureCard

                            title="Humano"
                            description="Soporte humano por WhatsApp"
                        />
                    </div>
                </div>
            
            

            <div className="text-center mt-12 ">
                {/* <Link  href={route('register.page',{plan: 'free'})}
                    className="btn rounded-md px-6 py-6 md:py-3 text-3xl md:text-xl font-semibold transition">
                    Ingresar mi código de acceso
                </Link> */}
                <button href={route('register.page',{plan: 'free'})}
                    className="btn text-3xl md:text-xl font-semibold">
                    Ingresar mi código de acceso
                </button>
            </div>


            <div className='separador primary'></div>
                <div className='w-full md:w-1/2 text-card block gap-4 items-center p-8 rounded-lg'>
                    <div>
                            <p className="text-2xl md:text-3xl text-center gray">¿Por qué VendePunto?</p>
                    </div>            
                    {/* <div>
                            <p className="text-2xl md:text-2xl text-left gray mb-4">📈 Aumenta tus ventas desde el primer día</p>
                    </div>            
                    <div>
                            <p className="text-2xl md:text-2xl text-left gray mb-4">⏳ Ahorra tiempo con procesos automáticos</p>
                    </div>            
                    <div>
                            <p className="text-2xl md:text-2xl text-left gray mb-4">🧠 Toma decisiones con datos reales</p>
                    </div>             */}
                 </div>
{/* 
            <div className="flex justify-center gap-8">
                <div className='w-1/3'>
                        <div>
                            <img  src="/assets/img/vender-img.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                </div>
                <div className='w-1/3'>
                        <div>
                            <img  src="/assets/screens/selling.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                </div>
                <div className='w-1/3'>
                        <div>
                            <img  src="/assets/img/vender-img.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                </div>
            </div> */}

       

        <div >
                <div className='md:px-8 block md:flex items-center'>
                    <div className='w-full md:w-1/2 p-8'>
                        <div className='p-8'>
                            <img  src="/assets/screens/hello.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 ml-8 p-8'>
                        <h2 className="text-4xl text-start mb-2 capitalize">
                             Reportes diarios                       
                        </h2>  
                        <p className="text-2xl text-start gray mb-12">
                        Basados en los datos registrados diario.
                        </p>                    
                    </div>
                </div>

                <div className='md:px-8 block md:flex items-center'>
                    <div className='w-full md:w-1/2 mr-8 p-8'>
                        <h2 className="text-4xl text-end mb-2 capitalize">
                        Venta Express                  
                        </h2>  
                        <p className="text-2xl text-end gray mb-12">
                        La interfaz esta pensada para ser muy fácil.</p>                    
                    </div>
                    <div className='w-full md:w-1/2 p-8'>
                        <div className='p-8'>
                            <img  src="/assets/screens/selling.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className='md:px-8 block md:flex items-center'>
                    <div className='w-full md:w-1/2 p-8'>
                        <div className='p-8'>
                            <img  src="/assets/img/vender-img.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 ml-8 p-8'>
                        <h2 className="text-4xl text-start mb-2 capitalize">
                        Inventario inteligente                      
                        </h2>  
                        <p className="text-2xl text-start gray mb-12">
                        Tu inventario chico o enorme puede estar acomodado a tu gusto con las categorias que desees.
                        </p>                    
                    </div>
                </div>

                <div className='md:px-8 block md:flex items-center'>
                    <div className='w-full md:w-1/2 mr-8 p-8'>
                        <h2 className="text-4xl text-end mb-2 capitalize">
                        Enfoque en tu equipo                      
                        </h2>  
                        <p className="text-2xl text-end gray mb-12">
                        Podrás llevar control de tu equipo y conocer si han hecho un gran trabajo!
                        </p>                    
                    </div>
                    <div className='w-full md:w-1/2 p-8'>
                        <div className='p-8'>
                            <img  src="/assets/screens/users.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                    </div>
                </div>
            
                <div className='md:px-8 block md:flex items-center'>
                    <div className='w-full md:w-1/2 p-8'>
                        <div className='p-8'>
                            <img  src="/assets/screens/closing-sale.jpeg" alt="Welcome" className="max-w-full rounded-xl object-fit shadow-lg" />
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 ml-8 p-8'>
                        <h2 className="text-4xl text-start mb-2 capitalize">
                        Cierre de caja         
                        </h2>  
                        <p className="text-2xl text-start gray mb-12">
                        Control para evitar robo hormiga 
                        </p>                    
                    </div>
                </div>
        </div>

                

            <div className='separador'></div>
            <div className='w-4/5 text-card'>
                <div>
                    <p className="text-4xl md:text-3xl text-center gray mb-12">Testimonios</p>
                </div>  

                <div className='px-0 md:px-8 text-card block md:flex items-center'>
                        <div className='w-full md:w-1/5'>
                            <div className='p-8 aspect-square'>
                                <img  src="/assets/img/team.jpeg" alt="Welcome" className="max-w-full rounded-full object-fit shadow-lg aspect-square" />
                            </div>
                        </div>
                        <div className='w-full md:w-4/5 mr-8 p-8'>
                            <h2 className="text-2xl md:text-3xl text-start mb-2 capitalize">
                            “Yo vendía en ferias y nunca sabía cuánto ganaba. Ahora todo queda registrado.” 
                            </h2>    
                            <p className='text-1xl text-start mb-2 capitalize'>  – Laura, bisutería artesanal
                            </p>             
                        </div>
                    </div>

                <div className='px-0 md:px-8 block md:flex items-center'>
                        <div className='w-full md:w-1/5'>
                            <div className='p-8 aspect-square'>
                                <img  src="/assets/img/control.jpeg" alt="Welcome" className="max-w-full rounded-full object-fit shadow-lg aspect-square" />
                            </div>
                        </div>
                <div className='w-full md:w-4/5 mr-8 p-8'>
                            <h2 className="text-2xl md:text-3xl text-start mb-2 capitalize">
                            “Antes perdía tiempo haciendo cuentas. Ahora cobro más rápido y sin errores.” 
                            </h2>    
                            <p className='text-1xl text-start mb-2 capitalize'>  – Don Chuy, puesto de jugos
                            </p>             
                        </div>
                    </div>
            </div>



            <div className='separador'></div>
            <div className='flex justify-center'>
                <h2 className='text-3xl mb-8'>Planes simples, sin letras chiquitas </h2>
            </div>
            <div className='block md:flex justify-center gap-8'>

                <div className='mt-8 px-0 md:px-8 items-center'>
                    <div className='w-full p-8 bg-fondo rounded-lg'>
                        <h2 className="text-1xl gray md:text-2xl text-start mb-2 capitalize">
                    Plan Básico</h2>                 
                        <h2 className="text-3xl md:text-5xl text-start text-bold mb-2 capitalize">
                        $299/mes</h2>                 
                            <p className="text-1xl md:text-lg text-start white">✔️ Ventas ilimitadas</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Inventario básico</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Reportes diarios</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Soporte humano</p>  
                            <button className='primary-btn mt-8 w-full flex justify-center'>Seleccionar este plano</button>                   
                    </div>
                </div>

                
                <div className='mt-8 px-0 md:px-8 items-center'>
                     <div className='w-full p-8 bg-fondo rounded-lg'>
                        <h2 className="text-1xl gray md:text-2xl text-start text-bold mb-2 capitalize">
                        Plan Pro </h2>                 
                        <h2 className="text-3xl md:text-5xl text-start mb-2 capitalize">
                        $599/mes </h2>                 
                            <p className="text-1xl md:text-lg text-start white">todo lo del Plan Básico +</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Múltiples usuarios</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Sucursales</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Reportes avanzados</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Integraciones</p>  
                            <button className='primary-btn mt-8 w-full flex justify-center'>Solicitar demo</button>                   
                    </div>
                </div>

                <div className='mt-8 px-0 md:px-8 items-center'>
                    <div className='w-full p-8 bg-fondo rounded-lg'>
                        <h2 className="text-1xl gray md:text-2xl text-start text-bold mb-2 capitalize">
                        Plan Empresarial </h2> 
                        <h2 className="text-3xl md:text-5xl text-start mb-2 capitalize">
                        $999/mes </h2> 
                            <p className="text-1xl md:text-lg text-start white">todo lo del Plan Pro +</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Sucursales</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Soporte dedicado</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Capacitación</p>               
                            <p className="text-1xl md:text-lg text-start white">✔️ Funciones a medida</p>   
                            <button className='primary-btn mt-8 w-full flex justify-center'>Habla con un experto</button>            
                    </div>
                </div>
            </div>



            {/* <div className='separador'></div>
            <div className='block md:flex md:px-8 items-center'>
                <div className='w-full md:w-1/2 flex justify-between p-8'>
                    <h2 className="text-3xl md:text-3xl text-start mb-2">Te daremos las herramientas para que tu negocio sea:</h2>            
                </div>
                <div className='w-full md:w-1/3 p-8'>
                        <p className="bg-primary text-3xl text-center mb-4 bold black">Controlable</p>               
                        <p className="bg-primary text-3xl text-center mb-4 bold black">Medible</p>               
                        <p className="bg-primary text-3xl text-center mb-4 bold black">Escalable</p>                          
                </div>
            </div> */}

            <div className='separador'></div>

                <div className='flex items-center'>
                    <div className='w-1/3 flex justify-between p-2'></div>
                    <div className='w-1/3 p-2'>
                        <p className="text-3xl text-center mb-4 bold primary rounded-md">VendePunto</p>                                   
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="text-3xl text-center mb-4 bold gray rounded-md">Otros POS</p>                                   
                </div>
            </div>

                <div className='flex items-center'>
                    <div className='w-1/3 flex justify-between p-2'>
                        <h2 className="text-2xl text-start mb-2 gray">Diseñado para México</h2>            
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">✔️</p>                                   
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">X</p>                                   
                </div>
            </div>
            
                <div className='flex items-center'>
                    <div className='w-1/3 flex justify-between p-2'>
                        <h2 className="text-2xl text-start mb-2 gray">Fácil de usar desde celular</h2>            
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">✔️</p>                                   
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">X</p>                                   
                </div>
            </div>

                <div className='flex items-center'>
                    <div className='w-1/3 flex justify-between p-2'>
                        <h2 className="text-2xl text-start mb-2 gray">Registros</h2>            
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">✔️</p>                                   
                    </div>
                    <div className='w-1/3 p-2'>
                        <p className="bg-black text-3xl text-center mb-4 bold gray rounded-full">X</p>                                   
                </div>
                
            </div>

            <div className='separador primary'></div>
                <div className='w-2/3 text-card block gap-4 items-center'>
                    <div>
                            <p className="text-4xl md:text-3xl text-center gray mb-12">Historias de negocios reales</p>
                    </div>            
                    <div>
                        <p className="text-4xl md:text-2xl text-left white mb-12">VendePunto está diseñado para negocios reales en México que quieren empezar a vender sin enredos técnicos, sin gastar de más, y con una experiencia que realmente ayuda a crecer.</p>
                    </div>            
                    <div>
                        <p className="text-4xl md:text-2xl text-left white mb-12">Ideal desde un puesto de tacos hasta una tienda con varias sucursales.</p>
                    </div>            
                    <div>
                        <p className="text-4xl md:text-2xl text-left white mb-12">No es solo un POS. Es tu aliado para vender más y trabajar mejor. 🚀</p>
                    </div>            
                 </div>
        </WelcomeLayout>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="rounded-lg bg-fondo shadow-md m-2 md:m-8 p-1 md:p-8">
            <div className="mb-4 gray">{icon}</div>
            <h3 className="text-2xl md:text-3xl text-center white">{title}</h3>
            <p className="gray text-center">{description}</p>
        </div>
    );
}