const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Files = require('./model');
const {
  resizeImage, authorize,
} = require('../../../utils/methods');

const asyncFsMkdir = Promise.promisify(fs.mkdir);

async function mkDir(folderPath) {
  if (!fs.existsSync(folderPath)) {
    await asyncFsMkdir(folderPath, {
      mode: '0777',
      recursive: true,
    });
  }
}

/**
 * Add new file
 *
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const {
      busboy,
      user: { id },
      body: { fileType },
    } = req;

    // Pipe it through busboy
    req.pipe(busboy);

    busboy.on('file', async (fieldName, file, filename, encoding, mimeType) => {
      const userData = req.user;
      const folderPath = path.join(__dirname, `../../../../cdn/${userData.id}`);

      console.log('filename', filename);
      let extension = path.extname(filename);

      extension = extension || '.png';
      const mongoObjectId = mongoose.Types.ObjectId();
      const customFileName = mongoObjectId + extension;

      // make cdn folder if not exists
      await mkDir(path.join(__dirname, '../../../../cdn/'));

      // make user id based folder in cdn folder if not exist
      await mkDir(folderPath);

      // Create a write` stream of the new file
      const fsStream = fs.createWriteStream(path.join(folderPath, customFileName));

      // Pipe it trough
      file.pipe(fsStream);

      // On finish of the upload
      fsStream.on('close', async () => {
        console.log(`'${filename}' is successfully uploaded as ${customFileName} in ${folderPath}`);

        const saveFile = new Files({
          _id: mongoObjectId,
          file_extension: extension,
          file_mime_type: mimeType,
          file_original_name: filename,
          file_size: 0,
          file_type: fileType,
          is_temp: false,
          is_video: false,
          user_id: id,
        });

        await saveFile.save();

        res.status(httpStatus.CREATED);
        res.json(saveFile);
      });
    });
  } catch (e) {
    next(e);
  }
};

exports.download = async (req, res, next) => {
  try {
    const {
      query: {
        width, height, format,
      },
    } = req;

    await authorize(req, res, next);

    const { params: { _id } } = req;
    const file = await Files.findOne({ _id });
    const imagePath = `../../../../cdn/${file.user_id}/${file._id}${file.file_extension}`;

    // Set the content-type of the response
    res.type(`image/${format || 'png'}`);

    const filePath = path.join(__dirname, imagePath);

    // Get the re sized image
    resizeImage(filePath, format, Number(width), Number(height)).pipe(res);
  } catch (e) {
    next(e);
  }
};
