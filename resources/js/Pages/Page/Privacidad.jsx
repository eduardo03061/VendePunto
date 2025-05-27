import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Button, Input } from "@headlessui/react";
import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import ReCAPTCHA from "react-google-recaptcha";

export default function Privacidad({ auth }) {
  return (
    <WelcomeLayout auth={auth}>
            <h1 className="display2 text-center font-bold mb-4">
            Aviso de Privacidad
            </h1>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="bg-fondo text-white p-8 rounded-lg shadow-lg md:w-2/3">
          <section className="w-full m-auto overflow-y-auto h-90">
            <h2 className="text-xl text-left font-bold mb-4">
              Políticas de Seguridad y Privacidad
            </h2>
            <p className="mb-6 leading-5">
              Vendepunto.com, como proveedor de un sistema web para la gestión de pequeños comerciantes, en relación a los usuarios de este sistema web (en adelante, los "Usuarios") declara su política de protección de datos de carácter privado (en adelante, "los Datos Privados") para los Usuarios que utilicen el sistema.
              <br /><br />
              Los Usuarios acceden al sistema web de Vendepunto.com por medio de una suscripción voluntaria. Los datos personales que se les puedan requerir o que se puedan obtener de los Usuarios con ocasión de la suscripción o alta en algunos de los servicios ofrecidos por Vendepunto.com en el sitio web serán contemplados en la presente política de privacidad.
              <br /><br />
              Los Datos Privados serán objeto de tratamiento automatizado e incorporados a los correspondientes archivos automatizados de datos de los que Vendepunto.com será titular y responsable (en adelante, el "Archivo"). Con este objeto, Vendepunto.com proporciona a los Usuarios los recursos técnicos adecuados para que, con carácter previo, puedan acceder a este aviso sobre la Política de Privacidad o a cualquier otra información relevante y puedan prestar su consentimiento a fin de que Vendepunto.com proceda al tratamiento automatizado de sus Datos Privados.
              <br /><br />
              El ingreso y tratamiento automatizado de los Datos Privados tiene como objetivo el mantenimiento de la relación contractual en su caso establecida con Vendepunto.com, la gestión, administración, prestación, ampliación y mejora de los servicios en los que el Usuario decida suscribirse, darse de alta o utilizar la adecuación de dichos servicios a las preferencias y gustos de los Usuarios, el estudio de la utilización de los servicios por parte de los Usuarios, el diseño de nuevos servicios relacionados, el envío de actualizaciones de servicios, el envío, por medios tradicionales y electrónicos, de información técnica, operativa y comercial acerca de productos y/o servicios ofrecidos por Vendepunto.com y por terceros actualmente y en el futuro. Otro de los objetivos de la recolección y el tratamiento automatizado de los Datos Privados puede incluir el envío de encuestas al usuario, con respuesta de carácter NO Obligatorio.
              <br /><br />
              Vendepunto.com ha adoptado los niveles de seguridad de protección de los Datos Privados legalmente requeridos, y procura instalar medios y medidas técnicas adicionales a su alcance para mejorar o evitar la pérdida, mal uso, alteración, acceso no autorizado y robo de los Datos Personales facilitados por el Usuario a través del sistema web, siempre que estén disponibles técnica y económicamente. En particular, Vendepunto.com utiliza sistemas de seguridad, no obstante, el Usuario debe ser consciente de que las medidas de seguridad en Internet no son inexpugnables.
              <br /><br />
              Los Usuarios podrán ejercitar los derechos de acceso reconocidos, cancelación, rectificación y oposición, así como tienen reconocido el derecho a ser informados de las cesiones realizadas contactando a Vendepunto.com a través del formulario de contacto del sitio web u otros medios disponibles en el sitio web.
              <br /><br />
              Vendepunto.com, con su arquitectura y encriptación, ofrece una privacidad y seguridad excepcional. Sus datos están protegidos en Internet y de cualquier eventual acceso indebido.
              <br /><br />
              Vendepunto.com protegerá su información privada almacenándola en un área segura y protegida de internet. Para ese fin, todos los usuarios de las aplicaciones de Vendepunto.com cuentan con un nombre de usuario y contraseña únicos que lo identifican ante los servidores de Vendepunto.com para usar sus aplicaciones.
              <br /><br />
              Vendepunto.com garantiza que el acceso a sus Datos Privados será privado y únicamente se podrá acceder con el usuario y contraseñas debidos, que el Usuario deberá resguardar.
              <br /><br />
              Vendepunto.com cuenta con las medidas de seguridad más avanzadas para garantizar el servicio y la confidencialidad de nuestros clientes, tanto en la transmisión de datos como en el alojamiento y mantenimiento de la información.
              <br /><br />
              Todas las bases de datos se encuentran alojadas en servidores seguros de Vendepunto.com, en Amazon Web Services, Inc., un Data Center del más alto nivel internacional, específicamente preparado para este tipo de actividades. Cuentan con equipamiento de tecnología avanzada, necesario para obtener el mayor rendimiento, estabilidad, escalabilidad y seguridad física: aire acondicionado, generadores eléctricos, detector de incendios, entre otras instalaciones que optimizan el medio para desarrollar esta actividad. Todo se encuentra bajo la supervisión de cámaras de seguridad y personal las 24 horas.
              <br /><br />
              Tenga en cuenta que esta Política de seguridad y privacidad se podrá modificar según se considere oportuno. No limitaremos sus derechos en virtud de esta Política de seguridad y privacidad sin su consentimiento explícito. Publicaremos todas las modificaciones de la Política de privacidad en esta página y, si son significativas, informaremos de ello a través de un aviso destacado (por ejemplo, mediante una notificación por correo electrónico si los cambios afectan a determinados servicios). Además, archivaremos las versiones anteriores de esta Política de privacidad para que los usuarios puedan consultarlas.
            </p>
          </section>
        </div>
      </div>
    </WelcomeLayout>
  );
}
