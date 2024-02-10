import {Dispatch, SetStateAction} from "react";
import LoginComponent from "../components/LoginComponent/LoginComponent";

interface Props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const LoginPage: React.FC<Props> = ({setLoggedIn}) => {
  return <LoginComponent setLoggedIn={setLoggedIn} />;
};

export default LoginPage;
