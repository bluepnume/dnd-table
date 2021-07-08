import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


class TableCell extends Component {

  getSnapshotBeforeUpdate(prevProps) {
    if (!this.ref) {
      return null;
    }

    const isDragStarting =
      this.props.isDragOccurring && !prevProps.isDragOccurring;

    if (!isDragStarting) {
      return null;
    }

    const { width, height } = this.ref.getBoundingClientRect();

    const snapshot = {
      width,
      height,
    };

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const ref = this.ref;
    if (!ref) {
      return;
    }

    if (snapshot) {
      if (ref.style.width === snapshot.width) {
        return;
      }
      ref.style.width = `${snapshot.width}px`;
      ref.style.height = `${snapshot.height}px`;
      return;
    }

    if (this.props.isDragOccurring) {
      return;
    }

    // inline styles not applied
    if (ref.style.width == null) {
      return;
    }

    // no snapshot and drag is finished - clear the inline styles
    ref.style.removeProperty('height');
    ref.style.removeProperty('width');
  }

  setRef = (ref) => {
    this.ref = ref;
  }

  render() {
    return <td ref={this.setRef}>
      {this.props.children}
    </td>
  }
}



// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    thing1: `thing1 ${k}`,
    thing2: `thing2 ${k}`,
    thing3: `thing3 ${k}`,
    thing4: `thing4 ${k}`,
    thing5: `thing5 ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getRowStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle
});

const getTableStyle = isDraggingOver => ({
  width: '100%'
});

export class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      items: getItems(10)
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onBeforeDragStart() {
    this.setState({
      isDragging: true,
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      isDragging: true,
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onBeforeDragStart={() => this.onBeforeDragStart()} onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getTableStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getRowStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <TableCell isDragOccurring={this.state.isDragging}>
                        {item.thing1}
                      </TableCell>
                      <TableCell isDragOccurring={this.state.isDragging}>
                        {item.thing2}
                      </TableCell>
                      <TableCell isDragOccurring={this.state.isDragging}>
                        {item.thing3}
                      </TableCell>
                      <TableCell isDragOccurring={this.state.isDragging}>
                        {item.thing4}
                      </TableCell>
                      <TableCell isDragOccurring={this.state.isDragging}>
                        {item.thing5}
                      </TableCell>
                    </tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </table>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
