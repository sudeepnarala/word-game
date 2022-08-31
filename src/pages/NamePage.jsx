import {Button, TextField} from "@mui/material";
import {useState} from "react";
import * as ReactDOM from 'react-dom/client';
import GamePage from "./GamePage";
import {renderHook} from "@testing-library/react";
import {unstable_batchedUpdates} from 'react-dom'
import {Pages} from '../word-game-firestore';

// Need to keep the name as a part of the state

export default function NamePage(props) {

    function handle_name() {
        if(props.name === "") {
            window.alert("Must enter a name!")
            return
        }
        props.setPage(Pages.room_creation)
    }

    function key_pressed(e) {
        if(e.key === "Enter") {
            handle_name()
        }
    }


    return (
        <div className={"name-page-container"}>
            <TextField variant="outlined" label="Enter Screen Name Here!" onKeyPress={key_pressed} onChange={(e)=>props.setName(e.target.value)}/>
        </div>
    );
}