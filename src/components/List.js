import React, {useEffect} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import api from "../utils/api";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 10;

const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? '#ffff77' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});


function List({setList, list, ...props}) {



    useEffect(() => {

        const getTodos = async () => {
            try {
                let {items} = await api(`/items/`, 'GET')
                setList(items)
                console.log('trollo', items)
            } catch (e) {
                console.error('Could not get todo list')
            }
        }

        getTodos()

    }, [setList]);

    const onDragEnd = async (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            list,
            result.source.index,
            result.destination.index
        );

        let dataToSend = {items: items.map(({position, ...itemParams},idx) => { return {position: idx.toString(), ...itemParams}})}
        try {
            let response = await api(`/items/edit`,'put', dataToSend )
            console.log(response)
            setList(
                items
            );
        } catch (e) {
            console.error(e)
        }
        console.log(items)
    }


    return (
                <ul>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {list.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={`item-${item.id}`}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div>
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        style={getItemStyle(
                                                            provided.draggableProps.style,
                                                            snapshot.isDragging
                                                        )}
                                                    >
                                                        {item.description}
                                                    </div>
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </ul>
    );
}

export default List;
