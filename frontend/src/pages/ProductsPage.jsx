import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Copy, Plus } from "lucide-react";
import { api } from "../services/api.js";

function ProductsPage() {
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getShops()
      .then((data) => {
        setShops(data);
        if (data[0]) {
          setShopId(String(data[0].id));
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!shopId) {
      setProducts([]);
      return;
    }

    api.getShopProducts(shopId).then(setProducts).catch((err) => setError(err.message));
  }, [shopId]);

  const copyQrLink = async (productId) => {
    const link = `${window.location.origin}/qr/${productId}`;
    await navigator.clipboard.writeText(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Catalog</p>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">Manage products and copy customer QR review links.</p>
        </div>
        <Link to="/products/add" className="primary-action">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <section className="glass-panel p-4">
        <label className="block max-w-sm">
          <span className="mb-1 block text-sm font-bold text-slate-700">Shop</span>
          <select
            value={shopId}
            onChange={(event) => setShopId(event.target.value)}
            className="field"
          >
            <option value="">Select shop</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="glass-panel overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_190px] border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-bold text-slate-600">
          <span>ID</span>
          <span>Name</span>
          <span>QR Review Link</span>
        </div>
        {products.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[80px_1fr_190px] items-center border-b border-slate-100 px-4 py-3 text-sm transition hover:bg-indigo-50/50 last:border-0"
            >
              <span>{product.id}</span>
              <span className="font-medium">{product.name}</span>
              <button
                type="button"
                onClick={() => copyQrLink(product.id)}
                className="secondary-action px-3"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </button>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-slate-500">No products found.</p>
        )}
      </section>
    </div>
  );
}

export default ProductsPage;
