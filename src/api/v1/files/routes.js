const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const {
  deleteFile, download,
} = require('./validation');
const { authorize } = require('../../../middlewares/auth');

const routes = express.Router();

/**
 * @api {post} v1/files/ Upload file
 * @apiDescription Upload file
 * @apiVersion 1.0.0
 * @apiName uploadFile
 * @apiGroup Files
 * @apiPermission user
 *
 * @apiHeader {String} Authorization   User's access token
 *
 * @apiParam  {file}               file           file
 * @apiParam  {String=video,image} fileType       type of image
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
 */

routes.route('/').post(authorize(), controller.create);

/**
 * @api {get} v1/files/:_id Download file
 * @apiDescription Download file
 * @apiVersion 1.0.0
 * @apiName getFile
 * @apiGroup Files
 * @apiPermission public
 *
 * @apiParam  {number}                  width       desire width
 * @apiParam  {number}                  height      desire height
 * @apiParam  {string}                  accessToken user access token
 * @apiParam  {string}                  format      desire format

 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
 */
routes.route('/:_id').get(validate(download), controller.download);

/**
 * @api {get} v1/files/:_id Delete file
 * @apiDescription Delete file
 * @apiVersion 1.0.0
 * @apiName Delete any uploaded file
 * @apiGroup Files
 * @apiPermission public
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
 */
routes.route('/:_id').delete(validate(deleteFile), authorize(), controller.delete);

module.exports = routes;
