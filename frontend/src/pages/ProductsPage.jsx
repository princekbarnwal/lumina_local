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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-sm text-slate-500">View products and copy customer review links.</p>
        </div>
        <Link
          to="/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <label className="block max-w-sm">
          <span className="mb-1 block text-sm font-medium text-slate-700">Shop</span>
          <select
            value={shopId}
            onChange={(event) => setShopId(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
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

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="grid grid-cols-[80px_1fr_190px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
          <span>ID</span>
          <span>Name</span>
          <span>QR Review Link</span>
        </div>
        {products.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[80px_1fr_190px] items-center border-b border-slate-100 px-4 py-3 text-sm last:border-0"
            >
              <span>{product.id}</span>
              <span className="font-medium">{product.name}</span>
              <button
                type="button"
                onClick={() => copyQrLink(product.id)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
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
