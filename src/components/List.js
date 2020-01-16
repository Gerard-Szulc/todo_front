import React from 'react';
import styled from "styled-components";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Button} from "@material-ui/core";
import api from "../utils/api";
import DeleteIcon from '@material-ui/icons/Delete';
import moment from "moment";

const Listing = styled.ul`
  transition: background-color 0.5s ease;
  list-style: none;
`

const Item = styled.li`

`
const ItemContent = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Title = styled.div`
  padding: 10px;
  border-bottom: 1px #3a3739 solid;
  display: flex;
  justify-content: center;
`

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    console.log('reor',result)

    return result;
};

const grid = 10;

const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'rgba(193,255,245,0.51)' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#c3ffc8' : '#fff992',
    padding: grid,
});


function List({setList, list, generateRandom, ...props}) {
    const handleDelete = async (event, itemId) => {
        try {
            let response = await api(`/items/${itemId}`, 'delete')
            generateRandom(Math.random())
            console.log(response)
        } catch (e) {
            console.error(e)
        }
    }

    const onDragEnd = async (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        console.log('result',result)
        let items = reorder(
            list,
            result.source.index,
            result.destination.index
        );


        console.log(items)
        try {
            let dataToSend = items.map(el => {
                    let element = el
                    el.id = el.index
                    delete el.index
                    return element
                })
            setList(dataToSend)
            console.log(dataToSend)

            await api(`/items/edit`, 'put', {items: dataToSend})

            generateRandom(Math.random())

        } catch (e) {
            console.error(e)
        }
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <Listing
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                    >
                        {list.map((item, index) => (
                            <Draggable
                                key={item.position}
                                draggableId={item.position.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <Item className={`list-item-${item.position}`}>
                                        <ItemContent
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                provided.draggableProps.style,
                                                snapshot.isDragging
                                            )}
                                        >
                                            <Title>{item.title}</Title>

                                            <p>
                                                <title>Descripion</title>
                                                <span>{item.description}</span>
                                            </p>
                                            <p>Deadline: {moment(item.deadlineAt).format('YYYY-MM-DD')}</p>
                                            position: {item.position}
                                            id: {item.index}
                                            <Button variant={"contained"} color={'secondary'}
                                                onClick={(ev) => handleDelete(ev, item.id)}>
                                                <DeleteIcon/>
                                            </Button>
                                        </ItemContent>
                                        {provided.placeholder}
                                    </Item>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Listing>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default List;
