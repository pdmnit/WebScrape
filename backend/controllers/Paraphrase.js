const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const accessToken = 'rr2mlAjTfyYx10CSu0ctJYZFiQmCXrZ8';
const apiUrl = 'https://api.ai21.com/studio/v1/paraphrase';
const maxLength = 500;

async function paraphraseText(text) {
  let paraphrasedText = '';

  const splitTextIntoSentences = (text) => {
    return text.match(/[^.!?]+[.!?]/g) || [text];
  };

  const sentences = splitTextIntoSentences(text);

  let batch = '';
  for (const sentence of sentences) {
    if ((batch.length + sentence.length) > maxLength) {
      if (batch.length > 0) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: batch.trim(),
              style: 'formal'
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          if (data.suggestions && data.suggestions.length > 0) {
            paraphrasedText += data.suggestions[0].text + ' ';
          } else {
            paraphrasedText += batch + ' ';
          }
        } catch (error) {
          console.error('Error paraphrasing text:', error);
          paraphrasedText += batch + ' ';
        }
      }
      batch = sentence;
    } else {
      batch += sentence;
    }
  }

  if (batch.length > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: batch.trim(),
          style: 'formal'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        paraphrasedText += data.suggestions[0].text + ' ';
      } else {
        paraphrasedText += batch + ' ';
      }
    } catch (error) {
      console.error('Error paraphrasing text:', error);
      paraphrasedText += batch + ' ';
    }
  }

  return paraphrasedText.trim();
}

const ParaphraseText = async (req, res) => {
  const { text, filePath } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  try {
    const paraphrasedText = await paraphraseText(text);

    const absolutePath = path.resolve(filePath);

    let fileContent = [];
    if (fs.existsSync(absolutePath)) {
      const rawData = fs.readFileSync(absolutePath, 'utf-8');
      fileContent = JSON.parse(rawData);
    }

    fileContent.forEach(item => {
      item.paraphrased = paraphrasedText;
    });

    fs.writeFileSync(absolutePath, JSON.stringify(fileContent, null, 2), 'utf-8');

    res.json({ paraphrasedText });
  } catch (error) {
    console.error('Error paraphrasing the text:', error);
    res.status(500).json({ error: 'Failed to paraphrase and save the text' });
  }
};

const GetFile = (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const absolutePath = path.resolve(filePath);

  fs.readFile(absolutePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the file' });
    }

    try {
      const jsonContent = JSON.parse(data);
      res.json(jsonContent);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse JSON' });
    }
  });
};

module.exports = {
  ParaphraseText,
  GetFile
};
