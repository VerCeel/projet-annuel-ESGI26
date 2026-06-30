import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./components/auth/AuthLayout";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/static/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import CommandsPage from "./pages/CommandsPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditPostPage from "./pages/EditPostPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";
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
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<CreatePostPage />} />
            <Route path="posts/:id" element={<PostDetailPage />} />
            <Route path="posts/:id/edit" element={<EditPostPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/new" element={<CreateCategoryPage />} />
              <Route path="categories/:id" element={<CategoryDetailPage />} />
              <Route path="categories/:id/edit" element={<EditCategoryPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="commands" element={<CommandsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
