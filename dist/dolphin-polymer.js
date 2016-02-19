(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/$.core').Map;
},{"../modules/$.core":10,"../modules/es6.map":45,"../modules/es6.object.to-string":46,"../modules/es6.string.iterator":47,"../modules/es7.map.to-json":48,"../modules/web.dom.iterable":49}],2:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],3:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],4:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":22}],5:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./$.cof')
  , TAG = _dereq_('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":6,"./$.wks":42}],6:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],7:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_('./$')
  , hide         = _dereq_('./$.hide')
  , redefineAll  = _dereq_('./$.redefine-all')
  , ctx          = _dereq_('./$.ctx')
  , strictNew    = _dereq_('./$.strict-new')
  , defined      = _dereq_('./$.defined')
  , forOf        = _dereq_('./$.for-of')
  , $iterDefine  = _dereq_('./$.iter-define')
  , step         = _dereq_('./$.iter-step')
  , ID           = _dereq_('./$.uid')('id')
  , $has         = _dereq_('./$.has')
  , isObject     = _dereq_('./$.is-object')
  , setSpecies   = _dereq_('./$.set-species')
  , DESCRIPTORS  = _dereq_('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":28,"./$.ctx":11,"./$.defined":12,"./$.descriptors":13,"./$.for-of":16,"./$.has":18,"./$.hide":19,"./$.is-object":22,"./$.iter-define":25,"./$.iter-step":26,"./$.redefine-all":31,"./$.set-species":33,"./$.strict-new":36,"./$.uid":41}],8:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = _dereq_('./$.for-of')
  , classof = _dereq_('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":5,"./$.for-of":16}],9:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , $export        = _dereq_('./$.export')
  , fails          = _dereq_('./$.fails')
  , hide           = _dereq_('./$.hide')
  , redefineAll    = _dereq_('./$.redefine-all')
  , forOf          = _dereq_('./$.for-of')
  , strictNew      = _dereq_('./$.strict-new')
  , isObject       = _dereq_('./$.is-object')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , DESCRIPTORS    = _dereq_('./$.descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":28,"./$.descriptors":13,"./$.export":14,"./$.fails":15,"./$.for-of":16,"./$.global":17,"./$.hide":19,"./$.is-object":22,"./$.redefine-all":31,"./$.set-to-string-tag":34,"./$.strict-new":36}],10:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],11:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":2}],12:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],13:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":15}],14:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , core      = _dereq_('./$.core')
  , ctx       = _dereq_('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":10,"./$.ctx":11,"./$.global":17}],15:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],16:[function(_dereq_,module,exports){
var ctx         = _dereq_('./$.ctx')
  , call        = _dereq_('./$.iter-call')
  , isArrayIter = _dereq_('./$.is-array-iter')
  , anObject    = _dereq_('./$.an-object')
  , toLength    = _dereq_('./$.to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":4,"./$.ctx":11,"./$.is-array-iter":21,"./$.iter-call":23,"./$.to-length":40,"./core.get-iterator-method":43}],17:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],18:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],19:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":28,"./$.descriptors":13,"./$.property-desc":30}],20:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":6}],21:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./$.iterators')
  , ITERATOR   = _dereq_('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":27,"./$.wks":42}],22:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],23:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":4}],24:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , descriptor     = _dereq_('./$.property-desc')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":28,"./$.hide":19,"./$.property-desc":30,"./$.set-to-string-tag":34,"./$.wks":42}],25:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./$.library')
  , $export        = _dereq_('./$.export')
  , redefine       = _dereq_('./$.redefine')
  , hide           = _dereq_('./$.hide')
  , has            = _dereq_('./$.has')
  , Iterators      = _dereq_('./$.iterators')
  , $iterCreate    = _dereq_('./$.iter-create')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , getProto       = _dereq_('./$').getProto
  , ITERATOR       = _dereq_('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":28,"./$.export":14,"./$.has":18,"./$.hide":19,"./$.iter-create":24,"./$.iterators":27,"./$.library":29,"./$.redefine":32,"./$.set-to-string-tag":34,"./$.wks":42}],26:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],27:[function(_dereq_,module,exports){
module.exports = {};
},{}],28:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],29:[function(_dereq_,module,exports){
module.exports = true;
},{}],30:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],31:[function(_dereq_,module,exports){
var redefine = _dereq_('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":32}],32:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.hide');
},{"./$.hide":19}],33:[function(_dereq_,module,exports){
'use strict';
var core        = _dereq_('./$.core')
  , $           = _dereq_('./$')
  , DESCRIPTORS = _dereq_('./$.descriptors')
  , SPECIES     = _dereq_('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":28,"./$.core":10,"./$.descriptors":13,"./$.wks":42}],34:[function(_dereq_,module,exports){
var def = _dereq_('./$').setDesc
  , has = _dereq_('./$.has')
  , TAG = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":28,"./$.has":18,"./$.wks":42}],35:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":17}],36:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],37:[function(_dereq_,module,exports){
var toInteger = _dereq_('./$.to-integer')
  , defined   = _dereq_('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":12,"./$.to-integer":38}],38:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],39:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":12,"./$.iobject":20}],40:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":38}],41:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],42:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , uid    = _dereq_('./$.uid')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":17,"./$.shared":35,"./$.uid":41}],43:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":5,"./$.core":10,"./$.iterators":27,"./$.wks":42}],44:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./$.add-to-unscopables')
  , step             = _dereq_('./$.iter-step')
  , Iterators        = _dereq_('./$.iterators')
  , toIObject        = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":3,"./$.iter-define":25,"./$.iter-step":26,"./$.iterators":27,"./$.to-iobject":39}],45:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.1 Map Objects
_dereq_('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":9,"./$.collection-strong":7}],46:[function(_dereq_,module,exports){

},{}],47:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":25,"./$.string-at":37}],48:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./$.export');

$export($export.P, 'Map', {toJSON: _dereq_('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":8,"./$.export":14}],49:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var Iterators = _dereq_('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":27,"./es6.array.iterator":44}],50:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/_core').Map;
},{"../modules/_core":15,"../modules/es6.map":57,"../modules/es6.object.to-string":58,"../modules/es6.string.iterator":61,"../modules/es7.map.to-json":62,"../modules/web.dom.iterable":64}],2:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/_core').Promise;
},{"../modules/_core":15,"../modules/es6.object.to-string":58,"../modules/es6.promise":59,"../modules/es6.string.iterator":61,"../modules/web.dom.iterable":64}],3:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/_core').Set;
},{"../modules/_core":15,"../modules/es6.object.to-string":58,"../modules/es6.set":60,"../modules/es6.string.iterator":61,"../modules/es7.set.to-json":63,"../modules/web.dom.iterable":64}],4:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],5:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],7:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],8:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":30}],9:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":22}],10:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof')
  , TAG = _dereq_('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":11,"./_wks":54}],11:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],12:[function(_dereq_,module,exports){
'use strict';
var $           = _dereq_('./_')
  , hide        = _dereq_('./_hide')
  , redefineAll = _dereq_('./_redefine-all')
  , ctx         = _dereq_('./_ctx')
  , anInstance  = _dereq_('./_an-instance')
  , defined     = _dereq_('./_defined')
  , forOf       = _dereq_('./_for-of')
  , $iterDefine = _dereq_('./_iter-define')
  , step        = _dereq_('./_iter-step')
  , setSpecies  = _dereq_('./_set-species')
  , DESCRIPTORS = _dereq_('./_descriptors')
  , fastKey     = _dereq_('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_":4,"./_an-instance":7,"./_ctx":16,"./_defined":17,"./_descriptors":18,"./_for-of":22,"./_hide":25,"./_iter-define":33,"./_iter-step":35,"./_meta":38,"./_redefine-all":41,"./_set-species":44}],13:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof')
  , from    = _dereq_('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":9,"./_classof":10}],14:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./_')
  , global         = _dereq_('./_global')
  , $export        = _dereq_('./_export')
  , meta           = _dereq_('./_meta')
  , fails          = _dereq_('./_fails')
  , hide           = _dereq_('./_hide')
  , redefineAll    = _dereq_('./_redefine-all')
  , forOf          = _dereq_('./_for-of')
  , anInstance     = _dereq_('./_an-instance')
  , isObject       = _dereq_('./_is-object')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , DESCRIPTORS    = _dereq_('./_descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_":4,"./_an-instance":7,"./_descriptors":18,"./_export":20,"./_fails":21,"./_for-of":22,"./_global":23,"./_hide":25,"./_is-object":30,"./_meta":38,"./_redefine-all":41,"./_set-to-string-tag":45}],15:[function(_dereq_,module,exports){
var core = module.exports = {version: '2.0.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],16:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],17:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],18:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":21}],19:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object')
  , document = _dereq_('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":23,"./_is-object":30}],20:[function(_dereq_,module,exports){
var global    = _dereq_('./_global')
  , core      = _dereq_('./_core')
  , ctx       = _dereq_('./_ctx')
  , hide      = _dereq_('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":15,"./_ctx":16,"./_global":23,"./_hide":25}],21:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],22:[function(_dereq_,module,exports){
var ctx         = _dereq_('./_ctx')
  , call        = _dereq_('./_iter-call')
  , isArrayIter = _dereq_('./_is-array-iter')
  , anObject    = _dereq_('./_an-object')
  , toLength    = _dereq_('./_to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./_an-object":8,"./_ctx":16,"./_is-array-iter":29,"./_iter-call":31,"./_to-length":52,"./core.get-iterator-method":55}],23:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],24:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],25:[function(_dereq_,module,exports){
var $          = _dereq_('./_')
  , createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_":4,"./_descriptors":18,"./_property-desc":40}],26:[function(_dereq_,module,exports){
module.exports = _dereq_('./_global').document && document.documentElement;
},{"./_global":23}],27:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],28:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":11}],29:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./_iterators')
  , ITERATOR   = _dereq_('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":36,"./_wks":54}],30:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],31:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":8}],32:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./_')
  , descriptor     = _dereq_('./_property-desc')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_":4,"./_hide":25,"./_property-desc":40,"./_set-to-string-tag":45,"./_wks":54}],33:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./_library')
  , $export        = _dereq_('./_export')
  , redefine       = _dereq_('./_redefine')
  , hide           = _dereq_('./_hide')
  , has            = _dereq_('./_has')
  , Iterators      = _dereq_('./_iterators')
  , $iterCreate    = _dereq_('./_iter-create')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , getProto       = _dereq_('./_').getProto
  , ITERATOR       = _dereq_('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getProto($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_":4,"./_export":20,"./_has":24,"./_hide":25,"./_iter-create":32,"./_iterators":36,"./_library":37,"./_redefine":42,"./_set-to-string-tag":45,"./_wks":54}],34:[function(_dereq_,module,exports){
var ITERATOR     = _dereq_('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":54}],35:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],36:[function(_dereq_,module,exports){
module.exports = {};
},{}],37:[function(_dereq_,module,exports){
module.exports = true;
},{}],38:[function(_dereq_,module,exports){
var META     = _dereq_('./_uid')('meta')
  , isObject = _dereq_('./_is-object')
  , has      = _dereq_('./_has')
  , setDesc  = _dereq_('./_').setDesc
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_dereq_('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_":4,"./_fails":21,"./_has":24,"./_is-object":30,"./_uid":53}],39:[function(_dereq_,module,exports){
var global    = _dereq_('./_global')
  , macrotask = _dereq_('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = _dereq_('./_cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./_cof":11,"./_global":23,"./_task":49}],40:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],41:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":25}],42:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');
},{"./_hide":25}],43:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_('./_').getDesc
  , isObject = _dereq_('./_is-object')
  , anObject = _dereq_('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_('./_ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_":4,"./_an-object":8,"./_ctx":16,"./_is-object":30}],44:[function(_dereq_,module,exports){
'use strict';
var core        = _dereq_('./_core')
  , $           = _dereq_('./_')
  , DESCRIPTORS = _dereq_('./_descriptors')
  , SPECIES     = _dereq_('./_wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_":4,"./_core":15,"./_descriptors":18,"./_wks":54}],45:[function(_dereq_,module,exports){
var def = _dereq_('./_').setDesc
  , has = _dereq_('./_has')
  , TAG = _dereq_('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_":4,"./_has":24,"./_wks":54}],46:[function(_dereq_,module,exports){
var global = _dereq_('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":23}],47:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_('./_an-object')
  , aFunction = _dereq_('./_a-function')
  , SPECIES   = _dereq_('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":5,"./_an-object":8,"./_wks":54}],48:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer')
  , defined   = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":17,"./_to-integer":50}],49:[function(_dereq_,module,exports){
var ctx                = _dereq_('./_ctx')
  , invoke             = _dereq_('./_invoke')
  , html               = _dereq_('./_html')
  , cel                = _dereq_('./_dom-create')
  , global             = _dereq_('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_dereq_('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":11,"./_ctx":16,"./_dom-create":19,"./_global":23,"./_html":26,"./_invoke":27}],50:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],51:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject')
  , defined = _dereq_('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":17,"./_iobject":28}],52:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":50}],53:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],54:[function(_dereq_,module,exports){
var store      = _dereq_('./_shared')('wks')
  , uid        = _dereq_('./_uid')
  , Symbol     = _dereq_('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';
module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};
},{"./_global":23,"./_shared":46,"./_uid":53}],55:[function(_dereq_,module,exports){
var classof   = _dereq_('./_classof')
  , ITERATOR  = _dereq_('./_wks')('iterator')
  , Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":10,"./_core":15,"./_iterators":36,"./_wks":54}],56:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./_add-to-unscopables')
  , step             = _dereq_('./_iter-step')
  , Iterators        = _dereq_('./_iterators')
  , toIObject        = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":6,"./_iter-define":33,"./_iter-step":35,"./_iterators":36,"./_to-iobject":51}],57:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');

// 23.1 Map Objects
module.exports = _dereq_('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":14,"./_collection-strong":12}],58:[function(_dereq_,module,exports){

},{}],59:[function(_dereq_,module,exports){
'use strict';
var $                  = _dereq_('./_')
  , LIBRARY            = _dereq_('./_library')
  , global             = _dereq_('./_global')
  , ctx                = _dereq_('./_ctx')
  , classof            = _dereq_('./_classof')
  , $export            = _dereq_('./_export')
  , isObject           = _dereq_('./_is-object')
  , anObject           = _dereq_('./_an-object')
  , aFunction          = _dereq_('./_a-function')
  , anInstance         = _dereq_('./_an-instance')
  , forOf              = _dereq_('./_for-of')
  , from               = _dereq_('./_array-from-iterable')
  , setProto           = _dereq_('./_set-proto').set
  , speciesConstructor = _dereq_('./_species-constructor')
  , task               = _dereq_('./_task').set
  , microtask          = _dereq_('./_microtask')
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var testResolve = function(sub){
  var test = new $Promise(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = $Promise.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  var SubPromise = function(x){
    var self = new $Promise(x);
    setProto(self, SubPromise.prototype);
    return self;
  };
  try {
    works = $Promise && $Promise.resolve && testResolve();
    setProto(SubPromise, $Promise);
    SubPromise.prototype = $.create($Promise.prototype, {constructor: {value: SubPromise}});
    // actual Firefox has broken subclass support, test that
    if(!(SubPromise.resolve(5).then(empty) instanceof SubPromise)){
      works = false;
    }
    // V8 4.8- bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_('./_descriptors')){
      var thenableThenGotten = false;
      $Promise.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return !!works;
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    if(isUnhandled(promise)){
      var value = promise._v
        , handler, console;
      if(isNode){
        process.emit('unhandledRejection', value, promise);
      } else if(handler = global.onunhandledrejection){
        handler({promise: promise, reason: value});
      } else if((console = global.console) && console.error){
        console.error('Unhandled promise rejection', value);
      } promise._h = 2;
    } promise._a = undefined;
  });
};
var isUnhandled = function(promise){
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  if(promise._h == 1)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _dereq_('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
_dereq_('./_set-to-string-tag')($Promise, PROMISE);
_dereq_('./_set-species')(PROMISE);
Wrapper = _dereq_('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = from(iterable)
        , remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_":4,"./_a-function":5,"./_an-instance":7,"./_an-object":8,"./_array-from-iterable":9,"./_classof":10,"./_core":15,"./_ctx":16,"./_descriptors":18,"./_export":20,"./_for-of":22,"./_global":23,"./_is-object":30,"./_iter-detect":34,"./_library":37,"./_microtask":39,"./_redefine-all":41,"./_set-proto":43,"./_set-species":44,"./_set-to-string-tag":45,"./_species-constructor":47,"./_task":49}],60:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');

// 23.2 Set Objects
module.exports = _dereq_('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":14,"./_collection-strong":12}],61:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":33,"./_string-at":48}],62:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./_export');

$export($export.P + $export.R, 'Map', {toJSON: _dereq_('./_collection-to-json')('Map')});
},{"./_collection-to-json":13,"./_export":20}],63:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./_export');

$export($export.P + $export.R, 'Set', {toJSON: _dereq_('./_collection-to-json')('Set')});
},{"./_collection-to-json":13,"./_export":20}],64:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global        = _dereq_('./_global')
  , hide          = _dereq_('./_hide')
  , Iterators     = _dereq_('./_iterators')
  , TO_STRING_TAG = _dereq_('./_wks')('toStringTag')
  , ArrayValues   = Iterators.Array;

_dereq_('./_').each.call(['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], function(NAME){
  var Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = ArrayValues;
});
},{"./_":4,"./_global":23,"./_hide":25,"./_iterators":36,"./_wks":54,"./es6.array.iterator":56}],65:[function(_dereq_,module,exports){
var opendolphin;
(function (opendolphin) {
    var Attribute = (function () {
        function Attribute() {
        }
        Attribute.QUALIFIER_PROPERTY = "qualifier";
        Attribute.DIRTY_PROPERTY = "dirty";
        Attribute.BASE_VALUE = "baseValue";
        Attribute.VALUE = "value";
        Attribute.TAG = "tag";
        return Attribute;
    })();
    opendolphin.Attribute = Attribute;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Command = (function () {
        function Command() {
            this.id = "dolphin-core-command";
        }
        return Command;
    })();
    opendolphin.Command = Command;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Tag = (function () {
        function Tag() {
        }
        //Implemented as function so that it will never be changed from outside
        /** The actual value of the attribute. This is the default if no tag is given.*/
        Tag.value = function () {
            return "VALUE";
        };
        /** the to-be-displayed String, not the key. I18N happens on the server. */
        Tag.label = function () {
            return "LABEL";
        };
        /** If the attribute represent tooltip**/
        Tag.tooltip = function () {
            return "TOOLTIP";
        };
        /** "true" or "false", maps to Grails constraint nullable:false */
        Tag.mandatory = function () {
            return "MANDATORY";
        };
        /** "true" or "false", maps to Grails constraint display:true */
        Tag.visible = function () {
            return "VISIBLE";
        };
        /** "true" or "false" */
        Tag.enabled = function () {
            return "ENABLED";
        };
        /** regular expression for local, syntactical constraints like in "rejectField" */
        Tag.regex = function () {
            return "REGEX";
        };
        /** a single text; e.g. "textArea" if the String value should be displayed in a text area instead of a textField */
        Tag.widgetHint = function () {
            return "WIDGET_HINT";
        };
        /** a single text; e.g. "java.util.Date" if the value String represents a date */
        Tag.valueType = function () {
            return "VALUE_TYPE";
        };
        return Tag;
    })();
    opendolphin.Tag = Tag;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var opendolphin;
(function (opendolphin) {
    var AttributeCreatedNotification = (function (_super) {
        __extends(AttributeCreatedNotification, _super);
        function AttributeCreatedNotification(pmId, attributeId, propertyName, newValue, qualifier, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            _super.call(this);
            this.pmId = pmId;
            this.attributeId = attributeId;
            this.propertyName = propertyName;
            this.newValue = newValue;
            this.qualifier = qualifier;
            this.tag = tag;
            this.id = 'AttributeCreated';
            this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
        }
        return AttributeCreatedNotification;
    })(opendolphin.Command);
    opendolphin.AttributeCreatedNotification = AttributeCreatedNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var AttributeMetadataChangedCommand = (function (_super) {
        __extends(AttributeMetadataChangedCommand, _super);
        function AttributeMetadataChangedCommand(attributeId, metadataName, value) {
            _super.call(this);
            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
            this.id = 'AttributeMetadataChanged';
            this.className = "org.opendolphin.core.comm.AttributeMetadataChangedCommand";
        }
        return AttributeMetadataChangedCommand;
    })(opendolphin.Command);
    opendolphin.AttributeMetadataChangedCommand = AttributeMetadataChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var BaseValueChangedCommand = (function (_super) {
        __extends(BaseValueChangedCommand, _super);
        function BaseValueChangedCommand(attributeId) {
            _super.call(this);
            this.attributeId = attributeId;
            this.id = 'BaseValueChanged';
            this.className = "org.opendolphin.core.comm.BaseValueChangedCommand";
        }
        return BaseValueChangedCommand;
    })(opendolphin.Command);
    opendolphin.BaseValueChangedCommand = BaseValueChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var CallNamedActionCommand = (function (_super) {
        __extends(CallNamedActionCommand, _super);
        function CallNamedActionCommand(actionName) {
            _super.call(this);
            this.actionName = actionName;
            this.id = 'CallNamedAction';
            this.className = "org.opendolphin.core.comm.CallNamedActionCommand";
        }
        return CallNamedActionCommand;
    })(opendolphin.Command);
    opendolphin.CallNamedActionCommand = CallNamedActionCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var ChangeAttributeMetadataCommand = (function (_super) {
        __extends(ChangeAttributeMetadataCommand, _super);
        function ChangeAttributeMetadataCommand(attributeId, metadataName, value) {
            _super.call(this);
            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
            this.id = 'ChangeAttributeMetadata';
            this.className = "org.opendolphin.core.comm.ChangeAttributeMetadataCommand";
        }
        return ChangeAttributeMetadataCommand;
    })(opendolphin.Command);
    opendolphin.ChangeAttributeMetadataCommand = ChangeAttributeMetadataCommand;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var EventBus = (function () {
        function EventBus() {
            this.eventHandlers = [];
        }
        EventBus.prototype.onEvent = function (eventHandler) {
            this.eventHandlers.push(eventHandler);
        };
        EventBus.prototype.trigger = function (event) {
            this.eventHandlers.forEach(function (handle) { return handle(event); });
        };
        return EventBus;
    })();
    opendolphin.EventBus = EventBus;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientAttribute.ts" />
/// <reference path="EventBus.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var presentationModelInstanceCount = 0; // todo dk: consider making this static in class
    var ClientPresentationModel = (function () {
        function ClientPresentationModel(id, presentationModelType) {
            this.id = id;
            this.presentationModelType = presentationModelType;
            this.attributes = [];
            this.clientSideOnly = false;
            this.dirty = false;
            if (typeof id !== 'undefined' && id != null) {
                this.id = id;
            }
            else {
                this.id = (presentationModelInstanceCount++).toString();
            }
            this.invalidBus = new opendolphin.EventBus();
            this.dirtyValueChangeBus = new opendolphin.EventBus();
        }
        // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
        /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */
        ClientPresentationModel.prototype.copy = function () {
            var result = new ClientPresentationModel(null, this.presentationModelType);
            result.clientSideOnly = true;
            this.getAttributes().forEach(function (attribute) {
                var attributeCopy = attribute.copy();
                result.addAttribute(attributeCopy);
            });
            return result;
        };
        //add array of attributes
        ClientPresentationModel.prototype.addAttributes = function (attributes) {
            var _this = this;
            if (!attributes || attributes.length < 1)
                return;
            attributes.forEach(function (attr) {
                _this.addAttribute(attr);
            });
        };
        ClientPresentationModel.prototype.addAttribute = function (attribute) {
            var _this = this;
            if (!attribute || (this.attributes.indexOf(attribute) > -1)) {
                return;
            }
            if (this.findAttributeByPropertyNameAndTag(attribute.propertyName, attribute.tag)) {
                throw new Error("There already is an attribute with property name: " + attribute.propertyName
                    + " and tag: " + attribute.tag + " in presentation model with id: " + this.id);
            }
            if (attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())) {
                throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier()
                    + " in presentation model with id: " + this.id);
            }
            attribute.setPresentationModel(this);
            this.attributes.push(attribute);
            if (attribute.tag == opendolphin.Tag.value()) {
                this.updateDirty();
            }
            attribute.onValueChange(function (evt) {
                _this.invalidBus.trigger({ source: _this });
            });
        };
        ClientPresentationModel.prototype.updateDirty = function () {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].isDirty()) {
                    this.setDirty(true);
                    return;
                }
            }
            ;
            this.setDirty(false);
        };
        ClientPresentationModel.prototype.updateAttributeDirtyness = function () {
            for (var i = 0; i < this.attributes.length; i++) {
                this.attributes[i].updateDirty();
            }
        };
        ClientPresentationModel.prototype.isDirty = function () {
            return this.dirty;
        };
        ClientPresentationModel.prototype.setDirty = function (dirty) {
            var oldVal = this.dirty;
            this.dirty = dirty;
            this.dirtyValueChangeBus.trigger({ 'oldValue': oldVal, 'newValue': this.dirty });
        };
        ClientPresentationModel.prototype.reset = function () {
            this.attributes.forEach(function (attribute) {
                attribute.reset();
            });
        };
        ClientPresentationModel.prototype.rebase = function () {
            this.attributes.forEach(function (attribute) {
                attribute.rebase();
            });
        };
        ClientPresentationModel.prototype.onDirty = function (eventHandler) {
            this.dirtyValueChangeBus.onEvent(eventHandler);
        };
        ClientPresentationModel.prototype.onInvalidated = function (handleInvalidate) {
            this.invalidBus.onEvent(handleInvalidate);
        };
        /** returns a copy of the internal state */
        ClientPresentationModel.prototype.getAttributes = function () {
            return this.attributes.slice(0);
        };
        ClientPresentationModel.prototype.getAt = function (propertyName, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            return this.findAttributeByPropertyNameAndTag(propertyName, tag);
        };
        ClientPresentationModel.prototype.findAttributeByPropertyName = function (propertyName) {
            return this.findAttributeByPropertyNameAndTag(propertyName, opendolphin.Tag.value());
        };
        ClientPresentationModel.prototype.findAllAttributesByPropertyName = function (propertyName) {
            var result = [];
            if (!propertyName)
                return null;
            this.attributes.forEach(function (attribute) {
                if (attribute.propertyName == propertyName) {
                    result.push(attribute);
                }
            });
            return result;
        };
        ClientPresentationModel.prototype.findAttributeByPropertyNameAndTag = function (propertyName, tag) {
            if (!propertyName || !tag)
                return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if ((this.attributes[i].propertyName == propertyName) && (this.attributes[i].tag == tag)) {
                    return this.attributes[i];
                }
            }
            return null;
        };
        ClientPresentationModel.prototype.findAttributeByQualifier = function (qualifier) {
            if (!qualifier)
                return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getQualifier() == qualifier) {
                    return this.attributes[i];
                }
            }
            ;
            return null;
        };
        ClientPresentationModel.prototype.findAttributeById = function (id) {
            if (!id)
                return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].id == id) {
                    return this.attributes[i];
                }
            }
            ;
            return null;
        };
        ClientPresentationModel.prototype.syncWith = function (sourcePresentationModel) {
            this.attributes.forEach(function (targetAttribute) {
                var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName, targetAttribute.tag);
                if (sourceAttribute) {
                    targetAttribute.syncWith(sourceAttribute);
                }
            });
        };
        return ClientPresentationModel;
    })();
    opendolphin.ClientPresentationModel = ClientPresentationModel;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="EventBus.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientAttribute = (function () {
        function ClientAttribute(propertyName, qualifier, value, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            this.propertyName = propertyName;
            this.tag = tag;
            this.dirty = false;
            this.id = "" + (ClientAttribute.clientAttributeInstanceCount++) + "C";
            this.valueChangeBus = new opendolphin.EventBus();
            this.qualifierChangeBus = new opendolphin.EventBus();
            this.dirtyValueChangeBus = new opendolphin.EventBus();
            this.baseValueChangeBus = new opendolphin.EventBus();
            this.setValue(value);
            this.setBaseValue(value);
            this.setQualifier(qualifier);
        }
        /** a copy constructor with new id and no presentation model */
        ClientAttribute.prototype.copy = function () {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue(), this.tag);
            result.setBaseValue(this.getBaseValue());
            return result;
        };
        ClientAttribute.prototype.isDirty = function () {
            return this.dirty;
        };
        ClientAttribute.prototype.getBaseValue = function () {
            return this.baseValue;
        };
        ClientAttribute.prototype.setPresentationModel = function (presentationModel) {
            if (this.presentationModel) {
                alert("You can not set a presentation model for an attribute that is already bound.");
            }
            this.presentationModel = presentationModel;
        };
        ClientAttribute.prototype.getPresentationModel = function () {
            return this.presentationModel;
        };
        ClientAttribute.prototype.getValue = function () {
            return this.value;
        };
        ClientAttribute.prototype.setValue = function (newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value == verifiedValue)
                return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.setDirty(this.calculateDirty(this.baseValue, verifiedValue));
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
        };
        ClientAttribute.prototype.calculateDirty = function (baseValue, value) {
            if (baseValue == null) {
                return value != null;
            }
            else {
                return baseValue != value;
            }
        };
        ClientAttribute.prototype.updateDirty = function () {
            this.setDirty(this.calculateDirty(this.baseValue, this.value));
        };
        ClientAttribute.prototype.setDirty = function (dirty) {
            var oldVal = this.dirty;
            this.dirty = dirty;
            this.dirtyValueChangeBus.trigger({ 'oldValue': oldVal, 'newValue': this.dirty });
            if (this.presentationModel)
                this.presentationModel.updateDirty();
        };
        ClientAttribute.prototype.setQualifier = function (newQualifier) {
            if (this.qualifier == newQualifier)
                return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
        };
        ClientAttribute.prototype.getQualifier = function () {
            return this.qualifier;
        };
        ClientAttribute.prototype.setBaseValue = function (baseValue) {
            if (this.baseValue == baseValue)
                return;
            var oldBaseValue = this.baseValue;
            this.baseValue = baseValue;
            this.setDirty(this.calculateDirty(baseValue, this.value));
            this.baseValueChangeBus.trigger({ 'oldValue': oldBaseValue, 'newValue': baseValue });
        };
        ClientAttribute.prototype.rebase = function () {
            this.setBaseValue(this.value);
            this.setDirty(false); // this is not superfluous!
        };
        ClientAttribute.prototype.reset = function () {
            this.setValue(this.baseValue);
            this.setDirty(false); // this is not superfluous!
        };
        ClientAttribute.checkValue = function (value) {
            if (value == null || value == undefined) {
                return null;
            }
            var result = value;
            if (result instanceof String || result instanceof Boolean || result instanceof Number) {
                result = value.valueOf();
            }
            if (result instanceof ClientAttribute) {
                console.log("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.");
                result = this.checkValue(value.value);
            }
            var ok = false;
            if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result) > -1 || result instanceof Date) {
                ok = true;
            }
            if (!ok) {
                throw new Error("Attribute values of this type are not allowed: " + typeof value);
            }
            return result;
        };
        ClientAttribute.prototype.onValueChange = function (eventHandler) {
            this.valueChangeBus.onEvent(eventHandler);
            eventHandler({ "oldValue": this.value, "newValue": this.value });
        };
        ClientAttribute.prototype.onQualifierChange = function (eventHandler) {
            this.qualifierChangeBus.onEvent(eventHandler);
        };
        ClientAttribute.prototype.onDirty = function (eventHandler) {
            this.dirtyValueChangeBus.onEvent(eventHandler);
        };
        ClientAttribute.prototype.onBaseValueChange = function (eventHandler) {
            this.baseValueChangeBus.onEvent(eventHandler);
        };
        ClientAttribute.prototype.syncWith = function (sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setBaseValue(sourceAttribute.getBaseValue());
                this.setValue(sourceAttribute.value);
            }
        };
        ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
        ClientAttribute.clientAttributeInstanceCount = 0;
        return ClientAttribute;
    })();
    opendolphin.ClientAttribute = ClientAttribute;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var ValueChangedCommand = (function (_super) {
        __extends(ValueChangedCommand, _super);
        function ValueChangedCommand(attributeId, oldValue, newValue) {
            _super.call(this);
            this.attributeId = attributeId;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.id = "ValueChanged";
            this.className = "org.opendolphin.core.comm.ValueChangedCommand";
        }
        return ValueChangedCommand;
    })(opendolphin.Command);
    opendolphin.ValueChangedCommand = ValueChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var NamedCommand = (function (_super) {
        __extends(NamedCommand, _super);
        function NamedCommand(name) {
            _super.call(this);
            this.id = name;
            this.className = "org.opendolphin.core.comm.NamedCommand";
        }
        return NamedCommand;
    })(opendolphin.Command);
    opendolphin.NamedCommand = NamedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var EmptyNotification = (function (_super) {
        __extends(EmptyNotification, _super);
        function EmptyNotification() {
            _super.call(this);
            this.id = "Empty";
            this.className = "org.opendolphin.core.comm.EmptyNotification";
        }
        return EmptyNotification;
    })(opendolphin.Command);
    opendolphin.EmptyNotification = EmptyNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="ValueChangedCommand.ts"/>
