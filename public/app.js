(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("constants.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandom = exports.IS_FRIDAY_AFTERNOON = exports.IS_FRIDAY = undefined;
exports.dayHelper = dayHelper;

var _reasons = require('./reasons');

var D = new Date();
var HOURS = D.getHours();
var DAY = D.getDay();

var IS_FRIDAY = exports.IS_FRIDAY = DAY === 5;
var IS_FRIDAY_AFTERNOON = exports.IS_FRIDAY_AFTERNOON = IS_FRIDAY && HOURS >= 16;

var getRandom = exports.getRandom = function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
};

function dayHelper() {
  if (IS_FRIDAY_AFTERNOON) {
    return _reasons.REASONS_FOR_FRIDAY_AFTERNOON;
  } else if (IS_FRIDAY) {
    return _reasons.REASONS_TO_NOT_DEPLOY;
  }
  return _reasons.REASONS_TO_DEPLOY;
}

});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _constants = require('./constants');

document.addEventListener('DOMContentLoaded', function () {

  var TEXT = document.getElementById('text');
  var BTN = document.getElementById('reload');
  var BODY = document.getElementsByTagName('body')[0];

  if (_constants.IS_FRIDAY) {
    BODY.classList.add('its-friday');
  }

  var printText = function printText(day) {
    TEXT.innerHTML = (0, _constants.getRandom)(day);
  };

  printText((0, _constants.dayHelper)());

  BTN.onclick = function (event) {
    printText((0, _constants.dayHelper)());
    event.preventDefault();
  };
});

});

require.register("reasons.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REASONS_TO_DEPLOY = exports.REASONS_TO_DEPLOY = ['I don\'t see why not', 'It\'s a free country', 'Go ahead my friend!', 'Go for it', 'Go go go go!', 'Let\'s do it!', 'Ship it! 🚢', 'Go with the flow 🌊', 'Harder better faster stronger', 'Rock on!', 'Break a leg!'];

var REASONS_TO_NOT_DEPLOY = exports.REASONS_TO_NOT_DEPLOY = ['I wouldn\'t recommend it', 'No man, it\'s Friday', 'What about Monday?', 'Not today', 'Tomorrow?', 'Nope', 'Why?', 'Did the tests pass? Probably not', '¯\_(ツ)_/¯', '🤷', 'No. Breath and count to 10, start again'];

var REASONS_FOR_FRIDAY_AFTERNOON = exports.REASONS_FOR_FRIDAY_AFTERNOON = ['Not by any chance', 'U mad?', 'What you are thinking?', 'No no no no no no no no', 'How do you feel about working nights and weekends?', '🔥 🚒 🚨 ⛔️ 🔥 🚒 🚨 ⛔️ 🔥 🚒 🚨 ⛔️', 'No! God! Please! No', 'No no no no no no no!', 'Keep dreaming darling', 'Why why Bro why?', 'But but but... why?'];

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map