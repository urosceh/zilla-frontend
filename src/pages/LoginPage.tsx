import {Dispatch, SetStateAction} from "react";
import {CookieSetOptions} from "universal-cookie";
import LoginComponent from "../components/LoginComponent/LoginComponent";
import {Cookie} from "../types/Cookie";

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
}

const LoginPage: React.FC<Props> = ({setLoggedIn, setIsAdmin}) => {
  return <LoginComponent setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />;
};

export default LoginPage;