/// <reference path="NamedCommand.ts"/>
/// <reference path="EmptyNotification.ts"/>
var opendolphin;
(function (opendolphin) {
    /** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
    var NoCommandBatcher = (function () {
        function NoCommandBatcher() {
        }
        NoCommandBatcher.prototype.batch = function (queue) {
            return [queue.shift()];
        };
        return NoCommandBatcher;
    })();
    opendolphin.NoCommandBatcher = NoCommandBatcher;
    /** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
    var BlindCommandBatcher = (function () {
        /** folding: whether we should try folding ValueChangedCommands */
        function BlindCommandBatcher(folding, maxBatchSize) {
            if (folding === void 0) { folding = true; }
            if (maxBatchSize === void 0) { maxBatchSize = 50; }
            this.folding = folding;
            this.maxBatchSize = maxBatchSize;
        }
        BlindCommandBatcher.prototype.batch = function (queue) {
            var result = [];
            this.processNext(this.maxBatchSize, queue, result); // do not batch more than this.maxBatchSize commands to avoid stack overflow on recursion.
            return result;
        };
        // recursive impl method to side-effect both queue and batch
        BlindCommandBatcher.prototype.processNext = function (maxBatchSize, queue, batch) {
            if (queue.length < 1 || maxBatchSize < 1)
                return;
            var candidate = queue.shift();
            if (this.folding && candidate.command instanceof opendolphin.ValueChangedCommand && (!candidate.handler)) {
                var found = null;
                var canCmd = candidate.command;
                for (var i = 0; i < batch.length && found == null; i++) {
                    if (batch[i].command instanceof opendolphin.ValueChangedCommand) {
                        var batchCmd = batch[i].command;
                        if (canCmd.attributeId == batchCmd.attributeId && batchCmd.newValue == canCmd.oldValue) {
                            found = batchCmd;
                        }
                    }
                }
                if (found) {
                    found.newValue = canCmd.newValue; // change existing value, do not batch
                }
                else {
                    batch.push(candidate); // we cannot merge, so batch the candidate
                }
            }
            else {
                batch.push(candidate);
            }
            if (!candidate.handler &&
                !(candidate.command['className'] == "org.opendolphin.core.comm.NamedCommand") &&
                !(candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification") // and no unknown client side effect
            ) {
                this.processNext(maxBatchSize - 1, queue, batch); // then we can proceed with batching
            }
        };
        return BlindCommandBatcher;
    })();
    opendolphin.BlindCommandBatcher = BlindCommandBatcher;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Codec = (function () {
        function Codec() {
        }
        Codec.prototype.encode = function (commands) {
            return JSON.stringify(commands); // todo dk: look for possible API support for character encoding
        };
        Codec.prototype.decode = function (transmitted) {
            if (typeof transmitted == 'string') {
                return JSON.parse(transmitted);
            }
            else {
                return transmitted;
            }
        };
        return Codec;
    })();
    opendolphin.Codec = Codec;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var SignalCommand = (function (_super) {
        __extends(SignalCommand, _super);
        function SignalCommand(name) {
            _super.call(this);
            this.id = name;
            this.className = "org.opendolphin.core.comm.SignalCommand";
        }
        return SignalCommand;
    })(opendolphin.Command);
    opendolphin.SignalCommand = SignalCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var CreatePresentationModelCommand = (function (_super) {
        __extends(CreatePresentationModelCommand, _super);
        function CreatePresentationModelCommand(presentationModel) {
            _super.call(this);
            this.attributes = [];
            this.clientSideOnly = false;
            this.id = "CreatePresentationModel";
            this.className = "org.opendolphin.core.comm.CreatePresentationModelCommand";
            this.pmId = presentationModel.id;
            this.pmType = presentationModel.presentationModelType;
            var attrs = this.attributes;
            presentationModel.getAttributes().forEach(function (attr) {
                attrs.push({
                    propertyName: attr.propertyName,
                    id: attr.id,
                    qualifier: attr.getQualifier(),
                    value: attr.getValue(),
                    tag: attr.tag
                });
            });
        }
        return CreatePresentationModelCommand;
    })(opendolphin.Command);
    opendolphin.CreatePresentationModelCommand = CreatePresentationModelCommand;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Map = (function () {
        function Map() {
            this.keys = [];
            this.data = [];
        }
        Map.prototype.put = function (key, value) {
            if (!this.containsKey(key)) {
                this.keys.push(key);
            }
            this.data[this.keys.indexOf(key)] = value;
        };
        Map.prototype.get = function (key) {
            return this.data[this.keys.indexOf(key)];
        };
        Map.prototype.remove = function (key) {
            if (this.containsKey(key)) {
                var index = this.keys.indexOf(key);
                this.keys.splice(index, 1);
                this.data.splice(index, 1);
                return true;
            }
            return false;
        };
        Map.prototype.isEmpty = function () {
            return this.keys.length == 0;
        };
        Map.prototype.length = function () {
            return this.keys.length;
        };
        Map.prototype.forEach = function (handler) {
            for (var i = 0; i < this.keys.length; i++) {
                handler(this.keys[i], this.data[i]);
            }
        };
        Map.prototype.containsKey = function (key) {
            return this.keys.indexOf(key) > -1;
        };
        Map.prototype.containsValue = function (value) {
            return this.data.indexOf(value) > -1;
        };
        Map.prototype.values = function () {
            return this.data.slice(0);
        };
        Map.prototype.keySet = function () {
            return this.keys.slice(0);
        };
        return Map;
    })();
    opendolphin.Map = Map;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletedAllPresentationModelsOfTypeNotification = (function (_super) {
        __extends(DeletedAllPresentationModelsOfTypeNotification, _super);
        function DeletedAllPresentationModelsOfTypeNotification(pmType) {
            _super.call(this);
            this.pmType = pmType;
            this.id = 'DeletedAllPresentationModelsOfType';
            this.className = "org.opendolphin.core.comm.DeletedAllPresentationModelsOfTypeNotification";
        }
        return DeletedAllPresentationModelsOfTypeNotification;
    })(opendolphin.Command);
    opendolphin.DeletedAllPresentationModelsOfTypeNotification = DeletedAllPresentationModelsOfTypeNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletedPresentationModelNotification = (function (_super) {
        __extends(DeletedPresentationModelNotification, _super);
        function DeletedPresentationModelNotification(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'DeletedPresentationModel';
            this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
        }
        return DeletedPresentationModelNotification;
    })(opendolphin.Command);
    opendolphin.DeletedPresentationModelNotification = DeletedPresentationModelNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts"/>
/// <reference path="ClientDolphin.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="CreatePresentationModelCommand.ts"/>
/// <reference path="ClientAttribute.ts" />
/// <reference path="ValueChangedCommand.ts"/>
/// <reference path="ChangeAttributeMetadataCommand.ts"/>
/// <reference path="Attribute.ts"/>
/// <reference path="Map.ts"/>
/// <reference path="DeletedAllPresentationModelsOfTypeNotification.ts"/>
/// <reference path="EventBus.ts"/>
/// <reference path="ClientPresentationModel.ts"/>
/// <reference path="DeletedPresentationModelNotification.ts"/>
/// <reference path="BaseValueChangedCommand.ts"/>
var opendolphin;
(function (opendolphin) {
    (function (Type) {
        Type[Type["ADDED"] = 'ADDED'] = "ADDED";
        Type[Type["REMOVED"] = 'REMOVED'] = "REMOVED";
    })(opendolphin.Type || (opendolphin.Type = {}));
    var Type = opendolphin.Type;
    var ClientModelStore = (function () {
        function ClientModelStore(clientDolphin) {
            this.clientDolphin = clientDolphin;
            this.presentationModels = new opendolphin.Map();
            this.presentationModelsPerType = new opendolphin.Map();
            this.attributesPerId = new opendolphin.Map();
            this.attributesPerQualifier = new opendolphin.Map();
            this.modelStoreChangeBus = new opendolphin.EventBus();
        }
        ClientModelStore.prototype.getClientDolphin = function () {
            return this.clientDolphin;
        };
        ClientModelStore.prototype.registerModel = function (model) {
            var _this = this;
            if (model.clientSideOnly) {
                return;
            }
            var connector = this.clientDolphin.getClientConnector();
            var createPMCommand = new opendolphin.CreatePresentationModelCommand(model);
            connector.send(createPMCommand, null);
            model.getAttributes().forEach(function (attribute) {
                _this.registerAttribute(attribute);
            });
        };
        ClientModelStore.prototype.registerAttribute = function (attribute) {
            var _this = this;
            this.addAttributeById(attribute);
            if (attribute.getQualifier()) {
                this.addAttributeByQualifier(attribute);
            }
            // whenever an attribute changes its value, the server needs to be notified
            // and all other attributes with the same qualifier are given the same value
            attribute.onValueChange(function (evt) {
                var valueChangeCommand = new opendolphin.ValueChangedCommand(attribute.id, evt.oldValue, evt.newValue);
                _this.clientDolphin.getClientConnector().send(valueChangeCommand, null);
                if (attribute.getQualifier()) {
                    var attrs = _this.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setValue(attribute.getValue());
                    });
                }
            });
            // all attributes with the same qualifier should have the same base value
            attribute.onBaseValueChange(function (evt) {
                var baseValueChangeCommand = new opendolphin.BaseValueChangedCommand(attribute.id);
                _this.clientDolphin.getClientConnector().send(baseValueChangeCommand, null);
                if (attribute.getQualifier()) {
                    var attrs = _this.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setBaseValue(attribute.getBaseValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                var changeAttrMetadataCmd = new opendolphin.ChangeAttributeMetadataCommand(attribute.id, opendolphin.Attribute.QUALIFIER_PROPERTY, evt.newValue);
                _this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
            });
        };
        ClientModelStore.prototype.add = function (model) {
            if (!model) {
                return false;
            }
            if (this.presentationModels.containsKey(model.id)) {
                console.log("There already is a PM with id " + model.id);
            }
            var added = false;
            if (!this.presentationModels.containsValue(model)) {
                this.presentationModels.put(model.id, model);
                this.addPresentationModelByType(model);
                this.registerModel(model);
                this.modelStoreChangeBus.trigger({ 'eventType': Type.ADDED, 'clientPresentationModel': model });
                added = true;
            }
            return added;
        };
        ClientModelStore.prototype.remove = function (model) {
            var _this = this;
            if (!model) {
                return false;
            }
            var removed = false;
            if (this.presentationModels.containsValue(model)) {
                this.removePresentationModelByType(model);
                this.presentationModels.remove(model.id);
                model.getAttributes().forEach(function (attribute) {
                    _this.removeAttributeById(attribute);
                    if (attribute.getQualifier()) {
                        _this.removeAttributeByQualifier(attribute);
                    }
                });
                this.modelStoreChangeBus.trigger({ 'eventType': Type.REMOVED, 'clientPresentationModel': model });
                removed = true;
            }
            return removed;
        };
        ClientModelStore.prototype.findAttributesByFilter = function (filter) {
            var matches = [];
            this.presentationModels.forEach(function (key, model) {
                model.getAttributes().forEach(function (attr) {
                    if (filter(attr)) {
                        matches.push(attr);
                    }
                });
            });
            return matches;
        };
        ClientModelStore.prototype.addPresentationModelByType = function (model) {
            if (!model) {
                return;
            }
            var type = model.presentationModelType;
            if (!type) {
                return;
            }
            var presentationModels = this.presentationModelsPerType.get(type);
            if (!presentationModels) {
                presentationModels = [];
                this.presentationModelsPerType.put(type, presentationModels);
            }
            if (!(presentationModels.indexOf(model) > -1)) {
                presentationModels.push(model);
            }
        };
        ClientModelStore.prototype.removePresentationModelByType = function (model) {
            if (!model || !(model.presentationModelType)) {
                return;
            }
            var presentationModels = this.presentationModelsPerType.get(model.presentationModelType);
            if (!presentationModels) {
                return;
            }
            if (presentationModels.length > -1) {
                presentationModels.splice(presentationModels.indexOf(model), 1);
            }
            if (presentationModels.length === 0) {
                this.presentationModelsPerType.remove(model.presentationModelType);
            }
        };
        ClientModelStore.prototype.listPresentationModelIds = function () {
            return this.presentationModels.keySet().slice(0);
        };
        ClientModelStore.prototype.listPresentationModels = function () {
            return this.presentationModels.values();
        };
        ClientModelStore.prototype.findPresentationModelById = function (id) {
            return this.presentationModels.get(id);
        };
        ClientModelStore.prototype.findAllPresentationModelByType = function (type) {
            if (!type || !this.presentationModelsPerType.containsKey(type)) {
                return [];
            }
            return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
        };
        ClientModelStore.prototype.deleteAllPresentationModelOfType = function (presentationModelType) {
            var _this = this;
            var presentationModels = this.findAllPresentationModelByType(presentationModelType);
            presentationModels.forEach(function (pm) {
                _this.deletePresentationModel(pm, false);
            });
            this.clientDolphin.getClientConnector().send(new opendolphin.DeletedAllPresentationModelsOfTypeNotification(presentationModelType), undefined);
        };
        ClientModelStore.prototype.deletePresentationModel = function (model, notify) {
            if (!model) {
                return;
            }
            if (this.containsPresentationModel(model.id)) {
                this.remove(model);
                if (!notify || model.clientSideOnly) {
                    return;
                }
                this.clientDolphin.getClientConnector().send(new opendolphin.DeletedPresentationModelNotification(model.id), null);
            }
        };
        ClientModelStore.prototype.containsPresentationModel = function (id) {
            return this.presentationModels.containsKey(id);
        };
        ClientModelStore.prototype.addAttributeById = function (attribute) {
            if (!attribute || this.attributesPerId.containsKey(attribute.id)) {
                return;
            }
            this.attributesPerId.put(attribute.id, attribute);
        };
        ClientModelStore.prototype.removeAttributeById = function (attribute) {
            if (!attribute || !this.attributesPerId.containsKey(attribute.id)) {
                return;
            }
            this.attributesPerId.remove(attribute.id);
        };
        ClientModelStore.prototype.findAttributeById = function (id) {
            return this.attributesPerId.get(id);
        };
        ClientModelStore.prototype.addAttributeByQualifier = function (attribute) {
            if (!attribute || !attribute.getQualifier()) {
                return;
            }
            var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
            if (!attributes) {
                attributes = [];
                this.attributesPerQualifier.put(attribute.getQualifier(), attributes);
            }
            if (!(attributes.indexOf(attribute) > -1)) {
                attributes.push(attribute);
            }
        };
        ClientModelStore.prototype.removeAttributeByQualifier = function (attribute) {
            if (!attribute || !attribute.getQualifier()) {
                return;
            }
            var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
            if (!attributes) {
                return;
            }
            if (attributes.length > -1) {
                attributes.splice(attributes.indexOf(attribute), 1);
            }
            if (attributes.length === 0) {
                this.attributesPerQualifier.remove(attribute.getQualifier());
            }
        };
        ClientModelStore.prototype.findAllAttributesByQualifier = function (qualifier) {
            if (!qualifier || !this.attributesPerQualifier.containsKey(qualifier)) {
                return [];
            }
            return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
        };
        ClientModelStore.prototype.onModelStoreChange = function (eventHandler) {
            this.modelStoreChangeBus.onEvent(eventHandler);
        };
        ClientModelStore.prototype.onModelStoreChangeForType = function (presentationModelType, eventHandler) {
            this.modelStoreChangeBus.onEvent(function (pmStoreEvent) {
                if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                    eventHandler(pmStoreEvent);
                }
            });
        };
        return ClientModelStore;
    })();
    opendolphin.ClientModelStore = ClientModelStore;
})(opendolphin || (opendolphin = {}));
/// <reference path="NamedCommand.ts" />
/// <reference path="SignalCommand.ts" />
/// <reference path="EmptyNotification.ts" />
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientModelStore.ts" />
/// <reference path="ClientConnector.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="AttributeCreatedNotification.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientDolphin = (function () {
        function ClientDolphin() {
        }
        ClientDolphin.prototype.setClientConnector = function (clientConnector) {
            this.clientConnector = clientConnector;
        };
        ClientDolphin.prototype.getClientConnector = function () {
            return this.clientConnector;
        };
        ClientDolphin.prototype.send = function (commandName, onFinished) {
            this.clientConnector.send(new opendolphin.NamedCommand(commandName), onFinished);
        };
        ClientDolphin.prototype.sendEmpty = function (onFinished) {
            this.clientConnector.send(new opendolphin.EmptyNotification(), onFinished);
        };
        // factory method for attributes
        ClientDolphin.prototype.attribute = function (propertyName, qualifier, value, tag) {
            return new opendolphin.ClientAttribute(propertyName, qualifier, value, tag);
        };
        // factory method for presentation models
        ClientDolphin.prototype.presentationModel = function (id, type) {
            var attributes = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                attributes[_i - 2] = arguments[_i];
            }
            var model = new opendolphin.ClientPresentationModel(id, type);
            if (attributes && attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    model.addAttribute(attribute);
                });
            }
            this.getClientModelStore().add(model);
            return model;
        };
        ClientDolphin.prototype.setClientModelStore = function (clientModelStore) {
            this.clientModelStore = clientModelStore;
        };
        ClientDolphin.prototype.getClientModelStore = function () {
            return this.clientModelStore;
        };
        ClientDolphin.prototype.listPresentationModelIds = function () {
            return this.getClientModelStore().listPresentationModelIds();
        };
        ClientDolphin.prototype.listPresentationModels = function () {
            return this.getClientModelStore().listPresentationModels();
        };
        ClientDolphin.prototype.findAllPresentationModelByType = function (presentationModelType) {
            return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
        };
        ClientDolphin.prototype.getAt = function (id) {
            return this.findPresentationModelById(id);
        };
        ClientDolphin.prototype.findPresentationModelById = function (id) {
            return this.getClientModelStore().findPresentationModelById(id);
        };
        ClientDolphin.prototype.deletePresentationModel = function (modelToDelete) {
            this.getClientModelStore().deletePresentationModel(modelToDelete, true);
        };
        ClientDolphin.prototype.deleteAllPresentationModelOfType = function (presentationModelType) {
            this.getClientModelStore().deleteAllPresentationModelOfType(presentationModelType);
        };
        ClientDolphin.prototype.updatePresentationModelQualifier = function (presentationModel) {
            var _this = this;
            presentationModel.getAttributes().forEach(function (sourceAttribute) {
                _this.updateAttributeQualifier(sourceAttribute);
            });
        };
        ClientDolphin.prototype.updateAttributeQualifier = function (sourceAttribute) {
            if (!sourceAttribute.getQualifier())
                return;
            var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
            attributes.forEach(function (targetAttribute) {
                if (targetAttribute.tag != sourceAttribute.tag)
                    return; // attributes with same qualifier and tag
                targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
                targetAttribute.setBaseValue(sourceAttribute.getBaseValue()); // and same base value and so dirtyness
            });
        };
        ClientDolphin.prototype.tag = function (presentationModel, propertyName, value, tag) {
            var clientAttribute = new opendolphin.ClientAttribute(propertyName, null, value, tag);
            this.addAttributeToModel(presentationModel, clientAttribute);
            return clientAttribute;
        };
        ClientDolphin.prototype.addAttributeToModel = function (presentationModel, clientAttribute) {
            presentationModel.addAttribute(clientAttribute);
            this.getClientModelStore().registerAttribute(clientAttribute);
            if (!presentationModel.clientSideOnly) {
                this.clientConnector.send(new opendolphin.AttributeCreatedNotification(presentationModel.id, clientAttribute.id, clientAttribute.propertyName, clientAttribute.getValue(), clientAttribute.getQualifier(), clientAttribute.tag), null);
            }
        };
        ////// push support ///////
        ClientDolphin.prototype.startPushListening = function (pushActionName, releaseActionName) {
            this.clientConnector.setPushListener(new opendolphin.NamedCommand(pushActionName));
            this.clientConnector.setReleaseCommand(new opendolphin.SignalCommand(releaseActionName));
            this.clientConnector.setPushEnabled(true);
            this.clientConnector.listen();
        };
        ClientDolphin.prototype.stopPushListening = function () {
            this.clientConnector.setPushEnabled(false);
        };
        return ClientDolphin;
    })();
    opendolphin.ClientDolphin = ClientDolphin;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var PresentationModelResetedCommand = (function (_super) {
        __extends(PresentationModelResetedCommand, _super);
        function PresentationModelResetedCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'PresentationModelReseted';
            this.className = "org.opendolphin.core.comm.PresentationModelResetedCommand";
        }
        return PresentationModelResetedCommand;
    })(opendolphin.Command);
    opendolphin.PresentationModelResetedCommand = PresentationModelResetedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var SavedPresentationModelNotification = (function (_super) {
        __extends(SavedPresentationModelNotification, _super);
        function SavedPresentationModelNotification(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'SavedPresentationModel';
            this.className = "org.opendolphin.core.comm.SavedPresentationModelNotification";
        }
        return SavedPresentationModelNotification;
    })(opendolphin.Command);
    opendolphin.SavedPresentationModelNotification = SavedPresentationModelNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var InitializeAttributeCommand = (function (_super) {
        __extends(InitializeAttributeCommand, _super);
        function InitializeAttributeCommand(pmId, pmType, propertyName, qualifier, newValue, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            _super.call(this);
            this.pmId = pmId;
            this.pmType = pmType;
            this.propertyName = propertyName;
            this.qualifier = qualifier;
            this.newValue = newValue;
            this.tag = tag;
            this.id = 'InitializeAttribute';
            this.className = "org.opendolphin.core.comm.InitializeAttributeCommand";
        }
        return InitializeAttributeCommand;
    })(opendolphin.Command);
    opendolphin.InitializeAttributeCommand = InitializeAttributeCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var SwitchPresentationModelCommand = (function (_super) {
        __extends(SwitchPresentationModelCommand, _super);
        function SwitchPresentationModelCommand(pmId, sourcePmId) {
            _super.call(this);
            this.pmId = pmId;
            this.sourcePmId = sourcePmId;
            this.id = 'SwitchPresentationModel';
            this.className = "org.opendolphin.core.comm.SwitchPresentationModelCommand";
        }
        return SwitchPresentationModelCommand;
    })(opendolphin.Command);
    opendolphin.SwitchPresentationModelCommand = SwitchPresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeleteAllPresentationModelsOfTypeCommand = (function (_super) {
        __extends(DeleteAllPresentationModelsOfTypeCommand, _super);
        function DeleteAllPresentationModelsOfTypeCommand(pmType) {
            _super.call(this);
            this.pmType = pmType;
            this.id = 'DeleteAllPresentationModelsOfType';
            this.className = "org.opendolphin.core.comm.DeleteAllPresentationModelsOfTypeCommand";
        }
        return DeleteAllPresentationModelsOfTypeCommand;
    })(opendolphin.Command);
    opendolphin.DeleteAllPresentationModelsOfTypeCommand = DeleteAllPresentationModelsOfTypeCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletePresentationModelCommand = (function (_super) {
        __extends(DeletePresentationModelCommand, _super);
        function DeletePresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'DeletePresentationModel';
            this.className = "org.opendolphin.core.comm.DeletePresentationModelCommand";
        }
        return DeletePresentationModelCommand;
    })(opendolphin.Command);
    opendolphin.DeletePresentationModelCommand = DeletePresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DataCommand = (function (_super) {
        __extends(DataCommand, _super);
        function DataCommand(data) {
            _super.call(this);
            this.data = data;
            this.id = "Data";
            this.className = "org.opendolphin.core.comm.DataCommand";
        }
        return DataCommand;
    })(opendolphin.Command);
    opendolphin.DataCommand = DataCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="Command.ts" />
