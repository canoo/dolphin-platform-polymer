(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/_core').Map;
},{"../modules/_core":16,"../modules/es6.map":65,"../modules/es6.object.to-string":66,"../modules/es6.string.iterator":67,"../modules/es7.map.to-json":68,"../modules/web.dom.iterable":69}],2:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],3:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],4:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],5:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":33}],6:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":24}],7:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject')
  , toLength  = _dereq_('./_to-length')
  , toIndex   = _dereq_('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":55,"./_to-iobject":57,"./_to-length":58}],8:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = _dereq_('./_ctx')
  , IObject  = _dereq_('./_iobject')
  , toObject = _dereq_('./_to-object')
  , toLength = _dereq_('./_to-length')
  , asc      = _dereq_('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":10,"./_ctx":17,"./_iobject":30,"./_to-length":58,"./_to-object":59}],9:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object')
  , isArray  = _dereq_('./_is-array')
  , SPECIES  = _dereq_('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":32,"./_is-object":33,"./_wks":62}],10:[function(_dereq_,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":9}],11:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof')
  , TAG = _dereq_('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":12,"./_wks":62}],12:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],13:[function(_dereq_,module,exports){
'use strict';
var dP          = _dereq_('./_object-dp').f
  , create      = _dereq_('./_object-create')
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
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
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
    if(DESCRIPTORS)dP(C.prototype, 'size', {
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
},{"./_an-instance":4,"./_ctx":17,"./_defined":18,"./_descriptors":19,"./_for-of":24,"./_hide":27,"./_iter-define":36,"./_iter-step":37,"./_meta":40,"./_object-create":41,"./_object-dp":42,"./_redefine-all":48,"./_set-species":50}],14:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof')
  , from    = _dereq_('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":6,"./_classof":11}],15:[function(_dereq_,module,exports){
'use strict';
var global         = _dereq_('./_global')
  , $export        = _dereq_('./_export')
  , meta           = _dereq_('./_meta')
  , fails          = _dereq_('./_fails')
  , hide           = _dereq_('./_hide')
  , redefineAll    = _dereq_('./_redefine-all')
  , forOf          = _dereq_('./_for-of')
  , anInstance     = _dereq_('./_an-instance')
  , isObject       = _dereq_('./_is-object')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , dP             = _dereq_('./_object-dp').f
  , each           = _dereq_('./_array-methods')(0)
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
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
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
},{"./_an-instance":4,"./_array-methods":8,"./_descriptors":19,"./_export":22,"./_fails":23,"./_for-of":24,"./_global":25,"./_hide":27,"./_is-object":33,"./_meta":40,"./_object-dp":42,"./_redefine-all":48,"./_set-to-string-tag":51}],16:[function(_dereq_,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],17:[function(_dereq_,module,exports){
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
},{"./_a-function":2}],18:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],19:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":23}],20:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object')
  , document = _dereq_('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":25,"./_is-object":33}],21:[function(_dereq_,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],22:[function(_dereq_,module,exports){
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
},{"./_core":16,"./_ctx":17,"./_global":25,"./_hide":27}],23:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],24:[function(_dereq_,module,exports){
var ctx         = _dereq_('./_ctx')
  , call        = _dereq_('./_iter-call')
  , isArrayIter = _dereq_('./_is-array-iter')
  , anObject    = _dereq_('./_an-object')
  , toLength    = _dereq_('./_to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":5,"./_ctx":17,"./_is-array-iter":31,"./_iter-call":34,"./_to-length":58,"./core.get-iterator-method":63}],25:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],26:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],27:[function(_dereq_,module,exports){
var dP         = _dereq_('./_object-dp')
  , createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":19,"./_object-dp":42,"./_property-desc":47}],28:[function(_dereq_,module,exports){
module.exports = _dereq_('./_global').document && document.documentElement;
},{"./_global":25}],29:[function(_dereq_,module,exports){
module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function(){
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":19,"./_dom-create":20,"./_fails":23}],30:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":12}],31:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./_iterators')
  , ITERATOR   = _dereq_('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":38,"./_wks":62}],32:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":12}],33:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],34:[function(_dereq_,module,exports){
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
},{"./_an-object":5}],35:[function(_dereq_,module,exports){
'use strict';
var create         = _dereq_('./_object-create')
  , descriptor     = _dereq_('./_property-desc')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":27,"./_object-create":41,"./_property-desc":47,"./_set-to-string-tag":51,"./_wks":62}],36:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./_library')
  , $export        = _dereq_('./_export')
  , redefine       = _dereq_('./_redefine')
  , hide           = _dereq_('./_hide')
  , has            = _dereq_('./_has')
  , Iterators      = _dereq_('./_iterators')
  , $iterCreate    = _dereq_('./_iter-create')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , getPrototypeOf = _dereq_('./_object-gpo')
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
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
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
},{"./_export":22,"./_has":26,"./_hide":27,"./_iter-create":35,"./_iterators":38,"./_library":39,"./_object-gpo":44,"./_redefine":49,"./_set-to-string-tag":51,"./_wks":62}],37:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],38:[function(_dereq_,module,exports){
module.exports = {};
},{}],39:[function(_dereq_,module,exports){
module.exports = true;
},{}],40:[function(_dereq_,module,exports){
var META     = _dereq_('./_uid')('meta')
  , isObject = _dereq_('./_is-object')
  , has      = _dereq_('./_has')
  , setDesc  = _dereq_('./_object-dp').f
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
},{"./_fails":23,"./_has":26,"./_is-object":33,"./_object-dp":42,"./_uid":61}],41:[function(_dereq_,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = _dereq_('./_an-object')
  , dPs         = _dereq_('./_object-dps')
  , enumBugKeys = _dereq_('./_enum-bug-keys')
  , IE_PROTO    = _dereq_('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
},{"./_an-object":5,"./_dom-create":20,"./_enum-bug-keys":21,"./_html":28,"./_object-dps":43,"./_shared-key":52}],42:[function(_dereq_,module,exports){
var anObject       = _dereq_('./_an-object')
  , IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define')
  , toPrimitive    = _dereq_('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":5,"./_descriptors":19,"./_ie8-dom-define":29,"./_to-primitive":60}],43:[function(_dereq_,module,exports){
var dP       = _dereq_('./_object-dp')
  , anObject = _dereq_('./_an-object')
  , getKeys  = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":5,"./_descriptors":19,"./_object-dp":42,"./_object-keys":46}],44:[function(_dereq_,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = _dereq_('./_has')
  , toObject    = _dereq_('./_to-object')
  , IE_PROTO    = _dereq_('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":26,"./_shared-key":52,"./_to-object":59}],45:[function(_dereq_,module,exports){
var has          = _dereq_('./_has')
  , toIObject    = _dereq_('./_to-iobject')
  , arrayIndexOf = _dereq_('./_array-includes')(false)
  , IE_PROTO     = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":7,"./_has":26,"./_shared-key":52,"./_to-iobject":57}],46:[function(_dereq_,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = _dereq_('./_object-keys-internal')
  , enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":21,"./_object-keys-internal":45}],47:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],48:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":27}],49:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');
},{"./_hide":27}],50:[function(_dereq_,module,exports){
'use strict';
var global      = _dereq_('./_global')
  , core        = _dereq_('./_core')
  , dP          = _dereq_('./_object-dp')
  , DESCRIPTORS = _dereq_('./_descriptors')
  , SPECIES     = _dereq_('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":16,"./_descriptors":19,"./_global":25,"./_object-dp":42,"./_wks":62}],51:[function(_dereq_,module,exports){
var def = _dereq_('./_object-dp').f
  , has = _dereq_('./_has')
  , TAG = _dereq_('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":26,"./_object-dp":42,"./_wks":62}],52:[function(_dereq_,module,exports){
var shared = _dereq_('./_shared')('keys')
  , uid    = _dereq_('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":53,"./_uid":61}],53:[function(_dereq_,module,exports){
var global = _dereq_('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":25}],54:[function(_dereq_,module,exports){
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
},{"./_defined":18,"./_to-integer":56}],55:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":56}],56:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],57:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject')
  , defined = _dereq_('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":18,"./_iobject":30}],58:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":56}],59:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":18}],60:[function(_dereq_,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = _dereq_('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":33}],61:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],62:[function(_dereq_,module,exports){
var store      = _dereq_('./_shared')('wks')
  , uid        = _dereq_('./_uid')
  , Symbol     = _dereq_('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":25,"./_shared":53,"./_uid":61}],63:[function(_dereq_,module,exports){
var classof   = _dereq_('./_classof')
  , ITERATOR  = _dereq_('./_wks')('iterator')
  , Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":11,"./_core":16,"./_iterators":38,"./_wks":62}],64:[function(_dereq_,module,exports){
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
},{"./_add-to-unscopables":3,"./_iter-define":36,"./_iter-step":37,"./_iterators":38,"./_to-iobject":57}],65:[function(_dereq_,module,exports){
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
},{"./_collection":15,"./_collection-strong":13}],66:[function(_dereq_,module,exports){

},{}],67:[function(_dereq_,module,exports){
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
},{"./_iter-define":36,"./_string-at":54}],68:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./_export');

$export($export.P + $export.R, 'Map', {toJSON: _dereq_('./_collection-to-json')('Map')});
},{"./_collection-to-json":14,"./_export":22}],69:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global        = _dereq_('./_global')
  , hide          = _dereq_('./_hide')
  , Iterators     = _dereq_('./_iterators')
  , TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":25,"./_hide":27,"./_iterators":38,"./_wks":62,"./es6.array.iterator":64}],70:[function(_dereq_,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/_core').Map;

},{"../modules/_core":18,"../modules/es6.map":72,"../modules/es6.object.to-string":73,"../modules/es6.string.iterator":76,"../modules/es7.map.to-json":77,"../modules/web.dom.iterable":79}],2:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":18,"../modules/es6.object.to-string":73,"../modules/es6.promise":74,"../modules/es6.string.iterator":76,"../modules/web.dom.iterable":79}],3:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/_core').Set;

},{"../modules/_core":18,"../modules/es6.object.to-string":73,"../modules/es6.set":75,"../modules/es6.string.iterator":76,"../modules/es7.set.to-json":78,"../modules/web.dom.iterable":79}],4:[function(_dereq_,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],5:[function(_dereq_,module,exports){
"use strict";

module.exports = function () {/* empty */};

},{}],6:[function(_dereq_,module,exports){
'use strict';

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

},{}],7:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":36}],8:[function(_dereq_,module,exports){
'use strict';

var forOf = _dereq_('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":26}],9:[function(_dereq_,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject'),
    toLength = _dereq_('./_to-length'),
    toIndex = _dereq_('./_to-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-index":62,"./_to-iobject":64,"./_to-length":65}],10:[function(_dereq_,module,exports){
'use strict';

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = _dereq_('./_ctx'),
    IObject = _dereq_('./_iobject'),
    toObject = _dereq_('./_to-object'),
    toLength = _dereq_('./_to-length'),
    asc = _dereq_('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1,
      IS_FILTER = TYPE == 2,
      IS_SOME = TYPE == 3,
      IS_EVERY = TYPE == 4,
      IS_FIND_INDEX = TYPE == 6,
      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
      create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this),
        self = IObject(O),
        f = ctx(callbackfn, that, 3),
        length = toLength(self.length),
        index = 0,
        result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined,
        val,
        res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":12,"./_ctx":19,"./_iobject":33,"./_to-length":65,"./_to-object":66}],11:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object'),
    isArray = _dereq_('./_is-array'),
    SPECIES = _dereq_('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

},{"./_is-array":35,"./_is-object":36,"./_wks":69}],12:[function(_dereq_,module,exports){
'use strict';

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":11}],13:[function(_dereq_,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof'),
    TAG = _dereq_('./_wks')('toStringTag'
// ES3 wrong here
),
    ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O
  // ES3 arguments fallback
  ) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":14,"./_wks":69}],14:[function(_dereq_,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp').f,
    create = _dereq_('./_object-create'),
    redefineAll = _dereq_('./_redefine-all'),
    ctx = _dereq_('./_ctx'),
    anInstance = _dereq_('./_an-instance'),
    defined = _dereq_('./_defined'),
    forOf = _dereq_('./_for-of'),
    $iterDefine = _dereq_('./_iter-define'),
    step = _dereq_('./_iter-step'),
    setSpecies = _dereq_('./_set-species'),
    DESCRIPTORS = _dereq_('./_descriptors'),
    fastKey = _dereq_('./_meta').fastKey,
    SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key),
      entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = this,
            entry = getEntry(that, key);
        if (entry) {
          var next = entry.n,
              prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */) {
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
            entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key),
        prev,
        index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = iterated; // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this,
          kind = that._k,
          entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":6,"./_ctx":19,"./_defined":20,"./_descriptors":21,"./_for-of":26,"./_iter-define":39,"./_iter-step":41,"./_meta":44,"./_object-create":46,"./_object-dp":47,"./_redefine-all":53,"./_set-species":55}],16:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof'),
    from = _dereq_('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":8,"./_classof":13}],17:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    $export = _dereq_('./_export'),
    meta = _dereq_('./_meta'),
    fails = _dereq_('./_fails'),
    hide = _dereq_('./_hide'),
    redefineAll = _dereq_('./_redefine-all'),
    forOf = _dereq_('./_for-of'),
    anInstance = _dereq_('./_an-instance'),
    isObject = _dereq_('./_is-object'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    dP = _dereq_('./_object-dp').f,
    each = _dereq_('./_array-methods')(0),
    DESCRIPTORS = _dereq_('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME],
      C = Base,
      ADDER = IS_MAP ? 'set' : 'add',
      proto = C && C.prototype,
      O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if ('size' in proto) dP(C.prototype, 'size', {
      get: function get() {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":6,"./_array-methods":10,"./_descriptors":21,"./_export":24,"./_fails":25,"./_for-of":26,"./_global":27,"./_hide":29,"./_is-object":36,"./_meta":44,"./_object-dp":47,"./_redefine-all":53,"./_set-to-string-tag":56}],18:[function(_dereq_,module,exports){
'use strict';

var core = module.exports = { version: '2.4.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],19:[function(_dereq_,module,exports){
'use strict';

// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":4}],20:[function(_dereq_,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(_dereq_,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":25}],22:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object'),
    document = _dereq_('./_global').document
// in old IE typeof document.createElement is 'object'
,
    is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":27,"./_is-object":36}],23:[function(_dereq_,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],24:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    core = _dereq_('./_core'),
    ctx = _dereq_('./_ctx'),
    hide = _dereq_('./_hide'),
    PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      IS_WRAP = type & $export.W,
      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
      expProto = exports[PROTOTYPE],
      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
      key,
      own,
      out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global
    // wrap global constructors for prevent change them in library
    ) : IS_WRAP && target[key] == out ? function (C) {
      var F = function F(a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();
            case 1:
              return new C(a);
            case 2:
              return new C(a, b);
          }return new C(a, b, c);
        }return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
      // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(_dereq_,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],26:[function(_dereq_,module,exports){
'use strict';

var ctx = _dereq_('./_ctx'),
    call = _dereq_('./_iter-call'),
    isArrayIter = _dereq_('./_is-array-iter'),
    anObject = _dereq_('./_an-object'),
    toLength = _dereq_('./_to-length'),
    getIterFn = _dereq_('./core.get-iterator-method'),
    BREAK = {},
    RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable),
      f = ctx(fn, that, entries ? 2 : 1),
      index = 0,
      length,
      step,
      iterator,
      result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;

},{"./_an-object":7,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":37,"./_to-length":65,"./core.get-iterator-method":70}],27:[function(_dereq_,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],28:[function(_dereq_,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],29:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp'),
    createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":47,"./_property-desc":52}],30:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./_global').document && document.documentElement;

},{"./_global":27}],31:[function(_dereq_,module,exports){
'use strict';

module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(_dereq_,module,exports){
"use strict";

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

},{}],33:[function(_dereq_,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],34:[function(_dereq_,module,exports){
'use strict';

// check on default Array iterator
var Iterators = _dereq_('./_iterators'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":42,"./_wks":69}],35:[function(_dereq_,module,exports){
'use strict';

// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],36:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],37:[function(_dereq_,module,exports){
'use strict';

// call something on iterator step with safe closing on error
var anObject = _dereq_('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":7}],38:[function(_dereq_,module,exports){
'use strict';

var create = _dereq_('./_object-create'),
    descriptor = _dereq_('./_property-desc'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":29,"./_object-create":46,"./_property-desc":52,"./_set-to-string-tag":56,"./_wks":69}],39:[function(_dereq_,module,exports){
'use strict';

var LIBRARY = _dereq_('./_library'),
    $export = _dereq_('./_export'),
    redefine = _dereq_('./_redefine'),
    hide = _dereq_('./_hide'),
    has = _dereq_('./_has'),
    Iterators = _dereq_('./_iterators'),
    $iterCreate = _dereq_('./_iter-create'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    getPrototypeOf = _dereq_('./_object-gpo'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
,
    FF_ITERATOR = '@@iterator',
    KEYS = 'keys',
    VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator',
      DEF_VALUES = DEFAULT == VALUES,
      VALUES_BUG = false,
      proto = Base.prototype,
      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
      $default = $native || getMethod(DEFAULT),
      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
      methods,
      key,
      IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":38,"./_iterators":42,"./_library":43,"./_object-gpo":49,"./_redefine":54,"./_set-to-string-tag":56,"./_wks":69}],40:[function(_dereq_,module,exports){
'use strict';

var ITERATOR = _dereq_('./_wks')('iterator'),
    SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7],
        iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":69}],41:[function(_dereq_,module,exports){
"use strict";

module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],42:[function(_dereq_,module,exports){
"use strict";

module.exports = {};

},{}],43:[function(_dereq_,module,exports){
"use strict";

module.exports = true;

},{}],44:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var META = _dereq_('./_uid')('meta'),
    isObject = _dereq_('./_is-object'),
    has = _dereq_('./_has'),
    setDesc = _dereq_('./_object-dp').f,
    id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_dereq_('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":25,"./_has":28,"./_is-object":36,"./_object-dp":47,"./_uid":68}],45:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    macrotask = _dereq_('./_task').set,
    Observer = global.MutationObserver || global.WebKitMutationObserver,
    process = global.process,
    Promise = global.Promise,
    isNode = _dereq_('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

},{"./_cof":14,"./_global":27,"./_task":61}],46:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = _dereq_('./_an-object'),
    dPs = _dereq_('./_object-dps'),
    enumBugKeys = _dereq_('./_enum-bug-keys'),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO'),
    Empty = function Empty() {/* empty */},
    PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe'),
      i = enumBugKeys.length,
      lt = '<',
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":48,"./_shared-key":57}],47:[function(_dereq_,module,exports){
'use strict';

var anObject = _dereq_('./_an-object'),
    IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define'),
    toPrimitive = _dereq_('./_to-primitive'),
    dP = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":67}],48:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp'),
    anObject = _dereq_('./_an-object'),
    getKeys = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties),
      length = keys.length,
      i = 0,
      P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_object-dp":47,"./_object-keys":51}],49:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = _dereq_('./_has'),
    toObject = _dereq_('./_to-object'),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO'),
    ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":28,"./_shared-key":57,"./_to-object":66}],50:[function(_dereq_,module,exports){
'use strict';

var has = _dereq_('./_has'),
    toIObject = _dereq_('./_to-iobject'),
    arrayIndexOf = _dereq_('./_array-includes')(false),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":9,"./_has":28,"./_shared-key":57,"./_to-iobject":64}],51:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal'),
    enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":50}],52:[function(_dereq_,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],53:[function(_dereq_,module,exports){
'use strict';

var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
  }return target;
};

},{"./_hide":29}],54:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./_hide');

},{"./_hide":29}],55:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    core = _dereq_('./_core'),
    dP = _dereq_('./_object-dp'),
    DESCRIPTORS = _dereq_('./_descriptors'),
    SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":47,"./_wks":69}],56:[function(_dereq_,module,exports){
'use strict';

var def = _dereq_('./_object-dp').f,
    has = _dereq_('./_has'),
    TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":28,"./_object-dp":47,"./_wks":69}],57:[function(_dereq_,module,exports){
'use strict';

var shared = _dereq_('./_shared')('keys'),
    uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":58,"./_uid":68}],58:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    SHARED = '__core-js_shared__',
    store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":27}],59:[function(_dereq_,module,exports){
'use strict';

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object'),
    aFunction = _dereq_('./_a-function'),
    SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor,
      S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":4,"./_an-object":7,"./_wks":69}],60:[function(_dereq_,module,exports){
'use strict';

var toInteger = _dereq_('./_to-integer'),
    defined = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that)),
        i = toInteger(pos),
        l = s.length,
        a,
        b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":63}],61:[function(_dereq_,module,exports){
'use strict';

var ctx = _dereq_('./_ctx'),
    invoke = _dereq_('./_invoke'),
    html = _dereq_('./_html'),
    cel = _dereq_('./_dom-create'),
    global = _dereq_('./_global'),
    process = global.process,
    setTask = global.setImmediate,
    clearTask = global.clearImmediate,
    MessageChannel = global.MessageChannel,
    counter = 0,
    queue = {},
    ONREADYSTATECHANGE = 'onreadystatechange',
    defer,
    channel,
    port;
var run = function run() {
  var id = +this;
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_dereq_('./_cof')(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],62:[function(_dereq_,module,exports){
'use strict';

var toInteger = _dereq_('./_to-integer'),
    max = Math.max,
    min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":63}],63:[function(_dereq_,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil,
    floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],64:[function(_dereq_,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject'),
    defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":33}],65:[function(_dereq_,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer'),
    min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":63}],66:[function(_dereq_,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],67:[function(_dereq_,module,exports){
'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = _dereq_('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":36}],68:[function(_dereq_,module,exports){
'use strict';

var id = 0,
    px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],69:[function(_dereq_,module,exports){
'use strict';

var store = _dereq_('./_shared')('wks'),
    uid = _dereq_('./_uid'),
    _Symbol = _dereq_('./_global').Symbol,
    USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":27,"./_shared":58,"./_uid":68}],70:[function(_dereq_,module,exports){
'use strict';

var classof = _dereq_('./_classof'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":18,"./_iterators":42,"./_wks":69}],71:[function(_dereq_,module,exports){
'use strict';

var addToUnscopables = _dereq_('./_add-to-unscopables'),
    step = _dereq_('./_iter-step'),
    Iterators = _dereq_('./_iterators'),
    toIObject = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t,
      kind = this._k,
      index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":5,"./_iter-define":39,"./_iter-step":41,"./_iterators":42,"./_to-iobject":64}],72:[function(_dereq_,module,exports){
'use strict';

var strong = _dereq_('./_collection-strong');

// 23.1 Map Objects
module.exports = _dereq_('./_collection')('Map', function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":17,"./_collection-strong":15}],73:[function(_dereq_,module,exports){
"use strict";

},{}],74:[function(_dereq_,module,exports){
'use strict';

var LIBRARY = _dereq_('./_library'),
    global = _dereq_('./_global'),
    ctx = _dereq_('./_ctx'),
    classof = _dereq_('./_classof'),
    $export = _dereq_('./_export'),
    isObject = _dereq_('./_is-object'),
    aFunction = _dereq_('./_a-function'),
    anInstance = _dereq_('./_an-instance'),
    forOf = _dereq_('./_for-of'),
    speciesConstructor = _dereq_('./_species-constructor'),
    task = _dereq_('./_task').set,
    microtask = _dereq_('./_microtask')(),
    PROMISE = 'Promise',
    TypeError = global.TypeError,
    process = global.process,
    $Promise = global[PROMISE],
    process = global.process,
    isNode = classof(process) == 'process',
    empty = function empty() {/* empty */},
    Internal,
    GenericPromiseCapability,
    Wrapper;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[_dereq_('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = _dereq_('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
_dereq_('./_set-to-string-tag')($Promise, PROMISE);
_dereq_('./_set-species')(PROMISE);
Wrapper = _dereq_('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});

},{"./_a-function":4,"./_an-instance":6,"./_classof":13,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":36,"./_iter-detect":40,"./_library":43,"./_microtask":45,"./_redefine-all":53,"./_set-species":55,"./_set-to-string-tag":56,"./_species-constructor":59,"./_task":61,"./_wks":69}],75:[function(_dereq_,module,exports){
'use strict';

var strong = _dereq_('./_collection-strong');

// 23.2 Set Objects
module.exports = _dereq_('./_collection')('Set', function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":17,"./_collection-strong":15}],76:[function(_dereq_,module,exports){
'use strict';

var $at = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t,
      index = this._i,
      point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":39,"./_string-at":60}],77:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Map', { toJSON: _dereq_('./_collection-to-json')('Map') });

},{"./_collection-to-json":16,"./_export":24}],78:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Set', { toJSON: _dereq_('./_collection-to-json')('Set') });

},{"./_collection-to-json":16,"./_export":24}],79:[function(_dereq_,module,exports){
'use strict';

_dereq_('./es6.array.iterator');
var global = _dereq_('./_global'),
    hide = _dereq_('./_hide'),
    Iterators = _dereq_('./_iterators'),
    TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
  var NAME = collections[i],
      Collection = global[NAME],
      proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":27,"./_hide":29,"./_iterators":42,"./_wks":69,"./es6.array.iterator":71}],80:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],81:[function(_dereq_,module,exports){
"use strict";

var Attribute = function () {
    function Attribute() {}
    Attribute.QUALIFIER_PROPERTY = "qualifier";
    Attribute.VALUE = "value";
    return Attribute;
}();
exports.__esModule = true;
exports["default"] = Attribute;



},{}],82:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var ChangeAttributeMetadataCommand = function (_super) {
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
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = ChangeAttributeMetadataCommand;



},{"./Command":89}],83:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var EventBus_1 = _dereq_('./EventBus');
var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new EventBus_1["default"]();
        this.qualifierChangeBus = new EventBus_1["default"]();
        this.setValue(value);
        this.setQualifier(qualifier);
    }
    /** a copy constructor with new id and no presentation model */
    ClientAttribute.prototype.copy = function () {
        var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
        return result;
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
        if (this.value == verifiedValue) return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
    };
    ClientAttribute.prototype.setQualifier = function (newQualifier) {
        if (this.qualifier == newQualifier) return;
        var oldQualifier = this.qualifier;
        this.qualifier = newQualifier;
        this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
    };
    ClientAttribute.prototype.getQualifier = function () {
        return this.qualifier;
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
        if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result === "undefined" ? "undefined" : _typeof(result)) > -1 || result instanceof Date) {
            ok = true;
        }
        if (!ok) {
            throw new Error("Attribute values of this type are not allowed: " + (typeof value === "undefined" ? "undefined" : _typeof(value)));
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
    ClientAttribute.prototype.syncWith = function (sourceAttribute) {
        if (sourceAttribute) {
            this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
            this.setValue(sourceAttribute.value);
        }
    };
    ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
    ClientAttribute.clientAttributeInstanceCount = 0;
    return ClientAttribute;
}();
exports.ClientAttribute = ClientAttribute;



},{"./EventBus":97}],84:[function(_dereq_,module,exports){
"use strict";

var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");
var Codec_1 = _dereq_("./Codec");
var CommandBatcher_1 = _dereq_("./CommandBatcher");
var ClientConnector = function () {
    function ClientConnector(transmitter, clientDolphin, slackMS, maxBatchSize) {
        if (slackMS === void 0) {
            slackMS = 0;
        }
        if (maxBatchSize === void 0) {
            maxBatchSize = 50;
        }
        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new Codec_1["default"]();
        this.commandBatcher = new CommandBatcher_1.BlindCommandBatcher(true, maxBatchSize);
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
            } else {
                this.currentlySending = false;
                return;
            }
        }
        this.currentlySending = true;
        var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);
        var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
        var commands = cmdsAndHandlers.map(function (cah) {
            return cah.command;
        });
        this.transmitter.transmit(commands, function (response) {
            //console.log("server response: [" + response.map(it => it.id).join(", ") + "] ");
            var touchedPMs = [];
            response.forEach(function (command) {
                var touched = _this.handle(command);
                if (touched) touchedPMs.push(touched);
            });
            if (callback) {
                callback.onFinished(touchedPMs); // todo: make them unique?
            }
            // recursive call: fetch the next in line but allow a bit of slack such that
            // document events can fire, rendering is done and commands can batch up
            setTimeout(function () {
                return _this.doSendNext();
            }, _this.slackMS);
        });
    };
    ClientConnector.prototype.handle = function (command) {
        if (command.id == "DeletePresentationModel") {
            return this.handleDeletePresentationModelCommand(command);
        } else if (command.id == "CreatePresentationModel") {
            return this.handleCreatePresentationModelCommand(command);
        } else if (command.id == "ValueChanged") {
            return this.handleValueChangedCommand(command);
        } else if (command.id == "AttributeMetadataChanged") {
            return this.handleAttributeMetadataChangedCommand(command);
        } else {
            console.log("Cannot handle, unknown command " + command);
        }
        return null;
    };
    ClientConnector.prototype.handleDeletePresentationModelCommand = function (serverCommand) {
        var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
        if (!model) return null;
        this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
        return model;
    };
    ClientConnector.prototype.handleCreatePresentationModelCommand = function (serverCommand) {
        var _this = this;
        if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
            throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
        }
        var attributes = [];
        serverCommand.attributes.forEach(function (attr) {
            var clientAttribute = _this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
            if (attr.id && attr.id.match(".*S$")) {
                clientAttribute.id = attr.id;
            }
            attributes.push(clientAttribute);
        });
        var clientPm = new ClientPresentationModel_1.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
        clientPm.addAttributes(attributes);
        if (serverCommand.clientSideOnly) {
            clientPm.clientSideOnly = true;
        }
        this.clientDolphin.getClientModelStore().add(clientPm);
        this.clientDolphin.updatePresentationModelQualifier(clientPm);
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
    ClientConnector.prototype.handleAttributeMetadataChangedCommand = function (serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute) return null;
        clientAttribute[serverCommand.metadataName] = serverCommand.value;
        return null;
    };
    ///////////// push support ///////////////
    ClientConnector.prototype.listen = function () {
        if (!this.pushEnabled) return;
        if (this.waiting) return;
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
                onFinished: function onFinished(models) {
                    me.waiting = false;
                },
                onFinishedData: null
            }
        });
    };
    ClientConnector.prototype.release = function () {
        if (!this.waiting) return;
        this.waiting = false;
        // todo: how to issue a warning if no releaseCommand is set?
        this.transmitter.signal(this.releaseCommand);
    };
    return ClientConnector;
}();
exports.ClientConnector = ClientConnector;



},{"./ClientPresentationModel":87,"./Codec":88,"./CommandBatcher":90}],85:[function(_dereq_,module,exports){
"use strict";

var ClientAttribute_1 = _dereq_("./ClientAttribute");
var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");
var ClientDolphin = function () {
    function ClientDolphin() {}
    ClientDolphin.prototype.setClientConnector = function (clientConnector) {
        this.clientConnector = clientConnector;
    };
    ClientDolphin.prototype.getClientConnector = function () {
        return this.clientConnector;
    };
    ClientDolphin.prototype.send = function (command, onFinished) {
        this.clientConnector.send(command, onFinished);
    };
    // factory method for attributes
    ClientDolphin.prototype.attribute = function (propertyName, qualifier, value) {
        return new ClientAttribute_1.ClientAttribute(propertyName, qualifier, value);
    };
    // factory method for presentation models
    ClientDolphin.prototype.presentationModel = function (id, type) {
        var attributes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            attributes[_i - 2] = arguments[_i];
        }
        var model = new ClientPresentationModel_1.ClientPresentationModel(id, type);
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
    ClientDolphin.prototype.updatePresentationModelQualifier = function (presentationModel) {
        var _this = this;
        presentationModel.getAttributes().forEach(function (sourceAttribute) {
            _this.updateAttributeQualifier(sourceAttribute);
        });
    };
    ClientDolphin.prototype.updateAttributeQualifier = function (sourceAttribute) {
        if (!sourceAttribute.getQualifier()) return;
        var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
        attributes.forEach(function (targetAttribute) {
            targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
        });
    };
    ////// push support ///////
    ClientDolphin.prototype.startPushListening = function (pushCommand, releaseCommand) {
        this.clientConnector.setPushListener(pushCommand);
        this.clientConnector.setReleaseCommand(releaseCommand);
        this.clientConnector.setPushEnabled(true);
        this.clientConnector.listen();
    };
    ClientDolphin.prototype.stopPushListening = function () {
        this.clientConnector.setPushEnabled(false);
    };
    return ClientDolphin;
}();
exports.__esModule = true;
exports["default"] = ClientDolphin;



},{"./ClientAttribute":83,"./ClientPresentationModel":87}],86:[function(_dereq_,module,exports){
/// <reference path="./core-js.d.ts" />
"use strict";

var Attribute_1 = _dereq_("./Attribute");
var ChangeAttributeMetadataCommand_1 = _dereq_("./ChangeAttributeMetadataCommand");
var CreatePresentationModelCommand_1 = _dereq_("./CreatePresentationModelCommand");
var DeletedPresentationModelNotification_1 = _dereq_("./DeletedPresentationModelNotification");
var EventBus_1 = _dereq_("./EventBus");
var ValueChangedCommand_1 = _dereq_("./ValueChangedCommand");
(function (Type) {
    Type[Type["ADDED"] = 'ADDED'] = "ADDED";
    Type[Type["REMOVED"] = 'REMOVED'] = "REMOVED";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
var ClientModelStore = function () {
    function ClientModelStore(clientDolphin) {
        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new EventBus_1["default"]();
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
        var createPMCommand = new CreatePresentationModelCommand_1["default"](model);
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
            var valueChangeCommand = new ValueChangedCommand_1["default"](attribute.id, evt.oldValue, evt.newValue);
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
        attribute.onQualifierChange(function (evt) {
            var changeAttrMetadataCmd = new ChangeAttributeMetadataCommand_1["default"](attribute.id, Attribute_1["default"].QUALIFIER_PROPERTY, evt.newValue);
            _this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
        });
    };
    ClientModelStore.prototype.add = function (model) {
        if (!model) {
            return false;
        }
        if (this.presentationModels.has(model.id)) {
            console.log("There already is a PM with id " + model.id);
        }
        var added = false;
        if (!this.presentationModels.has(model.id)) {
            this.presentationModels.set(model.id, model);
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
        if (this.presentationModels.has(model.id)) {
            this.removePresentationModelByType(model);
            this.presentationModels.delete(model.id);
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
        this.presentationModels.forEach(function (model) {
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
            this.presentationModelsPerType.set(type, presentationModels);
        }
        if (!(presentationModels.indexOf(model) > -1)) {
            presentationModels.push(model);
        }
    };
    ClientModelStore.prototype.removePresentationModelByType = function (model) {
        if (!model || !model.presentationModelType) {
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
            this.presentationModelsPerType.delete(model.presentationModelType);
        }
    };
    ClientModelStore.prototype.listPresentationModelIds = function () {
        var result = [];
        var iter = this.presentationModels.keys();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    };
    ClientModelStore.prototype.listPresentationModels = function () {
        var result = [];
        var iter = this.presentationModels.values();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    };
    ClientModelStore.prototype.findPresentationModelById = function (id) {
        return this.presentationModels.get(id);
    };
    ClientModelStore.prototype.findAllPresentationModelByType = function (type) {
        if (!type || !this.presentationModelsPerType.has(type)) {
            return [];
        }
        return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
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
            this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification_1["default"](model.id), null);
        }
    };
    ClientModelStore.prototype.containsPresentationModel = function (id) {
        return this.presentationModels.has(id);
    };
    ClientModelStore.prototype.addAttributeById = function (attribute) {
        if (!attribute || this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.set(attribute.id, attribute);
    };
    ClientModelStore.prototype.removeAttributeById = function (attribute) {
        if (!attribute || !this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.delete(attribute.id);
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
            this.attributesPerQualifier.set(attribute.getQualifier(), attributes);
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
            this.attributesPerQualifier.delete(attribute.getQualifier());
        }
    };
    ClientModelStore.prototype.findAllAttributesByQualifier = function (qualifier) {
        if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
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
}();
exports.ClientModelStore = ClientModelStore;



},{"./Attribute":81,"./ChangeAttributeMetadataCommand":82,"./CreatePresentationModelCommand":93,"./DeletedPresentationModelNotification":94,"./EventBus":97,"./ValueChangedCommand":104}],87:[function(_dereq_,module,exports){
"use strict";

var EventBus_1 = _dereq_('./EventBus');
var presentationModelInstanceCount = 0; // todo dk: consider making this static in class
var ClientPresentationModel = function () {
    function ClientPresentationModel(id, presentationModelType) {
        this.id = id;
        this.presentationModelType = presentationModelType;
        this.attributes = [];
        this.clientSideOnly = false;
        this.dirty = false;
        if (typeof id !== 'undefined' && id != null) {
            this.id = id;
        } else {
            this.id = (presentationModelInstanceCount++).toString();
        }
        this.invalidBus = new EventBus_1["default"]();
        this.dirtyValueChangeBus = new EventBus_1["default"]();
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
        if (!attributes || attributes.length < 1) return;
        attributes.forEach(function (attr) {
            _this.addAttribute(attr);
        });
    };
    ClientPresentationModel.prototype.addAttribute = function (attribute) {
        var _this = this;
        if (!attribute || this.attributes.indexOf(attribute) > -1) {
            return;
        }
        if (this.findAttributeByPropertyName(attribute.propertyName)) {
            throw new Error("There already is an attribute with property name: " + attribute.propertyName + " in presentation model with id: " + this.id);
        }
        if (attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())) {
            throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier() + " in presentation model with id: " + this.id);
        }
        attribute.setPresentationModel(this);
        this.attributes.push(attribute);
        attribute.onValueChange(function (evt) {
            _this.invalidBus.trigger({ source: _this });
        });
    };
    ClientPresentationModel.prototype.onInvalidated = function (handleInvalidate) {
        this.invalidBus.onEvent(handleInvalidate);
    };
    /** returns a copy of the internal state */
    ClientPresentationModel.prototype.getAttributes = function () {
        return this.attributes.slice(0);
    };
    ClientPresentationModel.prototype.getAt = function (propertyName) {
        return this.findAttributeByPropertyName(propertyName);
    };
    ClientPresentationModel.prototype.findAllAttributesByPropertyName = function (propertyName) {
        var result = [];
        if (!propertyName) return null;
        this.attributes.forEach(function (attribute) {
            if (attribute.propertyName == propertyName) {
                result.push(attribute);
            }
        });
        return result;
    };
    ClientPresentationModel.prototype.findAttributeByPropertyName = function (propertyName) {
        if (!propertyName) return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].propertyName == propertyName) {
                return this.attributes[i];
            }
        }
        return null;
    };
    ClientPresentationModel.prototype.findAttributeByQualifier = function (qualifier) {
        if (!qualifier) return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getQualifier() == qualifier) {
                return this.attributes[i];
            }
        }
        ;
        return null;
    };
    ClientPresentationModel.prototype.findAttributeById = function (id) {
        if (!id) return null;
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
            var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
            if (sourceAttribute) {
                targetAttribute.syncWith(sourceAttribute);
            }
        });
    };
    return ClientPresentationModel;
}();
exports.ClientPresentationModel = ClientPresentationModel;



},{"./EventBus":97}],88:[function(_dereq_,module,exports){
"use strict";

var Codec = function () {
    function Codec() {}
    Codec.prototype.encode = function (commands) {
        return JSON.stringify(commands); // todo dk: look for possible API support for character encoding
    };
    Codec.prototype.decode = function (transmitted) {
        if (typeof transmitted == 'string') {
            return JSON.parse(transmitted);
        } else {
            return transmitted;
        }
    };
    return Codec;
}();
exports.__esModule = true;
exports["default"] = Codec;



},{}],89:[function(_dereq_,module,exports){
"use strict";

var Command = function () {
    function Command() {
        this.id = "dolphin-core-command";
    }
    return Command;
}();
exports.__esModule = true;
exports["default"] = Command;



},{}],90:[function(_dereq_,module,exports){
"use strict";

var ValueChangedCommand_1 = _dereq_('./ValueChangedCommand');
/** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
var NoCommandBatcher = function () {
    function NoCommandBatcher() {}
    NoCommandBatcher.prototype.batch = function (queue) {
        return [queue.shift()];
    };
    return NoCommandBatcher;
}();
exports.NoCommandBatcher = NoCommandBatcher;
/** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
var BlindCommandBatcher = function () {
    /** folding: whether we should try folding ValueChangedCommands */
    function BlindCommandBatcher(folding, maxBatchSize) {
        if (folding === void 0) {
            folding = true;
        }
        if (maxBatchSize === void 0) {
            maxBatchSize = 50;
        }
        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }
    BlindCommandBatcher.prototype.batch = function (queue) {
        var batch = [];
        var n = Math.min(queue.length, this.maxBatchSize);
        for (var counter = 0; counter < n; counter++) {
            var candidate = queue.shift();
            if (this.folding && candidate.command instanceof ValueChangedCommand_1["default"] && !candidate.handler) {
                var found = null;
                var canCmd = candidate.command;
                for (var i = 0; i < batch.length && found == null; i++) {
                    if (batch[i].command instanceof ValueChangedCommand_1["default"]) {
                        var batchCmd = batch[i].command;
                        if (canCmd.attributeId == batchCmd.attributeId && batchCmd.newValue == canCmd.oldValue) {
                            found = batchCmd;
                        }
                    }
                }
                if (found) {
                    found.newValue = canCmd.newValue; // change existing value, do not batch
                } else {
                    batch.push(candidate); // we cannot merge, so batch the candidate
                }
            } else {
                batch.push(candidate);
            }
            if (candidate.handler || candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification" // or unknown client side effect
            ) {
                    break; // leave the loop
                }
        }
        return batch;
    };
    return BlindCommandBatcher;
}();
exports.BlindCommandBatcher = BlindCommandBatcher;



},{"./ValueChangedCommand":104}],91:[function(_dereq_,module,exports){
"use strict";

var CommandConstants = function () {
    function CommandConstants() {}
    CommandConstants.DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
    CommandConstants.CREATE_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
    CommandConstants.DESTROY_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';
    CommandConstants.CREATE_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'registerController';
    CommandConstants.DESTROY_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'destroyController';
    CommandConstants.CALL_CONTROLLER_ACTION_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
    CommandConstants.START_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'longPoll';
    CommandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'release';
    return CommandConstants;
}();
exports.__esModule = true;
exports["default"] = CommandConstants;



},{}],92:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CommandConstants_1 = _dereq_("./CommandConstants");
var CreateContextCommand = function (_super) {
    __extends(CreateContextCommand, _super);
    function CreateContextCommand() {
        _super.call(this);
        this.id = CommandConstants_1["default"].CREATE_CONTEXT_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.CreateContextCommand";
    }
    return CreateContextCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = CreateContextCommand;



},{"./Command":89,"./CommandConstants":91}],93:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CreatePresentationModelCommand = function (_super) {
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
                value: attr.getValue()
            });
        });
    }
    return CreatePresentationModelCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = CreatePresentationModelCommand;



},{"./Command":89}],94:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var DeletedPresentationModelNotification = function (_super) {
    __extends(DeletedPresentationModelNotification, _super);
    function DeletedPresentationModelNotification(pmId) {
        _super.call(this);
        this.pmId = pmId;
        this.id = 'DeletedPresentationModel';
        this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
    }
    return DeletedPresentationModelNotification;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = DeletedPresentationModelNotification;



},{"./Command":89}],95:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CommandConstants_1 = _dereq_("./CommandConstants");
var DestroyContextCommand = function (_super) {
    __extends(DestroyContextCommand, _super);
    function DestroyContextCommand() {
        _super.call(this);
        this.id = CommandConstants_1["default"].DESTROY_CONTEXT_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.DestroyContextCommand";
    }
    return DestroyContextCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = DestroyContextCommand;



},{"./Command":89,"./CommandConstants":91}],96:[function(_dereq_,module,exports){
"use strict";

var ClientConnector_1 = _dereq_("./ClientConnector");
var ClientDolphin_1 = _dereq_("./ClientDolphin");
var ClientModelStore_1 = _dereq_("./ClientModelStore");
var HttpTransmitter_1 = _dereq_("./HttpTransmitter");
var NoTransmitter_1 = _dereq_("./NoTransmitter");
var DolphinBuilder = function () {
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
    DolphinBuilder.prototype.headersInfo = function (headersInfo) {
        this.headersInfo_ = headersInfo;
        return this;
    };
    DolphinBuilder.prototype.build = function () {
        console.log("OpenDolphin js found");
        var clientDolphin = new ClientDolphin_1["default"]();
        var transmitter;
        if (this.url_ != null && this.url_.length > 0) {
            transmitter = new HttpTransmitter_1["default"](this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
        } else {
            transmitter = new NoTransmitter_1["default"]();
        }
        clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
        clientDolphin.setClientModelStore(new ClientModelStore_1.ClientModelStore(clientDolphin));
        console.log("ClientDolphin initialized");
        return clientDolphin;
    };
    return DolphinBuilder;
}();
exports.__esModule = true;
exports["default"] = DolphinBuilder;



},{"./ClientConnector":84,"./ClientDolphin":85,"./ClientModelStore":86,"./HttpTransmitter":98,"./NoTransmitter":100}],97:[function(_dereq_,module,exports){
"use strict";

var EventBus = function () {
    function EventBus() {
        this.eventHandlers = [];
    }
    EventBus.prototype.onEvent = function (eventHandler) {
        this.eventHandlers.push(eventHandler);
    };
    EventBus.prototype.trigger = function (event) {
        this.eventHandlers.forEach(function (handle) {
            return handle(event);
        });
    };
    return EventBus;
}();
exports.__esModule = true;
exports["default"] = EventBus;



},{}],98:[function(_dereq_,module,exports){
"use strict";

var Codec_1 = _dereq_("./Codec");
var HttpTransmitter = function () {
    function HttpTransmitter(url, reset, charset, errorHandler, supportCORS, headersInfo) {
        if (reset === void 0) {
            reset = true;
        }
        if (charset === void 0) {
            charset = "UTF-8";
        }
        if (errorHandler === void 0) {
            errorHandler = null;
        }
        if (supportCORS === void 0) {
            supportCORS = false;
        }
        if (headersInfo === void 0) {
            headersInfo = null;
        }
        this.url = url;
        this.charset = charset;
        this.HttpCodes = {
            finished: 4,
            success: 200
        };
        this.errorHandler = errorHandler;
        this.supportCORS = supportCORS;
        this.headersInfo = headersInfo;
        this.http = new XMLHttpRequest();
        this.sig = new XMLHttpRequest();
        if (this.supportCORS) {
            if ("withCredentials" in this.http) {
                this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
                this.sig.withCredentials = true;
            }
        }
        this.codec = new Codec_1["default"]();
        if (reset) {
            console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
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
                        } catch (err) {
                            console.log("Error occurred parsing responseText: ", err);
                            console.log("Incorrect responseText: ", responseText);
                            _this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                            onDone([]);
                        }
                    } else {
                        _this.handleError('application', "HttpTransmitter: empty responseText");
                        onDone([]);
                    }
                } else {
                    _this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                    onDone([]);
                }
            }
        };
        this.http.open('POST', this.url, true);
        this.setHeaders(this.http);
        if ("overrideMimeType" in this.http) {
            this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
        }
        this.http.send(this.codec.encode(commands));
    };
    HttpTransmitter.prototype.setHeaders = function (httpReq) {
        if (this.headersInfo) {
            for (var i in this.headersInfo) {
                if (this.headersInfo.hasOwnProperty(i)) {
                    httpReq.setRequestHeader(i, this.headersInfo[i]);
                }
            }
        }
    };
    HttpTransmitter.prototype.handleError = function (kind, message) {
        var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
        if (this.errorHandler) {
            this.errorHandler(errorEvent);
        } else {
            console.log("Error occurred: ", errorEvent);
        }
    };
    HttpTransmitter.prototype.signal = function (command) {
        this.sig.open('POST', this.url, true);
        this.setHeaders(this.sig);
        this.sig.send(this.codec.encode([command]));
    };
    // Deprecated ! Use 'reset(OnSuccessHandler) instead
    HttpTransmitter.prototype.invalidate = function () {
        this.http.open('POST', this.url + 'invalidate?', false);
        this.http.send();
    };
    return HttpTransmitter;
}();
exports.__esModule = true;
exports["default"] = HttpTransmitter;



},{"./Codec":88}],99:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SignalCommand_1 = _dereq_("./SignalCommand");
var CommandConstants_1 = _dereq_("./CommandConstants");
var InterruptLongPollCommand = function (_super) {
    __extends(InterruptLongPollCommand, _super);
    function InterruptLongPollCommand() {
        _super.call(this, CommandConstants_1["default"].INTERRUPT_LONG_POLL_COMMAND_NAME);
        this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
    }
    return InterruptLongPollCommand;
}(SignalCommand_1["default"]);
exports.__esModule = true;
exports["default"] = InterruptLongPollCommand;



},{"./CommandConstants":91,"./SignalCommand":102}],100:[function(_dereq_,module,exports){
"use strict";
/**
 * A transmitter that is not transmitting at all.
 * It may serve as a stand-in when no real transmitter is needed.
 */

var NoTransmitter = function () {
    function NoTransmitter() {}
    NoTransmitter.prototype.transmit = function (commands, onDone) {
        // do nothing special
        onDone([]);
    };
    NoTransmitter.prototype.signal = function (command) {
        // do nothing
    };
    NoTransmitter.prototype.reset = function (successHandler) {
        // do nothing
    };
    return NoTransmitter;
}();
exports.__esModule = true;
exports["default"] = NoTransmitter;



},{}],101:[function(_dereq_,module,exports){
"use strict";

var DolphinBuilder_1 = _dereq_("./DolphinBuilder");
var CreateContextCommand_1 = _dereq_("./CreateContextCommand");
var DestroyContextCommand_1 = _dereq_("./DestroyContextCommand");
var InterruptLongPollCommand_1 = _dereq_("./InterruptLongPollCommand");
var StartLongPollCommand_1 = _dereq_("./StartLongPollCommand");
/**
 * JS-friendly facade to avoid too many dependencies in plain JS code.
 * The name of this file is also used for the initial lookup of the
 * one javascript file that contains all the dolphin code.
 * Changing the name requires the build support and all users
 * to be updated as well.
 * Dierk Koenig
 */
// factory method for the initialized dolphin
// Deprecated ! Use 'makeDolphin() instead
function dolphin(url, reset, slackMS) {
    if (slackMS === void 0) {
        slackMS = 300;
    }
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}
exports.dolphin = dolphin;
// factory method to build an initialized dolphin
function makeDolphin() {
    return new DolphinBuilder_1["default"]();
}
exports.makeDolphin = makeDolphin;
//Factory methods to have a better integration of ts sources in JS & es6
function createCreateContextCommand() {
    return new CreateContextCommand_1["default"]();
}
exports.createCreateContextCommand = createCreateContextCommand;
function createDestroyContextCommand() {
    return new DestroyContextCommand_1["default"]();
}
exports.createDestroyContextCommand = createDestroyContextCommand;
function createInterruptLongPollCommand() {
    return new InterruptLongPollCommand_1["default"]();
}
exports.createInterruptLongPollCommand = createInterruptLongPollCommand;
function createStartLongPollCommand() {
    return new StartLongPollCommand_1["default"]();
}
exports.createStartLongPollCommand = createStartLongPollCommand;



},{"./CreateContextCommand":92,"./DestroyContextCommand":95,"./DolphinBuilder":96,"./InterruptLongPollCommand":99,"./StartLongPollCommand":103}],102:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var SignalCommand = function (_super) {
    __extends(SignalCommand, _super);
    function SignalCommand(name) {
        _super.call(this);
        this.id = name;
        this.className = "org.opendolphin.core.comm.SignalCommand";
    }
    return SignalCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = SignalCommand;



},{"./Command":89}],103:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CommandConstants_1 = _dereq_("./CommandConstants");
var StartLongPollCommand = function (_super) {
    __extends(StartLongPollCommand, _super);
    function StartLongPollCommand() {
        _super.call(this);
        this.id = CommandConstants_1["default"].START_LONG_POLL_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
    return StartLongPollCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = StartLongPollCommand;



},{"./Command":89,"./CommandConstants":91}],104:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var ValueChangedCommand = function (_super) {
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
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = ValueChangedCommand;



},{"./Command":89}],105:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeanManager = function () {
    function BeanManager(classRepository) {
        _classCallCheck(this, BeanManager);

        (0, _utils2.checkMethod)('BeanManager(classRepository)');
        (0, _utils2.checkParam)(classRepository, 'classRepository');

        this.classRepository = classRepository;
        this.addedHandlers = new _map2.default();
        this.removedHandlers = new _map2.default();
        this.updatedHandlers = new _map2.default();
        this.arrayUpdatedHandlers = new _map2.default();
        this.allAddedHandlers = [];
        this.allRemovedHandlers = [];
        this.allUpdatedHandlers = [];
        this.allArrayUpdatedHandlers = [];

        var self = this;
        this.classRepository.onBeanAdded(function (type, bean) {
            var handlerList = self.addedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
                }
            });
        });
        this.classRepository.onBeanRemoved(function (type, bean) {
            var handlerList = self.removedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
                }
            });
        });
        this.classRepository.onBeanUpdate(function (type, bean, propertyName, newValue, oldValue) {
            var handlerList = self.updatedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean, propertyName, newValue, oldValue);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
                }
            });
        });
        this.classRepository.onArrayUpdate(function (type, bean, propertyName, index, count, newElements) {
            var handlerList = self.arrayUpdatedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean, propertyName, index, count, newElements);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });
    }

    _createClass(BeanManager, [{
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils2.checkMethod)('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');

            return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils2.checkMethod)('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');
            (0, _utils2.checkParam)(index, 'index');
            (0, _utils2.checkParam)(count, 'count');
            (0, _utils2.checkParam)(removedElements, 'removedElements');

            this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
        }
    }, {
        key: 'isManaged',
        value: function isManaged(bean) {
            (0, _utils2.checkMethod)('BeanManager.isManaged(bean)');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.isManaged() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'create',
        value: function create(type) {
            (0, _utils2.checkMethod)('BeanManager.create(type)');
            (0, _utils2.checkParam)(type, 'type');

            // TODO: Implement dolphin.create() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'add',
        value: function add(type, bean) {
            (0, _utils2.checkMethod)('BeanManager.add(type, bean)');
            (0, _utils2.checkParam)(type, 'type');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.add() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'addAll',
        value: function addAll(type, collection) {
            (0, _utils2.checkMethod)('BeanManager.addAll(type, collection)');
            (0, _utils2.checkParam)(type, 'type');
            (0, _utils2.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.addAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'remove',
        value: function remove(bean) {
            (0, _utils2.checkMethod)('BeanManager.remove(bean)');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.remove() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeAll',
        value: function removeAll(collection) {
            (0, _utils2.checkMethod)('BeanManager.removeAll(collection)');
            (0, _utils2.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.removeAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeIf',
        value: function removeIf(predicate) {
            (0, _utils2.checkMethod)('BeanManager.removeIf(predicate)');
            (0, _utils2.checkParam)(predicate, 'predicate');

            // TODO: Implement dolphin.removeIf() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'onAdded',
        value: function onAdded(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils2.checkMethod)('BeanManager.onAdded(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allAddedHandlers = self.allAddedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onAdded(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.addedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.addedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.addedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.addedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onRemoved',
        value: function onRemoved(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils2.checkMethod)('BeanManager.onRemoved(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allRemovedHandlers = self.allRemovedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onRemoved(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.removedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.removedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.removedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.removedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils2.checkMethod)('BeanManager.onBeanUpdate(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onBeanUpdate(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.updatedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.updatedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.updatedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.updatedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils2.checkMethod)('BeanManager.onArrayUpdate(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onArrayUpdate(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.arrayUpdatedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.arrayUpdatedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }]);

    return BeanManager;
}();

exports.default = BeanManager;

},{"../bower_components/core.js/library/fn/map":1,"./utils":121,"./utils.js":121}],106:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _constants = _dereq_('./constants');

var consts = _interopRequireWildcard(_constants);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blocked = null;

var ClassRepository = function () {
    function ClassRepository(dolphin) {
        _classCallCheck(this, ClassRepository);

        (0, _utils2.checkMethod)('ClassRepository(dolphin)');
        (0, _utils2.checkParam)(dolphin, 'dolphin');

        this.dolphin = dolphin;
        this.classes = new _map2.default();
        this.beanFromDolphin = new _map2.default();
        this.beanToDolphin = new _map2.default();
        this.classInfos = new _map2.default();
        this.beanAddedHandlers = [];
        this.beanRemovedHandlers = [];
        this.propertyUpdateHandlers = [];
        this.arrayUpdateHandlers = [];
    }

    _createClass(ClassRepository, [{
        key: 'fixType',
        value: function fixType(type, value) {
            switch (type) {
                case consts.BYTE:
                case consts.SHORT:
                case consts.INT:
                case consts.LONG:
                    return parseInt(value);
                case consts.FLOAT:
                case consts.DOUBLE:
                    return parseFloat(value);
                case consts.BOOLEAN:
                    return 'true' === String(value).toLowerCase();
                case consts.STRING:
                case consts.ENUM:
                    return String(value);
                default:
                    return value;
            }
        }
    }, {
        key: 'fromDolphin',
        value: function fromDolphin(classRepository, type, value) {
            if (!(0, _utils.exists)(value)) {
                return null;
            }
            switch (type) {
                case consts.DOLPHIN_BEAN:
                    return classRepository.beanFromDolphin.get(String(value));
                case consts.DATE:
                    return new Date(String(value));
                case consts.CALENDAR:
                    return new Date(String(value));
                case consts.LOCAL_DATE_FIELD_TYPE:
                    return new Date(String(value));
                case consts.LOCAL_DATE_TIME_FIELD_TYPE:
                    return new Date(String(value));
                case consts.ZONED_DATE_TIME_FIELD_TYPE:
                    return new Date(String(value));
                default:
                    return this.fixType(type, value);
            }
        }
    }, {
        key: 'toDolphin',
        value: function toDolphin(classRepository, type, value) {
            if (!(0, _utils.exists)(value)) {
                return null;
            }
            switch (type) {
                case consts.DOLPHIN_BEAN:
                    return classRepository.beanToDolphin.get(value);
                case consts.DATE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.CALENDAR:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.LOCAL_DATE_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.LOCAL_DATE_TIME_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.ZONED_DATE_TIME_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                default:
                    return this.fixType(type, value);
            }
        }
    }, {
        key: 'sendListSplice',
        value: function sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
            var dolphin = classRepository.dolphin;
            var model = dolphin.findPresentationModelById(modelId);
            var self = this;
            if ((0, _utils.exists)(model)) {
                var classInfo = classRepository.classes.get(model.presentationModelType);
                var type = classInfo[propertyName];
                if ((0, _utils.exists)(type)) {

                    var attributes = [dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'), dolphin.attribute('source', null, modelId), dolphin.attribute('attribute', null, propertyName), dolphin.attribute('from', null, from), dolphin.attribute('to', null, to), dolphin.attribute('count', null, newElements.length)];
                    newElements.forEach(function (element, index) {
                        attributes.push(dolphin.attribute(index.toString(), null, self.toDolphin(classRepository, type, element)));
                    });
                    dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
                }
            }
        }
    }, {
        key: 'validateList',
        value: function validateList(classRepository, type, bean, propertyName) {
            var list = bean[propertyName];
            if (!(0, _utils.exists)(list)) {
                classRepository.propertyUpdateHandlers.forEach(function (handler) {
                    try {
                        handler(type, bean, propertyName, [], undefined);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                    }
                });
            }
        }
    }, {
        key: 'block',
        value: function block(bean, propertyName) {
            if ((0, _utils.exists)(blocked)) {
                throw new Error('Trying to create a block while another block exists');
            }
            blocked = {
                bean: bean,
                propertyName: propertyName
            };
        }
    }, {
        key: 'isBlocked',
        value: function isBlocked(bean, propertyName) {
            return (0, _utils.exists)(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
        }
    }, {
        key: 'unblock',
        value: function unblock() {
            blocked = null;
        }
    }, {
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils2.checkMethod)('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');

            var modelId = this.beanToDolphin.get(bean);
            if ((0, _utils.exists)(modelId)) {
                var model = this.dolphin.findPresentationModelById(modelId);
                if ((0, _utils.exists)(model)) {
                    var classInfo = this.classes.get(model.presentationModelType);
                    var type = classInfo[propertyName];
                    var attribute = model.findAttributeByPropertyName(propertyName);
                    if ((0, _utils.exists)(type) && (0, _utils.exists)(attribute)) {
                        var oldValue = attribute.getValue();
                        attribute.setValue(this.toDolphin(this, type, newValue));
                        return this.fromDolphin(this, type, oldValue);
                    }
                }
            }
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils2.checkMethod)('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');
            (0, _utils2.checkParam)(index, 'index');
            (0, _utils2.checkParam)(count, 'count');
            (0, _utils2.checkParam)(removedElements, 'removedElements');

            if (this.isBlocked(bean, propertyName)) {
                return;
            }
            var modelId = this.beanToDolphin.get(bean);
            var array = bean[propertyName];
            if ((0, _utils.exists)(modelId) && (0, _utils.exists)(array)) {
                var removedElementsCount = Array.isArray(removedElements) ? removedElements.length : 0;
                this.sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
            }
        }
    }, {
        key: 'onBeanAdded',
        value: function onBeanAdded(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onBeanAdded(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.beanAddedHandlers.push(handler);
        }
    }, {
        key: 'onBeanRemoved',
        value: function onBeanRemoved(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onBeanRemoved(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.beanRemovedHandlers.push(handler);
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onBeanUpdate(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.propertyUpdateHandlers.push(handler);
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onArrayUpdate(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.arrayUpdateHandlers.push(handler);
        }
    }, {
        key: 'registerClass',
        value: function registerClass(model) {
            (0, _utils2.checkMethod)('ClassRepository.registerClass(model)');
            (0, _utils2.checkParam)(model, 'model');

            if (this.classes.has(model.id)) {
                return;
            }

            var classInfo = {};
            model.attributes.filter(function (attribute) {
                return attribute.propertyName.search(/^@/) < 0;
            }).forEach(function (attribute) {
                classInfo[attribute.propertyName] = attribute.value;
            });
            this.classes.set(model.id, classInfo);
        }
    }, {
        key: 'unregisterClass',
        value: function unregisterClass(model) {
            (0, _utils2.checkMethod)('ClassRepository.unregisterClass(model)');
            (0, _utils2.checkParam)(model, 'model');
            this.classes['delete'](model.id);
        }
    }, {
        key: 'load',
        value: function load(model) {
            (0, _utils2.checkMethod)('ClassRepository.load(model)');
            (0, _utils2.checkParam)(model, 'model');

            var self = this;
            var classInfo = this.classes.get(model.presentationModelType);
            var bean = {};
            model.attributes.filter(function (attribute) {
                return attribute.propertyName.search(/^@/) < 0;
            }).forEach(function (attribute) {
                bean[attribute.propertyName] = null;
                attribute.onValueChange(function (event) {
                    if (event.oldValue !== event.newValue) {
                        var oldValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                        var newValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                        self.propertyUpdateHandlers.forEach(function (handler) {
                            try {
                                handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                            } catch (e) {
                                console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                            }
                        });
                    }
                });
            });
            this.beanFromDolphin.set(model.id, bean);
            this.beanToDolphin.set(bean, model.id);
            this.classInfos.set(model.id, classInfo);
            this.beanAddedHandlers.forEach(function (handler) {
                try {
                    handler(model.presentationModelType, bean);
                } catch (e) {
                    console.warn('An exception occurred while calling an onBeanAdded-handler', e);
                }
            });
            return bean;
        }
    }, {
        key: 'unload',
        value: function unload(model) {
            (0, _utils2.checkMethod)('ClassRepository.unload(model)');
            (0, _utils2.checkParam)(model, 'model');

            var bean = this.beanFromDolphin.get(model.id);
            this.beanFromDolphin['delete'](model.id);
            this.beanToDolphin['delete'](bean);
            this.classInfos['delete'](model.id);
            if ((0, _utils.exists)(bean)) {
                this.beanRemovedHandlers.forEach(function (handler) {
                    try {
                        handler(model.presentationModelType, bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
                    }
                });
            }
            return bean;
        }
    }, {
        key: 'spliceListEntry',
        value: function spliceListEntry(model) {
            (0, _utils2.checkMethod)('ClassRepository.spliceListEntry(model)');
            (0, _utils2.checkParam)(model, 'model');

            var source = model.findAttributeByPropertyName('source');
            var attribute = model.findAttributeByPropertyName('attribute');
            var from = model.findAttributeByPropertyName('from');
            var to = model.findAttributeByPropertyName('to');
            var count = model.findAttributeByPropertyName('count');

            if ((0, _utils.exists)(source) && (0, _utils.exists)(attribute) && (0, _utils.exists)(from) && (0, _utils.exists)(to) && (0, _utils.exists)(count)) {
                var classInfo = this.classInfos.get(source.value);
                var bean = this.beanFromDolphin.get(source.value);
                if ((0, _utils.exists)(bean) && (0, _utils.exists)(classInfo)) {
                    var type = model.presentationModelType;
                    //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
                    this.validateList(this, type, bean, attribute.value);
                    var newElements = [],
                        element = null;
                    for (var i = 0; i < count.value; i++) {
                        element = model.findAttributeByPropertyName(i.toString());
                        if (!(0, _utils.exists)(element)) {
                            throw new Error("Invalid list modification update received");
                        }
                        newElements.push(this.fromDolphin(this, classInfo[attribute.value], element.value));
                    }
                    try {
                        this.block(bean, attribute.value);
                        this.arrayUpdateHandlers.forEach(function (handler) {
                            try {
                                handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                            } catch (e) {
                                console.warn('An exception occurred while calling an onArrayUpdate-handler', e);
                            }
                        });
                    } finally {
                        this.unblock();
                    }
                } else {
                    throw new Error("Invalid list modification update received. Source bean unknown.");
                }
            } else {
                throw new Error("Invalid list modification update received");
            }
        }
    }, {
        key: 'mapParamToDolphin',
        value: function mapParamToDolphin(param) {
            if (!(0, _utils.exists)(param)) {
                return param;
            }
            var type = typeof param === 'undefined' ? 'undefined' : _typeof(param);
            if (type === 'object') {
                if (param instanceof Date) {
                    return param.toISOString();
                } else {
                    var value = this.beanToDolphin.get(param);
                    if ((0, _utils.exists)(value)) {
                        return value;
                    }
                    throw new TypeError("Only managed Dolphin Beans can be used");
                }
            }
            if (type === 'string' || type === 'number' || type === 'boolean') {
                return param;
            }
            throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
        }
    }, {
        key: 'mapDolphinToBean',
        value: function mapDolphinToBean(value) {
            return this.fromDolphin(this, consts.DOLPHIN_BEAN, value);
        }
    }]);

    return ClassRepository;
}();

exports.default = ClassRepository;

},{"../bower_components/core.js/library/fn/map":1,"./constants":115,"./utils":121,"./utils.js":121}],107:[function(_dereq_,module,exports){
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
/* global exports */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenDolphin = _dereq_('../opendolphin/build/OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _utils = _dereq_('./utils');

var _connector = _dereq_('./connector.js');

var _connector2 = _interopRequireDefault(_connector);

var _beanmanager = _dereq_('./beanmanager.js');

var _beanmanager2 = _interopRequireDefault(_beanmanager);

var _classrepo = _dereq_('./classrepo.js');

var _classrepo2 = _interopRequireDefault(_classrepo);

var _controllermanager = _dereq_('./controllermanager.js');

var _controllermanager2 = _interopRequireDefault(_controllermanager);

var _clientcontext = _dereq_('./clientcontext.js');

var _clientcontext2 = _interopRequireDefault(_clientcontext);

var _platformHttpTransmitter = _dereq_('./platformHttpTransmitter.js');

var _platformHttpTransmitter2 = _interopRequireDefault(_platformHttpTransmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientContextFactory = function () {
    function ClientContextFactory() {
        _classCallCheck(this, ClientContextFactory);
    }

    _createClass(ClientContextFactory, [{
        key: 'create',
        value: function create(url, config) {
            (0, _utils.checkMethod)('connect(url, config)');
            (0, _utils.checkParam)(url, 'url');
            console.log('Creating client context ' + url + '    ' + JSON.stringify(config));

            var builder = _OpenDolphin2.default.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
            if ((0, _utils.exists)(config)) {
                if ((0, _utils.exists)(config.errorHandler)) {
                    builder.errorHandler(config.errorHandler);
                }
                if ((0, _utils.exists)(config.headersInfo) && Object.keys(config.headersInfo).length > 0) {
                    builder.headersInfo(config.headersInfo);
                }
            }

            var dolphin = builder.build();

            var transmitter = new _platformHttpTransmitter2.default(url, config);
            transmitter.on('error', function (error) {
                clientContext.emit('error', error);
            });
            dolphin.clientConnector.transmitter = transmitter;

            var classRepository = new _classrepo2.default(dolphin);
            var beanManager = new _beanmanager2.default(classRepository);
            var connector = new _connector2.default(url, dolphin, classRepository, config);
            var controllerManager = new _controllermanager2.default(dolphin, classRepository, connector);

            var clientContext = new _clientcontext2.default(dolphin, beanManager, controllerManager, connector);
            return clientContext;
        }
    }]);

    return ClientContextFactory;
}();

exports.default = ClientContextFactory;


exports.ClientContextFactory = ClientContextFactory;

},{"../opendolphin/build/OpenDolphin.js":101,"./beanmanager.js":105,"./classrepo.js":106,"./clientcontext.js":108,"./connector.js":114,"./controllermanager.js":116,"./platformHttpTransmitter.js":119,"./utils":121}],108:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenDolphin = _dereq_('../opendolphin/build/OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientContext = function () {
    function ClientContext(dolphin, beanManager, controllerManager, connector) {
        _classCallCheck(this, ClientContext);

        (0, _utils2.checkMethod)('ClientContext(dolphin, beanManager, controllerManager, connector)');
        (0, _utils2.checkParam)(dolphin, 'dolphin');
        (0, _utils2.checkParam)(beanManager, 'beanManager');
        (0, _utils2.checkParam)(controllerManager, 'controllerManager');
        (0, _utils2.checkParam)(connector, 'connector');

        this.dolphin = dolphin;
        this.beanManager = beanManager;
        this._controllerManager = controllerManager;
        this._connector = connector;
        this.connectionPromise = null;
        this.isConnected = false;
    }

    _createClass(ClientContext, [{
        key: 'connect',
        value: function connect() {
            var self = this;
            this.connectionPromise = new _promise2.default(function (resolve) {
                self._connector.connect();
                self._connector.invoke(_OpenDolphin2.default.createCreateContextCommand()).then(function () {
                    self.isConnected = true;
                    resolve();
                });
            });
            return this.connectionPromise;
        }
    }, {
        key: 'onConnect',
        value: function onConnect() {
            if ((0, _utils.exists)(this.connectionPromise)) {
                if (!this.isConnected) {
                    return this.connectionPromise;
                } else {
                    return new _promise2.default(function (resolve) {
                        resolve();
                    });
                }
            } else {
                return this.connect();
            }
        }
    }, {
        key: 'createController',
        value: function createController(name) {
            (0, _utils2.checkMethod)('ClientContext.createController(name)');
            (0, _utils2.checkParam)(name, 'name');

            return this._controllerManager.createController(name);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var self = this;
            this.dolphin.stopPushListening();
            return new _promise2.default(function (resolve) {
                self._controllerManager.destroy().then(function () {
                    self._connector.invoke(_OpenDolphin2.default.createDestroyContextCommand());
                    self.dolphin = null;
                    self.beanManager = null;
                    self._controllerManager = null;
                    self._connector = null;
                    resolve();
                });
            });
        }
    }]);

    return ClientContext;
}();

exports.default = ClientContext;


(0, _emitterComponent2.default)(ClientContext.prototype);

},{"../bower_components/core.js/library/fn/promise":2,"../opendolphin/build/OpenDolphin.js":101,"./utils":121,"./utils.js":121,"emitter-component":80}],109:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2016 Canoo Engineering AG.
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

var _utils = _dereq_('./utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);
    }

    _createClass(Codec, null, [{
        key: 'encodeCreatePresentationModelCommand',
        value: function encodeCreatePresentationModelCommand(command) {
            return {
                'p': command.pmId,
                't': command.pmType,
                'a': command.attributes.map(function (attribute) {
                    var result = {
                        'n': attribute.propertyName,
                        'i': attribute.id
                    };
                    if ((0, _utils.exists)(attribute.value)) {
                        result.v = attribute.value;
                    }
                    return result;
                }),
                'id': 'CreatePresentationModel'
            };
        }
    }, {
        key: 'decodeCreatePresentationModelCommand',
        value: function decodeCreatePresentationModelCommand(command) {
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
                        'value': (0, _utils.exists)(attribute.v) ? attribute.v : null,
                        'qualifier': null
                    };
                })
            };
        }
    }, {
        key: 'encodeValueChangedCommand',
        value: function encodeValueChangedCommand(command) {
            var result = {
                'a': command.attributeId
            };
            if ((0, _utils.exists)(command.oldValue)) {
                result.o = command.oldValue;
            }
            if ((0, _utils.exists)(command.newValue)) {
                result.n = command.newValue;
            }
            result.id = 'ValueChanged';
            return result;
        }
    }, {
        key: 'decodeValueChangedCommand',
        value: function decodeValueChangedCommand(command) {
            return {
                'id': 'ValueChanged',
                'className': "org.opendolphin.core.comm.ValueChangedCommand",
                'attributeId': command.a,
                'oldValue': (0, _utils.exists)(command.o) ? command.o : null,
                'newValue': (0, _utils.exists)(command.n) ? command.n : null
            };
        }
    }, {
        key: 'encode',
        value: function encode(commands) {
            var self = this;
            return JSON.stringify(commands.map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return self.encodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return self.encodeValueChangedCommand(command);
                }
                return command;
            }));
        }
    }, {
        key: 'decode',
        value: function decode(transmitted) {
            var self = this;
            if (typeof transmitted === 'string') {
                return JSON.parse(transmitted).map(function (command) {
                    if (command.id === 'CreatePresentationModel') {
                        return self.decodeCreatePresentationModelCommand(command);
                    } else if (command.id === 'ValueChanged') {
                        return self.decodeValueChangedCommand(command);
                    }
                    return command;
                });
            } else {
                return transmitted;
            }
        }
    }]);

    return Codec;
}();

exports.default = Codec;

},{"./utils.js":121}],110:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CommandFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _destroyControllerCommand = _dereq_('./commands/destroyControllerCommand.js');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _createControllerCommand = _dereq_('./commands/createControllerCommand.js');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./commands/callActionCommand.js');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandFactory = exports.CommandFactory = function () {
    function CommandFactory() {
        _classCallCheck(this, CommandFactory);
    }

    _createClass(CommandFactory, null, [{
        key: 'createDestroyControllerCommand',
        value: function createDestroyControllerCommand(controllerId) {
            return new _destroyControllerCommand2.default(controllerId);
        }
    }, {
        key: 'createCreateControllerCommand',
        value: function createCreateControllerCommand(controllerName, parentControllerId) {
            return new _createControllerCommand2.default(controllerName, parentControllerId);
        }
    }, {
        key: 'createCallActionCommand',
        value: function createCallActionCommand(controllerid, actionName, params) {
            return new _callActionCommand2.default(controllerid, actionName, params);
        }
    }]);

    return CommandFactory;
}();

},{"./commands/callActionCommand.js":111,"./commands/createControllerCommand.js":112,"./commands/destroyControllerCommand.js":113}],111:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallActionCommand = function CallActionCommand(controllerid, actionName, params) {
    _classCallCheck(this, CallActionCommand);

    (0, _utils.checkMethod)('CreateControllerCommand.invoke(controllerid, actionName, params)');
    (0, _utils.checkParam)(controllerid, 'controllerid');
    (0, _utils.checkParam)(actionName, 'actionName');

    this.id = 'CallAction';
    this.c = controllerid;
    this.n = actionName;
    this.p = params;
};

