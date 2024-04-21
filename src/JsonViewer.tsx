import React from 'react';
import './JsonViewer.css';
import { TreeNode } from './TreeNode.js';
import { findNextVisibleListItem, findPrevVisibleListItem, clickOn, isInViewport } from './dom.js';

type JsonViewerProps = {
    children: string|string[];
}

export function JsonViewer({ children }: JsonViewerProps) {
    const [selectedNode, setSelectedNode] = React.useState('');
    const ref = React.useRef<HTMLDivElement>(null);
    const value = JSON.parse(typeof children === 'string' ? children : children.join(''));

    React.useEffect(() => {
        const { current } = ref;
        if (!current) {
            return;
        }

        current.addEventListener('keydown', onKeyDownHandler);

        return () => current.removeEventListener('keydown', onKeyDownHandler);

        function onKeyDownHandler(e: KeyboardEvent) {
            if (e.altKey || e.metaKey || e.ctrlKey) {
                return;
            }

            if (!current) {
                return;
            }

            const selectedElement = current.querySelector(':scope li.selected');
            if (!selectedElement) {
                select(current.firstElementChild?.firstElementChild);
                return;
            }

            switch (e.code) {
                case 'ArrowLeft': {
                    e.preventDefault();
                    if (selectedElement.getAttribute('aria-expanded')) {
                        clickOn(selectedElement);
                    } else {
                        select(selectedElement.parentElement?.previousElementSibling);
                    }
                }
                break;
                case 'ArrowRight': {
                    e.preventDefault();
                    if (!selectedElement.getAttribute('aria-expanded')) {
                        clickOn(selectedElement);
                    }
                }
                break;
                case 'ArrowDown':
                case 'KeyJ': {
                    e.preventDefault();
                    select(findNextVisibleListItem(selectedElement));
                }
                break;
                case 'ArrowUp':
                case 'KeyK': {
                    e.preventDefault();
                    select(findPrevVisibleListItem(selectedElement));
                }
                break;
            }
        }


    });

    return (
        <div ref={ ref } className="json-tree">
            <ol className="expanded" role="tree" tabIndex={ 0 }>
                <TreeNode lazy={ true } selected={ selectedNode } value={ value } key={ "root" } path="" onSelectedNode={ setSelectedNode } />
            </ol>
        </div>
    );

    function select(el?: Element|null) {
        if (el) {
            const path = el.getAttribute('json-path');
            if (path !== null) {
                setSelectedNode(path);
                // (el as HTMLElement).focus();
                // ref.current!.focus();
                if (el instanceof HTMLElement) {
                    if (!isInViewport(el)) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    }

}

