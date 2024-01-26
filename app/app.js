// Created by Dayu Wang (dwang@stchas.edu) on 2022-05-12

// Last updated by Dayu Wang (dwang@stchas.edu) on 2024-01-26


/** Restores all the buttons in the document to their initial states. */
function restoreButtons() {
    document.getElementById("paste").style.backgroundColor = "#2c634c";
    document.getElementById("copy-input").style.backgroundColor = "#2c634c";
    document.getElementById("copy-replacement").style.backgroundColor = "#b60200";
    document.getElementById("copy-google-drive-view-link").style.backgroundColor = "#b60200";
    document.getElementById("copy-google-drive-download-link").style.backgroundColor = "#b60200";
    document.getElementById("copy-onedrive-download-link").style.backgroundColor = "#b60200";
    document.getElementById("copy-canvas-download-link").style.backgroundColor = "#b60200";
    document.getElementById("generate-code").style.backgroundColor = "#2c634c";
}

/** Clears the access code. */
function clearAccessCode() { document.getElementById("access-code").value = ""; }

/** Shows Google Drive URLs in the document.
    [Note] Google no longer supports the direct view and download URLs since 2024-01-02.
    @param {string} text - a (possible) Google Drive share URL
*/
function showGoogleDriveUrls(text) {
    const urls = googleUrls(text);
    document.getElementById("google-drive-view-link").value = urls === null ? "" : urls.view;
    document.getElementById("google-drive-download-link").value = urls === null ? "" : urls.download;
}

/** Shows business OneDrive direct download URL in the document.
    @param {string} text - a (possible) business OneDrive share URL
*/
function showOneDriveUrl(text) {
    const url = onedriveUrl(text);
    document.getElementById("onedrive-download-link").value = url === null ? "" : url.download;
}

/** Shows Canvas download URL in the document.
    @param {string} text - a (possible) Canvas preview URL
*/
function showCanvasUrl(text) {
    const url = canvasUrl(text);
    document.getElementById("canvas-download-link").value = url === null ? "" : url.download;
}

/** Updates the document when user pastes some text to the input textbox. */
function pasteToInput() {
    restoreButtons();
    clearAccessCode();
    document.getElementById("paste").style.backgroundColor = "blue";
    navigator.clipboard.readText().then(text => {
        document.getElementById("input-text").value = text;
        // Generate Google Drive URLs.
        showGoogleDriveUrls(text);
        // Generate OneDrive URL.
        showOneDriveUrl(text);
        // Generate Canvas URL.
        showCanvasUrl(text);
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
    showGoogleDriveUrls(text);
    // Generate OneDrive direct download URL.
    showOneDriveUrl(text);
    // Generate Canvas download URL.
    showCanvasUrl(text);
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

/** Copies the Google Drive view URL.
    [Note] Google no longer supports the direct view and download URLs since 2024-01-02.
*/
function copyGoogleDriveViewUrl() {
    navigator.clipboard.writeText(document.getElementById("google-drive-view-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-google-drive-view-link").style.backgroundColor = "blue";
    });
}

/** Copies the Google Drive download URL.
    [Note] Google no longer supports the direct view and download URLs since 2024-01-02.
*/
function copyGoogleDriveDownloadUrl() {
    navigator.clipboard.writeText(document.getElementById("google-drive-download-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-google-drive-download-link").style.backgroundColor = "blue";
    });
}

/** Copies the OneDrive view URL. */
function copyOneDriveDownloadUrl() {
    navigator.clipboard.writeText(document.getElementById("onedrive-download-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-onedrive-download-link").style.backgroundColor = "blue";
    });
}

/** Copies the Canvas download URL. */
function copyCanvasDownloadUrl() {
    navigator.clipboard.writeText(document.getElementById("canvas-download-link").value).then(() => {
        restoreButtons();
        clearAccessCode();
        document.getElementById("copy-canvas-download-link").style.backgroundColor = "blue";
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
    document.getElementById("copy-google-drive-view-link").addEventListener("click", () => { copyGoogleDriveViewUrl(); });
    document.getElementById("copy-google-drive-download-link").addEventListener("click", () => { copyGoogleDriveDownloadUrl(); });
    document.getElementById("copy-onedrive-download-link").addEventListener("click", () => { copyOneDriveDownloadUrl(); });
    document.getElementById("copy-canvas-download-link").addEventListener("click", () => { copyCanvasDownloadUrl(); });
    document.getElementById("generate-code").addEventListener("click", () => { copyAccessCode(); });
    // Add key up listeners.
    document.onkeyup = function(e) {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toUpperCase() === "V") { pasteToInput(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "U") { copyReplacementText(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "L") { copyGoogleDriveViewUrl(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") { copyGoogleDriveDownloadUrl(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "Q") { copyOriginalInput(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "H") { copyOneDriveDownloadUrl(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === ":") { copyCanvasDownloadUrl(); }
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "?") { copyAccessCode(); }
        if (e.key.toUpperCase() === "TAB") {
            restoreButtons();
            clearAccessCode();
            document.getElementById("input-text").focus();
            document.getElementById("input-text").select();
        }
    };
});