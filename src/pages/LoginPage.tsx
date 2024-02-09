import {Dispatch, SetStateAction} from "react";
import Login from "../components/LoginComponent/LoginComponent";

const LoginPage = (props: {setLoggedIn: Dispatch<SetStateAction<boolean>>}) => {
  return <Login setLoggedIn={props.setLoggedIn} />;
};

export default LoginPage;
