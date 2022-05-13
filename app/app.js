// Created by Dayu Wang (dwang@stchas.edu) on 2022-05-12

// Last updated by Dayu Wang (dwang@stchas.edu) on 2022-05-13


/** Restores all the buttons in the document to their initial states. */
function restoreButtons() {
    document.getElementById("paste").style.backgroundColor = "darkcyan";
    document.getElementById("copy-input").style.backgroundColor = "darkcyan";
    document.getElementById("copy-replacement").style.backgroundColor = "orangered";
    document.getElementById("copy-view-link").style.backgroundColor = "orangered";
    document.getElementById("copy-download-link").style.backgroundColor = "orangered";
    document.getElementById("generate-code").style.backgroundColor = "seagreen";
}

/** Clears the access code. */
function clearAccessCode() { document.getElementById("access-code").value = ""; }

/** Shows Google Drive URLs in the document.
 @param {string} text: a (possible) Google Drive share URL
 */
function showUrls(text) {
    const urls = googleUrls(text);
    document.getElementById("view-link").value = urls === null ? "" : urls.view;
    document.getElementById("download-link").value = urls === null ? "" : urls.download;
}

/** Updates the document when user pastes some text to the input textbox. */
function pasteToInput() {
    restoreButtons();
    clearAccessCode();
    document.getElementById("paste").style.backgroundColor = "blue";
    navigator.clipboard.readText().then(text => {
        document.getElementById("input-text").value = text;
        // Generate Google Drive URLs.
        showUrls(text);
        // Generate replacement text.
        text = replaceInvalidCharacters(text);
        document.getElementById("replacement-text").value = text;
    });
}

/** Echoes the user input. */
function synchronizeInput() {
    restoreButtons();
    clearAccessCode();
    let text = document.getElementById("input-text").value;
    // Generate Google Drive URLs.
    showUrls(text);
    // Generate replacement text.
    text = replaceInvalidCharacters(text);
    document.getElementById("replacement-text").value = text;
}

/** Copies the original user input text to the clipboard. */
function copyOriginalInput() {
    navigator.clipboard.writeText(document.getElementById("input-text").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-input").style.backgroundColor = "blue";
    });
}

/** Copies the replacement text to the clipboard. */
function copyReplacementText() {
    navigator.clipboard.writeText(document.getElementById("replacement-text").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-replacement").style.backgroundColor = "blue";
    });
}

/** Copies the Google Drive view URL. */
function copyViewUrl() {
    navigator.clipboard.writeText(document.getElementById("view-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-view-link").style.backgroundColor = "blue";
    });
}

/** Copies the Google Drive download URL. */
function copyDownloadLink() {
    navigator.clipboard.writeText(document.getElementById("download-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-download-link").style.backgroundColor = "blue";
    });
}

/** Generates an access code and copies it to the clipboard. */
function copyAccessCode() {
    document.getElementById("access-code").value = generateAccessCode();
    navigator.clipboard.writeText(document.getElementById("access-code").value).then(() => {
        restoreButtons();
        document.getElementById("generate-code").style.backgroundColor = "blue";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Set placeholders for all input textboxes.
    for (let inputTextbox of document.getElementsByTagName("input")) {
        inputTextbox.setAttribute("placeholder", "N/A");
    }

    // Synchronize user input.
    document.getElementById("input-text").addEventListener("keyup", function(e) {
        if (!e.ctrlKey && e.key.toUpperCase() !== "CONTROL" && e.key.toUpperCase() !== "SHIFT" && e.key.toUpperCase() !== "ALT") {
            synchronizeInput();
        }
    });
    // Add mouse click listeners.
    document.getElementById("paste").addEventListener("click", () => { pasteToInput(); });
    document.getElementById("copy-input").addEventListener("click", () => { copyOriginalInput(); });
    document.getElementById("copy-replacement").addEventListener("click", () => { copyReplacementText(); });
    document.getElementById("copy-view-link").addEventListener("click", () => { copyViewUrl(); });
    document.getElementById("copy-download-link").addEventListener("click", () => { copyDownloadLink(); });
    document.getElementById("generate-code").addEventListener("click", () => { copyAccessCode(); });
    // Add key up listeners.
    document.onkeyup = function(e) {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toUpperCase() === "V") { pasteToInput(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "U") { copyReplacementText(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "L") { copyViewUrl(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") { copyDownloadLink(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "Q") { copyOriginalInput(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "?") { copyAccessCode(); }
        if (e.key.toUpperCase() === "TAB") {
            restoreButtons();
            clearAccessCode();
            document.getElementById("input-text").focus();
            document.getElementById("input-text").select();
        }
    };
});