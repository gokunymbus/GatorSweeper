import * as languages from '../languages/index';
export default function () {
    const lang = navigator.language;
    let foundCode;

    switch (true) {
        case /^en\b/.test(lang):
            foundCode = "en";
            break;

        case /^es\b/.test(lang):
            foundCode = "es";
            break;

        case /^de\b/.test(lang):
            foundCode = "de";
            break;

        case /^fr\b/.test(lang):
            foundCode = "fr";
            break;

        case /^ja\b/.test(lang):
            foundCode = "ja";
            break;

        case /^ko\b/.test(lang):
            foundCode = "ko";
            break;
        
        case /^ru\b/.test(lang):
            foundCode = "ru";
            break;
        
        case /^sv\b/.test(lang):
            foundCode = "sv";
            break;

        case /^uk\b/.test(lang):
            foundCode = "uk";
            break;
    
        case /^vi\b/.test(lang):
            foundCode = "vi";
            break;

        default:
            // Default to english
            foundCode = "en";
            break;
    }

    return languages[foundCode];
}