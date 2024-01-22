// Created by Dayu Wang (dwang@stchas.edu) on 2022-05-12

// Last updated by Dayu Wang (dwang@stchas.edu) on 2024-01-22


/** Replaces invalid characters in a string to form a valid filename.
    @param {string} text: a string to process
    @returns {string}: a copy of the input string with all invalid characters replaced
*/
function replaceInvalidCharacters(text) {
    // Replace whitespaces with a single underscore.
    text = text.replace(/\s+/g, '_');
    // Replace slash ('/') characters with a single hyphen ('-').
    text = text.replace(/\/+/g, '-');
    // Remove other invalid characters.
    text = text.replace(/[<>:"/\\|?*]+/g,'');

    return text;
}

/** Generates the Google Drive view URL and Google Drive download URL from a Google Drive share URL.
    @param {string} text: a (possible) Google Drive share URL
    @returns {Object|null}: an object containing the Google Drive view URL and Google Drive download URL;
                            or {null} if the input text is not a valid Google Drive share URL
*/
function googleUrls(text) {
    if (text.includes(String.raw`https://drive.google.com/file/d/`) && text.includes(String.raw`/view?usp=sharing`)) {
        const documentId = text.substring(32, 65);  // Extract the Google Drive document ID.
        return {
            "view": String.raw`https://drive.google.com/uc?export=view&id=` + documentId,
            "download": String.raw`https://drive.google.com/uc?export=download&id=` + documentId
        };
    }
    return null;
}

/** Generates the OneDrive view URL from a OneDrive share URL.
    @param {string} text: a (possible) OneDrive share URL
    @returns {Object|null}: an object containing the OneDrive view URL;
                            or {null} if the input text is not a valid OneDrive share URL
*/
function onedriveUrls(text) {
    if (text.includes(String.raw`my.sharepoint.com`) && text.includes(String.raw`?e=`)) {
        return {
            "view": text.substring(0, text.indexOf(String.raw`?e=`)) + String.raw`?download=1`
        };
    }
    return null;
}

/** Generates an access code.
    @returns {string}: a "3 letters + 3 digits" access code
*/
function generateAccessCode() {
    const DIGITS = ['3', '4', '7', '8'];
    const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y'];
    let result = "";
    for (let i = 0; i < 4; i++) {
        const letterIndex = Math.floor(Math.random() * 21);
        result += LETTERS[letterIndex];
    }
    for (let j = 0; j < 4; j++) {
        const digitsIndex = Math.floor(Math.random() * 3);
        result += DIGITS[digitsIndex];
    }
    return result;
}