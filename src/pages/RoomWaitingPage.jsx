import {useState} from "react";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {Button} from "@mui/material";
import {db, Pages} from "../word-game-firestore";
import { useEffect } from "react";

export default function RoomWaitingPage({ roomID, name, setPage, host, setPlayerNames }) {

    let [allNames, setAllNames] = useState([])
    // games collection, {room_code} document, setup collection, {name} document
    // Ignore the promise
    useEffect(() =>{
        let setup_doc_ref = doc(db, "games", roomID, "setup", name)
        setDoc(setup_doc_ref, {
            "name": name
        })
    }, [])

    function checkEquals(arr1, arr2) {
        if(arr1.length !== arr2.length) {
            return false
        }
        for(let i=0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) {
                return false
            }
        }
        return true
    }

    function handle_new_names(query_result) {
        let names = []
        query_result.forEach((doc)=> {
            names.push(doc.get("name"))
        })
        // NOTE: Have to compare using equals and not ===
        if(!checkEquals(names, allNames))
        {
            setAllNames(names)
            setPlayerNames(names)
        }
    }

    const names_query = query(collection(db, "games", roomID, "setup"))
    onSnapshot(names_query, (query_result)=>handle_new_names(query_result))

    function handle_start_game(query_result) {
        if(query_result.size === 1) {
            setPage(Pages.game)
        }
    }
    const start_query = query(collection(db, "games", roomID, "START_GAME_MARKER"))
    onSnapshot(start_query, (query_result)=>handle_start_game(query_result))

    function start_game() {
        // Send a start game message
        setDoc(doc(db, "games", roomID, "START_GAME_MARKER", "dummy_lets_start"), {
            "lets_start": "lets_start"
        })
    }


    return (
        <div className={"game-page"}>
            {host ? <h2>You are the host!</h2> : <h2>Wait for host to start game!</h2>}
            <h3>
                Room Code - {roomID}
            </h3>
            <h2>Players</h2>
            {allNames.map((name)=><h3>{name}</h3>)}
            {host ? <Button variant="outlined" onClick={start_game}>Start Game</Button> : <div />}
        </div>
    );
}
