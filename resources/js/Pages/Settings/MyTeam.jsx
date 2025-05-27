import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Button } from "@headlessui/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import {
  PencilIcon,
  TrashIcon,
  ArrowDownCircleIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export const MyTeam = ({ cantUsers, company, auth, users,allRoles }) => {
  const { data, setData, post, processing } = useForm({
    name: "",
    email: "",
    password: "",
    rol: "",
    company: company.id,
    phone: auth.user?.phone,
    subscription_ends_at: auth.user?.subscription_ends_at,
  });
  const [addUser, setAddUser] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("settings.addUser"), {
      onFinish: () => alert("Usuario agregado"),
    });
  };
  return (
    <>
      {/* <section className="block md:flex justify-between items-center">
        <div className="fle gap-4">
          <div>
              <MagnifyingGlassIcon className="w-8 h-8 absolute ml-4 mt-2 gray" />
              <TextInput
                id="search"
                type="text"
                className="input-primary input-pl-8"
                required
              />
            </div>
        </div>
      </section> */}

      <div className="my-8">
        {addUser && (
          <form onSubmit={submit} className="my-8">
            <div className="flex gap-4">
              <TextInput
                id="name"
                name="name"
                placeholder="Nombre"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
              />
              <TextInput
                id="email"
                name="email"
                placeholder="Correo"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
              />
              <TextInput
                id="password"
                name="password"
                placeholder="Contraseña"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
              />
              <select
                id="rol"
                name="rol"
                value={data.rol}
                onChange={(e) => setData("rol", e.target.value)}
                className="input-primary rounded-lg bg-black text-white px-4 py-2"
                required
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {allRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <PrimaryButton disabled={processing}>Agregar</PrimaryButton>
            </div>
          </form>
        )}

       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold gray">
            Usuarios ({cantUsers})
          </h2>
          <div className="flex justify-center md:align-content-end md:float-end">
            <Button
              className="flex items-center primary cursor-pointer gap-4"
              onClick={() => setAddUser(!addUser)}
            >
              Agregar Usuario <PencilIcon className="w-4 h-4" />
            </Button>
          </div>
        </div> 
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div key={index} className="p-8 card">
              <div className="flex justify-between items-center">
                <h2 className="text-xl  gray">{user.id}</h2>
                <h3 className="text-sm bg-fondo px-8 rounded-full primary-text">
                  Activo
                </h3>
              </div>
              <div className="block justify-between items-center gap-1">
                <h3 className="text-sm white">{user.name}</h3>
                <h5 className="text-xs gray">({user.roles[0].name})</h5>
              </div>
              <div className="block justify-between items-center gap-2">
                <h5 className="text-xs gray text-pretty md:text-balance">
                  {user.email}
                </h5>
                <div className="flex gap-2">
                  <PencilIcon className="h-5 w-5 primary-link cursor-pointer" />
                  <TrashIcon className="h-5 w-5 primary-link cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
