import {Button, TextField} from "@mui/material";
import {Pages} from "../word-game-firestore";
import {unstable_batchedUpdates} from "react-dom";

const ROOM_POSSIBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function RoomCreationPage(props) {
    function enter_room() {
        props.setPage(Pages.room_waiting)
    }

    function create_room() {
        let room_id = ""
        for(let i=0; i < 6; i++) {
            room_id += ROOM_POSSIBLE_CHARS[Math.floor(Math.random()*ROOM_POSSIBLE_CHARS.length)]
        }
        unstable_batchedUpdates(() => {
            props.setHost(true)
            props.setRoomID(room_id)
            props.setPage(Pages.room_waiting)
        })
    }
    return (
        <div className={"name-page-entry"}>
            <div className={"room-elements"}>Hello {props.name}!</div>
            <div className={"room-elements"}><Button onClick={create_room}>Create a Room</Button></div>
            <div className={"room-elements"}>
                <TextField label={"Room ID"} onChange={(e)=>props.setRoomID(e.target.value)}/>
                <Button onClick={enter_room}>Enter a Room</Button>
            </div>
        </div>
    );
}