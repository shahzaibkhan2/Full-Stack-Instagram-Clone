import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Home context is missing !");
  }
  return context;
};
