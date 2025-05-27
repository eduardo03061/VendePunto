import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { usePage, router } from "@inertiajs/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Logo from "@/Components/Logo.jsx";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";

export default function CreatePurchase({
  auth,
  roles,
  items,
  initialItems = [],
  saleId,
  initialCategories = [],
}) {
  // Estados principales
  const [productName, setProductName] = useState("");
  const [itemsToSale, setItemsToSale] = useState(initialItems);
  const [total, setTotal] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cardDigitsTouched, setCardDigitsTouched] = useState(false);

  // Estados de pago
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [cardDigits, setCardDigits] = useState("");
  const [change, setChange] = useState(0);
  const [showPaymentSection, setShowPaymentSection] = useState(false);

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const cardInputRef = useRef(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const IVA_PERCENTAGE = 16;

  // Estados para creación de artículo
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState(initialCategories);

  const [showCart, setShowCart] = useState(true);
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

  useEffect(() => {
    if (showCreateArticle) {
      axios
        .get(route("api.categories"), {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.success) {
            console.log("Categorias", response.data);

            setCategories(
              response.data.data.length > 0 ? response.data.data : [""]
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          router.visit(route("login"));
        });
    }
  }, [showCreateArticle]);

  useEffect(() => {
    const parsedInitialItems = initialItems.map((item) => ({
      ...item,
      cant: parseFloat(item.cant) || 0,
    }));

    setItemsToSale(parsedInitialItems);
    updateTotal(parsedInitialItems);

    const savedSale = localStorage.getItem("pendingSale");
    if (savedSale) {
      const saleData = JSON.parse(savedSale);
      setItemsToSale(
        saleData.items.map((item) => ({
          ...item,
          cant: parseFloat(item.cant) || 0,
        }))
      );
    }
  }, [initialItems]);

  useEffect(() => {
    updateTotal(itemsToSale);
  }, [itemsToSale]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const results = items.filter(
        (item) =>
          item.name.toLowerCase().includes(productName.toLowerCase()) ||
          item.description?.toLowerCase().includes(productName.toLowerCase())
      );
      setFilteredItems(results.slice(0, 12));
    }, 300);
    return () => clearTimeout(timeout);
  }, [productName, items]);

  // Funciones de productos
  const updateTotal = (items) => {
    const newTotal = items.reduce(
      (acc, item) => acc + item.cant * item.sellingPrice,
      0
    );
    setTotal(Number(newTotal.toFixed(2)));
  };

  const calculateTotals = () => {
    const subtotal = itemsToSale.reduce(
      (acc, item) => acc + item.cant * item.sellingPrice,
      0
    );

    const iva = subtotal * (IVA_PERCENTAGE / 100);
    const discount = subtotal * (discountPercentage / 100);
    const total = subtotal - discount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      iva: Number(iva.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const handleManualQuantity = (item, value) => {
    const numericValue = parseFloat(value) || 0;
    const cleanValue = Math.round(numericValue * 10) / 10;

    setItemsToSale((prev) => {
      const updated = prev
        .map((i) => (i.id === item.id ? { ...i, cant: cleanValue } : i))
        .filter((i) => i.cant > 0);

      return updated;
    });
  };

  const addItem = (item, initialValue = 1) => {
    setItemsToSale((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cant: i.cant + initialValue } : i
        );
      }
      return [...prev, { ...item, cant: initialValue }];
    });
  };

  const removeProductFromCart = (itemId) => {
    setItemsToSale((prev) => {
      const updatedItems = prev.filter((item) => item.id !== itemId);

      const savedSale = localStorage.getItem("pendingSale");
      if (savedSale) {
        const saleData = JSON.parse(savedSale);
        localStorage.setItem(
          "pendingSale",
          JSON.stringify({
            ...saleData,
            items: updatedItems,
          })
        );
      }

      return updatedItems;
    });
  };

  const removeItem = (item) => {
    setItemsToSale((prev) => {
      return prev
        .map((i) => {
          if (i.id === item.id) {
            const newCant = i.cant - 1;
            return newCant > 0 ? { ...i, cant: newCant } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const handlePaymentSubmit = async () => {
    try {
      const totals = calculateTotals();

      if (
        paymentMethod === "cash" &&
        parseFloat(receivedAmount) < totals.total
      ) {
        throw new Error("Monto recibido insuficiente");
      }
      if (paymentMethod === "card" && cardDigits.length !== 4) {
        setCardDigitsTouched(true);
        throw new Error("Debe ingresar los 4 dígitos de la tarjeta");
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const payload = {
        total: totals.total,
        subtotal: totals.subtotal, 
      discount: totals.discount, 
      client_timezone: timeZone,
      client_local_time: new Date().toISOString(),
        payment_method: paymentMethod === "cash" ? "efectivo" : "card",
        items: itemsToSale.map((item) => ({
          id: item.id,
          cant: parseFloat(item.cant),
          sellingPrice: parseFloat(item.sellingPrice),
          name: item.name,
        })),
      };

      if (paymentMethod === "cash") {
        payload.received_amount = parseFloat(receivedAmount);
      } else {
        payload.card_last_four = cardDigits;
      }

      await router.post(route("sales.finalize", saleId), payload);

      localStorage.removeItem("pendingSale");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReturnToSelection = () => {
    localStorage.setItem(
      "pendingSale",
      JSON.stringify({
        saleId,
        items: itemsToSale,
        total: total,
      })
    );
    router.visit(route("sales.list"));
  };

  // Funciones para creación de artículo
  const handleCreateArticle = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    post(route("inventory.storage"), {
      data: formData,
      onFinish: () => {
        toggleCreateArticle();
        reset();
      },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setData("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCreateArticle = () => {
    setShowCreateArticle(!showCreateArticle);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Componente de pago
  const PaymentSection = ({ isArticleModalOpen }) => { // <-- Recibe el prop
    const cashInputRef = useRef(null);
  
    useEffect(() => {
      if (isArticleModalOpen) return; // <-- Evita el foco si el modal está abierto
  
      if (paymentMethod === "cash" && cashInputRef.current) {
        cashInputRef.current.focus();
      }
      if (paymentMethod === "card" && cardInputRef.current) {
        cardInputRef.current.focus();
      }
    }, [paymentMethod, isArticleModalOpen]); // <-- Agrega la dependencia
  
    return (
      <div className="space-y-6 mt-4">
        <div className="flex">
          <Button
            onClick={() => setPaymentMethod("cash")}
            className={`flex-1 py-3 ${
              paymentMethod === "cash" ? "tab" : "primary-tab"
            }`}
          >
            Efectivo
          </Button>
          <Button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 py-3 ${
              paymentMethod === "card" ? "tab" : "primary-tab"
            }`}
          >
            Tarjeta
          </Button>
        </div>

        {paymentMethod === "cash" && (
          <div className="space-y-4 px-4">
            <TextInput
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              placeholder="Monto recibido"
              className="w-full bg-fondo text-white"
              ref={cashInputRef}
              step="0.01"
            />
            <div className="flex justify-between text-sm text-gray-300">
              <span>Cambio:</span>
              <span>
                $
                {Math.max(receivedAmount - calculateTotals().total, 0).toFixed(
                  2
                )}
              </span>
            </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="space-y-4 px-4">
            <TextInput
              value={cardDigits}
              onChange={(e) => {
                setCardDigits(e.target.value.replace(/\D/g, "").slice(0, 4));
                setCardDigitsTouched(true);
              }}
              placeholder="Últimos 4 dígitos"
              className="w-full bg-fondo text-white"
              maxLength={4}
              ref={cardInputRef}
              onBlur={() => setCardDigitsTouched(true)}
            />
            {cardDigitsTouched && cardDigits.length < 4 && (
              <div className="text-red-400 text-sm">
                * Se requieren los 4 últimos dígitos de la tarjeta
              </div>
            )}
          </div>
        )}

        <div className="w-full flex justify-center mb-8">
          <Button onClick={handlePaymentSubmit} className="btn mb-8">
            Finalizar venta
          </Button>
        </div>
        {/* <div className="w-full flex justify-center">
        <Button
            onClick={() => setShowPaymentSection(false)}
            className="text-lg btn-outline-danger"
          >
            Cancelar
          </Button>    
        </div> */}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="hidden md:display top-0 left-0 z-40 w-48">
          <div className="px-4 overflow-y-auto flex flex-col space-y-6 sm:items-center">
            <Logo className="h-11 fill-white" />
          </div>
        </div>

        <div className="flex items-center justify-between w-full mx-0 my-8 md:m-8">
          <div className="flex items-center gap-2 ml-8">
            <Button
              onClick={() => setShowModal(true)}
              // onClick={handleReturnToSelection}
              className=" p-1 rounded-full"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </Button>
            <h1 className="text-3xl poppins-bold text-white">Venta</h1>
          </div>

          <div className="mr-8 md:m-0 w-full flex justify-end">
            <Button
              onClick={toggleCreateArticle}
              className="text-lg md:text-1xl primary-btn md:btn shadow-md rounded-full flex gap-2"
            >
              Crear artículo
              <PlusCircleIcon className="w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Creación de Artículo */}
      <div
        className={`fixed p-8 right-0 top-0 h-full w-96 bg-fondo-claro p-0 md:p-6 duration-300 ease-in-out ${
          showCreateArticle ? "translate-x-0" : "translate-x-full"
        } z-50 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl text-white">Nuevo Artículo</h3>
          <button
            onClick={toggleCreateArticle}
            className="text-gray-400 hover:text-white text-3xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleCreateArticle} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <InputLabel value="Nombre" />
              <TextInput
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full mt-1"
                required
              />
              <InputError message={errors.name} />
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
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <InputError message={errors.category} className="mt-2" />
            </div>

            <div>
              <InputLabel value="Descripción" />
              <TextInput
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.description} />
            </div>

            <div>
              <InputLabel value="Código de barras" />
              <TextInput
                value={data.barCode}
                onChange={(e) => setData("barCode", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.barCode} />
            </div>

            <div>
              <InputLabel value="SKU" />
              <TextInput
                value={data.sku}
                onChange={(e) => setData("sku", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.sku} />
            </div>

            <div>
              <InputLabel value="Unidad de venta" />
              <TextInput
                value={data.salesUnit}
                onChange={(e) => setData("salesUnit", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.salesUnit} />
            </div>

            <div>
              <InputLabel value="Existencias" />
              <TextInput
                type="number"
                value={data.stocks}
                onChange={(e) => setData("stocks", e.target.value)}
                className="w-full mt-1"
                required
              />
              <InputError message={errors.stocks} />
            </div>

            <div>
              <InputLabel value="Precio de compra" />
              <TextInput
                type="number"
                step="0.01"
                value={data.purchasePrice}
                onChange={(e) => setData("purchasePrice", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.purchasePrice} />
            </div>

            <div>
              <InputLabel value="Precio de venta" />
              <TextInput
                type="number"
                step="0.01"
                value={data.sellingPrice}
                onChange={(e) => setData("sellingPrice", e.target.value)}
                className="w-full mt-1"
                required
              />
              <InputError message={errors.sellingPrice} />
            </div>

            <div>
              <InputLabel value="Imagen" />
              <input
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="w-full mt-1 text-white"
                accept="image/*"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded"
                />
              )}
              <InputError message={errors.image} />
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showInStore}
                  onChange={(e) => setData("showInStore", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">
                  Mostrar en tienda
                </span>
              </label>
            </div>

            <PrimaryButton
              type="submit"
              className=" btn w-full justify-center md:justify-between mt-4"
              disabled={processing}
            >
              Crear Artículo
            </PrimaryButton>
          </div>
        </form>
      </div>

      <div className="block md:flex h-screen bg-gray-900">
        {/* Sección de Productos */}
        <div className="md:w-3/4 p-0 md:p-6 overflow-y-auto">
          <div className="m-4 mx:m-0 mb-6 relative">
            <MagnifyingGlassIcon className="w-6 h-6 absolute left-3 top-3 text-gray-400" />
            <TextInput
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Buscar productos..."
              className="pl-12 w-full bg-fondo text-white rounded-3xl py-3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-fondo p-4 rounded-0 md:rounded-3xl"
              >
                <img
                  src={`../../${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) =>
                    (e.target.src =
                      "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg")
                  }
                />
                <div className="text-center">      
                  <h3 className="poppins-bold text-left white text-xl">
                    {item.name}
                  </h3>
                  
                  <div className="w-full flex items-center justify-between">
                    <h3 className="poppins-bold gray text-center text-md">
                      ${item.sellingPrice}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-400 text-left">
                    {item.description}
                  </p>

                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => removeItem(item)}
                        className="p-1 bg-fondo rounded-full"
                      >
                        <MinusCircleIcon className="h-10 w-10 text-red-400" />
                      </Button>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={
                          itemsToSale.find((i) => i.id === item.id)?.cant ?? ""
                        }
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          if (value === 0) {
                            setItemsToSale((prev) =>
                              prev.filter((i) => i.id !== item.id)
                            );
                          } else {
                            setItemsToSale((prev) => {
                              const existing = prev.find(
                                (i) => i.id === item.id
                              );
                              if (existing) {
                                return prev.map((i) =>
                                  i.id === item.id ? { ...i, cant: value } : i
                                );
                              }
                              return [...prev, { ...item, cant: value }];
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                            const current =
                              itemsToSale.find((i) => i.id === item.id)?.cant ||
                              0;
                            const newValue =
                              e.key === "ArrowUp"
                                ? current + 0.1
                                : current - 0.1;

                            if (newValue <= 0) {
                              setItemsToSale((prev) =>
                                prev.filter((i) => i.id !== item.id)
                              );
                            } else {
                              addItem(item, newValue - (current || 0));
                            }
                          }
                        }}
                        className="w-full bg-fondo text-white text-center rounded py-1"
                        onFocus={(e) => {
                          if (e.target.value === "" || e.target.value === "0") {
                            e.target.select();
                          }
                        }}
                        placeholder="0"
                      />
                      <Button
                        onClick={() => addItem(item)}
                        className="p-1 bg-fondo rounded-full"
                      >
                        <PlusCircleIcon className="h-10 w-10 primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección del Carrito */}
        <div className="fixed md:relative bg-black bottom-0 w-full md:w-1/4 border-l border-gray-900">
          <div className="sticky top-6">
            <div className="flex gap-4 md:justify-between items-center w-full px-6 py-3">
              <h2 className="text-lg md:text-2xl text-white">Carrito</h2>
              <div className="flex justify-between w-full">
                <Button onClick={() => setShowPaymentSection(false)}>
                  <TrashIcon className="h-5 w-5 btn-outline-danger hover:danger-btn" />
                </Button>
                <Button
                  className="relative md:hidden"
                  onClick={() => setShowCart(!showCart)}
                >
                  <ChevronDownIcon className="h-5 w-5 primary-link" />
                </Button>
              </div>
            </div>
            {showCart && (
              <div className="space-y-4 max-h-[20vh] md:max-h-[40vh] overflow-y-auto mb-8 pb-8 px-6">
                {itemsToSale.map((item) => (
                  <div
                    key={item.id}
                    className="bg-fondo p-2 md:p-4 rounded-3xl relative"
                  >
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => removeProductFromCart(item.id)}
                        className="absolute left-2 p-1 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5 btn-outline-danger hover:danger-btn" />
                      </Button>

                      <div className="pl-8">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {item.cant} × ${item.sellingPrice}
                        </p>
                      </div>
                      <span className="text-green-400">
                        ${(item.cant * item.sellingPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="pt-4 border-t border-gray-600">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-300 px-6">
                    <span>Subtotal:</span>
                    <span>${calculateTotals().subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300 px-6">
                    <span>IVA ({IVA_PERCENTAGE}% sobre subtotal):</span>
                    <span>${calculateTotals().iva.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300 px-6">
                    <div className="flex items-center gap-2">
                      <span>Descuento:</span>
                      <TextInput
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), 100);
                          setDiscountPercentage(value);
                        }}

                        onKeyDown={(e) => {
                          // Bloquea las teclas de flecha arriba/abajo
                          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                          }
                        }}
                        
                        className="w-20 bg-fondo text-white px-2 py-1 rounded"
                        placeholder="%"
                        min="0"
                        max="100"
                      />
                    </div>
                    <span>-${calculateTotals().discount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="block text-center bg-fondo primary font-bold">
                  <div className="flex justify-between items-center w-full p-4 md:block">
                    <p>Total:</p>
                    <h1 className="text-2xl md:text-3xl">
                      ${calculateTotals().total.toFixed(2)}
                    </h1>
                    <PlusCircleIcon className="display md:hidden h-8 w-8 btn-outline" />
                  </div>

                  {!showPaymentSection ? (
  <div className="space-y-4">
    <Button
      onClick={() => setShowPaymentSection(true)}
      className={`w-full text-2xl btn ${
        itemsToSale.length === 0
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      disabled={itemsToSale.length === 0}
    >
      PAGAR
    </Button>
  </div>
) : (
  <PaymentSection isArticleModalOpen={showCreateArticle} /> // <- Aquí el cambio
)}
                </div>
              </div>

              {/* <Button
                onClick={() => setShowModal(true)}
                className="w-full danger-btn mt-4"
              >
                Cancelar Venta
              </Button> */}
            </div>
          </div>
        </div>

        {/* Modal de Confirmación */}
        {showModal && (
          <div className="fixed inset-0 bg-black5 flex items-center justify-center z-50">
            <div className="mx-2 md:m-0 bg-modal p-6 rounded-3xl w-120">
              <h3 className="text-2xl poppins-semibold text-center text-white mb-4">
                Se perderá el carrito armado
              </h3>
              <p className="text-md text-center gray mb-4">
                Al cancelar la compra limpiaremos el carrito. (Esta acción no se
                puede revertir.)
              </p>
              <div className="flex justify-between items-center w-full gap-8">
                <Button
                  onClick={() => setShowModal(false)}
                  className="primary text-xl"
                >
                  Continuar venta
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await router.delete(route("sales.delete", saleId));
                      localStorage.removeItem("pendingSale");
                      setItemsToSale([]);
                      setShowModal(false);
                    } catch (error) {
                      alert("Error al cancelar la venta: " + error.message);
                    }
                  }}
                  className="flex-1 danger-btn text-xl p-2"
                >
                  Cancelar venta
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
