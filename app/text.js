// Created by Dayu Wang (dwang@stchas.edu) on 2022-05-12

// Last updated by Dayu Wang (dwang@stchas.edu) on 2024-11-05


/** Replaces invalid characters in a string to form a valid filename.
    @param {string} text - a string to process
    @returns {string} - a copy of the input string with all invalid characters replaced
*/
function replaceInvalidCharacters(text) {
    // Replace whitespaces with a single underscore.
    text = text.replace(/\s+/g, '_');
    // Replace slash ('/') characters with a single hyphen ('-').
    text = text.replace(/\/+/g, '-');
    // Remove other invalid characters.
    text = text.replace(/[<>:'"/\\|?*]+/g,'');
    return text;
}

/** Generates the Google Drive view URL and Google Drive download URL from a Google Drive share URL.
    [Note] Google no longer supports the direct view and download URLs since 2024-01-02.
    @param {string} text - a (possible) Google Drive share URL
    @returns {Object|null} -  an object containing the Google Drive view URL and Google Drive download URL;
                              or {null} if the input text is not a valid Google Drive share URL
*/
function googleUrls(text) {
    if (text.includes(String.raw`google.com`) && text.includes(String.raw`/d/`)) {
        // Extract the Google Drive document ID.
        const documentId = text.substring(text.indexOf(String.raw`/d/`) + 3, text.indexOf(String.raw`/d/`) + 36);
        return {
            'view': String.raw`https://drive.google.com/uc?export=view&id=` + documentId,
            'download': String.raw`https://drive.google.com/uc?export=download&id=` + documentId
        };
    }
    return null;
}

/** Generates the OneDrive direct download URL from a business OneDrive share URL.
    @param {string} text -  a (possible) business OneDrive share URL
    @returns {Object|null} -  an object containing the OneDrive direct download URL;
                              or {null} if the input text is not a valid business OneDrive share URL
*/
function onedriveUrl(text) {
    if (text.includes(String.raw`my.sharepoint.com`) && text.includes(String.raw`?e=`)) {
        return { 'download': text.substring(0, text.indexOf(String.raw`?e=`)) + String.raw`?download=1` };
    }
    return null;
}

/** Generates the Canvas URLs from a Canvas preview URL.
    @param {string} text - a (possible) Canvas preview URL
    @returns {Object|null} - an object containing the Canvas URLs;
                             or {null} if the input text is not a valid Canvas preview URL
*/
function canvasUrls(text) {
    if (text.includes(String.raw`stchas.instructure.com`) && text.match(/preview=\d+$/g) !== null) {
        const institution = String.raw`https://stchas.instructure.com`;  // St. Charles Community College
        if (text.includes(String.raw`courses`)) {
            const courseId = text.match(/(?<=courses\/)\d{4,}(?=\/files)/g)[0];
            const fileId = text.match(/(?<=preview=)\d{7,}$/g)[0];
            return {
                'img': String.raw`src='` + institution + String.raw`/courses/` + courseId + String.raw`/files/` + fileId + String.raw`/download'`,
                'href': institution + String.raw`/courses/` + courseId + String.raw`/files/` + fileId + String.raw`/download`
            };
        } else {
            const fileId = text.match(/(?<=preview=)\d{7,}$/g)[0];
            return {
                'img': String.raw`src='` + institution + String.raw`/files/` + fileId + String.raw`/download'`,
                'href': institution + String.raw`/files/` + fileId + String.raw`/download`
            };
        }
    }
    return null;
}

// [Waiting for Canvas to Fix the Bug] Left/right spacing of Canvas Latex equations cannot be rendered correctly.

// const urlCode = {
//     '!': String.raw`%21`,
//     ''': String.raw`%22`,
//     '#': String.raw`%23`,
//     '$': String.raw`%24`,
//     '%': String.raw`%25`,
//     '&': String.raw`%26`,
//     '\'': String.raw`%27`,
//     '(': String.raw`%28`,
//     ')': String.raw`%29`,
//     '*': String.raw`%2A`,
//     '+': String.raw`%2B`,
//     ',': String.raw`%2C`,
//     '-': String.raw`%2D`,
//     '.': String.raw`%2E`,
//     '/': String.raw`%2F`,
//     ':': String.raw`%3A`,
//     ';': String.raw`%3B`,
//     '<': String.raw`%3C`,
//     '=': String.raw`%3D`,
//     '>': String.raw`%3E`,
//     '?': String.raw`%3F`,
//     '@': String.raw`%40`,
//     '[': String.raw`%5B`,
//     '\\': String.raw`%5C`,
//     ']': String.raw`%5D`,
//     '^': String.raw`%5E`,
//     '_': String.raw`%5F`,
//     '`': String.raw`%60`,
//     '{': String.raw`%7B`,
//     '|': String.raw`%7C`,
//     '}': String.raw`%7D`,
//     '~': String.raw`%7E`,
//     ' ': String.raw`%20`
// };
//
// /** Generates the Canvas Latex math equation element from a Latex equation.
//     @param {string} text - a (possible) Latex equation
//     @returns {Object|null} - an object containing the Canvas Latex math equation element;
//                              or {null} if the input text is not a valid Latex equation
// */
// function canvasLatexEquation(text) {
//     if (text.match(/^\\boldsymbol/g)) {
//         let latexElement = String.raw`<img style='border:none;margin:0;padding:0;vertical-align:middle;' src='/equation_images/`;
//         for (let i = 0; i < text.length; i++) {
//             if (text.at(i) in urlCode) { latexElement += urlCode[text.at(i)].replace(/%/g, String.raw`%25`); }
//             else { latexElement += text.at(i); }
//         }
//         return { 'html': latexElement + String.raw`?scale=1' class='equation_image' title='` + text + String.raw`' alt='N/A'>` };
//     }
//     return null;
// }

/** Generates a YouTube video short URL from a regular YouTube video URL.
    @param {string} text - a (possible) regular YouTube video URL
    @returns {Object|null} - an object containing a YouTube video short ULR;
                             or {null} if the input text is not a valid regular YouTube video URL
*/
function youTubeVideoShortUrl(text) {
    if (text.includes(String.raw`youtube.com`) && text.match(/\?v=[A-Za-z0-9_\-]+$/g)) {
        const videoId = text.match(/(?<=\?v=)[A-Za-z0-9_\-]+$/g);
        return { 'url': String.raw`https://youtu.be/` + videoId };
    }
    return null;
}

/** Generates a random access code for Canvas quizzes.
    @returns {string} - a random '4 letters + 4 digits' access code for Canvas quizzes
*/
function generateAccessCode() {
    const DIGITS = ['3', '4', '7', '8'];
    const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y'];
    let result = '';
    for (let i = 0; i < 4; i++) {
        const letterIndex = Math.floor(Math.random() * 22);
        result += LETTERS[letterIndex];
    }
    for (let j = 0; j < 4; j++) {
        const digitsIndex = Math.floor(Math.random() * 4);
        result += DIGITS[digitsIndex];
    }
    return result;
}