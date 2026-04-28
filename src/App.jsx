import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import LibrariesPage from "./pages/LibrariesPage";
import ConstructorPage from "./pages/ConstructorPage";
import DeliveryPage from "./pages/DeliveryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/libraries" element={<LibrariesPage />} />
          <Route path="/constructor" element={<ConstructorPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
