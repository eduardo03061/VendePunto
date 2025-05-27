import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Button, Input } from "@headlessui/react";
import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import ReCAPTCHA from "react-google-recaptcha";

export default function Terminos({ auth }) {
  return (
    <WelcomeLayout auth={auth}>
            <h1 className="display2 text-center font-bold mb-4">
              Términos y condiciones
            </h1>

      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="bg-fondo text-white p-8 rounded-lg shadow-lg md:w-2/3">
          <section className="w-full m-auto overflow-y-auto h-90">
            <h2 className="text-xl text-left font-bold mb-4">
              Términos y Condiciones del Servicio
            </h2>
            <p className="mb-6 leading-5">
              El presente contrato (en adelante, el "Contrato") se celebra entre Guillermo Eduardo Granados Dávalos, operando bajo el nombre comercial "Vendepunto" y el usuario final (en adelante, el "Usuario"), quien acepta las cláusulas contenidas en el mismo mediante el uso de la aplicación móvil y la plataforma web de Vendepunto (en adelante, la "Aplicación"). Este Contrato tiene carácter vinculante y regula los derechos y obligaciones de ambas partes.
            </p>
            <h3 className="text-lg font-semibold mb-2">Partes y Declaraciones</h3>
            <p className="mb-4">
              <strong>Vendepunto declara que:</strong>
              <ul className="list-disc list-inside">
                <li>Es una persona física, operando bajo el nombre comercial "Vendepunto", establecida en Colima, Colima, con capacidad legal para celebrar el presente Contrato.</li>
                <li>Su Aviso de Privacidad ha sido debidamente publicado y es accesible en: <a href="www.vendepunto.com/privacidad" className="text-blue-500">www.vendepunto.com/privacidad</a>.</li>
                <li>El uso de la Aplicación está estrictamente limitado a la comercialización de bienes lícitos.</li>
              </ul>
            </p>
            <p className="mb-4">
              <strong>El Usuario declara que:</strong>
              <ul className="list-disc list-inside">
                <li>Es mayor de edad y cuenta con plena capacidad jurídica.</li>
                <li>Ha proporcionado información veraz, actualizada y completa en el registro.</li>
                <li>Acepta los términos y condiciones del presente Contrato.</li>
              </ul>
            </p>
            <h3 className="text-lg font-semibold mb-2">Objeto del Contrato</h3>
            <p className="mb-4">
              Vendepunto se compromete a proporcionar servicios tecnológicos a través de la Aplicación, permitiendo la gestión de transacciones de venta, procesamiento de pagos y generación de informes, bajo los términos y condiciones descritos a continuación. El Usuario se compromete a utilizar la Aplicación de conformidad con lo estipulado en este Contrato.
            </p>
            <h3 className="text-lg font-semibold mb-2">Restricciones de Uso</h3>
            <p className="mb-4">
              El Usuario no podrá utilizar la Aplicación para la venta de bienes prohibidos, tales como sustancias ilegales, armas, productos falsificados o cualquier otro bien cuya comercialización esté restringida por la ley.
              Vendepunto se reserva el derecho de suspender o cancelar el acceso del Usuario en caso de detectar actividades contrarias a este Contrato.
            </p>
            <h3 className="text-lg font-semibold mb-2">Aceptación de Términos y Condiciones</h3>
            <p className="mb-4">
              El uso de la Aplicación y/o el pago del servicio implica la aceptación tácita de los términos y condiciones aquí contenidos. Cualquier solicitud de modificación puede enviarse a <a href="mailto:grupo@vendepunto.com" className="text-blue-500">grupo@vendepunto.com</a>.
            </p>
            <h3 className="text-lg font-semibold mb-2">Registro de Usuarios y Cuentas</h3>
            <p className="mb-4">
              Para registrarse en la Aplicación, el Usuario debe ser mayor de edad y proporcionar información personal, que será tratada conforme al Aviso de Privacidad. El Usuario es responsable de la confidencialidad de su información de acceso.
            </p>
            <h3 className="text-lg font-semibold mb-2">Modalidad de Pago</h3>
            <p className="mb-4">
              El servicio opera bajo una modalidad de prepago mediante códigos de un solo uso. Vendepunto podrá ajustar los precios, y el uso continuado posterior a dichos ajustes constituirá aceptación de los nuevos términos.
            </p>
            <h3 className="text-lg font-semibold mb-2">Limitaciones de Responsabilidad</h3>
            <p className="mb-4">
              Vendepunto actúa como intermediario tecnológico y no asume responsabilidad por transacciones realizadas por los Usuarios ni por fallas técnicas o de conectividad. El Usuario exonera expresamente a Vendepunto de cualquier disputa comercial.
            </p>
            <h3 className="text-lg font-semibold mb-2">Obligaciones del Usuario</h3>
            <p className="mb-4">
              El Usuario se compromete a utilizar la Aplicación de manera lícita y a no comprometer su seguridad o funcionamiento. Será responsable de cualquier daño causado a Vendepunto por uso indebido.
            </p>
            <h3 className="text-lg font-semibold mb-2">Propiedad Intelectual</h3>
            <p className="mb-4">
              Vendepunto conserva todos los derechos de propiedad intelectual sobre la Aplicación. Se prohíbe cualquier modificación, ingeniería inversa o redistribución sin autorización.
            </p>
            <h3 className="text-lg font-semibold mb-2">Confidencialidad</h3>
            <p className="mb-4">
              Ambas partes acuerdan mantener la confidencialidad de la información sensible, incluso por cinco años después de la terminación del Contrato.
            </p>
            <h3 className="text-lg font-semibold mb-2">Modificaciones al Contrato</h3>
            <p className="mb-4">
              Vendepunto podrá modificar este Contrato en cualquier momento, notificando los cambios a través de la Aplicación. El uso continuado implicará aceptación de los cambios.
            </p>
            <h3 className="text-lg font-semibold mb-2">Vigencia y Terminación</h3>
            <p className="mb-4">
              Este Contrato permanecerá vigente mientras el Usuario utilice la Aplicación. Vendepunto podrá terminarlo unilateralmente en caso de incumplimiento.
            </p>
            <h3 className="text-lg font-semibold mb-2">Legislación y Jurisdicción</h3>
            <p className="mb-4">
              Antes de un juicio, las partes deberán someter su controversia al Centro Estatal de Justicia Alternativa de Colima. La jurisdicción exclusiva será en los tribunales de Colima, Colima.
            </p>
            <h3 className="text-lg font-semibold mb-2">Domicilios y Notificaciones</h3>
            <p className="mb-4">
              Vendepunto notificará al Usuario a través de la Aplicación o su correo registrado. Para contactar a Vendepunto, el Usuario deberá utilizar los canales oficiales.
            </p>
            <h3 className="text-lg font-semibold mb-2">Contacto y Soporte</h3>
            <p className="mb-4">
              <strong>Negociaciones contractuales:</strong> <a href="mailto:grupo@vendepunto.com" className="text-blue-500">grupo@vendepunto.com</a><br />
              <strong>Soporte técnico:</strong> <a href="mailto:grupo@vendepunto.com" className="text-blue-500">grupo@vendepunto.com</a><br />
              <strong>Unidad de Atención a Usuarios:</strong> <a href="mailto:grupo@vendepunto.com" className="text-blue-500">grupo@vendepunto.com</a>
            </p>
          </section>
        </div>
      </div>
    </WelcomeLayout>
  );
}
