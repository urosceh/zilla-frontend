import React, {Dispatch, SetStateAction, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import ErrorModal from "../../errors/ErrorModal/ErrorModal";
import {AxiosClient} from "../../lib/AxiosClient";
import "./LoginComponent.css";

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  cookies: Cookies;
}

const LoginComponent: React.FC<Props> = ({setLoggedIn, setIsAdmin, cookies}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {tenant} = useParams<{tenant?: string}>();

  const axiosInstance = AxiosClient.getInstance();

  const navigate = useNavigate();

  const onButtonClick = () => {
    setEmailError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length <= 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    login();
  };

  const [error, setError] = useState<string>("");
  const login = () => {
    axiosInstance
      .login(email, password)
      .then((response) => {
        // localStorage.setItem("loggedIn", "true");
        setLoggedIn(true);
        if (response.adminBearerToken && response.adminBearerToken === response.bearerToken) {
          setIsAdmin(true);
          // Use tenant-scoped admin cookie
          cookies.set(`adminBearerToken_${tenant}`, response.adminBearerToken, {path: "/"});
        }
        // Use tenant-scoped bearer token cookie
        cookies.set(`bearerToken_${tenant}`, response.bearerToken, {path: "/"});

        // Navigate to tenant-specific home
        navigate(`/${tenant}`);
      })
      .catch((error: any) => {
        console.error(error);

        // Handle invalid tenant (400 error)
        if (error.response?.status === 400 && error.response?.data?.includes?.("tenant")) {
          // Redirect to tenant error page
          navigate("/", {replace: true});
          return;
        }

        if (error.response?.data) {
          setError(`${error.message}: ${error.response.data}`);
        } else {
          setError("An unknown error occurred");
        }
      });
  };

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className={"main-container"}>
        <div className={"title-container"}>
          <div>Login</div>
        </div>
        <br />
        <div className={"input-container"}>
          <input value={email} placeholder="Enter your email here" onChange={(ev) => setEmail(ev.target.value)} className={"input-box"} />
          <label className="login-error-label">{emailError}</label>
        </div>
        <br />
        <div className={"input-container"}>
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={"input-box"}
          />
          <label className="login-error-label">{passwordError}</label>
        </div>
        <br />
        <div className={"input-container"}>
          <input className={"input-button"} type="button" onClick={onButtonClick} value={"Log in"} />
        </div>
        <br />
        <div className="forgotten-password">
          <Link to={`/${tenant}/forgotten-password`}>Forgotten your password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