exports.default = CallActionCommand;

},{"../utils":121}],112:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateControllerCommand = function CreateControllerCommand(controllerName, parentControllerId) {
    _classCallCheck(this, CreateControllerCommand);

    (0, _utils.checkMethod)('CreateControllerCommand.invoke(controllerName, parentControllerId)');
    (0, _utils.checkParam)(controllerName, 'controllerName');

    this.id = 'CreateController';
    this.n = controllerName;
    this.p = parentControllerId;
};

exports.default = CreateControllerCommand;

},{"../utils":121}],113:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyControllerCommand = function DestroyControllerCommand(controllerId) {
    _classCallCheck(this, DestroyControllerCommand);

    (0, _utils.checkMethod)('DestroyControllerCommand(controllerId)');
    (0, _utils.checkParam)(controllerId, 'controllerId');

    this.id = 'DestroyController';
    this.c = controllerId;
};

exports.default = DestroyControllerCommand;

},{"../utils":121}],114:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenDolphin = _dereq_('../opendolphin/build/OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ClientModelStore = _dereq_('../opendolphin/build/ClientModelStore');

var _ClientModelStore2 = _interopRequireDefault(_ClientModelStore);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
var HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
var DOLPHIN_LIST_SPLICE = '@DP:LS@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';

var Connector = function () {
    function Connector(url, dolphin, classRepository, config) {
        _classCallCheck(this, Connector);

        (0, _utils2.checkMethod)('Connector(url, dolphin, classRepository, config)');
        (0, _utils2.checkParam)(url, 'url');
        (0, _utils2.checkParam)(dolphin, 'dolphin');
        (0, _utils2.checkParam)(classRepository, 'classRepository');

        var self = this;
        this.dolphin = dolphin;
        this.config = config;
        this.classRepository = classRepository;
        this.highlanderPMResolver = function () {};
        this.highlanderPMPromise = new _promise2.default(function (resolve) {
            self.highlanderPMResolver = resolve;
        });

        dolphin.getClientModelStore().onModelStoreChange(function (event) {
            var model = event.clientPresentationModel;
            var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
            if ((0, _utils.exists)(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
                if (event.eventType === _ClientModelStore2.default.Type.ADDED) {
                    self.onModelAdded(model);
                } else if (event.eventType === _ClientModelStore2.default.Type.REMOVED) {
                    self.onModelRemoved(model);
                }
            }
        });
    }

    _createClass(Connector, [{
        key: 'connect',
        value: function connect() {
            var that = this;
            setTimeout(function () {
                that.dolphin.startPushListening(_OpenDolphin2.default.createStartLongPollCommand(), _OpenDolphin2.default.createInterruptLongPollCommand());
            }, 0);
        }
    }, {
        key: 'onModelAdded',
        value: function onModelAdded(model) {
            (0, _utils2.checkMethod)('Connector.onModelAdded(model)');
            (0, _utils2.checkParam)(model, 'model');

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
        }
    }, {
        key: 'onModelRemoved',
        value: function onModelRemoved(model) {
            (0, _utils2.checkMethod)('Connector.onModelRemoved(model)');
            (0, _utils2.checkParam)(model, 'model');
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
        }
    }, {
        key: 'invoke',
        value: function invoke(command) {
            (0, _utils2.checkMethod)('Connector.invoke(command)');
            (0, _utils2.checkParam)(command, 'command');

            var dolphin = this.dolphin;
            return new _promise2.default(function (resolve) {
                dolphin.send(command, {
                    onFinished: function onFinished() {
                        resolve();
                    }
                });
            });
        }
    }, {
        key: 'getHighlanderPM',
        value: function getHighlanderPM() {
            return this.highlanderPMPromise;
        }
    }]);

    return Connector;
}();

exports.default = Connector;


exports.SOURCE_SYSTEM = SOURCE_SYSTEM;
exports.SOURCE_SYSTEM_CLIENT = SOURCE_SYSTEM_CLIENT;
exports.SOURCE_SYSTEM_SERVER = SOURCE_SYSTEM_SERVER;
exports.ACTION_CALL_BEAN = ACTION_CALL_BEAN;

},{"../bower_components/core.js/library/fn/promise":2,"../opendolphin/build/ClientModelStore":86,"../opendolphin/build/OpenDolphin.js":101,"./utils":121,"./utils.js":121}],115:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DOLPHIN_BEAN = exports.DOLPHIN_BEAN = 0;
var BYTE = exports.BYTE = 1;
var SHORT = exports.SHORT = 2;
var INT = exports.INT = 3;
var LONG = exports.LONG = 4;
var FLOAT = exports.FLOAT = 5;
var DOUBLE = exports.DOUBLE = 6;
var BOOLEAN = exports.BOOLEAN = 7;
var STRING = exports.STRING = 8;
var DATE = exports.DATE = 9;
var ENUM = exports.ENUM = 10;
var CALENDAR = exports.CALENDAR = 11;
var LOCAL_DATE_FIELD_TYPE = exports.LOCAL_DATE_FIELD_TYPE = 55;
var LOCAL_DATE_TIME_FIELD_TYPE = exports.LOCAL_DATE_TIME_FIELD_TYPE = 52;
var ZONED_DATE_TIME_FIELD_TYPE = exports.ZONED_DATE_TIME_FIELD_TYPE = 54;

},{}],116:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = _dereq_('../bower_components/core.js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _controllerproxy = _dereq_('./controllerproxy.js');

var _controllerproxy2 = _interopRequireDefault(_controllerproxy);

var _commandFactory = _dereq_('./commandFactory.js');

var _connector = _dereq_('./connector.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTROLLER_ID = 'controllerId';
var MODEL = 'model';
var ERROR_CODE = 'errorCode';

var ControllerManager = function () {
    function ControllerManager(dolphin, classRepository, connector) {
        _classCallCheck(this, ControllerManager);

        (0, _utils.checkMethod)('ControllerManager(dolphin, classRepository, connector)');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(classRepository, 'classRepository');
        (0, _utils.checkParam)(connector, 'connector');

        this.dolphin = dolphin;
        this.classRepository = classRepository;
        this.connector = connector;
        this.controllers = new _set2.default();
    }

    _createClass(ControllerManager, [{
        key: 'createController',
        value: function createController(name) {
            return this._createController(name, null);
        }
    }, {
        key: '_createController',
        value: function _createController(name, parentControllerId) {
            (0, _utils.checkMethod)('ControllerManager.createController(name)');
            (0, _utils.checkParam)(name, 'name');

            var self = this;
            var controllerId = void 0,
                modelId = void 0,
                model = void 0,
                controller = void 0;
            return new _promise2.default(function (resolve) {
                self.connector.getHighlanderPM().then(function (highlanderPM) {
                    self.connector.invoke(_commandFactory.CommandFactory.createCreateControllerCommand(name, parentControllerId)).then(function () {
                        controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                        modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                        model = self.classRepository.mapDolphinToBean(modelId);
                        controller = new _controllerproxy2.default(controllerId, model, self);
                        self.controllers.add(controller);
                        resolve(controller);
                    });
                });
            });
        }
    }, {
        key: 'invokeAction',
        value: function invokeAction(controllerId, actionName, params) {
            (0, _utils.checkMethod)('ControllerManager.invokeAction(controllerId, actionName, params)');
            (0, _utils.checkParam)(controllerId, 'controllerId');
            (0, _utils.checkParam)(actionName, 'actionName');

            var self = this;
            return new _promise2.default(function (resolve, reject) {

                var attributes = [self.dolphin.attribute(_connector.SOURCE_SYSTEM, null, _connector.SOURCE_SYSTEM_CLIENT), self.dolphin.attribute(ERROR_CODE)];

                var pm = self.dolphin.presentationModel.apply(self.dolphin, [null, _connector.ACTION_CALL_BEAN].concat(attributes));

                var actionParams = [];
                if ((0, _utils.exists)(params)) {
                    for (var param in params) {
                        if (params.hasOwnProperty(param)) {
                            var value = self.classRepository.mapParamToDolphin(params[param]);
                            actionParams.push({ n: param, v: value });
                        }
                    }
                }

                self.connector.invoke(_commandFactory.CommandFactory.createCallActionCommand(controllerId, actionName, actionParams)).then(function () {
                    var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
                    if (isError) {
                        reject(new Error("ControllerAction caused an error"));
                    } else {
                        resolve();
                    }
                    self.dolphin.deletePresentationModel(pm);
                });
            });
        }
    }, {
        key: 'destroyController',
        value: function destroyController(controller) {
            (0, _utils.checkMethod)('ControllerManager.destroyController(controller)');
            (0, _utils.checkParam)(controller, 'controller');

            var self = this;
            return new _promise2.default(function (resolve) {
                self.connector.getHighlanderPM().then(function (highlanderPM) {
                    self.controllers.delete(controller);
                    highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controller.controllerId);
                    self.connector.invoke(_commandFactory.CommandFactory.createDestroyControllerCommand(controller.getId())).then(resolve);
                });
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var controllersCopy = this.controllers;
            var promises = [];
            this.controllers = new _set2.default();
            controllersCopy.forEach(function (controller) {
                try {
                    promises.push(controller.destroy());
                } catch (e) {
                    // ignore
                }
            });
            return _promise2.default.all(promises);
        }
    }]);

    return ControllerManager;
}();

exports.default = ControllerManager;

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commandFactory.js":110,"./connector.js":114,"./controllerproxy.js":117,"./utils":121}],117:[function(_dereq_,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = _dereq_('../bower_components/core.js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControllerProxy = function () {
    function ControllerProxy(controllerId, model, manager) {
        _classCallCheck(this, ControllerProxy);

        (0, _utils.checkMethod)('ControllerProxy(controllerId, model, manager)');
        (0, _utils.checkParam)(controllerId, 'controllerId');
        (0, _utils.checkParam)(model, 'model');
        (0, _utils.checkParam)(manager, 'manager');

        this.controllerId = controllerId;
        this.model = model;
        this.manager = manager;
        this.destroyed = false;
        this.onDestroyedHandlers = new _set2.default();
    }

    _createClass(ControllerProxy, [{
        key: 'getModel',
        value: function getModel() {
            return this.model;
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this.controllerId;
        }
    }, {
        key: 'invoke',
        value: function invoke(name, params) {
            (0, _utils.checkMethod)('ControllerProxy.invoke(name, params)');
            (0, _utils.checkParam)(name, 'name');

            if (this.destroyed) {
                throw new Error('The controller was already destroyed');
            }
            return this.manager.invokeAction(this.controllerId, name, params);
        }
    }, {
        key: 'createController',
        value: function createController(name) {
            return this.manager._createController(name, this.getId());
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this = this;

            if (this.destroyed) {
                throw new Error('The controller was already destroyed');
            }
            this.destroyed = true;
            this.onDestroyedHandlers.forEach(function (handler) {
                try {
                    handler(_this);
                } catch (e) {
                    console.warn('An exception occurred while calling an onDestroyed-handler', e);
                }
            }, this);
            return this.manager.destroyController(this);
        }
    }, {
        key: 'onDestroyed',
        value: function onDestroyed(handler) {
            (0, _utils.checkMethod)('ControllerProxy.onDestroyed(handler)');
            (0, _utils.checkParam)(handler, 'handler');

            var self = this;
            this.onDestroyedHandlers.add(handler);
            return {
                unsubscribe: function unsubscribe() {
                    self.onDestroyedHandlers.delete(handler);
                }
            };
        }
    }]);

    return ControllerProxy;
}();

exports.default = ControllerProxy;

},{"../bower_components/core.js/library/fn/set":3,"./utils":121}],118:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DolphinRemotingError = exports.DolphinRemotingError = function (_Error) {
  _inherits(DolphinRemotingError, _Error);

  function DolphinRemotingError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Remoting Error';
    var detail = arguments[1];

    _classCallCheck(this, DolphinRemotingError);

    var _this = _possibleConstructorReturn(this, (DolphinRemotingError.__proto__ || Object.getPrototypeOf(DolphinRemotingError)).call(this, message));

    _this.detail = detail || undefined;
    return _this;
  }

  return DolphinRemotingError;
}(Error);

