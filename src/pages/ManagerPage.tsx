import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ManagerPanelComponent from "../components/ManagerPanelComponent/ManagerPanelComponent";
import {IUserDto} from "../entities/User";
import ErrorModal from "../errors/ErrorModal/ErrorModal";
import {useUsers} from "../hooks/useUser";

const ManagerPage = () => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const [isLoading, setIsLoading] = useState(true);

  const [projectUsers, setProjectUsers] = useState<IUserDto[]>([]);
  const [nonProjectUsers, setNonProjectUsers] = useState<IUserDto[]>([]);

  const {getAllUsers} = useUsers();

  const [error, setError] = useState<string>("");
  useEffect(() => {
    getAllUsers(projectKey)
      .then((allProjectUsers) => {
        setProjectUsers(allProjectUsers);
        getAllUsers().then((allUsers) => {
          console.log({allProjectUsers, allUsers});
          const nonProjectUsers = allUsers.filter((user) => !allProjectUsers.find((projectUser) => projectUser.userId === user.userId));
          setNonProjectUsers(nonProjectUsers);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        setError(`${error.message}: ${error.response?.data}`);
      });
  }, []);

  return (
    <div>
      {error && <ErrorModal error={error} setError={setError} />}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ManagerPanelComponent projectUsers={projectUsers} nonProjectUsers={nonProjectUsers} />
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
