import {Button, Typography} from "@mui/material";
import {db} from './word-game-firestore';
import { doc, setDoc, onSnapshot, query, collection } from "firebase/firestore";
import {useState} from "react";


export default function GamePage(props) {
    let [allNames, setAllNames] = useState([])
    // games collection, {room_code} document, setup collection, {name} document
    // Ignore the promise
    setDoc(doc(db, "games", props.room_code, "setup", props.name), {
        "name": props.name
    })

    const names_q = query(collection(db, "games", props.room_code, "setup"))
    const names = []
    onSnapshot(names_q, (query)=>query.forEach((doc)=> {
            names.push(doc.data()["name"])
            if(query.size === names.length && names.length !== allNames.length) {
                setAllNames(names)
            }
        }
    ))

    const start_q = query(collection(db, "games", props.room_code, "START_GAME"))
    onSnapshot(start_q, (query)=>query.forEach((doc) => console.log("Game started")))

    function start_game() {
        // Send a start game message
        setDoc(doc(db, "games", props.room_code, "START_GAME", "dummy_lets_start"), {
            "lets_start": "lets_start"
        })
    }


    return (
      <div className={"game-page"}>
          {props.host ? <h2>You are the host!</h2> : <div />}
          <h3>
                Room Code - {props.room_code}
          </h3>
          <h2>Players</h2>
          {allNames.map((name)=><h3>{name}</h3>)}
          {props.host ? <Button variant="outlined" onClick={start_game}>Start Game</Button> : <div />}
      </div>
    );
}