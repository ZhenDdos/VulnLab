import { createBrowserRouter } from "react-router";
import Catalog from "./Catalog";
import Auth from "./Auth";
import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/layouts";
import Cart from "./Cart";
import Checkout from "./Checkout/Checkout";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <Auth />,
        path: "/auth",
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Catalog /> },
          { path: "/cart", element: <Cart /> },
          { path: "/checkout", element: <Checkout /> },
        ],
      },
    ],
  },
]);
