const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  addPeople,
  userAvailable,
  users,
  blockUnblock,
  editProfile,
  changeRole,
} = require('./validation');
const { authorize } = require('../../../middlewares/auth');

const routes = express.Router();

/**
 * @api {get} v1/user Get single user or list of users
 * @apiDescription Get user or All users
 * @apiVersion 1.0.0
 * @apiName user
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiParam  {String}  userId(Optional)  User id of any user else all users returned
 * @apiParam  {String}  companyId(Optional)  Get list of users under a single company
 * @apiSuccess (Ok 200)   User fetched successfully
 *
 */

routes.route('/').get(validate(users), authorize(), controller.users);

/**
 * @api {post} v1/user/register Register user
 * @apiDescription Register a user account
 * @apiVersion 1.0.0
 * @apiName registerUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  company     Company name
 * @apiParam  {String}  firstName   First name
 * @apiParam  {String}  lastName    Last name
 * @apiParam  {String}  email       Email
 * @apiParam  {String}  password    Password
 *
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 * @apiSuccess {Object}  user      User detail object {_id:String, firstName:String, lastName:String, email: String }
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Conflict 409)     ValidationError  Email address is already exists
 */

routes.route('/register').post(validate(register), controller.register);

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
 * @api {put} v1/user/refresh-token Refresh token
 * @apiDescription Get new access token
 * @apiVersion 1.0.0
 * @apiName refreshToken
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiParam  {String}  refreshToken  Refresh token
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 * @apiError (Conflict 409)  ValidationError  Refresh token did not match
 */

routes.route('/refresh-token').put(validate(refreshToken), authorize(), controller.refreshToken);

/**
 * @api {put} v1/user/logout Logout user
 * @apiDescription Logout from a account
 * @apiVersion 1.0.0
 * @apiName logoutUser
 * @apiGroup User
 * @apiPermission private
 *
 * @apiParam  {String}  refreshToken  Refresh token
 * @apiHeader {String} Authorization Authorization token
 * @apiSuccess (No Content 204)   User logged out successfully
 * @apiError (Conflict 409)  ValidationError  Refresh token did not match
 */

routes.route('/logout').put(validate(refreshToken), authorize(), controller.logout);

/**
 * @api {delete} v1/user/delete Delete user
 * @apiDescription Delete user account
 * @apiVersion 1.0.0
 * @apiName delete
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiSuccess (No Content 204)   Account deleted successfully
 *
 */

routes.route('/delete').delete(authorize(), controller.delete);

/**
 * @api {get} v1/user/email-verification Email Verification
 * @apiDescription User's Email verification
 * @apiVersion 1.0.0
 * @apiName emailVerification
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  token  Email Verification token
 * @apiError (Conflict 409)  ValidationError  Token expires
 * @apiSuccess (No Content 204) No Content Redirected to landing page.
 */

routes.route('/email-verification/:token').get(controller.emailVerification);

/**
 * @api {POST} v1/user/forgot-password Forgot Password
 * @apiDescription Request reset password
 * @apiVersion 1.0.0
 * @apiName Forgot Password
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  email  Registered email
 * @apiError (Conflict 409)  ValidationError  Email not found
 * @apiSuccess (No Content 204) No Content Redirected to landing page.
 */

routes.route('/forgot-password').post(validate(forgotPassword), controller.forgotPassword);

/**
 * @api {PUT} v1/user/reset-password Reset Password
 * @apiDescription User can reset password
 * @apiVersion 1.0.0
 * @apiName Reset Password
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String} token     Access token
 * @apiParam  {String} password  New password for account
 * @apiError (Conflict 409)  ValidationError  Old password and New Password are same.
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/reset-password').put(validate(resetPassword), controller.resetPassword);

/**
 * @api {PUT} v1/user/change-password Change Password
 * @apiDescription User can change password
 * @apiVersion 1.0.0
 * @apiName Change Password
 * @apiGroup User
 * @apiPermission public
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} password (minimum 8 , maximum 16)  New password for account
 * @apiParam  {String} oldPassword  (minimum 8 , maximum 16)  Old password for account
 * @apiError (Conflict 409)  ValidationError  Old password does not matched
 * @apiError (Conflict 409)  ValidationError  Old password and New Password are same.
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/change-password').put(validate(changePassword), authorize(), controller.changePassword);

/**
 * @api {POST} v1/user/add-people Add People
 * @apiDescription Company admin can add multiple user
 * @apiVersion 1.0.0
 * @apiName Add People
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {Object} users {email, firstName, lastName, role ['admin', 'team-member'] }
 * @apiError (Conflict 409)  ValidationError user objects is not same as required
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/add-people').post(validate(addPeople), authorize(), controller.addPeople);

/**
 * @api {GET} v1/user/user-available User available
 * @apiDescription Check user is already added in platform or not
 * @apiVersion 1.0.0
 * @apiName User available
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} email
 * @apiError (Conflict 409)  ValidationError User is already added on platform
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/user-available').get(validate(userAvailable), authorize(), controller.userAvailable);

/**
 * @api {PUT} v1/user/block-unblock/:userId Block/Unblock company user
 * @apiDescription Company admin can block and unblock any user any time.
 * @apiVersion 1.0.0
 * @apiName Block Unblock User
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} status
 * @apiError (Conflict 409)  ValidationError User is already added on platform
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/block-unblock/:userId').put(validate(blockUnblock), authorize(), controller.blockUnblock);

/**
 * @api {PUT} v1/user/edit-profile Edit Profile
 * @apiDescription Update profile information
 * @apiVersion 1.0.0
 * @apiName Edit Profile
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} firstName First Name of user
 * @apiParam  {String} lastName Last Name of user
 * @apiParam  {String} photo photo id user
 * @apiError (Conflict 409)  ValidationError Invalid data
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/edit-profile').put(validate(editProfile), authorize(), controller.editProfile);

/**
 * @api {PUT} v1/user/change-role Change Roles
 * @apiDescription Change Role of users
 * @apiVersion 1.0.0
 * @apiName Change Roles
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} userId User id of user
 * @apiParam  {role}   role [admin, team-member]
 * @apiError (Conflict 409)  ValidationError Invalid data
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/change-role/:userId').put(validate(changeRole), authorize(), controller.changeRole);

module.exports = routes;
