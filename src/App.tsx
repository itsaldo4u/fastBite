import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { ProductProvider } from "./components/context/ProductContext";
import { UsersProvider } from "./components/context/UsersContext";
import { OrdersProvider } from "./components/context/OrdersContext";
import { OffersProvider } from "./components/context/OffersContext";

import HomePage from "./components/Pages/HomePage";
import MenuPage from "./components/Pages/MenuPage";
import OffersPage from "./components/Pages/OffersPage";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import AdminDashboard from "./components/Pages/admin/AdminDashboard";
import UserDashboard from "./components/Pages/user/UserDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactPage from "./components/Pages/ContactPage";
import OrderTracking from "./components/Pages/OrderTracking";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <UsersProvider>
          <OrdersProvider>
            <OffersProvider>
              <Router>
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/track-order" element={<OrderTracking />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </OffersProvider>
          </OrdersProvider>
        </UsersProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
