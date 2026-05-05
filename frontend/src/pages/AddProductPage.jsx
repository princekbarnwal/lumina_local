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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Setup</p>
        <h2 className="page-title">Product & Shop Management</h2>
        <p className="page-subtitle">Create shops, add products, and prepare QR feedback campaigns.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="elite-card p-5">
          <h3 className="text-lg font-bold">Add Product</h3>
          <p className="mt-1 text-sm text-slate-500">Create a product under one of your shops.</p>

          <form onSubmit={createProduct} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-slate-700">Shop</span>
              <select
                value={shopId}
                onChange={(event) => setShopId(event.target.value)}
                className="field"
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
              className="field"
              required
            />
            <button type="submit" className="primary-action w-full">
              Add Product
            </button>
          </form>
        </section>

        <section className="elite-card p-5">
          <h3 className="text-lg font-bold">Create Shop</h3>
          <p className="mt-1 text-sm text-slate-500">Use this if your account has no shop yet.</p>

          <form onSubmit={createShop} className="mt-5 space-y-4">
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              placeholder="Shop name"
              className="field"
              required
            />
            <button type="submit" className="secondary-action w-full">
              Create Shop
            </button>
          </form>
        </section>
      </div>

      <div>
        {message ? <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div> : null}
        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      </div>
    </div>
  );
}

export default AddProductPage;
