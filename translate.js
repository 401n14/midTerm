// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

// Create function to translate message before console.logging on 'message' and 'new user' events
// const testInput = 'Hola Mundo';
// console.log('Detected language input: ', testInput);

// Detects the language. "text" can be a string for detecting the language of
// a single piece of text, or an array of strings for detecting the languages
// of multiple texts.
async function detectLanguage(inputLanguage) {
  let [detections] = await translate.detect(inputLanguage);
  detections = Array.isArray(detections) ? detections : [detections];
  console.log('Detected language: ', detections[0].language);
  return detections[0].language;
}

// let detect = detectLanguage(testInput);

// const text = 'Hello, World!';
// console.log('Test input language: ', text);
// const target = 'The target language, e.g. ru';

async function translateText(text, targetLanguage) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let lang = await targetLanguage;
  let [translations] = await translate.translate(text, lang);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Input translation: ', translations[0]);
  return translations[0];
}

// translateText(text, detect);

module.exports = { detectLanguage, translateText };
