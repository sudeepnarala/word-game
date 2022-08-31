import {Table, TableCell, TableHead, TableRow, TableBody} from "@mui/material";

export default function Scores({names, scores}) {
    let names_scores = []
    for(let i=0; i < names.length; i++) {
        names_scores.push({name: names[i], score: scores[i]})
    }
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    names_scores.map(elem => <TableRow><TableCell>{elem.name}</TableCell><TableCell>{elem.score}</TableCell></TableRow>)
                }
            </TableBody>
        </Table>
    )
}