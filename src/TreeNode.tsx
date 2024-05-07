import React from 'react';

const ARRAY_CHUNK_LIMIT = 100;

export type JsonValue = object|Array<JsonValue>|string|number|null;

export type TreeNodeProps = {
    k?: string,
    value: JsonValue,
    path: string,
    onSelectedNode: (path: string) => void,
    displayIndexOffset?: number,
    skipPreview?: boolean,
    selected?: string,
    lazy?: boolean,
};


export class TreeNode extends React.Component<TreeNodeProps, { expanded: boolean, rendered: boolean }> {

    liRef: React.RefObject<HTMLLIElement>;

    state: { expanded: boolean, rendered: boolean }

    constructor(props: TreeNodeProps) {
        super(props);

        const { lazy } = props;

        this.liRef = React.createRef();
        this.state = {
            expanded: false,
            rendered: lazy ? false : true,
        }
    }

    shouldComponentUpdate(nextProps: TreeNodeProps, nextState: { expanded: boolean }) {
        const isSelected = this.props.selected === this.props.path;
        const willBeSelected = nextProps.selected === nextProps.path;

        if (isSelected !== willBeSelected) {
            return true;
        }

        if (nextProps.selected?.indexOf(nextProps.path) === 0) {
            return true;
        }

        if (this.props.selected?.indexOf(this.props.path) === 0) {
            return true;
        }

        if (this.state.expanded !== nextState.expanded) {
            return true;
        }

        return false;
    }

    componentDidUpdate() {
        const { selected, path } = this.props;
        const isSelected = selected === path;
        if (isSelected && this.liRef.current) {
            // this.liRef.current.focus();
        }
    }

    render() {
        const { lazy, selected, value, k, path, onSelectedNode, displayIndexOffset = 0, skipPreview = false } = this.props;
        const { expanded, rendered } = this.state;
        const isParent = typeof value === 'object' && value !== null && Object.keys(value).length > 0;
        const isSelected = selected === path;

        const className = [
            { on: isParent, value: 'parent' },
            { on: expanded, value: 'expanded' },
            { on: isSelected, value: 'selected' },
        ].filter(({ on }) => on).map(({value}) => value).join(' ');

        const setExpanded = (expanded: boolean) => {
            this.setState({ expanded, rendered: true });
        };

        function handleClick() {
            if (isParent) {
                setExpanded(!expanded);
            }
            onSelectedNode(path);
        }

        const valueElement = (() => {switch (typeof value) {
            case 'string': {
                return <span key={ k } className="string-value">{ `"${value}"` }</span>;
            }
            case 'number': {
                return <span key={ k } className="num-value">{ value }</span>;
            }
            case 'boolean': {
                return <span key={ k } className="bool-value">{ value ? 'true' : 'false' }</span>;
            }
            case 'object': {
                if (value === null) {
                    return <span key={ k } className="null-value">{'null'}</span>;
                }
                if (Array.isArray(value)) {
                    return <span key={ k }>{previewValue(value)}</span>;
                }
                return <span key={ k }>{previewValue(value)}</span>;
            }
            default: {
                return <span key={ k }>{'invalid json value'}</span>;
            }
        }})();

        const keyValuePair = (<>
            { k ? (<><span className="key-name">{ k }</span><span className="delim">{': '}</span></>) : ''}
            { valueElement }
        </>);

        let children;
        if (isParent && rendered) {
            if (Array.isArray(value) && value.length > ARRAY_CHUNK_LIMIT) {
                children = [];
                for (let i = 0; i < value.length; i += ARRAY_CHUNK_LIMIT) {
                    const arrayChunkLabel = `[${i} … ${Math.min(value.length - 1, i + ARRAY_CHUNK_LIMIT - 1)}]`;
                    children.push(
                        <TreeNode
                            lazy={ lazy }
                            key={ path + '/' + arrayChunkLabel }
                            k={ arrayChunkLabel }
                            displayIndexOffset={ i }
                            skipPreview={ true }
                            value={ value.slice(i, i + ARRAY_CHUNK_LIMIT) }
                            path={ path + '/' + arrayChunkLabel }
                            selected={ selected }
                            onSelectedNode={ onSelectedNode } />
                    );
                }
            } else {
                children = Object.entries(value).map(([k, v]) => {
                    if (Array.isArray(value)) {
                        k = (parseInt(k, 10) + displayIndexOffset).toString();
                    }
                    return <TreeNode
                        lazy={ lazy }
                        key={ path + '/' + k }
                        selected={ selected }
                        k={ k }
                        value={ v }
                        path={ path + '/' + k }
                        onSelectedNode={ onSelectedNode } />
                })
            }
        }

        return (<><li
            tabIndex={ isSelected ? 1 : undefined }
            role="treeitem"
            aria-selected={ isSelected ? true : undefined }
            aria-expanded={ expanded ? true : undefined }
            ref={ isSelected ? this.liRef : null }
            json-path={ path }
            className={ className }
            onClick={ handleClick }
            // onFocus={ () => onSelectedNode(path) }
        >
            <span className="key-value-pair">
                { skipPreview ? k : keyValuePair }
            </span>
            <div className="fill" />
        </li>
        {isParent ? (
            <ol role="group" className={ expanded ? "expanded" : "" }>{ children }</ol>
        ): ''}
        </>
        )
    }

}

const PREVIEW_CACHE = new Map();

function previewValue(value: JsonValue, depth = 2): string {
    if (depth !== 2) {
        return calc();
    }
    const cached = PREVIEW_CACHE.get(value);
    if (cached) {
        return cached;
    }

    const res = calc();
    PREVIEW_CACHE.set(value, res);
    return res;

    function calc() {
        switch (typeof value) {
            case 'object': {
                if (Array.isArray(value)) {
                    if (depth === 0) {
                        return `[…]`;
                    }
                    const len = value.length;
                    return `[${ value.slice(0, 2).map((v) => previewValue(v, depth - 1)).join(', ') }${ len > 2 ? ',…' : ''}]`;
                }

                if (value === null) {
                    return 'null';
                }

                if (depth === 0) {
                    return `{…}`;
                }

                const entries = Object.entries(value as object);
                const len = entries.length;
                return `{${ entries.slice(0, 2).map(([k, v]) => `${k}: ${previewValue(v as JsonValue, depth - 1)}`).join(', ')}${len > 2 ? ',…' : ''}}`;
            }
            case 'string': {
                return `"${value.substring(0, 100)}"`;
            }
            default: {
                return value.toString();
            }
        }
        return typeof value;
    }
}

