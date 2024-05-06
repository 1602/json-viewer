import ReactDOM from "react-dom/client";
import { JsonViewer } from './JsonViewer.js';

export class JsonViewerWebComponent extends HTMLElement {
    private valueProp: string;
    private appRoot: ReactDOM.Root;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.valueProp = '';
        this.appRoot = ReactDOM.createRoot(this.shadowRoot as ShadowRoot);
    }

    connectedCallback() {
        const jsonString = this.getAttribute('value') || this.textContent || '';
        if (typeof jsonString !== 'string') {
          return this.appRoot.render(`json-viewer expects value to be string, got ${typeof jsonString}`);
        }
        this.appRoot.render(<JsonViewer>{ jsonString }</JsonViewer>);
    }

    get value() {
        return this.valueProp;
    }

    set value(val) {
        this.valueProp = val;
        this.appRoot.render(<JsonViewer>{ val }</JsonViewer>);
    }

}
