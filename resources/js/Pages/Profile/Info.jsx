import { useForm } from "@inertiajs/react";

export default function Info() {
  const { data, setData, post, processing, errors, reset } = useForm({
    companyName: "",
    category: "",
    description: "",
    contactNumber: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post(route("profile.registerinfo"));
  };

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row justify-center items-center">
      {/* Formulario */}
      <div className="px-8 w-full w-2/3 m-auto md:w-1/2 max-w-lg">
        <section>
          <div>
            <h1 className="text-3xl font-bold mb-4">Plan Patrón</h1>
            <p className="mb-6 leading-5">
              Presenta tu negocio para crear tu tienda y personalizar la
              experiencia de tus clientes y colaboradores.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block gray text-sm font-medium mb-1"
              >
                Empresa
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={data.companyName}
                onChange={(e) => setData("companyName", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block gray text-sm font-medium mb-1"
              >
                Categoría / giro de negocio / Qué vendes
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={data.category}
                onChange={(e) => setData("category", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block gray text-sm font-medium mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block gray text-sm font-medium mb-1"
              >
                Teléfono de contacto de tu tienda
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={data.contactNumber}
                onChange={(e) => setData("contactNumber", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-primary black text-center text-xl rounded-full m-auto py-3 font-bold transition"
              >
                Comenzar a vender
              </button>
            </div>
          </form>
        </section>
      </div>
      <section>{/* Imagen */}</section>
      <div className="md:w-1/3 flex object-cover max-w-full min-h-screen justify-between mt-0">
        <img
          src="/assets/img-info.png"
          alt="Welcome"
          className="max-w-full object-cover shadow-lg min-h-screen"
        />
      </div>
    </div>
  );
}
