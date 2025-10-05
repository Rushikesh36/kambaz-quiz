import { ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

export default function Modules() {
  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        {/* Week 1 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 1 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> Introduction to the course <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Learn what is Web Development <LessonControlButtons /></ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 2 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> LECTURE 1 <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Introduction to HTML <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Basic HTML Tags <LessonControlButtons /></ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 3 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 3 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> LECTURE 2 <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Introduction to CSS <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Selectors and Properties <LessonControlButtons /></ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 4 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 4 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> LECTURE 3 <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Introduction to JavaScript <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Variables and Data Types <LessonControlButtons /></ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 5 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 5 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> LECTURE 4 <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> Functions in JavaScript <LessonControlButtons /></ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /> DOM Manipulation <LessonControlButtons /></ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
