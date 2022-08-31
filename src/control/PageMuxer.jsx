import {Pages} from '../word-game-firestore';
import {useState} from "react";
import NamePage from "../pages/NamePage";
import RoomCreationPage from "../pages/RoomCreationPage";
import RoomWaitingPage from "../pages/RoomWaitingPage";
import GamePage from "../pages/GamePage";

export default function PageMuxer() {
    let [page, setPage] = useState(Pages.name)
    let [name, setName] = useState("")
    let [roomID, setRoomID] = useState("")
    let [host, setHost] = useState(false)
    let [playerNames, setPlayerNames] = useState("")

    let render_this;
    if(page === Pages.name) {
        render_this = <NamePage name={name} setName={setName} setPage={setPage} />
    }
    else if(page === Pages.room_creation) {
        render_this = <RoomCreationPage setRoomID={setRoomID} setHost={setHost} setPage={setPage} name={name}/>
    }
    else if(page === Pages.room_waiting) {
        render_this = <RoomWaitingPage roomID={roomID} host={host} setPage={setPage} name={name} setPlayerNames={setPlayerNames} />
    }
    else if(page === Pages.game) {
        render_this = <GamePage roomID={roomID} host={host} setPage={setPage} name={name} playerNames={playerNames} />
    }

    return (
        <div>
            {render_this}
        </div>
    );
}


