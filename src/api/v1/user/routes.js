const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const {
  register, login, refreshToken,
} = require('./validation');
const { authorize } = require('../../../middlewares/auth');

const routes = express.Router();

/**
 * @api {post} v1/user/register Register user
 * @apiDescription Register a user account
 * @apiVersion 1.0.0
 * @apiName registerUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  firstName   First name
 * @apiParam  {String}  lastName    Last name
 * @apiParam  {String}  email       Email
 * @apiParam  {String}  password    Password
 * @apiParam  {String=ios,android,browser}  clientType  Client Type
 * @apiParam  {String}  [deviceToken] Device Token
 *
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 * @apiSuccess {Object}  user      User detail object {_id:String, firstName:String, lastName:String, email: String }
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Conflict 409)     ValidationError  Email address is already exists
 */

routes.route('/register').post(validate(register), controller.signup);

/**
 * @api {post} v1/user/login Login user
 * @apiDescription Login a account
 * @apiVersion 1.0.0
 * @apiName loginUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  email       Email
 * @apiParam  {String}  password    Password
 * @apiParam  {String=ios,android,browser}  clientType  Client Type
 * @apiParam  {String}  [deviceToken] Device Token
 *
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 * @apiSuccess {Object}  user      User detail object {_id:String, firstName:String, lastName:String, email: String }
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Conflict 409)     ValidationError  Credentials did not match
 */

routes.route('/login').post(validate(login), controller.login);

/**
 * @api {post} v1/user/refreshToken Refresh token
 * @apiDescription Get new access token
 * @apiVersion 1.0.0
 * @apiName refreshToken
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  refreshToken  Refresh token
 *
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 *
 * @apiError (Conflict 409)  ValidationError  Refresh token did not match
 */

routes.route('/refreshToken').post(validate(refreshToken), controller.refreshToken);

/**
 * @api {put} v1/user/logout Logout user
 * @apiDescription Logout from a account
 * @apiVersion 1.0.0
 * @apiName logoutUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  refreshToken  Refresh token
 *
 * @apiSuccess (No Content 204)   User logged out successfully
 *
 * @apiError (Conflict 409)  ValidationError  Refresh token did not match
 */

routes.route('/logout').put(authorize(), validate(refreshToken), controller.logout);

/**
 * @api {delete} v1/user/delete Delete user
 * @apiDescription Delete user account
 * @apiVersion 1.0.0
 * @apiName delete
 * @apiGroup User
 * @apiPermission public
 *
 * @apiSuccess (No Content 204)   Account deleted successfully
 *
 */

routes.route('/delete').delete(authorize(), controller.delete);

module.exports = routes;
