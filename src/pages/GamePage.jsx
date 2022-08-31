import {Button, Card, Grid, TextField, Typography} from "@mui/material";
import {db} from '../word-game-firestore';
import { doc, setDoc, onSnapshot, query, collection } from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
// All english words
import words from "an-array-of-english-words"
import Board from "../components/board";
import Scores from "../components/scores";

let letters = "abcdefghijklmnopqrstuvwxyz"
let each_epoch_num = 5
let total_letters = 10
let host_epoch_seconds = 5
let epoch_limit = total_letters/each_epoch_num-1

export default function GamePage({roomID, host, name, playerNames}) {
    let [currentLetters, setCurrentLetters] = useState([])
    let [hostEpoch, setHostEpoch] = useState(0)
    let [epoch, setEpoch] = useState(0)
    let [removeEpoch, setRemoveEpoch] = useState(0)
    let [playerRemoveEpochs, setPlayerRemoveEpochs] = useState(Array(playerNames.length).fill(0))
    let [playerScores, setPlayerScores] = useState(Array(playerNames.length).fill(0))
    let word_field_ref = useRef()

    let currentLettersDict = {}
    for(const letter of letters) {
        currentLettersDict[letter] = currentLetters.filter(x => x === letter).length
    }

    console.log({hostEpoch, epoch})

    let add_letters_doc_ref = doc(db, "games", roomID, "add_letters", hostEpoch.toString())
    let read_letters_doc_ref = doc(db, "games", roomID, "add_letters", epoch.toString())
    let remove_letters_doc_ref = doc(db, "games", roomID, "remove_letters", "BLANK", name, removeEpoch.toString())


    function getRandomLetters(num) {
        let n = 0
        let ret = []
        while(n < num) {
            ret.push(letters[Math.floor(Math.random()*26)])
            n += 1
        }
        return ret
    }
    // Add letters from host
    if(host) {
        function addLetters() {
            let letters = getRandomLetters(5)
            console.log("Adding letters")
            setDoc(add_letters_doc_ref, {
                "letters": letters
            })
            setHostEpoch(hostEpoch+1)
        }
        if(hostEpoch <= epoch_limit) {
            setTimeout(addLetters, host_epoch_seconds*1000)
        }
    }

    function processNewLetter(document_snapshot) {
        if(document_snapshot.get("letters")) {
            // Only enter this when new letters for us to consume
            setCurrentLetters([...currentLetters, ...document_snapshot.get("letters")])
            setEpoch(epoch+1)
        }
    }
    if(epoch <= epoch_limit) {
        onSnapshot(read_letters_doc_ref, (document_snapshot)=>processNewLetter(document_snapshot))
    }

    function tryWord(word) {
        // Check to see letters exist
        let word_list_form = [...word]
        let word_dict = {}
        for(const letter of word_list_form) {
            word_dict[letter] = word_list_form.filter(x=>x===letter).length
        }
        for(const letter of letters) {
            if(currentLettersDict[letter] - word_dict[letter] < 0) {
                console.log("LETTERS NOT PRESENT!")
                return
            }
        }
        if(words.includes(word)) {
            console.log("FOUND A WORD!")
            // Publish this word so other gamers can remove
            setDoc(remove_letters_doc_ref, {
              "word": word
            })
            setRemoveEpoch(removeEpoch+1)
            return
        }
        console.log("NOT A WORD!")

    }

    function checkEnter(e) {
        if(e.key === "Enter") {
            tryWord(word_field_ref.current.value)
        }
    }

    function handleLetterRemoval(idx) {
        function innerHandleLetterRemoval(document_snapshot) {
            if(document_snapshot.get("word")) {
                let word = document_snapshot.get("word")
                // Remove letters, first instances
                let word_list_form = [...word]
                let word_dict = {}
                for(const letter of word_list_form) {
                    word_dict[letter] = word_list_form.filter(x=>x===letter).length
                }
                let new_current_letters = []
                for(const letter of currentLetters) {
                    if(letter in word_dict && word_dict[letter] > 0) {
                        word_dict[letter] -= 1
                    }
                    else {
                        new_current_letters.push(letter)
                    }
                }
                setCurrentLetters(new_current_letters)
                // Increment epoch and score
                let copyPlayerRemoveEpochs = [...playerRemoveEpochs]
                copyPlayerRemoveEpochs[idx] += 1
                setPlayerRemoveEpochs(copyPlayerRemoveEpochs)
                let copyPlayerScores = [...playerScores]
                copyPlayerScores[idx] += word.length
                setPlayerScores(copyPlayerScores)
                console.log(copyPlayerScores)
            }
        }
        return innerHandleLetterRemoval
    }

    playerNames.map((player_name, idx)=>
        onSnapshot(doc(db, "games", roomID, "remove_letters", "BLANK", player_name, playerRemoveEpochs[idx].toString()), (document_snapshot)=>handleLetterRemoval(idx)(document_snapshot))
    )
    // https://css-tricks.com/snippets/css/complete-guide-grid/#aa-important-terminology
    return (
        <div>
            <h1>{roomID}</h1>
            <div className={"game-page-grid-container"}>
                <div className={"board-item"}>
                    <Board letters={currentLetters} />
                </div>
                <div className={"scores-item"}>
                    <Scores names={playerNames} scores={playerScores}/>
                </div>
                <div className={"word-entry-item"}>
                    <TextField inputRef={word_field_ref} variant="outlined" label="Enter Word!" onKeyPress={checkEnter}/>
                </div>
            </div>
        </div>
    );
}