import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import { PencilIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import { MyBusiness } from "./MyBusiness";
import { MyTeam } from "./MyTeam";

export default function Settings({
  auth,
  roles,
  items,
  subscription,
  company,
  users,
  allRoles,
}) {
  const { name, cantUsers, cantItems } = subscription;

  //Campos de formulario Mi cuenta
  const [nameUser, setNameUser] = useState(users[0]?.name || ""); // Estado local para el nombre
  const [email, setEmail] = useState(users[0]?.email || ""); // Estado local para el correo electrónico
  const [phone, setPhone] = useState(users[0]?.phone || ""); // Estado local para el teléfono
  const [companyUser, setCompanyUser] = useState(
    company?.name.replace(/_/g, " ")
  ); // Estado local para la empresa
  const [rSocial, setRSocial] = useState(""); // Estado local para la razón social
  const [RFC, setRFC] = useState(""); // Estado local para el RFC

  const [activeTab, setActiveTab] = useState("Mi Cuenta");
  const [editAccount, setEditAccount] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const props = usePage().props;

  console.log("allRoles", allRoles);

  const submitAcount = async (event) => {
    try {
      event.preventDefault();
      console.log("props", props);

      console.log("props.csrf_token", props.csrf_token);

      router.post(
        "/Settings/account-update",
        {
          _token: props.csrf_token,
          name: nameUser,
          email: email,
          phone: phone,
          company: companyUser,
          rSocial: rSocial,
          RFC: RFC,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            alert("Datos actualizados correctamente");
          },
          onError: (errors) => {
            console.log("errors", errors);
          },
        }
      );
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <AuthenticatedLayout user={auth.user} roles={roles} title="Configuraciones">
      <Head title="Configuraciones" />
      <div className="mt-8 rounded-xl shadow-sm">
        <div className="mx-auto sm:px-6 lg:px-8 flex justify-between row">
          {["Mi Cuenta", "Mi Negocio", "Mi Equipo"].map((tab) => (
            <div key={tab} className="w-1/3">
              <Button
                className={`w-full shadow-md rounded-full ${
                  activeTab === tab ? "tab" : "primary-tab"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace("_", " ")}
              </Button>
            </div>
          ))}
        </div>

        <div className="my-8">
          {activeTab === "Mi Cuenta" && (
            <>
              <div className="block md:flex bg-gray-900 items-center justify-between mx-8 my-8 p-6 rounded-lg">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">Tipo de Suscripción:</h2>
                  <h2 className="text-2xl primary">{name}</h2>
                </div>
                
                <div className="block">
                  <Button
                    className="flex items-center primary-link underline cursor-pointer gap-4"
                    onClick={() => setAddUser(!addUser)}
                  >
                    Renovar suscripción <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="flex items-center primary-link underline cursor-pointer gap-4"
                    onClick={() => setAddUser(!addUser)}
                  >
                    Cambiar de plan <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="flex items-center primary-link underline cursor-pointer gap-4"
                    onClick={() => setAddUser(!addUser)}
                  >
                    Ver movimientos <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </div>

              </div>
              <div className="block md:flex bg-gray-900 items-center justify-between mx-8 my-8 p-6 rounded-lg">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">Artículos actuales:</h2>
                  <h2 className="text-2xl primary">
                    {items.length} (máx {cantItems} artículos){" "}
                  </h2>
                </div>
                <Button
                  className="flex items-center primary-link underline cursor-pointer gap-4"
                  onClick={() => setAddUser(!addUser)}
                >
                  Ver inventario <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
              {editAccount ? (
                <div className="bg-gray-900 mx-8 my-8 p-6 rounded-lg">
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">Datos del titular:</h2>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="text-lg gray">Titular</h2>
                    <input
                      type="text"
                      name="name"
                      value={nameUser}
                      onChange={(e) => setNameUser(e.target.value)}
                    />
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray">Correo principal</h2>

                    <h2 className="text-lg gray">{users[0].email}</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray">Teléfono</h2>
                    <input
                      type="text"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray">País y ciudad</h2>
                    <h2 className="text-lg gray">México</h2>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="text-lg gray">Negocio</h2>
                    <input
                      type="text"
                      name="company"
                      value={companyUser}
                      onChange={(e) => setCompanyUser(e.target.value)}
                    />
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray">Razón social (opcional)</h2>
                    <input
                      type="text"
                      name="rSocial"
                      value={rSocial}
                      onChange={(e) => setRSocial(e.target.value)}
                    />
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray">RFC (opcional)</h2>
                    <input
                      type="text"
                      name="RFC"
                      value={RFC}
                      onChange={(e) => setRFC(e.target.value)}
                    />
                  </div>

                  <div className="block md:flex justify-end align-content-end ">
                    <Button
                      className="flex items-center primary cursor-pointer gap-4"
                      onClick={(e) => {
                        submitAcount(e);
                        setEditAccount(!editAccount);
                      }}
                    >
                      Guardar <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 mx-8 my-8 p-6 rounded-lg">
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">Datos del titular:</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">Titular</h2>
                    <h2 className="text-lg gray">{users[0].name}</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">Correo principal</h2>
                    <h2 className="text-lg gray">{users[0].email}</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">Teléfono</h2>
                    <h2 className="text-lg gray">+52 {users[0].phone}</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">País y ciudad</h2>
                    <h2 className="text-lg gray">México</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">Negocio</h2>
                    <h2 className="text-lg gray">
                      {company?.name.replace(/_/g, " ")}
                    </h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">Razón social (opcional)</h2>
                    <h2 className="text-lg gray">{company?.rSocial || "*"}</h2>
                  </div>
                  <div className="block md:flex justify-between">
                    <h2 className="text-lg gray-800">RFC (opcional)</h2>
                    <h2 className="text-lg gray">{company?.rfc || "*"}</h2>
                  </div>

                  <div className="block md:flex justify-end align-content-end ">
                    <Button
                      className="flex items-center primary-link underline cursor-pointer gap-4"
                      onClick={() => setEditAccount(!editAccount)}
                    >
                      Editar <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mx-8 my-8">
          {activeTab === "Mi Negocio" && <MyBusiness company={company} />}
        </div>

        <div className="mx-8 my-8">
          {activeTab === "Mi Equipo" && (
            <MyTeam
              cantUsers={cantUsers}
              company={company}
              auth={auth}
              allRoles={allRoles}
              users={users}
            />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