var DolphinSessionError = exports.DolphinSessionError = function (_Error2) {
  _inherits(DolphinSessionError, _Error2);

  function DolphinSessionError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Session Error';

    _classCallCheck(this, DolphinSessionError);

    return _possibleConstructorReturn(this, (DolphinSessionError.__proto__ || Object.getPrototypeOf(DolphinSessionError)).call(this, message));
  }

  return DolphinSessionError;
}(Error);

var HttpResponseError = exports.HttpResponseError = function (_Error3) {
  _inherits(HttpResponseError, _Error3);

  function HttpResponseError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Http Response Error';

    _classCallCheck(this, HttpResponseError);

    return _possibleConstructorReturn(this, (HttpResponseError.__proto__ || Object.getPrototypeOf(HttpResponseError)).call(this, message));
  }

  return HttpResponseError;
}(Error);

var HttpNetworkError = exports.HttpNetworkError = function (_Error4) {
  _inherits(HttpNetworkError, _Error4);

  function HttpNetworkError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Http Network Error';

    _classCallCheck(this, HttpNetworkError);

    return _possibleConstructorReturn(this, (HttpNetworkError.__proto__ || Object.getPrototypeOf(HttpNetworkError)).call(this, message));
  }

  return HttpNetworkError;
}(Error);

},{}],119:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2016 Canoo Engineering AG.
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

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _utils = _dereq_('./utils');

