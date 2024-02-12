import {Draggable} from "react-beautiful-dnd";
import {useNavigate, useParams} from "react-router-dom";
import {IIssueDto} from "../../entities/Issue";
import "./Card.css";

interface Props {
  issue: IIssueDto;
  index: number;
}

const Card: React.FC<Props> = ({issue, index}) => {
  const params = useParams();
  const projectKey = params.projectKey as string;

  const navigate = useNavigate();

  return (
    <Draggable key={issue.issueId} draggableId={issue.issueId} index={0}>
      {(provided) => (
        <>
          <div
            className="custom__card"
            onClick={() => navigate(`/${projectKey}/${issue.issueId}`)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{issue.summary}</p>
            </div>
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
