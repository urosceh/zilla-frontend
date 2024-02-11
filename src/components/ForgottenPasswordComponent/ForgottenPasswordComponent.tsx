import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosClient} from "../../lib/AxiosClient";

const ForgottenPasswordComponent = () => {
  const [secretKey, setSecretKey] = useState("");
  const [password, setPassword] = useState("");
  const [secretKeyError, setSecretKeyError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const axiosInstance = AxiosClient.getInstance();

  const navigate = useNavigate();

  const onButtonClick = () => {
    setSecretKeyError("");
    setPasswordError("");

    if (secretKey === "") {
      setSecretKeyError("Please enter your secret key");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    login();
  };

  // Log in a user using email and password
  const login = () => {
    axiosInstance
      .resetPassword({securityCode: secretKey, newPassword: password})
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  return (
    <div className={"main-container"}>
      <div className={"title-container"}>
        <div>Forgotten Password</div>
      </div>
      <br />
      <div className={"input-container"}>
        <input
          value={secretKey}
          placeholder="Enter your secret key from email here"
          onChange={(ev) => setSecretKey(ev.target.value)}
          className={"input-box"}
        />
        <label className="login-error-label">{secretKeyError}</label>
      </div>
      <br />
      <div className={"input-container"}>
        <input
          value={password}
          placeholder="Enter your new password here"
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

export default ForgottenPasswordComponent;
