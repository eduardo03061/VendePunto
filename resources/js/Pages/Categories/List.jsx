import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router, Link, useForm } from "@inertiajs/react";
import { Button } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import Modal from "@/Components/Modal.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

import {
  PhotoIcon,
  XMarkIcon,
  ListBulletIcon,
  Squares2X2Icon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function CategoriesList({
  auth,
  roles,
  categories,
  pagination,
  search,
}) {
  const [typeView, setTypeView] = useState("table");
  const [confirmingItemEdit, setConfirmingItemEdit] = useState(false);
  const [confirmItemDelete, setConfirmItemDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchItem, setSearchItem] = useState(search ? search : "");
  const fileInputRef = useRef(null);
  console.log("categories", categories);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    description: "",
    category: "",
    user_id: auth.user.id,
  });

  const confirmDeleteItem = (item) => {
    setCurrentItem(item);
    setImagePreview(item.image);
    setData({
      name: item.name,
      category: item.category,
      barCode: item.barCode,
      sku: item.sku,
      image: item.image,
      description: item.description,
      salesUnit: item.salesUnit,
      stocks: item.stocks,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      user_id: item.user_id,
    });
    setConfirmItemDelete(true);
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    console.log("entra");
    const file = e.target.files[0];
    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCurrentItem((prev) => ({ ...prev, image: file }));
        console.log("file", reader);
        //setData('image', reader.result)
        setData("image", e.target.files[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (item) => {
    console.log("ITEM", item);
    setCurrentItem(item);
    setImagePreview(item.image);
    setData({
      name: item.name,
      higher_category_id: item.higher_category_id,
      barCode: item.barCode,
      sku: item.sku,
      image: item.image,
      description: item.description,
      salesUnit: item.salesUnit,
      stocks: item.stocks,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      user_id: item.user_id,
    });
    setConfirmingItemEdit(true);
  };

  const closeModalDelete = () => {
    setConfirmItemDelete(false);
    setCurrentItem(null);
    setImagePreview(null);
  };

  const closeModal = () => {
    setConfirmingItemEdit(false);
    setCurrentItem(null);
    setImagePreview(null);
  };

  const handleDeleteItem = (e) => {
    e.preventDefault();
    console.log("currentItem", currentItem);
    post(route("inventory.delete", currentItem.id), {
      onSuccess: () => closeModalDelete(),
    });
  };

  const handleEditItem = (e) => {
    e.preventDefault();
    post(route("categories.update", currentItem.id), {
      onSuccess: () => closeModal(),
    });
  };

  const toggleNav = (navId) => {
    const navElement = document.getElementById(navId);
    const isOpen = navElement.style.width === "80vh";
    navElement.style.width = isOpen ? "0" : "80vh";
    fileInputRef.current.value = "";
  };
  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    post(route("categories.storage"), {
      data: formData,
      onFinish: () => {
        toggleNav("mySidenav");
        reset();
      },
    });

    fileInputRef.current.value = "";
  };

  const handleSearch = (e) => {
    // Actualizar el valor de búsqueda en el estado de forma reactiva
    e.preventDefault();
    setSearchItem(e.target.value);

    setTimeout(() => {
      router.get("/Inventory", { search: e.target.value }, { replace: true });
    }, 1500);
  };
  const getRoute = (route) => {
    router.get(route);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title={"Inventario | Categorías de productos"}
      roles={roles}
    >
      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8 flex row">
          <div className="w-1/3">
            <Button
              className="primary-tab w-full"
              onClick={() => getRoute("/Inventory")}
            >
              Articulos
            </Button>
          </div>
          <div className="w-1/3">
            <Button
              className="tab w-full shadow-md rounded-full"
              onClick={() => getRoute("/Categories/list")}
            >
              Categorías
            </Button>
          </div>
          {/*<div className="w-1/3">
            <Button
              className="primary-tab w-full"
              onClick={() => getRoute("/Purchases/list")}
            >
              Comprar inventario
            </Button>
          </div>*/}
        </div>
        <div className=" mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div>
                  <div>
                    <div>
                      <MagnifyingGlassIcon className="w-8 h-8 absolute ml-4 mt-2" />
                      <TextInput
                        id="search"
                        type="text"
                        className="input-primary input-pl-8"
                        value={searchItem}
                        onChange={handleSearch}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex align-content-end">
                <div className="float-end">
                  <Button
                    onClick={() => toggleNav("mySidenav")}
                    className="text-xl btn shadow-md rounded-full my-6 flex"
                  >
                    Crear categoría
                    <PlusCircleIcon className="ml-3 w-8 h-8" />
                  </Button>
                </div>
              </div>
            </div>

            <div id="mySidenav" className="sidenav">
              <button
                className="closebtn"
                onClick={() => toggleNav("mySidenav")}
              >
                &times;
              </button>
              <div className="form-container">
                <h3 className="mt-0 text-3xl">Nueva Categoria</h3>
                <section className="m-auto pb-3">
                  <form onSubmit={submit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                          id="name"
                          name="name"
                          value={data.name}
                          className="mt-1 block w-full input-primary"
                          autoComplete="name"
                          isFocused={true}
                          onChange={(e) => setData("name", e.target.value)}
                          required
                        />
                        <InputError message={errors.name} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="description" value="Descripcion" />
                        <TextInput
                          id="name"
                          name="name"
                          value={data.description}
                          className="mt-1 block w-full input-primary"
                          autoComplete="name"
                          isFocused={true}
                          onChange={(e) =>
                            setData("description", e.target.value)
                          }
                          required
                        />
                        <InputError
                          message={errors.description}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <InputLabel
                          htmlFor="category"
                          value="Categoria Superior"
                        />
                        <select
                          id="category"
                          name="category"
                          value={data.category || ""} // Para manejar valores no definidos inicialmente
                          className="mt-1 block w-full input-primary"
                          onChange={(e) => setData("category", e.target.value)}
                        >
                          <option value="" disabled>
                            Selecciona una categoría
                          </option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <InputError
                          message={errors.category}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <PrimaryButton
                        className="text-2xl btn shadow-md rounded-full my-6 capitalize "
                        disabled={processing}
                      >
                        Crear categoría
                      </PrimaryButton>
                    </div>
                  </form>
                </section>
              </div>
            </div>
            {categories.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full table table-striped table-hover table-bordered">
                  <thead>
                    <tr className="rounded bg-gray-900 text-white">
                      <th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
                        Descripcion
                      </th>
                      <th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {categories.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-md font-medium text-gray-500 flex">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          {item.url}
                        </td>

                        <td className="px-6">
                          <Button onClick={() => openModal(item)}>
                            <PencilIcon className="h-5 w-5 mx-3" />
                          </Button>
                          <Button onClick={() => confirmDeleteItem(item)}>
                            <TrashIcon className="h-5 w-5 mx-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                <div className="flex justify-between mt-4">
                  <Link className="pagination-page flex" href={""}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-0.5 h-8 w-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Anterior
                  </Link>
                  <Link className="pagination-page flex" href={""}>
                    Siguiente
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-0.5 h-8 w-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <h4>Sin categorias.</h4>
              </div>
            )}

            <Modal show={confirmingItemEdit} onClose={closeModal}>
              <form
                onSubmit={handleEditItem}
                encType="multipart/form-data"
                className="p-6 w-70vh"
              >
                <h2 className="font-bold changetext2 text-3xl ">
                  Editar Categoria
                </h2>

                <div className="mt-1">
                  <InputLabel htmlFor="name" value="Nombre" />
                  <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full input-primary"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                </div>
                <div className="mt-1">
                  <InputLabel htmlFor="category" value="Descripcion" />
                  <TextInput
                    id="description"
                    type="text"
                    className="mt-1 block w-full input-primary"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                  />
                </div>

                <div className="mt-1">
                  <InputLabel htmlFor="category" value="Categoria Superior" />
                  <select
                    id="category"
                    name="category"
                    value={data.higher_category_id || ""} // Valor seleccionado o vacío si no está definido
                    className="mt-1 block w-full input-primary"
                    onChange={(e) => setData("category", e.target.value)} // Actualizar el estado al seleccionar
                  >
                    <option value="" disabled>
                      Selecciona una categoría
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6">
                  <div className="flex items-end">
                    <div className="py-8">
                      <SecondaryButton onClick={closeModal}>
                        Cancel
                      </SecondaryButton>
                      <DangerButton
                        className="ml-3"
                        type="submit"
                        disabled={processing}
                      >
                        Editar
                      </DangerButton>
                    </div>
                  </div>
                </div>
              </form>
            </Modal>

            <Modal show={confirmItemDelete} onClose={closeModalDelete}>
              <form onSubmit={handleDeleteItem} className="p-6 bg-gray-900">
                <h2 className="font-bold text-3xl flex justify-center">
                  Eliminar Articulo
                </h2>

                <div className="mt-1 font-bold text-lg items-center text-center">
                  {data.name}
                  <InputLabel htmlFor="image" value="" />
                  <img
                    src={data.image}
                    alt={data.name}
                    className="mt-6 object-cover m-auto text-center w-1/2"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SecondaryButton onClick={closeModalDelete}>
                    Cancel
                  </SecondaryButton>
                  <DangerButton
                    className="ml-3"
                    type="submit"
                    disabled={processing}
                  >
                    Eliminar
                  </DangerButton>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
