import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import AccessManagementComponent from "../components/ManagerPanelComponent/ManagerPanelComponent";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import {IUserDto} from "../entities/User";
import {useUsers} from "../hooks/useUsers";

const ManagerPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [isLoading, setIsLoading] = useState(true);

  const [projectUsers, setProjectUsers] = useState<IUserDto[]>([]);
  const [nonProjectUsers, setNonProjectUsers] = useState<IUserDto[]>([]);

  const {getAllUsers} = useUsers();

  useEffect(() => {
    getAllUsers(projectKey)
      .then((allProjectUsers) => {
        setProjectUsers(allProjectUsers);
        getAllUsers().then((allUsers) => {
          console.log({allProjectUsers, allUsers});
          const nonProjectUsers = allUsers.filter((user) => !projectUsers.find((projectUser) => projectUser.userId === user.userId));
          setNonProjectUsers(nonProjectUsers);
          setIsLoading(false);
        });
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <NavigationBar />
          <AccessManagementComponent projectUsers={projectUsers} nonProjectUsers={nonProjectUsers} />
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
