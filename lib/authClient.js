'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _adminOnRest = require('admin-on-rest');

exports.default = function (client) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (type, params) {
    var _Object$assign = Object.assign({}, {
      storageKey: 'token',
      authenticate: { type: 'local' }
    }, options),
        storageKey = _Object$assign.storageKey,
        authenticate = _Object$assign.authenticate;

    switch (type) {
      case _adminOnRest.AUTH_LOGIN:
        var username = params.username,
            password = params.password;

        return client.authenticate(_extends({}, authenticate, {
          email: username,
          password: password
        }));
      case _adminOnRest.AUTH_LOGOUT:
        return client.logout();
      case _adminOnRest.AUTH_CHECK:
        return localStorage.getItem(storageKey) ? Promise.resolve() : Promise.reject();
      default:
        throw new Error('Unsupported FeathersJS authClient action type ' + type);
    }
  };
};

module.exports = exports['default'];