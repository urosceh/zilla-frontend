import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ErrorModal from "../../errors/ErrorModal/ErrorModal";
import {AxiosClient} from "../../lib/AxiosClient";

const ChangePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const axiosInstance = AxiosClient.getInstance();

  const navigate = useNavigate();

  const onButtonClick = () => {
    setOldPasswordError("");
    setPasswordError("");

    if (oldPassword === "") {
      setOldPasswordError("Please enter your old password");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (oldPassword.length <= 7) {
      setOldPasswordError("The password must be 8 characters or longer");
      return;
    }
    if (password.length <= 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
    if (oldPassword === password) {
      setPasswordError("The new password must be different from the old password");
      return;
    }

    login();
  };

  const [error, setError] = useState<string>("");
  const login = () => {
    axiosInstance
      .changePassword({oldPassword, newPassword: password})
      .then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        setError(`${error.message}: ${error.response.data}`);
      });
  };

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <div className={"main-container"}>
        <div className={"title-container"}>
          <div>Change Password</div>
        </div>
        <br />
        <div className={"input-container"}>
          <input
            type="password"
            value={oldPassword}
            placeholder="Enter your old password here"
            onChange={(ev) => setOldPassword(ev.target.value)}
            className={"input-box"}
          />
          <label className="login-error-label">{oldPasswordError}</label>
        </div>
        <br />
        <div className={"input-container"}>
          <input
            type="password"
            value={password}
            placeholder="Enter your new password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={"input-box"}
          />
          <label className="login-error-label">{passwordError}</label>
        </div>
        <br />
        <div className={"input-container"}>
          <input className={"input-button"} type="button" onClick={onButtonClick} value={"Change Password"} />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
