import { useEffect, useState } from "react";
import { api } from "../services/api.js";

function AddProductPage() {
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadShops = () => {
    api
      .getShops()
      .then((data) => {
        setShops(data);
        if (!shopId && data[0]) {
          setShopId(String(data[0].id));
        }
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadShops();
  }, []);

  const createShop = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const shop = await api.createShop({ name: shopName });
      setShopName("");
      setMessage("Shop created.");
      setShopId(String(shop.id));
      loadShops();
    } catch (err) {
      setError(err.message);
    }
  };

  const createProduct = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.createProduct({
        name: productName,
        shopId: Number(shopId),
      });
      setProductName("");
      setMessage("Product added.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Add Product</h2>
        <p className="mt-1 text-sm text-slate-500">Create a product under one of your shops.</p>

        <form onSubmit={createProduct} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Shop</span>
            <select
              value={shopId}
              onChange={(event) => setShopId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              required
            >
              <option value="">Select shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </label>
          <input
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="Product name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Product
          </button>
        </form>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Create Shop</h2>
        <p className="mt-1 text-sm text-slate-500">Use this if your account has no shop yet.</p>

        <form onSubmit={createShop} className="mt-5 space-y-4">
          <input
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            placeholder="Shop name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200"
          >
            Create Shop
          </button>
        </form>
      </section>

      <div className="lg:col-span-2">
        {message ? <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div> : null}
        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      </div>
    </div>
  );
}

export default AddProductPage;