var _errors = _dereq_('./errors.js');

var _codec = _dereq_('./codec.js');

var _codec2 = _interopRequireDefault(_codec);

var _remotingErrorHandler = _dereq_('./remotingErrorHandler');

var _remotingErrorHandler2 = _interopRequireDefault(_remotingErrorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FINISHED = 4;
var SUCCESS = 200;
var REQUEST_TIMEOUT = 408;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

var PlatformHttpTransmitter = function () {
    function PlatformHttpTransmitter(url, config) {
        _classCallCheck(this, PlatformHttpTransmitter);

        this.url = url;
        this.config = config;
        this.headersInfo = (0, _utils.exists)(config) ? config.headersInfo : null;
        var connectionConfig = (0, _utils.exists)(config) ? config.connection : null;
        this.maxRetry = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.maxRetry) ? connectionConfig.maxRetry : 3;
        this.timeout = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.timeout) ? connectionConfig.timeout : 5000;
        this.failed_attempt = 0;
    }

    _createClass(PlatformHttpTransmitter, [{
        key: '_handleError',
        value: function _handleError(reject, error) {
            var connectionConfig = (0, _utils.exists)(this.config) ? this.config.connection : null;
            var errorHandlers = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.errorHandlers) ? connectionConfig.errorHandlers : [new _remotingErrorHandler2.default()];
            errorHandlers.forEach(function (handler) {
                handler.onError(error);
            });
            reject(error);
        }
    }, {
        key: '_send',
        value: function _send(commands) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var http = new XMLHttpRequest();
                http.withCredentials = true;
                http.onerror = function (errorContent) {
                    _this._handleError(reject, new _errors.HttpNetworkError('PlatformHttpTransmitter: Network error', errorContent));
                };

                http.onreadystatechange = function () {
                    if (http.readyState === FINISHED) {
                        switch (http.status) {

                            case SUCCESS:
                                {
                                    _this.failed_attempt = 0;
                                    var currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                                    if ((0, _utils.exists)(currentClientId)) {
                                        if ((0, _utils.exists)(_this.clientId) && _this.clientId !== currentClientId) {
                                            _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: ClientId of the response did not match'));
                                        }
                                        _this.clientId = currentClientId;
                                    } else {
                                        _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Server did not send a clientId'));
                                    }
                                    resolve(http.responseText);
                                    break;
                                }

                            case REQUEST_TIMEOUT:
                                _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Session Timeout'));
                                break;

                            default:
                                if (_this.failed_attempt <= _this.maxRetry) {
                                    _this.failed_attempt = _this.failed_attempt + 1;
                                }
                                _this._handleError(reject, new _errors.HttpResponseError('PlatformHttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
                                break;
                        }
                    }
                };

                http.open('POST', _this.url);
                if ((0, _utils.exists)(_this.clientId)) {
                    http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, _this.clientId);
                }

                if ((0, _utils.exists)(_this.headersInfo)) {
                    for (var i in _this.headersInfo) {
                        if (_this.headersInfo.hasOwnProperty(i)) {
                            http.setRequestHeader(i, _this.headersInfo[i]);
                        }
                    }
                }
                if (_this.failed_attempt > _this.maxRetry) {
                    setTimeout(function () {
                        http.send(_codec2.default.encode(commands));
                    }, _this.timeout);
                } else {
                    http.send(_codec2.default.encode(commands));
                }
            });
        }
    }, {
        key: 'transmit',
        value: function transmit(commands, onDone) {
            var _this2 = this;

            this._send(commands).then(function (responseText) {
                if (responseText.trim().length > 0) {
                    try {
                        var responseCommands = _codec2.default.decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        _this2.emit('error', new _errors.DolphinRemotingError('PlatformHttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    _this2.emit('error', new _errors.DolphinRemotingError('PlatformHttpTransmitter: Empty response'));
                    onDone([]);
                }
            }).catch(function (error) {
                _this2.emit('error', error);
                onDone([]);
            });
        }
    }, {
        key: 'signal',
        value: function signal(command) {
            var _this3 = this;

            this._send([command]).catch(function (error) {
                return _this3.emit('error', error);
            });
        }
    }]);

    return PlatformHttpTransmitter;
}();

exports.default = PlatformHttpTransmitter;


(0, _emitterComponent2.default)(PlatformHttpTransmitter.prototype);

},{"./codec.js":109,"./errors.js":118,"./remotingErrorHandler":120,"./utils":121,"emitter-component":80}],120:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RemotingErrorHandler = function () {
    function RemotingErrorHandler() {
        _classCallCheck(this, RemotingErrorHandler);
    }

    _createClass(RemotingErrorHandler, [{
        key: "onError",
        value: function onError(error) {
            window.console.error(error);
        }
    }]);

    return RemotingErrorHandler;
}();

