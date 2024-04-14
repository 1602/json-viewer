import './App.css';
import { JsonViewer } from './JsonViewer.js';
import data from './MOCK_DATA.json';


function App() {

    return (
        <>
            <JsonViewer>{ JSON.stringify(data) }</JsonViewer>
        </>
    )
}

export default App;