/// <reference path="CommandBatcher.ts" />
/// <reference path="Codec.ts" />
/// <reference path="CallNamedActionCommand.ts" />
/// <reference path="ClientDolphin.ts" />
/// <reference path="AttributeMetadataChangedCommand.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="PresentationModelResetedCommand.ts" />
/// <reference path="SavedPresentationModelNotification.ts" />
/// <reference path="InitializeAttributeCommand.ts" />
/// <reference path="SwitchPresentationModelCommand.ts" />
/// <reference path="BaseValueChangedCommand.ts" />
/// <reference path="ValueChangedCommand.ts" />
/// <reference path="DeleteAllPresentationModelsOfTypeCommand.ts" />
/// <reference path="DeleteAllPresentationModelsOfTypeCommand.ts" />
/// <reference path="DeletePresentationModelCommand.ts" />
/// <reference path="CreatePresentationModelCommand.ts" />
/// <reference path="DataCommand.ts" />
/// <reference path="NamedCommand.ts" />
/// <reference path="SignalCommand.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientConnector = (function () {
        function ClientConnector(transmitter, clientDolphin, slackMS, maxBatchSize) {
            if (slackMS === void 0) { slackMS = 0; }
            if (maxBatchSize === void 0) { maxBatchSize = 50; }
            this.commandQueue = [];
            this.currentlySending = false;
            this.pushEnabled = false;
            this.waiting = false;
            this.transmitter = transmitter;
            this.clientDolphin = clientDolphin;
            this.slackMS = slackMS;
            this.codec = new opendolphin.Codec();
            this.commandBatcher = new opendolphin.BlindCommandBatcher(true, maxBatchSize);
        }
        ClientConnector.prototype.setCommandBatcher = function (newBatcher) {
            this.commandBatcher = newBatcher;
        };
        ClientConnector.prototype.setPushEnabled = function (enabled) {
            this.pushEnabled = enabled;
        };
        ClientConnector.prototype.setPushListener = function (newListener) {
            this.pushListener = newListener;
        };
        ClientConnector.prototype.setReleaseCommand = function (newCommand) {
            this.releaseCommand = newCommand;
        };
        ClientConnector.prototype.send = function (command, onFinished) {
            this.commandQueue.push({ command: command, handler: onFinished });
            if (this.currentlySending) {
                this.release(); // there is not point in releasing if we do not send atm
                return;
            }
            this.doSendNext();
        };
        ClientConnector.prototype.doSendNext = function () {
            var _this = this;
            if (this.commandQueue.length < 1) {
                if (this.pushEnabled) {
                    this.enqueuePushCommand();
                }
                else {
                    this.currentlySending = false;
                    return;
                }
            }
            this.currentlySending = true;
            var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);
            var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
            var commands = cmdsAndHandlers.map(function (cah) { return cah.command; });
            this.transmitter.transmit(commands, function (response) {
                //console.log("server response: [" + response.map(it => it.id).join(", ") + "] ");
                var touchedPMs = [];
                response.forEach(function (command) {
                    var touched = _this.handle(command);
                    if (touched)
                        touchedPMs.push(touched);
                });
                if (callback) {
                    callback.onFinished(touchedPMs); // todo: make them unique?
                }
                // recursive call: fetch the next in line but allow a bit of slack such that
                // document events can fire, rendering is done and commands can batch up
                setTimeout(function () { return _this.doSendNext(); }, _this.slackMS);
            });
        };
        ClientConnector.prototype.handle = function (command) {
            if (command.id == "Data") {
                return this.handleDataCommand(command);
            }
            else if (command.id == "DeletePresentationModel") {
                return this.handleDeletePresentationModelCommand(command);
            }
            else if (command.id == "DeleteAllPresentationModelsOfType") {
                return this.handleDeleteAllPresentationModelOfTypeCommand(command);
            }
            else if (command.id == "CreatePresentationModel") {
                return this.handleCreatePresentationModelCommand(command);
            }
            else if (command.id == "ValueChanged") {
                return this.handleValueChangedCommand(command);
            }
            else if (command.id == "BaseValueChanged") {
                return this.handleBaseValueChangedCommand(command);
            }
            else if (command.id == "SwitchPresentationModel") {
                return this.handleSwitchPresentationModelCommand(command);
            }
            else if (command.id == "InitializeAttribute") {
                return this.handleInitializeAttributeCommand(command);
            }
            else if (command.id == "SavedPresentationModel") {
                return this.handleSavedPresentationModelNotification(command);
            }
            else if (command.id == "PresentationModelReseted") {
                return this.handlePresentationModelResetedCommand(command);
            }
            else if (command.id == "AttributeMetadataChanged") {
                return this.handleAttributeMetadataChangedCommand(command);
            }
            else if (command.id == "CallNamedAction") {
                return this.handleCallNamedActionCommand(command);
            }
            else {
                console.log("Cannot handle, unknown command " + command);
            }
            return null;
        };
        ClientConnector.prototype.handleDataCommand = function (serverCommand) {
            return serverCommand.data;
        };
        ClientConnector.prototype.handleDeletePresentationModelCommand = function (serverCommand) {
            var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
            if (!model)
                return null;
            this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
            return model;
        };
        ClientConnector.prototype.handleDeleteAllPresentationModelOfTypeCommand = function (serverCommand) {
            this.clientDolphin.deleteAllPresentationModelOfType(serverCommand.pmType);
            return null;
        };
        ClientConnector.prototype.handleCreatePresentationModelCommand = function (serverCommand) {
            var _this = this;
            if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
                throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
            }
            var attributes = [];
            serverCommand.attributes.forEach(function (attr) {
                var clientAttribute = _this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value, attr.tag ? attr.tag : opendolphin.Tag.value());
                clientAttribute.setBaseValue(attr.baseValue);
                if (attr.id && attr.id.match(".*S$")) {
                    clientAttribute.id = attr.id;
                }
                attributes.push(clientAttribute);
            });
            var clientPm = new opendolphin.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            clientPm.updateAttributeDirtyness();
            clientPm.updateDirty();
            return clientPm;
        };
        ClientConnector.prototype.handleValueChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update old value " + serverCommand.oldValue + " to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() == serverCommand.newValue) {
                //console.log("nothing to do. new value == old value");
                return null;
            }
            // Below was the code that would enforce that value changes only appear when the proper oldValue is given.
            // While that seemed appropriate at first, there are actually valid command sequences where the oldValue is not properly set.
            // We leave the commented code in the codebase to allow for logging/debugging such cases.
            //            if(clientAttribute.getValue() != serverCommand.oldValue) {
            //                console.log("attribute with id "+serverCommand.attributeId+" and value " + clientAttribute.getValue() +
            //                            " was set to value " + serverCommand.newValue + " even though the change was based on an outdated old value of " + serverCommand.oldValue);
            //            }
            clientAttribute.setValue(serverCommand.newValue);
            return null;
        };
        ClientConnector.prototype.handleBaseValueChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot set base value.");
                return null;
            }
            clientAttribute.rebase();
            return null;
        };
        ClientConnector.prototype.handleSwitchPresentationModelCommand = function (serverCommand) {
            var switchPm = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!switchPm) {
                console.log("switch model with id " + serverCommand.pmId + " not found, cannot switch.");
                return null;
            }
            var sourcePm = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.sourcePmId);
            if (!sourcePm) {
                console.log("source model with id " + serverCommand.sourcePmId + " not found, cannot switch.");
                return null;
            }
            switchPm.syncWith(sourcePm);
            return switchPm;
        };
        ClientConnector.prototype.handleInitializeAttributeCommand = function (serverCommand) {
            var attribute = new opendolphin.ClientAttribute(serverCommand.propertyName, serverCommand.qualifier, serverCommand.newValue, serverCommand.tag);
            if (serverCommand.qualifier) {
                var attributesCopy = this.clientDolphin.getClientModelStore().findAllAttributesByQualifier(serverCommand.qualifier);
                if (attributesCopy) {
                    if (!serverCommand.newValue) {
                        var attr = attributesCopy.shift();
                        if (attr) {
                            attribute.setValue(attr.getValue());
                        }
                    }
                    else {
                        attributesCopy.forEach(function (attr) {
                            attr.setValue(attribute.getValue());
                        });
                    }
                }
            }
            var presentationModel;
            if (serverCommand.pmId) {
                presentationModel = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            }
            if (!presentationModel) {
                presentationModel = new opendolphin.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
                this.clientDolphin.getClientModelStore().add(presentationModel);
            }
            this.clientDolphin.addAttributeToModel(presentationModel, attribute);
            this.clientDolphin.updatePresentationModelQualifier(presentationModel);
            return presentationModel;
        };
        ClientConnector.prototype.handleSavedPresentationModelNotification = function (serverCommand) {
            if (!serverCommand.pmId)
                return null;
            var model = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!model) {
                console.log("model with id " + serverCommand.pmId + " not found, cannot rebase.");
                return null;
            }
            model.rebase();
            return model;
        };
        ClientConnector.prototype.handlePresentationModelResetedCommand = function (serverCommand) {
            if (!serverCommand.pmId)
                return null;
            var model = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!model) {
                console.log("model with id " + serverCommand.pmId + " not found, cannot reset.");
                return null;
            }
            model.reset();
            return model;
        };
        ClientConnector.prototype.handleAttributeMetadataChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute)
                return null;
            clientAttribute[serverCommand.metadataName] = serverCommand.value;
            return null;
        };
        ClientConnector.prototype.handleCallNamedActionCommand = function (serverCommand) {
            this.clientDolphin.send(serverCommand.actionName, null);
            return null;
        };
        ///////////// push support ///////////////
        ClientConnector.prototype.listen = function () {
            if (!this.pushEnabled)
                return;
            if (this.waiting)
                return;
            // todo: how to issue a warning if no pushListener is set?
            if (!this.currentlySending) {
                this.doSendNext();
            }
        };
        ClientConnector.prototype.enqueuePushCommand = function () {
            var me = this;
            this.waiting = true;
            this.commandQueue.push({
                command: this.pushListener,
                handler: {
                    onFinished: function (models) { me.waiting = false; },
                    onFinishedData: null
                }
            });
        };
        ClientConnector.prototype.release = function () {
            if (!this.waiting)
                return;
            this.waiting = false;
            // todo: how to issue a warning if no releaseCommand is set?
            this.transmitter.signal(this.releaseCommand);
        };
        return ClientConnector;
    })();
    opendolphin.ClientConnector = ClientConnector;
})(opendolphin || (opendolphin = {}));
/// <reference path="DolphinBuilder.ts"/>
/**
 * JS-friendly facade to avoid too many dependencies in plain JS code.
 * The name of this file is also used for the initial lookup of the
 * one javascript file that contains all the dolphin code.
 * Changing the name requires the build support and all users
 * to be updated as well.
 * Dierk Koenig
 */
var opendolphin;
(function (opendolphin) {
    // factory method for the initialized dolphin
    // Deprecated ! Use 'makeDolphin() instead
    function dolphin(url, reset, slackMS) {
        if (slackMS === void 0) { slackMS = 300; }
        return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
    }
    opendolphin.dolphin = dolphin;
    // factory method to build an initialized dolphin
    function makeDolphin() {
        return new opendolphin.DolphinBuilder();
    }
    opendolphin.makeDolphin = makeDolphin;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="SignalCommand.ts"/>
/// <reference path="ClientConnector.ts"/>
var opendolphin;
(function (opendolphin) {
    /**
     * A transmitter that is not transmitting at all.
     * It may serve as a stand-in when no real transmitter is needed.
     */
    var NoTransmitter = (function () {
        function NoTransmitter() {
        }
        NoTransmitter.prototype.transmit = function (commands, onDone) {
            // do nothing special
            onDone([]);
        };
        NoTransmitter.prototype.signal = function (command) {
            // do nothing
        };
        return NoTransmitter;
    })();
    opendolphin.NoTransmitter = NoTransmitter;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="SignalCommand.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="Codec.ts"/>
var opendolphin;
(function (opendolphin) {
    var HttpTransmitter = (function () {
        function HttpTransmitter(url, reset, charset, errorHandler, supportCORS) {
            if (reset === void 0) { reset = true; }
            if (charset === void 0) { charset = "UTF-8"; }
            if (errorHandler === void 0) { errorHandler = null; }
            if (supportCORS === void 0) { supportCORS = false; }
            this.url = url;
            this.charset = charset;
            this.HttpCodes = {
                finished: 4,
                success: 200
            };
            this.errorHandler = errorHandler;
            this.supportCORS = supportCORS;
            this.http = new XMLHttpRequest();
            this.sig = new XMLHttpRequest();
            if (this.supportCORS) {
                if ("withCredentials" in this.http) {
                    this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
                    this.sig.withCredentials = true;
                }
            }
            this.codec = new opendolphin.Codec();
            if (reset) {
                this.invalidate();
            }
        }
        HttpTransmitter.prototype.transmit = function (commands, onDone) {
            var _this = this;
            this.http.onerror = function (evt) {
                _this.handleError('onerror', "");
                onDone([]);
            };
            this.http.onreadystatechange = function (evt) {
                if (_this.http.readyState == _this.HttpCodes.finished) {
                    if (_this.http.status == _this.HttpCodes.success) {
                        var responseText = _this.http.responseText;
                        if (responseText.trim().length > 0) {
                            try {
                                var responseCommands = _this.codec.decode(responseText);
                                onDone(responseCommands);
                            }
                            catch (err) {
                                console.log("Error occurred parsing responseText: ", err);
                                console.log("Incorrect responseText: ", responseText);
                                _this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                                onDone([]);
                            }
                        }
                        else {
                            _this.handleError('application', "HttpTransmitter: empty responseText");
                            onDone([]);
                        }
                    }
                    else {
                        _this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                        onDone([]);
                    }
                }
            };
            this.http.open('POST', this.url, true);
            if ("overrideMimeType" in this.http) {
                this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
            }
            this.http.send(this.codec.encode(commands));
        };
        HttpTransmitter.prototype.handleError = function (kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            }
            else {
                console.log("Error occurred: ", errorEvent);
            }
        };
        HttpTransmitter.prototype.signal = function (command) {
            this.sig.open('POST', this.url, true);
            this.sig.send(this.codec.encode([command]));
        };
        HttpTransmitter.prototype.invalidate = function () {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        };
        return HttpTransmitter;
    })();
    opendolphin.HttpTransmitter = HttpTransmitter;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientDolphin.ts"/>
/// <reference path="OpenDolphin.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="ClientModelStore.ts"/>
/// <reference path="NoTransmitter.ts"/>
/// <reference path="HttpTransmitter.ts"/>
/// <reference path="ClientAttribute.ts"/>
var opendolphin;
(function (opendolphin) {
    var DolphinBuilder = (function () {
        function DolphinBuilder() {
            this.reset_ = false;
            this.slackMS_ = 300;
            this.maxBatchSize_ = 50;
            this.supportCORS_ = false;
        }
        DolphinBuilder.prototype.url = function (url) {
            this.url_ = url;
            return this;
        };
        DolphinBuilder.prototype.reset = function (reset) {
            this.reset_ = reset;
            return this;
        };
        DolphinBuilder.prototype.slackMS = function (slackMS) {
            this.slackMS_ = slackMS;
            return this;
        };
        DolphinBuilder.prototype.maxBatchSize = function (maxBatchSize) {
            this.maxBatchSize_ = maxBatchSize;
            return this;
        };
        DolphinBuilder.prototype.supportCORS = function (supportCORS) {
            this.supportCORS_ = supportCORS;
            return this;
        };
        DolphinBuilder.prototype.errorHandler = function (errorHandler) {
            this.errorHandler_ = errorHandler;
            return this;
        };
        DolphinBuilder.prototype.build = function () {
            console.log("OpenDolphin js found");
            var clientDolphin = new opendolphin.ClientDolphin();
            var transmitter;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new opendolphin.HttpTransmitter(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_);
            }
            else {
                transmitter = new opendolphin.NoTransmitter();
            }
            clientDolphin.setClientConnector(new opendolphin.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new opendolphin.ClientModelStore(clientDolphin));
            console.log("ClientDolphin initialized");
            return clientDolphin;
        };
        return DolphinBuilder;
    })();
    opendolphin.DolphinBuilder = DolphinBuilder;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var GetPresentationModelCommand = (function (_super) {
        __extends(GetPresentationModelCommand, _super);
        function GetPresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'GetPresentationModel';
            this.className = "org.opendolphin.core.comm.GetPresentationModelCommand";
        }
        return GetPresentationModelCommand;
    })(opendolphin.Command);
    opendolphin.GetPresentationModelCommand = GetPresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var ResetPresentationModelCommand = (function (_super) {
        __extends(ResetPresentationModelCommand, _super);
        function ResetPresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'ResetPresentationModel';
            this.className = "org.opendolphin.core.comm.ResetPresentationModelCommand";
        }
        return ResetPresentationModelCommand;
    })(opendolphin.Command);
    opendolphin.ResetPresentationModelCommand = ResetPresentationModelCommand;
})(opendolphin || (opendolphin = {}));

module.exports = opendolphin;
},{}],66:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var Map = _dereq_('../bower_components/core.js/library/fn/map');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;


function BeanManager(classRepository) {
    checkMethod('BeanManager(classRepository)');
    checkParam(classRepository, 'classRepository');

    this.classRepository = classRepository;
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.updatedHandlers = new Map();
    this.arrayUpdatedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];
    this.allUpdatedHandlers = [];
    this.allArrayUpdatedHandlers = [];

    var self = this;
    this.classRepository.onBeanAdded(function(type, bean) {
        var handlerList = self.addedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                }
            });
        }
        self.allAddedHandlers.forEach(function (handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
            }
        });
    });
    this.classRepository.onBeanRemoved(function(type, bean) {
        var handlerList = self.removedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function(handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                }
            });
        }
        self.allRemovedHandlers.forEach(function(handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
            }
        });
    });
    this.classRepository.onBeanUpdate(function(type, bean, propertyName, newValue, oldValue) {
        var handlerList = self.updatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                }
            });
        }
        self.allUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, newValue, oldValue);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
            }
        });
    });
    this.classRepository.onArrayUpdate(function(type, bean, propertyName, index, count, newElements) {
        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch(e) {
                    console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                }
            });
        }
        self.allArrayUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, index, count, newElements);
            } catch(e) {
                console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
            }
        });
    });

}


BeanManager.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
};


BeanManager.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
};


BeanManager.prototype.isManaged = function(bean) {
    checkMethod('BeanManager.isManaged(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.create = function(type) {
    checkMethod('BeanManager.create(type)');
    checkParam(type, 'type');

    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.add = function(type, bean) {
    checkMethod('BeanManager.add(type, bean)');
    checkParam(type, 'type');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.addAll = function(type, collection) {
    checkMethod('BeanManager.addAll(type, collection)');
    checkParam(type, 'type');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.remove = function(bean) {
    checkMethod('BeanManager.remove(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeAll = function(collection) {
    checkMethod('BeanManager.removeAll(collection)');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeIf = function(predicate) {
    checkMethod('BeanManager.removeIf(predicate)');
    checkParam(predicate, 'predicate');

    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.onAdded = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onAdded(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allAddedHandlers = self.allAddedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onAdded(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.addedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.addedHandlers.get(type);
                if (exists(handlerList)) {
                    self.addedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onRemoved = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onRemoved(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allRemovedHandlers = self.allRemovedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onRemoved(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.removedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.removedHandlers.get(type);
                if (exists(handlerList)) {
                    self.removedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onBeanUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onBeanUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onBeanUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.updatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.updatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.updatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.updatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onArrayUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onArrayUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onArrayUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.arrayUpdatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};



exports.BeanManager = BeanManager;
},{"../bower_components/core.js/library/fn/map":1,"./polyfills.js":74,"./utils.js":75}],67:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global Platform, console */
"use strict";

_dereq_('./polyfills.js');
var Map = _dereq_('../bower_components/core.js/library/fn/map');
var opendolphin = _dereq_('../libsrc/opendolphin.js');

var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var UNKNOWN = 0,
    BASIC_TYPE = 1,
    DOLPHIN_BEAN = 2;

var blocked = null;

function fromDolphin(classRepository, type, value) {
    return ! exists(value)? null
        : type === DOLPHIN_BEAN? classRepository.beanFromDolphin.get(value) : value;
}

function toDolphin(classRepository, value) {
    return typeof value === 'object' && value !== null? classRepository.beanToDolphin.get(value) : value;
}

function sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
    var dolphin = classRepository.dolphin;
    var attributes = [
        dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
        dolphin.attribute('source', null, modelId),
        dolphin.attribute('attribute', null, propertyName),
        dolphin.attribute('from', null, from),
        dolphin.attribute('to', null, to),
        dolphin.attribute('count', null, newElements.length)
    ];
    newElements.forEach(function(element, index) {
        attributes.push(dolphin.attribute(index.toString(), null, toDolphin(classRepository, element)));
    });
    dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
}

function validateList(classRepository, type, bean, propertyName) {
    var list = bean[propertyName];
    if (!exists(list)) {
        classRepository.propertyUpdateHandlers.forEach(function(handler) {
            try {
                handler(type, bean, propertyName, [], undefined);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
            }
        });
    }
}

function block(bean, propertyName) {
    if (exists(blocked)) {
        throw new Error('Trying to create a block while another block exists');
    }
    blocked = {
        bean: bean,
        propertyName: propertyName
    };
}

function isBlocked(bean, propertyName) {
    return exists(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
}

function unblock() {
    blocked = null;
}


function ClassRepository(dolphin) {
    checkMethod('ClassRepository(dolphin)');
    checkParam(dolphin, 'dolphin');

    this.dolphin = dolphin;
    this.classes = new Map();
    this.beanFromDolphin = new Map();
    this.beanToDolphin = new Map();
    this.classInfos = new Map();
    this.beanAddedHandlers = [];
    this.beanRemovedHandlers = [];
    this.propertyUpdateHandlers = [];
    this.arrayUpdateHandlers = [];
}


ClassRepository.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    var modelId = this.beanToDolphin.get(bean);
    if (exists(modelId)) {
        var model = this.dolphin.findPresentationModelById(modelId);
        if (exists(model)) {
            var classInfo = this.classes.get(model.presentationModelType);
            var type = classInfo[propertyName];
            var attribute = model.findAttributeByPropertyName(propertyName);
            if (exists(type) && exists(attribute)) {
                var oldValue = attribute.getValue();
                attribute.setValue(toDolphin(this, newValue));
                return fromDolphin(this, type, oldValue);
            }
        }
    }
};


ClassRepository.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    if (isBlocked(bean, propertyName)) {
        return;
    }
    var modelId = this.beanToDolphin.get(bean);
    var array = bean[propertyName];
    if (exists(modelId) && exists(array)) {
        var removedElementsCount = Array.isArray(removedElements)? removedElements.length : 0;
        sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
    }
};


ClassRepository.prototype.onBeanAdded = function(handler) {
    checkMethod('ClassRepository.onBeanAdded(handler)');
    checkParam(handler, 'handler');
    this.beanAddedHandlers.push(handler);
};


ClassRepository.prototype.onBeanRemoved = function(handler) {
    checkMethod('ClassRepository.onBeanRemoved(handler)');
    checkParam(handler, 'handler');
    this.beanRemovedHandlers.push(handler);
};


ClassRepository.prototype.onBeanUpdate = function(handler) {
    checkMethod('ClassRepository.onBeanUpdate(handler)');
    checkParam(handler, 'handler');
    this.propertyUpdateHandlers.push(handler);
};


ClassRepository.prototype.onArrayUpdate = function(handler) {
    checkMethod('ClassRepository.onArrayUpdate(handler)');
    checkParam(handler, 'handler');
    this.arrayUpdateHandlers.push(handler);
};


ClassRepository.prototype.registerClass = function (model) {
    checkMethod('ClassRepository.registerClass(model)');
    checkParam(model, 'model');

    if (this.classes.has(model.id)) {
        return;
    }

    var classInfo = {};
    model.attributes.filter(function(attribute) {
        return attribute.propertyName.search(/^@/) < 0;
    }).forEach(function (attribute) {
        classInfo[attribute.propertyName] = UNKNOWN;

        attribute.onValueChange(function (event) {
            classInfo[attribute.propertyName] = event.newValue;
        });
    });
    this.classes.set(model.id, classInfo);
};


ClassRepository.prototype.unregisterClass = function (model) {
    checkMethod('ClassRepository.unregisterClass(model)');
    checkParam(model, 'model');

    this.classes['delete'](model.id);
};


ClassRepository.prototype.load = function (model) {
    checkMethod('ClassRepository.load(model)');
    checkParam(model, 'model');

    var self = this;
    var classInfo = this.classes.get(model.presentationModelType);
    var bean = {};
    model.attributes.filter(function (attribute) {
        return (attribute.tag === opendolphin.Tag.value()) && (attribute.propertyName.search(/^@/) < 0);
    }).forEach(function (attribute) {
        bean[attribute.propertyName] = null;
        attribute.onValueChange(function (event) {
            if (event.oldValue !== event.newValue) {
                var oldValue = fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                var newValue = fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                self.propertyUpdateHandlers.forEach(function(handler) {
                    try {
                        handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                    }
                });
            }
        });
    });
    this.beanFromDolphin.set(model.id, bean);
    this.beanToDolphin.set(bean, model.id);
    this.classInfos.set(model.id, classInfo);
    this.beanAddedHandlers.forEach(function(handler) {
        try {
            handler(model.presentationModelType, bean);
        } catch(e) {
            console.warn('An exception occurred while calling an onBeanAdded-handler', e);
        }
    });
    return bean;
};


ClassRepository.prototype.unload = function(model) {
    checkMethod('ClassRepository.unload(model)');
    checkParam(model, 'model');

    var bean = this.beanFromDolphin.get(model.id);
    this.beanFromDolphin['delete'](model.id);
    this.beanToDolphin['delete'](bean);
    this.classInfos['delete'](model.id);
    if (exists(bean)) {
        this.beanRemovedHandlers.forEach(function(handler) {
            try {
                handler(model.presentationModelType, bean);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
            }
        });
    }
    return bean;
};


ClassRepository.prototype.spliceListEntry = function(model) {
    checkMethod('ClassRepository.spliceListEntry(model)');
    checkParam(model, 'model');

    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var from = model.findAttributeByPropertyName('from');
    var to = model.findAttributeByPropertyName('to');
    var count = model.findAttributeByPropertyName('count');

    if (exists(source) && exists(attribute) && exists(from) && exists(to) && exists(count)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var type = model.presentationModelType;
            //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
            validateList(this, type, bean, attribute.value);
            var newElements = [],
                element = null;
            for (var i = 0; i < count.value; i++) {
                element = model.findAttributeByPropertyName(i.toString());
                if (! exists(element)) {
                    throw new Error("Invalid list modification update received");
                }
                newElements.push(fromDolphin(this, classInfo[attribute.value], element.value));
            }
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    try {
                        handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onArrayUpdate-handler', e);
                    }
                });
            } finally {
                unblock();
            }
        } else {
            throw new Error("Invalid list modification update received. Source bean unknown.");
        }
    } else {
        throw new Error("Invalid list modification update received");
    }
};


ClassRepository.prototype.mapParamToDolphin = function(param) {
    if (!exists(param)) {
        return {value: param, type: UNKNOWN};
    }
    var type = typeof param;
    if (type === 'object') {
        var value = this.beanToDolphin.get(param);
        if (exists(value)) {
            return {value: value, type: DOLPHIN_BEAN};
        }
        throw new TypeError("Only managed Dolphin Beans can be used");
    }
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return {value: param, type: BASIC_TYPE};
    }
    throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
};


ClassRepository.prototype.mapDolphinToBean = function(value, type) {
    return fromDolphin(this, type, value);
};



exports.ClassRepository = ClassRepository;
exports.UNKNOWN = UNKNOWN;
exports.BASIC_TYPE = BASIC_TYPE;
exports.DOLPHIN_BEAN = DOLPHIN_BEAN;

},{"../bower_components/core.js/library/fn/map":1,"../libsrc/opendolphin.js":65,"./polyfills.js":74,"./utils.js":75}],68:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var utils = _dereq_('./utils.js');
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var INIT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
var DISCONNECT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';

function ClientContext(dolphin, beanManager, controllerManager, connector) {
    checkMethod('ClientContext(dolphin, beanManager, controllerManager, connector)');
    checkParam(dolphin, 'dolphin');
    checkParam(beanManager, 'beanManager');
    checkParam(controllerManager, 'controllerManager');
    checkParam(connector, 'connector');

    this.dolphin = dolphin;
    this.beanManager = beanManager;
    this._controllerManager = controllerManager;
    this._connector = connector;

    this._connector.invoke(INIT_COMMAND_NAME);
}


ClientContext.prototype.createController = function(name) {
    checkMethod('ClientContext.createController(name)');
    checkParam(name, 'name');

    return this._controllerManager.createController(name);
};


ClientContext.prototype.disconnect = function() {
    // TODO: Implement ClientContext.disconnect [DP-46]
    var self = this;
    this.dolphin.stopPushListening();
    this._controllerManager.destroy().then(function() {
        self._connector.invoke(DISCONNECT_COMMAND_NAME);
        self.dolphin = null;
        self.beanManager = null;
        self._controllerManager = null;
        self._connector = null;
    });
};


exports.ClientContext = ClientContext;
},{"./polyfills.js":74,"./utils.js":75}],69:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
"use strict";


