import {TextField} from "@mui/material";
import {db} from '../word-game-firestore';
import { doc, setDoc, onSnapshot, query, collection } from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
// All english words
import words from "an-array-of-english-words"
import Board from "../components/board";
import Scores from "../components/scores";
import GameStream from "../components/game_stream";

let letters = "aaaaaaaabbccddeeeeeffggghhhiiiijjkklllmmmmnnnoooooppqqrrrsssssttuuuvvwwxxyyzz%"
let each_epoch_num = 5
let total_letters = 30
let host_epoch_seconds = 5
let epoch_limit = total_letters/each_epoch_num-1

export default function GamePage({roomID, host, name, playerNames}) {
    let [currentLetters, setCurrentLetters] = useState([])
    let [hostEpoch, setHostEpoch] = useState(0)
    let [epoch, setEpoch] = useState(0)
    let [removeEpoch, setRemoveEpoch] = useState(0)
    let [playerRemoveEpochs, setPlayerRemoveEpochs] = useState(Array(playerNames.length).fill(0))
    let [playerScores, setPlayerScores] = useState(Array(playerNames.length).fill(0))
    let [messages, setMessages] = useState([])
    let word_field_ref = useRef()
    console.log(
        {currentLetters, hostEpoch, epoch, removeEpoch, playerRemoveEpochs, playerScores, messages}
    )
    useEffect(()=>{setTimeout(addLetters, host_epoch_seconds*1000)}, [hostEpoch])

    let currentLettersDict = {}
    for(const letter of letters) {
        currentLettersDict[letter] = currentLetters.filter(x => x === letter).length
    }

    let add_letters_doc_ref = doc(db, "games", roomID, "add_letters", hostEpoch.toString())
    let read_letters_doc_ref = doc(db, "games", roomID, "add_letters", epoch.toString())
    let remove_letters_doc_ref = doc(db, "games", roomID, "remove_letters", "BLANK", name, removeEpoch.toString())


    function getRandomLetters(num) {
        let n = 0
        let ret = []
        while(n < num) {
            ret.push(letters[Math.floor(Math.random()*letters.length)])
            n += 1
        }
        return ret
    }
    // Add letters from host
    function addLetters() {
        if(host) {
            let letters = getRandomLetters(5)
            console.log("Adding letters")
            console.log(hostEpoch)
            setDoc(add_letters_doc_ref, {
                "letters": letters
            })
            if(hostEpoch <= epoch_limit) {
                setHostEpoch(hostEpoch+1)
            }
        }
    }


    function processNewLetters(document_snapshot) {
        if(document_snapshot.get("letters")) {
            // Only enter this when new letters for us to consume
            console.log("Setting current letters")
            setCurrentLetters([...currentLetters, ...document_snapshot.get("letters")])
            setEpoch(epoch+1)
        }
    }
    if(epoch <= epoch_limit) {
        onSnapshot(read_letters_doc_ref, (document_snapshot)=>processNewLetters(document_snapshot))
    }

    function tryWord(word) {
        word = word.toLowerCase()
        // Check to see letters exist
        let word_list_form = [...word]
        let word_dict = {}
        for(const letter of word_list_form) {
            word_dict[letter] = word_list_form.filter(x=>x===letter).length
        }
        for(const letter of letters) {
            if(currentLettersDict[letter] - word_dict[letter] < 0) {
                let allMessages = [{name: "You", result: "no_letters", word: word}, ...messages]
                setMessages(allMessages)
                return
            }
        }
        if(words.includes(word)) {
            // Publish this word so other gamers can remove
            let allMessages = [{name: "You", result: "valid", word: word}, ...messages]
            setMessages(allMessages)
            setDoc(remove_letters_doc_ref, {
              "word": word
            })
            setRemoveEpoch(removeEpoch+1)
            return
        }
        let allMessages = [{name: "You", result: "invalid", word: word}, ...messages]
        setMessages(allMessages)
    }

    function checkEnter(e) {
        if(e.key === "Enter") {
            tryWord(word_field_ref.current.value)
            word_field_ref.current.value = ""
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
                if(playerNames[idx] !== name) {
                    let allMessages = [{name: playerNames[idx], result: "valid", word: word}, ...messages]
                    setMessages(allMessages)
                }
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
            <div className={"game-page-grid-container"}>
                <div className={"board-item"}>
                    <Board letters={currentLetters} />
                </div>
                <div className={"scores-item"}>
                    <Scores names={playerNames} scores={playerScores}/>
                </div>
                <div className={"word-entry-item"}>
                    <TextField inputRef={word_field_ref} variant="outlined" label="Enter Word!" onKeyPress={checkEnter} autoComplete={"off"}/>
                </div>
                <div className={"game-stream-item"}>
                    <GameStream messages={messages} />
                </div>
            </div>
        </div>
    );
}