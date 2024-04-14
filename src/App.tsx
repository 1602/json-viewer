import './App.css';
import { JsonViewer } from './JsonViewer.js';
import data from './MOCK_DATA.json';
import repos from './GITHUB_REPOS.json';


function App() {

    return (
        <>
            <JsonViewer>{ JSON.stringify(data) }</JsonViewer>
            <JsonViewer>{ JSON.stringify(repos) }</JsonViewer>
        </>
    )
}

export default App;
