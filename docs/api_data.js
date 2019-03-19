define({ "api": [
  {
    "type": "get",
    "url": "v1/files/:_id",
    "title": "Download file",
    "description": "<p>Upload file</p>",
    "version": "1.0.0",
    "name": "getFile",
    "group": "Files",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "width",
            "description": "<p>desire width</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "height",
            "description": "<p>desire height</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "accessToken",
            "description": "<p>user access token</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "format",
            "description": "<p>desire format</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/files/routes.js",
    "groupTitle": "Files"
  },
  {
    "type": "post",
    "url": "v1/files/",
    "title": "Upload file",
    "description": "<p>Upload file</p>",
    "version": "1.0.0",
    "name": "uploadFile",
    "group": "Files",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "file",
            "description": "<p>file</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "video",
              "image"
            ],
            "optional": false,
            "field": "fileType",
            "description": "<p>type of image</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/files/routes.js",
    "groupTitle": "Files"
  },
  {
    "type": "delete",
    "url": "v1/user/delete",
    "title": "Delete user",
    "description": "<p>Delete user account</p>",
    "version": "1.0.0",
    "name": "delete",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Account",
            "description": "<p>deleted successfully</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "v1/user/login",
    "title": "Login user",
    "description": "<p>Login a account</p>",
    "version": "1.0.0",
    "name": "loginUser",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "ios",
              "android",
              "browser"
            ],
            "optional": false,
            "field": "clientType",
            "description": "<p>Client Type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "deviceToken",
            "description": "<p>Device Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "token",
            "description": "<p>Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User detail object {_id:String, firstName:String, lastName:String, email: String }</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Conflict 409": [
          {
            "group": "Conflict 409",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Credentials did not match</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "v1/user/logout",
    "title": "Logout user",
    "description": "<p>Logout from a account</p>",
    "version": "1.0.0",
    "name": "logoutUser",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "User",
            "description": "<p>logged out successfully</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Conflict 409": [
          {
            "group": "Conflict 409",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Refresh token did not match</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "v1/user/refreshToken",
    "title": "Refresh token",
    "description": "<p>Get new access token</p>",
    "version": "1.0.0",
    "name": "refreshToken",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "token",
            "description": "<p>Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Conflict 409": [
          {
            "group": "Conflict 409",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Refresh token did not match</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "v1/user/register",
    "title": "Register user",
    "description": "<p>Register a user account</p>",
    "version": "1.0.0",
    "name": "registerUser",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "ios",
              "android",
              "browser"
            ],
            "optional": false,
            "field": "clientType",
            "description": "<p>Client Type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "deviceToken",
            "description": "<p>Device Token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "token",
            "description": "<p>Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User detail object {_id:String, firstName:String, lastName:String, email: String }</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Conflict 409": [
          {
            "group": "Conflict 409",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Email address is already exists</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "v1/user",
    "title": "Get single user or list of users",
    "description": "<p>Get user or All users</p>",
    "version": "1.0.0",
    "name": "user",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>(Optional)  User id of any user else all users returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Ok 200": [
          {
            "group": "Ok 200",
            "optional": false,
            "field": "User",
            "description": "<p>fetched successfully</p>"
          }
        ]
      }
    },
    "filename": "src/api/v1/user/routes.js",
    "groupTitle": "User"
  }
] });