var exists = _dereq_('./utils.js').exists;


function encodeCreatePresentationModelCommand(command) {
    return {
        'p': command.pmId,
        't': command.pmType,
        'a': command.attributes.map(function (attribute) {
            var result = {
                'n': attribute.propertyName,
                'i': attribute.id
            };
            if (exists(attribute.value)) {
                result.v = attribute.value;
            }
            if (exists(attribute.tag) && attribute.tag !== 'VALUE') {
                result.t = attribute.tag;
            }
            return result;
        }),
        'id': 'CreatePresentationModel'
    };
}

function decodeCreatePresentationModelCommand(command) {
    return {
        'id': 'CreatePresentationModel',
        'className': "org.opendolphin.core.comm.CreatePresentationModelCommand",
        'clientSideOnly': false,
        'pmId': command.p,
        'pmType': command.t,
        'attributes': command.a.map(function (attribute) {
            return {
                'propertyName': attribute.n,
                'id': attribute.i,
                'value': exists(attribute.v)? attribute.v : null,
                'baseValue': exists(attribute.v)? attribute.v : null,
                'qualifier': null,
                'tag': exists(attribute.t)? attribute.t : 'VALUE'
            };
        })
    };
}


function encodeValueChangedCommand(command) {
    var result = {
        'a': command.attributeId
    };
    if (exists(command.oldValue)) {
        result.o = command.oldValue;
    }
    if (exists(command.newValue)) {
        result.n = command.newValue;
    }
    result.id = 'ValueChanged';
    return result;
}

function decodeValueChangedCommand(command) {
    return {
        'id': 'ValueChanged',
        'className': "org.opendolphin.core.comm.ValueChangedCommand",
        'attributeId': command.a,
        'oldValue': exists(command.o)? command.o : null,
        'newValue': exists(command.n)? command.n : null
    };
}


exports.Codec = {
    encode: function (commands) {
        return JSON.stringify(commands.map(function (command) {
            if (command.id === 'CreatePresentationModel') {
                return encodeCreatePresentationModelCommand(command);
            } else if (command.id === 'ValueChanged') {
                return encodeValueChangedCommand(command);
            }
            return command;
        }));
    },
    decode: function (transmitted) {
        if (typeof transmitted == 'string') {
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return decodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return decodeValueChangedCommand(command);
                }
                return command;
            });
        }
        else {
            return transmitted;
        }
    }
};
},{"./utils.js":75}],70:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var Promise = _dereq_('../bower_components/core.js/library/fn/promise');
var opendolphin = _dereq_('../libsrc/opendolphin.js');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;


var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var POLL_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'longPoll';
var RELEASE_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'release';

var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
var HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
var DOLPHIN_LIST_SPLICE = '@DP:LS@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';



var initializer;

function Connector(url, dolphin, classRepository, config) {
    checkMethod('Connector(url, dolphin, classRepository, config)');
    checkParam(url, 'url');
    checkParam(dolphin, 'dolphin');
    checkParam(classRepository, 'classRepository');

    var self = this;
    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.highlanderPMResolver = function() {};
    this.highlanderPMPromise = new Promise(function(resolve) {
        self.highlanderPMResolver = resolve;
    });

    dolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
        if (exists(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
            if (event.eventType === opendolphin.Type.ADDED) {
                self.onModelAdded(model);
            } else if (event.eventType === opendolphin.Type.REMOVED) {
                self.onModelRemoved(model);
            }
        }
    });

    if (!exists(config) || !exists(config.serverPush) || config.serverPush === true) {
        setTimeout(function() {
            dolphin.startPushListening(POLL_COMMAND_NAME, RELEASE_COMMAND_NAME);
        }, 500);
    }

    initializer = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.withCredentials = true;

        req.onload = function() {
            if (req.status === 200) {
                resolve();
            }
            else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(Error("Network Error"));
        };

        req.open('POST', url + 'invalidate?');
        req.send();
    });
}


Connector.prototype.onModelAdded = function(model) {
    checkMethod('Connector.onModelAdded(model)');
    checkParam(model, 'model');

    var type = model.presentationModelType;
    switch (type) {
        case ACTION_CALL_BEAN:
            // ignore
            break;
        case DOLPHIN_BEAN:
            this.classRepository.registerClass(model);
            break;
        case HIGHLANDER_BEAN:
            this.highlanderPMResolver(model);
            break;
        case DOLPHIN_LIST_SPLICE:
            this.classRepository.spliceListEntry(model);
            this.dolphin.deletePresentationModel(model);
            break;
        default:
            this.classRepository.load(model);
            break;
    }
};


Connector.prototype.onModelRemoved = function(model) {
    checkMethod('Connector.onModelRemoved(model)');
    checkParam(model, 'model');

    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            this.classRepository.unregisterClass(model);
            break;
        case DOLPHIN_LIST_SPLICE:
            // do nothing
            break;
        default:
            this.classRepository.unload(model);
            break;
    }
};


Connector.prototype.invoke = function(command) {
    checkMethod('Connector.invoke(command)');
    checkParam(command, 'command');

    var dolphin = this.dolphin;
    return new Promise(function(resolve) {
        //initializer.then(function () {
            dolphin.send(command, {
                onFinished: function() {
                    resolve();
                }
            });
        //});
    });
};


Connector.prototype.getHighlanderPM = function() {
    return this.highlanderPMPromise;
};



exports.Connector = Connector;
exports.SOURCE_SYSTEM = SOURCE_SYSTEM;
exports.SOURCE_SYSTEM_CLIENT = SOURCE_SYSTEM_CLIENT;
exports.SOURCE_SYSTEM_SERVER = SOURCE_SYSTEM_SERVER;
exports.ACTION_CALL_BEAN = ACTION_CALL_BEAN;

},{"../bower_components/core.js/library/fn/promise":2,"../libsrc/opendolphin.js":65,"./polyfills.js":74,"./utils.js":75}],71:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var Promise = _dereq_('../bower_components/core.js/library/fn/promise');
var Set = _dereq_('../bower_components/core.js/library/fn/set');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var ControllerProxy = _dereq_('./controllerproxy.js').ControllerProxy;

var DOLPHIN_BEAN_TYPE = _dereq_('./classrepo.js').DOLPHIN_BEAN;

var SOURCE_SYSTEM = _dereq_('./connector.js').SOURCE_SYSTEM;
var SOURCE_SYSTEM_CLIENT = _dereq_('./connector.js').SOURCE_SYSTEM_CLIENT;
var ACTION_CALL_BEAN = _dereq_('./connector.js').ACTION_CALL_BEAN;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var REGISTER_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'registerController';
var CALL_CONTROLLER_ACTION_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
var DESTROY_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'destroyController';

var CONTROLLER_NAME = 'controllerName';
var CONTROLLER_ID = 'controllerId';
var MODEL = 'model';
var ACTION_NAME = 'actionName';
var ERROR_CODE = 'errorCode';
var PARAM_PREFIX = '_';


function ControllerManager(dolphin, classRepository, connector) {
    checkMethod('ControllerManager(dolphin, classRepository, connector)');
    checkParam(dolphin, 'dolphin');
    checkParam(classRepository, 'classRepository');
    checkParam(connector, 'connector');

    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.connector = connector;
    this.controllers = new Set();
}


ControllerManager.prototype.createController = function(name) {
    checkMethod('ControllerManager.createController(name)');
    checkParam(name, 'name');

    var self = this;
    var controllerId, modelId, model, controller;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_NAME).setValue(name);
            self.connector.invoke(REGISTER_CONTROLLER_COMMAND_NAME).then(function() {
                controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                model = self.classRepository.mapDolphinToBean(modelId, DOLPHIN_BEAN_TYPE);
                controller = new ControllerProxy(controllerId, model, self);
                self.controllers.add(controller);
                resolve(controller);
            });
        });
    });
};


ControllerManager.prototype.invokeAction = function(controllerId, actionName, params) {
    checkMethod('ControllerManager.invokeAction(controllerId, actionName, params)');
    checkParam(controllerId, 'controllerId');
    checkParam(actionName, 'actionName');

    var self = this;
    return new Promise(function(resolve, reject) {

        var attributes = [
            self.dolphin.attribute(SOURCE_SYSTEM, null, SOURCE_SYSTEM_CLIENT),
            self.dolphin.attribute(CONTROLLER_ID, null, controllerId),
            self.dolphin.attribute(ACTION_NAME, null, actionName),
            self.dolphin.attribute(ERROR_CODE)
        ];

        if (exists(params)) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    var param = self.classRepository.mapParamToDolphin(params[prop]);
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.value, 'VALUE'));
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.type, 'VALUE_TYPE'));
                }
            }
        }

        var pm = self.dolphin.presentationModel.apply(self.dolphin, [null, ACTION_CALL_BEAN].concat(attributes));

        self.connector.invoke(CALL_CONTROLLER_ACTION_COMMAND_NAME, params).then(function() {
            var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
            if (isError) {
                reject(new Error("ControllerAction caused an error"));
            } else {
                resolve();
            }
            self.dolphin.deletePresentationModel(pm);
        });
    });
};


ControllerManager.prototype.destroyController = function(controller) {
    checkMethod('ControllerManager.destroyController(controller)');
    checkParam(controller, 'controller');

    var self = this;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            self.controllers.delete(controller);
            highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controller.controllerId);
            self.connector.invoke(DESTROY_CONTROLLER_COMMAND_NAME).then(resolve);
        });
    });
};


ControllerManager.prototype.destroy = function() {
    var controllersCopy = this.controllers;
    var promises = [];
    this.controllers = new Set();
    controllersCopy.forEach(function (controller) {
        try {
            promises.push(controller.destroy());
        } catch (e) {
            // ignore
        }
    });
    return Promise.all(promises);
};



exports.ControllerManager = ControllerManager;

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./classrepo.js":67,"./connector.js":70,"./controllerproxy.js":72,"./polyfills.js":74,"./utils.js":75}],72:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var Set = _dereq_('../bower_components/core.js/library/fn/set');
var utils = _dereq_('./utils.js');
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;



function ControllerProxy(controllerId, model, manager) {
    checkMethod('ControllerProxy(controllerId, model, manager)');
    checkParam(controllerId, 'controllerId');
    checkParam(model, 'model');
    checkParam(manager, 'manager');

    this.controllerId = controllerId;
    this.model = model;
    this.manager = manager;
    this.destroyed = false;
    this.onDestroyedHandlers = new Set();
}


ControllerProxy.prototype.invoke = function(name, params) {
    checkMethod('ControllerProxy.invoke(name, params)');
    checkParam(name, 'name');

    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    return this.manager.invokeAction(this.controllerId, name, params);
};


ControllerProxy.prototype.destroy = function() {
    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    this.destroyed = true;
    this.onDestroyedHandlers.forEach(function(handler) {
        try {
            handler(this);
        } catch(e) {
            console.warn('An exception occurred while calling an onDestroyed-handler', e);
        }
    }, this);
    return this.manager.destroyController(this);
};


ControllerProxy.prototype.onDestroyed = function(handler) {
    checkMethod('ControllerProxy.onDestroyed(handler)');
    checkParam(handler, 'handler');

    var self = this;
    this.onDestroyedHandlers.add(handler);
    return {
        unsubscribe: function() {
            self.onDestroyedHandlers.delete(handler);
        }
    };
};



exports.ControllerProxy = ControllerProxy;

},{"../bower_components/core.js/library/fn/set":3,"./polyfills.js":74,"./utils.js":75}],73:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global console */
"use strict";

_dereq_('./polyfills.js');
var opendolphin = _dereq_('../libsrc/opendolphin.js');

var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;
var Connector = _dereq_('./connector.js').Connector;
var BeanManager = _dereq_('./beanmanager.js').BeanManager;
var ClassRepository = _dereq_('./classrepo.js').ClassRepository;
var ControllerManager = _dereq_('./controllermanager.js').ControllerManager;
var ClientContext = _dereq_('./clientcontext.js').ClientContext;
var Codec = _dereq_('./codec.js').Codec;

exports.connect = function(url, config) {
    checkMethod('connect(url, config)');
    checkParam(url, 'url');

    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();
    dolphin.clientConnector.transmitter.codec = Codec;

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository, config);
    var controllerManager = new ControllerManager(dolphin, classRepository, connector);

    return new ClientContext(dolphin, beanManager, controllerManager, connector);
};

},{"../libsrc/opendolphin.js":65,"./beanmanager.js":66,"./classrepo.js":67,"./clientcontext.js":68,"./codec.js":69,"./connector.js":70,"./controllermanager.js":71,"./polyfills.js":74,"./utils.js":75}],74:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


 ////////////////////
// Array.forEach()
////////////////////
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}



////////////////////
// Array.filter()
////////////////////
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
},{}],75:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
"use strict";

var checkMethodName;

var exists = function(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function(name) {
    checkMethodName = name;
};

module.exports.checkParam = function(param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + checkMethodName);
    }
};

},{}]},{},[73])(73)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],51:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global Polymer, console */
"use strict";

var Binder = _dereq_('./binder.js').Binder;


function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}


var arrayKeyBug;
function polymer1_1hack(element, path) {
    // This is a temporary hack to deal with Polymer's API consistency concerning arrays and paths.
    // An observer uses keys in an array, while the get() and set() methods expect the index.
    // This is hopefully fixed in Polymer 1.2.
    do {
        var pathElements = path.match(/^([^\.]+)\.(.*)$/);
        var key = pathElements !== null? pathElements[1] : path;
        path = pathElements !== null? pathElements[2] : null;

        if (Array.isArray(element)) {
            var arrayKey = parseInt(key);
            if (isNaN(arrayKey)) {
                element = element[key];
            } else {
                var collection = Polymer.Collection.get(element);
                element = collection.getItem(arrayKey);
            }
        } else {
            element = element[key];
        }
    } while (path !== null && exists(element));

    return element;
}
function navigateToBean(element, path) {
    var navigation = path.match(/^(.*)\.[^\.]*$/);
    if (! exists(navigation)) {
        return element;
    } else {
        if (!exists(arrayKeyBug)) {
            arrayKeyBug = typeof Polymer.version !== 'string' || (Polymer.version.match(/^1\.[01]\./) !== null);
        }
        return arrayKeyBug? polymer1_1hack(element, navigation[1]) : element.get(navigation[1], element);
    }
}


function setupCreateBehavior(clientContext) {

    var binder = new Binder(clientContext.beanManager);

    return function(controllerName) {
        var state = 'INITIALIZING';
        return {

            properties: {
                model: {
                    type: Object,
                    value: function() { return {}; }
                }
            },

            observers: ['_dolphinObserver(model.*)'],

            created: function() {
                var self = this;
                clientContext.createController(controllerName).then(function(controller) {
                    self._controller = controller;
                    state = 'READY';
                    self.set('model', controller.model);
                    controller.onDestroyed(function() {
                        state = 'DESTROYED';
                        self.set('model', null);
                    });
                });
            },

            invoke: function(actionName, params) {
                // TODO Call this after init has finished
                if (state !== 'READY') {
                    console.warn('Controller.invoke() called before init() finished');
                    return;
                }
                return this._controller.invoke(actionName, params);
            },

            _dolphinObserver: function(event) {
                if (state !== 'READY') {
                    return;
                }
                var path = event.path;
                var bean, propertyName, i, j;
                var newValue = event.value;

                if (exists(newValue) && exists(newValue.indexSplices)) {
                    path = path.substr(0, path.length - ".splices".length);
                    bean = navigateToBean(this, path);
                    if (exists(bean)) {
                        propertyName = path.match(/[^\.]+$/);
                        var n = newValue.indexSplices.length;
                        for (i = 0; i < n; i++) {
                            var change = newValue.indexSplices[i];
                            clientContext.beanManager.notifyArrayChange(bean, propertyName[0], change.index, change.addedCount, change.removed);

                            var array = bean[propertyName[0]];
                            for (j = 0; j < change.removed.length; j++) {
                                binder.unbind(this, path + '.' + (change.index + j), change.removed[j]);
                            }
                            for (j = change.index + change.addedCount; j < array.length; j++) {
                                var oldPos = j - change.addedCount + change.removed.length;
                                binder.unbind(this, path + '.' + oldPos, array[j]);
                            }
                            for (j = change.index; j < array.length; j++) {
                                binder.bind(this, path + '.' + j, array[j]);
                            }
                        }
                    }
                } else {
                    bean = navigateToBean(this, path);
                    if (exists(bean) && !Array.isArray(bean) && !Array.isArray(newValue)) {
                        propertyName = path.match(/[^\.]+$/);
                        var oldValue = clientContext.beanManager.notifyBeanChange(bean, propertyName[0], newValue);
                        if (exists(oldValue)) {
                            binder.unbind(this, path, oldValue);
                        }
                        if (exists(newValue)) {
                            binder.bind(this, path, newValue);
                        }
                    }
                }
            }
        };
    };
}



exports.setupCreateBehavior = setupCreateBehavior;
},{"./binder.js":52}],52:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
"use strict";

var Map  = _dereq_('../bower_components/core.js/library/fn/map');



function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

function bindScope(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

function deepEqual(array1, array2) {
    if (array1 === array2 || (!exists(array1) && !exists(array2))) {
        return true;
    }
    if (exists(array1) !== exists(array2)) {
        return false;
    }
    var n = array1.length;
    if (array2.length !== n) {
        return false;
    }
    for (var i = 0; i < n; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}


function Binder(beanManager) {
    this.listeners = new Map();

    beanManager.onBeanUpdate(bindScope(this, this.onBeanUpdateHandler));
    beanManager.onArrayUpdate(bindScope(this, this.onArrayUpdateHandler));
}


Binder.prototype.onBeanUpdateHandler = function(bean, propertyName, newValue, oldValue) {
    if (oldValue === newValue) {
        return;
    }
    var listenerList = this.listeners.get(bean);
    if (exists(listenerList) && listenerList.length > 0) {
        var entry = listenerList[0];
        var element = entry.element;
        var path = entry.rootPath + '.' + propertyName;
        element.set(path, newValue);
    } else {
        bean[propertyName] = newValue;
    }
};


Binder.prototype.onArrayUpdateHandler = function(bean, propertyName, index, count, newElements) {
    var array = bean[propertyName];
    var oldElements = array.slice(index, index + count);
    if (deepEqual(newElements, oldElements)) {
        return;
    }
    var listenerList = this.listeners.get(bean);
    if (exists(listenerList) && listenerList.length > 0) {
        var entry = listenerList[0];
        var element = entry.element;
        var path = entry.rootPath + '.' + propertyName;
        if (typeof newElements === 'undefined') {
            element.splice(path, index, count);
        } else {
            element.splice.apply(element, [path, index, count].concat(newElements));
        }
    } else {
        if (typeof newElements === 'undefined') {
            array.splice(index, count);
        } else {
            array.splice.apply(array, [index, count].concat(newElements));
        }
    }
};


Binder.prototype.bind = function (element, rootPath, value) {
    if (!exists(value) || typeof value !== 'object') {
        return;
    }
    var listenerList = this.listeners.get(value);
    if (!exists(listenerList)) {
        listenerList = [];
        this.listeners.set(value, listenerList);
    }
    listenerList.push({element: element, rootPath: rootPath});

    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            this.bind(element, rootPath + '.' + i, value[i]);
        }
    } else if (typeof value === 'object') {
        for (var propertyName in value) {
            if (value.hasOwnProperty(propertyName)) {
                this.bind(element, rootPath + '.' + propertyName, value[propertyName]);
            }
        }
    }
};

Binder.prototype.unbind = function (element, rootPath, value) {
    if (!exists(value) || typeof value !== 'object') {
        return;
    }
    var listenerList = this.listeners.get(value);
    if (exists(listenerList)) {
        var n = listenerList.length;
        for (var i = 0; i < n; i++) {
            var entry = listenerList[i];
            if (entry.element === element && entry.rootPath === rootPath) {
                listenerList.splice(i, 1);

                if (Array.isArray(value)) {
                    for (var j = 0; j < value.length; j++) {
                        this.unbind(element, rootPath + '.' + j, value[j]);
                    }
                } else if (typeof value === 'object') {
                    for (var propertyName in value) {
                        if (value.hasOwnProperty(propertyName)) {
                            this.unbind(element, rootPath + '.' + propertyName, value[propertyName]);
                        }
                    }
                }
                return;
            }
        }
    }
};



