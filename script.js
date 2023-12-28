let currentQuote = '';
let currentAuthor = '';

document.addEventListener('DOMContentLoaded', () => {
  getQuote();
  document.getElementById('new-quote').addEventListener('click', getQuote);
  document.getElementById('lang-en').addEventListener('click', () => showQuote('en'));
  document.getElementById('lang-es').addEventListener('click', () => showQuote('es'));
});

function getQuote() {
  fetch('http://localhost:3000/quote')
    .then(response => response.json())
    .then(data => {
      currentQuote = data[0].q;
      currentAuthor = data[0].a;
      showQuote('en');
    })
    .catch(error => {
      console.error('Error al obtener la cita:', error);
    });
}

function showQuote(language) {
  if (language === 'es') {
    translateQuote(currentQuote, 'es').then(translatedText => {
      document.getElementById('quote').textContent = translatedText || currentQuote;
      document.getElementById('author').textContent = `- ${currentAuthor}`;
    }).catch(error => {
      document.getElementById('quote').textContent = currentQuote;
      document.getElementById('author').textContent = `- ${currentAuthor}`;
      console.error('Error al traducir la cita:', error);
    });
  } else {
    document.getElementById('quote').textContent = currentQuote;
    document.getElementById('author').textContent = `- ${currentAuthor}`;
  }
}

function translateQuote(text, targetLang) {
  return fetch('http://localhost:3000/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text, targetLang: targetLang })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => data.translatedText)
  .catch(error => {
    console.error('Error al traducir la cita:', error);
  });
}

