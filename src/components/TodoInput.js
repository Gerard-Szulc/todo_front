import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';

import React, {useRef, useState} from 'react';
import api from "../utils/api";
import styled from "styled-components";
import {TextField, Button} from "@material-ui/core";
import {imageMimetypeCheck} from "../utils/imageMimetypeCheck";

const Form = styled.form`
display: flex;
flex-direction: column;
padding: 10px;
width: 100%;
`
function TodoInput({generateRandom, list, notificationSetters, setAddVisibility, handleDelete}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(new Date())
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileNameToShow, setFileNameToShow] = useState('')
    const fileInput = useRef(null);

    const restoreDefaultValues = () => {
        setTitle('')
        setDescription('')
        setDeadline(new Date())
        setFile(null)
        setFileName('')
        setFileNameToShow('')
    }
    const setNotification = (visibility, mode, message) => {
        notificationSetters.setNotificationMode(mode)
        notificationSetters.setNotificationVisible(visibility)
        notificationSetters.setNotificationText(message)
    }
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
    const handleAddFile = (event) => {
        const files = event.target.files
        if (!imageMimetypeCheck(files[0].type)) {
            setNotification(true, 'error', 'Only images allowed.')
            setFile(null)
            setFileName('')
            setFileNameToShow('')
            return
        }
        const formData = new FormData()
        formData.append('file', files[0])
        setFile(formData)
        setFileNameToShow(event.target.files[0].name)
    }

    const handleStartFileUpload = (event) => {
        fileInput.current.click()
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
        const dataToSend = {
            title,
            description,
            deadlineAt: new Date(deadline),
            position: list.length,
        }
        try {
            let item = await api('/items/new', 'post', JSON.stringify(dataToSend))
            if (file) {
                try {
                    await api(`/pictures/${item.id}/upload`, 'post', file)
                    setNotification(true, 'success', 'New task successfully added.')

                } catch (e) {
                    console.error(e)
                    handleDelete(item.id)
                    throw new Error();
                }
            }
            restoreDefaultValues()

            generateRandom(Math.random())
            setAddVisibility(prev => !prev)

        } catch (e) {
            setNotification(true, 'error', 'Failed to add new task.')
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
                    max={255}
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
                <input style={{display: 'none'}} id={'file-input'} ref={fileInput} type="file" value={fileName} onChange={handleAddFile}/>
                <Button variant={'contained'} color={"primary"} className={file && 'selector-with-file'} onClick={handleStartFileUpload}>{file ? fileNameToShow : 'Add file'}</Button>
                <Button variant={'contained'} color={"primary"} onClick={handleSubmit} style={{
                    marginBottom: "50px"
                }}>Submit</Button>
            </Form>
        </MuiPickersUtilsProvider>

    );
}

export default TodoInput;
