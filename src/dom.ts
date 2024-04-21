

export function clickOn(el: Element) {
    const theEvent = document.createEvent('MouseEvent');
    theEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(theEvent);
}

export function findNextVisibleListItem(el: Element) {
    if (!el.nextElementSibling) {
        return findNextVisibleListItem(el.parentElement!);
    }

    if (el.nextElementSibling.tagName === 'LI') {
        return el.nextElementSibling;
    }

    if (el.nextElementSibling.tagName === 'OL') {
        if (el.nextElementSibling.checkVisibility()) {
            return el.nextElementSibling.firstElementChild;
        }

        return findNextVisibleListItem(el.nextElementSibling);
    }
}

export function findPrevVisibleListItem(el: Element) {
    if (!el.previousElementSibling) {
        return findPrevVisibleListItem(el.parentElement!);
    }

    if (el.previousElementSibling.tagName === 'LI') {
        return el.previousElementSibling;
    }

    if (el.previousElementSibling.tagName === 'OL') {
        if (el.previousElementSibling.checkVisibility()) {
            let { lastElementChild } = el.previousElementSibling;
            while (lastElementChild && lastElementChild.tagName === 'OL' && lastElementChild.checkVisibility()) {
                lastElementChild = lastElementChild.lastElementChild;
            }

            if (lastElementChild && lastElementChild.tagName === 'OL') {
                return lastElementChild.previousElementSibling;
            }

            return lastElementChild;
        }

        return findPrevVisibleListItem(el.previousElementSibling);
    }
}

export function isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const scrollableParent = getScrollParent(element);
    if (!scrollableParent) {
        return true;
    }

    const result = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= scrollableParent.clientHeight
    );

    console.log('rect.bottom', rect.bottom, scrollableParent.clientHeight, scrollableParent.scrollTop, rect.bottom <= (scrollableParent.clientHeight + scrollableParent.scrollTop), result);
    // console.log('rect.right', rect.right, scrollableParent.clientWidth, scrollableParent.scrollLeft, rect.right <= (scrollableParent.clientWidth + scrollableParent.scrollLeft), result);

    return result;

}

const isScrollable = (node: Element) => {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return false
    }
    const style = getComputedStyle(node)
    return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
        const value = style.getPropertyValue(propertyName)
        return value === 'auto' || value === 'scroll'
    })
}

function getScrollParent(node: Element): Element {
    let currentParent = node.parentElement
    while (currentParent) {
        if (isScrollable(currentParent)) {
            return currentParent
        }
        currentParent = currentParent.parentElement
    }
    return document.scrollingElement || document.documentElement
}
