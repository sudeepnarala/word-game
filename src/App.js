// https://app.logo.com/
// https://stackoverflow.com/questions/59138677/how-to-turn-on-the-throwifnamespace-flag-in-react-js
import logo from './assets/logo.png';
import './App.css';
import PageMuxer from './control/PageMuxer';
import {Typography} from "@mui/material";


// TODO: Remove inactivate players, allow as host option

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <img className={"logo-item"} src={logo} height={"100%"}/>
          <div className={"description-item"}>
              <Typography sx={{"font-size": "5vh"}} fontFamily={"cursive"}>
                  Play With Your Friends!
              </Typography>
          </div>
      </header>
      <PageMuxer />

    </div>
  );
}

export default App;
