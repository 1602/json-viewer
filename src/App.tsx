import './App.css';
import { JsonViewer } from './JsonViewer.js';


function App() {

    return (
        <>
            <JsonViewer>{ '{"foo": "bar"}' }</JsonViewer>
        </>
    )
}

export default App;
