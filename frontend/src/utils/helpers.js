import { current } from "@reduxjs/toolkit";

// prevent default behavior for all forms and links with href="#"
export const preventDefault = () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => e.preventDefault());
    });
    document.querySelectorAll('a[href="#"]').forEach(a => {
        a.addEventListener('click', e => e.preventDefault());
    });
}

export const truncateAddress = (address) => {
    //
    return address.slice(0,5)+'...'+address.slice(-4)
}

export const getCurrentGameweek = (gameweeks) => {
    const currentTime = Date.now() / 1000;
    // loop through gameweeks and find current
    for (const gameweek of gameweeks) {
        if (currentTime <= gameweek.end) {
            return gameweek;
        }
    }

    return null; // No current gameweek found
}