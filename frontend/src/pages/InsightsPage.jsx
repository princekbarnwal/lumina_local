import { useEffect, useState } from "react";
import InsightList from "../components/InsightList.jsx";
import ShopProductSelector from "../components/ShopProductSelector.jsx";
import { api } from "../services/api.js";

function InsightsPage() {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getShops()
      .then((data) => {
        setShops(data);
        if (data[0]) {
          setSelectedShopId(String(data[0].id));
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedShopId) {
      setProducts([]);
      return;
    }

    api
      .getShopProducts(selectedShopId)
      .then((data) => {
        setProducts(data);
        setSelectedProductId("");
      })
      .catch((err) => setError(err.message));
  }, [selectedShopId]);

  useEffect(() => {
    if (!selectedProductId) {
      setReport(null);
      return;
    }

    api
      .getProductReport(selectedProductId)
      .then((data) => setReport(data.report))
      .catch((err) => setError(err.message));
  }, [selectedProductId]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Insights</h2>
        <p className="text-sm text-slate-500">AI-generated positives, negatives, and actions.</p>
      </div>

      <ShopProductSelector
        shops={shops}
        products={products}
        selectedShopId={selectedShopId}
        selectedProductId={selectedProductId}
        onShopChange={setSelectedShopId}
        onProductChange={setSelectedProductId}
      />

      {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <InsightList title="Positives" items={report?.positives} tone="green" />
        <InsightList title="Negatives" items={report?.negatives} tone="red" />
        <InsightList title="Suggestions" items={report?.suggestions} tone="blue" />
      </div>
    </div>
  );
}

export default InsightsPage;
