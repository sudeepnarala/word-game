import {Button, Grid, Typography} from "@mui/material";
import {db, Pages} from './word-game-firestore';
import { doc, setDoc, onSnapshot, query, collection } from "firebase/firestore";
import {useState} from "react";
// All english words
import words from "an-array-of-english-words"
import * as PropTypes from "prop-types";
import {unstable_batchedUpdates} from "react-dom";


let pdf = {"a": 4, "b": 2, "c": 2, "d": 2, "e": 3, "f": 2, "g": 2, "h": 3, "i": 3, "j": 2, "k": 2, "l": 2, "m": 2, "n": 2, "o": 2, "p": 2, "q": 1, "r": 2, "s": 3, "t": 3, "u": 4, "v": 2, "w": 2, "x": 1, "y": 2, "z": 1}

let LETTERS = "abcdefghijklmnopqrstuvwxyz";

// TODO: Host can end game
// TODO: We need to / we are going to assume sync'd state between clients
// TODO: Please batch the state updates to avoid calling firestore so many times
export default function GamePage(props) {
    // Max of 100, up to host to maintain

    // Start out with some (20) initial letters, selected by the host
    let [gridItems, setGridItems] = useState([])
    let [handledIdx, setHandledIdx] = useState([])

    function set_initial_letters(new_letters) {
        let idx=0;
        new_letters.forEach((letter)=>
            {
                setDoc(doc(db, "games", props.roomID, "letters", String(idx)), {
                    "letter": letter
                })
                idx += 1
            }
        )
    }


    function handle_new_letters(doc, local_handled) {
        // Could be out of order!
        if(!handledIdx.includes(parseInt(doc.id)) && !local_handled.includes(parseInt(doc.id))) {
            console.log("Set called!")
            console.log(parseInt(doc.id))
            setGridItems([...gridItems, doc.data()["letter"]])
            setHandledIdx([...handledIdx, parseInt(doc.id)])
            local_handled.push(parseInt(doc.id))
        }
    }

    function add_new_letter_host() {
        const letter = LETTERS[Math.floor(Math.random()*LETTERS.length)]
        console.log(handledIdx)
        console.log(Math.max(...handledIdx))
        setDoc(doc(db, "games", props.roomID, "letters", String(Math.max(...handledIdx))), {
            "letter": letter
        })
    }

    if(gridItems.length===0 && props.host) {
        let grid_items = []
        for(let i=0; i<20; i++) {
            grid_items.push(LETTERS[Math.floor(Math.random()*LETTERS.length)])
        }
        set_initial_letters(grid_items)
        // setInterval(add_new_letter_host, 3000)
    }


    const letters_query = query(collection(db, "games", props.roomID, "letters"))

    let local_idx_handled = []
    console.log("before")
    console.log(handledIdx)
    unstable_batchedUpdates(() => {
            onSnapshot(letters_query, (query) => query.forEach((doc) => {
                handle_new_letters(doc, local_idx_handled)
            }))
        }
    )
    console.log("after")
    console.log(handledIdx)


    // If host, publish letters to collection "letters" with timestamp
    // Clients keep track of timestamps they have consumed up to so that they don't consume same letter twice

    // Clients publish which tokens they have used and timestamp
    // Score when client successfully consumes characters
    return (
        <div className={"name-page-entry"}>
            <h1>{props.roomID}</h1>
            <Grid container spacing={2}>
                {gridItems.map((item)=>
                    <Grid item xs={1}>
                        <Button variant={"outlined"} >{item}</Button>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}