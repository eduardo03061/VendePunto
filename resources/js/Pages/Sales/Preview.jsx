import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function PreviewSale({ auth, roles, items = [], sale, total }) {
  const [typeMethod, setTypeMethod] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [change, setChange] = useState(0);
  const cardInputRef = useRef(null);

  // Calcular cambio automáticamente cuando cambia el monto recibido
  useEffect(() => {
    const calculatedChange = parseFloat(receivedAmount) - total;
    setChange(calculatedChange > 0 ? calculatedChange : 0);
  }, [receivedAmount, total]);

  useEffect(() => {
    if (items.length === 0) {
      const savedSale = localStorage.getItem("pendingSale");
      if (savedSale) {
        const saleData = JSON.parse(savedSale);
        // Asegurar que los valores son floats
        const parsedItems = saleData.items.map((item) => ({
          ...item,
          cant: parseFloat(item.cant),
        }));
        setItems(parsedItems);
        setTotal(saleData.total);
      }
    }
  }, [items]);

  const handleReturn = () => {
    localStorage.setItem(
      "pendingSale",
      JSON.stringify({
        saleId: sale.id,
        items: items.map((item) => ({
          ...item,
          cant: parseFloat(item.cant), // Forzar decimales
        })),
        total: total,
      })
    );
    router.visit(route("sales.edit", sale.id));
  };

  const submit = async (e) => {
    e?.preventDefault();

    try {
      let cardLastFour = null;
 
      // Si es pago con tarjeta, obtenemos el valor directamente del input
      if (typeMethod === "card") {
        cardLastFour = cardInputRef.current?.value;

        if (!cardLastFour || cardLastFour.length !== 4) {
          throw new Error("Debe ingresar los 4 últimos dígitos de la tarjeta");
        }
      }
      await router.post(route("sales.finalize", sale.id), {
        total: total,
        payment_method: typeMethod,
        received_amount:
          typeMethod === "efectivo" ? parseFloat(receivedAmount) : null,
        card_last_four: cardLastFour,
      });

      localStorage.removeItem("pendingSale");
      //router.visit(route("sales.list"));
    } catch (error) {
      alert(error.message);
    }
  };

  const closeSale = () => {
    setShowModal(true); // Mostrar modal
  };

  const cancelSale = () => {
    if (confirm("¿Estás seguro de eliminar completamente esta venta?")) {
      router.delete(route("sales.delete", sale.id), {
        onSuccess: () => {
          localStorage.removeItem("pendingSale");
          router.visit(route("sales.list"));
        },
      });
    }
  };

  return (
    <AuthenticatedLayout user={auth.user} title={"Pagar"} roles={roles}>
      <section className="flex">
        <div className="w-full">
          <div className="mx-auto">
            <div className="py-3">
              <form className="flex gap-8" onSubmit={submit} method="POST">
                <section className="w-full flex">
                  <div className="w-3/4">
                    <section className="shadow-md rounded-lg p-8 bg-gray-900">
                      <div className="md:flex block gap-8">
                        <div className="w-full">
                          <div className="flex justify-between">
                            <div className="relative flex">Subtotal</div>
                            <div className="text-3xl bold primary">
                              ${total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="shadow-md rounded-lg p-8 bg-gray-900">
                      <div className="text-xl">
                        <h3>Carrito ({items.length})</h3>
                        <table className="min-w-full table table-striped table-hover table-bordered">
                          <tbody className="">
                            {items?.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 text-md font-medium text-gray-500 flex"></td>
                                <td className="px-6 py-4 text-md font-medium text-gray-500">
                                  {parseFloat(item.cant).toFixed(1)}{" "}
                                </td>
                                <td className="px-6 py-4 text-md font-medium text-gray-500">
                                  $
                                  {(
                                    parseFloat(item.cant) * item.sellingPrice
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <button
                          type="button" // Esencial agregar type button
                          className="text-2xl w-full primary-btn shadow-md rounded-full my-6"
                          onClick={handleReturn} // Usar función directa
                        >
                          Volver a selección
                        </button>
                        <button
                          type="button"
                          className="text-2xl w-full primary-btn danger shadow-md rounded-full my-6"
                          onClick={closeSale}
                        >
                          Cerrar venta
                        </button>
                      </div>
                    </section>
                  </div>
                  <section className="w-1/2">
                    {typeMethod === "" ? (
                      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="shadow-md rounded-lg p-8 bg-gray-900">
                          <button
                            onClick={() => setTypeMethod("efectivo")}
                            className="text-2xl w-full primary-btn shadow-md rounded-full my-6"
                          >
                            Efectivo
                          </button>
                          <button
                            onClick={() => setTypeMethod("card")}
                            className="text-2xl w-full primary-btn shadow-md rounded-full my-6"
                          >
                            Terminal Bancaria
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {typeMethod === "efectivo" ? (
                      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="shadow-md rounded-lg p-8 bg-gray-900">
                          <div className="flex">
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
                            <h3 className="text-2xl bold">Pago en Efectivo</h3>
                          </div>

                          <div>
                            <div className="pt-6">
                              <label className="block text-base font-medium text-gray-500">
                                Cantidad recibida
                              </label>
                              <input
                                type="number"
                                value={receivedAmount}
                                onChange={(e) =>
                                  setReceivedAmount(e.target.value)
                                }
                                className="p-3 bold border-gray-800 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm mt-1 block w-full input-primary text-2xl pl-3"
                                placeholder="$"
                                min="0"
                                step="1"
                              />
                            </div>

                            <div className="flex items-center justify-between primary pt-6">
                              <h5 className="block text-base font-medium">
                                Cambio a devolver:
                              </h5>
                              <h5 className="text-2xl">${change.toFixed(2)}</h5>
                            </div>

                            <button
                              type="submit"
                              className="text-2xl w-full btn shadow-md rounded-full my-6"
                              disabled={!typeMethod || receivedAmount < total}
                            >
                              Finalizar venta
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {typeMethod === "card" && (
                      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="shadow-md rounded-lg p-8 bg-gray-900">
                          <input
                            type="text" // Cambiar de number a text
                            ref={cardInputRef}
                            placeholder="****"
                            className="p-3 bold border-gray-800 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm mt-1 block w-full input-primary text-2xl pl-3"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="[0-9]{4}"
                            onChange={(e) => {
                              // Forzar solo números y máximo 4 dígitos
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              e.target.value = value;
                            }}
                          />

                          <button
                            onClick={submit}
                            className="text-2xl w-full btn shadow-md rounded-full my-6"
                          >
                            Finalizar venta
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </section>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-fondo rounded-lg p-6 w-1/3">
            <h2 className="text-2xl text-center font-bold mb-4">
              Confirmar cierre de venta
            </h2>
            <p className="mb-6 text-center">
              ¿Estás seguro de que deseas cerrar la venta?
            </p>
            <div className="flex justify-between gap-4">
              <button
                className="px-4 py-2 primary-btn text-white w-1/2"
                onClick={() => setShowModal(false)}
              >
                Regresar a la venta
              </button>
              <button
                className="px-4 py-2 danger-btn text-white rounded-md  w-1/2"
                onClick={cancelSale}
              >
                Cerrar venta
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
