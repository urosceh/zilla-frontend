import {Dispatch, SetStateAction} from "react";
import LoginComponent from "../components/LoginComponent/LoginComponent";

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
}

const LoginPage: React.FC<Props> = ({setLoggedIn, setIsAdmin}) => {
  return <LoginComponent setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />;
};

export default LoginPage;
