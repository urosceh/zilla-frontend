import {Draggable} from "react-beautiful-dnd";
import {IIssueDto} from "../../entities/Issue";
import "./Card.css";

interface Props {
  issue: IIssueDto;
  index: number;
}

const Card: React.FC<Props> = ({issue, index}) => {
  return (
    <Draggable key={issue.issueId} draggableId={issue.issueId} index={0}>
      {(provided) => (
        <>
          {/* {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )} */}

          <div
            className="custom__card"
            onClick={() => {
              // open issue page
              console.log("open issue page");
            }}
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
