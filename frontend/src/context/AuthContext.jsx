import { apiVars } from "@/constants/apiVars";
import { setAuthUser } from "@/store/features/authSlice";
import { setPosts, setSelectedPost } from "@/store/features/postSlice";
import { createContext, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  // <---------------- States ------------------>
  const [authLoading, setAuthloading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // <---------------- useRefs ------------------>
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // <---------------- Handlers and Functions ------------------>
  const authSubmitHandler = async (event, authType) => {
    event.preventDefault();
    setAuthloading(true);

    let url;
    let payload;
    let successMsg;

    if (authType === "Signup") {
      url = `${apiVars.baseUrl}/${apiVars.usersUrl}/${apiVars.registerUrl}`;
    } else if (authType === "Login") {
      url = `${apiVars.baseUrl}/${apiVars.usersUrl}/${apiVars.loginUrl}`;
    } else if (authType === "Logout") {
      url = `${apiVars.baseUrl}/${apiVars.usersUrl}/${apiVars.logoutUrl}`;
    }

    if (authType === "Signup") {
      payload = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    } else if (authType === "Login") {
      payload = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    } else if (authType === "Logout") {
      payload = {};
    }

    if (authType === "Signup") {
      successMsg = "Signup successful!";
    } else if (authType === "Login") {
      successMsg = "Login successful!";
    } else if (authType === "Logout") {
      successMsg = "Logout successful!";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const user = await response.json();

        if (user.success) {
          if (authType === "Signup") {
            toast.success(successMsg);
            usernameRef.current.value = "";
            emailRef.current.value = "";
            passwordRef.current.value = "";
            // navigate("/auth/login");
          } else if (authType === "Login") {
            toast.success(successMsg);
            emailRef.current.value = "";
            passwordRef.current.value = "";
            setIsLoggedIn(true);
            dispatch(setAuthUser(user));
            // navigate("/");
          } else if (authType === "Logout") {
            toast.success(successMsg);
            // navigate("/auth/login");
            dispatch(setAuthUser(null));
            setIsLoggedIn(false);
          }
        } else {
          toast.error(user.message || "Sorry! Something went wrong.");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response format:", text);
        toast.error("An unexpected error occurred.");
      }
    } catch (error) {
      toast.error(error?.message || "An error occured. Please try again.");
      console.log(error);
    } finally {
      setAuthloading(false);
    }
  };

  // <----------------------- useEffects ----------------------->

  //   <---------------- Home Context Values --------->
  const postContextValues = {
    usernameRef,
    emailRef,
    passwordRef,
    authSubmitHandler,
    authLoading,
    isLoggedIn,
  };
  return (
    <AuthContext.Provider value={postContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
