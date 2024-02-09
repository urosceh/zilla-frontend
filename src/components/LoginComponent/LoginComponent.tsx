import {Dispatch, SetStateAction, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosClient} from "../../lib/AxiosClient";
import "./LoginComponent.css";

const Login = (props: {setLoggedIn: Dispatch<SetStateAction<boolean>>}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const axiosInstance = AxiosClient.getInstance();

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    console.log("Email: " + email);
    console.log("Password" + password);

    logIn();
  };

  // Log in a user using email and password
  const logIn = () => {
    axiosInstance
      .login(email, password)
      .then(() => {
        props.setLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  return (
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
    </div>
  );
};

export default Login;
