import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';

import React, {useState} from 'react';
import api from "../utils/api";
import styled from "styled-components";
import {TextField, Button} from "@material-ui/core";

const Form = styled.form`
display: flex;
flex-direction: column;
padding: 10px;
width: 100%;
`
function TodoInput({generateRandom, list, notificationSetters, setAddVisibility}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(new Date())

    const handleChangeDescription = (event) => {
        event.preventDefault()
        setDescription(event.target.value)
    }
    const handleChangeTitle = (event) => {
        event.preventDefault()
        setTitle(event.target.value)
    }
    const handleChangeDeadline = (event) => {
        setDeadline(event)
    }

    const restoreDefaultValues = () => {
        setTitle('')
        setDescription('')
        setDeadline(new Date())

    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const dataToSend = {
            title,
            description,
            deadlineAt: new Date(deadline),
            done: false,
            filePath: '',
            position: list.length
        }
        console.log(dataToSend)
        try {
            let {item} = await api('/items/new', 'post', dataToSend)
            restoreDefaultValues()
            console.log(item.position)

            generateRandom(Math.random())
            notificationSetters.setNotificationMode('success')
            notificationSetters.setNotificationVisible(true)
            notificationSetters.setNotificationText('New task successfully added.')
            setAddVisibility(prev => !prev)
            console.log(`.list-item-${item.position}`, document.querySelectorAll(`.list-item-${item.position}`))

        } catch (e) {
            notificationSetters.setNotificationMode('error')
            notificationSetters.setNotificationVisible(true)
            notificationSetters.setNotificationText('Failed to add new task.')
            console.error(e)
        }
    }

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Form id="form" action="submit" onSubmit={handleSubmit}>
                <TextField
                    value={title}
                    id="todo-add-text-field"
                    label={"Title"}
                    onChange={handleChangeTitle}
                    variant="outlined"
                    margin={'normal'}
                />
                <TextField
                    value={description}
                    id="todo-add-description-field"
                    type="text"
                    onChange={handleChangeDescription}
                    multiline
                    label={"Description"}
                    rows="4"
                    variant="outlined"
                    margin={'normal'}
                />
                <DatePicker
                    openPicker={true}
                    variant="inline"
                    margin="normal"
                    id="date-picker-inline"
                    label="Deadline date"
                    value={deadline}
                    onChange={handleChangeDeadline}
                />
                <Button variant={'contained'} color={"primary"} onClick={handleSubmit} style={{
                    marginBottom: "50px"
                }}>+</Button>
            </Form>
        </MuiPickersUtilsProvider>

    );
}

export default TodoInput;
