import {Dispatch, SetStateAction} from "react";
import LoginComponent from "../components/LoginComponent/LoginComponent";
import Cookies from "universal-cookie";

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  cookies: Cookies;
}

const LoginPage: React.FC<Props> = ({setLoggedIn, setIsAdmin, cookies}) => {
  return <LoginComponent setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} cookies={cookies} />;
};

export default LoginPage;
