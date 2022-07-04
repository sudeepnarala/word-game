import {useState} from "react";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {Button} from "@mui/material";
import {db, Pages} from "./word-game-firestore";

export default function RoomWaitingPage(props) {

    let [allNames, setAllNames] = useState([])
    // games collection, {room_code} document, setup collection, {name} document
    // Ignore the promise
    setDoc(doc(db, "games", props.roomID, "setup", props.name), {
        "name": props.name
    })

    const names_q = query(collection(db, "games", props.roomID, "setup"))
    const names = []
    onSnapshot(names_q, (query)=>query.forEach((doc)=> {
            names.push(doc.data()["name"])
            if(query.size === names.length && names.length !== allNames.length) {
                setAllNames(names)
            }
        }
    ))

    const start_q = query(collection(db, "games", props.roomID, "START_GAME"))
    onSnapshot(start_q, (query)=>query.forEach((doc) => {
        props.setPage(Pages.game)
    }))

    function start_game() {
        // Send a start game message
        setDoc(doc(db, "games", props.roomID, "START_GAME", "dummy_lets_start"), {
            "lets_start": "lets_start"
        })
    }


    return (
        <div className={"game-page"}>
            {props.host ? <h2>You are the host!</h2> : <h2>Wait for host to start game!</h2>}
            <h3>
                Room Code - {props.roomID}
            </h3>
            <h2>Players</h2>
            {allNames.map((name)=><h3>{name}</h3>)}
            {props.host ? <Button variant="outlined" onClick={start_game}>Start Game</Button> : <div />}
        </div>
    );
}
