import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  PhotoIcon,
  DocumentTextIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import InputLabel from "@/Components/InputLabel";

export const MyBusiness = ({ company }) => {
  const { data, setData, post, processing } = useForm({
    logoImage: company?.logoImage || null,
    coverImage: company?.coverImage || null,
    description: company?.description || "",
  });

  const [logoPreview, setLogoPreview] = useState(
    typeof company?.logoImage === "string" ? company.logoImage : null
  );
  const [coverPreview, setCoverPreview] = useState(
    typeof company?.coverImage === "string" ? company.coverImage : null
  );
  const [description, setDescription] = useState(company?.description || "");

  useEffect(() => {
    // Cleanup object URLs when component unmounts or previews change
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:"))
        URL.revokeObjectURL(logoPreview);
      if (coverPreview && coverPreview.startsWith("blob:"))
        URL.revokeObjectURL(coverPreview);
    };
  }, [logoPreview, coverPreview]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("logoImage", file);
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("coverImage", file);
      const objectUrl = URL.createObjectURL(file);
      setCoverPreview(objectUrl);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setData("description", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("company.updateProfile"), {
      preserveScroll: true,
      onSuccess: () => alert("Cambios guardados correctamente"),
      onError: (errors) => console.log(errors),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold gray">Perfil de mi Negocio</h2>
        <div className="flex justify-center md:align-content-end md:float-end">
          <Link
            href={route("stores.index", { name: company?.name })}
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                route("stores.index", { name: company?.name }),
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Ir a mi tienda
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg border shadow-sm mb-8 overflow-hidden">
        <div className="p-4 ">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" /> Presentación del negocio o
            tienda
          </h3>
        </div>
        <div className="p-5">
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe tu negocio..."
            className="w-full min-h-[150px] rounded-md p-2 border"
          />
          <p className="text-xs text-gray-500 mt-2">
            Una buena descripción ayuda a tus clientes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Perfil Card */}
        <div className="bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 ">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PhotoIcon className="h-5 w-5" /> Foto de perfil
            </h3>
          </div>
          <div className="p-5 flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-gray-600 border-2 border-dashed flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <PhotoIcon className="h-10 w-10 mx-auto mb-2" />
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
            </div>
            <InputLabel
              htmlFor="profile-upload"
              className="cursor-pointer w-full"
            >
              <div className="flex items-center justify-center gap-2 p-2 border rounded-md primary-btn">
                <ArrowUpTrayIcon className="h-4 w-4" />
                <span>Subir imagen</span>
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </InputLabel>
            <p className="text-xs text-gray-500">Recomendado: 300x300px</p>
          </div>
        </div>

        {/* Portada Card */}
        <div className="bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 ">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PhotoIcon className="h-5 w-5" /> Foto de portada
            </h3>
          </div>
          <div className="p-5 flex flex-col items-center gap-4">
            <div className="relative w-full h-32 rounded-xl overflow-hidden border-gray-600 border-2 border-dashed flex items-center justify-center">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Foto de portada"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <PhotoIcon className="h-10 w-10 mx-auto mb-2" />
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
            </div>
            <InputLabel
              htmlFor="cover-upload"
              className="cursor-pointer w-full"
            >
              <div className="flex items-center justify-center gap-2 p-2 border rounded-md primary-btn">
                <ArrowUpTrayIcon className="h-4 w-4" />
                <span>Subir imagen</span>
              </div>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </InputLabel>
            <p className="text-xs text-gray-500">Recomendado: 1200x400px</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end primary ">
        <Button type="submit" className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4" /> Guardar cambios
        </Button>
      </div>
    </form>
  );
};
