import { useState } from "react"; 
import { Head } from "@inertiajs/react";
  
export default function StoresLayaout({
  title, 
  isBack,
  children,
  image,
}) {
  const [viewMenu, setViewMenu] = useState(true);

  const onMenu = (e) => {
    e.preventDefault();
    setViewMenu(!viewMenu);
  };

  const Title = ({ children }) => {
    return <div className="hidden gray text-xl">{children}</div>;
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="subpixel-antialiased font-['Poppins'] overflow-hidden">
        <div className="flex justify-center m-4 rounder-full">
          <img
            src={`../assets/img/negocio/logo-negocio.jpg`}
            alt="Banner de la tienda"
            className="w-16 h-16 absolute z-40 rounded-full border-2 border-gray-500 shadow-lg object-cover"
          />
        </div>
        <div className="overflow-x-hidden">
          {isBack ? (
            <Back route={routeBack}>{title}</Back>
          ) : (
            <Title >{title}</Title>
          )}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
