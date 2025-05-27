import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Button, Input } from "@headlessui/react";
import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import ReCAPTCHA from "react-google-recaptcha";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pb-12 item-card white-h">
      <button
        className="flex justify-between items-center w-full text-left font-bold p-3 text-xl white-h"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDownIcon
          className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <p className="pt-2 p-3">{answer}</p>}
    </div>
  );
}
export default function Terminos({ auth }) {
  return (
    <WelcomeLayout auth={auth}>
    <h1 className="display2 text-center font-bold mb-4">Preguntas frecuentes</h1>

    <div className="max-w-5xl mx-auto mt-6 white overflow-y-auto h-90 mb-8">
    <FAQItem 
        question="¿Cómo obtengo un código de activación para usar Vendepunto?" 
        answer="Los códigos de activación se compran directamente a través de comisionistas autorizados. En caso de no tener contacto con alguno, puedes enviar un correo a grupo@vendepunto.com."
      />
      <FAQItem 
        question="¿Cómo canjeo mi código de activación?" 
        answer="Inicia sesión en tu cuenta de Vendepunto, da clic en renovación y selecciona 'Canjear Código'. Ingresa el código y el tiempo de uso se añadirá automáticamente."
      />
      <FAQItem 
        question="¿El tiempo de uso es acumulable si canjeo múltiples códigos?" 
        answer="Sí. Si canjeas varios códigos antes de que expire tu plan, el tiempo se sumará al periodo activo."
      />
      <FAQItem 
        question="¿Vendepunto procesa pagos o transfiere dinero?" 
        answer="No. Vendepunto no es una pasarela de pago, solo registra las transacciones que ingreses manualmente para llevar un control de tus ventas."
      />
      <FAQItem 
        question="¿Puedo registrar pagos en efectivo y con terminal en Vendepunto?" 
        answer="Sí. La plataforma permite registrar transacciones en efectivo, con tarjeta (terminal físico), transferencias bancarias o otros métodos. Solo debes ingresar los datos manualmente para guardar el historial."
      />
      <FAQItem 
        question="¿Puedo exportar o descargar mi historial de ventas?" 
        answer="Sí. En la sección 'Historial', encontrarás opciones para exportar datos en formatos como Excel, CSV o PDF."
      />
      <FAQItem 
        question="¿Se eliminan mis datos si se agota el tiempo de uso?" 
        answer="No. Tus datos permanecen guardados por 3 años incluso si tu plan está inactivo. Al renovar el tiempo, podrás acceder a toda tu información histórica."
      />
      <FAQItem 
        question="¿Cómo protege Vendepunto mis datos?" 
        answer="Tecnología de encriptación y copias de seguridad automáticas. Tus datos solo son accesibles desde tu cuenta con credenciales únicas."
      />
      <FAQItem 
        question="¿En qué dispositivos funciona Vendepunto?" 
        answer="Es compatible con smartphones, tablets y computadoras (Windows, macOS, iOS, Android) a través de navegadores web."
      />
      <FAQItem 
        question="¿En qué se diferencia Vendepunto de otras plataformas de punto de venta?" 
        answer="Sin suscripciones mensuales obligatorias: Pagas solo por el tiempo que uses. No requiere terminal virtual: Registras transacciones manuales sin intermediarios. Control total: Tus datos son 100% tuyos y los gestionas sin restricciones."
      />
      <FAQItem 
        question="Mi código no funciona. ¿Qué debo hacer?" 
        answer="Verifica que lo hayas ingresado correctamente (sin espacios o caracteres extra). Si persiste el error, contacta a soporte: grupo@vendepunto.com con el código y comprobante de compra."
      />
      <FAQItem 
        question="¿Necesitas ayuda adicional?" 
        answer="Escríbenos a grupo@vendepunto.com o visita nuestra sección de Ayuda en Línea."
      />
    </div>
  </WelcomeLayout>
  );
}
