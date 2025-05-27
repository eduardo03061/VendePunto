import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CreatePurchase({
  auth,
  roles,
  items,
  purchase_id,
  record,
}) {
  const [itemsToSale, setItemsToSale] = useState([]);
  const [tempItem, setTempItem] = useState(null);
  const [total, setTotal] = useState(0);
  const { data, setData, post, processing, errors, reset } = useForm({
    productName: "",
    date: "",
    totalSales: 0,
    itemsToSale: [],
  });
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const currentDate = new Date().toString().split(" GM")[0];
    setData("date", currentDate);
    const intervalId = setInterval(async () => {
      try {
        // Consultar al backend para obtener las actualizaciones del carrito
        const response = await axios.get(
          route("purchases.get-cart-updates", {
            purchase_id,
            count: itemsToSale.length,
          })
        );
        console.log("Backend response:", response.data);
        // Verificar si hay actualizaciones
        if (response.data.has_updates) {
          // Reemplazar el estado con la lista completa de artículos
          setItemsToSale(response.data.items);
          // Actualizar el total (pasando el nuevo itemsToSale)
          console.log("Updating total with items:", response.data.items);
          updateTotal(response.data.items);
        }
      } catch (error) {
        console.error("Error al obtener actualizaciones del carrito:", error);
      }
    }, 5000); // Consulta cada 5 segundos
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [purchase_id]);

  // Guardar el carrito en localStorage cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (itemsToSale.length > 0) {
        const incompletePurchase = {
          products: itemsToSale
        };
        localStorage.setItem(
          "incompletePurchase",
          JSON.stringify(incompletePurchase)
        );
      }
    };
  }, [itemsToSale]);

  // Función para reanudar la compra (si se recibe la información por query parameters)
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const purchaseData = urlParams.get("purchase");

    if (purchaseData) {
      const parsedPurchase = JSON.parse(purchaseData);
      setItemsToSale(parsedPurchase.products);
      updateTotal(parsedPurchase.products);

      // Limpiar la información de la compra incompleta de localStorage
      localStorage.removeItem("incompletePurchase");
    }
  }, []);

  const onProductInput = async (e) => {
    const itemName = e.target.value;
    setData("productName", itemName);
    try {
      const response = await fetch(`/inventory/search?search=${itemName}`);
      const filtered = await response.json();
      setFilteredItems(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addItemToSale = (item) => {
    setTempItem({ ...item, cant: 1, purchasePrice: item.purchasePrice });
  };

  const updateTotal = (newItemsToSale) => {
    console.log("Updating total with items:", newItemsToSale);
    const total = newItemsToSale.reduce((acc, item) => {
      const price = parseFloat(item.purchasePrice);
      const quantity = parseFloat(item.cant);
      if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
        return acc + price * quantity;
      } else {
        return acc;
      }
    }, 0);
    setTotal(total);
    setData("totalSales", total);
  };

  const updateItemQuantity = (e, index) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity < 1 || newQuantity > itemsToSale[index.stock]) {
      alert(
        "Cantidad inválida. El stock disponible es: " + itemsToSale[index].stock
      );
      return;
    }
    const newItems = [...itemsToSale];
    newItems[index] = {
      ...newItems[index],
      cant: newQuantity,
      purchasePrice: newItems[index].purchasePrice,
    };
    setItemsToSale(newItems);
    setData("itemsToSale", newItems);
    updateTotal(newItems);
  };

  const props = usePage().props;

  const submit = (e) => {
    e.preventDefault();
    if (tempItem) {
      // Agregar el item al carrito en el frontend
      const newItem = { ...tempItem };
      newItem.purchasePrice = tempItem.purchasePrice;
      const newItemsToSale = [...itemsToSale, newItem];
      setItemsToSale(newItemsToSale);
      setData("itemsToSale", newItemsToSale);
      updateTotal(newItemsToSale);
      setTempItem(null);
      // Enviar la solicitud al backend para registrar el producto en la base de datos
      router.post(
        route("purchases.add-to-cart"),
        {
          _token: props.csrf_token,
          product_id: tempItem.id,
          quantity: tempItem.cant,
          purchase_id: purchase_id,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            // No necesitas hacer nada aquí, ya que el webhook actualizará el carrito
          },
          onError: (errors) => {
            setErrors(errors);
          },
        }
      );
    }
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    router.post(
      route("purchases.finalize"),
      {
        // Usar la nueva ruta
        _token: props.csrf_token,
        purchase_id: purchase_id,
        itemsToSale: itemsToSale,
      },
      {
        onSuccess: () => {
          router.visit(route("purchases.list"));
        },
        onError: (errors) => {
          console.error(errors);
        },
      }
    );
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (tempItem) {
      const newItem = { ...tempItem };
      const newItemsToSale = [...itemsToSale, newItem];
      setItemsToSale(newItemsToSale);
      updateTotal(newItemsToSale);
      setTempItem(null);
    }
    return true;
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title={"Registrar compra de inventario"}
      roles={roles}
    >
      <section className="flex">
        <div className="w-full">
          <div className="mx-auto sm:px-6 lg:px-8">
            <div className="py-12">
              <form className="flex gap-8" onSubmit={submit}>
                <section className="w-full">
                  <section className="shadow-md rounded-lg p-8 bg-gray-900">
                    <div className="flex justify-end grid grid-cols-1 gap-6">
                      <button className="primary-btn shadow-md rounded-full mb-2 gray">
                        Agregar nuevo artículo al inventario
                      </button>
                    </div>
                    <div className="md:flex block gap-8">
                      <div className="w-full">
                        <div className="grid grid-cols-1 gap-6">
                          <div className="relative">
                            {/* Agrega relative para posicionar el div de resultados */}
                            <InputLabel
                              htmlFor="productName"
                              className="text-lg shadow-md rounded-3xl gray "
                              value="Buscar producto existente:"
                            />
                            <TextInput
                              id="productName"
                              name="productName"
                              value={data.productName}
                              className="mt-1 block w-full input-primary"
                              onChange={onProductInput}
                            />
                            <InputError
                              message={errors.productName}
                              className="mt-2"
                            />
                            {filteredItems.length > 0 && (
                              <div
                                id="searchResults"
                                className="absolute z-10 bg-black hover:bg-primary border rounded shadow-md mt-2"
                              >
                                {filteredItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="p-2 cursor-pointer"
                                    onClick={() => addItemToSale(item)}
                                  >
                                    {item.name}
                                  </div>
                                ))}
                              </div>
                            )}
                            <datalist id="nombres">
                              {filteredItems.map((item) => (
                                <option
                                  key={item.id}
                                  value={item.name}
                                  onClick={() => addItemToSale(item)}
                                />
                              ))}
                            </datalist>
                          </div>
                        </div>
                      </div>
                    </div>
                    {tempItem && (
                      <div className="md:flex block mt-4 gap-8">
                        <div className="md:w-1/2 w-full grid grid-cols-1 gap-6">
                          <div>
                            <div className="text-lg shadow-md rounded-3xl gray">
                              Cantidad:
                            </div>
                            <input
                              type="number"
                              min="1"
                              value={tempItem.cant || 1}
                              onChange={(e) =>
                                setTempItem({
                                  ...tempItem,
                                  cant: Number(e.target.value),
                                })
                              }
                              className="input-primary"
                            />
                          </div>
                        </div>
                        <div className="md:w-1/2 w-full grid grid-cols-1 gap-6">
                          <div>
                            <div className="text-lg shadow-md rounded-3xl gray">
                              Precio:
                            </div>
                            <div className="text-3xl shadow-md rounded-full p-2 bg-black gray">
                              $
                              {((tempItem.cant || 1) * tempItem.purchasePrice)
                                .toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="md:w-1/2 w-full flex justify-end grid grid-cols-1 gap-6">
                      <div>
                        <button
                          // onClick={submit}
                          className="text-2xl btn shadow-md rounded-full my-6 "
                        >
                          Registrar
                        </button>
                      </div>
                    </div>
                  </section>
                  <section>
                    <div className="w-full shadow-md rounded-lg p-2 bg-black mt-8">
                      <div className="text-2xl p-6 gray">
                        <InputLabel htmlFor="summary" value="Carrito" />
                      </div>
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 justify-center">
                              Producto
                            </th>
                            <th className="px-4 py-2 justify-center">
                              Imagen
                            </th>
                            <th className="px-4 py-2 justify-center">
                              Cantidad
                            </th>
                            <th className="px-4 py-2 justify-center">
                              Precio
                            </th>
                          </tr>
                        </thead>
                        <tbody className="gray">
                          {itemsToSale.map((item, index) => (
                            <tr key={item.id}>
                              <td className="border px-4 py-2">{item.name}</td>
                              <td className="border flex justify-center py-2">
                                <img
                                  src={`../${item.image}`}
                                  alt={item.name}
                                  className="h-12 w-12 object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2">
                                <input
                                  type="number"
                                  value={item.cant}
                                  min="1"
                                  className="ml-2 border rounded px-2 w-1/2 input-primary"
                                  onChange={(e) =>
                                    updateItemQuantity(e, index)
                                  }
                                />
                              </td>
                              <td className="border px-4 py-2">
                                $
                                {(item.cant * item.purchasePrice).toFixed(2)}{" "}
                                {/* Actualiza el precio total */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </section>
                {/* Sección de Resumen */}
                <section className="w-3/4 ">
                  <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="shadow-md rounded-lg p-8 bg-gray-900">
                      <div className="text-2xl pb-8">
                        <InputLabel
                          htmlFor="summary"
                          value="Resumen de compra de inventario"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <div className="text-lg shadow-md rounded-3xl gray ">
                            Subtotal:
                          </div>
                          <div className="text-3xl shadow-md rounded-full p-2 bg-black gray ">
                            ${total.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg shadow-md rounded-3xl">
                            Precio Total:
                          </div>
                          <div className="text-3xl shadow-md rounded-full p-2 bg-black">
                            ${total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* <form onSubmit={handlePurchaseSubmit}> */}
                      <button
                        onClick={handlePurchaseSubmit}
                        className="text-2xl w-full btn shadow-md rounded-full my-6"
                      >
                        Comprar y agregar al inventario
                      </button>
                      {/* </form> */}
                    </div>
                  </div>
                </section>
                {/* Fin de la sección de resumen */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}