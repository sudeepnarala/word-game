import logo from './logo.svg';
import './App.css';
import PageMuxer from './control/PageMuxer';


// TODO: Remove inactivate players (maybe we can't do that for now)

function App() {
  return (
    <div className="App">
      <header className="App-header">
          The Word Game!
      </header>
      <PageMuxer />

    </div>
  );
}

export default App;
