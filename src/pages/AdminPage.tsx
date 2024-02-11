import {useEffect, useState} from "react";
import AdminPanelComponent from "../components/AdminPanelComponent/AdminPanelComponent";
import {IUserDto} from "../entities/User";
import {useUsers} from "../hooks/useUser";

const AdminPage = () => {
  const [users, setUsers] = useState<IUserDto[]>([]);

  const {getAllUsers} = useUsers();

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      setUsers(allUsers);
    });
  }, []);

  return <AdminPanelComponent allUsers={users} />;
};

export default AdminPage;
