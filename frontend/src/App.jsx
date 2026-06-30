import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./components/auth/AuthLayout";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/static/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ClientsPage from "./pages/ClientsPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import CreateNotePage from "./pages/CreateNotePage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditNotePage from "./pages/EditNotePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import NotesPage from "./pages/NotesPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route element={<GuestRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="notes/new" element={<CreateNotePage />} />
            <Route path="notes/:id" element={<NoteDetailPage />} />
            <Route path="notes/:id/edit" element={<EditNotePage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/new" element={<CreateCategoryPage />} />
              <Route path="categories/:id" element={<CategoryDetailPage />} />
              <Route path="categories/:id/edit" element={<EditCategoryPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
