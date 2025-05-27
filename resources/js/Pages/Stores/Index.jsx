import { useEffect } from "react"
import {
  ListBulletIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline/index.js"
import StoresLayaout from "@/Layouts/StoresLayaout.jsx"

export default function SalesList({ auth, store, items, categories }) {
  useEffect(() => {
    console.log("hola")
  }, [])

  return (
    <StoresLayaout user={auth.user} title={`Tienda ${store.name.replace(/_/g, " ")}`} image={store.logoImage}>
      {/* Hero Banner */}
      
      <div className="relative w-full h-80 overflow-hidden rounded-lg mb-8">
      
        <img
          // src={`../${store?.coverImage}`}
          src={`../assets/img/negocio/cover-negocio.png`}
          alt="Banner de la tienda"
          className="w-full h-full object-cover"
        />
        <div className="inset-0 bg-gradient-to-r from-black-500/90 to-black-500/0 flex flex-col justify-center px-12">         
          <p className="text-2xl text-white max-w-2xl">
            {store.description || "Productos de la más alta calidad para ti"}
          </p>
          <div className="mt-6">
            <button className="bg-primary black px-6 py-3 rounded-full font-medium transition-colors">
              Ver catálogo completo
            </button>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="block md:flex justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="poppins-bold white text-start text-3xl">{store.name.replace(/_/g, " ")}</h2>
            <p className="text-gray-600 mt-2">{store.description}</p>
            <p className="text-gray-600 flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {store.phone}
            </p>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary black rounded-lg transition-colors">
              <PlusCircleIcon className="h-5 w-5" />
              Nuevo Producto
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg primary-link transition-colors">
              <ListBulletIcon className="h-5 w-5" />
              Ver Lista
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold primary-text mb-8">CATEGORÍAS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories &&
              categories.map((category, index) => (
                <div
                  key={index}
                  className=" bg-fondo p-4 rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={category.image || "/placeholder.svg?height=200&width=400"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-center primary-text mb-2">{category.name}</h3>
                    <p className="text-center text-gray-500">{category.items?.length || 0} productos</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-3xl font-bold primary-text mb-8">PRODUCTOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-fondo p-4 rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-100">
                  {item.image ? (
                    <img src={`../${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-3xl font-semibold text-white text-left mb-1">$ {item.sellingPrice}</h3>
                  <h3 className="text-lg font-semibold text-white text-left mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category?.name || "Sin categoría"}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>SKU: {item.sku}</span>
                    <span>Código: {item.barCode}</span>
                  </div>
                  {/* <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-500 hover:primary-text">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button className="flex items-center gap-1 bg-primary black px-3 py-1 rounded-full text-sm">
                      <ShoppingCartIcon className="h-4 w-4" />
                      Agregar
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="bg-fondo rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold primary-text mb-8">MARCAS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((brand) => (
              <div key={brand} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=80&width=160&text=MARCA ${brand}`}
                  alt={`Marca ${brand}`}
                  className="max-h-16"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </StoresLayaout>
  )
}