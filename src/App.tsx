import './App.css';
import { JsonViewer } from './JsonViewer.js';
import data from './MOCK_DATA.json';
import repos from './GITHUB_REPOS.json';
import schema from './schema.json';

function App() {
    return (
        <>
            <JsonViewer>{ JSON.stringify(data) }</JsonViewer>
            <JsonViewer>{ JSON.stringify(repos) }</JsonViewer>
            <JsonViewer>{ JSON.stringify(schema) }</JsonViewer>
        </>
    )
}

export default App;
