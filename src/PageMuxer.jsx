import {Button, TextField} from "@mui/material";
import {useState} from "react";
import * as ReactDOM from 'react-dom/client';
import GamePage from "./GamePage";
import {renderHook} from "@testing-library/react";
import {unstable_batchedUpdates} from 'react-dom'



const Pages = {
    name: 0,
    room: 1,
    game: 2,
}

const ROOM_POSSIBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
// Need to keep the name as a part of the state

export default function PageMuxer() {
    let [name, setName] = useState("")
    let [roomID, setRoomID] = useState("")
    let [page, setPage] = useState(Pages.name)
    let [host, setHost] = useState(false)

    function handle_name() {
        if(name === "") {
            window.alert("Must enter a name!")
        }
        setPage(Pages.room)
    }

    function key_pressed(e) {
        if(e.key === "Enter") {
            handle_name()
        }
    }
    function go_pressed() {
        handle_name()
    }

    function enter_room() {
        setPage(Pages.game)
    }

    function create_room() {
        let room_id = ""
        for(let i=0; i < 6; i++) {
            room_id += ROOM_POSSIBLE_CHARS[Math.floor(Math.random()*ROOM_POSSIBLE_CHARS.length)]
        }
        unstable_batchedUpdates(() => {
            setHost(true)
            setRoomID(room_id)
            setPage(Pages.game)
        })

    }

    // https://reactjs.org/docs/conditional-rendering.html
    let render_this;
    if(page === Pages.name) {
        render_this = <div className={"name-page-entry"}><TextField variant="outlined" label="Enter Screen Name Here!" onKeyPress={key_pressed} onChange={(e)=>setName(e.target.value)}/>
            <Button variant="outlined" onClick={go_pressed}>Go!</Button></div>
    } else if(page === Pages.room) {
        render_this = <div className={"name-page-entry"}>
            <div className={"room-elements"}>Hello {name}!</div>
            <div className={"room-elements"}><Button onClick={create_room}>Create a Room</Button></div>
            <div className={"room-elements"}>
                <TextField label={"Room ID"} onChange={(e)=>setRoomID(e.target.value)}/>
                <Button onClick={enter_room}>Enter a Room</Button>
            </div>
        </div>
    } else if(page === Pages.game) {
        render_this = <div >
            <GamePage setPage={setPage} room_code={roomID} name={name} host={host} />
        </div>
    }


    return (
        <div>
            {render_this}
        </div>
    );
}