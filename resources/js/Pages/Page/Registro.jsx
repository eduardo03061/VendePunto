import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Button, Input } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register({ auth }) {
  const [haveSubscriptionCode, setHaveSubscriptionCode] = useState(false);
  const [activateOutSubscriptionCode, setActivateOutSubscriptionCode] =
    useState(false);
  const [plan, setPlan] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    subscription_code: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });
  
  const [registerBotton, setRegisterBotton] = useState(false);
  const captcha = useRef(null);

  const submit = (e) => {
    e.preventDefault();

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };

  const ReCAPTCHAHandler = () => {
    if(captcha.current.getValue()){
      console.log('user is verified');
      setRegisterBotton(true);
      
    }else{
      console.log('user is not verified');
    }
    
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const plan_ = urlParams.get("plan");
    setPlan(plan_);
    if(plan_ === 'free'){
      setData("subscription_code", "VendePunto-7D");
      setActivateOutSubscriptionCode(true);
    }
  
    
  },[]);

  return (
    <WelcomeLayout auth={auth}>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="text-whiter ounded-lg shadow-lg md:w-1/2">
        <section className="w-2/3 m-auto">
          <h1 className="text-3xl text-center font-bold mb-4">
            ¡Te damos la Bienvenida a VendePunto!
          </h1>
          <p className="mb-6 leading-5">
            Ingresa tu código de suscripción y tus datos para crear el
            administrador de tu negocio:
          </p>
          <form onSubmit={submit}>
            {!activateOutSubscriptionCode ? (
              <div className="mb-4">
                <Input
                  type="text"
                  name="subscription_code"
                  placeholder="Código de suscripción"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyUp={() => setHaveSubscriptionCode(true)}
                  onChange={(e) => setData("subscription_code", e.target.value)}
                />
              </div>
            ) : (
              <div className="mb-4">
                <Input
                  type="text"
                  name="subscription_code"
                  placeholder="Código de suscripción"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white text-2xl text-center uppercase font-bold primary focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={data.subscription_code}
                  disabled
                />
              </div>
            )}

            {!haveSubscriptionCode && !activateOutSubscriptionCode && (
              <div className="text-center">
                <p className="text-sm grey py-4 leading-5">o inicia tu prueba</p>
                <Button
                  onClick={() => {
                    setActivateOutSubscriptionCode(true);
                    setData("subscription_code", "VendePunto-7D");
                  }}
                  className="w-full bg-primary black text-xl py-3 rounded-full font-bold transition"
                >
                  Probar gratis por 7 días
                </Button>
                <p className="text-sm grey py-4 mb-8 leading-5">Solo usuarios nuevos</p>
              </div>
            )}

            <div
              className={
                haveSubscriptionCode || activateOutSubscriptionCode
                  ? ""
                  : "opacity-30 select-none pointer-events-none"
              }
            >
              <div className="mb-4">
                <Input
                  type="text"
                  name="name"
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <InputError message={errors.email} className="mt-2"/>
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={data.password}
                  autoComplete="new-password"
                  onChange={(e) => setData("password", e.target.value)}
                  required
                  placeholder="Contraseña"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <InputError message={errors.password} className="mt-2"/>
              </div>
              <div className="mb-4">
               
                 <input
                                         id="password_confirmation"
                                         type="password"
                                         name="password_confirmation"
                                         placeholder="Confirma tu contraseña"
                                         value={data.password_confirmation}
                                        className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                         autoComplete="new-password"
                                         onChange={(e) => setData('password_confirmation', e.target.value)}
                                         required
                                     />
                  <InputError message={errors.password_confirmation} />
              
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  name="phone"
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Teléfono (e.g., +52 123 456 7890)"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <ReCAPTCHA
                ref={captcha}
                sitekey={'6LdbwLsqAAAAALBReTEmx6KlQXmT46syzfT2BZQc'}
                onChange={ReCAPTCHAHandler}
              />

              <div>
                <button
                  className="w-full bg-primary black text-center text-xl rounded-full m-auto py-3 my-6 font-bold transition"
                  disabled={!registerBotton}>
                  ¡Abrir mi tienda!
                </button>
              </div>
            </div>
          </form>

        </section>
        </div>

        <div className="md:w-1/2 flex object-cover max-w-full h-auto justify-center mt-0" alt="Welcome">
          <img
            src="/assets/img-welcome.png"
            alt="Welcome"
            className="max-w-full object-cover h-auto shadow-lg"
          />
        </div>
      </div>
    </WelcomeLayout>
  );
}
