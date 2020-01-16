import React, {useEffect, useState} from 'react';
import './App.css';
import List from "./components/List";
import api from "./utils/api";
import TodoInput from "./components/TodoInput";
import styled from "styled-components";
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    Snackbar, Toolbar, Fab, AppBar
} from "@material-ui/core";
import {Add, Remove, ExpandMore} from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MainAppScreen = styled.main`
display: flex;
justify-content: center;
`
const Footer = styled.footer`
position: fixed;
bottom: 0px;
width: 100vw;
`
const FooterContent = styled.div`
display: flex;
justify-content: center;
width: 100vw;
`


function App() {
    const [list, setList] = useState([])
    const [refetcher, generateRandom] = useState(0)
    const [addVisible, setAddVisibility] = useState(false)
    const [notificationVisible, setNotificationVisible] = useState(false)
    const [notificationMode, setNotificationMode] = useState('')
    const [notificationText, setNotificationText] = useState('')

    const handleFormVisibility = (ev) => {
        setAddVisibility(prevState => !prevState)
    }
    const handleCloseNotification = (ev) => {
        setNotificationVisible(false)
    }

    useEffect(() => {

        const getTodos = async () => {

            try {
                let {items} = await api(`/items/`, 'GET')
                let mapped = items.map(el => {
                    let element = el
                    el.index = el.id
                    delete el.id
                    return element
                })
                setList(mapped)
            } catch (e) {
                setNotificationMode('error')
                setNotificationVisible(true)
                setNotificationText('Downloading tasks failed. Try again later.')
                console.error('Could not get todo list')
            }
        }

        getTodos()
        return

    }, [refetcher]);
    return (
        <div className="app">
            <header className="">
            </header>
            <MainAppScreen>

                <List
                    setList={setList}
                    list={list} generateRandom={generateRandom}
                    notificationSetters={{setNotificationVisible, setNotificationText, setNotificationMode}}
                />

            </MainAppScreen>

            <Footer>
                <FooterContent>
                    <AppBar component={"div"} position="fixed" color="primary" variant={"outlined"}  className={"app-bar"}>
                        <Toolbar>
                            <Fab color="secondary" aria-label="add" onClick={handleFormVisibility}>
                                {addVisible ? <Remove/> : <Add />}
                            </Fab>
                        </Toolbar>
                    </AppBar>
                    <ExpansionPanel expanded={addVisible} className={addVisible ? ".with-shadow" : "" } elevation={20}>
                        <ExpansionPanelSummary
                            onClick={handleFormVisibility}
                            expandIcon={<ExpandMore/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography onClick={handleFormVisibility}>Add Task</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <TodoInput
                                generateRandom={generateRandom}
                                list={list}
                                setAddVisibility={setAddVisibility}
                                notificationSetters={{setNotificationVisible, setNotificationText, setNotificationMode}}
                            />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Snackbar open={notificationVisible} autoHideDuration={6000} onClose={handleCloseNotification}>
                        <Alert onClose={handleCloseNotification} severity={notificationMode}>
                            {notificationText}
                        </Alert>
                    </Snackbar>
                </FooterContent>
            </Footer>
        </div>
    );
}

export default App;
