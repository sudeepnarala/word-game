import {Pages} from './word-game-firestore';
import {useState} from "react";
import NamePage from "./NamePage";
import RoomCreationPage from "./RoomCreationPage";
import RoomWaitingPage from "./RoomWaitingPage";
import GamePage from "./GamePage";

export default function PageMuxer() {
    let [page, setPage] = useState(Pages.name)
    let [name, setName] = useState("")
    let [roomID, setRoomID] = useState("")
    let [host, setHost] = useState(false)

    let render_this;
    if(page === Pages.name) {
        render_this = <NamePage name={name} setName={setName} setPage={setPage} />
    }
    else if(page === Pages.room_creation) {
        render_this = <RoomCreationPage setRoomID={setRoomID} setHost={setHost} setPage={setPage} name={name}/>
    }
    else if(page === Pages.room_waiting) {
        render_this = <RoomWaitingPage roomID={roomID} host={host} setPage={setPage} name={name} />
    }
    else if(page === Pages.game) {
        render_this = <GamePage roomID={roomID} host={host} setPage={setPage} />
    }

    return (
        <div>
            {render_this}
        </div>
    );
}


