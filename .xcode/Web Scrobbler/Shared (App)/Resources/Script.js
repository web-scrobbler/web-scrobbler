function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "Web Scrobbler’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "Web Scrobbler’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on Web Scrobbler’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);

let curPage = 0;
const totalPages = 4;

function getPageWrapper() {
    return document.querySelector(".page-wrapper");
}

function getWidth() {
    const pageWrapper = getPageWrapper();
    const boundingBox = pageWrapper.getBoundingClientRect();
    return boundingBox.width;
}

function prev() {
    const pageWrapper = getPageWrapper();
    const width = getWidth();
    if (curPage > 0) {
        curPage--;
    }
    pageWrapper.scroll({left: width * curPage, top: 0, behavior: "smooth"});
}

function next() {
    const pageWrapper = getPageWrapper();
    const width = getWidth();
    if (curPage < totalPages - 1) {
        curPage++;
    }
    pageWrapper.scroll({left: width * curPage, top: 0, behavior: "smooth"});
}

document.getElementById("prev").addEventListener("click", prev);
document.getElementById("next").addEventListener("click", next);
window.addEventListener("swiped-left", next);
window.addEventListener("swiped-right", prev);

