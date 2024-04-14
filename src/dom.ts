

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
