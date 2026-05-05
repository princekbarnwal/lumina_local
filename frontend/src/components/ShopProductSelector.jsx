function ShopProductSelector({
  shops,
  products,
  selectedShopId,
  selectedProductId,
  manualShopId,
  onManualShopIdChange,
  onShopChange,
  onProductChange,
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className={`grid gap-4 ${typeof manualShopId === "undefined" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Shop</span>
          <select
            value={selectedShopId}
            onChange={(event) => onShopChange(event.target.value)}
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

        {typeof manualShopId === "undefined" ? null : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Manual shop ID</span>
            <input
              value={manualShopId}
              onChange={(event) => onManualShopIdChange(event.target.value)}
              placeholder="Example: 1"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Product</span>
          <select
            value={selectedProductId}
            onChange={(event) => onProductChange(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default ShopProductSelector;
