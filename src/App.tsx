import './App.css';
import { JsonViewer } from './JsonViewer.js';
import { useState } from 'react';
import data from './MOCK_DATA.json';
import repos from './GITHUB_REPOS.json';
import schema from './schema.json';

function App() {
    const [name, setName] = useState('');

    return (
        <>
            <JsonViewer>{ JSON.stringify(data) }</JsonViewer>
            <JsonViewer>{ JSON.stringify(repos) }</JsonViewer>
            <JsonViewer>{ JSON.stringify(schema) }</JsonViewer>
            <input value={ name } onInput={ (e) => setName(e.target.value) } />
            <JsonViewer>{ JSON.stringify({ name }) }</JsonViewer>
        </>
    );
}

export default App;
