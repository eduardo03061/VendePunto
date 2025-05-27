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

export default function Customers({
  auth,
  customers,
  roles,
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
   
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    category: "",
    barCode: "",
    sku: "",
    image: null,
    showInStore: true,
    description: "",
    salesUnit: "",
    stocks: "",
    purchasePrice: "",
    sellingPrice: "",
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
  console.log("customers", customers);
  const openModal = (item) => {
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
    post(route("inventory.update", currentItem.id), {
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

    post(route("inventory.storage"), {
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
  }

  return (
    <AuthenticatedLayout user={auth.user} title={"Clientes"} roles={roles}>
      <div className="py-12"> 
        <div className=" mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex gap-4"> 
                <div>
                  <div>
                    <div>
                      <MagnifyingGlassIcon className="w-8 h-8 absolute ml-4 mt-2 gray" />
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
                    Crear cliente
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
                <h3 className="mt-0 text-3xl">Nuevo Cliente</h3>
                <section className="m-auto pb-3">
                  <form onSubmit={submit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <InputLabel htmlFor="name" value="Name" />
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
                        <InputLabel htmlFor="category" value="Category" />
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
                        
                        </select>
                        <InputError
                          message={errors.category}
                          className="mt-2"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <InputLabel htmlFor="description" value="Description" />
                        <TextInput
                          id="description"
                          name="description"
                          value={data.description}
                          className="mt-1 block w-full input-primary"
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
                        <InputLabel htmlFor="barCode" value="Bar Code" />
                        <TextInput
                          id="barCode"
                          name="barCode"
                          value={data.barCode}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) => setData("barCode", e.target.value)}
                          required
                        />
                        <InputError message={errors.barCode} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="sku" value="SKU" />
                        <TextInput
                          id="sku"
                          name="sku"
                          value={data.sku}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) => setData("sku", e.target.value)}
                          required
                        />
                        <InputError message={errors.sku} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="salesUnit" value="Sales Unit" />
                        <TextInput
                          id="salesUnit"
                          name="salesUnit"
                          value={data.salesUnit}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) => setData("salesUnit", e.target.value)}
                          required
                        />
                        <InputError
                          message={errors.salesUnit}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <InputLabel htmlFor="stocks" value="Stocks" />
                        <TextInput
                          id="stocks"
                          name="stocks"
                          value={data.stocks}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) => setData("stocks", e.target.value)}
                          required
                        />
                        <InputError message={errors.stocks} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel
                          htmlFor="purchasePrice"
                          value="Purchase Price"
                        />
                        <TextInput
                          id="purchasePrice"
                          name="purchasePrice"
                          type="number"
                          step="0.01"
                          value={data.purchasePrice}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) =>
                            setData("purchasePrice", e.target.value)
                          }
                          required
                        />
                        <InputError
                          message={errors.purchasePrice}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <InputLabel
                          htmlFor="sellingPrice"
                          value="Selling Price"
                        />
                        <TextInput
                          id="sellingPrice"
                          name="sellingPrice"
                          type="number"
                          step="0.01"
                          value={data.sellingPrice}
                          className="mt-1 block w-full input-primary"
                          onChange={(e) =>
                            setData("sellingPrice", e.target.value)
                          }
                          required
                        />
                        <InputError
                          message={errors.sellingPrice}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <InputLabel htmlFor="image" value="Image" />
                        <input
                          id="image"
                          type="file"
                          name="image"
                          className="mt-1 block w-full input-primary"
                          accept="image/*"
                          ref={fileInputRef} // Asignar la referencia al input
                          onChange={(e) => setData("image", e.target.files[0])}
                        />
                        <InputError message={errors.image} className="mt-2" />
                      </div>
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            id="showInStore"
                            name="showInStore"
                            type="checkbox"
                            className="sr-only peer"
                            checked={data.showInStore}
                            onChange={(e) =>
                              setData("showInStore", !data.showInStore)
                            }
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Mostrar en tienda
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <PrimaryButton
                        className="text-2xl btn shadow-md rounded-full my-6 capitalize "
                        disabled={processing}
                      >
                        Crear artículo
                      </PrimaryButton>
                    </div>
                  </form>
                </section>
              </div>
            </div>
            {customers.length > 0 ? (
              typeView === "table" ? (
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
                          Notas
                        </th>
                        
                        <th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {customers.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-md font-medium text-gray-500 flex">
                            
                            {item.nickname}
                          </td>
                          <td className="px-6 py-4 text-md text-gray-500">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-md text-gray-500">
                            {item.notes}
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
                    <Link
                      className="pagination-page flex"
                      href={pagination.prev_page_url}
                    >
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
                    <Link
                      className="pagination-page flex"
                      href={pagination.next_page_url}
                    >
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
                <div id="card" className="container overflow-hidden">
                  <div className="row">
                    <div className="flex flex-wrap">
                      {customers.map((item, index) => (
                        <div key={index} className="card w-full card-w">
                          <div className="w-full">
                            <img src={item.image || ""} alt={item.name} />
                          </div>
                          <div>
                            <h5 className="card-title white">{item.name}</h5>
                            <p className="card-text p-0 m-0 text-muted ellipsis">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex justify-between"></div>
                          <div className="flex gap-4">
                            <div className="pr-4">
                              <Button onClick={() => openModal(item)}>
                                <PencilIcon className="card-link mx-3 h-5 w-5" />
                              </Button>
                              <Button onClick={() => confirmDeleteItem(item)}>
                                <TrashIcon className="h-5 w-5" />
                              </Button>
                            </div>
                            <p className="card-subtitle p-0 m-0 text-muted">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Paginación */}
                  <div className="flex justify-between mt-4">
                    <Link
                      className="pagination-page flex"
                      href={pagination.prev_page_url}
                    >
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
                    <Link
                      className="pagination-page flex"
                      href={pagination.next_page_url}
                    >
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
              )
            ) : (
              <div className="mt-6 overflow-x-auto">
                <h4>Sin articulos.</h4>
              </div>
            )}

            <Modal show={confirmingItemEdit} onClose={closeModal}>
              <form
                onSubmit={handleEditItem}
                encType="multipart/form-data"
                className="p-6 w-70vh"
              >
                <h2 className="font-bold changetext2 text-3xl ">
                  Editar artículo
                </h2>

                <div className="mt-1">
                  <InputLabel htmlFor="name" value="Name" />
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
                  <InputLabel htmlFor="category" value="Category" />
                  <TextInput
                    id="category"
                    type="text"
                    className="mt-1 block w-full input-primary"
                    value={data.category}
                    onChange={(e) => setData("category", e.target.value)}
                    required
                  />
                </div>
                <div className="mt-1">
                  <InputLabel htmlFor="description" value="Description" />
                  <TextInput
                    id="description"
                    type="text"
                    className="mt-1 block w-full input-primary"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 w-1/2">
                    <InputLabel htmlFor="barCode" value="Bar Code" />
                    <TextInput
                      id="barCode"
                      type="text"
                      className="mt-1 block w-full input-primary"
                      value={data.barCode}
                      onChange={(e) => setData("barCode", e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-1 w-1/2">
                    <InputLabel htmlFor="sku" value="SKU" />
                    <TextInput
                      id="sku"
                      type="text"
                      className="mt-1 block w-full input-primary"
                      value={data.sku}
                      onChange={(e) => setData("sku", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 w-1/2">
                    <InputLabel htmlFor="salesUnit" value="Sales Unit" />
                    <TextInput
                      id="salesUnit"
                      type="text"
                      className="mt-1 block w-full input-primary"
                      value={data.salesUnit}
                      onChange={(e) => setData("salesUnit", e.target.value)}
                    />
                  </div>
                  <div className="mt-1 w-1/2">
                    <InputLabel htmlFor="stocks" value="Stocks" />
                    <TextInput
                      id="stocks"
                      type="number"
                      className="mt-1 block w-full input-primary"
                      value={data.stocks}
                      onChange={(e) => setData("stocks", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 w-1/2">
                    <InputLabel
                      htmlFor="purchasePrice"
                      value="Purchase Price"
                    />
                    <TextInput
                      id="purchasePrice"
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full"
                      value={data.purchasePrice}
                      onChange={(e) => setData("purchasePrice", e.target.value)}
                    />
                  </div>
                  <div className="mt-1 w-1/2">
                    <InputLabel htmlFor="sellingPrice" value="Selling Price" />
                    <TextInput
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full"
                      value={data.sellingPrice}
                      onChange={(e) => setData("sellingPrice", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    {imagePreview ? (
                      <div className="relative mt-4">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="h-32 w-32 object-cover rounded-md border-gray-800 border-8"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentItem((prev) => ({
                              ...prev,
                              image: null,
                            }));
                            setData("image", null);
                            setImagePreview(null);
                            console.log("ss");
                          }}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1"
                        >
                          <XMarkIcon
                            className="h-4 w-4 text-red-600"
                            aria-hidden="true"
                          />
                        </button>

                        {/* <div htmlFor="image-update" type="button" className='cursor-pointer absolute bottom-0 right-0 -mb-2 -mr-2 bg-red-100 rounded-full p-1'>
                                                     <PencilIcon className="h-4 w-4 text-red-600" aria-hidden="true"/>
                                                 </div> */}
                      </div>
                    ) : (
                      <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                        <PhotoIcon
                          className="h-12 w-12 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    )}

                    <input
                      id="image-update"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e); // Pasa el evento para manejar el archivo seleccionado
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        No mostrar en tienda
                      </span>
                    </label>
                    <div className="flex rounded-full primary-btn shadow-md rounded-full mb-2 gray">
                      <label
                        htmlFor="image-update"
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <PencilIcon
                          className="w-4 h-4 cursor-pointer"
                          aria-hidden="true"
                        />
                        Cambiar imagen
                      </label>
                    </div>

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
