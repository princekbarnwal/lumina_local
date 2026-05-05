import { Route, Routes } from "react-router-dom";
import BusinessLayout from "./components/BusinessLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import AddProductPage from "./pages/AddProductPage.jsx";
import CustomerReviewPage from "./pages/CustomerReviewPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/qr/:productId" element={<CustomerReviewPage />} />
      <Route path="/review/product/:productId" element={<CustomerReviewPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BusinessLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
