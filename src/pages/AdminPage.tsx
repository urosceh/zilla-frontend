import {useEffect, useState} from "react";
import AdminPanelComponent from "../components/AdminPanelComponent/AdminPanelComponent";
import {IUserDto} from "../entities/User";
import ErrorModal from "../errors/ErrorModal/ErrorModal";
import {useUsers} from "../hooks/useUser";

const AdminPage = () => {
  const [users, setUsers] = useState<IUserDto[]>([]);

  const {getAllUsers} = useUsers();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getAllUsers()
      .then((allUsers) => {
        setUsers(allUsers);
      })
      .catch((error) => {
        setError(`${error.message}: ${error.response?.data}`);
      });
  }, []);

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      <AdminPanelComponent allUsers={users} />;
    </div>
  );
};

export default AdminPage;
