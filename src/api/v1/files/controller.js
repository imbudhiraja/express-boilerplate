const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const mongoose = require('mongoose');
const Files = require('./model');
const {
  resizeImage, authorize,
} = require('../../../utils/methods');
const { Error } = require('../../../utils/api-response');

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
      user: { id },
      body: { fileType },
    } = req;

    const busboy = new Busboy({ headers: req.headers });

    req.pipe(busboy);

    busboy.on('file', async (fieldName, file, filename, encoding, mimeType) => {
      const userData = req.user;
      const folderPath = path.join(__dirname, `../../../../cdn/${userData.id}`);
      const extension = path.extname(filename);
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

        res.status(httpStatus.CREATED).json({ _id: mongoObjectId });
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
      params: { _id },
    } = req;

    await authorize(req, res, next);

    const file = await Files.findOne({
      _id,
      is_deleted: false,
    });

    if (!file) {
      throw new Error({
        message: 'File is not available to download',
        status: httpStatus.BAD_REQUEST,
      });
    }

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

const deleteFile = async (fileId, userId) => {
  const query = {
    _id: fileId,
    is_deleted: false,
    user_id: userId,
  };

  // const file = await Files.findOne(query);
  // if (!file) {
  //   throw new Error({
  //     message: 'File is deleted or you dont have permissions to delete this file',
  //     status: httpStatus.BAD_REQUEST,
  //   });
  // }
  // const imagePath = `../../../../cdn/${file.user_id}/${file._id}${file.file_extension}`;
  // const filePath = path.join(__dirname, imagePath);
  // fs.unlinkSync(filePath);

  const result = await Files.findOneAndUpdate(query, { is_deleted: true });

  return result;
};

exports.deleteFile = deleteFile;

exports.delete = async (req, res, next) => {
  try {
    const {
      params: { _id },
      user,
    } = req;

    await deleteFile(_id, user._id);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (e) {
    return next(e);
  }
};
