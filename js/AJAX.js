"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Brasil\Pernambuco
// Developer: Matheus Johann Araujo
// Date: 12-01-2020
// GitHub: https://github.com/matheusjohannaraujo/lib_ajax_and_form_async

function AJAX() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './';
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var success = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (data) {
    return data;
  };
  var async = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var debug = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var sendTypeJson = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var user = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  var pass = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
  var ajax = false;

  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      ajax = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }

  if (_typeof(ajax) == "object") {
    ajax.debug = debug;
    ajax.dump = {
      data: [],
      add: function add(val) {
        this.data.push(val);
      }
    };
    ajax.method = method;
    ajax.action = action;
    ajax.params = params;
    ajax.async = async;
    ajax.user = user;
    ajax.pass = pass;
    ajax.sendTypeJson = sendTypeJson;

    ajax.statusCode = function (i) {
      if (ajax.debug) ajax.dump.add(["Status Code", ajax.status]);
    };

    ajax.beforeSend = function (i) {
      if (ajax.debug) ajax.dump.add(["ReadyState", i]);
    };

    ajax.success = success;

    ajax.loading = function (i) {
      if (ajax.debug) ajax.dump.add(["Loading", i + "%"]);
    };

    ajax.onprogress = function (event) {
      ajax.loading(event.loaded * 100 / event.total);
    };

    ajax.upload.loading = function (i) {
      if (ajax.debug) ajax.dump.add(["Upload loading", i + "%"]);
    };

    var count1 = 0,
        count2 = 0;

    ajax.upload.onprogress = function (event) {
      count2 = (event.loaded * 100 / event.total).toFixed(2);

      if (count1 != count2) {
        count1 = count2;
        ajax.upload.loading(count1);
      }
    };

    ajax.upload.onload = function () {
      if (ajax.debug) ajax.dump.add(["Upload realizado!"]);
    };

    ajax.upload.onerror = function () {
      ajax.dump.add(["Erro no upload!"]);
    };

    ajax.onloadstart = function () {
      if (ajax.debug) ajax.dump.add(["Carregando os dados!"]);
    };

    ajax.onloadend = function () {
      if (ajax.debug) ajax.dump.add(["Carregamento dos dados terminou!"]);
    };

    ajax.onload = function () {
      if (ajax.debug) ajax.dump.add(["Dados enviados!"]);
    };

    ajax.onerror = function (e) {
      ajax.dump.add(["Erro na requisição, refazendo-a...", e]);
      setTimeout(ajax.run, 10000);
    };

    ajax.onabort = function () {
      ajax.dump.add(["Abortado!"]);
    };

    ajax.formDataToJson = function (formData) {
      var object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
        console.log(value);
      });
      return JSON.parse(JSON.stringify(object));
    };

    ajax.jsonToString = function (object) {
      var str = "";
      Object.keys(ajax.params).forEach(function (key) {
        return str += "".concat(key, "=").concat(ajax.params[key], "&");
      });
      return str.slice(0, str.length - 1);
    };

    ajax.paramsSetType = function () {
      if (ajax.debug) ajax.dump.add(["Type Params", _typeof(ajax.params)]);

      if (ajax.method == "GET") {
        if (_typeof(ajax.params) == 'object') {
          if (_instanceof(ajax.params, FormData)) {
            ajax.params = ajax.formDataToJson(ajax.params);
            ajax.params = ajax.jsonToString(ajax.params);
          } else {
            ajax.params = ajax.jsonToString(ajax.params);
          }
        }

        if (ajax.params != null || ajax.params != '') ajax.params = "?" + ajax.params;
      }
    };

    ajax.console = function () {
      console.log(ajax);
    };

    var count0 = 0;

    ajax.onreadystatechange = function () {
      ajax.statusCode(ajax.status);

      if (count0 != ajax.readyState && ajax.readyState <= 4) {
        count0 = ajax.readyState;
        ajax.beforeSend(count0);
      }

      if (ajax.readyState == 4) {
        var data = '';
        if (ajax.responseText) data = ajax.responseText;
        if (ajax.responseXML) data = ajax.responseXML;
        data = data.trim();

        try {
          data = JSON.parse(data);
        } catch (e) {}

        if (!(ajax.status == 200 || ajax.status == 201)) ajax.dump.add(["Status Code", ajax.status, "https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml"]);
        if (ajax.debug) ajax.dump.add(["Recebido", data]);
        ajax.success(data);
      }
    };
  }

  ajax.run = function () {
    try {
      ajax.paramsSetType();

      if (ajax.method == 'GET' || ajax.method == 'DELETE') {
        ajax.open(ajax.method, ajax.action + ajax.params, ajax.async, ajax.user, ajax.pass);
        ajax.send(null);
      } else if (ajax.method == 'POST' || ajax.method == 'PUT' || ajax.method == 'PATCH') {
        ajax.open(ajax.method, ajax.action, ajax.async, ajax.user, ajax.pass);

        if (typeof ajax.params == 'string') {
          ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else if (_typeof(ajax.params) == 'object' && !_instanceof(ajax.params, Array) && !_instanceof(ajax.params, FormData) && !_instanceof(ajax.params, Blob) && !_instanceof(ajax.params, Int8Array)) {
          if (!ajax.sendTypeJson) {
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.params = ajax.jsonToString(params);
          } else {
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.setRequestHeader("Cache-Control", "no-cache");
            ajax.params = JSON.stringify(ajax.params);
          }
        }

        ajax.send(ajax.params);
      }
    } catch (err) {
      ajax.onerror(err);
    } finally {
      if (ajax.debug) ajax.console();
    }
  };

  return ajax;
}