exports.default = RemotingErrorHandler;

},{}],121:[function(_dereq_,module,exports){
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

var exists = function exists(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function (name) {
    checkMethodName = name;
};

module.exports.checkParam = function (param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + checkMethodName);
    }
};

},{}]},{},[107])(107)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],71:[function(_dereq_,module,exports){
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

                    self.fire('controller-ready');

                    controller.onDestroyed(function() {
                        state = 'DESTROYED';
                        self.set('model', null);
                        self.fire('controller-destroyed');
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

            destroy: function() {
                this._controller.destroy();
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
},{"./binder.js":72}],72:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/map":1}],73:[function(_dereq_,module,exports){
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

var dolphinClient = _dereq_('../bower_components/dolphin-platform-js/dist/dolphin-platform.js');
var setupCreateBehavior = _dereq_('./behavior.js').setupCreateBehavior;

exports.clientContext = function(url, config){
    var clientContextFactory = new dolphinClient.ClientContextFactory();
    var clientContext = clientContextFactory.create(url, config);
    clientContext.createBehavior = setupCreateBehavior(clientContext);
    return clientContext;
};


},{"../bower_components/dolphin-platform-js/dist/dolphin-platform.js":70,"./behavior.js":71}]},{},[73])(73)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1mcm9tLWl0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm1hcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQXR0cmlidXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50QXR0cmlidXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50Q29ubmVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50RG9scGhpbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0NsaWVudE1vZGVsU3RvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9vcGVuZG9scGhpbi9idWlsZC9DbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0NvZGVjLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0NvbW1hbmRCYXRjaGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ29tbWFuZENvbnN0YW50cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0NyZWF0ZUNvbnRleHRDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvRGVzdHJveUNvbnRleHRDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvb3BlbmRvbHBoaW4vYnVpbGQvRG9scGhpbkJ1aWxkZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9vcGVuZG9scGhpbi9idWlsZC9FdmVudEJ1cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0h0dHBUcmFuc21pdHRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL0ludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL05vVHJhbnNtaXR0ZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9vcGVuZG9scGhpbi9idWlsZC9PcGVuRG9scGhpbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL1NpZ25hbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9vcGVuZG9scGhpbi9idWlsZC9TdGFydExvbmdQb2xsQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L29wZW5kb2xwaGluL2J1aWxkL1ZhbHVlQ2hhbmdlZENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvYmVhbm1hbmFnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY2xhc3NyZXBvLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NsaWVudENvbnRleHRGYWN0b3J5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NsaWVudGNvbnRleHQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29kZWMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZEZhY3RvcnkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvY2FsbEFjdGlvbkNvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Nvbm5lY3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb25zdGFudHMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcnByb3h5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Vycm9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy91dGlscy5qcyIsInNyYy9iZWhhdmlvci5qcyIsInNyYy9iaW5kZXIuanMiLCJzcmMvZG9scGhpbi1wb2x5bWVyLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBOztBQUNBLElBQUksWUFBYSxZQUFZO0FBQ3pCLGFBQVMsU0FBVCxHQUFxQixDQUNwQjtBQUNELGNBQVUsa0JBQVYsR0FBK0IsV0FBL0I7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpe1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyLCBJVEVSQVRPUil7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yT2YoaXRlciwgZmFsc2UsIHJlc3VsdC5wdXNoLCByZXN1bHQsIElURVJBVE9SKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgYXNjICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFLCAkY3JlYXRlKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWFxuICAgICwgY3JlYXRlICAgICAgICA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCgkdGhpcylcbiAgICAgICwgc2VsZiAgID0gSU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDBcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaXNBcnJheSAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsKXtcbiAgdmFyIEM7XG4gIGlmKGlzQXJyYXkob3JpZ2luYWwpKXtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZih0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpQyA9IHVuZGVmaW5lZDtcbiAgICBpZihpc09iamVjdChDKSl7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmKEMgPT09IG51bGwpQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07IiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGVuZ3RoKXtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBjcmVhdGUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGhpZGUgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBhbkluc3RhbmNlICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBkZWZpbmVkICAgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIGZvck9mICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgc2V0U3BlY2llcyAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgZmFzdEtleSAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleVxuICAsIFNJWkUgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbih0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsICdmb3JFYWNoJyk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBkZWZpbmVkKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXQuX2YpdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICB0aGlzLl90ID0gaXRlcmF0ZWQ7ICAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7IC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgLCBraW5kICA9IHRoYXQuX2tcbiAgICAgICAgLCBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgZnJvbSAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgbWV0YSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJylcbiAgLCBmYWlscyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBmb3JPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgYW5JbnN0YW5jZSAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGRQICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUsICdfYycpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsIEtFWSk7XG4gICAgICAgIGlmKCFJU19BRERFUiAmJiBJU19XRUFLICYmICFpc09iamVjdChhKSlyZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKCdzaXplJyBpbiBwcm90bylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgLCBCUkVBSyAgICAgICA9IHt9XG4gICwgUkVUVVJOICAgICAgPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyAgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoJzxzY3JpcHQ+ZG9jdW1lbnQuRj1PYmplY3Q8L3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTsiLCJ2YXIgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBkUCAgICAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpe1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYywgc2FmZSl7XG4gIGZvcih2YXIga2V5IGluIHNyYyl7XG4gICAgaWYoc2FmZSAmJiB0YXJnZXRba2V5XSl0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gdHlwZW9mIGNvcmVbS0VZXSA9PSAnZnVuY3Rpb24nID8gY29yZVtLRVldIDogZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59OyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5NYXA7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlNldDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpe1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyLCBJVEVSQVRPUil7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yT2YoaXRlciwgZmFsc2UsIHJlc3VsdC5wdXNoLCByZXN1bHQsIElURVJBVE9SKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgYXNjICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFLCAkY3JlYXRlKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWFxuICAgICwgY3JlYXRlICAgICAgICA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCgkdGhpcylcbiAgICAgICwgc2VsZiAgID0gSU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDBcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaXNBcnJheSAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsKXtcbiAgdmFyIEM7XG4gIGlmKGlzQXJyYXkob3JpZ2luYWwpKXtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZih0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpQyA9IHVuZGVmaW5lZDtcbiAgICBpZihpc09iamVjdChDKSl7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmKEMgPT09IG51bGwpQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07IiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGVuZ3RoKXtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBjcmVhdGUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgYW5JbnN0YW5jZSAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZGVmaW5lZCAgICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpXG4gICwgc3RlcCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIHNldFNwZWNpZXMgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIGZhc3RLZXkgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXlcbiAgLCBTSVpFICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYodGhhdC5fZiA9PSBlbnRyeSl0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0Ll9sID09IGVudHJ5KXRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCAnZm9yRWFjaCcpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIGZyb20gICAgPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgaWYoY2xhc3NvZih0aGlzKSAhPSBOQU1FKXRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIG1ldGEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGFuSW5zdGFuY2UgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBkUCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9IGdsb2JhbFtOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgaWYoIURFU0NSSVBUT1JTIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FLCAnX2MnKTtcbiAgICAgIHRhcmdldC5fYyA9IG5ldyBCYXNlO1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgZWFjaCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYy5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GLCBPKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICwgQlJFQUsgICAgICAgPSB7fVxuICAsIFJFVFVSTiAgICAgID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgcmV0dXJuIHtkb25lOiBzYWZlID0gdHJ1ZX07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSlwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlKGhlYWQpe1xuICAgICAgZm4gICA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIGlmKGhlYWQpbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYoaXNOb2RlKXtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG4gIH0gZWxzZSBpZihPYnNlcnZlcil7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWVcbiAgICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZm4pe1xuICAgIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkfTtcbiAgICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYoIWhlYWQpe1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBkUCAgICAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpe1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYywgc2FmZSl7XG4gIGZvcih2YXIga2V5IGluIHNyYyl7XG4gICAgaWYoc2FmZSAmJiB0YXJnZXRba2V5XSl0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gdHlwZW9mIGNvcmVbS0VZXSA9PSAnZnVuY3Rpb24nID8gY29yZVtLRVldIDogZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59OyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3IsIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19odG1sJylcbiAgLCBjZWwgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKbGN6WXViMkpxWldOMExuUnZMWE4wY21sdVp5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2xhc3NvZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc09iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuSW5zdGFuY2UgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBmb3JPZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIHRhc2sgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBtaWNyb3Rhc2sgICAgICAgICAgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpXG4gICwgUFJPTUlTRSAgICAgICAgICAgID0gJ1Byb21pc2UnXG4gICwgVHlwZUVycm9yICAgICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgJFByb21pc2UgICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgICAgICAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGVtcHR5ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBJbnRlcm5hbCwgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSAgICAgPSAkUHJvbWlzZS5yZXNvbHZlKDEpXG4gICAgICAsIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbihleGVjKXsgZXhlYyhlbXB0eSwgZW1wdHkpOyB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgc2FtZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oYSwgYil7XG4gIC8vIHdpdGggbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICByZXR1cm4gYSA9PT0gYiB8fCBhID09PSAkUHJvbWlzZSAmJiBiID09PSBXcmFwcGVyO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICByZXR1cm4gc2FtZUNvbnN0cnVjdG9yKCRQcm9taXNlLCBDKVxuICAgID8gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgOiBuZXcgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn07XG52YXIgcGVyZm9ybSA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIGV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4ge2Vycm9yOiBlfTtcbiAgfVxufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbihwcm9taXNlLCBpc1JlamVjdCl7XG4gIGlmKHByb21pc2UuX24pcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBvayAgICA9IHByb21pc2UuX3MgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCBkb21haW4gID0gcmVhY3Rpb24uZG9tYWluXG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXtcbiAgICAgICAgICAgIGlmKHByb21pc2UuX2ggPT0gMilvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihoYW5kbGVyID09PSB0cnVlKXJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKXtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgYWJydXB0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pe1xuICAgICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZihhYnJ1cHQpdGhyb3cgYWJydXB0LmVycm9yO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgaWYocHJvbWlzZS5faCA9PSAxKXJldHVybiBmYWxzZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jXG4gICAgLCBpICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmKGlzTm9kZSl7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpe1xuICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92fSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZighcHJvbWlzZS5fYSlwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYocHJvbWlzZSA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoKGUpe1xuICAgICRyZWplY3QuY2FsbCh7X3c6IHByb21pc2UsIF9kOiBmYWxzZX0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighVVNFX05BVElWRSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uICAgID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayAgICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgICA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX2EpdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX3Mpbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHByb21pc2UgID0gbmV3IEludGVybmFsO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCAgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiAkUHJvbWlzZX0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgJFByb21pc2UgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgdmFyIHZhbHVlcyAgICA9IFtdXG4gICAgICAgICwgaW5kZXggICAgID0gMFxuICAgICAgICAsIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICB2YXIgJGluZGV4ICAgICAgICA9IGluZGV4KytcbiAgICAgICAgICAsIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkICA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdNYXAnLCB7dG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdTZXQnLCB7dG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnU2V0Jyl9KTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQXR0cmlidXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBdHRyaWJ1dGUoKSB7XG4gICAgfVxuICAgIEF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFkgPSBcInF1YWxpZmllclwiO1xuICAgIEF0dHJpYnV0ZS5WQUxVRSA9IFwidmFsdWVcIjtcbiAgICByZXR1cm4gQXR0cmlidXRlO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEF0dHJpYnV0ZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXR0cmlidXRlLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuaWQgPSAnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGEnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZDtcbn0oQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBFdmVudEJ1c18xID0gcmVxdWlyZSgnLi9FdmVudEJ1cycpO1xudmFyIENsaWVudEF0dHJpYnV0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2xpZW50QXR0cmlidXRlKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICAgICAgdGhpcy5pZCA9IFwiXCIgKyAoQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQrKykgKyBcIkNcIjtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1c18xW1wiZGVmYXVsdFwiXSgpO1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1c18xW1wiZGVmYXVsdFwiXSgpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIocXVhbGlmaWVyKTtcbiAgICB9XG4gICAgLyoqIGEgY29weSBjb25zdHJ1Y3RvciB3aXRoIG5ldyBpZCBhbmQgbm8gcHJlc2VudGF0aW9uIG1vZGVsICovXG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudEF0dHJpYnV0ZSh0aGlzLnByb3BlcnR5TmFtZSwgdGhpcy5nZXRRdWFsaWZpZXIoKSwgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0UHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91IGNhbiBub3Qgc2V0IGEgcHJlc2VudGF0aW9uIG1vZGVsIGZvciBhbiBhdHRyaWJ1dGUgdGhhdCBpcyBhbHJlYWR5IGJvdW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsID0gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmdldFByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICB2YXIgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gdmVyaWZpZWRWYWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZlcmlmaWVkVmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbHVlLCAnbmV3VmFsdWUnOiB2ZXJpZmllZFZhbHVlIH0pO1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRRdWFsaWZpZXIgPSBmdW5jdGlvbiAobmV3UXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICh0aGlzLnF1YWxpZmllciA9PSBuZXdRdWFsaWZpZXIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBvbGRRdWFsaWZpZXIgPSB0aGlzLnF1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBuZXdRdWFsaWZpZXI7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRRdWFsaWZpZXIsICduZXdWYWx1ZSc6IG5ld1F1YWxpZmllciB9KTtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0UXVhbGlmaWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFsaWZpZXI7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFN0cmluZyB8fCByZXN1bHQgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHJlc3VsdCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWUudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW4gQXR0cmlidXRlIG1heSBub3QgaXRzZWxmIGNvbnRhaW4gYW4gYXR0cmlidXRlIGFzIGEgdmFsdWUuIEFzc3VtaW5nIHlvdSBmb3Jnb3QgdG8gY2FsbCB2YWx1ZS5cIik7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNoZWNrVmFsdWUodmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5TVVBQT1JURURfVkFMVUVfVFlQRVMuaW5kZXhPZih0eXBlb2YgcmVzdWx0KSA+IC0xIHx8IHJlc3VsdCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRyaWJ1dGUgdmFsdWVzIG9mIHRoaXMgdHlwZSBhcmUgbm90IGFsbG93ZWQ6IFwiICsgdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5vblZhbHVlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgZXZlbnRIYW5kbGVyKHsgXCJvbGRWYWx1ZVwiOiB0aGlzLnZhbHVlLCBcIm5ld1ZhbHVlXCI6IHRoaXMudmFsdWUgfSk7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uUXVhbGlmaWVyQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnN5bmNXaXRoID0gZnVuY3Rpb24gKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldFF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpOyAvLyBzZXF1ZW5jZSBpcyBpbXBvcnRhbnRcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLlNVUFBPUlRFRF9WQUxVRV9UWVBFUyA9IFtcInN0cmluZ1wiLCBcIm51bWJlclwiLCBcImJvb2xlYW5cIl07XG4gICAgQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQgPSAwO1xuICAgIHJldHVybiBDbGllbnRBdHRyaWJ1dGU7XG59KCkpO1xuZXhwb3J0cy5DbGllbnRBdHRyaWJ1dGUgPSBDbGllbnRBdHRyaWJ1dGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudEF0dHJpYnV0ZS5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENsaWVudFByZXNlbnRhdGlvbk1vZGVsXzEgPSByZXF1aXJlKFwiLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbFwiKTtcbnZhciBDb2RlY18xID0gcmVxdWlyZShcIi4vQ29kZWNcIik7XG52YXIgQ29tbWFuZEJhdGNoZXJfMSA9IHJlcXVpcmUoXCIuL0NvbW1hbmRCYXRjaGVyXCIpO1xudmFyIENsaWVudENvbm5lY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2xpZW50Q29ubmVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCBzbGFja01TLCBtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgaWYgKHNsYWNrTVMgPT09IHZvaWQgMCkgeyBzbGFja01TID0gMDsgfVxuICAgICAgICBpZiAobWF4QmF0Y2hTaXplID09PSB2b2lkIDApIHsgbWF4QmF0Y2hTaXplID0gNTA7IH1cbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgdGhpcy5zbGFja01TID0gc2xhY2tNUztcbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlY18xW1wiZGVmYXVsdFwiXSgpO1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3IENvbW1hbmRCYXRjaGVyXzEuQmxpbmRDb21tYW5kQmF0Y2hlcih0cnVlLCBtYXhCYXRjaFNpemUpO1xuICAgIH1cbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldENvbW1hbmRCYXRjaGVyID0gZnVuY3Rpb24gKG5ld0JhdGNoZXIpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ld0JhdGNoZXI7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFB1c2hFbmFibGVkID0gZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFB1c2hMaXN0ZW5lciA9IGZ1bmN0aW9uIChuZXdMaXN0ZW5lcikge1xuICAgICAgICB0aGlzLnB1c2hMaXN0ZW5lciA9IG5ld0xpc3RlbmVyO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZXRSZWxlYXNlQ29tbWFuZCA9IGZ1bmN0aW9uIChuZXdDb21tYW5kKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNvbW1hbmQgPSBuZXdDb21tYW5kO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7IGNvbW1hbmQ6IGNvbW1hbmQsIGhhbmRsZXI6IG9uRmluaXNoZWQgfSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpOyAvLyB0aGVyZSBpcyBub3QgcG9pbnQgaW4gcmVsZWFzaW5nIGlmIHdlIGRvIG5vdCBzZW5kIGF0bVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5kb1NlbmROZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHVzaEVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVucXVldWVQdXNoQ29tbWFuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IHRydWU7XG4gICAgICAgIHZhciBjbWRzQW5kSGFuZGxlcnMgPSB0aGlzLmNvbW1hbmRCYXRjaGVyLmJhdGNoKHRoaXMuY29tbWFuZFF1ZXVlKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY21kc0FuZEhhbmRsZXJzW2NtZHNBbmRIYW5kbGVycy5sZW5ndGggLSAxXS5oYW5kbGVyO1xuICAgICAgICB2YXIgY29tbWFuZHMgPSBjbWRzQW5kSGFuZGxlcnMubWFwKGZ1bmN0aW9uIChjYWgpIHsgcmV0dXJuIGNhaC5jb21tYW5kOyB9KTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlci50cmFuc21pdChjb21tYW5kcywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VydmVyIHJlc3BvbnNlOiBbXCIgKyByZXNwb25zZS5tYXAoaXQgPT4gaXQuaWQpLmpvaW4oXCIsIFwiKSArIFwiXSBcIik7XG4gICAgICAgICAgICB2YXIgdG91Y2hlZFBNcyA9IFtdO1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaGVkID0gX3RoaXMuaGFuZGxlKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIGlmICh0b3VjaGVkKVxuICAgICAgICAgICAgICAgICAgICB0b3VjaGVkUE1zLnB1c2godG91Y2hlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLm9uRmluaXNoZWQodG91Y2hlZFBNcyk7IC8vIHRvZG86IG1ha2UgdGhlbSB1bmlxdWU/XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWN1cnNpdmUgY2FsbDogZmV0Y2ggdGhlIG5leHQgaW4gbGluZSBidXQgYWxsb3cgYSBiaXQgb2Ygc2xhY2sgc3VjaCB0aGF0XG4gICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudHMgY2FuIGZpcmUsIHJlbmRlcmluZyBpcyBkb25lIGFuZCBjb21tYW5kcyBjYW4gYmF0Y2ggdXBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuZG9TZW5kTmV4dCgpOyB9LCBfdGhpcy5zbGFja01TKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIGlmIChjb21tYW5kLmlkID09IFwiRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIlZhbHVlQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2Fubm90IGhhbmRsZSwgdW5rbm93biBjb21tYW5kIFwiICsgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgIGlmICghbW9kZWwpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGEgcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiAga25vd24gdG8gdGhlIGNsaWVudC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSBfdGhpcy5jbGllbnREb2xwaGluLmF0dHJpYnV0ZShhdHRyLnByb3BlcnR5TmFtZSwgYXR0ci5xdWFsaWZpZXIsIGF0dHIudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGF0dHIuaWQgJiYgYXR0ci5pZC5tYXRjaChcIi4qUyRcIikpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUuaWQgPSBhdHRyLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGNsaWVudEF0dHJpYnV0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY2xpZW50UG0gPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMS5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQsIHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgY2xpZW50UG0uYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgIGNsaWVudFBtLmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChjbGllbnRQbSk7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihjbGllbnRQbSk7XG4gICAgICAgIHJldHVybiBjbGllbnRQbTtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCB1cGRhdGUgb2xkIHZhbHVlIFwiICsgc2VydmVyQ29tbWFuZC5vbGRWYWx1ZSArIFwiIHRvIG5ldyB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpID09IHNlcnZlckNvbW1hbmQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJub3RoaW5nIHRvIGRvLiBuZXcgdmFsdWUgPT0gb2xkIHZhbHVlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQmVsb3cgd2FzIHRoZSBjb2RlIHRoYXQgd291bGQgZW5mb3JjZSB0aGF0IHZhbHVlIGNoYW5nZXMgb25seSBhcHBlYXIgd2hlbiB0aGUgcHJvcGVyIG9sZFZhbHVlIGlzIGdpdmVuLlxuICAgICAgICAvLyBXaGlsZSB0aGF0IHNlZW1lZCBhcHByb3ByaWF0ZSBhdCBmaXJzdCwgdGhlcmUgYXJlIGFjdHVhbGx5IHZhbGlkIGNvbW1hbmQgc2VxdWVuY2VzIHdoZXJlIHRoZSBvbGRWYWx1ZSBpcyBub3QgcHJvcGVybHkgc2V0LlxuICAgICAgICAvLyBXZSBsZWF2ZSB0aGUgY29tbWVudGVkIGNvZGUgaW4gdGhlIGNvZGViYXNlIHRvIGFsbG93IGZvciBsb2dnaW5nL2RlYnVnZ2luZyBzdWNoIGNhc2VzLlxuICAgICAgICAvLyAgICAgICAgICAgIGlmKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpICE9IHNlcnZlckNvbW1hbmQub2xkVmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIitzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkK1wiIGFuZCB2YWx1ZSBcIiArIGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpICtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgd2FzIHNldCB0byB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQubmV3VmFsdWUgKyBcIiBldmVuIHRob3VnaCB0aGUgY2hhbmdlIHdhcyBiYXNlZCBvbiBhbiBvdXRkYXRlZCBvbGQgdmFsdWUgb2YgXCIgKyBzZXJ2ZXJDb21tYW5kLm9sZFZhbHVlKTtcbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZShzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgY2xpZW50QXR0cmlidXRlW3NlcnZlckNvbW1hbmQubWV0YWRhdGFOYW1lXSA9IHNlcnZlckNvbW1hbmQudmFsdWU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgLy8vLy8vLy8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vLy8vLy8vLy8vXG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5wdXNoRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuZW5xdWV1ZVB1c2hDb21tYW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMucHVzaExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlcjoge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6IGZ1bmN0aW9uIChtb2RlbHMpIHsgbWUud2FpdGluZyA9IGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIG9uRmluaXNoZWREYXRhOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIC8vIHRvZG86IGhvdyB0byBpc3N1ZSBhIHdhcm5pbmcgaWYgbm8gcmVsZWFzZUNvbW1hbmQgaXMgc2V0P1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnNpZ25hbCh0aGlzLnJlbGVhc2VDb21tYW5kKTtcbiAgICB9O1xuICAgIHJldHVybiBDbGllbnRDb25uZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5DbGllbnRDb25uZWN0b3IgPSBDbGllbnRDb25uZWN0b3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudENvbm5lY3Rvci5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENsaWVudEF0dHJpYnV0ZV8xID0gcmVxdWlyZShcIi4vQ2xpZW50QXR0cmlidXRlXCIpO1xudmFyIENsaWVudFByZXNlbnRhdGlvbk1vZGVsXzEgPSByZXF1aXJlKFwiLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbFwiKTtcbnZhciBDbGllbnREb2xwaGluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnREb2xwaGluKCkge1xuICAgIH1cbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zZXRDbGllbnRDb25uZWN0b3IgPSBmdW5jdGlvbiAoY2xpZW50Q29ubmVjdG9yKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yID0gY2xpZW50Q29ubmVjdG9yO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0Q2xpZW50Q29ubmVjdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRDb25uZWN0b3I7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKTtcbiAgICB9O1xuICAgIC8vIGZhY3RvcnkgbWV0aG9kIGZvciBhdHRyaWJ1dGVzXG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYXR0cmlidXRlID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IENsaWVudEF0dHJpYnV0ZV8xLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpO1xuICAgIH07XG4gICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIHByZXNlbnRhdGlvbiBtb2RlbHNcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5wcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChpZCwgdHlwZSkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXR0cmlidXRlc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMS5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChtb2RlbCk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNldENsaWVudE1vZGVsU3RvcmUgPSBmdW5jdGlvbiAoY2xpZW50TW9kZWxTdG9yZSkge1xuICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0Q2xpZW50TW9kZWxTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKG1vZGVsVG9EZWxldGUpIHtcbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllciA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIgPSBmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7IC8vIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vL1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnN0YXJ0UHVzaExpc3RlbmluZyA9IGZ1bmN0aW9uIChwdXNoQ29tbWFuZCwgcmVsZWFzZUNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaExpc3RlbmVyKHB1c2hDb21tYW5kKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UmVsZWFzZUNvbW1hbmQocmVsZWFzZUNvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IubGlzdGVuKCk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zdG9wUHVzaExpc3RlbmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgIH07XG4gICAgcmV0dXJuIENsaWVudERvbHBoaW47XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2xpZW50RG9scGhpbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xpZW50RG9scGhpbi5qcy5tYXBcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvcmUtanMuZC50c1wiIC8+XG5cInVzZSBzdHJpY3RcIjtcbnZhciBBdHRyaWJ1dGVfMSA9IHJlcXVpcmUoXCIuL0F0dHJpYnV0ZVwiKTtcbnZhciBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiKTtcbnZhciBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbnZhciBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25fMSA9IHJlcXVpcmUoXCIuL0RlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiKTtcbnZhciBFdmVudEJ1c18xID0gcmVxdWlyZShcIi4vRXZlbnRCdXNcIik7XG52YXIgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbihmdW5jdGlvbiAoVHlwZSkge1xuICAgIFR5cGVbVHlwZVtcIkFEREVEXCJdID0gJ0FEREVEJ10gPSBcIkFEREVEXCI7XG4gICAgVHlwZVtUeXBlW1wiUkVNT1ZFRFwiXSA9ICdSRU1PVkVEJ10gPSBcIlJFTU9WRURcIjtcbn0pKGV4cG9ydHMuVHlwZSB8fCAoZXhwb3J0cy5UeXBlID0ge30pKTtcbnZhciBUeXBlID0gZXhwb3J0cy5UeXBlO1xudmFyIENsaWVudE1vZGVsU3RvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikge1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXNfMVtcImRlZmF1bHRcIl0oKTtcbiAgICB9XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZ2V0Q2xpZW50RG9scGhpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50RG9scGhpbjtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyTW9kZWwgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbm5lY3RvciA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKTtcbiAgICAgICAgdmFyIGNyZWF0ZVBNQ29tbWFuZCA9IG5ldyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRfMVtcImRlZmF1bHRcIl0obW9kZWwpO1xuICAgICAgICBjb25uZWN0b3Iuc2VuZChjcmVhdGVQTUNvbW1hbmQsIG51bGwpO1xuICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyQXR0cmlidXRlID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdoZW5ldmVyIGFuIGF0dHJpYnV0ZSBjaGFuZ2VzIGl0cyB2YWx1ZSwgdGhlIHNlcnZlciBuZWVkcyB0byBiZSBub3RpZmllZFxuICAgICAgICAvLyBhbmQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgYXJlIGdpdmVuIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZUNoYW5nZUNvbW1hbmQgPSBuZXcgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xW1wiZGVmYXVsdFwiXShhdHRyaWJ1dGUuaWQsIGV2dC5vbGRWYWx1ZSwgZXZ0Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIF90aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZCh2YWx1ZUNoYW5nZUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IF90aGlzLmZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgIT09IGF0dHJpYnV0ZSAmJiBhdHRyLmdldFF1YWxpZmllcigpID09IGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhdHRycy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0VmFsdWUoYXR0cmlidXRlLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXR0cmlidXRlLm9uUXVhbGlmaWVyQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VBdHRyTWV0YWRhdGFDbWQgPSBuZXcgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kXzFbXCJkZWZhdWx0XCJdKGF0dHJpYnV0ZS5pZCwgQXR0cmlidXRlXzFbXCJkZWZhdWx0XCJdLlFVQUxJRklFUl9QUk9QRVJUWSwgZXZ0Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIF90aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChjaGFuZ2VBdHRyTWV0YWRhdGFDbWQsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYWxyZWFkeSBpcyBhIFBNIHdpdGggaWQgXCIgKyBtb2RlbC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuc2V0KG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJNb2RlbChtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBUeXBlLkFEREVELCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkZWQ7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmRlbGV0ZShtb2RlbC5pZCk7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFR5cGUuUkVNT1ZFRCwgJ2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJzogbW9kZWwgfSk7XG4gICAgICAgICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIgPSBmdW5jdGlvbiAoZmlsdGVyKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVzZW50YXRpb25Nb2RlbHMgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzID0gW107XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuc2V0KHR5cGUsIHByZXNlbnRhdGlvbk1vZGVscyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpID4gLTEpKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMucHVzaChtb2RlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwgfHwgIShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMuc3BsaWNlKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5kZWxldGUobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMua2V5cygpO1xuICAgICAgICB2YXIgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB3aGlsZSAoIW5leHQuZG9uZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGl0ZXIgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy52YWx1ZXMoKTtcbiAgICAgICAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5nZXQoaWQpO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0eXBlIHx8ICF0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuaGFzKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSkuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChtb2RlbCwgbm90aWZ5KSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUobW9kZWwpO1xuICAgICAgICAgICAgaWYgKCFub3RpZnkgfHwgbW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChuZXcgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uXzFbXCJkZWZhdWx0XCJdKG1vZGVsLmlkKSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhpZCk7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5oYXMoYXR0cmlidXRlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkLnNldChhdHRyaWJ1dGUuaWQsIGF0dHJpYnV0ZSk7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhdGhpcy5hdHRyaWJ1dGVzUGVySWQuaGFzKGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5kZWxldGUoYXR0cmlidXRlLmlkKTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5nZXQoaWQpO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuc2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIWF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmRlbGV0ZShhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyID0gZnVuY3Rpb24gKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllciB8fCAhdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmhhcyhxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQocXVhbGlmaWVyKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLm9uTW9kZWxTdG9yZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLm9uTW9kZWxTdG9yZUNoYW5nZUZvclR5cGUgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWxUeXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZnVuY3Rpb24gKHBtU3RvcmVFdmVudCkge1xuICAgICAgICAgICAgaWYgKHBtU3RvcmVFdmVudC5jbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPT0gcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyKHBtU3RvcmVFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIENsaWVudE1vZGVsU3RvcmU7XG59KCkpO1xuZXhwb3J0cy5DbGllbnRNb2RlbFN0b3JlID0gQ2xpZW50TW9kZWxTdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xpZW50TW9kZWxTdG9yZS5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEV2ZW50QnVzXzEgPSByZXF1aXJlKCcuL0V2ZW50QnVzJyk7XG52YXIgcHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50ID0gMDsgLy8gdG9kbyBkazogY29uc2lkZXIgbWFraW5nIHRoaXMgc3RhdGljIGluIGNsYXNzXG52YXIgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJyAmJiBpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gKHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCsrKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEJ1cyA9IG5ldyBFdmVudEJ1c18xW1wiZGVmYXVsdFwiXSgpO1xuICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXNfMVtcImRlZmF1bHRcIl0oKTtcbiAgICB9XG4gICAgLy8gdG9kbyBkazogYWxpZ24gd2l0aCBKYXZhIHZlcnNpb246IG1vdmUgdG8gQ2xpZW50RG9scGhpbiBhbmQgYXV0by1hZGQgdG8gbW9kZWwgc3RvcmVcbiAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIGZvciBhbnl0aGluZyBidXQgSURzLiBQZXIgZGVmYXVsdCwgY29waWVzIGFyZSBjbGllbnQgc2lkZSBvbmx5LCBubyBhdXRvbWF0aWMgdXBkYXRlIGFwcGxpZXMuICovXG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwobnVsbCwgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICByZXN1bHQuY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVDb3B5ID0gYXR0cmlidXRlLmNvcHkoKTtcbiAgICAgICAgICAgIHJlc3VsdC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlQ29weSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgLy9hZGQgYXJyYXkgb2YgYXR0cmlidXRlc1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzIHx8IGF0dHJpYnV0ZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICBfdGhpcy5hZGRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgKHRoaXMuYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoYXR0cmlidXRlLnByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcHJvcGVydHkgbmFtZTogXCIgKyBhdHRyaWJ1dGUucHJvcGVydHlOYW1lXG4gICAgICAgICAgICAgICAgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpICYmIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcXVhbGlmaWVyOiBcIiArIGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlLnNldFByZXNlbnRhdGlvbk1vZGVsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBfdGhpcy5pbnZhbGlkQnVzLnRyaWdnZXIoeyBzb3VyY2U6IF90aGlzIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5vbkludmFsaWRhdGVkID0gZnVuY3Rpb24gKGhhbmRsZUludmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzLm9uRXZlbnQoaGFuZGxlSW52YWxpZGF0ZSk7XG4gICAgfTtcbiAgICAvKiogcmV0dXJucyBhIGNvcHkgb2YgdGhlIGludGVybmFsIHN0YXRlICovXG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmdldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2xpY2UoMCk7XG4gICAgfTtcbiAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBbGxBdHRyaWJ1dGVzQnlQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCh0aGlzLmF0dHJpYnV0ZXNbaV0ucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChxdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKCFxdWFsaWZpZXIpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uZ2V0UXVhbGlmaWVyKCkgPT0gcXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuc3luY1dpdGggPSBmdW5jdGlvbiAoc291cmNlUHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsLmdldEF0KHRhcmdldEF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBDbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbn0oKSk7XG5leHBvcnRzLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsID0gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudFByZXNlbnRhdGlvbk1vZGVsLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29kZWMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvZGVjKCkge1xuICAgIH1cbiAgICBDb2RlYy5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcyk7IC8vIHRvZG8gZGs6IGxvb2sgZm9yIHBvc3NpYmxlIEFQSSBzdXBwb3J0IGZvciBjaGFyYWN0ZXIgZW5jb2RpbmdcbiAgICB9O1xuICAgIENvZGVjLnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbiAodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodHJhbnNtaXR0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQ29kZWM7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ29kZWM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvZGVjLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29tbWFuZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICAgICAgdGhpcy5pZCA9IFwiZG9scGhpbi1jb3JlLWNvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIENvbW1hbmQ7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFZhbHVlQ2hhbmdlZENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vVmFsdWVDaGFuZ2VkQ29tbWFuZCcpO1xuLyoqIEEgQmF0Y2hlciB0aGF0IGRvZXMgbm8gYmF0Y2hpbmcgYnV0IG1lcmVseSB0YWtlcyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgcXVldWUgYXMgdGhlIHNpbmdsZSBpdGVtIGluIHRoZSBiYXRjaCAqL1xudmFyIE5vQ29tbWFuZEJhdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vQ29tbWFuZEJhdGNoZXIoKSB7XG4gICAgfVxuICAgIE5vQ29tbWFuZEJhdGNoZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKHF1ZXVlKSB7XG4gICAgICAgIHJldHVybiBbcXVldWUuc2hpZnQoKV07XG4gICAgfTtcbiAgICByZXR1cm4gTm9Db21tYW5kQmF0Y2hlcjtcbn0oKSk7XG5leHBvcnRzLk5vQ29tbWFuZEJhdGNoZXIgPSBOb0NvbW1hbmRCYXRjaGVyO1xuLyoqIEEgYmF0Y2hlciB0aGF0IGJhdGNoZXMgdGhlIGJsaW5kcyAoY29tbWFuZHMgd2l0aCBubyBjYWxsYmFjaykgYW5kIG9wdGlvbmFsbHkgYWxzbyBmb2xkcyB2YWx1ZSBjaGFuZ2VzICovXG52YXIgQmxpbmRDb21tYW5kQmF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqIGZvbGRpbmc6IHdoZXRoZXIgd2Ugc2hvdWxkIHRyeSBmb2xkaW5nIFZhbHVlQ2hhbmdlZENvbW1hbmRzICovXG4gICAgZnVuY3Rpb24gQmxpbmRDb21tYW5kQmF0Y2hlcihmb2xkaW5nLCBtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgaWYgKGZvbGRpbmcgPT09IHZvaWQgMCkgeyBmb2xkaW5nID0gdHJ1ZTsgfVxuICAgICAgICBpZiAobWF4QmF0Y2hTaXplID09PSB2b2lkIDApIHsgbWF4QmF0Y2hTaXplID0gNTA7IH1cbiAgICAgICAgdGhpcy5mb2xkaW5nID0gZm9sZGluZztcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemUgPSBtYXhCYXRjaFNpemU7XG4gICAgfVxuICAgIEJsaW5kQ29tbWFuZEJhdGNoZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKHF1ZXVlKSB7XG4gICAgICAgIHZhciBiYXRjaCA9IFtdO1xuICAgICAgICB2YXIgbiA9IE1hdGgubWluKHF1ZXVlLmxlbmd0aCwgdGhpcy5tYXhCYXRjaFNpemUpO1xuICAgICAgICBmb3IgKHZhciBjb3VudGVyID0gMDsgY291bnRlciA8IG47IGNvdW50ZXIrKykge1xuICAgICAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkaW5nICYmIGNhbmRpZGF0ZS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSAmJiAoIWNhbmRpZGF0ZS5oYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGNhbkNtZCA9IGNhbmRpZGF0ZS5jb21tYW5kO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmF0Y2gubGVuZ3RoICYmIGZvdW5kID09IG51bGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmF0Y2hbaV0uY29tbWFuZCBpbnN0YW5jZW9mIFZhbHVlQ2hhbmdlZENvbW1hbmRfMVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYXRjaENtZCA9IGJhdGNoW2ldLmNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FuQ21kLmF0dHJpYnV0ZUlkID09IGJhdGNoQ21kLmF0dHJpYnV0ZUlkICYmIGJhdGNoQ21kLm5ld1ZhbHVlID09IGNhbkNtZC5vbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gYmF0Y2hDbWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kLm5ld1ZhbHVlID0gY2FuQ21kLm5ld1ZhbHVlOyAvLyBjaGFuZ2UgZXhpc3RpbmcgdmFsdWUsIGRvIG5vdCBiYXRjaFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmhhbmRsZXIgfHxcbiAgICAgICAgICAgICAgICAoY2FuZGlkYXRlLmNvbW1hbmRbJ2NsYXNzTmFtZSddID09IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5FbXB0eU5vdGlmaWNhdGlvblwiKSAvLyBvciB1bmtub3duIGNsaWVudCBzaWRlIGVmZmVjdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIGxlYXZlIHRoZSBsb29wXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhdGNoO1xuICAgIH07XG4gICAgcmV0dXJuIEJsaW5kQ29tbWFuZEJhdGNoZXI7XG59KCkpO1xuZXhwb3J0cy5CbGluZENvbW1hbmRCYXRjaGVyID0gQmxpbmRDb21tYW5kQmF0Y2hlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29tbWFuZEJhdGNoZXIuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb21tYW5kQ29uc3RhbnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb21tYW5kQ29uc3RhbnRzKCkge1xuICAgIH1cbiAgICBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG4gICAgQ29tbWFuZENvbnN0YW50cy5DUkVBVEVfQ09OVEVYVF9DT01NQU5EX05BTUUgPSBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2luaXRDbGllbnRDb250ZXh0JztcbiAgICBDb21tYW5kQ29uc3RhbnRzLkRFU1RST1lfQ09OVEVYVF9DT01NQU5EX05BTUUgPSBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2Rpc2Nvbm5lY3RDbGllbnRDb250ZXh0JztcbiAgICBDb21tYW5kQ29uc3RhbnRzLkNSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVnaXN0ZXJDb250cm9sbGVyJztcbiAgICBDb21tYW5kQ29uc3RhbnRzLkRFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX05BTUUgPSBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2Rlc3Ryb3lDb250cm9sbGVyJztcbiAgICBDb21tYW5kQ29uc3RhbnRzLkNBTExfQ09OVFJPTExFUl9BQ1RJT05fQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdjYWxsQ29udHJvbGxlckFjdGlvbic7XG4gICAgQ29tbWFuZENvbnN0YW50cy5TVEFSVF9MT05HX1BPTExfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdsb25nUG9sbCc7XG4gICAgQ29tbWFuZENvbnN0YW50cy5JTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVsZWFzZSc7XG4gICAgcmV0dXJuIENvbW1hbmRDb25zdGFudHM7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ29tbWFuZENvbnN0YW50cztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29tbWFuZENvbnN0YW50cy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29tbWFuZENvbnN0YW50c18xID0gcmVxdWlyZShcIi4vQ29tbWFuZENvbnN0YW50c1wiKTtcbnZhciBDcmVhdGVDb250ZXh0Q29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENyZWF0ZUNvbnRleHRDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENyZWF0ZUNvbnRleHRDb21tYW5kKCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5pZCA9IENvbW1hbmRDb25zdGFudHNfMVtcImRlZmF1bHRcIl0uQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9OQU1FO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiY29tLmNhbm9vLmRvbHBoaW4uaW1wbC5jb21tYW5kcy5DcmVhdGVDb250ZXh0Q29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRlQ29udGV4dENvbW1hbmQ7XG59KENvbW1hbmRfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENyZWF0ZUNvbnRleHRDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DcmVhdGVDb250ZXh0Q29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pZCA9IFwiQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxcIjtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCI7XG4gICAgICAgIHRoaXMucG1JZCA9IHByZXNlbnRhdGlvbk1vZGVsLmlkO1xuICAgICAgICB0aGlzLnBtVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBhdHRyLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICBpZDogYXR0ci5pZCxcbiAgICAgICAgICAgICAgICBxdWFsaWZpZXI6IGF0dHIuZ2V0UXVhbGlmaWVyKCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGF0dHIuZ2V0VmFsdWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihwbUlkKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiO1xuICAgIH1cbiAgICByZXR1cm4gRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbi5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29tbWFuZENvbnN0YW50c18xID0gcmVxdWlyZShcIi4vQ29tbWFuZENvbnN0YW50c1wiKTtcbnZhciBEZXN0cm95Q29udGV4dENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhEZXN0cm95Q29udGV4dENvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRGVzdHJveUNvbnRleHRDb21tYW5kKCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5pZCA9IENvbW1hbmRDb25zdGFudHNfMVtcImRlZmF1bHRcIl0uREVTVFJPWV9DT05URVhUX0NPTU1BTkRfTkFNRTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcImNvbS5jYW5vby5kb2xwaGluLmltcGwuY29tbWFuZHMuRGVzdHJveUNvbnRleHRDb21tYW5kXCI7XG4gICAgfVxuICAgIHJldHVybiBEZXN0cm95Q29udGV4dENvbW1hbmQ7XG59KENvbW1hbmRfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IERlc3Ryb3lDb250ZXh0Q29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGVzdHJveUNvbnRleHRDb21tYW5kLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2xpZW50Q29ubmVjdG9yXzEgPSByZXF1aXJlKFwiLi9DbGllbnRDb25uZWN0b3JcIik7XG52YXIgQ2xpZW50RG9scGhpbl8xID0gcmVxdWlyZShcIi4vQ2xpZW50RG9scGhpblwiKTtcbnZhciBDbGllbnRNb2RlbFN0b3JlXzEgPSByZXF1aXJlKFwiLi9DbGllbnRNb2RlbFN0b3JlXCIpO1xudmFyIEh0dHBUcmFuc21pdHRlcl8xID0gcmVxdWlyZShcIi4vSHR0cFRyYW5zbWl0dGVyXCIpO1xudmFyIE5vVHJhbnNtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL05vVHJhbnNtaXR0ZXJcIik7XG52YXIgRG9scGhpbkJ1aWxkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIERvbHBoaW5CdWlsZGVyKCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICB9XG4gICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgdGhpcy51cmxfID0gdXJsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIChyZXNldCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IHJlc2V0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5zbGFja01TID0gZnVuY3Rpb24gKHNsYWNrTVMpIHtcbiAgICAgICAgdGhpcy5zbGFja01TXyA9IHNsYWNrTVM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLm1heEJhdGNoU2l6ZSA9IGZ1bmN0aW9uIChtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gbWF4QmF0Y2hTaXplO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5zdXBwb3J0Q09SUyA9IGZ1bmN0aW9uIChzdXBwb3J0Q09SUykge1xuICAgICAgICB0aGlzLnN1cHBvcnRDT1JTXyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5lcnJvckhhbmRsZXIgPSBmdW5jdGlvbiAoZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyXyA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuaGVhZGVyc0luZm8gPSBmdW5jdGlvbiAoaGVhZGVyc0luZm8pIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mb18gPSBoZWFkZXJzSW5mbztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbkRvbHBoaW4ganMgZm91bmRcIik7XG4gICAgICAgIHZhciBjbGllbnREb2xwaGluID0gbmV3IENsaWVudERvbHBoaW5fMVtcImRlZmF1bHRcIl0oKTtcbiAgICAgICAgdmFyIHRyYW5zbWl0dGVyO1xuICAgICAgICBpZiAodGhpcy51cmxfICE9IG51bGwgJiYgdGhpcy51cmxfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRyYW5zbWl0dGVyID0gbmV3IEh0dHBUcmFuc21pdHRlcl8xW1wiZGVmYXVsdFwiXSh0aGlzLnVybF8sIHRoaXMucmVzZXRfLCBcIlVURi04XCIsIHRoaXMuZXJyb3JIYW5kbGVyXywgdGhpcy5zdXBwb3J0Q09SU18sIHRoaXMuaGVhZGVyc0luZm9fKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zbWl0dGVyID0gbmV3IE5vVHJhbnNtaXR0ZXJfMVtcImRlZmF1bHRcIl0oKTtcbiAgICAgICAgfVxuICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudENvbm5lY3RvcihuZXcgQ2xpZW50Q29ubmVjdG9yXzEuQ2xpZW50Q29ubmVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCB0aGlzLnNsYWNrTVNfLCB0aGlzLm1heEJhdGNoU2l6ZV8pKTtcbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRNb2RlbFN0b3JlKG5ldyBDbGllbnRNb2RlbFN0b3JlXzEuQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50RG9scGhpbiBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgfTtcbiAgICByZXR1cm4gRG9scGhpbkJ1aWxkZXI7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRG9scGhpbkJ1aWxkZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURvbHBoaW5CdWlsZGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRXZlbnRCdXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50QnVzKCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMgPSBbXTtcbiAgICB9XG4gICAgRXZlbnRCdXMucHJvdG90eXBlLm9uRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfTtcbiAgICBFdmVudEJ1cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7IHJldHVybiBoYW5kbGUoZXZlbnQpOyB9KTtcbiAgICB9O1xuICAgIHJldHVybiBFdmVudEJ1cztcbn0oKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFdmVudEJ1cztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RXZlbnRCdXMuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDb2RlY18xID0gcmVxdWlyZShcIi4vQ29kZWNcIik7XG52YXIgSHR0cFRyYW5zbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIdHRwVHJhbnNtaXR0ZXIodXJsLCByZXNldCwgY2hhcnNldCwgZXJyb3JIYW5kbGVyLCBzdXBwb3J0Q09SUywgaGVhZGVyc0luZm8pIHtcbiAgICAgICAgaWYgKHJlc2V0ID09PSB2b2lkIDApIHsgcmVzZXQgPSB0cnVlOyB9XG4gICAgICAgIGlmIChjaGFyc2V0ID09PSB2b2lkIDApIHsgY2hhcnNldCA9IFwiVVRGLThcIjsgfVxuICAgICAgICBpZiAoZXJyb3JIYW5kbGVyID09PSB2b2lkIDApIHsgZXJyb3JIYW5kbGVyID0gbnVsbDsgfVxuICAgICAgICBpZiAoc3VwcG9ydENPUlMgPT09IHZvaWQgMCkgeyBzdXBwb3J0Q09SUyA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChoZWFkZXJzSW5mbyA9PT0gdm9pZCAwKSB7IGhlYWRlcnNJbmZvID0gbnVsbDsgfVxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5jaGFyc2V0ID0gY2hhcnNldDtcbiAgICAgICAgdGhpcy5IdHRwQ29kZXMgPSB7XG4gICAgICAgICAgICBmaW5pc2hlZDogNCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IDIwMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SUyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gaGVhZGVyc0luZm87XG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLnNpZyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBpZiAodGhpcy5zdXBwb3J0Q09SUykge1xuICAgICAgICAgICAgaWYgKFwid2l0aENyZWRlbnRpYWxzXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7IC8vIE5PVEU6IGRvaW5nIHRoaXMgZm9yIG5vbiBDT1JTIHJlcXVlc3RzIGhhcyBubyBpbXBhY3RcbiAgICAgICAgICAgICAgICB0aGlzLnNpZy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29kZWMgPSBuZXcgQ29kZWNfMVtcImRlZmF1bHRcIl0oKTtcbiAgICAgICAgaWYgKHJlc2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSHR0cFRyYW5zbWl0dGVyLmludmFsaWRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2UgQ2xpZW50RG9scGhpbi5yZXNldChPblN1Y2Nlc3NIYW5kbGVyKSBpbnN0ZWFkJyk7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLnRyYW5zbWl0ID0gZnVuY3Rpb24gKGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5odHRwLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignb25lcnJvcicsIFwiXCIpO1xuICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5odHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5odHRwLnJlYWR5U3RhdGUgPT0gX3RoaXMuSHR0cENvZGVzLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmh0dHAuc3RhdHVzID09IF90aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSBfdGhpcy5odHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VDb21tYW5kcyA9IF90aGlzLmNvZGVjLmRlY29kZShyZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShyZXNwb25zZUNvbW1hbmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VycmVkIHBhcnNpbmcgcmVzcG9uc2VUZXh0OiBcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluY29ycmVjdCByZXNwb25zZVRleHQ6IFwiLCByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBlbXB0eSByZXNwb25zZVRleHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSFRUUCBTdGF0dXMgIT0gMjAwXCIpO1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLmh0dHApO1xuICAgICAgICBpZiAoXCJvdmVycmlkZU1pbWVUeXBlXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICB0aGlzLmh0dHAub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9XCIgKyB0aGlzLmNoYXJzZXQpOyAvLyB0b2RvIG1ha2UgaW5qZWN0YWJsZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaHR0cC5zZW5kKHRoaXMuY29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgfTtcbiAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNldEhlYWRlcnMgPSBmdW5jdGlvbiAoaHR0cFJlcSkge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5oYW5kbGVFcnJvciA9IGZ1bmN0aW9uIChraW5kLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBlcnJvckV2ZW50ID0geyBraW5kOiBraW5kLCB1cmw6IHRoaXMudXJsLCBodHRwU3RhdHVzOiB0aGlzLmh0dHAuc3RhdHVzLCBtZXNzYWdlOiBtZXNzYWdlIH07XG4gICAgICAgIGlmICh0aGlzLmVycm9ySGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIoZXJyb3JFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VycmVkOiBcIiwgZXJyb3JFdmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUuc2lnbmFsID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5zaWcub3BlbignUE9TVCcsIHRoaXMudXJsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKHRoaXMuc2lnKTtcbiAgICAgICAgdGhpcy5zaWcuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShbY29tbWFuZF0pKTtcbiAgICB9O1xuICAgIC8vIERlcHJlY2F0ZWQgISBVc2UgJ3Jlc2V0KE9uU3VjY2Vzc0hhbmRsZXIpIGluc3RlYWRcbiAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwgKyAnaW52YWxpZGF0ZT8nLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuaHR0cC5zZW5kKCk7XG4gICAgfTtcbiAgICByZXR1cm4gSHR0cFRyYW5zbWl0dGVyO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEh0dHBUcmFuc21pdHRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SHR0cFRyYW5zbWl0dGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBTaWduYWxDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9TaWduYWxDb21tYW5kXCIpO1xudmFyIENvbW1hbmRDb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL0NvbW1hbmRDb25zdGFudHNcIik7XG52YXIgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgQ29tbWFuZENvbnN0YW50c18xW1wiZGVmYXVsdFwiXS5JTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRSk7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJjb20uY2Fub28uZG9scGhpbi5pbXBsLmNvbW1hbmRzLkludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kO1xufShTaWduYWxDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBBIHRyYW5zbWl0dGVyIHRoYXQgaXMgbm90IHRyYW5zbWl0dGluZyBhdCBhbGwuXG4gKiBJdCBtYXkgc2VydmUgYXMgYSBzdGFuZC1pbiB3aGVuIG5vIHJlYWwgdHJhbnNtaXR0ZXIgaXMgbmVlZGVkLlxuICovXG52YXIgTm9UcmFuc21pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTm9UcmFuc21pdHRlcigpIHtcbiAgICB9XG4gICAgTm9UcmFuc21pdHRlci5wcm90b3R5cGUudHJhbnNtaXQgPSBmdW5jdGlvbiAoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nIHNwZWNpYWxcbiAgICAgICAgb25Eb25lKFtdKTtcbiAgICB9O1xuICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNpZ25hbCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9O1xuICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKHN1Y2Nlc3NIYW5kbGVyKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9O1xuICAgIHJldHVybiBOb1RyYW5zbWl0dGVyO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IE5vVHJhbnNtaXR0ZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vVHJhbnNtaXR0ZXIuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBEb2xwaGluQnVpbGRlcl8xID0gcmVxdWlyZShcIi4vRG9scGhpbkJ1aWxkZXJcIik7XG52YXIgQ3JlYXRlQ29udGV4dENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NyZWF0ZUNvbnRleHRDb21tYW5kXCIpO1xudmFyIERlc3Ryb3lDb250ZXh0Q29tbWFuZF8xID0gcmVxdWlyZShcIi4vRGVzdHJveUNvbnRleHRDb21tYW5kXCIpO1xudmFyIEludGVycnVwdExvbmdQb2xsQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kXCIpO1xudmFyIFN0YXJ0TG9uZ1BvbGxDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9TdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbi8qKlxuICogSlMtZnJpZW5kbHkgZmFjYWRlIHRvIGF2b2lkIHRvbyBtYW55IGRlcGVuZGVuY2llcyBpbiBwbGFpbiBKUyBjb2RlLlxuICogVGhlIG5hbWUgb2YgdGhpcyBmaWxlIGlzIGFsc28gdXNlZCBmb3IgdGhlIGluaXRpYWwgbG9va3VwIG9mIHRoZVxuICogb25lIGphdmFzY3JpcHQgZmlsZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZG9scGhpbiBjb2RlLlxuICogQ2hhbmdpbmcgdGhlIG5hbWUgcmVxdWlyZXMgdGhlIGJ1aWxkIHN1cHBvcnQgYW5kIGFsbCB1c2Vyc1xuICogdG8gYmUgdXBkYXRlZCBhcyB3ZWxsLlxuICogRGllcmsgS29lbmlnXG4gKi9cbi8vIGZhY3RvcnkgbWV0aG9kIGZvciB0aGUgaW5pdGlhbGl6ZWQgZG9scGhpblxuLy8gRGVwcmVjYXRlZCAhIFVzZSAnbWFrZURvbHBoaW4oKSBpbnN0ZWFkXG5mdW5jdGlvbiBkb2xwaGluKHVybCwgcmVzZXQsIHNsYWNrTVMpIHtcbiAgICBpZiAoc2xhY2tNUyA9PT0gdm9pZCAwKSB7IHNsYWNrTVMgPSAzMDA7IH1cbiAgICByZXR1cm4gbWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChyZXNldCkuc2xhY2tNUyhzbGFja01TKS5idWlsZCgpO1xufVxuZXhwb3J0cy5kb2xwaGluID0gZG9scGhpbjtcbi8vIGZhY3RvcnkgbWV0aG9kIHRvIGJ1aWxkIGFuIGluaXRpYWxpemVkIGRvbHBoaW5cbmZ1bmN0aW9uIG1ha2VEb2xwaGluKCkge1xuICAgIHJldHVybiBuZXcgRG9scGhpbkJ1aWxkZXJfMVtcImRlZmF1bHRcIl0oKTtcbn1cbmV4cG9ydHMubWFrZURvbHBoaW4gPSBtYWtlRG9scGhpbjtcbi8vRmFjdG9yeSBtZXRob2RzIHRvIGhhdmUgYSBiZXR0ZXIgaW50ZWdyYXRpb24gb2YgdHMgc291cmNlcyBpbiBKUyAmIGVzNlxuZnVuY3Rpb24gY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIG5ldyBDcmVhdGVDb250ZXh0Q29tbWFuZF8xW1wiZGVmYXVsdFwiXSgpO1xufVxuZXhwb3J0cy5jcmVhdGVDcmVhdGVDb250ZXh0Q29tbWFuZCA9IGNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kO1xuZnVuY3Rpb24gY3JlYXRlRGVzdHJveUNvbnRleHRDb21tYW5kKCkge1xuICAgIHJldHVybiBuZXcgRGVzdHJveUNvbnRleHRDb21tYW5kXzFbXCJkZWZhdWx0XCJdKCk7XG59XG5leHBvcnRzLmNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCA9IGNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZDtcbmZ1bmN0aW9uIGNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICByZXR1cm4gbmV3IEludGVycnVwdExvbmdQb2xsQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSgpO1xufVxuZXhwb3J0cy5jcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQgPSBjcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQ7XG5mdW5jdGlvbiBjcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICByZXR1cm4gbmV3IFN0YXJ0TG9uZ1BvbGxDb21tYW5kXzFbXCJkZWZhdWx0XCJdKCk7XG59XG5leHBvcnRzLmNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kID0gY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU9wZW5Eb2xwaGluLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBTaWduYWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2lnbmFsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaWduYWxDb21tYW5kKG5hbWUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaWQgPSBuYW1lO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5TaWduYWxDb21tYW5kXCI7XG4gICAgfVxuICAgIHJldHVybiBTaWduYWxDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTaWduYWxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TaWduYWxDb21tYW5kLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbnZhciBDb21tYW5kQ29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9Db21tYW5kQ29uc3RhbnRzXCIpO1xudmFyIFN0YXJ0TG9uZ1BvbGxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RhcnRMb25nUG9sbENvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3RhcnRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmlkID0gQ29tbWFuZENvbnN0YW50c18xW1wiZGVmYXVsdFwiXS5TVEFSVF9MT05HX1BPTExfQ09NTUFORF9OQU1FO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiY29tLmNhbm9vLmRvbHBoaW4uaW1wbC5jb21tYW5kcy5TdGFydExvbmdQb2xsQ29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gU3RhcnRMb25nUG9sbENvbW1hbmQ7XG59KENvbW1hbmRfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFN0YXJ0TG9uZ1BvbGxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdGFydExvbmdQb2xsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFZhbHVlQ2hhbmdlZENvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMub2xkVmFsdWUgPSBvbGRWYWx1ZTtcbiAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmlkID0gXCJWYWx1ZUNoYW5nZWRcIjtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gVmFsdWVDaGFuZ2VkQ29tbWFuZDtcbn0oQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gVmFsdWVDaGFuZ2VkQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VmFsdWVDaGFuZ2VkQ29tbWFuZC5qcy5tYXBcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCAgTWFwIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlYW5NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFzc1JlcG9zaXRvcnkpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyKGNsYXNzUmVwb3NpdG9yeSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcblxuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5hZGRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnJlbW92ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy51cGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYWxsQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbFJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbFVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gW107XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5BZGRlZC1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhblJlbW92ZWQoKHR5cGUsIGJlYW4pID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5SZW1vdmVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhblVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cykgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cblxuICAgIG5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG5cbiAgICBub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaW5kZXgsICdpbmRleCcpO1xuICAgICAgICBjaGVja1BhcmFtKGNvdW50LCAnY291bnQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKTtcbiAgICB9XG5cblxuICAgIGlzTWFuYWdlZChiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5pc01hbmFnZWQoYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmlzTWFuYWdlZCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgY3JlYXRlKHR5cGUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmNyZWF0ZSh0eXBlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uY3JlYXRlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGQodHlwZSwgYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkKHR5cGUsIGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmFkZEFsbCh0eXBlLCBjb2xsZWN0aW9uKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5hZGRBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZShiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmUoYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZSgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlQWxsKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUFsbChjb2xsZWN0aW9uKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbGxlY3Rpb24sICdjb2xsZWN0aW9uJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlQWxsKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVJZihwcmVkaWNhdGUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUlmKHByZWRpY2F0ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcmVkaWNhdGUsICdwcmVkaWNhdGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVJZigpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgb25BZGRlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblJlbW92ZWQodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYucmVtb3ZlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYudXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCAgTWFwIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQgKiBhcyBjb25zdHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbnZhciBibG9ja2VkID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xhc3NSZXBvc2l0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeShkb2xwaGluKScpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3MgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmaXhUeXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQllURTpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNIT1JUOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuSU5UOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9ORzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRkxPQVQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET1VCTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQk9PTEVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RydWUnID09PSBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5TVFJJTkc6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5FTlVNOlxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmcm9tRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuREFURTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuVG9Eb2xwaGluLmdldCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZW5kTGlzdFNwbGljZShjbGFzc1JlcG9zaXRvcnksIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgZnJvbSwgdG8sIG5ld0VsZW1lbnRzKSB7XG4gICAgICAgIGxldCBkb2xwaGluID0gY2xhc3NSZXBvc2l0b3J5LmRvbHBoaW47XG4gICAgICAgIGxldCBtb2RlbCA9IGRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzSW5mbyA9IGNsYXNzUmVwb3NpdG9yeS5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkpIHtcblxuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnQEBAIFNPVVJDRV9TWVNURU0gQEBAJywgbnVsbCwgJ2NsaWVudCcpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnc291cmNlJywgbnVsbCwgbW9kZWxJZCksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBudWxsLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnZnJvbScsIG51bGwsIGZyb20pLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgndG8nLCBudWxsLCB0byksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdjb3VudCcsIG51bGwsIG5ld0VsZW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChkb2xwaGluLmF0dHJpYnV0ZShpbmRleC50b1N0cmluZygpLCBudWxsLCBzZWxmLnRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGVsZW1lbnQpKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZG9scGhpbi5wcmVzZW50YXRpb25Nb2RlbC5hcHBseShkb2xwaGluLCBbbnVsbCwgJ0BEUDpMU0AnXS5jb25jYXQoYXR0cmlidXRlcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVMaXN0KGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGxldCBsaXN0ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoIWV4aXN0cyhsaXN0KSkge1xuICAgICAgICAgICAgY2xhc3NSZXBvc2l0b3J5LnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBbXSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJsb2NrKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoZXhpc3RzKGJsb2NrZWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byBjcmVhdGUgYSBibG9jayB3aGlsZSBhbm90aGVyIGJsb2NrIGV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrZWQgPSB7XG4gICAgICAgICAgICBiZWFuOiBiZWFuLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiBleGlzdHMoYmxvY2tlZCkgJiYgYmxvY2tlZC5iZWFuID09PSBiZWFuICYmIGJsb2NrZWQucHJvcGVydHlOYW1lID09PSBwcm9wZXJ0eU5hbWU7XG4gICAgfVxuXG4gICAgdW5ibG9jaygpIHtcbiAgICAgICAgYmxvY2tlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG5cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsSWQpKSB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzSW5mbyA9IHRoaXMuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHR5cGUpICYmIGV4aXN0cyhhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IGF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuc2V0VmFsdWUodGhpcy50b0RvbHBoaW4odGhpcywgdHlwZSwgbmV3VmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbURvbHBoaW4odGhpcywgdHlwZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaW5kZXgsICdpbmRleCcpO1xuICAgICAgICBjaGVja1BhcmFtKGNvdW50LCAnY291bnQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgICAgICBpZiAodGhpcy5pc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICAgICAgbGV0IGFycmF5ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsSWQpICYmIGV4aXN0cyhhcnJheSkpIHtcbiAgICAgICAgICAgIGxldCByZW1vdmVkRWxlbWVudHNDb3VudCA9IEFycmF5LmlzQXJyYXkocmVtb3ZlZEVsZW1lbnRzKSA/IHJlbW92ZWRFbGVtZW50cy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgdGhpcy5zZW5kTGlzdFNwbGljZSh0aGlzLCBtb2RlbElkLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBpbmRleCArIHJlbW92ZWRFbGVtZW50c0NvdW50LCBhcnJheS5zbGljZShpbmRleCwgaW5kZXggKyBjb3VudCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25CZWFuQWRkZWQoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblJlbW92ZWQoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblJlbW92ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkJlYW5VcGRhdGUoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQXJyYXlVcGRhdGUoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZWdpc3RlckNsYXNzKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhc3Nlcy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2xhc3NJbmZvID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkAvKSA8IDA7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc2VzLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICB0aGlzLmNsYXNzZXNbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICB9XG5cbiAgICBsb2FkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB2YXIgYmVhbiA9IHt9O1xuICAgICAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMCk7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgYmVhblthdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQub2xkVmFsdWUgIT09IGV2ZW50Lm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHNlbGYuZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5vbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHNlbGYuZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuLCBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbi5zZXQobW9kZWwuaWQsIGJlYW4pO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4uc2V0KGJlYW4sIG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBiZWFuO1xuICAgIH1cblxuICAgIHVubG9hZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVubG9hZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgbGV0IGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQobW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpblsnZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW5bJ2RlbGV0ZSddKGJlYW4pO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3NbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSkge1xuICAgICAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZWFuO1xuICAgIH1cblxuICAgIHNwbGljZUxpc3RFbnRyeShtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnNwbGljZUxpc3RFbnRyeShtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgbGV0IHNvdXJjZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnc291cmNlJyk7XG4gICAgICAgIGxldCBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2F0dHJpYnV0ZScpO1xuICAgICAgICBsZXQgZnJvbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnZnJvbScpO1xuICAgICAgICBsZXQgdG8gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3RvJyk7XG4gICAgICAgIGxldCBjb3VudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnY291bnQnKTtcblxuICAgICAgICBpZiAoZXhpc3RzKHNvdXJjZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkgJiYgZXhpc3RzKGZyb20pICYmIGV4aXN0cyh0bykgJiYgZXhpc3RzKGNvdW50KSkge1xuICAgICAgICAgICAgdmFyIGNsYXNzSW5mbyA9IHRoaXMuY2xhc3NJbmZvcy5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pICYmIGV4aXN0cyhjbGFzc0luZm8pKSB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICAgICAgLy92YXIgZW50cnkgPSBmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUxpc3QodGhpcywgdHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RWxlbWVudHMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudC52YWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFleGlzdHMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnRzLnB1c2godGhpcy5mcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlLCBmcm9tLnZhbHVlLCB0by52YWx1ZSAtIGZyb20udmFsdWUsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkLiBTb3VyY2UgYmVhbiB1bmtub3duLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW0pIHtcbiAgICAgICAgaWYgKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YgcGFyYW07XG4gICAgICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KHBhcmFtKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBjYW4gYmUgdXNlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ251bWJlcicgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGFuZCBwcmltaXRpdmUgdHlwZXMgY2FuIGJlIHVzZWRcIik7XG4gICAgfVxuXG4gICAgbWFwRG9scGhpblRvQmVhbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCBjb25zdHMuRE9MUEhJTl9CRUFOLCB2YWx1ZSk7XG4gICAgfVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG4vKiBnbG9iYWwgZXhwb3J0cyAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgT3BlbkRvbHBoaW4gZnJvbSAnLi4vb3BlbmRvbHBoaW4vYnVpbGQvT3BlbkRvbHBoaW4uanMnO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IENvbm5lY3RvciBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgQmVhbk1hbmFnZXIgZnJvbSAnLi9iZWFubWFuYWdlci5qcyc7XG5pbXBvcnQgQ2xhc3NSZXBvc2l0b3J5IGZyb20gJy4vY2xhc3NyZXBvLmpzJztcbmltcG9ydCBDb250cm9sbGVyTWFuYWdlciBmcm9tICcuL2NvbnRyb2xsZXJtYW5hZ2VyLmpzJztcbmltcG9ydCBDbGllbnRDb250ZXh0IGZyb20gJy4vY2xpZW50Y29udGV4dC5qcyc7XG5pbXBvcnQgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIgZnJvbSAnLi9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbnRleHRGYWN0b3J5e1xuXG4gICAgY3JlYXRlKHVybCwgY29uZmlnKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ2Nvbm5lY3QodXJsLCBjb25maWcpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBjbGllbnQgY29udGV4dCAnKyB1cmwgKycgICAgJysgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG5cbiAgICAgICAgbGV0IGJ1aWxkZXIgPSBPcGVuRG9scGhpbi5tYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KGZhbHNlKS5zbGFja01TKDQpLnN1cHBvcnRDT1JTKHRydWUpLm1heEJhdGNoU2l6ZShOdW1iZXIuTUFYX1NBRkVfSU5URUdFUik7XG4gICAgICAgIGlmIChleGlzdHMoY29uZmlnKSkge1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuZXJyb3JIYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuZXJyb3JIYW5kbGVyKGNvbmZpZy5lcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuaGVhZGVyc0luZm8pICYmIE9iamVjdC5rZXlzKGNvbmZpZy5oZWFkZXJzSW5mbykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuaGVhZGVyc0luZm8oY29uZmlnLmhlYWRlcnNJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkb2xwaGluID0gYnVpbGRlci5idWlsZCgpO1xuXG4gICAgICAgIHZhciB0cmFuc21pdHRlciA9IG5ldyBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcih1cmwsIGNvbmZpZyk7XG4gICAgICAgIHRyYW5zbWl0dGVyLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY2xpZW50Q29udGV4dC5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbHBoaW4uY2xpZW50Q29ubmVjdG9yLnRyYW5zbWl0dGVyID0gdHJhbnNtaXR0ZXI7XG5cbiAgICAgICAgdmFyIGNsYXNzUmVwb3NpdG9yeSA9IG5ldyBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbik7XG4gICAgICAgIHZhciBiZWFuTWFuYWdlciA9IG5ldyBCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpO1xuICAgICAgICB2YXIgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXJNYW5hZ2VyID0gbmV3IENvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKTtcblxuICAgICAgICB2YXIgY2xpZW50Q29udGV4dCA9IG5ldyBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudENvbnRleHQ7XG4gICAgfVxufVxuXG5leHBvcnRzLkNsaWVudENvbnRleHRGYWN0b3J5ID0gQ2xpZW50Q29udGV4dEZhY3Rvcnk7XG5cbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBPcGVuRG9scGhpbiBmcm9tICcuLi9vcGVuZG9scGhpbi9idWlsZC9PcGVuRG9scGhpbi5qcyc7XG5pbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuTWFuYWdlciwgJ2JlYW5NYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5jb25uZWN0KCk7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKE9wZW5Eb2xwaGluLmNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KCl7XG4gICAgICAgIGlmKGV4aXN0cyh0aGlzLmNvbm5lY3Rpb25Qcm9taXNlKSl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShPcGVuRG9scGhpbi5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmJlYW5NYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKENsaWVudENvbnRleHQucHJvdG90eXBlKTsiLCIvKiBDb3B5cmlnaHQgMjAxNiBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlY3tcblxuICAgIHN0YXRpYyBlbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AnOiBjb21tYW5kLnBtSWQsXG4gICAgICAgICAgICAndCc6IGNvbW1hbmQucG1UeXBlLFxuICAgICAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAnbic6IGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdpJzogYXR0cmlidXRlLmlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnYgPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcsXG4gICAgICAgICAgICAnY2xhc3NOYW1lJzogXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2NsaWVudFNpZGVPbmx5JzogZmFsc2UsXG4gICAgICAgICAgICAncG1JZCc6IGNvbW1hbmQucCxcbiAgICAgICAgICAgICdwbVR5cGUnOiBjb21tYW5kLnQsXG4gICAgICAgICAgICAnYXR0cmlidXRlcyc6IGNvbW1hbmQuYS5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eU5hbWUnOiBhdHRyaWJ1dGUubixcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogYXR0cmlidXRlLmksXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGUudik/IGF0dHJpYnV0ZS52IDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgJ3F1YWxpZmllcic6IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICAnYSc6IGNvbW1hbmQuYXR0cmlidXRlSWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm9sZFZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm8gPSBjb21tYW5kLm9sZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleGlzdHMoY29tbWFuZC5uZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5uID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuaWQgPSAnVmFsdWVDaGFuZ2VkJztcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnaWQnOiAnVmFsdWVDaGFuZ2VkJyxcbiAgICAgICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZUlkJzogY29tbWFuZC5hLFxuICAgICAgICAgICAgJ29sZFZhbHVlJzogZXhpc3RzKGNvbW1hbmQubyk/IGNvbW1hbmQubyA6IG51bGwsXG4gICAgICAgICAgICAnbmV3VmFsdWUnOiBleGlzdHMoY29tbWFuZC5uKT8gY29tbWFuZC5uIDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBlbmNvZGUoY29tbWFuZHMpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMubWFwKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKS5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSAnVmFsdWVDaGFuZ2VkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCBmcm9tICcuL2NvbW1hbmRzL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZC5qcyc7XG5pbXBvcnQgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jcmVhdGVDb250cm9sbGVyQ29tbWFuZC5qcyc7XG5pbXBvcnQgQ2FsbEFjdGlvbkNvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jYWxsQWN0aW9uQ29tbWFuZC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kRmFjdG9yeSB7XG5cbiAgICBzdGF0aWMgY3JlYXRlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJJZCkge1xuICAgICAgICByZXR1cm4gbmV3IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FsbEFjdGlvbkNvbW1hbmQoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgIH1cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbEFjdGlvbkNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmludm9rZShjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyaWQsICdjb250cm9sbGVyaWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnQ2FsbEFjdGlvbic7XG4gICAgICAgIHRoaXMuYyA9IGNvbnRyb2xsZXJpZDtcbiAgICAgICAgdGhpcy5uID0gYWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5wID0gcGFyYW1zO1xuICAgIH1cblxufSIsImltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbnZva2UoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyTmFtZSwgJ2NvbnRyb2xsZXJOYW1lJyk7XG5cbiAgICAgICAgdGhpcy5pZCA9ICdDcmVhdGVDb250cm9sbGVyJztcbiAgICAgICAgdGhpcy5uID0gY29udHJvbGxlck5hbWU7XG4gICAgICAgIHRoaXMucCA9IHBhcmVudENvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJJZCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcblxuICAgICAgICB0aGlzLmlkID0gJ0Rlc3Ryb3lDb250cm9sbGVyJztcbiAgICAgICAgdGhpcy5jID0gY29udHJvbGxlcklkO1xuICAgIH1cblxufSIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBPcGVuRG9scGhpbiBmcm9tICcuLi9vcGVuZG9scGhpbi9idWlsZC9PcGVuRG9scGhpbi5qcyc7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IENsaWVudE1vZGVsU3RvcmUgZnJvbSAnLi4vb3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50TW9kZWxTdG9yZSc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERPTFBISU5fQkVBTiA9ICdAQEAgRE9MUEhJTl9CRUFOIEBAQCc7XG5jb25zdCBBQ1RJT05fQ0FMTF9CRUFOID0gJ0BAQCBDT05UUk9MTEVSX0FDVElPTl9DQUxMX0JFQU4gQEBAJztcbmNvbnN0IEhJR0hMQU5ERVJfQkVBTiA9ICdAQEAgSElHSExBTkRFUl9CRUFOIEBAQCc7XG5jb25zdCBET0xQSElOX0xJU1RfU1BMSUNFID0gJ0BEUDpMU0AnO1xuY29uc3QgU09VUkNFX1NZU1RFTSA9ICdAQEAgU09VUkNFX1NZU1RFTSBAQEAnO1xuY29uc3QgU09VUkNFX1NZU1RFTV9DTElFTlQgPSAnY2xpZW50JztcbmNvbnN0IFNPVVJDRV9TWVNURU1fU0VSVkVSID0gJ3NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3RvcntcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKScpO1xuICAgICAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUmVzb2x2ZXIgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICBzZWxmLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkub25Nb2RlbFN0b3JlQ2hhbmdlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gZXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgICAgICBsZXQgc291cmNlU3lzdGVtID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKFNPVVJDRV9TWVNURU0pO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhzb3VyY2VTeXN0ZW0pICYmIHNvdXJjZVN5c3RlbS52YWx1ZSA9PT0gU09VUkNFX1NZU1RFTV9TRVJWRVIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBDbGllbnRNb2RlbFN0b3JlLlR5cGUuQURERUQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBDbGllbnRNb2RlbFN0b3JlLlR5cGUuUkVNT1ZFRCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxSZW1vdmVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5kb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhPcGVuRG9scGhpbi5jcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpLCBPcGVuRG9scGhpbi5jcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSk7XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIG9uTW9kZWxBZGRlZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxBZGRlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBBQ1RJT05fQ0FMTF9CRUFOOlxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhJR0hMQU5ERVJfQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NQTElDRTpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb2RlbFJlbW92ZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsUmVtb3ZlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5pbnZva2UoY29tbWFuZCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCAnY29tbWFuZCcpO1xuXG4gICAgICAgIHZhciBkb2xwaGluID0gdGhpcy5kb2xwaGluO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGRvbHBoaW4uc2VuZChjb21tYW5kLCB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEhpZ2hsYW5kZXJQTSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGxhbmRlclBNUHJvbWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydHMuU09VUkNFX1NZU1RFTSA9IFNPVVJDRV9TWVNURU07XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fQ0xJRU5UID0gU09VUkNFX1NZU1RFTV9DTElFTlQ7XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fU0VSVkVSID0gU09VUkNFX1NZU1RFTV9TRVJWRVI7XG5leHBvcnRzLkFDVElPTl9DQUxMX0JFQU4gPSBBQ1RJT05fQ0FMTF9CRUFOO1xuIiwiZXhwb3J0IGNvbnN0IERPTFBISU5fQkVBTiA9IDA7XG5leHBvcnQgY29uc3QgQllURSA9IDE7XG5leHBvcnQgY29uc3QgU0hPUlQgPSAyO1xuZXhwb3J0IGNvbnN0IElOVCA9IDM7XG5leHBvcnQgY29uc3QgTE9ORyA9IDQ7XG5leHBvcnQgY29uc3QgRkxPQVQgPSA1O1xuZXhwb3J0IGNvbnN0IERPVUJMRSA9IDY7XG5leHBvcnQgY29uc3QgQk9PTEVBTiA9IDc7XG5leHBvcnQgY29uc3QgU1RSSU5HID0gODtcbmV4cG9ydCBjb25zdCBEQVRFID0gOTtcbmV4cG9ydCBjb25zdCBFTlVNID0gMTA7XG5leHBvcnQgY29uc3QgQ0FMRU5EQVIgPSAxMTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX0ZJRUxEX1RZUEUgPSA1NTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDUyO1xuZXhwb3J0IGNvbnN0IFpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFID0gNTQ7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgU2V0IGZyb20nLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IENvbnRyb2xsZXJQcm94eSBmcm9tICcuL2NvbnRyb2xsZXJwcm94eS5qcyc7XG5cbmltcG9ydCB7Q29tbWFuZEZhY3Rvcnl9IGZyb20gJy4vY29tbWFuZEZhY3RvcnkuanMnO1xuXG5cbmltcG9ydCB7IFNPVVJDRV9TWVNURU0gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNX0NMSUVOVCB9IGZyb20gJy4vY29ubmVjdG9yLmpzJztcbmltcG9ydCB7IEFDVElPTl9DQUxMX0JFQU4gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5cbmNvbnN0IENPTlRST0xMRVJfSUQgPSAnY29udHJvbGxlcklkJztcbmNvbnN0IE1PREVMID0gJ21vZGVsJztcbmNvbnN0IEVSUk9SX0NPREUgPSAnZXJyb3JDb2RlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlck1hbmFnZXJ7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3RvciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmNvbm5lY3RvciA9IGNvbm5lY3RvcjtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgbnVsbClcbiAgICB9XG5cbiAgICBfY3JlYXRlQ29udHJvbGxlcihuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJJZCwgbW9kZWxJZCwgbW9kZWwsIGNvbnRyb2xsZXI7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbigoaGlnaGxhbmRlclBNKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKG5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVySWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKE1PREVMKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcERvbHBoaW5Ub0JlYW4obW9kZWxJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmFkZChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmludm9rZUFjdGlvbihjb250cm9sbGVySWQsIGFjdGlvbk5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xuXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKFNPVVJDRV9TWVNURU0sIG51bGwsIFNPVVJDRV9TWVNURU1fQ0xJRU5UKSxcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEVSUk9SX0NPREUpXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBsZXQgcG0gPSBzZWxmLmRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoc2VsZi5kb2xwaGluLCBbbnVsbCwgQUNUSU9OX0NBTExfQkVBTl0uY29uY2F0KGF0dHJpYnV0ZXMpKTtcblxuICAgICAgICAgICAgbGV0IGFjdGlvblBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgaWYoZXhpc3RzKHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcFBhcmFtVG9Eb2xwaGluKHBhcmFtc1twYXJhbV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUGFyYW1zLnB1c2goe246IHBhcmFtLCB2OiB2YWx1ZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ2FsbEFjdGlvbkNvbW1hbmQoY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBhY3Rpb25QYXJhbXMpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXNFcnJvciA9IHBtLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShFUlJPUl9DT0RFKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGlmIChpc0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJDb250cm9sbGVyQWN0aW9uIGNhdXNlZCBhbiBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwocG0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc3Ryb3lDb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKGNvbnRyb2xsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlciwgJ2NvbnRyb2xsZXInKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbigoaGlnaGxhbmRlclBNKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5kZWxldGUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5zZXRWYWx1ZShjb250cm9sbGVyLmNvbnRyb2xsZXJJZCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVyLmdldElkKCkpKS50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGxldCBjb250cm9sbGVyc0NvcHkgPSB0aGlzLmNvbnRyb2xsZXJzO1xuICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICAgICAgY29udHJvbGxlcnNDb3B5LmZvckVhY2goKGNvbnRyb2xsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChjb250cm9sbGVyLmRlc3Ryb3koKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbn1cbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBTZXQgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlclByb3h5e1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obWFuYWdlciwgJ21hbmFnZXInKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJZCA9IGNvbnRyb2xsZXJJZDtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySWQ7XG4gICAgfVxuXG4gICAgaW52b2tlKG5hbWUsIHBhcmFtcyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkuaW52b2tlKG5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmludm9rZUFjdGlvbih0aGlzLmNvbnRyb2xsZXJJZCwgbmFtZSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5fY3JlYXRlQ29udHJvbGxlcihuYW1lLCB0aGlzLmdldElkKCkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKXtcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25EZXN0cm95ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5kZXN0cm95Q29udHJvbGxlcih0aGlzKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3llZChoYW5kbGVyKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eS5vbkRlc3Ryb3llZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMuYWRkKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLm9uRGVzdHJveWVkSGFuZGxlcnMuZGVsZXRlKGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEb2xwaGluUmVtb3RpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdSZW1vdGluZyBFcnJvcicsIGRldGFpbCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGV0YWlsID0gZGV0YWlsIHx8IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9scGhpblNlc3Npb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdTZXNzaW9uIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdIdHRwIFJlc3BvbnNlIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwTmV0d29ya0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBOZXR3b3JrIEVycm9yJykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG59IiwiLyogQ29weXJpZ2h0IDIwMTYgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBFbWl0dGVyIGZyb20gJ2VtaXR0ZXItY29tcG9uZW50JztcblxuXG5pbXBvcnQgeyBleGlzdHMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERvbHBoaW5SZW1vdGluZ0Vycm9yLCBIdHRwTmV0d29ya0Vycm9yLCBEb2xwaGluU2Vzc2lvbkVycm9yLCBIdHRwUmVzcG9uc2VFcnJvciB9IGZyb20gJy4vZXJyb3JzLmpzJztcbmltcG9ydCBDb2RlYyBmcm9tICcuL2NvZGVjLmpzJztcbmltcG9ydCBSZW1vdGluZ0Vycm9ySGFuZGxlciBmcm9tICcuL3JlbW90aW5nRXJyb3JIYW5kbGVyJztcblxuXG5jb25zdCBGSU5JU0hFRCA9IDQ7XG5jb25zdCBTVUNDRVNTID0gMjAwO1xuY29uc3QgUkVRVUVTVF9USU1FT1VUID0gNDA4O1xuXG5jb25zdCBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xuY29uc3QgQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkb2xwaGluQ2xpZW50SWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm8gPSBleGlzdHMoY29uZmlnKSA/IGNvbmZpZy5oZWFkZXJzSW5mbyA6IG51bGw7XG4gICAgICAgIGxldCBjb25uZWN0aW9uQ29uZmlnID0gZXhpc3RzKGNvbmZpZykgPyBjb25maWcuY29ubmVjdGlvbiA6IG51bGw7XG4gICAgICAgIHRoaXMubWF4UmV0cnkgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcubWF4UmV0cnkpP2Nvbm5lY3Rpb25Db25maWcubWF4UmV0cnk6IDM7XG4gICAgICAgIHRoaXMudGltZW91dCA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy50aW1lb3V0KT9jb25uZWN0aW9uQ29uZmlnLnRpbWVvdXQ6IDUwMDA7XG4gICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgIH1cblxuICAgIF9oYW5kbGVFcnJvcihyZWplY3QsIGVycm9yKSB7XG4gICAgICAgIGxldCBjb25uZWN0aW9uQ29uZmlnID0gZXhpc3RzKHRoaXMuY29uZmlnKSA/IHRoaXMuY29uZmlnLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICBsZXQgZXJyb3JIYW5kbGVycyA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy5lcnJvckhhbmRsZXJzKT9jb25uZWN0aW9uQ29uZmlnLmVycm9ySGFuZGxlcnM6IFtuZXcgUmVtb3RpbmdFcnJvckhhbmRsZXIoKV07XG4gICAgICAgIGVycm9ySGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICBfc2VuZChjb21tYW5kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgaHR0cC5vbmVycm9yID0gKGVycm9yQ29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IEh0dHBOZXR3b3JrRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBOZXR3b3JrIGVycm9yJywgZXJyb3JDb250ZW50KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChodHRwLnJlYWR5U3RhdGUgPT09IEZJTklTSEVEKXtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChodHRwLnN0YXR1cykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFNVQ0NFU1M6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENsaWVudElkID0gaHR0cC5nZXRSZXNwb25zZUhlYWRlcihDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhjdXJyZW50Q2xpZW50SWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHModGhpcy5jbGllbnRJZCkgJiYgdGhpcy5jbGllbnRJZCAhPT0gY3VycmVudENsaWVudElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBEb2xwaGluU2Vzc2lvbkVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogQ2xpZW50SWQgb2YgdGhlIHJlc3BvbnNlIGRpZCBub3QgbWF0Y2gnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnRJZCA9IGN1cnJlbnRDbGllbnRJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBEb2xwaGluU2Vzc2lvbkVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogU2VydmVyIGRpZCBub3Qgc2VuZCBhIGNsaWVudElkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGh0dHAucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRVFVRVNUX1RJTUVPVVQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlc3Npb24gVGltZW91dCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZhaWxlZF9hdHRlbXB0IDw9IHRoaXMubWF4UmV0cnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gdGhpcy5mYWlsZWRfYXR0ZW1wdCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IEh0dHBSZXNwb25zZUVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogSFRUUCBTdGF0dXMgIT0gMjAwICgnICsgaHR0cC5zdGF0dXMgKyAnKScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGh0dHAub3BlbignUE9TVCcsIHRoaXMudXJsKTtcbiAgICAgICAgICAgIGlmIChleGlzdHModGhpcy5jbGllbnRJZCkpIHtcbiAgICAgICAgICAgICAgICBodHRwLnNldFJlcXVlc3RIZWFkZXIoQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUsIHRoaXMuY2xpZW50SWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuaGVhZGVyc0luZm8pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlcnNJbmZvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwLnNldFJlcXVlc3RIZWFkZXIoaSwgdGhpcy5oZWFkZXJzSW5mb1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5mYWlsZWRfYXR0ZW1wdCA+IHRoaXMubWF4UmV0cnkpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBodHRwLnNlbmQoQ29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy50aW1lb3V0KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGh0dHAuc2VuZChDb2RlYy5lbmNvZGUoY29tbWFuZHMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0cmFuc21pdChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIHRoaXMuX3NlbmQoY29tbWFuZHMpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZVRleHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVRleHQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlQ29tbWFuZHMgPSBDb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShyZXNwb25zZUNvbW1hbmRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IERvbHBoaW5SZW1vdGluZ0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogUGFyc2UgZXJyb3I6IChJbmNvcnJlY3QgcmVzcG9uc2UgPSAnICsgcmVzcG9uc2VUZXh0ICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBEb2xwaGluUmVtb3RpbmdFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEVtcHR5IHJlc3BvbnNlJykpO1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNpZ25hbChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuX3NlbmQoW2NvbW1hbmRdKVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcikpO1xuICAgIH1cbn1cblxuRW1pdHRlcihQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUpO1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGluZ0Vycm9ySGFuZGxlciB7XG5cbiAgICBvbkVycm9yKGVycm9yKSB7XG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG5cbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjaGVja01ldGhvZE5hbWU7XG5cbnZhciBleGlzdHMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0ICE9PSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZXhpc3RzID0gZXhpc3RzO1xuXG5tb2R1bGUuZXhwb3J0cy5jaGVja01ldGhvZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBjaGVja01ldGhvZE5hbWUgPSBuYW1lO1xufTtcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXJhbSA9IGZ1bmN0aW9uKHBhcmFtLCBwYXJhbWV0ZXJOYW1lKSB7XG4gICAgaWYgKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhcmFtZXRlciAnICsgcGFyYW1ldGVyTmFtZSArICcgaXMgbWFuZGF0b3J5IGluICcgKyBjaGVja01ldGhvZE5hbWUpO1xuICAgIH1cbn07XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIFBvbHltZXIsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQmluZGVyID0gcmVxdWlyZSgnLi9iaW5kZXIuanMnKS5CaW5kZXI7XG5cblxuZnVuY3Rpb24gZXhpc3RzKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59XG5cblxudmFyIGFycmF5S2V5QnVnO1xuZnVuY3Rpb24gcG9seW1lcjFfMWhhY2soZWxlbWVudCwgcGF0aCkge1xuICAgIC8vIFRoaXMgaXMgYSB0ZW1wb3JhcnkgaGFjayB0byBkZWFsIHdpdGggUG9seW1lcidzIEFQSSBjb25zaXN0ZW5jeSBjb25jZXJuaW5nIGFycmF5cyBhbmQgcGF0aHMuXG4gICAgLy8gQW4gb2JzZXJ2ZXIgdXNlcyBrZXlzIGluIGFuIGFycmF5LCB3aGlsZSB0aGUgZ2V0KCkgYW5kIHNldCgpIG1ldGhvZHMgZXhwZWN0IHRoZSBpbmRleC5cbiAgICAvLyBUaGlzIGlzIGhvcGVmdWxseSBmaXhlZCBpbiBQb2x5bWVyIDEuMi5cbiAgICBkbyB7XG4gICAgICAgIHZhciBwYXRoRWxlbWVudHMgPSBwYXRoLm1hdGNoKC9eKFteXFwuXSspXFwuKC4qKSQvKTtcbiAgICAgICAgdmFyIGtleSA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzFdIDogcGF0aDtcbiAgICAgICAgcGF0aCA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzJdIDogbnVsbDtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50KSkge1xuICAgICAgICAgICAgdmFyIGFycmF5S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIGlmIChpc05hTihhcnJheUtleSkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFBvbHltZXIuQ29sbGVjdGlvbi5nZXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGNvbGxlY3Rpb24uZ2V0SXRlbShhcnJheUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICB9XG4gICAgfSB3aGlsZSAocGF0aCAhPT0gbnVsbCAmJiBleGlzdHMoZWxlbWVudCkpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5mdW5jdGlvbiBuYXZpZ2F0ZVRvQmVhbihlbGVtZW50LCBwYXRoKSB7XG4gICAgdmFyIG5hdmlnYXRpb24gPSBwYXRoLm1hdGNoKC9eKC4qKVxcLlteXFwuXSokLyk7XG4gICAgaWYgKCEgZXhpc3RzKG5hdmlnYXRpb24pKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZXhpc3RzKGFycmF5S2V5QnVnKSkge1xuICAgICAgICAgICAgYXJyYXlLZXlCdWcgPSB0eXBlb2YgUG9seW1lci52ZXJzaW9uICE9PSAnc3RyaW5nJyB8fCAoUG9seW1lci52ZXJzaW9uLm1hdGNoKC9eMVxcLlswMV1cXC4vKSAhPT0gbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5S2V5QnVnPyBwb2x5bWVyMV8xaGFjayhlbGVtZW50LCBuYXZpZ2F0aW9uWzFdKSA6IGVsZW1lbnQuZ2V0KG5hdmlnYXRpb25bMV0sIGVsZW1lbnQpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpIHtcblxuICAgIHZhciBiaW5kZXIgPSBuZXcgQmluZGVyKGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9ICdJTklUSUFMSVpJTkcnO1xuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9ic2VydmVyczogWydfZG9scGhpbk9ic2VydmVyKG1vZGVsLiopJ10sXG5cbiAgICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBjbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUpLnRoZW4oZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAnUkVBRFknO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgnbW9kZWwnLCBjb250cm9sbGVyLm1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpcmUoJ2NvbnRyb2xsZXItcmVhZHknKTtcblxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLm9uRGVzdHJveWVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAnREVTVFJPWUVEJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0KCdtb2RlbCcsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5maXJlKCdjb250cm9sbGVyLWRlc3Ryb3llZCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGludm9rZTogZnVuY3Rpb24oYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBDYWxsIHRoaXMgYWZ0ZXIgaW5pdCBoYXMgZmluaXNoZWRcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09ICdSRUFEWScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb250cm9sbGVyLmludm9rZSgpIGNhbGxlZCBiZWZvcmUgaW5pdCgpIGZpbmlzaGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXIuaW52b2tlKGFjdGlvbk5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIF9kb2xwaGluT2JzZXJ2ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSAnUkVBRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBldmVudC5wYXRoO1xuICAgICAgICAgICAgICAgIHZhciBiZWFuLCBwcm9wZXJ0eU5hbWUsIGksIGo7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gZXZlbnQudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5ld1ZhbHVlKSAmJiBleGlzdHMobmV3VmFsdWUuaW5kZXhTcGxpY2VzKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSBcIi5zcGxpY2VzXCIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYmVhbiA9IG5hdmlnYXRlVG9CZWFuKHRoaXMsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwYXRoLm1hdGNoKC9bXlxcLl0rJC8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBuZXdWYWx1ZS5pbmRleFNwbGljZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFuZ2UgPSBuZXdWYWx1ZS5pbmRleFNwbGljZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50Q29udGV4dC5iZWFuTWFuYWdlci5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWVbMF0sIGNoYW5nZS5pbmRleCwgY2hhbmdlLmFkZGVkQ291bnQsIGNoYW5nZS5yZW1vdmVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlLnJlbW92ZWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoICsgJy4nICsgKGNoYW5nZS5pbmRleCArIGopLCBjaGFuZ2UucmVtb3ZlZFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGNoYW5nZS5pbmRleCArIGNoYW5nZS5hZGRlZENvdW50OyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFBvcyA9IGogLSBjaGFuZ2UuYWRkZWRDb3VudCArIGNoYW5nZS5yZW1vdmVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoICsgJy4nICsgb2xkUG9zLCBhcnJheVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGNoYW5nZS5pbmRleDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci5iaW5kKHRoaXMsIHBhdGggKyAnLicgKyBqLCBhcnJheVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmVhbiA9IG5hdmlnYXRlVG9CZWFuKHRoaXMsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pICYmICFBcnJheS5pc0FycmF5KGJlYW4pICYmICFBcnJheS5pc0FycmF5KG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcGF0aC5tYXRjaCgvW15cXC5dKyQvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWVbMF0sIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMob2xkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci5iaW5kKHRoaXMsIHBhdGgsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5cblxuZXhwb3J0cy5zZXR1cENyZWF0ZUJlaGF2aW9yID0gc2V0dXBDcmVhdGVCZWhhdmlvcjsiLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBNYXAgID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJyk7XG5cblxuXG5mdW5jdGlvbiBleGlzdHMob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmluZFNjb3BlKHNjb3BlLCBmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZuLmFwcGx5KHNjb3BlLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbChhcnJheTEsIGFycmF5Mikge1xuICAgIGlmIChhcnJheTEgPT09IGFycmF5MiB8fCAoIWV4aXN0cyhhcnJheTEpICYmICFleGlzdHMoYXJyYXkyKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChleGlzdHMoYXJyYXkxKSAhPT0gZXhpc3RzKGFycmF5MikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbiA9IGFycmF5MS5sZW5ndGg7XG4gICAgaWYgKGFycmF5Mi5sZW5ndGggIT09IG4pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5mdW5jdGlvbiBCaW5kZXIoYmVhbk1hbmFnZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcblxuICAgIGJlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShiaW5kU2NvcGUodGhpcywgdGhpcy5vbkJlYW5VcGRhdGVIYW5kbGVyKSk7XG4gICAgYmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShiaW5kU2NvcGUodGhpcywgdGhpcy5vbkFycmF5VXBkYXRlSGFuZGxlcikpO1xufVxuXG5cbkJpbmRlci5wcm90b3R5cGUub25CZWFuVXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgaWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQoYmVhbik7XG4gICAgaWYgKGV4aXN0cyhsaXN0ZW5lckxpc3QpICYmIGxpc3RlbmVyTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGxpc3RlbmVyTGlzdFswXTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlbnRyeS5lbGVtZW50O1xuICAgICAgICB2YXIgcGF0aCA9IGVudHJ5LnJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lO1xuICAgICAgICBlbGVtZW50LnNldChwYXRoLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmVhbltwcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxufTtcblxuXG5CaW5kZXIucHJvdG90eXBlLm9uQXJyYXlVcGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSB7XG4gICAgdmFyIGFycmF5ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgIHZhciBvbGRFbGVtZW50cyA9IGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KTtcbiAgICBpZiAoZGVlcEVxdWFsKG5ld0VsZW1lbnRzLCBvbGRFbGVtZW50cykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGJlYW4pO1xuICAgIGlmIChleGlzdHMobGlzdGVuZXJMaXN0KSAmJiBsaXN0ZW5lckxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgZW50cnkgPSBsaXN0ZW5lckxpc3RbMF07XG4gICAgICAgIHZhciBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgICAgdmFyIHBhdGggPSBlbnRyeS5yb290UGF0aCArICcuJyArIHByb3BlcnR5TmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdFbGVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3BsaWNlKHBhdGgsIGluZGV4LCBjb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnNwbGljZS5hcHBseShlbGVtZW50LCBbcGF0aCwgaW5kZXgsIGNvdW50XS5jb25jYXQobmV3RWxlbWVudHMpKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3RWxlbWVudHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIGNvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZS5hcHBseShhcnJheSwgW2luZGV4LCBjb3VudF0uY29uY2F0KG5ld0VsZW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbkJpbmRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChlbGVtZW50LCByb290UGF0aCwgdmFsdWUpIHtcbiAgICBpZiAoIWV4aXN0cyh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQodmFsdWUpO1xuICAgIGlmICghZXhpc3RzKGxpc3RlbmVyTGlzdCkpIHtcbiAgICAgICAgbGlzdGVuZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNldCh2YWx1ZSwgbGlzdGVuZXJMaXN0KTtcbiAgICB9XG4gICAgbGlzdGVuZXJMaXN0LnB1c2goe2VsZW1lbnQ6IGVsZW1lbnQsIHJvb3RQYXRoOiByb290UGF0aH0pO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmluZChlbGVtZW50LCByb290UGF0aCArICcuJyArIGksIHZhbHVlW2ldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lLCB2YWx1ZVtwcm9wZXJ0eU5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbkJpbmRlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJvb3RQYXRoLCB2YWx1ZSkge1xuICAgIGlmICghZXhpc3RzKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldCh2YWx1ZSk7XG4gICAgaWYgKGV4aXN0cyhsaXN0ZW5lckxpc3QpKSB7XG4gICAgICAgIHZhciBuID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGxpc3RlbmVyTGlzdFtpXTtcbiAgICAgICAgICAgIGlmIChlbnRyeS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGVudHJ5LnJvb3RQYXRoID09PSByb290UGF0aCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyTGlzdC5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bmJpbmQoZWxlbWVudCwgcm9vdFBhdGggKyAnLicgKyBqLCB2YWx1ZVtqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lLCB2YWx1ZVtwcm9wZXJ0eU5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuZXhwb3J0cy5CaW5kZXIgPSBCaW5kZXI7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkb2xwaGluQ2xpZW50ID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvZG9scGhpbi1wbGF0Zm9ybS5qcycpO1xudmFyIHNldHVwQ3JlYXRlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9yLmpzJykuc2V0dXBDcmVhdGVCZWhhdmlvcjtcblxuZXhwb3J0cy5jbGllbnRDb250ZXh0ID0gZnVuY3Rpb24odXJsLCBjb25maWcpe1xuICAgIHZhciBjbGllbnRDb250ZXh0RmFjdG9yeSA9IG5ldyBkb2xwaGluQ2xpZW50LkNsaWVudENvbnRleHRGYWN0b3J5KCk7XG4gICAgdmFyIGNsaWVudENvbnRleHQgPSBjbGllbnRDb250ZXh0RmFjdG9yeS5jcmVhdGUodXJsLCBjb25maWcpO1xuICAgIGNsaWVudENvbnRleHQuY3JlYXRlQmVoYXZpb3IgPSBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpO1xuICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xufTtcblxuIl19
