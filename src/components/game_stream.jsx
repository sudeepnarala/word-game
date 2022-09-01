import {Box, Typography} from "@mui/material";
import {useRef} from "react";

export default function GameStream({messages}) {
    return (
        <Box className={"game-stream"} sx={{ border: 1 }}>
            {messages.map(({name, result, word})=>{
                if(result==="invalid") {
                    return (
                        <Typography color={"red"}>
                            {name + " entered the word \"" + word+"\" which is on the board but isn't a word"}
                        </Typography>
                    )
                }
                else if(result === "no_letters") {
                    return (
                        <Typography color={"red"}>
                            {name + " entered the word \"" + word+"\" which isn't on the board"}
                        </Typography>
                    )
                }
                else if(result === "valid") {
                    return (
                        <Typography color={"green"}>
                            {name + " got the word \"" + word+"\""}
                        </Typography>
                    )
                }
                else if(result === "not_enough_letters") {
                    return (
                        <Typography color={"red"}>
                            {name + " entered the word \"" + word+"\" which is shorter than the minimum size"}
                        </Typography>
                    )
                }
            })}
        </Box>
    )
}