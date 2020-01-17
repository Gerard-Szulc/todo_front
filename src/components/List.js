import React from 'react';
import styled from "styled-components";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Fab, makeStyles, Backdrop, CircularProgress} from "@material-ui/core";
import api from "../utils/api";
import Clear from '@material-ui/icons/Clear';
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

    return result;
};

const grid = 10;

const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'rgba(193,255,245,0.67)' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#aecaff' : 'rgba(255,249,146,0)',
    padding: grid,
});
const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

function List({setList, list, generateRandom, listLoaded, notificationSetters, handleDelete, ...props}) {

    const classes = useStyles();

    const getUrl = (item) => {
        return `${process.env.REACT_APP_BACKEND_URL}/pictures/${item.file.uuid}`
    }

    const getImage = (item) => {
        if (item.file) {
            return (<img src={getUrl(item)} alt="todo"/>)
        }
        return ''
    }

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        let items = reorder(
            list,
            result.source.index,
            result.destination.index
        );

        try {
            let dataToSave = items.map(({...props}, index) => {
                return {...props, position: index}
            })

            setList(dataToSave)

            await api(`/items/reorder`, 'put', JSON.stringify({items: dataToSave}))

            // generateRandom(Math.random())

        } catch (e) {
            console.error(e)
        }
    }

        return listLoaded ? (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <Listing
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {
                                list.map((item, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={index.toString()}
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
                                                <div className={"item-organizer"}>
                                                    <div className={"item-image-container"}>

                                                        {
                                                            getImage(item)
                                                        }
                                                    </div>
                                                    <div className={"item-data"}>
                                                        <div className={"item-button-container"}>
                                                            <Fab color="secondary" aria-label="edit"
                                                                    onClick={(ev) => handleDelete(item.id)}>
                                                                <Clear/>
                                                            </Fab>
                                                        </div>
                                                        <Title>{item.title}</Title>
                                                        <p>
                                                            <span>{item.description}</span>
                                                        </p>
                                                        <p>Deadline date: {moment(item.deadlineAt).format('YYYY-MM-DD')}</p>
                                                    </div>
                                                </div>
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
        ) : (
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }


export default List;
