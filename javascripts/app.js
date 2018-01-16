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
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _fullpage = require('fullpage.js');

var _fullpage2 = _interopRequireDefault(_fullpage);

var _jqueryAutocomplete = require('jquery-autocomplete');

var _jqueryAutocomplete2 = _interopRequireDefault(_jqueryAutocomplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// canvas

var c1 = document.getElementById('c1'),
    ctx1 = c1.getContext('2d'),
    c2 = document.getElementById('c2'),
    ctx2 = c2.getContext('2d'),
    twopi = Math.PI * 2,
    parts = [],
    sizeBase,
    opt,
    hue,
    count;

var cw;
var ch;

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function hsla(h, s, l, a) {
	return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

function create() {
	sizeBase = cw + ch;
	count = Math.floor(sizeBase * 0.3), hue = 180, opt = {
		radiusMin: 1,
		radiusMax: sizeBase * 0.04 * 2,
		blurMin: 10,
		blurMax: sizeBase * 0.04 * 4,
		hueMin: hue,
		hueMax: hue + 40,
		saturationMin: 20,
		saturationMax: 50,
		lightnessMin: 20,
		lightnessMax: 30,
		alphaMin: 0.2,
		alphaMax: 0.3
	};
	ctx1.clearRect(0, 0, cw, ch);
	ctx1.globalCompositeOperation = 'lighter';
	while (count--) {
		var radius = rand(opt.radiusMin, opt.radiusMax),
		    blur = rand(opt.blurMin, opt.blurMax),
		    x = rand(0, cw),
		    y = rand(0, ch),
		    hue = rand(opt.hueMin, opt.hueMax),
		    saturation = rand(opt.saturationMin, opt.saturationMax),
		    lightness = rand(opt.lightnessMin, opt.lightnessMax),
		    alpha = rand(opt.alphaMin, opt.alphaMax);

		ctx1.shadowColor = hsla(hue, saturation, lightness, alpha);
		ctx1.shadowBlur = blur;
		ctx1.beginPath();
		ctx1.arc(x, y, radius, 0, twopi);
		ctx1.closePath();
		ctx1.fill();
	}

	parts.length = 0;
	for (var i = 0; i < Math.floor((cw + ch) * 0.03); i++) {
		parts.push({
			radius: rand(1, sizeBase * 0.03),
			x: rand(0, cw),
			y: rand(0, ch),
			angle: rand(0, twopi),
			vel: rand(0.1, 0.5),
			tick: rand(0, 10000)
		});
	}
}

function init() {
	resize();
	create();
	loop();
}

function loop() {
	requestAnimationFrame(loop);

	ctx2.clearRect(0, 0, cw, ch);
	ctx2.globalCompositeOperation = 'source-over';
	ctx2.shadowBlur = 0;
	ctx2.drawImage(c1, 0, 0);
	ctx2.globalCompositeOperation = 'lighter';

	var i = parts.length;
	ctx2.shadowBlur = 10;
	ctx2.shadowColor = '#fff';
	while (i--) {
		var part = parts[i];

		part.x += Math.cos(part.angle) * part.vel;
		part.y += Math.sin(part.angle) * part.vel;
		part.angle += rand(-0.05, 0.05);

		ctx2.beginPath();
		ctx2.arc(part.x, part.y, part.radius, 0, twopi);
		ctx2.fillStyle = hsla(0, 0, 100, 0.075 + Math.cos(part.tick * 0.02) * 0.05);
		ctx2.fill();

		if (part.x - part.radius > cw) {
			part.x = -part.radius;
		}
		if (part.x + part.radius < 0) {
			part.x = cw + part.radius;
		}
		if (part.y - part.radius > ch) {
			part.y = -part.radius;
		}
		if (part.y + part.radius < 0) {
			part.y = ch + part.radius;
		}

		part.tick++;
	}
}

function resize() {
	cw = c1.width = c2.width = window.innerWidth, ch = c1.height = c2.height = window.innerHeight;
	create();
}

function click() {
	create();
}

window.addEventListener('resize', resize);
window.addEventListener('click', click);

init();

// fullpage

(0, _jquery2.default)(document).ready(function () {
	(0, _jquery2.default)('#fullpage').fullpage({
		anchors: ['page-1', 'page-2', 'page-3', 'page-4', 'page-5', 'page-6'],
		menu: '#menu',
		navigation: true
	});
});

// next code

(0, _jquery2.default)('.container').click(function (evt) {
	evt.stopPropagation();
});

(0, _jquery2.default)('.filter').click(function (evt) {
	evt.stopPropagation();
});

(0, _jquery2.default)('.main-nav-overlay').click(function (evt) {
	evt.stopPropagation();
});

(0, _jquery2.default)('#fullpage').click(function (evt) {
	evt.stopPropagation();
});

(0, _jquery2.default)('.popup').click(function (evt) {
	evt.stopPropagation();
});

(0, _jquery2.default)("#navToggle").click(function (evt) {
	evt.stopPropagation();
	(0, _jquery2.default)(this).toggleClass("active");
	(0, _jquery2.default)(".main-nav-overlay").toggleClass("open");
	(0, _jquery2.default)("body").toggleClass("locked");
});

var formButton = (0, _jquery2.default)('.seating__button');
var popupButtonClose = (0, _jquery2.default)('.popup-close');

formButton.click(function (evt) {
	evt.preventDefault();
	(0, _jquery2.default)('.popup').addClass('open-popup');
});

popupButtonClose.click(function () {
	(0, _jquery2.default)('.popup').removeClass('open-popup');
});

(0, _jquery2.default)('.popup-overlay').click(function (evt) {
	if ((0, _jquery2.default)(evt.target).closest('.popup-container').length == 0) {
		(0, _jquery2.default)('.popup').removeClass('open-popup');
	}
});

// autocomplete

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

jQuery(".seating__input").autocomplete({
	source: [states],
	limit: 6
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map