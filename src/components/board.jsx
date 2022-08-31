import {Paper, Grid} from "@mui/material";

export default function Board({ letters }) {
    // grid itself is just 10 by 5 MUI Papers
    let actual_letters = [...letters, ...Array(50-letters.length).fill("")]
    return (
        <Grid container spacing={"1vw"}>
            {
                actual_letters.map((letter) =>
                    <Grid item>
                        <Paper className={"letter-container"}>{letter}</Paper>
                    </Grid>)
            }
        </Grid>
    )
}