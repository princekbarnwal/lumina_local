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
    <section className="glass-panel p-4">
      <div className={`grid gap-4 ${typeof manualShopId === "undefined" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-700">Shop</span>
          <select
            value={selectedShopId}
            onChange={(event) => onShopChange(event.target.value)}
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

        {typeof manualShopId === "undefined" ? null : (
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">Manual shop ID</span>
            <input
              value={manualShopId}
              onChange={(event) => onManualShopIdChange(event.target.value)}
              placeholder="Example: 1"
              className="field"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-700">Product</span>
          <select
            value={selectedProductId}
            onChange={(event) => onProductChange(event.target.value)}
            className="field"
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