exports.Binder = Binder;

},{"../bower_components/core.js/library/fn/map":1}],53:[function(_dereq_,module,exports){
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
"use strict";

var connect = _dereq_('../bower_components/dolphin-js/dist/dolphin.js').connect;
var setupCreateBehavior = _dereq_('./behavior.js').setupCreateBehavior;


exports.connect = function(url, config) {
    var clientContext = connect(url, config);
    clientContext.createBehavior = setupCreateBehavior(clientContext);
    return clientContext;
};

},{"../bower_components/dolphin-js/dist/dolphin.js":50,"./behavior.js":51}]},{},[53])(53)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmNsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvbGxlY3Rpb24tc3Ryb25nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZmluZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuZGVzY3JpcHRvcnMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmhpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmlzLW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXJhdG9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5saWJyYXJ5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnByb3BlcnR5LWRlc2MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnJlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnNldC1zcGVjaWVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnNldC10by1zdHJpbmctdGFnLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pbnRlZ2VyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnVpZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC53a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL18uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1mcm9tLWl0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2ludm9rZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnNldC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc2V0LnRvLWpzb24uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9saWJzcmMvb3BlbmRvbHBoaW4uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9zcmMvYmVhbm1hbmFnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9zcmMvY2xhc3NyZXBvLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3Qvc3JjL2NsaWVudGNvbnRleHQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9zcmMvY29kZWMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9zcmMvY29ubmVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3Qvc3JjL2NvbnRyb2xsZXJtYW5hZ2VyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3Qvc3JjL2NvbnRyb2xsZXJwcm94eS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L3NyYy9kb2xwaGluLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLWpzL2Rpc3Qvc3JjL3BvbHlmaWxscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1qcy9kaXN0L3NyYy91dGlscy5qcyIsInNyYy9iZWhhdmlvci5qcyIsInNyYy9iaW5kZXIuanMiLCJzcmMvZG9scGhpbi1wb2x5bWVyLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7OztBQ0ZBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0dkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8kLmNvcmUnKS5NYXA7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBoaWRlICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgcmVkZWZpbmVBbGwgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgc3RyaWN0TmV3ICAgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGRlZmluZWQgICAgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSAgPSByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLXN0ZXAnKVxuICAsIElEICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKSgnaWQnKVxuICAsICRoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIGlzT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIHNldFNwZWNpZXMgICA9IHJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgU0laRSAgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnXG4gICwgaWQgICAgICAgICAgID0gMDtcblxudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCEkaGFzKGl0LCBJRCkpe1xuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XG4gIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xufTtcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBzdHJpY3ROZXcodGhhdCwgQywgTkFNRSk7XG4gICAgICB0aGF0Ll9pID0gJC5jcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgZm9yT2YgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIGNsYXNzb2YgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpe1xuICAgIGlmKGNsYXNzb2YodGhpcykgIT0gTkFNRSl0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICBmb3JPZih0aGlzLCBmYWxzZSwgYXJyLnB1c2gsIGFycik7XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdHJpY3ROZXcgICAgICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIHN0cmljdE5ldyh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICAkLmVhY2guY2FsbCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMnLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3I7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG8gICAgICAgPSByZXF1aXJlKCcuLyQnKS5nZXRQcm90b1xuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRuYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvKCRkZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgLy8gRkYgZml4XG4gICAgaWYoIUxJQlJBUlkgJiYgaGFzKHByb3RvLCBGRl9JVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgICB9XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgJE9iamVjdCA9IE9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgZWFjaDogICAgICAgW10uZm9yRWFjaFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XG4gIGZvcih2YXIga2V5IGluIHNyYylyZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5oaWRlJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IGNvcmVbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vJC5pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKTtcbkl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEl0ZXJhdG9ycy5IVE1MQ29sbGVjdGlvbiA9IEl0ZXJhdG9ycy5BcnJheTsiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5NYXA7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlNldDsiLCJ2YXIgJE9iamVjdCA9IE9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgZWFjaDogICAgICAgW10uZm9yRWFjaFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpe1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyLCBJVEVSQVRPUil7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yT2YoaXRlciwgZmFsc2UsIHJlc3VsdC5wdXNoLCByZXN1bHQsIElURVJBVE9SKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi9fJylcbiAgLCBoaWRlICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgYW5JbnN0YW5jZSAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZGVmaW5lZCAgICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpXG4gICwgc3RlcCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIHNldFNwZWNpZXMgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIGZhc3RLZXkgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXlcbiAgLCBTSVpFICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9ICQuY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsICdmb3JFYWNoJyk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIGZyb20gICAgPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgaWYoY2xhc3NvZih0aGlzKSAhPSBOQU1FKXRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vXycpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBtZXRhICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGZvck9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBhbkluc3RhbmNlICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUsICdfYycpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICAkLmVhY2guY2FsbCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjAuMyd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vXycpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG8gICAgICAgPSByZXF1aXJlKCcuL18nKS5nZXRQcm90b1xuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90bygkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vXycpLnNldERlc2NcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG52YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICB2YXIgcGFyZW50LCBkb21haW4sIGZuO1xuICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSl7XG4gICAgcHJvY2Vzcy5kb21haW4gPSBudWxsO1xuICAgIHBhcmVudC5leGl0KCk7XG4gIH1cbiAgd2hpbGUoaGVhZCl7XG4gICAgZG9tYWluID0gaGVhZC5kb21haW47XG4gICAgZm4gICAgID0gaGVhZC5mbjtcbiAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgZm4oKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gMVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAtdG9nZ2xlO1xuICB9O1xuLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2Vcbn0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbHVzaCk7XG4gIH07XG4vLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuLy8gLSBzZXRJbW1lZGlhdGVcbi8vIC0gTWVzc2FnZUNoYW5uZWxcbi8vIC0gd2luZG93LnBvc3RNZXNzYWdcbi8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4vLyAtIHNldFRpbWVvdXRcbn0gZWxzZSB7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzYXAoZm4pe1xuICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCwgZG9tYWluOiBpc05vZGUgJiYgcHJvY2Vzcy5kb21haW59O1xuICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gIGlmKCFoZWFkKXtcbiAgICBoZWFkID0gdGFzaztcbiAgICBub3RpZnkoKTtcbiAgfSBsYXN0ID0gdGFzaztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYywgc2FmZSl7XG4gIGZvcih2YXIga2V5IGluIHNyYyl7XG4gICAgaWYoc2FmZSAmJiB0YXJnZXRba2V5XSl0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vXycpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgJCAgICAgICAgICAgPSByZXF1aXJlKCcuL18nKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IGNvcmVbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIiIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL18nKVxuICAsIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gICAgICAgICAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbkluc3RhbmNlICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBmcm9tICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJylcbiAgLCBzZXRQcm90byAgICAgICAgICAgPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXRcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCB0YXNrICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgbWljcm90YXNrICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBpc05vZGUgICAgICAgICAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGVtcHR5ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBJbnRlcm5hbCwgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xuXG52YXIgdGVzdFJlc29sdmUgPSBmdW5jdGlvbihzdWIpe1xuICB2YXIgdGVzdCA9IG5ldyAkUHJvbWlzZShlbXB0eSksIHByb21pc2U7XG4gIGlmKHN1Yil0ZXN0LmNvbnN0cnVjdG9yID0gZnVuY3Rpb24oZXhlYyl7XG4gICAgZXhlYyhlbXB0eSwgZW1wdHkpO1xuICB9O1xuICAocHJvbWlzZSA9ICRQcm9taXNlLnJlc29sdmUodGVzdCkpWydjYXRjaCddKGVtcHR5KTtcbiAgcmV0dXJuIHByb21pc2UgPT09IHRlc3Q7XG59O1xuXG52YXIgVVNFX05BVElWRSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICB2YXIgU3ViUHJvbWlzZSA9IGZ1bmN0aW9uKHgpe1xuICAgIHZhciBzZWxmID0gbmV3ICRQcm9taXNlKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFN1YlByb21pc2UucHJvdG90eXBlKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbiAgdHJ5IHtcbiAgICB3b3JrcyA9ICRQcm9taXNlICYmICRQcm9taXNlLnJlc29sdmUgJiYgdGVzdFJlc29sdmUoKTtcbiAgICBzZXRQcm90byhTdWJQcm9taXNlLCAkUHJvbWlzZSk7XG4gICAgU3ViUHJvbWlzZS5wcm90b3R5cGUgPSAkLmNyZWF0ZSgkUHJvbWlzZS5wcm90b3R5cGUsIHtjb25zdHJ1Y3Rvcjoge3ZhbHVlOiBTdWJQcm9taXNlfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShTdWJQcm9taXNlLnJlc29sdmUoNSkudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBTdWJQcm9taXNlKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBWOCA0LjgtIGJ1ZywgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxNjJcbiAgICBpZih3b3JrcyAmJiByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgICRQcm9taXNlLnJlc29sdmUoJC5zZXREZXNjKHt9LCAndGhlbicsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSB0cnVlOyB9XG4gICAgICB9KSk7XG4gICAgICB3b3JrcyA9IHRoZW5hYmxlVGhlbkdvdHRlbjtcbiAgICB9XG4gIH0gY2F0Y2goZSl7IHdvcmtzID0gZmFsc2U7IH1cbiAgcmV0dXJuICEhd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGhhbmRsZXIpe1xuICAgICAgICAgIGlmKCFvayl7XG4gICAgICAgICAgICBpZihwcm9taXNlLl9oID09IDIpb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0ID0gaGFuZGxlciA9PT0gdHJ1ZSA/IHZhbHVlIDogaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgaWYocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKXtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICAgLCBoYW5kbGVyLCBjb25zb2xlO1xuICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgfSBwcm9taXNlLl9oID0gMjtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIGlmKHByb21pc2UuX2ggPT0gMSlyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSB8fCB0ZXN0UmVzb2x2ZSh0cnVlKSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gZnJvbShpdGVyYWJsZSlcbiAgICAgICAgLCByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoXG4gICAgICAgICwgcmVzdWx0cyAgID0gQXJyYXkocmVtYWluaW5nKTtcbiAgICAgIGlmKHJlbWFpbmluZykkLmVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdHMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKX0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAsIEFycmF5VmFsdWVzICAgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnJlcXVpcmUoJy4vXycpLmVhY2guY2FsbChbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgZnVuY3Rpb24oTkFNRSl7XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbn0pOyIsInZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQXR0cmlidXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQXR0cmlidXRlKCkge1xuICAgICAgICB9XG4gICAgICAgIEF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFkgPSBcInF1YWxpZmllclwiO1xuICAgICAgICBBdHRyaWJ1dGUuRElSVFlfUFJPUEVSVFkgPSBcImRpcnR5XCI7XG4gICAgICAgIEF0dHJpYnV0ZS5CQVNFX1ZBTFVFID0gXCJiYXNlVmFsdWVcIjtcbiAgICAgICAgQXR0cmlidXRlLlZBTFVFID0gXCJ2YWx1ZVwiO1xuICAgICAgICBBdHRyaWJ1dGUuVEFHID0gXCJ0YWdcIjtcbiAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZTtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkF0dHJpYnV0ZSA9IEF0dHJpYnV0ZTtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDb21tYW5kKCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiZG9scGhpbi1jb3JlLWNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29tbWFuZDtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkNvbW1hbmQgPSBDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgVGFnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gVGFnKCkge1xuICAgICAgICB9XG4gICAgICAgIC8vSW1wbGVtZW50ZWQgYXMgZnVuY3Rpb24gc28gdGhhdCBpdCB3aWxsIG5ldmVyIGJlIGNoYW5nZWQgZnJvbSBvdXRzaWRlXG4gICAgICAgIC8qKiBUaGUgYWN0dWFsIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgdGhlIGRlZmF1bHQgaWYgbm8gdGFnIGlzIGdpdmVuLiovXG4gICAgICAgIFRhZy52YWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlZBTFVFXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiB0aGUgdG8tYmUtZGlzcGxheWVkIFN0cmluZywgbm90IHRoZSBrZXkuIEkxOE4gaGFwcGVucyBvbiB0aGUgc2VydmVyLiAqL1xuICAgICAgICBUYWcubGFiZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJMQUJFTFwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogSWYgdGhlIGF0dHJpYnV0ZSByZXByZXNlbnQgdG9vbHRpcCoqL1xuICAgICAgICBUYWcudG9vbHRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlRPT0xUSVBcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIFwidHJ1ZVwiIG9yIFwiZmFsc2VcIiwgbWFwcyB0byBHcmFpbHMgY29uc3RyYWludCBudWxsYWJsZTpmYWxzZSAqL1xuICAgICAgICBUYWcubWFuZGF0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTUFOREFUT1JZXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBcInRydWVcIiBvciBcImZhbHNlXCIsIG1hcHMgdG8gR3JhaWxzIGNvbnN0cmFpbnQgZGlzcGxheTp0cnVlICovXG4gICAgICAgIFRhZy52aXNpYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVklTSUJMRVwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogXCJ0cnVlXCIgb3IgXCJmYWxzZVwiICovXG4gICAgICAgIFRhZy5lbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiRU5BQkxFRFwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogcmVndWxhciBleHByZXNzaW9uIGZvciBsb2NhbCwgc3ludGFjdGljYWwgY29uc3RyYWludHMgbGlrZSBpbiBcInJlamVjdEZpZWxkXCIgKi9cbiAgICAgICAgVGFnLnJlZ2V4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiUkVHRVhcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIGEgc2luZ2xlIHRleHQ7IGUuZy4gXCJ0ZXh0QXJlYVwiIGlmIHRoZSBTdHJpbmcgdmFsdWUgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiBhIHRleHQgYXJlYSBpbnN0ZWFkIG9mIGEgdGV4dEZpZWxkICovXG4gICAgICAgIFRhZy53aWRnZXRIaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiV0lER0VUX0hJTlRcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIGEgc2luZ2xlIHRleHQ7IGUuZy4gXCJqYXZhLnV0aWwuRGF0ZVwiIGlmIHRoZSB2YWx1ZSBTdHJpbmcgcmVwcmVzZW50cyBhIGRhdGUgKi9cbiAgICAgICAgVGFnLnZhbHVlVHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlZBTFVFX1RZUEVcIjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIFRhZztcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLlRhZyA9IFRhZztcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVGFnLnRzXCIgLz5cbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZTtcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xufTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uKHBtSWQsIGF0dHJpYnV0ZUlkLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBxdWFsaWZpZXIsIHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gdm9pZCAwKSB7IHRhZyA9IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpOyB9XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyID0gcXVhbGlmaWVyO1xuICAgICAgICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0F0dHJpYnV0ZUNyZWF0ZWQnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb24gPSBBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWQnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgPSBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnQmFzZVZhbHVlQ2hhbmdlZCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5CYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5CYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IEJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhDYWxsTmFtZWRBY3Rpb25Db21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDYWxsTmFtZWRBY3Rpb25Db21tYW5kKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25OYW1lID0gYWN0aW9uTmFtZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnQ2FsbE5hbWVkQWN0aW9uJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNhbGxOYW1lZEFjdGlvbkNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5DYWxsTmFtZWRBY3Rpb25Db21tYW5kID0gQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgICAgICB0aGlzLm1ldGFkYXRhTmFtZSA9IG1ldGFkYXRhTmFtZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGEnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQgPSBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBFdmVudEJ1cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50QnVzKCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnRCdXMucHJvdG90eXBlLm9uRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMucHVzaChldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudEJ1cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkgeyByZXR1cm4gaGFuZGxlKGV2ZW50KTsgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBFdmVudEJ1cztcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkV2ZW50QnVzID0gRXZlbnRCdXM7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnRCdXMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlRhZy50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCA9IDA7IC8vIHRvZG8gZGs6IGNvbnNpZGVyIG1ha2luZyB0aGlzIHN0YXRpYyBpbiBjbGFzc1xuICAgIHZhciBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlID0gcHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJyAmJiBpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZCA9IChwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQrKykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZEJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdG9kbyBkazogYWxpZ24gd2l0aCBKYXZhIHZlcnNpb246IG1vdmUgdG8gQ2xpZW50RG9scGhpbiBhbmQgYXV0by1hZGQgdG8gbW9kZWwgc3RvcmVcbiAgICAgICAgLyoqIGEgY29weSBjb25zdHJ1Y3RvciBmb3IgYW55dGhpbmcgYnV0IElEcy4gUGVyIGRlZmF1bHQsIGNvcGllcyBhcmUgY2xpZW50IHNpZGUgb25seSwgbm8gYXV0b21hdGljIHVwZGF0ZSBhcHBsaWVzLiAqL1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwobnVsbCwgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgcmVzdWx0LmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVDb3B5ID0gYXR0cmlidXRlLmNvcHkoKTtcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZUNvcHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICAvL2FkZCBhcnJheSBvZiBhdHRyaWJ1dGVzXG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMgfHwgYXR0cmlidXRlcy5sZW5ndGggPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgIF90aGlzLmFkZEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuYWRkQXR0cmlidXRlID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICh0aGlzLmF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lQW5kVGFnKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIGF0dHJpYnV0ZS50YWcpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhbiBhdHRyaWJ1dGUgd2l0aCBwcm9wZXJ0eSBuYW1lOiBcIiArIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBhbmQgdGFnOiBcIiArIGF0dHJpYnV0ZS50YWcgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkgJiYgdGhpcy5maW5kQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcXVhbGlmaWVyOiBcIiArIGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKVxuICAgICAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlLnNldFByZXNlbnRhdGlvbk1vZGVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudGFnID09IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVEaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRCdXMudHJpZ2dlcih7IHNvdXJjZTogX3RoaXMgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnVwZGF0ZURpcnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlzRGlydHkoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERpcnR5KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eShmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS51cGRhdGVBdHRyaWJ1dGVEaXJ0eW5lc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1tpXS51cGRhdGVEaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpcnR5O1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuc2V0RGlydHkgPSBmdW5jdGlvbiAoZGlydHkpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWwgPSB0aGlzLmRpcnR5O1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGRpcnR5O1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWwsICduZXdWYWx1ZSc6IHRoaXMuZGlydHkgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUucmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUucmViYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5yZWJhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUub25EaXJ0eSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5vbkludmFsaWRhdGVkID0gZnVuY3Rpb24gKGhhbmRsZUludmFsaWRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZEJ1cy5vbkV2ZW50KGhhbmRsZUludmFsaWRhdGUpO1xuICAgICAgICB9O1xuICAgICAgICAvKiogcmV0dXJucyBhIGNvcHkgb2YgdGhlIGludGVybmFsIHN0YXRlICovXG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zbGljZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmdldEF0ID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgdGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnID09PSB2b2lkIDApIHsgdGFnID0gb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCk7IH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZUFuZFRhZyhwcm9wZXJ0eU5hbWUsIHRhZyk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWVBbmRUYWcocHJvcGVydHlOYW1lLCBvcGVuZG9scGhpbi5UYWcudmFsdWUoKSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQWxsQXR0cmlidXRlc0J5UHJvcGVydHlOYW1lID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lQW5kVGFnID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgdGFnKSB7XG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSB8fCAhdGFnKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuYXR0cmlidXRlc1tpXS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSAmJiAodGhpcy5hdHRyaWJ1dGVzW2ldLnRhZyA9PSB0YWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAocXVhbGlmaWVyKSB7XG4gICAgICAgICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5nZXRRdWFsaWZpZXIoKSA9PSBxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5zeW5jV2l0aCA9IGZ1bmN0aW9uIChzb3VyY2VQcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2VQcmVzZW50YXRpb25Nb2RlbC5nZXRBdCh0YXJnZXRBdHRyaWJ1dGUucHJvcGVydHlOYW1lLCB0YXJnZXRBdHRyaWJ1dGUudGFnKTtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5DbGllbnRQcmVzZW50YXRpb25Nb2RlbCA9IENsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnRCdXMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlRhZy50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENsaWVudEF0dHJpYnV0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUsIHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gdm9pZCAwKSB7IHRhZyA9IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpOyB9XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIHRoaXMudGFnID0gdGFnO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiXCIgKyAoQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQrKykgKyBcIkNcIjtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZhbHVlQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QmFzZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHF1YWxpZmllcik7XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGEgY29weSBjb25zdHJ1Y3RvciB3aXRoIG5ldyBpZCBhbmQgbm8gcHJlc2VudGF0aW9uIG1vZGVsICovXG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCksIHRoaXMudGFnKTtcbiAgICAgICAgICAgIHJlc3VsdC5zZXRCYXNlVmFsdWUodGhpcy5nZXRCYXNlVmFsdWUoKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmlzRGlydHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXJ0eTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRCYXNlVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYXNlVmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0UHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJZb3UgY2FuIG5vdCBzZXQgYSBwcmVzZW50YXRpb24gbW9kZWwgZm9yIGFuIGF0dHJpYnV0ZSB0aGF0IGlzIGFscmVhZHkgYm91bmQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbCA9IHByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmdldFByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIHZlcmlmaWVkVmFsdWUgPSBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSB2ZXJpZmllZFZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmVyaWZpZWRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkodGhpcy5jYWxjdWxhdGVEaXJ0eSh0aGlzLmJhc2VWYWx1ZSwgdmVyaWZpZWRWYWx1ZSkpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsdWUsICduZXdWYWx1ZSc6IHZlcmlmaWVkVmFsdWUgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuY2FsY3VsYXRlRGlydHkgPSBmdW5jdGlvbiAoYmFzZVZhbHVlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGJhc2VWYWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVZhbHVlICE9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnVwZGF0ZURpcnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eSh0aGlzLmNhbGN1bGF0ZURpcnR5KHRoaXMuYmFzZVZhbHVlLCB0aGlzLnZhbHVlKSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0RGlydHkgPSBmdW5jdGlvbiAoZGlydHkpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWwgPSB0aGlzLmRpcnR5O1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGRpcnR5O1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWwsICduZXdWYWx1ZSc6IHRoaXMuZGlydHkgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbClcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsLnVwZGF0ZURpcnR5KCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0UXVhbGlmaWVyID0gZnVuY3Rpb24gKG5ld1F1YWxpZmllcikge1xuICAgICAgICAgICAgaWYgKHRoaXMucXVhbGlmaWVyID09IG5ld1F1YWxpZmllcilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgb2xkUXVhbGlmaWVyID0gdGhpcy5xdWFsaWZpZXI7XG4gICAgICAgICAgICB0aGlzLnF1YWxpZmllciA9IG5ld1F1YWxpZmllcjtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRRdWFsaWZpZXIsICduZXdWYWx1ZSc6IG5ld1F1YWxpZmllciB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRRdWFsaWZpZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWFsaWZpZXI7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0QmFzZVZhbHVlID0gZnVuY3Rpb24gKGJhc2VWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmFzZVZhbHVlID09IGJhc2VWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgb2xkQmFzZVZhbHVlID0gdGhpcy5iYXNlVmFsdWU7XG4gICAgICAgICAgICB0aGlzLmJhc2VWYWx1ZSA9IGJhc2VWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkodGhpcy5jYWxjdWxhdGVEaXJ0eShiYXNlVmFsdWUsIHRoaXMudmFsdWUpKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRCYXNlVmFsdWUsICduZXdWYWx1ZSc6IGJhc2VWYWx1ZSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5yZWJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJhc2VWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkoZmFsc2UpOyAvLyB0aGlzIGlzIG5vdCBzdXBlcmZsdW91cyFcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5iYXNlVmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eShmYWxzZSk7IC8vIHRoaXMgaXMgbm90IHN1cGVyZmx1b3VzIVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgU3RyaW5nIHx8IHJlc3VsdCBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgcmVzdWx0IGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWUudmFsdWVPZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIENsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW4gQXR0cmlidXRlIG1heSBub3QgaXRzZWxmIGNvbnRhaW4gYW4gYXR0cmlidXRlIGFzIGEgdmFsdWUuIEFzc3VtaW5nIHlvdSBmb3Jnb3QgdG8gY2FsbCB2YWx1ZS5cIik7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5jaGVja1ZhbHVlKHZhbHVlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBvayA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTLmluZGV4T2YodHlwZW9mIHJlc3VsdCkgPiAtMSB8fCByZXN1bHQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZSB2YWx1ZXMgb2YgdGhpcyB0eXBlIGFyZSBub3QgYWxsb3dlZDogXCIgKyB0eXBlb2YgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5vblZhbHVlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIoeyBcIm9sZFZhbHVlXCI6IHRoaXMudmFsdWUsIFwibmV3VmFsdWVcIjogdGhpcy52YWx1ZSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5vblF1YWxpZmllckNoYW5nZSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5vbkRpcnR5ID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5vbkJhc2VWYWx1ZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zeW5jV2l0aCA9IGZ1bmN0aW9uIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpOyAvLyBzZXF1ZW5jZSBpcyBpbXBvcnRhbnRcbiAgICAgICAgICAgICAgICB0aGlzLnNldEJhc2VWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0QmFzZVZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLlNVUFBPUlRFRF9WQUxVRV9UWVBFUyA9IFtcInN0cmluZ1wiLCBcIm51bWJlclwiLCBcImJvb2xlYW5cIl07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIENsaWVudEF0dHJpYnV0ZTtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZSA9IENsaWVudEF0dHJpYnV0ZTtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhWYWx1ZUNoYW5nZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiVmFsdWVDaGFuZ2VkXCI7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5WYWx1ZUNoYW5nZWRDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFZhbHVlQ2hhbmdlZENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IFZhbHVlQ2hhbmdlZENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIE5hbWVkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhOYW1lZENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIE5hbWVkQ29tbWFuZChuYW1lKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uTmFtZWRDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5hbWVkQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5OYW1lZENvbW1hbmQgPSBOYW1lZENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEVtcHR5Tm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEVtcHR5Tm90aWZpY2F0aW9uLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBFbXB0eU5vdGlmaWNhdGlvbigpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiRW1wdHlcIjtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkVtcHR5Tm90aWZpY2F0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEVtcHR5Tm90aWZpY2F0aW9uO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkVtcHR5Tm90aWZpY2F0aW9uID0gRW1wdHlOb3RpZmljYXRpb247XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlZhbHVlQ2hhbmdlZENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmFtZWRDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVtcHR5Tm90aWZpY2F0aW9uLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIC8qKiBBIEJhdGNoZXIgdGhhdCBkb2VzIG5vIGJhdGNoaW5nIGJ1dCBtZXJlbHkgdGFrZXMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIHF1ZXVlIGFzIHRoZSBzaW5nbGUgaXRlbSBpbiB0aGUgYmF0Y2ggKi9cbiAgICB2YXIgTm9Db21tYW5kQmF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIE5vQ29tbWFuZEJhdGNoZXIoKSB7XG4gICAgICAgIH1cbiAgICAgICAgTm9Db21tYW5kQmF0Y2hlci5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbiAocXVldWUpIHtcbiAgICAgICAgICAgIHJldHVybiBbcXVldWUuc2hpZnQoKV07XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBOb0NvbW1hbmRCYXRjaGVyO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uTm9Db21tYW5kQmF0Y2hlciA9IE5vQ29tbWFuZEJhdGNoZXI7XG4gICAgLyoqIEEgYmF0Y2hlciB0aGF0IGJhdGNoZXMgdGhlIGJsaW5kcyAoY29tbWFuZHMgd2l0aCBubyBjYWxsYmFjaykgYW5kIG9wdGlvbmFsbHkgYWxzbyBmb2xkcyB2YWx1ZSBjaGFuZ2VzICovXG4gICAgdmFyIEJsaW5kQ29tbWFuZEJhdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvKiogZm9sZGluZzogd2hldGhlciB3ZSBzaG91bGQgdHJ5IGZvbGRpbmcgVmFsdWVDaGFuZ2VkQ29tbWFuZHMgKi9cbiAgICAgICAgZnVuY3Rpb24gQmxpbmRDb21tYW5kQmF0Y2hlcihmb2xkaW5nLCBtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgICAgIGlmIChmb2xkaW5nID09PSB2b2lkIDApIHsgZm9sZGluZyA9IHRydWU7IH1cbiAgICAgICAgICAgIGlmIChtYXhCYXRjaFNpemUgPT09IHZvaWQgMCkgeyBtYXhCYXRjaFNpemUgPSA1MDsgfVxuICAgICAgICAgICAgdGhpcy5mb2xkaW5nID0gZm9sZGluZztcbiAgICAgICAgICAgIHRoaXMubWF4QmF0Y2hTaXplID0gbWF4QmF0Y2hTaXplO1xuICAgICAgICB9XG4gICAgICAgIEJsaW5kQ29tbWFuZEJhdGNoZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKHF1ZXVlKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NOZXh0KHRoaXMubWF4QmF0Y2hTaXplLCBxdWV1ZSwgcmVzdWx0KTsgLy8gZG8gbm90IGJhdGNoIG1vcmUgdGhhbiB0aGlzLm1heEJhdGNoU2l6ZSBjb21tYW5kcyB0byBhdm9pZCBzdGFjayBvdmVyZmxvdyBvbiByZWN1cnNpb24uXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICAvLyByZWN1cnNpdmUgaW1wbCBtZXRob2QgdG8gc2lkZS1lZmZlY3QgYm90aCBxdWV1ZSBhbmQgYmF0Y2hcbiAgICAgICAgQmxpbmRDb21tYW5kQmF0Y2hlci5wcm90b3R5cGUucHJvY2Vzc05leHQgPSBmdW5jdGlvbiAobWF4QmF0Y2hTaXplLCBxdWV1ZSwgYmF0Y2gpIHtcbiAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPCAxIHx8IG1heEJhdGNoU2l6ZSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkaW5nICYmIGNhbmRpZGF0ZS5jb21tYW5kIGluc3RhbmNlb2Ygb3BlbmRvbHBoaW4uVmFsdWVDaGFuZ2VkQ29tbWFuZCAmJiAoIWNhbmRpZGF0ZS5oYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGNhbkNtZCA9IGNhbmRpZGF0ZS5jb21tYW5kO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmF0Y2gubGVuZ3RoICYmIGZvdW5kID09IG51bGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmF0Y2hbaV0uY29tbWFuZCBpbnN0YW5jZW9mIG9wZW5kb2xwaGluLlZhbHVlQ2hhbmdlZENvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYXRjaENtZCA9IGJhdGNoW2ldLmNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FuQ21kLmF0dHJpYnV0ZUlkID09IGJhdGNoQ21kLmF0dHJpYnV0ZUlkICYmIGJhdGNoQ21kLm5ld1ZhbHVlID09IGNhbkNtZC5vbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gYmF0Y2hDbWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kLm5ld1ZhbHVlID0gY2FuQ21kLm5ld1ZhbHVlOyAvLyBjaGFuZ2UgZXhpc3RpbmcgdmFsdWUsIGRvIG5vdCBiYXRjaFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNhbmRpZGF0ZS5oYW5kbGVyICYmXG4gICAgICAgICAgICAgICAgIShjYW5kaWRhdGUuY29tbWFuZFsnY2xhc3NOYW1lJ10gPT0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLk5hbWVkQ29tbWFuZFwiKSAmJlxuICAgICAgICAgICAgICAgICEoY2FuZGlkYXRlLmNvbW1hbmRbJ2NsYXNzTmFtZSddID09IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5FbXB0eU5vdGlmaWNhdGlvblwiKSAvLyBhbmQgbm8gdW5rbm93biBjbGllbnQgc2lkZSBlZmZlY3RcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc05leHQobWF4QmF0Y2hTaXplIC0gMSwgcXVldWUsIGJhdGNoKTsgLy8gdGhlbiB3ZSBjYW4gcHJvY2VlZCB3aXRoIGJhdGNoaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBCbGluZENvbW1hbmRCYXRjaGVyO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQmxpbmRDb21tYW5kQmF0Y2hlciA9IEJsaW5kQ29tbWFuZEJhdGNoZXI7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDb2RlYyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENvZGVjKCkge1xuICAgICAgICB9XG4gICAgICAgIENvZGVjLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbiAoY29tbWFuZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcyk7IC8vIHRvZG8gZGs6IGxvb2sgZm9yIHBvc3NpYmxlIEFQSSBzdXBwb3J0IGZvciBjaGFyYWN0ZXIgZW5jb2RpbmdcbiAgICAgICAgfTtcbiAgICAgICAgQ29kZWMucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uICh0cmFuc21pdHRlZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc21pdHRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENvZGVjO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQ29kZWMgPSBDb2RlYztcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgU2lnbmFsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhTaWduYWxDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBTaWduYWxDb21tYW5kKG5hbWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IG5hbWU7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5TaWduYWxDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNpZ25hbENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uU2lnbmFsQ29tbWFuZCA9IFNpZ25hbENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRBdHRyaWJ1dGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbFwiO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCI7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwcmVzZW50YXRpb25Nb2RlbC5pZDtcbiAgICAgICAgICAgIHRoaXMucG1UeXBlID0gcHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBhdHRyLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGF0dHIuaWQsXG4gICAgICAgICAgICAgICAgICAgIHF1YWxpZmllcjogYXR0ci5nZXRRdWFsaWZpZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHIuZ2V0VmFsdWUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBhdHRyLnRhZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBNYXAoKSB7XG4gICAgICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIE1hcC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb250YWluc0tleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YVt0aGlzLmtleXMuaW5kZXhPZihrZXkpXSA9IHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5rZXlzLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbnNLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMua2V5cy5pbmRleE9mKGtleSk7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleXMubGVuZ3RoID09IDA7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5cy5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcy5rZXlzW2ldLCB0aGlzLmRhdGFbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnRhaW5zS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5cy5pbmRleE9mKGtleSkgPiAtMTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5jb250YWluc1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmluZGV4T2YodmFsdWUpID4gLTE7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5rZXlTZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlzLnNsaWNlKDApO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gTWFwO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uTWFwID0gTWFwO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uKHBtVHlwZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHBtVHlwZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZSc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb247XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbiA9IERlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb247XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24ocG1JZCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdEZWxldGVkUHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb247XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudERvbHBoaW4udHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRBdHRyaWJ1dGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlZhbHVlQ2hhbmdlZENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF0dHJpYnV0ZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJNYXAudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbi50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudEJ1cy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24udHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgKGZ1bmN0aW9uIChUeXBlKSB7XG4gICAgICAgIFR5cGVbVHlwZVtcIkFEREVEXCJdID0gJ0FEREVEJ10gPSBcIkFEREVEXCI7XG4gICAgICAgIFR5cGVbVHlwZVtcIlJFTU9WRURcIl0gPSAnUkVNT1ZFRCddID0gXCJSRU1PVkVEXCI7XG4gICAgfSkob3BlbmRvbHBoaW4uVHlwZSB8fCAob3BlbmRvbHBoaW4uVHlwZSA9IHt9KSk7XG4gICAgdmFyIFR5cGUgPSBvcGVuZG9scGhpbi5UeXBlO1xuICAgIHZhciBDbGllbnRNb2RlbFN0b3JlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMgPSBuZXcgb3BlbmRvbHBoaW4uTWFwKCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUgPSBuZXcgb3BlbmRvbHBoaW4uTWFwKCk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZCA9IG5ldyBvcGVuZG9scGhpbi5NYXAoKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllciA9IG5ldyBvcGVuZG9scGhpbi5NYXAoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICB9XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmdldENsaWVudERvbHBoaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGllbnREb2xwaGluO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZWdpc3Rlck1vZGVsID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbm5lY3RvciA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKTtcbiAgICAgICAgICAgIHZhciBjcmVhdGVQTUNvbW1hbmQgPSBuZXcgb3BlbmRvbHBoaW4uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKG1vZGVsKTtcbiAgICAgICAgICAgIGNvbm5lY3Rvci5zZW5kKGNyZWF0ZVBNQ29tbWFuZCwgbnVsbCk7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZWdpc3RlckF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB3aGVuZXZlciBhbiBhdHRyaWJ1dGUgY2hhbmdlcyBpdHMgdmFsdWUsIHRoZSBzZXJ2ZXIgbmVlZHMgdG8gYmUgbm90aWZpZWRcbiAgICAgICAgICAgIC8vIGFuZCBhbGwgb3RoZXIgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBhcmUgZ2l2ZW4gdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVDaGFuZ2VDb21tYW5kID0gbmV3IG9wZW5kb2xwaGluLlZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlLmlkLCBldnQub2xkVmFsdWUsIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKHZhbHVlQ2hhbmdlQ29tbWFuZCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBfdGhpcy5maW5kQXR0cmlidXRlc0J5RmlsdGVyKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0ciAhPT0gYXR0cmlidXRlICYmIGF0dHIuZ2V0UXVhbGlmaWVyKCkgPT0gYXR0cmlidXRlLmdldFF1YWxpZmllcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ci5zZXRWYWx1ZShhdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gYWxsIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgc2hvdWxkIGhhdmUgdGhlIHNhbWUgYmFzZSB2YWx1ZVxuICAgICAgICAgICAgYXR0cmlidXRlLm9uQmFzZVZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVZhbHVlQ2hhbmdlQ29tbWFuZCA9IG5ldyBvcGVuZG9scGhpbi5CYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGUuaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChiYXNlVmFsdWVDaGFuZ2VDb21tYW5kLCBudWxsKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IF90aGlzLmZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyICE9PSBhdHRyaWJ1dGUgJiYgYXR0ci5nZXRRdWFsaWZpZXIoKSA9PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyLnNldEJhc2VWYWx1ZShhdHRyaWJ1dGUuZ2V0QmFzZVZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblF1YWxpZmllckNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZUF0dHJNZXRhZGF0YUNtZCA9IG5ldyBvcGVuZG9scGhpbi5DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoYXR0cmlidXRlLmlkLCBvcGVuZG9scGhpbi5BdHRyaWJ1dGUuUVVBTElGSUVSX1BST1BFUlRZLCBldnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChjaGFuZ2VBdHRyTWV0YWRhdGFDbWQsIG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5jb250YWluc0tleShtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFscmVhZHkgaXMgYSBQTSB3aXRoIGlkIFwiICsgbW9kZWwuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zVmFsdWUobW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMucHV0KG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBUeXBlLkFEREVELCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWRkZWQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zVmFsdWUobW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMucmVtb3ZlKG1vZGVsLmlkKTtcbiAgICAgICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZUF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFR5cGUuUkVNT1ZFRCwgJ2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJzogbW9kZWwgfSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZXNCeUZpbHRlciA9IGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcihhdHRyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5wdXQodHlwZSwgcHJlc2VudGF0aW9uTW9kZWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5wdXNoKG1vZGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgIGlmICghbW9kZWwgfHwgIShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5zcGxpY2UocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnJlbW92ZShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5saXN0UHJlc2VudGF0aW9uTW9kZWxJZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMua2V5U2V0KCkuc2xpY2UoMCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMudmFsdWVzKCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5nZXQoaWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgaWYgKCF0eXBlIHx8ICF0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuY29udGFpbnNLZXkodHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGUgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMuZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMuZm9yRWFjaChmdW5jdGlvbiAocG0pIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChwbSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChuZXcgb3BlbmRvbHBoaW4uRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbihwcmVzZW50YXRpb25Nb2RlbFR5cGUpLCB1bmRlZmluZWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChtb2RlbCwgbm90aWZ5KSB7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShtb2RlbCk7XG4gICAgICAgICAgICAgICAgaWYgKCFub3RpZnkgfHwgbW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChuZXcgb3BlbmRvbHBoaW4uRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uKG1vZGVsLmlkKSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5jb250YWluc0tleShpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZEF0dHJpYnV0ZUJ5SWQgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5jb250YWluc0tleShhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQucHV0KGF0dHJpYnV0ZS5pZCwgYXR0cmlidXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJJZC5jb250YWluc0tleShhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQucmVtb3ZlKGF0dHJpYnV0ZS5pZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVySWQuZ2V0KGlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLnB1dChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCksIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5yZW1vdmUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgIGlmICghcXVhbGlmaWVyIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuY29udGFpbnNLZXkocXVhbGlmaWVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KHF1YWxpZmllcikuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLm9uTW9kZWxTdG9yZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLm9uTW9kZWxTdG9yZUNoYW5nZUZvclR5cGUgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWxUeXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KGZ1bmN0aW9uIChwbVN0b3JlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocG1TdG9yZUV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9PSBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyKHBtU3RvcmVFdmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDbGllbnRNb2RlbFN0b3JlO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQ2xpZW50TW9kZWxTdG9yZSA9IENsaWVudE1vZGVsU3RvcmU7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5hbWVkQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2lnbmFsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRW1wdHlOb3RpZmljYXRpb24udHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRNb2RlbFN0b3JlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbi50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENsaWVudERvbHBoaW4gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDbGllbnREb2xwaGluKCkge1xuICAgICAgICB9XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNldENsaWVudENvbm5lY3RvciA9IGZ1bmN0aW9uIChjbGllbnRDb25uZWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yID0gY2xpZW50Q29ubmVjdG9yO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5nZXRDbGllbnRDb25uZWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRDb25uZWN0b3I7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoY29tbWFuZE5hbWUsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNlbmQobmV3IG9wZW5kb2xwaGluLk5hbWVkQ29tbWFuZChjb21tYW5kTmFtZSksIG9uRmluaXNoZWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zZW5kRW1wdHkgPSBmdW5jdGlvbiAob25GaW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChuZXcgb3BlbmRvbHBoaW4uRW1wdHlOb3RpZmljYXRpb24oKSwgb25GaW5pc2hlZCk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGZhY3RvcnkgbWV0aG9kIGZvciBhdHRyaWJ1dGVzXG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUsIHRhZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBvcGVuZG9scGhpbi5DbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlLCB0YWcpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBmYWN0b3J5IG1ldGhvZCBmb3IgcHJlc2VudGF0aW9uIG1vZGVsc1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5wcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChpZCwgdHlwZSkge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb2RlbCA9IG5ldyBvcGVuZG9scGhpbi5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChtb2RlbCk7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNldENsaWVudE1vZGVsU3RvcmUgPSBmdW5jdGlvbiAoY2xpZW50TW9kZWxTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRNb2RlbFN0b3JlID0gY2xpZW50TW9kZWxTdG9yZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0Q2xpZW50TW9kZWxTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudE1vZGVsU3RvcmU7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5saXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5saXN0UHJlc2VudGF0aW9uTW9kZWxzKCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKG1vZGVsVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUsIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5kZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbE9mVHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllciA9IGZ1bmN0aW9uIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QXR0cmlidXRlLnRhZyAhPSBzb3VyY2VBdHRyaWJ1dGUudGFnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGF0dHJpYnV0ZXMgd2l0aCBzYW1lIHF1YWxpZmllciBhbmQgdGFnXG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTsgLy8gc2hvdWxkIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnNldEJhc2VWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0QmFzZVZhbHVlKCkpOyAvLyBhbmQgc2FtZSBiYXNlIHZhbHVlIGFuZCBzbyBkaXJ0eW5lc3NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS50YWcgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwsIHByb3BlcnR5TmFtZSwgdmFsdWUsIHRhZykge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IG5ldyBvcGVuZG9scGhpbi5DbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBudWxsLCB2YWx1ZSwgdGFnKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQXR0cmlidXRlVG9Nb2RlbChwcmVzZW50YXRpb25Nb2RlbCwgY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnRBdHRyaWJ1dGU7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmFkZEF0dHJpYnV0ZVRvTW9kZWwgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwsIGNsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuYWRkQXR0cmlidXRlKGNsaWVudEF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5yZWdpc3RlckF0dHJpYnV0ZShjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNlbmQobmV3IG9wZW5kb2xwaGluLkF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb24ocHJlc2VudGF0aW9uTW9kZWwuaWQsIGNsaWVudEF0dHJpYnV0ZS5pZCwgY2xpZW50QXR0cmlidXRlLnByb3BlcnR5TmFtZSwgY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCksIGNsaWVudEF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgY2xpZW50QXR0cmlidXRlLnRhZyksIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLy8vLy8gcHVzaCBzdXBwb3J0IC8vLy8vLy9cbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc3RhcnRQdXNoTGlzdGVuaW5nID0gZnVuY3Rpb24gKHB1c2hBY3Rpb25OYW1lLCByZWxlYXNlQWN0aW9uTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaExpc3RlbmVyKG5ldyBvcGVuZG9scGhpbi5OYW1lZENvbW1hbmQocHVzaEFjdGlvbk5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFJlbGVhc2VDb21tYW5kKG5ldyBvcGVuZG9scGhpbi5TaWduYWxDb21tYW5kKHJlbGVhc2VBY3Rpb25OYW1lKSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zdG9wUHVzaExpc3RlbmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENsaWVudERvbHBoaW47XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5DbGllbnREb2xwaGluID0gQ2xpZW50RG9scGhpbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZChwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1ByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5QcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZCA9IFByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBTYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24sIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24ocG1JZCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdTYXZlZFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5TYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uID0gU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVGFnLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kKHBtSWQsIHBtVHlwZSwgcHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIG5ld1ZhbHVlLCB0YWcpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09IHZvaWQgMCkgeyB0YWcgPSBvcGVuZG9scGhpbi5UYWcudmFsdWUoKTsgfVxuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5wbVR5cGUgPSBwbVR5cGU7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyID0gcXVhbGlmaWVyO1xuICAgICAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0luaXRpYWxpemVBdHRyaWJ1dGUnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQgPSBJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkLCBzb3VyY2VQbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZVBtSWQgPSBzb3VyY2VQbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5Td2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IFN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZChwbVR5cGUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbVR5cGUgPSBwbVR5cGU7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZSc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZCA9IERlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocG1JZCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdEZWxldGVQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERhdGFDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKERhdGFDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEYXRhQ29tbWFuZChkYXRhKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJEYXRhXCI7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EYXRhQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEYXRhQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5EYXRhQ29tbWFuZCA9IERhdGFDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZEJhdGNoZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvZGVjLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDYWxsTmFtZWRBY3Rpb25Db21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnREb2xwaGluLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRBdHRyaWJ1dGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24udHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJWYWx1ZUNoYW5nZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YUNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5hbWVkQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2lnbmFsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVGFnLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2xpZW50Q29ubmVjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50Q29ubmVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCBzbGFja01TLCBtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgICAgIGlmIChzbGFja01TID09PSB2b2lkIDApIHsgc2xhY2tNUyA9IDA7IH1cbiAgICAgICAgICAgIGlmIChtYXhCYXRjaFNpemUgPT09IHZvaWQgMCkgeyBtYXhCYXRjaFNpemUgPSA1MDsgfVxuICAgICAgICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0dGVyID0gdHJhbnNtaXR0ZXI7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICAgICAgdGhpcy5zbGFja01TID0gc2xhY2tNUztcbiAgICAgICAgICAgIHRoaXMuY29kZWMgPSBuZXcgb3BlbmRvbHBoaW4uQ29kZWMoKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXcgb3BlbmRvbHBoaW4uQmxpbmRDb21tYW5kQmF0Y2hlcih0cnVlLCBtYXhCYXRjaFNpemUpO1xuICAgICAgICB9XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0Q29tbWFuZEJhdGNoZXIgPSBmdW5jdGlvbiAobmV3QmF0Y2hlcikge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ld0JhdGNoZXI7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0UHVzaEVuYWJsZWQgPSBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0UHVzaExpc3RlbmVyID0gZnVuY3Rpb24gKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hMaXN0ZW5lciA9IG5ld0xpc3RlbmVyO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFJlbGVhc2VDb21tYW5kID0gZnVuY3Rpb24gKG5ld0NvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUNvbW1hbmQgPSBuZXdDb21tYW5kO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7IGNvbW1hbmQ6IGNvbW1hbmQsIGhhbmRsZXI6IG9uRmluaXNoZWQgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlTZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7IC8vIHRoZXJlIGlzIG5vdCBwb2ludCBpbiByZWxlYXNpbmcgaWYgd2UgZG8gbm90IHNlbmQgYXRtXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuZG9TZW5kTmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnB1c2hFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5xdWV1ZVB1c2hDb21tYW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgY21kc0FuZEhhbmRsZXJzID0gdGhpcy5jb21tYW5kQmF0Y2hlci5iYXRjaCh0aGlzLmNvbW1hbmRRdWV1ZSk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjbWRzQW5kSGFuZGxlcnNbY21kc0FuZEhhbmRsZXJzLmxlbmd0aCAtIDFdLmhhbmRsZXI7XG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSBjbWRzQW5kSGFuZGxlcnMubWFwKGZ1bmN0aW9uIChjYWgpIHsgcmV0dXJuIGNhaC5jb21tYW5kOyB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXR0ZXIudHJhbnNtaXQoY29tbWFuZHMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJ2ZXIgcmVzcG9uc2U6IFtcIiArIHJlc3BvbnNlLm1hcChpdCA9PiBpdC5pZCkuam9pbihcIiwgXCIpICsgXCJdIFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgdG91Y2hlZFBNcyA9IFtdO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdWNoZWQgPSBfdGhpcy5oYW5kbGUoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2hlZFBNcy5wdXNoKHRvdWNoZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5vbkZpbmlzaGVkKHRvdWNoZWRQTXMpOyAvLyB0b2RvOiBtYWtlIHRoZW0gdW5pcXVlP1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZWN1cnNpdmUgY2FsbDogZmV0Y2ggdGhlIG5leHQgaW4gbGluZSBidXQgYWxsb3cgYSBiaXQgb2Ygc2xhY2sgc3VjaCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQgZXZlbnRzIGNhbiBmaXJlLCByZW5kZXJpbmcgaXMgZG9uZSBhbmQgY29tbWFuZHMgY2FuIGJhdGNoIHVwXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5kb1NlbmROZXh0KCk7IH0sIF90aGlzLnNsYWNrTVMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09IFwiRGF0YVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGF0YUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZURlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIlZhbHVlQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJCYXNlVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkluaXRpYWxpemVBdHRyaWJ1dGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIlNhdmVkUHJlc2VudGF0aW9uTW9kZWxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24oY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJDYWxsTmFtZWRBY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNhbGxOYW1lZEFjdGlvbkNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbm5vdCBoYW5kbGUsIHVua25vd24gY29tbWFuZCBcIiArIGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlRGF0YUNvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlckNvbW1hbmQuZGF0YTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIGlmICghbW9kZWwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbE9mVHlwZUNvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlKHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgIGtub3duIHRvIHRoZSBjbGllbnQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IF90aGlzLmNsaWVudERvbHBoaW4uYXR0cmlidXRlKGF0dHIucHJvcGVydHlOYW1lLCBhdHRyLnF1YWxpZmllciwgYXR0ci52YWx1ZSwgYXR0ci50YWcgPyBhdHRyLnRhZyA6IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpKTtcbiAgICAgICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUuc2V0QmFzZVZhbHVlKGF0dHIuYmFzZVZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0ci5pZCAmJiBhdHRyLmlkLm1hdGNoKFwiLipTJFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUuaWQgPSBhdHRyLmlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNsaWVudFBtID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCwgc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICAgICAgY2xpZW50UG0uYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIGlmIChzZXJ2ZXJDb21tYW5kLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgY2xpZW50UG0uY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQoY2xpZW50UG0pO1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKGNsaWVudFBtKTtcbiAgICAgICAgICAgIGNsaWVudFBtLnVwZGF0ZUF0dHJpYnV0ZURpcnR5bmVzcygpO1xuICAgICAgICAgICAgY2xpZW50UG0udXBkYXRlRGlydHkoKTtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnRQbTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF0dHJpYnV0ZSB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHVwZGF0ZSBvbGQgdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm9sZFZhbHVlICsgXCIgdG8gbmV3IHZhbHVlIFwiICsgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCkgPT0gc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJub3RoaW5nIHRvIGRvLiBuZXcgdmFsdWUgPT0gb2xkIHZhbHVlXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQmVsb3cgd2FzIHRoZSBjb2RlIHRoYXQgd291bGQgZW5mb3JjZSB0aGF0IHZhbHVlIGNoYW5nZXMgb25seSBhcHBlYXIgd2hlbiB0aGUgcHJvcGVyIG9sZFZhbHVlIGlzIGdpdmVuLlxuICAgICAgICAgICAgLy8gV2hpbGUgdGhhdCBzZWVtZWQgYXBwcm9wcmlhdGUgYXQgZmlyc3QsIHRoZXJlIGFyZSBhY3R1YWxseSB2YWxpZCBjb21tYW5kIHNlcXVlbmNlcyB3aGVyZSB0aGUgb2xkVmFsdWUgaXMgbm90IHByb3Blcmx5IHNldC5cbiAgICAgICAgICAgIC8vIFdlIGxlYXZlIHRoZSBjb21tZW50ZWQgY29kZSBpbiB0aGUgY29kZWJhc2UgdG8gYWxsb3cgZm9yIGxvZ2dpbmcvZGVidWdnaW5nIHN1Y2ggY2FzZXMuXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGlmKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpICE9IHNlcnZlckNvbW1hbmQub2xkVmFsdWUpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlIHdpdGggaWQgXCIrc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCtcIiBhbmQgdmFsdWUgXCIgKyBjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSArXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiB3YXMgc2V0IHRvIHZhbHVlIFwiICsgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSArIFwiIGV2ZW4gdGhvdWdoIHRoZSBjaGFuZ2Ugd2FzIGJhc2VkIG9uIGFuIG91dGRhdGVkIG9sZCB2YWx1ZSBvZiBcIiArIHNlcnZlckNvbW1hbmQub2xkVmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUuc2V0VmFsdWUoc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCBzZXQgYmFzZSB2YWx1ZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUucmViYXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdmFyIHN3aXRjaFBtID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgICAgICBpZiAoIXN3aXRjaFBtKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzd2l0Y2ggbW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHN3aXRjaC5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc291cmNlUG0gPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5zb3VyY2VQbUlkKTtcbiAgICAgICAgICAgIGlmICghc291cmNlUG0pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNvdXJjZSBtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5zb3VyY2VQbUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3Qgc3dpdGNoLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaFBtLnN5bmNXaXRoKHNvdXJjZVBtKTtcbiAgICAgICAgICAgIHJldHVybiBzd2l0Y2hQbTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZShzZXJ2ZXJDb21tYW5kLnByb3BlcnR5TmFtZSwgc2VydmVyQ29tbWFuZC5xdWFsaWZpZXIsIHNlcnZlckNvbW1hbmQubmV3VmFsdWUsIHNlcnZlckNvbW1hbmQudGFnKTtcbiAgICAgICAgICAgIGlmIChzZXJ2ZXJDb21tYW5kLnF1YWxpZmllcikge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzQ29weSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihzZXJ2ZXJDb21tYW5kLnF1YWxpZmllcik7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNDb3B5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzQ29weS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuc2V0VmFsdWUoYXR0ci5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNDb3B5LmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQucG1JZCkge1xuICAgICAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwgPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkLCBzZXJ2ZXJDb21tYW5kLnBtVHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQocHJlc2VudGF0aW9uTW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmFkZEF0dHJpYnV0ZVRvTW9kZWwocHJlc2VudGF0aW9uTW9kZWwsIGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4udXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIocHJlc2VudGF0aW9uTW9kZWwpO1xuICAgICAgICAgICAgcmV0dXJuIHByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZVNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgaWYgKCFzZXJ2ZXJDb21tYW5kLnBtSWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCByZWJhc2UuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kZWwucmViYXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICBpZiAoIXNlcnZlckNvbW1hbmQucG1JZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHJlc2V0LlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vZGVsLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2xpZW50QXR0cmlidXRlW3NlcnZlckNvbW1hbmQubWV0YWRhdGFOYW1lXSA9IHNlcnZlckNvbW1hbmQudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVDYWxsTmFtZWRBY3Rpb25Db21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5zZW5kKHNlcnZlckNvbW1hbmQuYWN0aW9uTmFtZSwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnB1c2hFbmFibGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmICh0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5lbnF1ZXVlUHVzaENvbW1hbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMucHVzaExpc3RlbmVyLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKG1vZGVscykgeyBtZS53YWl0aW5nID0gZmFsc2U7IH0sXG4gICAgICAgICAgICAgICAgICAgIG9uRmluaXNoZWREYXRhOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy53YWl0aW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyByZWxlYXNlQ29tbWFuZCBpcyBzZXQ/XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnNpZ25hbCh0aGlzLnJlbGVhc2VDb21tYW5kKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENsaWVudENvbm5lY3RvcjtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkNsaWVudENvbm5lY3RvciA9IENsaWVudENvbm5lY3Rvcjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRG9scGhpbkJ1aWxkZXIudHNcIi8+XG4vKipcbiAqIEpTLWZyaWVuZGx5IGZhY2FkZSB0byBhdm9pZCB0b28gbWFueSBkZXBlbmRlbmNpZXMgaW4gcGxhaW4gSlMgY29kZS5cbiAqIFRoZSBuYW1lIG9mIHRoaXMgZmlsZSBpcyBhbHNvIHVzZWQgZm9yIHRoZSBpbml0aWFsIGxvb2t1cCBvZiB0aGVcbiAqIG9uZSBqYXZhc2NyaXB0IGZpbGUgdGhhdCBjb250YWlucyBhbGwgdGhlIGRvbHBoaW4gY29kZS5cbiAqIENoYW5naW5nIHRoZSBuYW1lIHJlcXVpcmVzIHRoZSBidWlsZCBzdXBwb3J0IGFuZCBhbGwgdXNlcnNcbiAqIHRvIGJlIHVwZGF0ZWQgYXMgd2VsbC5cbiAqIERpZXJrIEtvZW5pZ1xuICovXG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIHRoZSBpbml0aWFsaXplZCBkb2xwaGluXG4gICAgLy8gRGVwcmVjYXRlZCAhIFVzZSAnbWFrZURvbHBoaW4oKSBpbnN0ZWFkXG4gICAgZnVuY3Rpb24gZG9scGhpbih1cmwsIHJlc2V0LCBzbGFja01TKSB7XG4gICAgICAgIGlmIChzbGFja01TID09PSB2b2lkIDApIHsgc2xhY2tNUyA9IDMwMDsgfVxuICAgICAgICByZXR1cm4gbWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChyZXNldCkuc2xhY2tNUyhzbGFja01TKS5idWlsZCgpO1xuICAgIH1cbiAgICBvcGVuZG9scGhpbi5kb2xwaGluID0gZG9scGhpbjtcbiAgICAvLyBmYWN0b3J5IG1ldGhvZCB0byBidWlsZCBhbiBpbml0aWFsaXplZCBkb2xwaGluXG4gICAgZnVuY3Rpb24gbWFrZURvbHBoaW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgb3BlbmRvbHBoaW4uRG9scGhpbkJ1aWxkZXIoKTtcbiAgICB9XG4gICAgb3BlbmRvbHBoaW4ubWFrZURvbHBoaW4gPSBtYWtlRG9scGhpbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaWduYWxDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICAvKipcbiAgICAgKiBBIHRyYW5zbWl0dGVyIHRoYXQgaXMgbm90IHRyYW5zbWl0dGluZyBhdCBhbGwuXG4gICAgICogSXQgbWF5IHNlcnZlIGFzIGEgc3RhbmQtaW4gd2hlbiBubyByZWFsIHRyYW5zbWl0dGVyIGlzIG5lZWRlZC5cbiAgICAgKi9cbiAgICB2YXIgTm9UcmFuc21pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIE5vVHJhbnNtaXR0ZXIoKSB7XG4gICAgICAgIH1cbiAgICAgICAgTm9UcmFuc21pdHRlci5wcm90b3R5cGUudHJhbnNtaXQgPSBmdW5jdGlvbiAoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZyBzcGVjaWFsXG4gICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICB9O1xuICAgICAgICBOb1RyYW5zbWl0dGVyLnByb3RvdHlwZS5zaWduYWwgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gTm9UcmFuc21pdHRlcjtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLk5vVHJhbnNtaXR0ZXIgPSBOb1RyYW5zbWl0dGVyO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNpZ25hbENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvZGVjLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBIdHRwVHJhbnNtaXR0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBIdHRwVHJhbnNtaXR0ZXIodXJsLCByZXNldCwgY2hhcnNldCwgZXJyb3JIYW5kbGVyLCBzdXBwb3J0Q09SUykge1xuICAgICAgICAgICAgaWYgKHJlc2V0ID09PSB2b2lkIDApIHsgcmVzZXQgPSB0cnVlOyB9XG4gICAgICAgICAgICBpZiAoY2hhcnNldCA9PT0gdm9pZCAwKSB7IGNoYXJzZXQgPSBcIlVURi04XCI7IH1cbiAgICAgICAgICAgIGlmIChlcnJvckhhbmRsZXIgPT09IHZvaWQgMCkgeyBlcnJvckhhbmRsZXIgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoc3VwcG9ydENPUlMgPT09IHZvaWQgMCkgeyBzdXBwb3J0Q09SUyA9IGZhbHNlOyB9XG4gICAgICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgICAgIHRoaXMuY2hhcnNldCA9IGNoYXJzZXQ7XG4gICAgICAgICAgICB0aGlzLkh0dHBDb2RlcyA9IHtcbiAgICAgICAgICAgICAgICBmaW5pc2hlZDogNCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAyMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydENPUlMgPSBzdXBwb3J0Q09SUztcbiAgICAgICAgICAgIHRoaXMuaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgdGhpcy5zaWcgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwid2l0aENyZWRlbnRpYWxzXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlOyAvLyBOT1RFOiBkb2luZyB0aGlzIGZvciBub24gQ09SUyByZXF1ZXN0cyBoYXMgbm8gaW1wYWN0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2lnLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBvcGVuZG9scGhpbi5Db2RlYygpO1xuICAgICAgICAgICAgaWYgKHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS50cmFuc21pdCA9IGZ1bmN0aW9uIChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5odHRwLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmh0dHAucmVhZHlTdGF0ZSA9PSBfdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmh0dHAuc3RhdHVzID09IF90aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VUZXh0ID0gX3RoaXMuaHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlQ29tbWFuZHMgPSBfdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQgcGFyc2luZyByZXNwb25zZVRleHQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluY29ycmVjdCByZXNwb25zZVRleHQ6IFwiLCByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIgKyByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBlbXB0eSByZXNwb25zZVRleHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaHR0cC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1cIiArIHRoaXMuY2hhcnNldCk7IC8vIHRvZG8gbWFrZSBpbmplY3RhYmxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICB9O1xuICAgICAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLmhhbmRsZUVycm9yID0gZnVuY3Rpb24gKGtpbmQsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHZhciBlcnJvckV2ZW50ID0geyBraW5kOiBraW5kLCB1cmw6IHRoaXMudXJsLCBodHRwU3RhdHVzOiB0aGlzLmh0dHAuc3RhdHVzLCBtZXNzYWdlOiBtZXNzYWdlIH07XG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvckV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnJvckV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5zaWduYWwgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5zaWcub3BlbignUE9TVCcsIHRoaXMudXJsLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgICAgIH07XG4gICAgICAgIEh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwgKyAnaW52YWxpZGF0ZT8nLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmh0dHAuc2VuZCgpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gSHR0cFRyYW5zbWl0dGVyO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uSHR0cFRyYW5zbWl0dGVyID0gSHR0cFRyYW5zbWl0dGVyO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnREb2xwaGluLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk9wZW5Eb2xwaGluLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRNb2RlbFN0b3JlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5vVHJhbnNtaXR0ZXIudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSHR0cFRyYW5zbWl0dGVyLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRG9scGhpbkJ1aWxkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBEb2xwaGluQnVpbGRlcigpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gNTA7XG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRDT1JTXyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS51cmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB0aGlzLnVybF8gPSB1cmw7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKHJlc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0XyA9IHJlc2V0O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5zbGFja01TID0gZnVuY3Rpb24gKHNsYWNrTVMpIHtcbiAgICAgICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5tYXhCYXRjaFNpemUgPSBmdW5jdGlvbiAobWF4QmF0Y2hTaXplKSB7XG4gICAgICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSBtYXhCYXRjaFNpemU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLnN1cHBvcnRDT1JTID0gZnVuY3Rpb24gKHN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRDT1JTXyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5lcnJvckhhbmRsZXIgPSBmdW5jdGlvbiAoZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPcGVuRG9scGhpbiBqcyBmb3VuZFwiKTtcbiAgICAgICAgICAgIHZhciBjbGllbnREb2xwaGluID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudERvbHBoaW4oKTtcbiAgICAgICAgICAgIHZhciB0cmFuc21pdHRlcjtcbiAgICAgICAgICAgIGlmICh0aGlzLnVybF8gIT0gbnVsbCAmJiB0aGlzLnVybF8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRyYW5zbWl0dGVyID0gbmV3IG9wZW5kb2xwaGluLkh0dHBUcmFuc21pdHRlcih0aGlzLnVybF8sIHRoaXMucmVzZXRfLCBcIlVURi04XCIsIHRoaXMuZXJyb3JIYW5kbGVyXywgdGhpcy5zdXBwb3J0Q09SU18pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgb3BlbmRvbHBoaW4uTm9UcmFuc21pdHRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRDb25uZWN0b3IobmV3IG9wZW5kb2xwaGluLkNsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgdGhpcy5zbGFja01TXywgdGhpcy5tYXhCYXRjaFNpemVfKSk7XG4gICAgICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudE1vZGVsU3RvcmUobmV3IG9wZW5kb2xwaGluLkNsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGllbnREb2xwaGluIGluaXRpYWxpemVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBEb2xwaGluQnVpbGRlcjtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkRvbHBoaW5CdWlsZGVyID0gRG9scGhpbkJ1aWxkZXI7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBHZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBHZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocG1JZCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdHZXRQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5HZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IEdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBSZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1Jlc2V0UHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBSZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG5cbm1vZHVsZS5leHBvcnRzID0gb3BlbmRvbHBoaW47IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBNYXAgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxuXG5mdW5jdGlvbiBCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpIHtcbiAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5yZW1vdmVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy51cGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmFsbEFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLmFsbFJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoZnVuY3Rpb24odHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoZnVuY3Rpb24odHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm5vdGlmeUJlYW5DaGFuZ2UgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgIHJldHVybiB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUubm90aWZ5QXJyYXlDaGFuZ2UgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuaXNNYW5hZ2VkID0gZnVuY3Rpb24oYmVhbikge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5pc01hbmFnZWQoYmVhbiknKTtcbiAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5pc01hbmFnZWQoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5jcmVhdGUodHlwZSknKTtcbiAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG5cbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odHlwZSwgYmVhbikge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uKHR5cGUsIGNvbGxlY3Rpb24pIHtcbiAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihiZWFuKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZSgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUFsbChjb2xsZWN0aW9uKScpO1xuICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUFsbCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVJZiA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVJZihwcmVkaWNhdGUpJyk7XG4gICAgY2hlY2tQYXJhbShwcmVkaWNhdGUsICdwcmVkaWNhdGUnKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm9uQWRkZWQgPSBmdW5jdGlvbih0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm9uUmVtb3ZlZCA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5vbkJlYW5VcGRhdGUgPSBmdW5jdGlvbih0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUub25BcnJheVVwZGF0ZSA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5cblxuZXhwb3J0cy5CZWFuTWFuYWdlciA9IEJlYW5NYW5hZ2VyOyIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgUGxhdGZvcm0sIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCcpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vbGlic3JjL29wZW5kb2xwaGluLmpzJyk7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxudmFyIFVOS05PV04gPSAwLFxuICAgIEJBU0lDX1RZUEUgPSAxLFxuICAgIERPTFBISU5fQkVBTiA9IDI7XG5cbnZhciBibG9ja2VkID0gbnVsbDtcblxuZnVuY3Rpb24gZnJvbURvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgIHJldHVybiAhIGV4aXN0cyh2YWx1ZSk/IG51bGxcbiAgICAgICAgOiB0eXBlID09PSBET0xQSElOX0JFQU4/IGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KHZhbHVlKSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsPyBjbGFzc1JlcG9zaXRvcnkuYmVhblRvRG9scGhpbi5nZXQodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNlbmRMaXN0U3BsaWNlKGNsYXNzUmVwb3NpdG9yeSwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBmcm9tLCB0bywgbmV3RWxlbWVudHMpIHtcbiAgICB2YXIgZG9scGhpbiA9IGNsYXNzUmVwb3NpdG9yeS5kb2xwaGluO1xuICAgIHZhciBhdHRyaWJ1dGVzID0gW1xuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnQEBAIFNPVVJDRV9TWVNURU0gQEBAJywgbnVsbCwgJ2NsaWVudCcpLFxuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnc291cmNlJywgbnVsbCwgbW9kZWxJZCksXG4gICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBudWxsLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnZnJvbScsIG51bGwsIGZyb20pLFxuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgndG8nLCBudWxsLCB0byksXG4gICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdjb3VudCcsIG51bGwsIG5ld0VsZW1lbnRzLmxlbmd0aClcbiAgICBdO1xuICAgIG5ld0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKGRvbHBoaW4uYXR0cmlidXRlKGluZGV4LnRvU3RyaW5nKCksIG51bGwsIHRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIGVsZW1lbnQpKSk7XG4gICAgfSk7XG4gICAgZG9scGhpbi5wcmVzZW50YXRpb25Nb2RlbC5hcHBseShkb2xwaGluLCBbbnVsbCwgJ0BEUDpMU0AnXS5jb25jYXQoYXR0cmlidXRlcykpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUxpc3QoY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgbGlzdCA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICBpZiAoIWV4aXN0cyhsaXN0KSkge1xuICAgICAgICBjbGFzc1JlcG9zaXRvcnkucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIFtdLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJsb2NrKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gY3JlYXRlIGEgYmxvY2sgd2hpbGUgYW5vdGhlciBibG9jayBleGlzdHMnKTtcbiAgICB9XG4gICAgYmxvY2tlZCA9IHtcbiAgICAgICAgYmVhbjogYmVhbixcbiAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbn1cblxuZnVuY3Rpb24gdW5ibG9jaygpIHtcbiAgICBibG9ja2VkID0gbnVsbDtcbn1cblxuXG5mdW5jdGlvbiBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbikge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkoZG9scGhpbiknKTtcbiAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG5cbiAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIHRoaXMuY2xhc3NlcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJlYW5Ub0RvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5jbGFzc0luZm9zID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbn1cblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm5vdGlmeUJlYW5DaGFuZ2UgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG5cbiAgICB2YXIgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgaWYgKGV4aXN0cyhtb2RlbElkKSkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSAmJiBleGlzdHMoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0b0RvbHBoaW4odGhpcywgbmV3VmFsdWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbURvbHBoaW4odGhpcywgdHlwZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm5vdGlmeUFycmF5Q2hhbmdlID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyknKTtcbiAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICBjaGVja1BhcmFtKGluZGV4LCAnaW5kZXgnKTtcbiAgICBjaGVja1BhcmFtKGNvdW50LCAnY291bnQnKTtcbiAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgaWYgKGlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgIHZhciBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICBpZiAoZXhpc3RzKG1vZGVsSWQpICYmIGV4aXN0cyhhcnJheSkpIHtcbiAgICAgICAgdmFyIHJlbW92ZWRFbGVtZW50c0NvdW50ID0gQXJyYXkuaXNBcnJheShyZW1vdmVkRWxlbWVudHMpPyByZW1vdmVkRWxlbWVudHMubGVuZ3RoIDogMDtcbiAgICAgICAgc2VuZExpc3RTcGxpY2UodGhpcywgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBpbmRleCwgaW5kZXggKyByZW1vdmVkRWxlbWVudHNDb3VudCwgYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgY291bnQpKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUub25CZWFuQWRkZWQgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZChoYW5kbGVyKScpO1xuICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUub25CZWFuUmVtb3ZlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblJlbW92ZWQoaGFuZGxlciknKTtcbiAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUub25CZWFuVXBkYXRlID0gZnVuY3Rpb24oaGFuZGxlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm9uQXJyYXlVcGRhdGUgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLnJlZ2lzdGVyQ2xhc3MgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpJyk7XG4gICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICBpZiAodGhpcy5jbGFzc2VzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjbGFzc0luZm8gPSB7fTtcbiAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbihhdHRyaWJ1dGUpIHtcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMDtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gVU5LTk9XTjtcblxuICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IGV2ZW50Lm5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLnVucmVnaXN0ZXJDbGFzcyA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgdGhpcy5jbGFzc2VzWydkZWxldGUnXShtb2RlbC5pZCk7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCknKTtcbiAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIHZhciBiZWFuID0ge307XG4gICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICByZXR1cm4gKGF0dHJpYnV0ZS50YWcgPT09IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpKSAmJiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgYmVhblthdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IG51bGw7XG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50Lm9sZFZhbHVlICE9PSBldmVudC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQub2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIHNlbGYucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuLCBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbi5zZXQobW9kZWwuaWQsIGJlYW4pO1xuICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgIHRoaXMuY2xhc3NJbmZvcy5zZXQobW9kZWwuaWQsIGNsYXNzSW5mbyk7XG4gICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBiZWFuO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpJyk7XG4gICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICB2YXIgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChtb2RlbC5pZCk7XG4gICAgdGhpcy5iZWFuRnJvbURvbHBoaW5bJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICB0aGlzLmJlYW5Ub0RvbHBoaW5bJ2RlbGV0ZSddKGJlYW4pO1xuICAgIHRoaXMuY2xhc3NJbmZvc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIGlmIChleGlzdHMoYmVhbikpIHtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJlYW47XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUuc3BsaWNlTGlzdEVudHJ5ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnNwbGljZUxpc3RFbnRyeShtb2RlbCknKTtcbiAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgIHZhciBzb3VyY2UgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3NvdXJjZScpO1xuICAgIHZhciBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2F0dHJpYnV0ZScpO1xuICAgIHZhciBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgdmFyIHRvID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCd0bycpO1xuICAgIHZhciBjb3VudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnY291bnQnKTtcblxuICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzSW5mb3MuZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgLy92YXIgZW50cnkgPSBmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgICB2YWxpZGF0ZUxpc3QodGhpcywgdHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudC52YWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIGlmICghIGV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaChmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSwgZnJvbS52YWx1ZSwgdG8udmFsdWUgLSBmcm9tLnZhbHVlLCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB1bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZC4gU291cmNlIGJlYW4gdW5rbm93bi5cIik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubWFwUGFyYW1Ub0RvbHBoaW4gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBwYXJhbSwgdHlwZTogVU5LTk9XTn07XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhcmFtO1xuICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KHBhcmFtKTtcbiAgICAgICAgaWYgKGV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCB0eXBlOiBET0xQSElOX0JFQU59O1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBwYXJhbSwgdHlwZTogQkFTSUNfVFlQRX07XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBhbmQgcHJpbWl0aXZlIHR5cGVzIGNhbiBiZSB1c2VkXCIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm1hcERvbHBoaW5Ub0JlYW4gPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSkge1xuICAgIHJldHVybiBmcm9tRG9scGhpbih0aGlzLCB0eXBlLCB2YWx1ZSk7XG59O1xuXG5cblxuZXhwb3J0cy5DbGFzc1JlcG9zaXRvcnkgPSBDbGFzc1JlcG9zaXRvcnk7XG5leHBvcnRzLlVOS05PV04gPSBVTktOT1dOO1xuZXhwb3J0cy5CQVNJQ19UWVBFID0gQkFTSUNfVFlQRTtcbmV4cG9ydHMuRE9MUEhJTl9CRUFOID0gRE9MUEhJTl9CRUFOO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBjaGVja01ldGhvZCA9IHV0aWxzLmNoZWNrTWV0aG9kO1xudmFyIGNoZWNrUGFyYW0gPSB1dGlscy5jaGVja1BhcmFtO1xuXG52YXIgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbnZhciBJTklUX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2luaXRDbGllbnRDb250ZXh0JztcbnZhciBESVNDT05ORUNUX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2Rpc2Nvbm5lY3RDbGllbnRDb250ZXh0JztcblxuZnVuY3Rpb24gQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcikge1xuICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKScpO1xuICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICBjaGVja1BhcmFtKGJlYW5NYW5hZ2VyLCAnYmVhbk1hbmFnZXInKTtcbiAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJNYW5hZ2VyLCAnY29udHJvbGxlck1hbmFnZXInKTtcbiAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICB0aGlzLmJlYW5NYW5hZ2VyID0gYmVhbk1hbmFnZXI7XG4gICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICB0aGlzLl9jb25uZWN0b3IgPSBjb25uZWN0b3I7XG5cbiAgICB0aGlzLl9jb25uZWN0b3IuaW52b2tlKElOSVRfQ09NTUFORF9OQU1FKTtcbn1cblxuXG5DbGllbnRDb250ZXh0LnByb3RvdHlwZS5jcmVhdGVDb250cm9sbGVyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICByZXR1cm4gdGhpcy5fY29udHJvbGxlck1hbmFnZXIuY3JlYXRlQ29udHJvbGxlcihuYW1lKTtcbn07XG5cblxuQ2xpZW50Q29udGV4dC5wcm90b3R5cGUuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IEltcGxlbWVudCBDbGllbnRDb250ZXh0LmRpc2Nvbm5lY3QgW0RQLTQ2XVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShESVNDT05ORUNUX0NPTU1BTkRfTkFNRSk7XG4gICAgICAgIHNlbGYuZG9scGhpbiA9IG51bGw7XG4gICAgICAgIHNlbGYuYmVhbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgIHNlbGYuX2Nvbm5lY3RvciA9IG51bGw7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydHMuQ2xpZW50Q29udGV4dCA9IENsaWVudENvbnRleHQ7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJykuZXhpc3RzO1xuXG5cbmZ1bmN0aW9uIGVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ3AnOiBjb21tYW5kLnBtSWQsXG4gICAgICAgICd0JzogY29tbWFuZC5wbVR5cGUsXG4gICAgICAgICdhJzogY29tbWFuZC5hdHRyaWJ1dGVzLm1hcChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICduJzogYXR0cmlidXRlLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAnaSc6IGF0dHJpYnV0ZS5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoYXR0cmlidXRlLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC52ID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudGFnKSAmJiBhdHRyaWJ1dGUudGFnICE9PSAnVkFMVUUnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnQgPSBhdHRyaWJ1dGUudGFnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSksXG4gICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCdcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgIHJldHVybiB7XG4gICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcsXG4gICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIsXG4gICAgICAgICdjbGllbnRTaWRlT25seSc6IGZhbHNlLFxuICAgICAgICAncG1JZCc6IGNvbW1hbmQucCxcbiAgICAgICAgJ3BtVHlwZSc6IGNvbW1hbmQudCxcbiAgICAgICAgJ2F0dHJpYnV0ZXMnOiBjb21tYW5kLmEubWFwKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3Byb3BlcnR5TmFtZSc6IGF0dHJpYnV0ZS5uLFxuICAgICAgICAgICAgICAgICdpZCc6IGF0dHJpYnV0ZS5pLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGUudik/IGF0dHJpYnV0ZS52IDogbnVsbCxcbiAgICAgICAgICAgICAgICAnYmFzZVZhbHVlJzogZXhpc3RzKGF0dHJpYnV0ZS52KT8gYXR0cmlidXRlLnYgOiBudWxsLFxuICAgICAgICAgICAgICAgICdxdWFsaWZpZXInOiBudWxsLFxuICAgICAgICAgICAgICAgICd0YWcnOiBleGlzdHMoYXR0cmlidXRlLnQpPyBhdHRyaWJ1dGUudCA6ICdWQUxVRSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgfTtcbn1cblxuXG5mdW5jdGlvbiBlbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAnYSc6IGNvbW1hbmQuYXR0cmlidXRlSWRcbiAgICB9O1xuICAgIGlmIChleGlzdHMoY29tbWFuZC5vbGRWYWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0Lm8gPSBjb21tYW5kLm9sZFZhbHVlO1xuICAgIH1cbiAgICBpZiAoZXhpc3RzKGNvbW1hbmQubmV3VmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5uID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICB9XG4gICAgcmVzdWx0LmlkID0gJ1ZhbHVlQ2hhbmdlZCc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ2lkJzogJ1ZhbHVlQ2hhbmdlZCcsXG4gICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiLFxuICAgICAgICAnYXR0cmlidXRlSWQnOiBjb21tYW5kLmEsXG4gICAgICAgICdvbGRWYWx1ZSc6IGV4aXN0cyhjb21tYW5kLm8pPyBjb21tYW5kLm8gOiBudWxsLFxuICAgICAgICAnbmV3VmFsdWUnOiBleGlzdHMoY29tbWFuZC5uKT8gY29tbWFuZC5uIDogbnVsbFxuICAgIH07XG59XG5cblxuZXhwb3J0cy5Db2RlYyA9IHtcbiAgICBlbmNvZGU6IGZ1bmN0aW9uIChjb21tYW5kcykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09ICdWYWx1ZUNoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgfSkpO1xuICAgIH0sXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodHJhbnNtaXR0ZWQpLm1hcChmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSAnVmFsdWVDaGFuZ2VkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc21pdHRlZDtcbiAgICAgICAgfVxuICAgIH1cbn07IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZScpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vbGlic3JjL29wZW5kb2xwaGluLmpzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG52YXIgZXhpc3RzID0gdXRpbHMuZXhpc3RzO1xudmFyIGNoZWNrTWV0aG9kID0gdXRpbHMuY2hlY2tNZXRob2Q7XG52YXIgY2hlY2tQYXJhbSA9IHV0aWxzLmNoZWNrUGFyYW07XG5cblxudmFyIERPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG52YXIgUE9MTF9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdsb25nUG9sbCc7XG52YXIgUkVMRUFTRV9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdyZWxlYXNlJztcblxudmFyIERPTFBISU5fQkVBTiA9ICdAQEAgRE9MUEhJTl9CRUFOIEBAQCc7XG52YXIgQUNUSU9OX0NBTExfQkVBTiA9ICdAQEAgQ09OVFJPTExFUl9BQ1RJT05fQ0FMTF9CRUFOIEBAQCc7XG52YXIgSElHSExBTkRFUl9CRUFOID0gJ0BAQCBISUdITEFOREVSX0JFQU4gQEBAJztcbnZhciBET0xQSElOX0xJU1RfU1BMSUNFID0gJ0BEUDpMU0AnO1xudmFyIFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbnZhciBTT1VSQ0VfU1lTVEVNX0NMSUVOVCA9ICdjbGllbnQnO1xudmFyIFNPVVJDRV9TWVNURU1fU0VSVkVSID0gJ3NlcnZlcic7XG5cblxuXG52YXIgaW5pdGlhbGl6ZXI7XG5cbmZ1bmN0aW9uIENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKScpO1xuICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gZnVuY3Rpb24oKSB7fTtcbiAgICB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHNlbGYuaGlnaGxhbmRlclBNUmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgZG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkub25Nb2RlbFN0b3JlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgbW9kZWwgPSBldmVudC5jbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbiAgICAgICAgdmFyIHNvdXJjZVN5c3RlbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShTT1VSQ0VfU1lTVEVNKTtcbiAgICAgICAgaWYgKGV4aXN0cyhzb3VyY2VTeXN0ZW0pICYmIHNvdXJjZVN5c3RlbS52YWx1ZSA9PT0gU09VUkNFX1NZU1RFTV9TRVJWRVIpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5ldmVudFR5cGUgPT09IG9wZW5kb2xwaGluLlR5cGUuQURERUQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxBZGRlZChtb2RlbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gb3BlbmRvbHBoaW4uVHlwZS5SRU1PVkVEKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsUmVtb3ZlZChtb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghZXhpc3RzKGNvbmZpZykgfHwgIWV4aXN0cyhjb25maWcuc2VydmVyUHVzaCkgfHwgY29uZmlnLnNlcnZlclB1c2ggPT09IHRydWUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvbHBoaW4uc3RhcnRQdXNoTGlzdGVuaW5nKFBPTExfQ09NTUFORF9OQU1FLCBSRUxFQVNFX0NPTU1BTkRfTkFNRSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZXIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICByZXEud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlamVjdChFcnJvcihcIk5ldHdvcmsgRXJyb3JcIikpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlcS5vcGVuKCdQT1NUJywgdXJsICsgJ2ludmFsaWRhdGU/Jyk7XG4gICAgICAgIHJlcS5zZW5kKCk7XG4gICAgfSk7XG59XG5cblxuQ29ubmVjdG9yLnByb3RvdHlwZS5vbk1vZGVsQWRkZWQgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbEFkZGVkKG1vZGVsKScpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgQUNUSU9OX0NBTExfQkVBTjpcbiAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBISUdITEFOREVSX0JFQU46XG4gICAgICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG5cbkNvbm5lY3Rvci5wcm90b3R5cGUub25Nb2RlbFJlbW92ZWQgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbFJlbW92ZWQobW9kZWwpJyk7XG4gICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NQTElDRTpcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cblxuQ29ubmVjdG9yLnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5pbnZva2UoY29tbWFuZCknKTtcbiAgICBjaGVja1BhcmFtKGNvbW1hbmQsICdjb21tYW5kJyk7XG5cbiAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAvL2luaXRpYWxpemVyLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9scGhpbi5zZW5kKGNvbW1hbmQsIHtcbiAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvL30pO1xuICAgIH0pO1xufTtcblxuXG5Db25uZWN0b3IucHJvdG90eXBlLmdldEhpZ2hsYW5kZXJQTSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG59O1xuXG5cblxuZXhwb3J0cy5Db25uZWN0b3IgPSBDb25uZWN0b3I7XG5leHBvcnRzLlNPVVJDRV9TWVNURU0gPSBTT1VSQ0VfU1lTVEVNO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX0NMSUVOVCA9IFNPVVJDRV9TWVNURU1fQ0xJRU5UO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX1NFUlZFUiA9IFNPVVJDRV9TWVNURU1fU0VSVkVSO1xuZXhwb3J0cy5BQ1RJT05fQ0FMTF9CRUFOID0gQUNUSU9OX0NBTExfQkVBTjtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoJy4vcG9seWZpbGxzLmpzJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnKTtcbnZhciBTZXQgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9zZXQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxudmFyIENvbnRyb2xsZXJQcm94eSA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnByb3h5LmpzJykuQ29udHJvbGxlclByb3h5O1xuXG52YXIgRE9MUEhJTl9CRUFOX1RZUEUgPSByZXF1aXJlKCcuL2NsYXNzcmVwby5qcycpLkRPTFBISU5fQkVBTjtcblxudmFyIFNPVVJDRV9TWVNURU0gPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLlNPVVJDRV9TWVNURU07XG52YXIgU09VUkNFX1NZU1RFTV9DTElFTlQgPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLlNPVVJDRV9TWVNURU1fQ0xJRU5UO1xudmFyIEFDVElPTl9DQUxMX0JFQU4gPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLkFDVElPTl9DQUxMX0JFQU47XG5cbnZhciBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xudmFyIFJFR0lTVEVSX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVnaXN0ZXJDb250cm9sbGVyJztcbnZhciBDQUxMX0NPTlRST0xMRVJfQUNUSU9OX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2NhbGxDb250cm9sbGVyQWN0aW9uJztcbnZhciBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZGVzdHJveUNvbnRyb2xsZXInO1xuXG52YXIgQ09OVFJPTExFUl9OQU1FID0gJ2NvbnRyb2xsZXJOYW1lJztcbnZhciBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG52YXIgTU9ERUwgPSAnbW9kZWwnO1xudmFyIEFDVElPTl9OQU1FID0gJ2FjdGlvbk5hbWUnO1xudmFyIEVSUk9SX0NPREUgPSAnZXJyb3JDb2RlJztcbnZhciBQQVJBTV9QUkVGSVggPSAnXyc7XG5cblxuZnVuY3Rpb24gQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpJyk7XG4gICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG4gICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgdGhpcy5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbn1cblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlQ29udHJvbGxlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuY3JlYXRlQ29udHJvbGxlcihuYW1lKScpO1xuICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY29udHJvbGxlcklkLCBtb2RlbElkLCBtb2RlbCwgY29udHJvbGxlcjtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZWxmLmNvbm5lY3Rvci5nZXRIaWdobGFuZGVyUE0oKS50aGVuKGZ1bmN0aW9uIChoaWdobGFuZGVyUE0pIHtcbiAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9OQU1FKS5zZXRWYWx1ZShuYW1lKTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShSRUdJU1RFUl9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVySWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgbW9kZWxJZCA9IGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoTU9ERUwpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQsIERPTFBISU5fQkVBTl9UWVBFKTtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmFkZChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuaW52b2tlQWN0aW9uID0gZnVuY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKScpO1xuICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgIHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoU09VUkNFX1NZU1RFTSwgbnVsbCwgU09VUkNFX1NZU1RFTV9DTElFTlQpLFxuICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShDT05UUk9MTEVSX0lELCBudWxsLCBjb250cm9sbGVySWQpLFxuICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShBQ1RJT05fTkFNRSwgbnVsbCwgYWN0aW9uTmFtZSksXG4gICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEVSUk9SX0NPREUpXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtID0gc2VsZi5jbGFzc1JlcG9zaXRvcnkubWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW1zW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoUEFSQU1fUFJFRklYICsgcHJvcCwgbnVsbCwgcGFyYW0udmFsdWUsICdWQUxVRScpKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoUEFSQU1fUFJFRklYICsgcHJvcCwgbnVsbCwgcGFyYW0udHlwZSwgJ1ZBTFVFX1RZUEUnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBtID0gc2VsZi5kb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KHNlbGYuZG9scGhpbiwgW251bGwsIEFDVElPTl9DQUxMX0JFQU5dLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG5cbiAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENBTExfQ09OVFJPTExFUl9BQ1RJT05fQ09NTUFORF9OQU1FLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXNFcnJvciA9IHBtLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShFUlJPUl9DT0RFKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiQ29udHJvbGxlckFjdGlvbiBjYXVzZWQgYW4gZXJyb3JcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwocG0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblxuQ29udHJvbGxlck1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3lDb250cm9sbGVyID0gZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgIGNoZWNrUGFyYW0oY29udHJvbGxlciwgJ2NvbnRyb2xsZXInKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZWxmLmNvbm5lY3Rvci5nZXRIaWdobGFuZGVyUE0oKS50aGVuKGZ1bmN0aW9uIChoaWdobGFuZGVyUE0pIHtcbiAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5zZXRWYWx1ZShjb250cm9sbGVyLmNvbnRyb2xsZXJJZCk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5cbkNvbnRyb2xsZXJNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRyb2xsZXJzQ29weSA9IHRoaXMuY29udHJvbGxlcnM7XG4gICAgdmFyIHByb21pc2VzID0gW107XG4gICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICBjb250cm9sbGVyc0NvcHkuZm9yRWFjaChmdW5jdGlvbiAoY29udHJvbGxlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChjb250cm9sbGVyLmRlc3Ryb3koKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5cblxuXG5leHBvcnRzLkNvbnRyb2xsZXJNYW5hZ2VyID0gQ29udHJvbGxlck1hbmFnZXI7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIFNldCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIGNoZWNrTWV0aG9kID0gdXRpbHMuY2hlY2tNZXRob2Q7XG52YXIgY2hlY2tQYXJhbSA9IHV0aWxzLmNoZWNrUGFyYW07XG5cblxuXG5mdW5jdGlvbiBDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlciknKTtcbiAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgIGNoZWNrUGFyYW0obWFuYWdlciwgJ21hbmFnZXInKTtcblxuICAgIHRoaXMuY29udHJvbGxlcklkID0gY29udHJvbGxlcklkO1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzID0gbmV3IFNldCgpO1xufVxuXG5cbkNvbnRyb2xsZXJQcm94eS5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24obmFtZSwgcGFyYW1zKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eS5pbnZva2UobmFtZSwgcGFyYW1zKScpO1xuICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmludm9rZUFjdGlvbih0aGlzLmNvbnRyb2xsZXJJZCwgbmFtZSwgcGFyYW1zKTtcbn07XG5cblxuQ29udHJvbGxlclByb3h5LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyKHRoaXMpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25EZXN0cm95ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXMubWFuYWdlci5kZXN0cm95Q29udHJvbGxlcih0aGlzKTtcbn07XG5cblxuQ29udHJvbGxlclByb3h5LnByb3RvdHlwZS5vbkRlc3Ryb3llZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lm9uRGVzdHJveWVkKGhhbmRsZXIpJyk7XG4gICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5hZGQoaGFuZGxlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5vbkRlc3Ryb3llZEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5cblxuZXhwb3J0cy5Db250cm9sbGVyUHJveHkgPSBDb250cm9sbGVyUHJveHk7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vbGlic3JjL29wZW5kb2xwaGluLmpzJyk7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcbnZhciBDb25uZWN0b3IgPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLkNvbm5lY3RvcjtcbnZhciBCZWFuTWFuYWdlciA9IHJlcXVpcmUoJy4vYmVhbm1hbmFnZXIuanMnKS5CZWFuTWFuYWdlcjtcbnZhciBDbGFzc1JlcG9zaXRvcnkgPSByZXF1aXJlKCcuL2NsYXNzcmVwby5qcycpLkNsYXNzUmVwb3NpdG9yeTtcbnZhciBDb250cm9sbGVyTWFuYWdlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcm1hbmFnZXIuanMnKS5Db250cm9sbGVyTWFuYWdlcjtcbnZhciBDbGllbnRDb250ZXh0ID0gcmVxdWlyZSgnLi9jbGllbnRjb250ZXh0LmpzJykuQ2xpZW50Q29udGV4dDtcbnZhciBDb2RlYyA9IHJlcXVpcmUoJy4vY29kZWMuanMnKS5Db2RlYztcblxuZXhwb3J0cy5jb25uZWN0ID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICBjaGVja01ldGhvZCgnY29ubmVjdCh1cmwsIGNvbmZpZyknKTtcbiAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuXG4gICAgdmFyIGJ1aWxkZXIgPSBvcGVuZG9scGhpbi5tYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KGZhbHNlKS5zbGFja01TKDQpLnN1cHBvcnRDT1JTKHRydWUpO1xuICAgIGlmIChleGlzdHMoY29uZmlnKSAmJiBleGlzdHMoY29uZmlnLmVycm9ySGFuZGxlcikpIHtcbiAgICAgICAgYnVpbGRlci5lcnJvckhhbmRsZXIoY29uZmlnLmVycm9ySGFuZGxlcik7XG4gICAgfVxuICAgIHZhciBkb2xwaGluID0gYnVpbGRlci5idWlsZCgpO1xuICAgIGRvbHBoaW4uY2xpZW50Q29ubmVjdG9yLnRyYW5zbWl0dGVyLmNvZGVjID0gQ29kZWM7XG5cbiAgICB2YXIgY2xhc3NSZXBvc2l0b3J5ID0gbmV3IENsYXNzUmVwb3NpdG9yeShkb2xwaGluKTtcbiAgICB2YXIgYmVhbk1hbmFnZXIgPSBuZXcgQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KTtcbiAgICB2YXIgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKTtcbiAgICB2YXIgY29udHJvbGxlck1hbmFnZXIgPSBuZXcgQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKTtcbn07XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4gLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFycmF5LmZvckVhY2goKVxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcblxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcblxuICAgICAgICB2YXIgVCwgaztcblxuICAgICAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZyB0aGUgfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cbiAgICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG5cbiAgICAgICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgICAgIC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuICAgICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gNC4gSWYgSXNDYWxsYWJsZShjYWxsYmFjaykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYuIExldCBrIGJlIDBcbiAgICAgICAgayA9IDA7XG5cbiAgICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG4gICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgICAgICAgIHZhciBrVmFsdWU7XG5cbiAgICAgICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgICAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuICAgICAgICAgICAgLy8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgSGFzUHJvcGVydHkgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICAgIC8vICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcbiAgICAgICAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgICAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAgICAgICAgIC8vIGkuIExldCBrVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuXG4gICAgICAgICAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAvLyBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcga1ZhbHVlLCBrLCBhbmQgTy5cbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gOC4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQXJyYXkuZmlsdGVyKClcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maWx0ZXIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgaWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuICAgICAgICBpZiAodHlwZW9mIGZ1biAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMiA/IGFyZ3VtZW50c1sxXSA6IHZvaWQgMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gdCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0W2ldO1xuXG4gICAgICAgICAgICAgICAgLy8gTk9URTogVGVjaG5pY2FsbHkgdGhpcyBzaG91bGQgT2JqZWN0LmRlZmluZVByb3BlcnR5IGF0XG4gICAgICAgICAgICAgICAgLy8gICAgICAgdGhlIG5leHQgaW5kZXgsIGFzIHB1c2ggY2FuIGJlIGFmZmVjdGVkIGJ5XG4gICAgICAgICAgICAgICAgLy8gICAgICAgcHJvcGVydGllcyBvbiBPYmplY3QucHJvdG90eXBlIGFuZCBBcnJheS5wcm90b3R5cGUuXG4gICAgICAgICAgICAgICAgLy8gICAgICAgQnV0IHRoYXQgbWV0aG9kJ3MgbmV3LCBhbmQgY29sbGlzaW9ucyBzaG91bGQgYmVcbiAgICAgICAgICAgICAgICAvLyAgICAgICByYXJlLCBzbyB1c2UgdGhlIG1vcmUtY29tcGF0aWJsZSBhbHRlcm5hdGl2ZS5cbiAgICAgICAgICAgICAgICBpZiAoZnVuLmNhbGwodGhpc0FyZywgdmFsLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjaGVja01ldGhvZE5hbWU7XG5cbnZhciBleGlzdHMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0ICE9PSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZXhpc3RzID0gZXhpc3RzO1xuXG5tb2R1bGUuZXhwb3J0cy5jaGVja01ldGhvZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBjaGVja01ldGhvZE5hbWUgPSBuYW1lO1xufTtcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXJhbSA9IGZ1bmN0aW9uKHBhcmFtLCBwYXJhbWV0ZXJOYW1lKSB7XG4gICAgaWYgKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhcmFtZXRlciAnICsgcGFyYW1ldGVyTmFtZSArICcgaXMgbWFuZGF0b3J5IGluICcgKyBjaGVja01ldGhvZE5hbWUpO1xuICAgIH1cbn07XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIFBvbHltZXIsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQmluZGVyID0gcmVxdWlyZSgnLi9iaW5kZXIuanMnKS5CaW5kZXI7XG5cblxuZnVuY3Rpb24gZXhpc3RzKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59XG5cblxudmFyIGFycmF5S2V5QnVnO1xuZnVuY3Rpb24gcG9seW1lcjFfMWhhY2soZWxlbWVudCwgcGF0aCkge1xuICAgIC8vIFRoaXMgaXMgYSB0ZW1wb3JhcnkgaGFjayB0byBkZWFsIHdpdGggUG9seW1lcidzIEFQSSBjb25zaXN0ZW5jeSBjb25jZXJuaW5nIGFycmF5cyBhbmQgcGF0aHMuXG4gICAgLy8gQW4gb2JzZXJ2ZXIgdXNlcyBrZXlzIGluIGFuIGFycmF5LCB3aGlsZSB0aGUgZ2V0KCkgYW5kIHNldCgpIG1ldGhvZHMgZXhwZWN0IHRoZSBpbmRleC5cbiAgICAvLyBUaGlzIGlzIGhvcGVmdWxseSBmaXhlZCBpbiBQb2x5bWVyIDEuMi5cbiAgICBkbyB7XG4gICAgICAgIHZhciBwYXRoRWxlbWVudHMgPSBwYXRoLm1hdGNoKC9eKFteXFwuXSspXFwuKC4qKSQvKTtcbiAgICAgICAgdmFyIGtleSA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzFdIDogcGF0aDtcbiAgICAgICAgcGF0aCA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzJdIDogbnVsbDtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50KSkge1xuICAgICAgICAgICAgdmFyIGFycmF5S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIGlmIChpc05hTihhcnJheUtleSkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFBvbHltZXIuQ29sbGVjdGlvbi5nZXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGNvbGxlY3Rpb24uZ2V0SXRlbShhcnJheUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICB9XG4gICAgfSB3aGlsZSAocGF0aCAhPT0gbnVsbCAmJiBleGlzdHMoZWxlbWVudCkpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5mdW5jdGlvbiBuYXZpZ2F0ZVRvQmVhbihlbGVtZW50LCBwYXRoKSB7XG4gICAgdmFyIG5hdmlnYXRpb24gPSBwYXRoLm1hdGNoKC9eKC4qKVxcLlteXFwuXSokLyk7XG4gICAgaWYgKCEgZXhpc3RzKG5hdmlnYXRpb24pKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZXhpc3RzKGFycmF5S2V5QnVnKSkge1xuICAgICAgICAgICAgYXJyYXlLZXlCdWcgPSB0eXBlb2YgUG9seW1lci52ZXJzaW9uICE9PSAnc3RyaW5nJyB8fCAoUG9seW1lci52ZXJzaW9uLm1hdGNoKC9eMVxcLlswMV1cXC4vKSAhPT0gbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5S2V5QnVnPyBwb2x5bWVyMV8xaGFjayhlbGVtZW50LCBuYXZpZ2F0aW9uWzFdKSA6IGVsZW1lbnQuZ2V0KG5hdmlnYXRpb25bMV0sIGVsZW1lbnQpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpIHtcblxuICAgIHZhciBiaW5kZXIgPSBuZXcgQmluZGVyKGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9ICdJTklUSUFMSVpJTkcnO1xuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9ic2VydmVyczogWydfZG9scGhpbk9ic2VydmVyKG1vZGVsLiopJ10sXG5cbiAgICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBjbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUpLnRoZW4oZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAnUkVBRFknO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgnbW9kZWwnLCBjb250cm9sbGVyLm1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5vbkRlc3Ryb3llZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlID0gJ0RFU1RST1lFRCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgnbW9kZWwnLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbnZva2U6IGZ1bmN0aW9uKGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gQ2FsbCB0aGlzIGFmdGVyIGluaXQgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSAnUkVBRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29udHJvbGxlci5pbnZva2UoKSBjYWxsZWQgYmVmb3JlIGluaXQoKSBmaW5pc2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyLmludm9rZShhY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgX2RvbHBoaW5PYnNlcnZlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09ICdSRUFEWScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGV2ZW50LnBhdGg7XG4gICAgICAgICAgICAgICAgdmFyIGJlYW4sIHByb3BlcnR5TmFtZSwgaSwgajtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBldmVudC52YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChleGlzdHMobmV3VmFsdWUpICYmIGV4aXN0cyhuZXdWYWx1ZS5pbmRleFNwbGljZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmxlbmd0aCAtIFwiLnNwbGljZXNcIi5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBiZWFuID0gbmF2aWdhdGVUb0JlYW4odGhpcywgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHBhdGgubWF0Y2goL1teXFwuXSskLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IG5ld1ZhbHVlLmluZGV4U3BsaWNlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYW5nZSA9IG5ld1ZhbHVlLmluZGV4U3BsaWNlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRDb250ZXh0LmJlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZVswXSwgY2hhbmdlLmluZGV4LCBjaGFuZ2UuYWRkZWRDb3VudCwgY2hhbmdlLnJlbW92ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gYmVhbltwcm9wZXJ0eU5hbWVbMF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaGFuZ2UucmVtb3ZlZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kZXIudW5iaW5kKHRoaXMsIHBhdGggKyAnLicgKyAoY2hhbmdlLmluZGV4ICsgaiksIGNoYW5nZS5yZW1vdmVkW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gY2hhbmdlLmluZGV4ICsgY2hhbmdlLmFkZGVkQ291bnQ7IGogPCBhcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkUG9zID0gaiAtIGNoYW5nZS5hZGRlZENvdW50ICsgY2hhbmdlLnJlbW92ZWQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kZXIudW5iaW5kKHRoaXMsIHBhdGggKyAnLicgKyBvbGRQb3MsIGFycmF5W2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gY2hhbmdlLmluZGV4OyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLmJpbmQodGhpcywgcGF0aCArICcuJyArIGosIGFycmF5W2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiZWFuID0gbmF2aWdhdGVUb0JlYW4odGhpcywgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgIUFycmF5LmlzQXJyYXkoYmVhbikgJiYgIUFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwYXRoLm1hdGNoKC9bXlxcLl0rJC8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gY2xpZW50Q29udGV4dC5iZWFuTWFuYWdlci5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZVswXSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhvbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kZXIudW5iaW5kKHRoaXMsIHBhdGgsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLmJpbmQodGhpcywgcGF0aCwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cblxuXG5leHBvcnRzLnNldHVwQ3JlYXRlQmVoYXZpb3IgPSBzZXR1cENyZWF0ZUJlaGF2aW9yOyIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIE1hcCAgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnKTtcblxuXG5cbmZ1bmN0aW9uIGV4aXN0cyhvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBiaW5kU2NvcGUoc2NvcGUsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm4uYXBwbHkoc2NvcGUsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsKGFycmF5MSwgYXJyYXkyKSB7XG4gICAgaWYgKGFycmF5MSA9PT0gYXJyYXkyIHx8ICghZXhpc3RzKGFycmF5MSkgJiYgIWV4aXN0cyhhcnJheTIpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGV4aXN0cyhhcnJheTEpICE9PSBleGlzdHMoYXJyYXkyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gYXJyYXkxLmxlbmd0aDtcbiAgICBpZiAoYXJyYXkyLmxlbmd0aCAhPT0gbikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGlmIChhcnJheTFbaV0gIT09IGFycmF5MltpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIEJpbmRlcihiZWFuTWFuYWdlcikge1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuXG4gICAgYmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKGJpbmRTY29wZSh0aGlzLCB0aGlzLm9uQmVhblVwZGF0ZUhhbmRsZXIpKTtcbiAgICBiZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKGJpbmRTY29wZSh0aGlzLCB0aGlzLm9uQXJyYXlVcGRhdGVIYW5kbGVyKSk7XG59XG5cblxuQmluZGVyLnByb3RvdHlwZS5vbkJlYW5VcGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldChiZWFuKTtcbiAgICBpZiAoZXhpc3RzKGxpc3RlbmVyTGlzdCkgJiYgbGlzdGVuZXJMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gbGlzdGVuZXJMaXN0WzBdO1xuICAgICAgICB2YXIgZWxlbWVudCA9IGVudHJ5LmVsZW1lbnQ7XG4gICAgICAgIHZhciBwYXRoID0gZW50cnkucm9vdFBhdGggKyAnLicgKyBwcm9wZXJ0eU5hbWU7XG4gICAgICAgIGVsZW1lbnQuc2V0KHBhdGgsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBiZWFuW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG59O1xuXG5cbkJpbmRlci5wcm90b3R5cGUub25BcnJheVVwZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpIHtcbiAgICB2YXIgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgdmFyIG9sZEVsZW1lbnRzID0gYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgY291bnQpO1xuICAgIGlmIChkZWVwRXF1YWwobmV3RWxlbWVudHMsIG9sZEVsZW1lbnRzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQoYmVhbik7XG4gICAgaWYgKGV4aXN0cyhsaXN0ZW5lckxpc3QpICYmIGxpc3RlbmVyTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGxpc3RlbmVyTGlzdFswXTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlbnRyeS5lbGVtZW50O1xuICAgICAgICB2YXIgcGF0aCA9IGVudHJ5LnJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5ld0VsZW1lbnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudC5zcGxpY2UocGF0aCwgaW5kZXgsIGNvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3BsaWNlLmFwcGx5KGVsZW1lbnQsIFtwYXRoLCBpbmRleCwgY291bnRdLmNvbmNhdChuZXdFbGVtZW50cykpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdFbGVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgY291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlLmFwcGx5KGFycmF5LCBbaW5kZXgsIGNvdW50XS5jb25jYXQobmV3RWxlbWVudHMpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuQmluZGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJvb3RQYXRoLCB2YWx1ZSkge1xuICAgIGlmICghZXhpc3RzKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldCh2YWx1ZSk7XG4gICAgaWYgKCFleGlzdHMobGlzdGVuZXJMaXN0KSkge1xuICAgICAgICBsaXN0ZW5lckxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KHZhbHVlLCBsaXN0ZW5lckxpc3QpO1xuICAgIH1cbiAgICBsaXN0ZW5lckxpc3QucHVzaCh7ZWxlbWVudDogZWxlbWVudCwgcm9vdFBhdGg6IHJvb3RQYXRofSk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgaSwgdmFsdWVbaV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmQoZWxlbWVudCwgcm9vdFBhdGggKyAnLicgKyBwcm9wZXJ0eU5hbWUsIHZhbHVlW3Byb3BlcnR5TmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuQmluZGVyLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcm9vdFBhdGgsIHZhbHVlKSB7XG4gICAgaWYgKCFleGlzdHModmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHZhbHVlKTtcbiAgICBpZiAoZXhpc3RzKGxpc3RlbmVyTGlzdCkpIHtcbiAgICAgICAgdmFyIG4gPSBsaXN0ZW5lckxpc3QubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgdmFyIGVudHJ5ID0gbGlzdGVuZXJMaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGVudHJ5LmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgZW50cnkucm9vdFBhdGggPT09IHJvb3RQYXRoKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJMaXN0LnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZChlbGVtZW50LCByb290UGF0aCArICcuJyArIGosIHZhbHVlW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bmJpbmQoZWxlbWVudCwgcm9vdFBhdGggKyAnLicgKyBwcm9wZXJ0eU5hbWUsIHZhbHVlW3Byb3BlcnR5TmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5leHBvcnRzLkJpbmRlciA9IEJpbmRlcjtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbm5lY3QgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tanMvZGlzdC9kb2xwaGluLmpzJykuY29ubmVjdDtcbnZhciBzZXR1cENyZWF0ZUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvci5qcycpLnNldHVwQ3JlYXRlQmVoYXZpb3I7XG5cblxuZXhwb3J0cy5jb25uZWN0ID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICB2YXIgY2xpZW50Q29udGV4dCA9IGNvbm5lY3QodXJsLCBjb25maWcpO1xuICAgIGNsaWVudENvbnRleHQuY3JlYXRlQmVoYXZpb3IgPSBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpO1xuICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xufTtcbiJdfQ==
