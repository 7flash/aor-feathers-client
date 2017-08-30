'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _types = require('admin-on-rest/lib/rest/types');

exports.default = function (client) {
  var mapRequest = function mapRequest(type, resource, params) {
    var service = client.service(resource);
    var query = {};

    switch (type) {
      case _types.GET_MANY:
        var ids = params.ids || [];
        query = { 'id': { '$in': ids } };
        query['$limit'] = ids.length;
        return service.find({ query: query });
      case _types.GET_MANY_REFERENCE:
      case _types.GET_LIST:
        var _ref = params.pagination || {},
            page = _ref.page,
            perPage = _ref.perPage;

        var _ref2 = params.sort || {},
            field = _ref2.field,
            order = _ref2.order;

        var sortKey = '$sort[' + field + ']';
        var sortVal = order === 'DESC' ? -1 : 1;
        if (perPage && page) {
          query['$limit'] = perPage;
          query['$skip'] = perPage * (page - 1);
        }
        if (order) {
          query[sortKey] = JSON.stringify(sortVal);
        }
        Object.assign(query, params.filter);
        return service.find({ query: query });
      case _types.GET_ONE:
        return service.get(params.id);
      case _types.UPDATE:
        return service.update(params.id, params.data);
      case _types.CREATE:
        return service.create(params.data);
      case _types.DELETE:
        return service.remove(params.id);
      default:
        throw new Error('Unsupported FeathersJS restClient action type ' + type);
    }
  };

  var mapResponse = function mapResponse(response, type, resource, params) {
    switch (type) {
      case _types.GET_ONE:
      case _types.UPDATE:
        return { data: response };
      case _types.CREATE:
        return { data: _extends({}, params.data, { id: response.id }) };
      default:
        return response;
    }
  };

  return function (type, resource, params) {
    return client.authenticate().then(function () {
      return mapRequest(type, resource, params);
    }).then(function (response) {
      return mapResponse(response, type, resource, params);
    });
  };
};
