import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./home/Home.jsx";
import Signup from "./components/auth/signup/Signup.jsx";
import Login from "./components/auth/login/Login.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import mainStore from "./store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import PostContextProvider from "./context/PostContext.jsx";
import { Toaster } from "sonner";

const pagesRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
]);

let persistor = persistStore(mainStore);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={mainStore}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthContextProvider>
          <PostContextProvider>
            <RouterProvider router={pagesRoutes} />
            <Toaster />
          </PostContextProvider>
        </AuthContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
