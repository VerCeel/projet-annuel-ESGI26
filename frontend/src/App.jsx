import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/static/Layout";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditPostPage from "./pages/EditPostPage";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";
import ProductsPage from "./pages/ProductsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<CreatePostPage />} />
          <Route path="posts/:id" element={<PostDetailPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<CreateCategoryPage />} />
          <Route path="categories/:id" element={<CategoryDetailPage />} />
          <Route path="categories/:id/edit" element={<EditCategoryPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
