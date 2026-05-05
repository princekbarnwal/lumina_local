import { useEffect, useMemo, useState } from "react";
import AlertList from "../components/AlertList.jsx";
import RatingDistribution from "../components/RatingDistribution.jsx";
import ReportCard from "../components/ReportCard.jsx";
import SentimentPie from "../components/SentimentPie.jsx";
import ShopProductSelector from "../components/ShopProductSelector.jsx";
import StatCard from "../components/StatCard.jsx";
import { api } from "../services/api.js";

function DashboardPage() {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setAnalytics(null);
      setSentiment(null);
      setReport(null);
      setTrends(null);
      return;
    }

    setLoading(true);
    setError("");

    Promise.all([
      api.getProductAnalytics(selectedProductId),
      api.getProductSentiment(selectedProductId),
      api.getProductReport(selectedProductId),
      api.getProductTrends(selectedProductId),
    ])
      .then(([analyticsData, sentimentData, reportData, trendData]) => {
        setAnalytics(analyticsData);
        setSentiment(sentimentData);
        setReport(reportData.report);
        setTrends(trendData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedProductId]);

  const selectedProductName = useMemo(() => {
    return products.find((product) => String(product.id) === String(selectedProductId))?.name;
  }, [products, selectedProductId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Command Center</p>
          <h2 className="page-title">Business Dashboard</h2>
          <p className="page-subtitle">Select a shop and product to view live analytics, trends, and AI recommendations.</p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
          Live product intelligence
        </div>
      </div>

      <ShopProductSelector
        shops={shops}
        products={products}
        selectedShopId={selectedShopId}
        selectedProductId={selectedProductId}
        onShopChange={setSelectedShopId}
        onProductChange={setSelectedProductId}
      />

      {error ? <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div> : null}
      {loading ? <div className="glass-panel animate-pulse p-4 text-sm text-slate-500">Loading dashboard...</div> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Product" value={selectedProductName || "None"} subtext="Current selection" />
        <StatCard label="Average Rating" value={analytics?.averageRating ?? "-"} subtext="Weighted" />
        <StatCard label="Total Reviews" value={analytics?.totalReviews ?? "-"} />
        <StatCard label="Rating Change" value={trends ? `${trends.ratingChange}%` : "-"} subtext="7 days" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SentimentPie sentiment={sentiment} />
        <RatingDistribution distribution={analytics?.ratingDistribution} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AlertList alerts={trends?.alerts} />
        <ReportCard report={report} />
      </div>
    </div>
  );
}

export default DashboardPage;
