const fs = require('fs');
const path = require('path');
const { translateWithProxy } = require('../utils/Proxy');

const TranslateText = async (req, res) => {
  const { text, filePath } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text to translate is required.' });
  }

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required.' });
  }

  try {
    const translatedText = await translateWithProxy(text);

    const absolutePath = path.resolve(filePath);

    let fileContent = [];
    if (fs.existsSync(absolutePath)) {
      const rawData = fs.readFileSync(absolutePath, 'utf-8');
      fileContent = JSON.parse(rawData);
    }

    fileContent.forEach(item => {
      item.translated = translatedText;
    });

    fs.writeFileSync(absolutePath, JSON.stringify(fileContent, null, 2), 'utf-8');

    res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Translation failed.' });
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
  TranslateText,
  GetFile
};
