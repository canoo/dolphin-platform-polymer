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
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
_dereq_('../modules/es7.map.of');
_dereq_('../modules/es7.map.from');
module.exports = _dereq_('../modules/_core').Map;

},{"../modules/_core":18,"../modules/es6.map":78,"../modules/es6.object.to-string":79,"../modules/es6.string.iterator":82,"../modules/es7.map.from":83,"../modules/es7.map.of":84,"../modules/es7.map.to-json":85,"../modules/web.dom.iterable":91}],2:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
_dereq_('../modules/es7.promise.finally');
_dereq_('../modules/es7.promise.try');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":18,"../modules/es6.object.to-string":79,"../modules/es6.promise":80,"../modules/es6.string.iterator":82,"../modules/es7.promise.finally":86,"../modules/es7.promise.try":87,"../modules/web.dom.iterable":91}],3:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
_dereq_('../modules/es7.set.of');
_dereq_('../modules/es7.set.from');
module.exports = _dereq_('../modules/_core').Set;

},{"../modules/_core":18,"../modules/es6.object.to-string":79,"../modules/es6.set":81,"../modules/es6.string.iterator":82,"../modules/es7.set.from":88,"../modules/es7.set.of":89,"../modules/es7.set.to-json":90,"../modules/web.dom.iterable":91}],4:[function(_dereq_,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],5:[function(_dereq_,module,exports){
module.exports = function () { /* empty */ };

},{}],6:[function(_dereq_,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],7:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":36}],8:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":26}],9:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject');
var toLength = _dereq_('./_to-length');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":67,"./_to-iobject":69,"./_to-length":70}],10:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = _dereq_('./_ctx');
var IObject = _dereq_('./_iobject');
var toObject = _dereq_('./_to-object');
var toLength = _dereq_('./_to-length');
var asc = _dereq_('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":12,"./_ctx":19,"./_iobject":33,"./_to-length":70,"./_to-object":71}],11:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var isArray = _dereq_('./_is-array');
var SPECIES = _dereq_('./_wks')('species');

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
  } return C === undefined ? Array : C;
};

},{"./_is-array":35,"./_is-object":36,"./_wks":75}],12:[function(_dereq_,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":11}],13:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof');
var TAG = _dereq_('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":14,"./_wks":75}],14:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(_dereq_,module,exports){
'use strict';
var dP = _dereq_('./_object-dp').f;
var create = _dereq_('./_object-create');
var redefineAll = _dereq_('./_redefine-all');
var ctx = _dereq_('./_ctx');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var $iterDefine = _dereq_('./_iter-define');
var step = _dereq_('./_iter-step');
var setSpecies = _dereq_('./_set-species');
var DESCRIPTORS = _dereq_('./_descriptors');
var fastKey = _dereq_('./_meta').fastKey;
var validate = _dereq_('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
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
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
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

},{"./_an-instance":6,"./_ctx":19,"./_descriptors":21,"./_for-of":26,"./_iter-define":39,"./_iter-step":41,"./_meta":44,"./_object-create":47,"./_object-dp":48,"./_redefine-all":56,"./_set-species":60,"./_validate-collection":74}],16:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof');
var from = _dereq_('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":8,"./_classof":13}],17:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var $export = _dereq_('./_export');
var meta = _dereq_('./_meta');
var fails = _dereq_('./_fails');
var hide = _dereq_('./_hide');
var redefineAll = _dereq_('./_redefine-all');
var forOf = _dereq_('./_for-of');
var anInstance = _dereq_('./_an-instance');
var isObject = _dereq_('./_is-object');
var setToStringTag = _dereq_('./_set-to-string-tag');
var dP = _dereq_('./_object-dp').f;
var each = _dereq_('./_array-methods')(0);
var DESCRIPTORS = _dereq_('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
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
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
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

},{"./_an-instance":6,"./_array-methods":10,"./_descriptors":21,"./_export":24,"./_fails":25,"./_for-of":26,"./_global":27,"./_hide":29,"./_is-object":36,"./_meta":44,"./_object-dp":48,"./_redefine-all":56,"./_set-to-string-tag":61}],18:[function(_dereq_,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],19:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":4}],20:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":25}],22:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var document = _dereq_('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":27,"./_is-object":36}],23:[function(_dereq_,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],24:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var ctx = _dereq_('./_ctx');
var hide = _dereq_('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
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
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
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
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
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

},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],26:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var call = _dereq_('./_iter-call');
var isArrayIter = _dereq_('./_is-array-iter');
var anObject = _dereq_('./_an-object');
var toLength = _dereq_('./_to-length');
var getIterFn = _dereq_('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
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
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":7,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":37,"./_to-length":70,"./core.get-iterator-method":76}],27:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],28:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],29:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":48,"./_property-desc":55}],30:[function(_dereq_,module,exports){
var document = _dereq_('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":27}],31:[function(_dereq_,module,exports){
module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
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
  } return fn.apply(that, args);
};

},{}],33:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],34:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_('./_iterators');
var ITERATOR = _dereq_('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":42,"./_wks":75}],35:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],36:[function(_dereq_,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],37:[function(_dereq_,module,exports){
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
var create = _dereq_('./_object-create');
var descriptor = _dereq_('./_property-desc');
var setToStringTag = _dereq_('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":29,"./_object-create":47,"./_property-desc":55,"./_set-to-string-tag":61,"./_wks":75}],39:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var $export = _dereq_('./_export');
var redefine = _dereq_('./_redefine');
var hide = _dereq_('./_hide');
var has = _dereq_('./_has');
var Iterators = _dereq_('./_iterators');
var $iterCreate = _dereq_('./_iter-create');
var setToStringTag = _dereq_('./_set-to-string-tag');
var getPrototypeOf = _dereq_('./_object-gpo');
var ITERATOR = _dereq_('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
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

},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":38,"./_iterators":42,"./_library":43,"./_object-gpo":50,"./_redefine":57,"./_set-to-string-tag":61,"./_wks":75}],40:[function(_dereq_,module,exports){
var ITERATOR = _dereq_('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":75}],41:[function(_dereq_,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],42:[function(_dereq_,module,exports){
module.exports = {};

},{}],43:[function(_dereq_,module,exports){
module.exports = true;

},{}],44:[function(_dereq_,module,exports){
var META = _dereq_('./_uid')('meta');
var isObject = _dereq_('./_is-object');
var has = _dereq_('./_has');
var setDesc = _dereq_('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_dereq_('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
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

},{"./_fails":25,"./_has":28,"./_is-object":36,"./_object-dp":48,"./_uid":73}],45:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var macrotask = _dereq_('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = _dereq_('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
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
    } last = task;
  };
};

},{"./_cof":14,"./_global":27,"./_task":66}],46:[function(_dereq_,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = _dereq_('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":4}],47:[function(_dereq_,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = _dereq_('./_an-object');
var dPs = _dereq_('./_object-dps');
var enumBugKeys = _dereq_('./_enum-bug-keys');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":49,"./_shared-key":62}],48:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define');
var toPrimitive = _dereq_('./_to-primitive');
var dP = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":72}],49:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var anObject = _dereq_('./_an-object');
var getKeys = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_object-dp":48,"./_object-keys":52}],50:[function(_dereq_,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = _dereq_('./_has');
var toObject = _dereq_('./_to-object');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":28,"./_shared-key":62,"./_to-object":71}],51:[function(_dereq_,module,exports){
var has = _dereq_('./_has');
var toIObject = _dereq_('./_to-iobject');
var arrayIndexOf = _dereq_('./_array-includes')(false);
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":9,"./_has":28,"./_shared-key":62,"./_to-iobject":69}],52:[function(_dereq_,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal');
var enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":51}],53:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],54:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');
var newPromiseCapability = _dereq_('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":7,"./_is-object":36,"./_new-promise-capability":46}],55:[function(_dereq_,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],56:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":29}],57:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');

},{"./_hide":29}],58:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');
var aFunction = _dereq_('./_a-function');
var ctx = _dereq_('./_ctx');
var forOf = _dereq_('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":4,"./_ctx":19,"./_export":24,"./_for-of":26}],59:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":24}],60:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var dP = _dereq_('./_object-dp');
var DESCRIPTORS = _dereq_('./_descriptors');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":48,"./_wks":75}],61:[function(_dereq_,module,exports){
var def = _dereq_('./_object-dp').f;
var has = _dereq_('./_has');
var TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":28,"./_object-dp":48,"./_wks":75}],62:[function(_dereq_,module,exports){
var shared = _dereq_('./_shared')('keys');
var uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":63,"./_uid":73}],63:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":27}],64:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object');
var aFunction = _dereq_('./_a-function');
var SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":4,"./_an-object":7,"./_wks":75}],65:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var defined = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":68}],66:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var invoke = _dereq_('./_invoke');
var html = _dereq_('./_html');
var cel = _dereq_('./_dom-create');
var global = _dereq_('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
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
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
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
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],67:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":68}],68:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],69:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject');
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":33}],70:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":68}],71:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],72:[function(_dereq_,module,exports){
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

},{"./_is-object":36}],73:[function(_dereq_,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],74:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":36}],75:[function(_dereq_,module,exports){
var store = _dereq_('./_shared')('wks');
var uid = _dereq_('./_uid');
var Symbol = _dereq_('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":27,"./_shared":63,"./_uid":73}],76:[function(_dereq_,module,exports){
var classof = _dereq_('./_classof');
var ITERATOR = _dereq_('./_wks')('iterator');
var Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":18,"./_iterators":42,"./_wks":75}],77:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./_add-to-unscopables');
var step = _dereq_('./_iter-step');
var Iterators = _dereq_('./_iterators');
var toIObject = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
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

},{"./_add-to-unscopables":5,"./_iter-define":39,"./_iter-step":41,"./_iterators":42,"./_to-iobject":69}],78:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = _dereq_('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":17,"./_collection-strong":15,"./_validate-collection":74}],79:[function(_dereq_,module,exports){

},{}],80:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var global = _dereq_('./_global');
var ctx = _dereq_('./_ctx');
var classof = _dereq_('./_classof');
var $export = _dereq_('./_export');
var isObject = _dereq_('./_is-object');
var aFunction = _dereq_('./_a-function');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var speciesConstructor = _dereq_('./_species-constructor');
var task = _dereq_('./_task').set;
var microtask = _dereq_('./_microtask')();
var newPromiseCapabilityModule = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');
var promiseResolve = _dereq_('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_dereq_('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
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
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
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
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
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
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
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
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
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
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
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
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":4,"./_an-instance":6,"./_classof":13,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":36,"./_iter-detect":40,"./_library":43,"./_microtask":45,"./_new-promise-capability":46,"./_perform":53,"./_promise-resolve":54,"./_redefine-all":56,"./_set-species":60,"./_set-to-string-tag":61,"./_species-constructor":64,"./_task":66,"./_wks":75}],81:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = _dereq_('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":17,"./_collection-strong":15,"./_validate-collection":74}],82:[function(_dereq_,module,exports){
'use strict';
var $at = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":39,"./_string-at":65}],83:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_dereq_('./_set-collection-from')('Map');

},{"./_set-collection-from":58}],84:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_dereq_('./_set-collection-of')('Map');

},{"./_set-collection-of":59}],85:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Map', { toJSON: _dereq_('./_collection-to-json')('Map') });

},{"./_collection-to-json":16,"./_export":24}],86:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = _dereq_('./_export');
var core = _dereq_('./_core');
var global = _dereq_('./_global');
var speciesConstructor = _dereq_('./_species-constructor');
var promiseResolve = _dereq_('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":18,"./_export":24,"./_global":27,"./_promise-resolve":54,"./_species-constructor":64}],87:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = _dereq_('./_export');
var newPromiseCapability = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":24,"./_new-promise-capability":46,"./_perform":53}],88:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_dereq_('./_set-collection-from')('Set');

},{"./_set-collection-from":58}],89:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_dereq_('./_set-collection-of')('Set');

},{"./_set-collection-of":59}],90:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Set', { toJSON: _dereq_('./_collection-to-json')('Set') });

},{"./_collection-to-json":16,"./_export":24}],91:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var Iterators = _dereq_('./_iterators');
var TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":27,"./_hide":29,"./_iterators":42,"./_wks":75,"./es6.array.iterator":77}],92:[function(_dereq_,module,exports){

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

},{}],93:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attribute = function Attribute() {
  _classCallCheck(this, Attribute);
};

exports.default = Attribute;


Attribute.QUALIFIER_PROPERTY = "qualifier";
Attribute.VALUE = "value";

},{}],94:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('core-js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeanManager = function () {
    function BeanManager(classRepository) {
        _classCallCheck(this, BeanManager);

        (0, _utils.checkMethod)('BeanManager(classRepository)');
        (0, _utils.checkParam)(classRepository, 'classRepository');

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
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanAdded-handler', e);
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
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanRemoved-handler', e);
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
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanUpdate-handler', e);
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
                        BeanManager.LOGGER.error('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });
    }

    _createClass(BeanManager, [{
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils.checkMethod)('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');

            return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils.checkMethod)('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');
            (0, _utils.checkParam)(index, 'index');
            (0, _utils.checkParam)(count, 'count');
            (0, _utils.checkParam)(removedElements, 'removedElements');

            this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
        }
    }, {
        key: 'isManaged',
        value: function isManaged(bean) {
            (0, _utils.checkMethod)('BeanManager.isManaged(bean)');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.isManaged() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'create',
        value: function create(type) {
            (0, _utils.checkMethod)('BeanManager.create(type)');
            (0, _utils.checkParam)(type, 'type');

            // TODO: Implement dolphin.create() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'add',
        value: function add(type, bean) {
            (0, _utils.checkMethod)('BeanManager.add(type, bean)');
            (0, _utils.checkParam)(type, 'type');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.add() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'addAll',
        value: function addAll(type, collection) {
            (0, _utils.checkMethod)('BeanManager.addAll(type, collection)');
            (0, _utils.checkParam)(type, 'type');
            (0, _utils.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.addAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'remove',
        value: function remove(bean) {
            (0, _utils.checkMethod)('BeanManager.remove(bean)');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.remove() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeAll',
        value: function removeAll(collection) {
            (0, _utils.checkMethod)('BeanManager.removeAll(collection)');
            (0, _utils.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.removeAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeIf',
        value: function removeIf(predicate) {
            (0, _utils.checkMethod)('BeanManager.removeIf(predicate)');
            (0, _utils.checkParam)(predicate, 'predicate');

            // TODO: Implement dolphin.removeIf() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'onAdded',
        value: function onAdded(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils.checkMethod)('BeanManager.onAdded(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allAddedHandlers = self.allAddedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onAdded(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils.checkMethod)('BeanManager.onRemoved(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allRemovedHandlers = self.allRemovedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onRemoved(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils.checkMethod)('BeanManager.onBeanUpdate(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onBeanUpdate(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils.checkMethod)('BeanManager.onArrayUpdate(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onArrayUpdate(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

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


BeanManager.LOGGER = _logging.LoggerFactory.getLogger('BeanManager');

},{"./logging":130,"./utils":137,"core-js/library/fn/map":1}],95:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('core-js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _constants = _dereq_('./constants');

var consts = _interopRequireWildcard(_constants);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blocked = null;

var ClassRepository = function () {
    function ClassRepository(dolphin) {
        _classCallCheck(this, ClassRepository);

        (0, _utils.checkMethod)('ClassRepository(dolphin)');
        (0, _utils.checkParam)(dolphin, 'dolphin');

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
                        ClassRepository.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler', e);
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
            (0, _utils.checkMethod)('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');

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
            (0, _utils.checkMethod)('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');
            (0, _utils.checkParam)(index, 'index');
            (0, _utils.checkParam)(count, 'count');
            (0, _utils.checkParam)(removedElements, 'removedElements');

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
            (0, _utils.checkMethod)('ClassRepository.onBeanAdded(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.beanAddedHandlers.push(handler);
        }
    }, {
        key: 'onBeanRemoved',
        value: function onBeanRemoved(handler) {
            (0, _utils.checkMethod)('ClassRepository.onBeanRemoved(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.beanRemovedHandlers.push(handler);
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(handler) {
            (0, _utils.checkMethod)('ClassRepository.onBeanUpdate(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.propertyUpdateHandlers.push(handler);
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(handler) {
            (0, _utils.checkMethod)('ClassRepository.onArrayUpdate(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.arrayUpdateHandlers.push(handler);
        }
    }, {
        key: 'registerClass',
        value: function registerClass(model) {
            (0, _utils.checkMethod)('ClassRepository.registerClass(model)');
            (0, _utils.checkParam)(model, 'model');

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
            (0, _utils.checkMethod)('ClassRepository.unregisterClass(model)');
            (0, _utils.checkParam)(model, 'model');
            this.classes['delete'](model.id);
        }
    }, {
        key: 'load',
        value: function load(model) {
            (0, _utils.checkMethod)('ClassRepository.load(model)');
            (0, _utils.checkParam)(model, 'model');

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
                                ClassRepository.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler', e);
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
                    ClassRepository.LOGGER.error('An exception occurred while calling an onBeanAdded-handler', e);
                }
            });
            return bean;
        }
    }, {
        key: 'unload',
        value: function unload(model) {
            (0, _utils.checkMethod)('ClassRepository.unload(model)');
            (0, _utils.checkParam)(model, 'model');

            var bean = this.beanFromDolphin.get(model.id);
            this.beanFromDolphin['delete'](model.id);
            this.beanToDolphin['delete'](bean);
            this.classInfos['delete'](model.id);
            if ((0, _utils.exists)(bean)) {
                this.beanRemovedHandlers.forEach(function (handler) {
                    try {
                        handler(model.presentationModelType, bean);
                    } catch (e) {
                        ClassRepository.LOGGER.error('An exception occurred while calling an onBeanRemoved-handler', e);
                    }
                });
            }
            return bean;
        }
    }, {
        key: 'spliceListEntry',
        value: function spliceListEntry(model) {
            (0, _utils.checkMethod)('ClassRepository.spliceListEntry(model)');
            (0, _utils.checkParam)(model, 'model');

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
                                ClassRepository.LOGGER.error('An exception occurred while calling an onArrayUpdate-handler', e);
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


ClassRepository.LOGGER = _logging.LoggerFactory.getLogger('ClassRepository');

},{"./constants":122,"./logging":130,"./utils":137,"core-js/library/fn/map":1}],96:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        _classCallCheck(this, ClientAttribute);

        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new _eventBus2.default();
        this.qualifierChangeBus = new _eventBus2.default();
        this.setValue(value);
        this.setQualifier(qualifier);
    }

    _createClass(ClientAttribute, [{
        key: 'copy',
        value: function copy() {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
            return result;
        }
    }, {
        key: 'setPresentationModel',
        value: function setPresentationModel(presentationModel) {
            if (this.presentationModel) {
                throw new Error("You can not set a presentation model for an attribute that is already bound.");
            }
            this.presentationModel = presentationModel;
        }
    }, {
        key: 'getPresentationModel',
        value: function getPresentationModel() {
            return this.presentationModel;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }
    }, {
        key: 'setValueFromServer',
        value: function setValueFromServer(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value === verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': false });
        }
    }, {
        key: 'setValue',
        value: function setValue(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value === verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': true });
        }
    }, {
        key: 'setQualifier',
        value: function setQualifier(newQualifier) {
            if (this.qualifier === newQualifier) return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
            this.valueChangeBus.trigger({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
        }
    }, {
        key: 'getQualifier',
        value: function getQualifier() {
            return this.qualifier;
        }
    }, {
        key: 'onValueChange',
        value: function onValueChange(eventHandler) {
            this.valueChangeBus.onEvent(eventHandler);
            eventHandler({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
        }
    }, {
        key: 'onQualifierChange',
        value: function onQualifierChange(eventHandler) {
            this.qualifierChangeBus.onEvent(eventHandler);
        }
    }, {
        key: 'syncWith',
        value: function syncWith(sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setValue(sourceAttribute.value);
            }
        }
    }], [{
        key: 'checkValue',
        value: function checkValue(value) {
            if (value == null || typeof value === 'undefined') {
                return null;
            }
            var result = value;
            if (result instanceof String || result instanceof Boolean || result instanceof Number) {
                result = value.valueOf();
            }
            if (result instanceof ClientAttribute) {
                ClientAttribute.LOGGER.warn("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.");
                result = this.checkValue(value.value);
            }
            var ok = false;
            if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result === 'undefined' ? 'undefined' : _typeof(result)) > -1 || result instanceof Date) {
                ok = true;
            }
            if (!ok) {
                throw new Error("Attribute values of this type are not allowed: " + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
            }
            return result;
        }
    }]);

    return ClientAttribute;
}();

exports.default = ClientAttribute;


ClientAttribute.LOGGER = _logging.LoggerFactory.getLogger('ClientAttribute');
ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;

},{"./eventBus":127,"./logging":130}],97:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandBatcher = _dereq_('./commandBatcher');

var _commandBatcher2 = _interopRequireDefault(_commandBatcher);

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _clientPresentationModel = _dereq_('./clientPresentationModel');

var _clientPresentationModel2 = _interopRequireDefault(_clientPresentationModel);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientConnector = function () {
    function ClientConnector(transmitter, clientDolphin) {
        var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var maxBatchSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;

        _classCallCheck(this, ClientConnector);

        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new _codec2.default();
        this.commandBatcher = new _commandBatcher2.default(true, maxBatchSize);
    }

    _createClass(ClientConnector, [{
        key: 'setCommandBatcher',
        value: function setCommandBatcher(newBatcher) {
            this.commandBatcher = newBatcher;
        }
    }, {
        key: 'setPushEnabled',
        value: function setPushEnabled(enabled) {
            this.pushEnabled = enabled;
        }
    }, {
        key: 'setPushListener',
        value: function setPushListener(newListener) {
            this.pushListener = newListener;
        }
    }, {
        key: 'setReleaseCommand',
        value: function setReleaseCommand(newCommand) {
            this.releaseCommand = newCommand;
        }
    }, {
        key: 'send',
        value: function send(command, onFinished) {
            this.commandQueue.push({ command: command, handler: onFinished });
            if (this.currentlySending) {
                this.release(); // there is not point in releasing if we do not send atm
                return;
            }
            this.doSendNext();
        }
    }, {
        key: 'doSendNext',
        value: function doSendNext() {
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

            if (cmdsAndHandlers.length > 0) {
                var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
                var commands = cmdsAndHandlers.map(function (cah) {
                    return cah.command;
                });
                this.transmitter.transmit(commands, function (response) {
                    var touchedPMs = [];
                    response.forEach(function (command) {
                        var touched = _this.handle(command);
                        if (touched) touchedPMs.push(touched);
                    });
                    if (callback) {
                        callback.onFinished(touchedPMs); // todo: make them unique?
                    }
                    setTimeout(function () {
                        return _this.doSendNext();
                    }, _this.slackMS);
                });
            } else {
                setTimeout(function () {
                    return _this.doSendNext();
                }, this.slackMS);
            }
        }
    }, {
        key: 'handle',
        value: function handle(command) {
            if (command.id === "DeletePresentationModel") {
                return this.handleDeletePresentationModelCommand(command);
            } else if (command.id === "CreatePresentationModel") {
                return this.handleCreatePresentationModelCommand(command);
            } else if (command.id === "ValueChanged") {
                return this.handleValueChangedCommand(command);
            } else if (command.id === "AttributeMetadataChanged") {
                return this.handleAttributeMetadataChangedCommand(command);
            } else {
                ClientConnector.LOGGER.error("Cannot handle, unknown command " + command);
            }
            return null;
        }
    }, {
        key: 'handleDeletePresentationModelCommand',
        value: function handleDeletePresentationModelCommand(serverCommand) {
            var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
            if (!model) return null;
            this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
            return model;
        }
    }, {
        key: 'handleCreatePresentationModelCommand',
        value: function handleCreatePresentationModelCommand(serverCommand) {
            var _this2 = this;

            if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
                throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
            }
            var attributes = [];
            serverCommand.attributes.forEach(function (attr) {
                var clientAttribute = _this2.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
                if (attr.id && attr.id.match(".*S$")) {
                    clientAttribute.id = attr.id;
                }
                attributes.push(clientAttribute);
            });
            var clientPm = new _clientPresentationModel2.default(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm, false);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            return clientPm;
        }
    }, {
        key: 'handleValueChangedCommand',
        value: function handleValueChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                ClientConnector.LOGGER.error("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() === serverCommand.newValue) {
                return null;
            }
            clientAttribute.setValueFromServer(serverCommand.newValue);
            return null;
        }
    }, {
        key: 'handleAttributeMetadataChangedCommand',
        value: function handleAttributeMetadataChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) return null;
            clientAttribute[serverCommand.metadataName] = serverCommand.value;
            return null;
        }
    }, {
        key: 'listen',
        value: function listen() {
            if (!this.pushEnabled) return;
            if (this.waiting) return;
            // todo: how to issue a warning if no pushListener is set?
            if (!this.currentlySending) {
                this.doSendNext();
            }
        }
    }, {
        key: 'enqueuePushCommand',
        value: function enqueuePushCommand() {
            var me = this;
            this.waiting = true;
            this.commandQueue.push({
                command: this.pushListener,
                handler: {
                    onFinished: function onFinished() {
                        me.waiting = false;
                    },
                    onFinishedData: null
                }
            });
        }
    }, {
        key: 'release',
        value: function release() {
            if (!this.waiting) return;
            this.waiting = false;
            // todo: how to issue a warning if no releaseCommand is set?
            this.transmitter.signal(this.releaseCommand);
        }
    }]);

    return ClientConnector;
}();

exports.default = ClientConnector;


ClientConnector.LOGGER = _logging.LoggerFactory.getLogger('ClientConnector');

},{"./clientPresentationModel":101,"./commandBatcher":103,"./commands/codec":104,"./logging":130}],98:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ClientContextFactory = exports.createClientContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2015 Canoo Engineering AG.
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

var _openDolphin = _dereq_('./openDolphin.js');

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

var _connector = _dereq_('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _beanmanager = _dereq_('./beanmanager');

var _beanmanager2 = _interopRequireDefault(_beanmanager);

var _classrepo = _dereq_('./classrepo');

var _classrepo2 = _interopRequireDefault(_classrepo);

var _controllermanager = _dereq_('./controllermanager');

var _controllermanager2 = _interopRequireDefault(_controllermanager);

var _clientcontext = _dereq_('./clientcontext');

var _clientcontext2 = _interopRequireDefault(_clientcontext);

var _platformHttpTransmitter = _dereq_('./platformHttpTransmitter');

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
            ClientContextFactory.LOGGER.info('Dolphin Platform Version:', DOLPHIN_PLATFORM_VERSION);
            ClientContextFactory.LOGGER.debug('Creating client context', url, config);

            var builder = (0, _openDolphin.makeDolphin)().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
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

            ClientContextFactory.LOGGER.debug('clientContext created with', clientContext);

            return clientContext;
        }
    }]);

    return ClientContextFactory;
}();

ClientContextFactory.LOGGER = _logging.LoggerFactory.getLogger('ClientContextFactory');

var createClientContext = new ClientContextFactory().create;

exports.createClientContext = createClientContext;
exports.ClientContextFactory = ClientContextFactory;

},{"./beanmanager":94,"./classrepo":95,"./clientcontext":102,"./connector":121,"./controllermanager":123,"./logging":130,"./openDolphin.js":134,"./platformHttpTransmitter":135,"./utils":137}],99:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _clientAttribute = _dereq_('./clientAttribute');

var _clientAttribute2 = _interopRequireDefault(_clientAttribute);

var _clientPresentationModel = _dereq_('./clientPresentationModel');

var _clientPresentationModel2 = _interopRequireDefault(_clientPresentationModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientDolphin = function () {
    function ClientDolphin() {
        _classCallCheck(this, ClientDolphin);
    }

    _createClass(ClientDolphin, [{
        key: 'setClientConnector',
        value: function setClientConnector(clientConnector) {
            this.clientConnector = clientConnector;
        }
    }, {
        key: 'getClientConnector',
        value: function getClientConnector() {
            return this.clientConnector;
        }
    }, {
        key: 'send',
        value: function send(command, onFinished) {
            this.clientConnector.send(command, onFinished);
        }
    }, {
        key: 'attribute',
        value: function attribute(propertyName, qualifier, value) {
            return new _clientAttribute2.default(propertyName, qualifier, value);
        }
    }, {
        key: 'presentationModel',
        value: function presentationModel(id, type) {
            var model = new _clientPresentationModel2.default(id, type);

            for (var _len = arguments.length, attributes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                attributes[_key - 2] = arguments[_key];
            }

            if (attributes && attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    model.addAttribute(attribute);
                });
            }
            this.getClientModelStore().add(model, true);
            return model;
        }
    }, {
        key: 'setClientModelStore',
        value: function setClientModelStore(clientModelStore) {
            this.clientModelStore = clientModelStore;
        }
    }, {
        key: 'getClientModelStore',
        value: function getClientModelStore() {
            return this.clientModelStore;
        }
    }, {
        key: 'listPresentationModelIds',
        value: function listPresentationModelIds() {
            return this.getClientModelStore().listPresentationModelIds();
        }
    }, {
        key: 'listPresentationModels',
        value: function listPresentationModels() {
            return this.getClientModelStore().listPresentationModels();
        }
    }, {
        key: 'findAllPresentationModelByType',
        value: function findAllPresentationModelByType(presentationModelType) {
            return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
        }
    }, {
        key: 'getAt',
        value: function getAt(id) {
            return this.findPresentationModelById(id);
        }
    }, {
        key: 'findPresentationModelById',
        value: function findPresentationModelById(id) {
            return this.getClientModelStore().findPresentationModelById(id);
        }
    }, {
        key: 'deletePresentationModel',
        value: function deletePresentationModel(modelToDelete) {
            this.getClientModelStore().deletePresentationModel(modelToDelete, true);
        }
    }, {
        key: 'updatePresentationModelQualifier',
        value: function updatePresentationModelQualifier(presentationModel) {
            var _this = this;

            presentationModel.getAttributes().forEach(function (sourceAttribute) {
                _this.updateAttributeQualifier(sourceAttribute);
            });
        }
    }, {
        key: 'updateAttributeQualifier',
        value: function updateAttributeQualifier(sourceAttribute) {
            if (!sourceAttribute.getQualifier()) return;
            var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
            attributes.forEach(function (targetAttribute) {
                targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
            });
        }
    }, {
        key: 'startPushListening',
        value: function startPushListening(pushCommand, releaseCommand) {
            var _this2 = this;

            this.clientConnector.setPushListener(pushCommand);
            this.clientConnector.setReleaseCommand(releaseCommand);
            this.clientConnector.setPushEnabled(true);

            setTimeout(function () {
                _this2.clientConnector.listen();
            }, 0);
        }
    }, {
        key: 'stopPushListening',
        value: function stopPushListening() {
            this.clientConnector.setPushEnabled(false);
        }
    }]);

    return ClientDolphin;
}();

exports.default = ClientDolphin;

},{"./clientAttribute":96,"./clientPresentationModel":101}],100:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _attribute = _dereq_('./attribute');

var _attribute2 = _interopRequireDefault(_attribute);

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _constants = _dereq_('./constants');

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientModelStore = function () {
    function ClientModelStore(clientDolphin) {
        _classCallCheck(this, ClientModelStore);

        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new _eventBus2.default();
    }

    _createClass(ClientModelStore, [{
        key: 'getClientDolphin',
        value: function getClientDolphin() {
            return this.clientDolphin;
        }
    }, {
        key: 'registerAttribute',
        value: function registerAttribute(attribute) {
            var _this = this;

            this.addAttributeById(attribute);
            if (attribute.getQualifier()) {
                this.addAttributeByQualifier(attribute);
            }
            // whenever an attribute changes its value, the server needs to be notified
            // and all other attributes with the same qualifier are given the same value
            attribute.onValueChange(function (evt) {
                if (evt.newValue !== evt.oldValue && evt.sendToServer === true) {
                    var command = _commandFactory2.default.createValueChangedCommand(attribute.id, evt.newValue);
                    _this.clientDolphin.getClientConnector().send(command, null);
                }

                if (attribute.getQualifier()) {
                    var attrs = _this.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() === attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setValue(attribute.getValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                _this.clientDolphin.getClientConnector().send(_commandFactory2.default.createChangeAttributeMetadataCommand(attribute.id, _attribute2.default.QUALIFIER_PROPERTY, evt.newValue), null);
            });
        }
    }, {
        key: 'add',
        value: function add(model) {
            var _this2 = this;

            var sendToServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!model) {
                return false;
            }
            if (this.presentationModels.has(model.id)) {
                ClientModelStore.LOGGER.error("There already is a PM with id " + model.id);
            }
            var added = false;
            if (!this.presentationModels.has(model.id)) {
                this.presentationModels.set(model.id, model);
                this.addPresentationModelByType(model);

                if (sendToServer) {
                    var connector = this.clientDolphin.getClientConnector();
                    connector.send(_commandFactory2.default.createCreatePresentationModelCommand(model), null);
                }

                model.getAttributes().forEach(function (attribute) {
                    _this2.registerAttribute(attribute);
                });
                this.modelStoreChangeBus.trigger({ 'eventType': _constants.ADDED_TYPE, 'clientPresentationModel': model });
                added = true;
            }
            return added;
        }
    }, {
        key: 'remove',
        value: function remove(model) {
            var _this3 = this;

            if (!model) {
                return false;
            }
            var removed = false;
            if (this.presentationModels.has(model.id)) {
                this.removePresentationModelByType(model);
                this.presentationModels.delete(model.id);
                model.getAttributes().forEach(function (attribute) {
                    _this3.removeAttributeById(attribute);
                    if (attribute.getQualifier()) {
                        _this3.removeAttributeByQualifier(attribute);
                    }
                });
                this.modelStoreChangeBus.trigger({ 'eventType': _constants.REMOVED_TYPE, 'clientPresentationModel': model });
                removed = true;
            }
            return removed;
        }
    }, {
        key: 'findAttributesByFilter',
        value: function findAttributesByFilter(filter) {
            var matches = [];
            this.presentationModels.forEach(function (model) {
                model.getAttributes().forEach(function (attr) {
                    if (filter(attr)) {
                        matches.push(attr);
                    }
                });
            });
            return matches;
        }
    }, {
        key: 'addPresentationModelByType',
        value: function addPresentationModelByType(model) {
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
        }
    }, {
        key: 'removePresentationModelByType',
        value: function removePresentationModelByType(model) {
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
        }
    }, {
        key: 'listPresentationModelIds',
        value: function listPresentationModelIds() {
            var result = [];
            var iter = this.presentationModels.keys();
            var next = iter.next();
            while (!next.done) {
                result.push(next.value);
                next = iter.next();
            }
            return result;
        }
    }, {
        key: 'listPresentationModels',
        value: function listPresentationModels() {
            var result = [];
            var iter = this.presentationModels.values();
            var next = iter.next();
            while (!next.done) {
                result.push(next.value);
                next = iter.next();
            }
            return result;
        }
    }, {
        key: 'findPresentationModelById',
        value: function findPresentationModelById(id) {
            return this.presentationModels.get(id);
        }
    }, {
        key: 'findAllPresentationModelByType',
        value: function findAllPresentationModelByType(type) {
            if (!type || !this.presentationModelsPerType.has(type)) {
                return [];
            }
            return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
        }
    }, {
        key: 'deletePresentationModel',
        value: function deletePresentationModel(model, notify) {
            if (!model) {
                return;
            }
            if (this.containsPresentationModel(model.id)) {
                this.remove(model);
                if (!notify || model.clientSideOnly) {
                    return;
                }
                this.clientDolphin.getClientConnector().send(_commandFactory2.default.createPresentationModelDeletedCommand(model.id), null);
            }
        }
    }, {
        key: 'containsPresentationModel',
        value: function containsPresentationModel(id) {
            return this.presentationModels.has(id);
        }
    }, {
        key: 'addAttributeById',
        value: function addAttributeById(attribute) {
            if (!attribute || this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.set(attribute.id, attribute);
        }
    }, {
        key: 'removeAttributeById',
        value: function removeAttributeById(attribute) {
            if (!attribute || !this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.delete(attribute.id);
        }
    }, {
        key: 'findAttributeById',
        value: function findAttributeById(id) {
            return this.attributesPerId.get(id);
        }
    }, {
        key: 'addAttributeByQualifier',
        value: function addAttributeByQualifier(attribute) {
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
        }
    }, {
        key: 'removeAttributeByQualifier',
        value: function removeAttributeByQualifier(attribute) {
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
        }
    }, {
        key: 'findAllAttributesByQualifier',
        value: function findAllAttributesByQualifier(qualifier) {
            if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
                return [];
            }
            return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
        }
    }, {
        key: 'onModelStoreChange',
        value: function onModelStoreChange(eventHandler) {
            this.modelStoreChangeBus.onEvent(eventHandler);
        }
    }, {
        key: 'onModelStoreChangeForType',
        value: function onModelStoreChangeForType(presentationModelType, eventHandler) {
            this.modelStoreChangeBus.onEvent(function (pmStoreEvent) {
                if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                    eventHandler(pmStoreEvent);
                }
            });
        }
    }]);

    return ClientModelStore;
}();

exports.default = ClientModelStore;


ClientModelStore.LOGGER = _logging.LoggerFactory.getLogger('ClientModelStore');

},{"./attribute":93,"./commands/commandFactory":107,"./constants":122,"./eventBus":127,"./logging":130}],101:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var presentationModelInstanceCount = 0; // todo dk: consider making this static in class

var ClientPresentationModel = function () {
    function ClientPresentationModel(id, presentationModelType) {
        _classCallCheck(this, ClientPresentationModel);

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
        this.invalidBus = new _eventBus2.default();
        this.dirtyValueChangeBus = new _eventBus2.default();
    }
    // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
    /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */


    _createClass(ClientPresentationModel, [{
        key: 'copy',
        value: function copy() {
            var result = new ClientPresentationModel(null, this.presentationModelType);
            result.clientSideOnly = true;
            this.getAttributes().forEach(function (attribute) {
                var attributeCopy = attribute.copy();
                result.addAttribute(attributeCopy);
            });
            return result;
        }
        //add array of attributes

    }, {
        key: 'addAttributes',
        value: function addAttributes(attributes) {
            var _this = this;

            if (!attributes || attributes.length < 1) return;
            attributes.forEach(function (attr) {
                _this.addAttribute(attr);
            });
        }
    }, {
        key: 'addAttribute',
        value: function addAttribute(attribute) {
            var _this2 = this;

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
            attribute.onValueChange(function () {
                _this2.invalidBus.trigger({ source: _this2 });
            });
        }
    }, {
        key: 'onInvalidated',
        value: function onInvalidated(handleInvalidate) {
            this.invalidBus.onEvent(handleInvalidate);
        }
        /** returns a copy of the internal state */

    }, {
        key: 'getAttributes',
        value: function getAttributes() {
            return this.attributes.slice(0);
        }
    }, {
        key: 'getAt',
        value: function getAt(propertyName) {
            return this.findAttributeByPropertyName(propertyName);
        }
    }, {
        key: 'findAllAttributesByPropertyName',
        value: function findAllAttributesByPropertyName(propertyName) {
            var result = [];
            if (!propertyName) return null;
            this.attributes.forEach(function (attribute) {
                if (attribute.propertyName == propertyName) {
                    result.push(attribute);
                }
            });
            return result;
        }
    }, {
        key: 'findAttributeByPropertyName',
        value: function findAttributeByPropertyName(propertyName) {
            if (!propertyName) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].propertyName == propertyName) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'findAttributeByQualifier',
        value: function findAttributeByQualifier(qualifier) {
            if (!qualifier) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getQualifier() == qualifier) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'findAttributeById',
        value: function findAttributeById(id) {
            if (!id) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].id == id) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'syncWith',
        value: function syncWith(sourcePresentationModel) {
            this.attributes.forEach(function (targetAttribute) {
                var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
                if (sourceAttribute) {
                    targetAttribute.syncWith(sourceAttribute);
                }
            });
        }
    }]);

    return ClientPresentationModel;
}();

exports.default = ClientPresentationModel;

},{"./eventBus":127}],102:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _utils = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientContext = function () {
    function ClientContext(dolphin, beanManager, controllerManager, connector) {
        _classCallCheck(this, ClientContext);

        (0, _utils.checkMethod)('ClientContext(dolphin, beanManager, controllerManager, connector)');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(beanManager, 'beanManager');
        (0, _utils.checkParam)(controllerManager, 'controllerManager');
        (0, _utils.checkParam)(connector, 'connector');

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
                self._connector.invoke(_commandFactory2.default.createCreateContextCommand()).then(function () {
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
            (0, _utils.checkMethod)('ClientContext.createController(name)');
            (0, _utils.checkParam)(name, 'name');

            return this._controllerManager.createController(name);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var self = this;
            this.dolphin.stopPushListening();
            return new _promise2.default(function (resolve) {
                self._controllerManager.destroy().then(function () {
                    self._connector.invoke(_commandFactory2.default.createDestroyContextCommand());
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

},{"./commands/commandFactory":107,"./utils":137,"core-js/library/fn/promise":2,"emitter-component":92}],103:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('./commands/commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlindCommandBatcher = function () {
    function BlindCommandBatcher() {
        var folding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var maxBatchSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

        _classCallCheck(this, BlindCommandBatcher);

        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }

    _createClass(BlindCommandBatcher, [{
        key: 'batch',
        value: function batch(queue) {
            var batch = [];
            var batchLength = 0;
            while (queue[batchLength] && batchLength <= this.maxBatchSize) {
                var element = queue[batchLength];
                batchLength++;
                if (this.folding) {
                    if (element.command.id == _commandConstants.VALUE_CHANGED_COMMAND_ID && batch.length > 0 && batch[batch.length - 1].command.id == _commandConstants.VALUE_CHANGED_COMMAND_ID && element.command.attributeId == batch[batch.length - 1].command.attributeId) {
                        //merge ValueChange for same value
                        batch[batch.length - 1].command.newValue = element.command.newValue;
                    } else if (element.command.id == _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                        //We do not need it...
                    } else {
                        batch.push(element);
                    }
                } else {
                    batch.push(element);
                }
                if (element.handler) {
                    break;
                }
            }
            queue.splice(0, batchLength);
            return batch;
        }
    }]);

    return BlindCommandBatcher;
}();

exports.default = BlindCommandBatcher;

},{"./commands/commandConstants":106}],104:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = _dereq_('../utils');

var _constants = _dereq_('../constants');

var _commandConstants = _dereq_('./commandConstants');

var _valueChangedCommand = _dereq_('./impl/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _attributeMetadataChangedCommand = _dereq_('./impl/attributeMetadataChangedCommand');

var _attributeMetadataChangedCommand2 = _interopRequireDefault(_attributeMetadataChangedCommand);

var _callActionCommand = _dereq_('./impl/callActionCommand');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _changeAttributeMetadataCommand = _dereq_('./impl/changeAttributeMetadataCommand');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _createContextCommand = _dereq_('./impl/createContextCommand');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./impl/createControllerCommand');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _createPresentationModelCommand = _dereq_('./impl/createPresentationModelCommand');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _deletePresentationModelCommand = _dereq_('./impl/deletePresentationModelCommand');

var _deletePresentationModelCommand2 = _interopRequireDefault(_deletePresentationModelCommand);

var _destroyContextCommand = _dereq_('./impl/destroyContextCommand');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _destroyControllerCommand = _dereq_('./impl/destroyControllerCommand');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _interruptLongPollCommand = _dereq_('./impl/interruptLongPollCommand');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

var _presentationModelDeletedCommand = _dereq_('./impl/presentationModelDeletedCommand');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _startLongPollCommand = _dereq_('./impl/startLongPollCommand');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _codecError = _dereq_('./codecError');

var _codecError2 = _interopRequireDefault(_codecError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);
    }

    _createClass(Codec, null, [{
        key: '_encodeAttributeMetadataChangedCommand',
        value: function _encodeAttributeMetadataChangedCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeAttributeMetadataChangedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");
            (0, _utils.checkParam)(command.metadataName, "command.metadataName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            jsonCommand[_commandConstants.NAME] = command.metadataName;
            jsonCommand[_commandConstants.VALUE] = command.value;
            return jsonCommand;
        }
    }, {
        key: '_decodeAttributeMetadataChangedCommand',
        value: function _decodeAttributeMetadataChangedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeAttributeMetadataChangedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");

            var command = new _attributeMetadataChangedCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            command.metadataName = jsonCommand[_commandConstants.NAME];
            command.value = jsonCommand[_commandConstants.VALUE];
            return command;
        }
    }, {
        key: '_encodeCallActionCommand',
        value: function _encodeCallActionCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCallActionCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerid, "command.controllerid");
            (0, _utils.checkParam)(command.actionName, "command.actionName");
            (0, _utils.checkParam)(command.params, "command.params");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CALL_ACTION_COMMAND_ID;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.controllerid;
            jsonCommand[_commandConstants.NAME] = command.actionName;
            jsonCommand[_commandConstants.PARAMS] = command.params.map(function (param) {
                var result = {};
                result[_commandConstants.NAME] = param.name;
                if ((0, _utils.exists)(param.value)) {
                    result[_commandConstants.VALUE] = param.value;
                }
                return result;
            });
            return jsonCommand;
        }
    }, {
        key: '_decodeCallActionCommand',
        value: function _decodeCallActionCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCallActionCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PARAMS], "jsonCommand[PARAMS]");

            var command = new _callActionCommand2.default();
            command.controllerid = jsonCommand[_commandConstants.CONTROLLER_ID];
            command.actionName = jsonCommand[_commandConstants.NAME];
            //TODO: Für die Params sollten wir eine Klasse bereitstellen
            command.params = jsonCommand[_commandConstants.PARAMS].map(function (param) {
                return {
                    'name': param[_commandConstants.NAME],
                    'value': (0, _utils.exists)(param[_commandConstants.VALUE]) ? param[_commandConstants.VALUE] : null
                };
            });
            return command;
        }
    }, {
        key: '_encodeChangeAttributeMetadataCommand',
        value: function _encodeChangeAttributeMetadataCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeChangeAttributeMetadataCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");
            (0, _utils.checkParam)(command.metadataName, "command.metadataName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            jsonCommand[_commandConstants.NAME] = command.metadataName;
            jsonCommand[_commandConstants.VALUE] = command.value;
            return jsonCommand;
        }
    }, {
        key: '_decodeChangeAttributeMetadataCommand',
        value: function _decodeChangeAttributeMetadataCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeChangeAttributeMetadataCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");

            var command = new _changeAttributeMetadataCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            command.metadataName = jsonCommand[_commandConstants.NAME];
            command.value = jsonCommand[_commandConstants.VALUE];
            return command;
        }
    }, {
        key: '_encodeCreateContextCommand',
        value: function _encodeCreateContextCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCreateContextCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_CONTEXT_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeCreateContextCommand',
        value: function _decodeCreateContextCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCreateContextCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _createContextCommand2.default();
            return command;
        }
    }, {
        key: '_encodeCreateControllerCommand',
        value: function _encodeCreateControllerCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeCreateControllerCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerName, "command.controllerName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_CONTROLLER_COMMAND_ID;
            jsonCommand[_commandConstants.NAME] = command.controllerName;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.parentControllerId;
            return jsonCommand;
        }
    }, {
        key: '_decodeCreateControllerCommand',
        value: function _decodeCreateControllerCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeCreateControllerCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");

            var command = new _createControllerCommand2.default();
            command.controllerName = jsonCommand[_commandConstants.NAME];
            command.parentControllerId = jsonCommand[_commandConstants.CONTROLLER_ID];
            return command;
        }
    }, {
        key: '_encodeCreatePresentationModelCommand',
        value: function _encodeCreatePresentationModelCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCreatePresentationModelCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");
            (0, _utils.checkParam)(command.pmType, "command.pmType");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            jsonCommand[_commandConstants.PM_TYPE] = command.pmType;
            jsonCommand[_commandConstants.PM_ATTRIBUTES] = command.attributes.map(function (attribute) {
                var result = {};
                result[_commandConstants.NAME] = attribute.propertyName;
                result[_commandConstants.ATTRIBUTE_ID] = attribute.id;
                if ((0, _utils.exists)(attribute.value)) {
                    result[_commandConstants.VALUE] = attribute.value;
                }
                return result;
            });
            return jsonCommand;
        }
    }, {
        key: '_decodeCreatePresentationModelCommand',
        value: function _decodeCreatePresentationModelCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCreatePresentationModelCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_TYPE], "jsonCommand[PM_TYPE]");

            var command = new _createPresentationModelCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            command.pmType = jsonCommand[_commandConstants.PM_TYPE];

            //TODO: Für die Attribute sollten wir eine Klasse bereitstellen
            command.attributes = jsonCommand[_commandConstants.PM_ATTRIBUTES].map(function (attribute) {
                return {
                    'propertyName': attribute[_commandConstants.NAME],
                    'id': attribute[_commandConstants.ATTRIBUTE_ID],
                    'value': (0, _utils.exists)(attribute[_commandConstants.VALUE]) ? attribute[_commandConstants.VALUE] : null
                };
            });
            return command;
        }
    }, {
        key: '_encodeDeletePresentationModelCommand',
        value: function _encodeDeletePresentationModelCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDeletePresentationModelCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            return jsonCommand;
        }
    }, {
        key: '_decodeDeletePresentationModelCommand',
        value: function _decodeDeletePresentationModelCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDeletePresentationModelCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");

            var command = new _deletePresentationModelCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            return command;
        }
    }, {
        key: '_encodeDestroyContextCommand',
        value: function _encodeDestroyContextCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDestroyContextCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DESTROY_CONTEXT_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeDestroyContextCommand',
        value: function _decodeDestroyContextCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDestroyContextCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _destroyContextCommand2.default();
            return command;
        }
    }, {
        key: '_encodeDestroyControllerCommand',
        value: function _encodeDestroyControllerCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDestroyControllerCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerId, "command.controllerId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DESTROY_CONTROLLER_COMMAND_ID;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.controllerId;
            return jsonCommand;
        }
    }, {
        key: '_decodeDestroyControllerCommand',
        value: function _decodeDestroyControllerCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDestroyControllerCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");

            var command = new _destroyControllerCommand2.default();
            command.controllerId = jsonCommand[_commandConstants.CONTROLLER_ID];
            return command;
        }
    }, {
        key: '_encodeInterruptLongPollCommand',
        value: function _encodeInterruptLongPollCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeInterruptLongPollCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeInterruptLongPollCommand',
        value: function _decodeInterruptLongPollCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeInterruptLongPollCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _interruptLongPollCommand2.default();
            return command;
        }
    }, {
        key: '_encodePresentationModelDeletedCommand',
        value: function _encodePresentationModelDeletedCommand(command) {
            (0, _utils.checkMethod)("Codec._encodePresentationModelDeletedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            return jsonCommand;
        }
    }, {
        key: '_decodePresentationModelDeletedCommand',
        value: function _decodePresentationModelDeletedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodePresentationModelDeletedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");

            var command = new _presentationModelDeletedCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            return command;
        }
    }, {
        key: '_encodeStartLongPollCommand',
        value: function _encodeStartLongPollCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeStartLongPollCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.START_LONG_POLL_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeStartLongPollCommand',
        value: function _decodeStartLongPollCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeStartLongPollCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _startLongPollCommand2.default();
            return command;
        }
    }, {
        key: '_encodeValueChangedCommand',
        value: function _encodeValueChangedCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeValueChangedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.VALUE_CHANGED_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            if ((0, _utils.exists)(command.newValue)) {
                jsonCommand[_commandConstants.VALUE] = command.newValue;
            }
            return jsonCommand;
        }
    }, {
        key: '_decodeValueChangedCommand',
        value: function _decodeValueChangedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeValueChangedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");

            var command = new _valueChangedCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            if ((0, _utils.exists)(jsonCommand[_commandConstants.VALUE])) {
                command.newValue = jsonCommand[_commandConstants.VALUE];
            } else {
                command.newValue = null;
            }
            return command;
        }
    }, {
        key: 'encode',
        value: function encode(commands) {
            (0, _utils.checkMethod)("Codec.encode");
            (0, _utils.checkParam)(commands, "commands");

            var self = this;
            return JSON.stringify(commands.map(function (command) {
                if (command.id === _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID) {
                    return self._encodeAttributeMetadataChangedCommand(command);
                } else if (command.id === _commandConstants.CALL_ACTION_COMMAND_ID) {
                    return self._encodeCallActionCommand(command);
                } else if (command.id === _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID) {
                    return self._encodeChangeAttributeMetadataCommand(command);
                } else if (command.id === _commandConstants.CREATE_CONTEXT_COMMAND_ID) {
                    return self._encodeCreateContextCommand(command);
                } else if (command.id === _commandConstants.CREATE_CONTROLLER_COMMAND_ID) {
                    return self._encodeCreateControllerCommand(command);
                } else if (command.id === _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self._encodeCreatePresentationModelCommand(command);
                } else if (command.id === _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self._encodeDeletePresentationModelCommand(command);
                } else if (command.id === _commandConstants.DESTROY_CONTEXT_COMMAND_ID) {
                    return self._encodeDestroyContextCommand(command);
                } else if (command.id === _commandConstants.DESTROY_CONTROLLER_COMMAND_ID) {
                    return self._encodeDestroyControllerCommand(command);
                } else if (command.id === _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID) {
                    return self._encodeInterruptLongPollCommand(command);
                } else if (command.id === _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                    return self._encodePresentationModelDeletedCommand(command);
                } else if (command.id === _commandConstants.START_LONG_POLL_COMMAND_ID) {
                    return self._encodeStartLongPollCommand(command);
                } else if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                    return self._encodeValueChangedCommand(command);
                } else {
                    throw new _codecError2.default('Command of type ' + command.id + ' can not be handled');
                }
            }));
        }
    }, {
        key: 'decode',
        value: function decode(transmitted) {
            (0, _utils.checkMethod)("Codec.decode");
            (0, _utils.checkParam)(transmitted, "transmitted");

            if ((typeof transmitted === 'undefined' ? 'undefined' : _typeof(transmitted)) === _constants.JS_STRING_TYPE) {
                var self = this;
                return JSON.parse(transmitted).map(function (command) {
                    if (command.id === _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID) {
                        return self._decodeAttributeMetadataChangedCommand(command);
                    } else if (command.id === _commandConstants.CALL_ACTION_COMMAND_ID) {
                        return self._decodeCallActionCommand(command);
                    } else if (command.id === _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID) {
                        return self._decodeChangeAttributeMetadataCommand(command);
                    } else if (command.id === _commandConstants.CREATE_CONTEXT_COMMAND_ID) {
                        return self._decodeCreateContextCommand(command);
                    } else if (command.id === _commandConstants.CREATE_CONTROLLER_COMMAND_ID) {
                        return self._decodeCreateControllerCommand(command);
                    } else if (command.id === _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                        return self._decodeCreatePresentationModelCommand(command);
                    } else if (command.id === _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID) {
                        return self._decodeDeletePresentationModelCommand(command);
                    } else if (command.id === _commandConstants.DESTROY_CONTEXT_COMMAND_ID) {
                        return self._decodeDestroyContextCommand(command);
                    } else if (command.id === _commandConstants.DESTROY_CONTROLLER_COMMAND_ID) {
                        return self._decodeDestroyControllerCommand(command);
                    } else if (command.id === _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID) {
                        return self._decodeInterruptLongPollCommand(command);
                    } else if (command.id === _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                        return self._decodePresentationModelDeletedCommand(command);
                    } else if (command.id === _commandConstants.START_LONG_POLL_COMMAND_ID) {
                        return self._decodeStartLongPollCommand(command);
                    } else if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                        return self._decodeValueChangedCommand(command);
                    } else {
                        throw new _codecError2.default('Command of type ' + command.id + ' can not be handled');
                    }
                });
            } else {
                throw new _codecError2.default('Can not decode data that is not of type string');
            }
        }
    }]);

    return Codec;
}();

exports.default = Codec;

},{"../constants":122,"../utils":137,"./codecError":105,"./commandConstants":106,"./impl/attributeMetadataChangedCommand":108,"./impl/callActionCommand":109,"./impl/changeAttributeMetadataCommand":110,"./impl/createContextCommand":111,"./impl/createControllerCommand":112,"./impl/createPresentationModelCommand":113,"./impl/deletePresentationModelCommand":114,"./impl/destroyContextCommand":115,"./impl/destroyControllerCommand":116,"./impl/interruptLongPollCommand":117,"./impl/presentationModelDeletedCommand":118,"./impl/startLongPollCommand":119,"./impl/valueChangedCommand":120}],105:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CodecError = function (_Error) {
    _inherits(CodecError, _Error);

    function CodecError(message) {
        _classCallCheck(this, CodecError);

        return _possibleConstructorReturn(this, (CodecError.__proto__ || Object.getPrototypeOf(CodecError)).call(this, message));
    }

    return CodecError;
}(Error);

exports.default = CodecError;

},{}],106:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ATTRIBUTE_METADATA_CHANGED_COMMAND_ID = exports.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID = 'AttributeMetadataChanged';
var CALL_ACTION_COMMAND_ID = exports.CALL_ACTION_COMMAND_ID = 'CallAction';
var CHANGE_ATTRIBUTE_METADATA_COMMAND_ID = exports.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID = 'ChangeAttributeMetadata';
var CREATE_CONTEXT_COMMAND_ID = exports.CREATE_CONTEXT_COMMAND_ID = 'CreateContext';
var CREATE_CONTROLLER_COMMAND_ID = exports.CREATE_CONTROLLER_COMMAND_ID = 'CreateController';
var CREATE_PRESENTATION_MODEL_COMMAND_ID = exports.CREATE_PRESENTATION_MODEL_COMMAND_ID = 'CreatePresentationModel';
var DELETE_PRESENTATION_MODEL_COMMAND_ID = exports.DELETE_PRESENTATION_MODEL_COMMAND_ID = 'DeletePresentationModel';
var DESTROY_CONTEXT_COMMAND_ID = exports.DESTROY_CONTEXT_COMMAND_ID = 'DestroyContext';
var DESTROY_CONTROLLER_COMMAND_ID = exports.DESTROY_CONTROLLER_COMMAND_ID = 'DestroyController';
var INTERRUPT_LONG_POLL_COMMAND_ID = exports.INTERRUPT_LONG_POLL_COMMAND_ID = 'InterruptLongPoll';
var PRESENTATION_MODEL_DELETED_COMMAND_ID = exports.PRESENTATION_MODEL_DELETED_COMMAND_ID = 'PresentationModelDeleted';
var START_LONG_POLL_COMMAND_ID = exports.START_LONG_POLL_COMMAND_ID = 'StartLongPoll';
var VALUE_CHANGED_COMMAND_ID = exports.VALUE_CHANGED_COMMAND_ID = 'ValueChanged';

var ID = exports.ID = "id";
var ATTRIBUTE_ID = exports.ATTRIBUTE_ID = "a_id";
var PM_ID = exports.PM_ID = "p_id";
var CONTROLLER_ID = exports.CONTROLLER_ID = "c_id";
var PM_TYPE = exports.PM_TYPE = "t";
var NAME = exports.NAME = "n";
var VALUE = exports.VALUE = "v";
var PARAMS = exports.PARAMS = "p";
var PM_ATTRIBUTES = exports.PM_ATTRIBUTES = "a";

},{}],107:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createContextCommand = _dereq_('./impl/createContextCommand');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./impl/createControllerCommand');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./impl/callActionCommand');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _destroyControllerCommand = _dereq_('./impl/destroyControllerCommand');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _destroyContextCommand = _dereq_('./impl/destroyContextCommand');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _startLongPollCommand = _dereq_('./impl/startLongPollCommand');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _interruptLongPollCommand = _dereq_('./impl/interruptLongPollCommand');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

var _createPresentationModelCommand = _dereq_('./impl/createPresentationModelCommand');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _deletePresentationModelCommand = _dereq_('./impl/deletePresentationModelCommand');

var _deletePresentationModelCommand2 = _interopRequireDefault(_deletePresentationModelCommand);

var _presentationModelDeletedCommand = _dereq_('./impl/presentationModelDeletedCommand');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _valueChangedCommand = _dereq_('./impl/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _changeAttributeMetadataCommand = _dereq_('./impl/changeAttributeMetadataCommand');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _attributeMetadataChangedCommand = _dereq_('./impl/attributeMetadataChangedCommand');

var _attributeMetadataChangedCommand2 = _interopRequireDefault(_attributeMetadataChangedCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandFactory = function () {
    function CommandFactory() {
        _classCallCheck(this, CommandFactory);
    }

    _createClass(CommandFactory, null, [{
        key: 'createCreateContextCommand',
        value: function createCreateContextCommand() {
            return new _createContextCommand2.default();
        }
    }, {
        key: 'createCreateControllerCommand',
        value: function createCreateControllerCommand(controllerName, parentControllerId) {
            var command = new _createControllerCommand2.default();
            command.init(controllerName, parentControllerId);
            return command;
        }
    }, {
        key: 'createCallActionCommand',
        value: function createCallActionCommand(controllerid, actionName, params) {
            var command = new _callActionCommand2.default();
            command.init(controllerid, actionName, params);
            return command;
        }
    }, {
        key: 'createDestroyControllerCommand',
        value: function createDestroyControllerCommand(controllerId) {
            var command = new _destroyControllerCommand2.default();
            command.init(controllerId);
            return command;
        }
    }, {
        key: 'createDestroyContextCommand',
        value: function createDestroyContextCommand() {
            return new _destroyContextCommand2.default();
        }
    }, {
        key: 'createStartLongPollCommand',
        value: function createStartLongPollCommand() {
            return new _startLongPollCommand2.default();
        }
    }, {
        key: 'createInterruptLongPollCommand',
        value: function createInterruptLongPollCommand() {
            return new _interruptLongPollCommand2.default();
        }
    }, {
        key: 'createCreatePresentationModelCommand',
        value: function createCreatePresentationModelCommand(presentationModel) {
            var command = new _createPresentationModelCommand2.default();
            command.init(presentationModel);
            return command;
        }
    }, {
        key: 'createDeletePresentationModelCommand',
        value: function createDeletePresentationModelCommand(pmId) {
            var command = new _deletePresentationModelCommand2.default();
            command.init(pmId);
            return command;
        }
    }, {
        key: 'createPresentationModelDeletedCommand',
        value: function createPresentationModelDeletedCommand(pmId) {
            var command = new _presentationModelDeletedCommand2.default();
            command.init(pmId);
            return command;
        }
    }, {
        key: 'createValueChangedCommand',
        value: function createValueChangedCommand(attributeId, newValue) {
            var command = new _valueChangedCommand2.default();
            command.init(attributeId, newValue);
            return command;
        }
    }, {
        key: 'createChangeAttributeMetadataCommand',
        value: function createChangeAttributeMetadataCommand(attributeId, metadataName, value) {
            var command = new _changeAttributeMetadataCommand2.default();
            command.init(attributeId, metadataName, value);
            return command;
        }
    }, {
        key: 'createAttributeMetadataChangedCommand',
        value: function createAttributeMetadataChangedCommand(attributeId, metadataName, value) {
            var command = new _attributeMetadataChangedCommand2.default();
            command.init(attributeId, metadataName, value);
            return command;
        }
    }]);

    return CommandFactory;
}();

exports.default = CommandFactory;

},{"./impl/attributeMetadataChangedCommand":108,"./impl/callActionCommand":109,"./impl/changeAttributeMetadataCommand":110,"./impl/createContextCommand":111,"./impl/createControllerCommand":112,"./impl/createPresentationModelCommand":113,"./impl/deletePresentationModelCommand":114,"./impl/destroyContextCommand":115,"./impl/destroyControllerCommand":116,"./impl/interruptLongPollCommand":117,"./impl/presentationModelDeletedCommand":118,"./impl/startLongPollCommand":119,"./impl/valueChangedCommand":120}],108:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AttributeMetadataChangedCommand = function () {
    function AttributeMetadataChangedCommand() {
        _classCallCheck(this, AttributeMetadataChangedCommand);

        this.id = _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
    }

    _createClass(AttributeMetadataChangedCommand, [{
        key: 'init',
        value: function init(attributeId, metadataName, value) {
            (0, _utils.checkMethod)('AttributeMetadataChangedCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');
            (0, _utils.checkParam)(metadataName, 'metadataName');

            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
        }
    }]);

    return AttributeMetadataChangedCommand;
}();

exports.default = AttributeMetadataChangedCommand;

},{"../../utils":137,"../commandConstants":106}],109:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallActionCommand = function () {
    function CallActionCommand() {
        _classCallCheck(this, CallActionCommand);

        this.id = _commandConstants.CALL_ACTION_COMMAND_ID;
    }

    _createClass(CallActionCommand, [{
        key: 'init',
        value: function init(controllerid, actionName, params) {
            (0, _utils.checkMethod)('CreateControllerCommand.init()');
            (0, _utils.checkParam)(controllerid, 'controllerid');
            (0, _utils.checkParam)(actionName, 'actionName');

            this.controllerid = controllerid;
            this.actionName = actionName;
            this.params = params;
        }
    }]);

    return CallActionCommand;
}();

exports.default = CallActionCommand;

},{"../../utils":137,"../commandConstants":106}],110:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChangeAttributeMetadataCommand = function () {
    function ChangeAttributeMetadataCommand() {
        _classCallCheck(this, ChangeAttributeMetadataCommand);

        this.id = _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;
    }

    _createClass(ChangeAttributeMetadataCommand, [{
        key: 'init',
        value: function init(attributeId, metadataName, value) {
            (0, _utils.checkMethod)('ChangeAttributeMetadataCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');
            (0, _utils.checkParam)(metadataName, 'metadataName');

            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
        }
    }]);

    return ChangeAttributeMetadataCommand;
}();

exports.default = ChangeAttributeMetadataCommand;

},{"../../utils":137,"../commandConstants":106}],111:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateContextCommand = function CreateContextCommand() {
    _classCallCheck(this, CreateContextCommand);

    this.id = _commandConstants.CREATE_CONTEXT_COMMAND_ID;
};

exports.default = CreateContextCommand;

},{"../commandConstants":106}],112:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateControllerCommand = function () {
    function CreateControllerCommand() {
        _classCallCheck(this, CreateControllerCommand);

        this.id = _commandConstants.CREATE_CONTROLLER_COMMAND_ID;
    }

    _createClass(CreateControllerCommand, [{
        key: 'init',
        value: function init(controllerName, parentControllerId) {
            (0, _utils.checkMethod)('CreateControllerCommand.init()');
            (0, _utils.checkParam)(controllerName, 'controllerName');

            this.controllerName = controllerName;
            this.parentControllerId = parentControllerId;
        }
    }]);

    return CreateControllerCommand;
}();

exports.default = CreateControllerCommand;

},{"../../utils":137,"../commandConstants":106}],113:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreatePresentationModelCommand = function () {
    function CreatePresentationModelCommand() {
        _classCallCheck(this, CreatePresentationModelCommand);

        this.id = _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID;
    }

    _createClass(CreatePresentationModelCommand, [{
        key: 'init',
        value: function init(presentationModel) {
            (0, _utils.checkMethod)('CreatePresentationModelCommand.init()');
            (0, _utils.checkParam)(presentationModel, 'presentationModel');

            this.attributes = [];
            this.clientSideOnly = false;
            this.pmId = presentationModel.id;
            this.pmType = presentationModel.presentationModelType;
            var command = this;
            presentationModel.getAttributes().forEach(function (attr) {
                command.attributes.push({
                    propertyName: attr.propertyName,
                    id: attr.id,
                    value: attr.getValue()
                });
            });
        }
    }]);

    return CreatePresentationModelCommand;
}();

exports.default = CreatePresentationModelCommand;

},{"../../utils":137,"../commandConstants":106}],114:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeletePresentationModelCommand = function () {
    function DeletePresentationModelCommand() {
        _classCallCheck(this, DeletePresentationModelCommand);

        this.id = _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID;
    }

    _createClass(DeletePresentationModelCommand, [{
        key: 'init',
        value: function init(pmId) {
            (0, _utils.checkMethod)('DeletePresentationModelCommand.init()');
            (0, _utils.checkParam)(pmId, 'pmId');

            this.pmId = pmId;
        }
    }]);

    return DeletePresentationModelCommand;
}();

exports.default = DeletePresentationModelCommand;

},{"../../utils":137,"../commandConstants":106}],115:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyContextCommand = function DestroyContextCommand() {
    _classCallCheck(this, DestroyContextCommand);

    this.id = _commandConstants.DESTROY_CONTEXT_COMMAND_ID;
};

exports.default = DestroyContextCommand;

},{"../commandConstants":106}],116:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyControllerCommand = function () {
    function DestroyControllerCommand() {
        _classCallCheck(this, DestroyControllerCommand);

        this.id = _commandConstants.DESTROY_CONTROLLER_COMMAND_ID;
    }

    _createClass(DestroyControllerCommand, [{
        key: 'init',
        value: function init(controllerId) {
            (0, _utils.checkMethod)('DestroyControllerCommand.init()');
            (0, _utils.checkParam)(controllerId, 'controllerId');

            this.controllerId = controllerId;
        }
    }]);

    return DestroyControllerCommand;
}();

exports.default = DestroyControllerCommand;

},{"../../utils":137,"../commandConstants":106}],117:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InterruptLongPollCommand = function InterruptLongPollCommand() {
    _classCallCheck(this, InterruptLongPollCommand);

    this.id = _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID;
};

exports.default = InterruptLongPollCommand;

},{"../commandConstants":106}],118:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PresentationModelDeletedCommand = function () {
    function PresentationModelDeletedCommand() {
        _classCallCheck(this, PresentationModelDeletedCommand);

        this.id = _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID;
    }

    _createClass(PresentationModelDeletedCommand, [{
        key: 'init',
        value: function init(pmId) {
            (0, _utils.checkMethod)('PresentationModelDeletedCommand.init()');
            (0, _utils.checkParam)(pmId, 'pmId');

            this.pmId = pmId;
        }
    }]);

    return PresentationModelDeletedCommand;
}();

exports.default = PresentationModelDeletedCommand;

},{"../../utils":137,"../commandConstants":106}],119:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StartLongPollCommand = function StartLongPollCommand() {
    _classCallCheck(this, StartLongPollCommand);

    this.id = _commandConstants.START_LONG_POLL_COMMAND_ID;
};

exports.default = StartLongPollCommand;

},{"../commandConstants":106}],120:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueChangedCommand = function () {
    function ValueChangedCommand() {
        _classCallCheck(this, ValueChangedCommand);

        this.id = _commandConstants.VALUE_CHANGED_COMMAND_ID;
    }

    _createClass(ValueChangedCommand, [{
        key: 'init',
        value: function init(attributeId, newValue) {
            (0, _utils.checkMethod)('ValueChangedCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');

            this.attributeId = attributeId;
            this.newValue = newValue;
        }
    }]);

    return ValueChangedCommand;
}();

exports.default = ValueChangedCommand;

},{"../../utils":137,"../commandConstants":106}],121:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ACTION_CALL_BEAN = exports.SOURCE_SYSTEM_SERVER = exports.SOURCE_SYSTEM_CLIENT = exports.SOURCE_SYSTEM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _utils = _dereq_('./utils');

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _constants = _dereq_('./constants');

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

        (0, _utils.checkMethod)('Connector(url, dolphin, classRepository, config)');
        (0, _utils.checkParam)(url, 'url');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(classRepository, 'classRepository');

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
                if (event.eventType === _constants.ADDED_TYPE) {
                    self.onModelAdded(model);
                } else if (event.eventType === _constants.REMOVED_TYPE) {
                    self.onModelRemoved(model);
                }
            }
        });
    }

    _createClass(Connector, [{
        key: 'connect',
        value: function connect() {
            var that = this;
            that.dolphin.startPushListening(_commandFactory2.default.createStartLongPollCommand(), _commandFactory2.default.createInterruptLongPollCommand());
        }
    }, {
        key: 'onModelAdded',
        value: function onModelAdded(model) {
            (0, _utils.checkMethod)('Connector.onModelAdded(model)');
            (0, _utils.checkParam)(model, 'model');

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
            (0, _utils.checkMethod)('Connector.onModelRemoved(model)');
            (0, _utils.checkParam)(model, 'model');
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
            (0, _utils.checkMethod)('Connector.invoke(command)');
            (0, _utils.checkParam)(command, 'command');

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

},{"./commands/commandFactory":107,"./constants":122,"./utils":137,"core-js/library/fn/promise":2}],122:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var JS_STRING_TYPE = exports.JS_STRING_TYPE = 'string';

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

var ADDED_TYPE = exports.ADDED_TYPE = "ADDED";
var REMOVED_TYPE = exports.REMOVED_TYPE = "REMOVED";

},{}],123:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = _dereq_('core-js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _controllerproxy = _dereq_('./controllerproxy.js');

var _controllerproxy2 = _interopRequireDefault(_controllerproxy);

var _commandFactory = _dereq_('./commands/commandFactory.js');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

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
                    self.connector.invoke(_commandFactory2.default.createCreateControllerCommand(name, parentControllerId)).then(function () {
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
                            actionParams.push({ name: param, value: value });
                        }
                    }
                }

                self.connector.invoke(_commandFactory2.default.createCallActionCommand(controllerId, actionName, actionParams)).then(function () {
                    var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
                    if (isError) {
                        reject(new Error("Server side ControllerAction " + actionName + " caused an error. Please see server log for details."));
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
                    self.connector.invoke(_commandFactory2.default.createDestroyControllerCommand(controller.getId())).then(resolve);
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

},{"./commands/commandFactory.js":107,"./connector.js":121,"./controllerproxy.js":124,"./utils":137,"core-js/library/fn/promise":2,"core-js/library/fn/set":3}],124:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = _dereq_('core-js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

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
                    ControllerProxy.LOGGER.error('An exception occurred while calling an onDestroyed-handler', e);
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


ControllerProxy.LOGGER = _logging.LoggerFactory.getLogger('ControllerProxy');

},{"./logging":130,"./utils":137,"core-js/library/fn/set":3}],125:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _clientConnector = _dereq_('./clientConnector');

var _clientConnector2 = _interopRequireDefault(_clientConnector);

var _clientDolphin = _dereq_('./clientDolphin');

var _clientDolphin2 = _interopRequireDefault(_clientDolphin);

var _clientModelStore = _dereq_('./clientModelStore');

var _clientModelStore2 = _interopRequireDefault(_clientModelStore);

var _httpTransmitter = _dereq_('./httpTransmitter');

var _httpTransmitter2 = _interopRequireDefault(_httpTransmitter);

var _noTransmitter = _dereq_('./noTransmitter');

var _noTransmitter2 = _interopRequireDefault(_noTransmitter);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DolphinBuilder = function () {
    function DolphinBuilder() {
        _classCallCheck(this, DolphinBuilder);

        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }

    _createClass(DolphinBuilder, [{
        key: 'url',
        value: function url(_url) {
            this.url_ = _url;
            return this;
        }
    }, {
        key: 'reset',
        value: function reset(_reset) {
            this.reset_ = _reset;
            return this;
        }
    }, {
        key: 'slackMS',
        value: function slackMS(_slackMS) {
            this.slackMS_ = _slackMS;
            return this;
        }
    }, {
        key: 'maxBatchSize',
        value: function maxBatchSize(_maxBatchSize) {
            this.maxBatchSize_ = _maxBatchSize;
            return this;
        }
    }, {
        key: 'supportCORS',
        value: function supportCORS(_supportCORS) {
            this.supportCORS_ = _supportCORS;
            return this;
        }
    }, {
        key: 'errorHandler',
        value: function errorHandler(_errorHandler) {
            this.errorHandler_ = _errorHandler;
            return this;
        }
    }, {
        key: 'headersInfo',
        value: function headersInfo(_headersInfo) {
            this.headersInfo_ = _headersInfo;
            return this;
        }
    }, {
        key: 'build',
        value: function build() {
            var clientDolphin = new _clientDolphin2.default();
            var transmitter = void 0;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new _httpTransmitter2.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
            } else {
                transmitter = new _noTransmitter2.default();
            }
            clientDolphin.setClientConnector(new _clientConnector2.default(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new _clientModelStore2.default(clientDolphin));
            DolphinBuilder.LOGGER.debug("ClientDolphin initialized", clientDolphin, transmitter);
            return clientDolphin;
        }
    }]);

    return DolphinBuilder;
}();

exports.default = DolphinBuilder;


DolphinBuilder.LOGGER = _logging.LoggerFactory.getLogger('DolphinBuilder');

},{"./clientConnector":97,"./clientDolphin":99,"./clientModelStore":100,"./httpTransmitter":128,"./logging":130,"./noTransmitter":133}],126:[function(_dereq_,module,exports){
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

},{}],127:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus = function () {
    function EventBus() {
        _classCallCheck(this, EventBus);

        this.eventHandlers = [];
    }

    _createClass(EventBus, [{
        key: "onEvent",
        value: function onEvent(eventHandler) {
            this.eventHandlers.push(eventHandler);
        }
    }, {
        key: "trigger",
        value: function trigger(event) {
            this.eventHandlers.forEach(function (handle) {
                return handle(event);
            });
        }
    }]);

    return EventBus;
}();

exports.default = EventBus;

},{}],128:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpTransmitter = function () {
    function HttpTransmitter(url) {
        var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "UTF-8";
        var errorHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var supportCORS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var headersInfo = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        _classCallCheck(this, HttpTransmitter);

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
        this.codec = new _codec2.default();
        if (reset) {
            HttpTransmitter.LOGGER.error('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    _createClass(HttpTransmitter, [{
        key: 'transmit',
        value: function transmit(commands, onDone) {
            var _this = this;

            this.http.onerror = function () {
                _this.handleError('onerror', "");
                onDone([]);
            };
            this.http.onreadystatechange = function () {
                if (_this.http.readyState === _this.HttpCodes.finished) {
                    if (_this.http.status === _this.HttpCodes.success) {
                        var responseText = _this.http.responseText;
                        if (responseText.trim().length > 0) {
                            try {
                                var responseCommands = _this.codec.decode(responseText);
                                onDone(responseCommands);
                            } catch (err) {
                                HttpTransmitter.LOGGER.error("Error occurred parsing responseText: ", err, responseText);
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
            var encodedCommands = this.codec.encode([commands]);
            HttpTransmitter.LOGGER.trace('transmitting', commands, encodedCommands);
            this.http.send(encodedCommands);
        }
    }, {
        key: 'setHeaders',
        value: function setHeaders(httpReq) {
            if (this.headersInfo) {
                for (var i in this.headersInfo) {
                    if (this.headersInfo.hasOwnProperty(i)) {
                        httpReq.setRequestHeader(i, this.headersInfo[i]);
                    }
                }
            }
        }
    }, {
        key: 'handleError',
        value: function handleError(kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            } else {
                HttpTransmitter.LOGGER.error("Error occurred: ", errorEvent);
            }
        }
    }, {
        key: 'signal',
        value: function signal(command) {
            this.sig.open('POST', this.url, true);
            this.setHeaders(this.sig);
            var encodedCommand = this.codec.encode([command]);
            HttpTransmitter.LOGGER.trace('signal', command, encodedCommand);
            this.sig.send(encodedCommand);
        }
    }, {
        key: 'invalidate',
        value: function invalidate() {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        }
    }]);

    return HttpTransmitter;
}();

exports.default = HttpTransmitter;


HttpTransmitter.LOGGER = _logging.LoggerFactory.getLogger('HttpTransmitter');

},{"./commands/codec":104,"./logging":130}],129:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var LogLevel = {
    NONE: { name: 'NONE', text: '[NONE ]', level: 0 },
    ALL: { name: 'ALL', text: '[ALL  ]', level: 100 },
    TRACE: { name: 'TRACE', text: '[TRACE]', level: 5 },
    DEBUG: { name: 'DEBUG', text: '[DEBUG]', level: 4 },
    INFO: { name: 'INFO', text: '[INFO ]', level: 3 },
    WARN: { name: 'WARN', text: '[WARN ]', level: 2 },
    ERROR: { name: 'ERROR', text: '[ERROR]', level: 1 }
};

exports.LogLevel = LogLevel;

},{}],130:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerFactory = exports.LogLevel = undefined;

var _constants = _dereq_("./constants");

var _loggerfactory = _dereq_("./loggerfactory");

exports.LogLevel = _constants.LogLevel;
exports.LoggerFactory = _loggerfactory.LoggerFactory;

},{"./constants":129,"./loggerfactory":132}],131:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = _dereq_('../utils');

var _constants = _dereq_('./constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// private methods
var LOCALS = {
    pad: function pad(text, size) {
        var result = '' + text;
        while (result.length < size) {
            result = '0' + result;
        }
        return result;
    },
    internalLog: function internalLog() {
        var args = Array.from(arguments);
        var func = args.shift();
        var context = args.shift();
        var logLevel = args.shift();
        var date = new Date();
        var dateString = date.getFullYear() + '-' + LOCALS.pad(date.getMonth(), 2) + '-' + LOCALS.pad(date.getDate(), 2) + ' ' + LOCALS.pad(date.getHours(), 2) + ':' + LOCALS.pad(date.getMinutes(), 2) + ':' + LOCALS.pad(date.getSeconds(), 2) + '.' + LOCALS.pad(date.getMilliseconds(), 3);
        func.apply(undefined, [dateString, logLevel.text, context].concat(_toConsumableArray(args)));
    },
    getCookie: function getCookie(name) {
        if ((0, _utils.exists)(window) && (0, _utils.exists)(window.document) && (0, _utils.exists)(window.document.cookie)) {
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }
    }
};

// public

var Logger = function () {
    function Logger(context, rootLogger) {
        _classCallCheck(this, Logger);

        this.context = context;
        this.rootLogger = rootLogger;
        var cookieLogLevel = LOCALS.getCookie('DOLPHIN_PLATFORM_' + this.context);
        switch (cookieLogLevel) {
            case 'NONE':
                this.logLevel = _constants.LogLevel.NONE;
                break;
            case 'ALL':
                this.logLevel = _constants.LogLevel.ALL;
                break;
            case 'TRACE':
                this.logLevel = _constants.LogLevel.TRACE;
                break;
            case 'DEBUG':
                this.logLevel = _constants.LogLevel.DEBUG;
                break;
            case 'INFO':
                this.logLevel = _constants.LogLevel.INFO;
                break;
            case 'WARN':
                this.logLevel = _constants.LogLevel.WARN;
                break;
            case 'ERROR':
                this.logLevel = _constants.LogLevel.ERROR;
                break;
        }
    }

    _createClass(Logger, [{
        key: 'trace',
        value: function trace() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.TRACE)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.TRACE].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'debug',
        value: function debug() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.DEBUG)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.DEBUG].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'info',
        value: function info() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.INFO)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.INFO].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'warn',
        value: function warn() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.WARN)) {
                LOCALS.internalLog.apply(LOCALS, [console.warn, this.context, _constants.LogLevel.WARN].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'error',
        value: function error() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.ERROR)) {
                LOCALS.internalLog.apply(LOCALS, [console.error, this.context, _constants.LogLevel.ERROR].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'getLogLevel',
        value: function getLogLevel() {
            if ((0, _utils.exists)(this.logLevel)) {
                return this.logLevel;
            } else if ((0, _utils.exists)(this.rootLogger)) {
                return this.rootLogger.getLogLevel();
            } else {
                return _constants.LogLevel.INFO;
            }
        }
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            this.logLevel = level;
        }
    }, {
        key: 'setLogLevelByName',
        value: function setLogLevelByName(levelName) {
            if ((0, _utils.exists)(_constants.LogLevel[levelName])) {
                this.logLevel = _constants.LogLevel[levelName];
            }
        }
    }, {
        key: 'isLogLevel',
        value: function isLogLevel(level) {
            if (this.getLogLevel() === _constants.LogLevel.NONE) {
                return false;
            }
            if (this.getLogLevel() === _constants.LogLevel.ALL) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.TRACE) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.DEBUG && level !== _constants.LogLevel.TRACE) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.INFO && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.WARN && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG && level !== _constants.LogLevel.INFO) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.ERROR && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG && level !== _constants.LogLevel.INFO && level !== _constants.LogLevel.WARN) {
                return true;
            }
            return false;
        }
    }, {
        key: 'isLogLevelUseable',
        value: function isLogLevelUseable(level) {
            (0, _utils.checkParam)(level, 'level');
            if (level.level) {
                return this.getLogLevel().level >= level.level;
            } else {
                return false;
            }
        }
    }]);

    return Logger;
}();

exports.Logger = Logger;

},{"../utils":137,"./constants":129}],132:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoggerFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_("core-js/library/fn/map");

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_("../utils");

var _logger = _dereq_("./logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROOT_LOGGER = new _logger.Logger('ROOT');

// private methods
var LOCALS = {
    loggers: new _map2.default()
};

// public

var LoggerFactory = function () {
    function LoggerFactory() {
        _classCallCheck(this, LoggerFactory);
    }

    _createClass(LoggerFactory, null, [{
        key: "getLogger",
        value: function getLogger(context) {
            if (!(0, _utils.exists)(context) || context === 'ROOT') {
                return ROOT_LOGGER;
            }
            var existingLogger = LOCALS.loggers.get(context);
            if (existingLogger) {
                return existingLogger;
            }

            var logger = new _logger.Logger(context, ROOT_LOGGER);
            LOCALS.loggers.set(context, logger);
            return logger;
        }
    }]);

    return LoggerFactory;
}();

exports.LoggerFactory = LoggerFactory;

},{"../utils":137,"./logger":131,"core-js/library/fn/map":1}],133:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NoTransmitter = function () {
    function NoTransmitter() {
        _classCallCheck(this, NoTransmitter);
    }

    _createClass(NoTransmitter, [{
        key: "transmit",
        value: function transmit(commands, onDone) {
            // do nothing special
            onDone([]);
        }
    }, {
        key: "signal",
        value: function signal() {
            // do nothing
        }
    }, {
        key: "reset",
        value: function reset() {
            // do nothing
        }
    }]);

    return NoTransmitter;
}();

exports.default = NoTransmitter;

},{}],134:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dolphin = dolphin;
exports.makeDolphin = makeDolphin;

var _dolphinBuilder = _dereq_('./dolphinBuilder');

var _dolphinBuilder2 = _interopRequireDefault(_dolphinBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dolphin(url, reset) {
    var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

function makeDolphin() {
    return new _dolphinBuilder2.default();
}

},{"./dolphinBuilder":125}],135:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _utils = _dereq_('./utils');

var _errors = _dereq_('./errors');

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _remotingErrorHandler = _dereq_('./remotingErrorHandler');

var _remotingErrorHandler2 = _interopRequireDefault(_remotingErrorHandler);

var _logging = _dereq_('./logging');

var _commandConstants = _dereq_('./commands/commandConstants');

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
                    PlatformHttpTransmitter.LOGGER.error('HTTP network error', errorContent);
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

                                    if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.TRACE)) {
                                        try {
                                            var json = JSON.parse(http.responseText);
                                            if (json.length > 0) {
                                                PlatformHttpTransmitter.LOGGER.debug('HTTP response with SUCCESS', currentClientId, json);
                                            }
                                        } catch (error) {
                                            PlatformHttpTransmitter.LOGGER.error('Response could not be parsed to JSON for logging');
                                        }
                                    }

                                    PlatformHttpTransmitter.LOGGER.trace('HTTP response with SUCCESS', currentClientId, http.responseText);
                                    resolve(http.responseText);
                                    break;
                                }

                            case REQUEST_TIMEOUT:
                                PlatformHttpTransmitter.LOGGER.error('HTTP request timeout');
                                _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Session Timeout'));
                                break;

                            default:
                                if (_this.failed_attempt <= _this.maxRetry) {
                                    _this.failed_attempt = _this.failed_attempt + 1;
                                }
                                PlatformHttpTransmitter.LOGGER.error('HTTP unsupported status, with HTTP status', http.status);
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

                var encodedCommands = _codec2.default.encode(commands);

                if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.TRACE)) {
                    for (var _i = 0; _i < commands.length; _i++) {
                        var command = commands[_i];
                        if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                            PlatformHttpTransmitter.LOGGER.debug('send', command, encodedCommands);
                        }
                    }
                }

                PlatformHttpTransmitter.LOGGER.trace('send', commands, encodedCommands);
                if (_this.failed_attempt > _this.maxRetry) {
                    setTimeout(function () {
                        http.send(encodedCommands);
                    }, _this.timeout);
                } else {
                    http.send(encodedCommands);
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


PlatformHttpTransmitter.LOGGER = _logging.LoggerFactory.getLogger('PlatformHttpTransmitter');

(0, _emitterComponent2.default)(PlatformHttpTransmitter.prototype);

},{"./commands/codec":104,"./commands/commandConstants":106,"./errors":126,"./logging":130,"./remotingErrorHandler":136,"./utils":137,"emitter-component":92}],136:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logging = _dereq_('./logging');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RemotingErrorHandler = function () {
    function RemotingErrorHandler() {
        _classCallCheck(this, RemotingErrorHandler);
    }

    _createClass(RemotingErrorHandler, [{
        key: 'onError',
        value: function onError(error) {
            RemotingErrorHandler.LOGGER.error(error);
        }
    }]);

    return RemotingErrorHandler;
}();

exports.default = RemotingErrorHandler;


RemotingErrorHandler.LOGGER = _logging.LoggerFactory.getLogger('RemotingErrorHandler');

},{"./logging":130}],137:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exists;
exports.checkMethod = checkMethod;
exports.checkParam = checkParam;
var _checkMethodName;

function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

function checkMethod(name) {
    _checkMethodName = name;
}

function checkParam(param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
}

},{}]},{},[98])(98)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1mcm9tLWl0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm1hcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL21hcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWZyb20taXRlcmFibGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW52b2tlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX25ldy1wcm9taXNlLWNhcGFiaWxpdHkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wZXJmb3JtLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9taXNlLXJlc29sdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLWZyb20uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLW9mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190YXNrLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL192YWxpZGF0ZS1jb2xsZWN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLmZyb20uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC5vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLnRvLWpzb24uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcucHJvbWlzZS50cnkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC5mcm9tLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQub2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ub2RlX21vZHVsZXMvZW1pdHRlci1jb21wb25lbnQvaW5kZXguanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvYXR0cmlidXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2JlYW5tYW5hZ2VyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NsYXNzcmVwby5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jbGllbnRBdHRyaWJ1dGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY2xpZW50Q29ubmVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NsaWVudENvbnRleHRGYWN0b3J5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NsaWVudERvbHBoaW4uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY2xpZW50TW9kZWxTdG9yZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jbGllbnRjb250ZXh0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NvbW1hbmRCYXRjaGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NvbW1hbmRzL2NvZGVjLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NvbW1hbmRzL2NvZGVjRXJyb3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvY29tbWFuZENvbnN0YW50cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9jb21tYW5kRmFjdG9yeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9jYWxsQWN0aW9uQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9pbXBsL2NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9pbXBsL2NyZWF0ZUNvbnRleHRDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NvbW1hbmRzL2ltcGwvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9kZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9kZXN0cm95Q29udGV4dENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC9wcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2NvbW1hbmRzL2ltcGwvc3RhcnRMb25nUG9sbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Nvbm5lY3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb25zdGFudHMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcnByb3h5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2RvbHBoaW5CdWlsZGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Vycm9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9ldmVudEJ1cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9odHRwVHJhbnNtaXR0ZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvbG9nZ2luZy9jb25zdGFudHMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvbG9nZ2luZy9pbmRleC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9sb2dnaW5nL2xvZ2dlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9sb2dnaW5nL2xvZ2dlcmZhY3RvcnkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvbm9UcmFuc21pdHRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9vcGVuRG9scGhpbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy91dGlscy5qcyIsInNyYy9iZWhhdmlvci5qcyIsInNyYy9iaW5kZXIuanMiLCJzcmMvZG9scGhpbi1wb2x5bWVyLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1pBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5NYXA7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKXtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlciwgSVRFUkFUT1Ipe1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvck9mKGl0ZXIsIGZhbHNlLCByZXN1bHQucHVzaCwgcmVzdWx0LCBJVEVSQVRPUik7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGFzYyAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSwgJGNyZWF0ZSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVhcbiAgICAsIGNyZWF0ZSAgICAgICAgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGlzQXJyYXkgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59OyIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgY3JlYXRlICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBoaWRlICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgYW5JbnN0YW5jZSAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZGVmaW5lZCAgICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpXG4gICwgc3RlcCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIHNldFNwZWNpZXMgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIGZhc3RLZXkgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXlcbiAgLCBTSVpFICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYodGhhdC5fZiA9PSBlbnRyeSl0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0Ll9sID09IGVudHJ5KXRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCAnZm9yRWFjaCcpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIGZyb20gICAgPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgaWYoY2xhc3NvZih0aGlzKSAhPSBOQU1FKXRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIG1ldGEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGFuSW5zdGFuY2UgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBkUCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9IGdsb2JhbFtOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgaWYoIURFU0NSSVBUT1JTIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FLCAnX2MnKTtcbiAgICAgIHRhcmdldC5fYyA9IG5ldyBCYXNlO1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgZWFjaCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYy5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GLCBPKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICwgQlJFQUsgICAgICAgPSB7fVxuICAsIFJFVFVSTiAgICAgID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKCc8c2NyaXB0PmRvY3VtZW50LkY9T2JqZWN0PC9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpe1xuICAgIGlmKHNhZmUgJiYgdGFyZ2V0W2tleV0pdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZihERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKWRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdNYXAnLCB7dG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59IiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLm9mJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTWFwO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS50cnknKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0Lm9mJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyLCBJVEVSQVRPUikge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvck9mKGl0ZXIsIGZhbHNlLCByZXN1bHQucHVzaCwgcmVzdWx0LCBJVEVSQVRPUik7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYXNjID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRZUEUsICRjcmVhdGUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICB2YXIgY3JlYXRlID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWwsIHJlcztcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHJlc3VsdFtpbmRleF0gPSByZXM7ICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlcykgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWwpKSB7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBmYXN0S2V5ID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0laRSA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICB2YXIgZW50cnk7XG4gIGlmIChpbmRleCAhPT0gJ0YnKSByZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IgKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgIGlmIChlbnRyeS5rID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uICh3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKSB7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0aGF0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX3QgPSBOQU1FOyAgICAgICAgIC8vIGNvbGxlY3Rpb24gdHlwZVxuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGZvciAodmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKSwgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChlbnRyeS5wKSBlbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubjtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYgKHRoYXQuX2YgPT0gZW50cnkpIHRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmICh0aGF0Ll9sID09IGVudHJ5KSB0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKSB7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTkFNRSksIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHRoaXMsIE5BTUUpW1NJWkVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICB2YXIgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZiAoIXRoYXQuX2YpIHRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBOQU1FLCBJU19NQVApIHtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICB0aGlzLl90ID0gdmFsaWRhdGUoaXRlcmF0ZWQsIE5BTUUpOyAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7ICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGtpbmQgPSB0aGF0Ll9rO1xuICAgICAgdmFyIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZiAoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSkge1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIGZyb20gPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgaWYgKGNsYXNzb2YodGhpcykgIT0gTkFNRSkgdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBlYWNoID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgaWYgKCFERVNDUklQVE9SUyB8fCB0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpIHtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRhcmdldCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FLCAnX2MnKTtcbiAgICAgIHRhcmdldC5fYyA9IG5ldyBCYXNlKCk7XG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgIGVhY2goJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzLHRvSlNPTicuc3BsaXQoJywnKSwgZnVuY3Rpb24gKEtFWSkge1xuICAgICAgdmFyIElTX0FEREVSID0gS0VZID09ICdhZGQnIHx8IEtFWSA9PSAnc2V0JztcbiAgICAgIGlmIChLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSkgaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsIEtFWSk7XG4gICAgICAgIGlmICghSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpIHJldHVybiBLRVkgPT0gJ2dldCcgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NbS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gSVNfQURERVIgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgSVNfV0VBSyB8fCBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYgKCFJU19XRUFLKSBjb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNS4xJyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgSVNfV1JBUCA9IHR5cGUgJiAkZXhwb3J0Llc7XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXTtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBrZXksIG93biwgb3V0O1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmIChvd24gJiYga2V5IGluIGV4cG9ydHMpIGNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24gKEMpIHtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBDKSB7XG4gICAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQygpO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZiAoSVNfUFJPVE8pIHtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZiAodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSkgaGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgQlJFQUsgPSB7fTtcbnZhciBSRVRVUk4gPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUikge1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSk7XG4gIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmIChpc0FycmF5SXRlcihpdGVyRm4pKSBmb3IgKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOykge1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZG9uZSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmUgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuIiwidmFyIE1FVEEgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgc2V0RGVzYyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaWQgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBzZXREZXNjKGl0LCBNRVRBLCB7IHZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpIHNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiBNRVRBLFxuICBORUVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2VhazogZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbiAgfSBlbHNlIGlmIChPYnNlcnZlcikge1xuICAgIHZhciB0b2dnbGUgPSB0cnVlO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYgKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKSB7XG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIHZhciB0YXNrID0geyBmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCB9O1xuICAgIGlmIChsYXN0KSBsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmICghaGVhZCkge1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDI1LjQuMS41IE5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xuXG5mdW5jdGlvbiBQcm9taXNlQ2FwYWJpbGl0eShDKSB7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uICgkJHJlc29sdmUsICQkcmVqZWN0KSB7XG4gICAgaWYgKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiAoQykge1xuICByZXR1cm4gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4geyBlOiBmYWxzZSwgdjogZXhlYygpIH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBlOiB0cnVlLCB2OiBlIH07XG4gIH1cbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDLCB4KSB7XG4gIGFuT2JqZWN0KEMpO1xuICBpZiAoaXNPYmplY3QoeCkgJiYgeC5jb25zdHJ1Y3RvciA9PT0gQykgcmV0dXJuIHg7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYoQyk7XG4gIHZhciByZXNvbHZlID0gcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgcmVzb2x2ZSh4KTtcbiAgcmV0dXJuIHByb21pc2VDYXBhYmlsaXR5LnByb21pc2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGlmIChzYWZlICYmIHRhcmdldFtrZXldKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IGZyb206IGZ1bmN0aW9uIGZyb20oc291cmNlIC8qICwgbWFwRm4sIHRoaXNBcmcgKi8pIHtcbiAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIG1hcHBpbmcsIEEsIG4sIGNiO1xuICAgIGFGdW5jdGlvbih0aGlzKTtcbiAgICBtYXBwaW5nID0gbWFwRm4gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAobWFwcGluZykgYUZ1bmN0aW9uKG1hcEZuKTtcbiAgICBpZiAoc291cmNlID09IHVuZGVmaW5lZCkgcmV0dXJuIG5ldyB0aGlzKCk7XG4gICAgQSA9IFtdO1xuICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICBuID0gMDtcbiAgICAgIGNiID0gY3R4KG1hcEZuLCBhcmd1bWVudHNbMl0sIDIpO1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgZnVuY3Rpb24gKG5leHRJdGVtKSB7XG4gICAgICAgIEEucHVzaChjYihuZXh0SXRlbSwgbisrKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgQS5wdXNoLCBBKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS9cbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTExFQ1RJT04pIHtcbiAgJGV4cG9ydCgkZXhwb3J0LlMsIENPTExFQ1RJT04sIHsgb2Y6IGZ1bmN0aW9uIG9mKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBBID0gQXJyYXkobGVuZ3RoKTtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIEFbbGVuZ3RoXSA9IGFyZ3VtZW50c1tsZW5ndGhdO1xuICAgIHJldHVybiBuZXcgdGhpcyhBKTtcbiAgfSB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZKSB7XG4gIHZhciBDID0gdHlwZW9mIGNvcmVbS0VZXSA9PSAnZnVuY3Rpb24nID8gY29yZVtLRVldIDogZ2xvYmFsW0tFWV07XG4gIGlmIChERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKSBkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59O1xuIiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBEKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi9faHRtbCcpO1xudmFyIGNlbCA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgc2V0VGFzayA9IGdsb2JhbC5zZXRJbW1lZGlhdGU7XG52YXIgY2xlYXJUYXNrID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xudmFyIE1lc3NhZ2VDaGFubmVsID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsO1xudmFyIERpc3BhdGNoID0gZ2xvYmFsLkRpc3BhdGNoO1xudmFyIGNvdW50ZXIgPSAwO1xudmFyIHF1ZXVlID0ge307XG52YXIgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG52YXIgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaWQgPSArdGhpcztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZiAoIXNldFRhc2sgfHwgIWNsZWFyVGFzaykge1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgaSA9IDE7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCkge1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZiAocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBTcGhlcmUgKEpTIGdhbWUgZW5naW5lKSBEaXNwYXRjaCBBUElcbiAgfSBlbHNlIGlmIChEaXNwYXRjaCAmJiBEaXNwYXRjaC5ub3cpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgRGlzcGF0Y2gubm93KGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYgKE1lc3NhZ2VDaGFubmVsKSB7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYgKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIga2luZCA9IHRoaXMuX2s7XG4gIHZhciBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYgKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKSB7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIE1BUCA9ICdNYXAnO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShNQVAsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7XG4iLCIiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciB0YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBtaWNyb3Rhc2sgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuL19wcm9taXNlLXJlc29sdmUnKTtcbnZhciBQUk9NSVNFID0gJ1Byb21pc2UnO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyICRQcm9taXNlID0gZ2xvYmFsW1BST01JU0VdO1xudmFyIGlzTm9kZSA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xudmFyIGVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIEludGVybmFsLCBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIE93blByb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSA9ICRQcm9taXNlLnJlc29sdmUoMSk7XG4gICAgdmFyIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbiAoZXhlYykge1xuICAgICAgZXhlYyhlbXB0eSwgZW1wdHkpO1xuICAgIH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZS5faCA9PSAyKSBvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFuZGxlciA9PT0gdHJ1ZSkgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSkge1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpKSBydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZiAoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpIG9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgdW5oYW5kbGVkID0gaXNVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgdmFyIHJlc3VsdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZiAodW5oYW5kbGVkKSB7XG4gICAgICByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pIHtcbiAgICAgICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmICh1bmhhbmRsZWQgJiYgcmVzdWx0LmUpIHRocm93IHJlc3VsdC52O1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5faCA9PSAxKSByZXR1cm4gZmFsc2U7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYztcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVhY3Rpb247XG4gIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpKSB7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmIChyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSkgcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTRVQgPSAnU2V0JztcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBTRVQpLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLW1hcC5mcm9tXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1mcm9tJykoJ01hcCcpO1xuIiwiLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tLyNzZWMtbWFwLm9mXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1vZicpKCdNYXAnKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnTWFwJywgeyB0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKSB9KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtZmluYWxseVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1Byb21pc2UnLCB7ICdmaW5hbGx5JzogZnVuY3Rpb24gKG9uRmluYWxseSkge1xuICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBjb3JlLlByb21pc2UgfHwgZ2xvYmFsLlByb21pc2UpO1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBvbkZpbmFsbHkgPT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9KTtcbiAgICB9IDogb25GaW5hbGx5LFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSk7XG4gICAgfSA6IG9uRmluYWxseVxuICApO1xufSB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtdHJ5XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUHJvbWlzZScsIHsgJ3RyeSc6IGZ1bmN0aW9uIChjYWxsYmFja2ZuKSB7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYodGhpcyk7XG4gIHZhciByZXN1bHQgPSBwZXJmb3JtKGNhbGxiYWNrZm4pO1xuICAocmVzdWx0LmUgPyBwcm9taXNlQ2FwYWJpbGl0eS5yZWplY3QgOiBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlKShyZXN1bHQudik7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufSB9KTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLXNldC5mcm9tXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1mcm9tJykoJ1NldCcpO1xuIiwiLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tLyNzZWMtc2V0Lm9mXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1vZicpKCdTZXQnKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnU2V0JywgeyB0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKSB9KTtcbiIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbnZhciBET01JdGVyYWJsZXMgPSAoJ0NTU1J1bGVMaXN0LENTU1N0eWxlRGVjbGFyYXRpb24sQ1NTVmFsdWVMaXN0LENsaWVudFJlY3RMaXN0LERPTVJlY3RMaXN0LERPTVN0cmluZ0xpc3QsJyArXG4gICdET01Ub2tlbkxpc3QsRGF0YVRyYW5zZmVySXRlbUxpc3QsRmlsZUxpc3QsSFRNTEFsbENvbGxlY3Rpb24sSFRNTENvbGxlY3Rpb24sSFRNTEZvcm1FbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50LCcgK1xuICAnTWVkaWFMaXN0LE1pbWVUeXBlQXJyYXksTmFtZWROb2RlTWFwLE5vZGVMaXN0LFBhaW50UmVxdWVzdExpc3QsUGx1Z2luLFBsdWdpbkFycmF5LFNWR0xlbmd0aExpc3QsU1ZHTnVtYmVyTGlzdCwnICtcbiAgJ1NWR1BhdGhTZWdMaXN0LFNWR1BvaW50TGlzdCxTVkdTdHJpbmdMaXN0LFNWR1RyYW5zZm9ybUxpc3QsU291cmNlQnVmZmVyTGlzdCxTdHlsZVNoZWV0TGlzdCxUZXh0VHJhY2tDdWVMaXN0LCcgK1xuICAnVGV4dFRyYWNrTGlzdCxUb3VjaExpc3QnKS5zcGxpdCgnLCcpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IERPTUl0ZXJhYmxlcy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IERPTUl0ZXJhYmxlc1tpXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dHJpYnV0ZSB7XG59XG5cbkF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFkgPSBcInF1YWxpZmllclwiO1xuQXR0cmlidXRlLlZBTFVFID0gXCJ2YWx1ZVwiO1xuIiwiaW1wb3J0ICBNYXAgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlYW5NYW5hZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXNzUmVwb3NpdG9yeSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hbGxBZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBbXTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIEJlYW5NYW5hZ2VyLkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xuICAgIH1cblxuXG4gICAgaXNNYW5hZ2VkKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmlzTWFuYWdlZChiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uaXNNYW5hZ2VkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBjcmVhdGUodHlwZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuY3JlYXRlKHR5cGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZCh0eXBlLCBiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGRBbGwodHlwZSwgY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVBbGwoY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUlmKHByZWRpY2F0ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlSWYocHJlZGljYXRlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHByZWRpY2F0ZSwgJ3ByZWRpY2F0ZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBvbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQmVhbk1hbmFnZXIuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0JlYW5NYW5hZ2VyJyk7XG4iLCJpbXBvcnQgIE1hcCBmcm9tICdjb3JlLWpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCAqIGFzIGNvbnN0cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmxldCBibG9ja2VkID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xhc3NSZXBvc2l0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeShkb2xwaGluKScpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3MgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmaXhUeXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQllURTpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNIT1JUOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuSU5UOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9ORzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRkxPQVQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET1VCTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQk9PTEVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RydWUnID09PSBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5TVFJJTkc6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5FTlVNOlxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmcm9tRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuREFURTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuVG9Eb2xwaGluLmdldCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZW5kTGlzdFNwbGljZShjbGFzc1JlcG9zaXRvcnksIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgZnJvbSwgdG8sIG5ld0VsZW1lbnRzKSB7XG4gICAgICAgIGxldCBkb2xwaGluID0gY2xhc3NSZXBvc2l0b3J5LmRvbHBoaW47XG4gICAgICAgIGxldCBtb2RlbCA9IGRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzSW5mbyA9IGNsYXNzUmVwb3NpdG9yeS5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkpIHtcblxuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnQEBAIFNPVVJDRV9TWVNURU0gQEBAJywgbnVsbCwgJ2NsaWVudCcpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnc291cmNlJywgbnVsbCwgbW9kZWxJZCksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBudWxsLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnZnJvbScsIG51bGwsIGZyb20pLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgndG8nLCBudWxsLCB0byksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdjb3VudCcsIG51bGwsIG5ld0VsZW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChkb2xwaGluLmF0dHJpYnV0ZShpbmRleC50b1N0cmluZygpLCBudWxsLCBzZWxmLnRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGVsZW1lbnQpKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZG9scGhpbi5wcmVzZW50YXRpb25Nb2RlbC5hcHBseShkb2xwaGluLCBbbnVsbCwgJ0BEUDpMU0AnXS5jb25jYXQoYXR0cmlidXRlcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVMaXN0KGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGxldCBsaXN0ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoIWV4aXN0cyhsaXN0KSkge1xuICAgICAgICAgICAgY2xhc3NSZXBvc2l0b3J5LnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBbXSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIENsYXNzUmVwb3NpdG9yeS5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBibG9jayhiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhibG9ja2VkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gY3JlYXRlIGEgYmxvY2sgd2hpbGUgYW5vdGhlciBibG9jayBleGlzdHMnKTtcbiAgICAgICAgfVxuICAgICAgICBibG9ja2VkID0ge1xuICAgICAgICAgICAgYmVhbjogYmVhbixcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNCbG9ja2VkKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICByZXR1cm4gZXhpc3RzKGJsb2NrZWQpICYmIGJsb2NrZWQuYmVhbiA9PT0gYmVhbiAmJiBibG9ja2VkLnByb3BlcnR5TmFtZSA9PT0gcHJvcGVydHlOYW1lO1xuICAgIH1cblxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIGJsb2NrZWQgPSBudWxsO1xuICAgIH1cblxuICAgIG5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuXG4gICAgICAgIGxldCBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbElkKSkge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5kb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKG1vZGVsKSkge1xuICAgICAgICAgICAgICAgIGxldCBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSAmJiBleGlzdHMoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBhdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLnNldFZhbHVlKHRoaXMudG9Eb2xwaGluKHRoaXMsIHR5cGUsIG5ld1ZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIHR5cGUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuICAgICAgICBjaGVja1BhcmFtKGluZGV4LCAnaW5kZXgnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocmVtb3ZlZEVsZW1lbnRzLCAncmVtb3ZlZEVsZW1lbnRzJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2VkKGJlYW4sIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGxldCBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbElkKSAmJiBleGlzdHMoYXJyYXkpKSB7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlZEVsZW1lbnRzQ291bnQgPSBBcnJheS5pc0FycmF5KHJlbW92ZWRFbGVtZW50cykgPyByZW1vdmVkRWxlbWVudHMubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIHRoaXMuc2VuZExpc3RTcGxpY2UodGhpcywgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBpbmRleCwgaW5kZXggKyByZW1vdmVkRWxlbWVudHNDb3VudCwgYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgY291bnQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQmVhbkFkZGVkKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkJlYW5SZW1vdmVkKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuVXBkYXRlKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXNzZXMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNsYXNzSW5mbyA9IHt9O1xuICAgICAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3Nlcy5zZXQobW9kZWwuaWQsIGNsYXNzSW5mbyk7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckNsYXNzKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcbiAgICAgICAgdGhpcy5jbGFzc2VzWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgfVxuXG4gICAgbG9hZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGNsYXNzSW5mbyA9IHRoaXMuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgbGV0IGJlYW4gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkAvKSA8IDApO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGJlYW5bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Lm9sZFZhbHVlICE9PSBldmVudC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBzZWxmLmZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQub2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBzZWxmLmZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbiwgYXR0cmlidXRlLnByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDbGFzc1JlcG9zaXRvcnkuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluLnNldChtb2RlbC5pZCwgYmVhbik7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3Muc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIENsYXNzUmVwb3NpdG9yeS5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBiZWFuO1xuICAgIH1cblxuICAgIHVubG9hZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVubG9hZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgbGV0IGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQobW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpblsnZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW5bJ2RlbGV0ZSddKGJlYW4pO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3NbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSkge1xuICAgICAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBDbGFzc1JlcG9zaXRvcnkuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVhbjtcbiAgICB9XG5cbiAgICBzcGxpY2VMaXN0RW50cnkobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGxldCBzb3VyY2UgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3NvdXJjZScpO1xuICAgICAgICBsZXQgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdhdHRyaWJ1dGUnKTtcbiAgICAgICAgbGV0IGZyb20gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2Zyb20nKTtcbiAgICAgICAgbGV0IHRvID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCd0bycpO1xuICAgICAgICBsZXQgY291bnQgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2NvdW50Jyk7XG5cbiAgICAgICAgaWYgKGV4aXN0cyhzb3VyY2UpICYmIGV4aXN0cyhhdHRyaWJ1dGUpICYmIGV4aXN0cyhmcm9tKSAmJiBleGlzdHModG8pICYmIGV4aXN0cyhjb3VudCkpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc0luZm8gPSB0aGlzLmNsYXNzSW5mb3MuZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgICAgICBsZXQgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSAmJiBleGlzdHMoY2xhc3NJbmZvKSkge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgICAgIC8vdmFyIGVudHJ5ID0gZnJvbURvbHBoaW4odGhpcywgY2xhc3NJbmZvW2F0dHJpYnV0ZS52YWx1ZV0sIGVsZW1lbnQudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVMaXN0KHRoaXMsIHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0VsZW1lbnRzID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQudmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdFbGVtZW50cy5wdXNoKHRoaXMuZnJvbURvbHBoaW4odGhpcywgY2xhc3NJbmZvW2F0dHJpYnV0ZS52YWx1ZV0sIGVsZW1lbnQudmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSwgZnJvbS52YWx1ZSwgdG8udmFsdWUgLSBmcm9tLnZhbHVlLCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xhc3NSZXBvc2l0b3J5LkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWQuIFNvdXJjZSBiZWFuIHVua25vd24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBQYXJhbVRvRG9scGhpbihwYXJhbSkge1xuICAgICAgICBpZiAoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZiBwYXJhbTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQocGFyYW0pO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGNhbiBiZSB1c2VkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgYW5kIHByaW1pdGl2ZSB0eXBlcyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG5cbiAgICBtYXBEb2xwaGluVG9CZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNvbnN0cy5ET0xQSElOX0JFQU4sIHZhbHVlKTtcbiAgICB9XG59XG5cbkNsYXNzUmVwb3NpdG9yeS5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignQ2xhc3NSZXBvc2l0b3J5Jyk7XG4iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9ldmVudEJ1cyc7XG5pbXBvcnQgeyBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi9sb2dnaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50QXR0cmlidXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFF1YWxpZmllcihxdWFsaWZpZXIpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHNldFByZXNlbnRhdGlvbk1vZGVsKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuIG5vdCBzZXQgYSBwcmVzZW50YXRpb24gbW9kZWwgZm9yIGFuIGF0dHJpYnV0ZSB0aGF0IGlzIGFscmVhZHkgYm91bmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwgPSBwcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9XG5cbiAgICBnZXRQcmVzZW50YXRpb25Nb2RlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIHNldFZhbHVlRnJvbVNlcnZlcihuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHZlcmlmaWVkVmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2ZXJpZmllZFZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWx1ZSwgJ25ld1ZhbHVlJzogdmVyaWZpZWRWYWx1ZSwgJ3NlbmRUb1NlcnZlcic6IGZhbHNlIH0pO1xuICAgIH1cblxuICAgIHNldFZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgICAgIGxldCB2ZXJpZmllZFZhbHVlID0gQ2xpZW50QXR0cmlidXRlLmNoZWNrVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gdmVyaWZpZWRWYWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZlcmlmaWVkVmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbHVlLCAnbmV3VmFsdWUnOiB2ZXJpZmllZFZhbHVlLCAnc2VuZFRvU2VydmVyJzogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBzZXRRdWFsaWZpZXIobmV3UXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICh0aGlzLnF1YWxpZmllciA9PT0gbmV3UXVhbGlmaWVyKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgb2xkUXVhbGlmaWVyID0gdGhpcy5xdWFsaWZpZXI7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyID0gbmV3UXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkUXVhbGlmaWVyLCAnbmV3VmFsdWUnOiBuZXdRdWFsaWZpZXIgfSk7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlLCAnc2VuZFRvU2VydmVyJzogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgZ2V0UXVhbGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFsaWZpZXI7XG4gICAgfVxuXG4gICAgb25WYWx1ZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIGV2ZW50SGFuZGxlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlLCAnc2VuZFRvU2VydmVyJzogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgb25RdWFsaWZpZXJDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTsgLy8gc2VxdWVuY2UgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2hlY2tWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBTdHJpbmcgfHwgcmVzdWx0IGluc3RhbmNlb2YgQm9vbGVhbiB8fCByZXN1bHQgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQ2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBDbGllbnRBdHRyaWJ1dGUuTE9HR0VSLndhcm4oXCJBbiBBdHRyaWJ1dGUgbWF5IG5vdCBpdHNlbGYgY29udGFpbiBhbiBhdHRyaWJ1dGUgYXMgYSB2YWx1ZS4gQXNzdW1pbmcgeW91IGZvcmdvdCB0byBjYWxsIHZhbHVlLlwiKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2hlY2tWYWx1ZSh2YWx1ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9rID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLlNVUFBPUlRFRF9WQUxVRV9UWVBFUy5pbmRleE9mKHR5cGVvZiByZXN1bHQpID4gLTEgfHwgcmVzdWx0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZSB2YWx1ZXMgb2YgdGhpcyB0eXBlIGFyZSBub3QgYWxsb3dlZDogXCIgKyB0eXBlb2YgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG59XG5cbkNsaWVudEF0dHJpYnV0ZS5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignQ2xpZW50QXR0cmlidXRlJyk7XG5DbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbkNsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50ID0gMDtcbiIsImltcG9ydCBCbGluZENvbW1hbmRCYXRjaGVyIGZyb20gJy4vY29tbWFuZEJhdGNoZXInO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMnO1xuaW1wb3J0IENsaWVudFByZXNlbnRhdGlvbk1vZGVsIGZyb20gJy4vY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnXG5pbXBvcnQgeyBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi9sb2dnaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29ubmVjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCBzbGFja01TID0gMCwgbWF4QmF0Y2hTaXplID0gNTApIHtcblxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnNsYWNrTVMgPSBzbGFja01TO1xuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXcgQmxpbmRDb21tYW5kQmF0Y2hlcih0cnVlLCBtYXhCYXRjaFNpemUpO1xuICAgIH1cblxuICAgIHNldENvbW1hbmRCYXRjaGVyKG5ld0JhdGNoZXIpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ld0JhdGNoZXI7XG4gICAgfVxuXG4gICAgc2V0UHVzaEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZW5hYmxlZDtcbiAgICB9XG5cbiAgICBzZXRQdXNoTGlzdGVuZXIobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5wdXNoTGlzdGVuZXIgPSBuZXdMaXN0ZW5lcjtcbiAgICB9XG5cbiAgICBzZXRSZWxlYXNlQ29tbWFuZChuZXdDb21tYW5kKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNvbW1hbmQgPSBuZXdDb21tYW5kO1xuICAgIH1cblxuICAgIHNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgaGFuZGxlcjogb25GaW5pc2hlZCB9KTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7IC8vIHRoZXJlIGlzIG5vdCBwb2ludCBpbiByZWxlYXNpbmcgaWYgd2UgZG8gbm90IHNlbmQgYXRtXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgfVxuXG4gICAgZG9TZW5kTmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnB1c2hFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnF1ZXVlUHVzaENvbW1hbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSB0cnVlO1xuICAgICAgICBsZXQgY21kc0FuZEhhbmRsZXJzID0gdGhpcy5jb21tYW5kQmF0Y2hlci5iYXRjaCh0aGlzLmNvbW1hbmRRdWV1ZSk7XG5cbiAgICAgICAgaWYoY21kc0FuZEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjYWxsYmFjayA9IGNtZHNBbmRIYW5kbGVyc1tjbWRzQW5kSGFuZGxlcnMubGVuZ3RoIC0gMV0uaGFuZGxlcjtcbiAgICAgICAgICAgIGxldCBjb21tYW5kcyA9IGNtZHNBbmRIYW5kbGVycy5tYXAoY2FoID0+IHsgcmV0dXJuIGNhaC5jb21tYW5kOyB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXR0ZXIudHJhbnNtaXQoY29tbWFuZHMsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG91Y2hlZCA9IHRoaXMuaGFuZGxlKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG91Y2hlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdWNoZWRQTXMucHVzaCh0b3VjaGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sub25GaW5pc2hlZCh0b3VjaGVkUE1zKTsgLy8gdG9kbzogbWFrZSB0aGVtIHVuaXF1ZT9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRvU2VuZE5leHQoKSwgdGhpcy5zbGFja01TKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRvU2VuZE5leHQoKSwgdGhpcy5zbGFja01TKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZShjb21tYW5kKSB7XG4gICAgICAgIGlmIChjb21tYW5kLmlkID09PSBcIkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09PSBcIlZhbHVlQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFwiQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBDbGllbnRDb25uZWN0b3IuTE9HR0VSLmVycm9yKFwiQ2Fubm90IGhhbmRsZSwgdW5rbm93biBjb21tYW5kIFwiICsgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIGhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgIGtub3duIHRvIHRoZSBjbGllbnQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmF0dHJpYnV0ZShhdHRyLnByb3BlcnR5TmFtZSwgYXR0ci5xdWFsaWZpZXIsIGF0dHIudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGF0dHIuaWQgJiYgYXR0ci5pZC5tYXRjaChcIi4qUyRcIikpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGUuaWQgPSBhdHRyLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGNsaWVudEF0dHJpYnV0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgY2xpZW50UG0gPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkLCBzZXJ2ZXJDb21tYW5kLnBtVHlwZSk7XG4gICAgICAgIGNsaWVudFBtLmFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgICAgIGlmIChzZXJ2ZXJDb21tYW5kLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICBjbGllbnRQbS5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQoY2xpZW50UG0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKGNsaWVudFBtKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudFBtO1xuICAgIH1cblxuICAgIGhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICBsZXQgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIENsaWVudENvbm5lY3Rvci5MT0dHRVIuZXJyb3IoXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCB1cGRhdGUgdG8gbmV3IHZhbHVlIFwiICsgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCkgPT09IHNlcnZlckNvbW1hbmQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZUZyb21TZXJ2ZXIoc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICBsZXQgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgY2xpZW50QXR0cmlidXRlW3NlcnZlckNvbW1hbmQubWV0YWRhdGFOYW1lXSA9IHNlcnZlckNvbW1hbmQudmFsdWU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxpc3RlbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnB1c2hFbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy53YWl0aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHB1c2hMaXN0ZW5lciBpcyBzZXQ/XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50bHlTZW5kaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVucXVldWVQdXNoQ29tbWFuZCgpIHtcbiAgICAgICAgbGV0IG1lID0gdGhpcztcbiAgICAgICAgdGhpcy53YWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7XG4gICAgICAgICAgICBjb21tYW5kOiB0aGlzLnB1c2hMaXN0ZW5lcixcbiAgICAgICAgICAgIGhhbmRsZXI6IHtcbiAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbiAoKSB7IG1lLndhaXRpbmcgPSBmYWxzZTsgfSxcbiAgICAgICAgICAgICAgICBvbkZpbmlzaGVkRGF0YTogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZWxlYXNlKCkge1xuICAgICAgICBpZiAoIXRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIC8vIHRvZG86IGhvdyB0byBpc3N1ZSBhIHdhcm5pbmcgaWYgbm8gcmVsZWFzZUNvbW1hbmQgaXMgc2V0P1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnNpZ25hbCh0aGlzLnJlbGVhc2VDb21tYW5kKTtcbiAgICB9XG59XG5cbkNsaWVudENvbm5lY3Rvci5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignQ2xpZW50Q29ubmVjdG9yJyk7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7bWFrZURvbHBoaW59IGZyb20gJy4vb3BlbkRvbHBoaW4uanMnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuaW1wb3J0IENvbm5lY3RvciBmcm9tICcuL2Nvbm5lY3Rvcic7XG5pbXBvcnQgQmVhbk1hbmFnZXIgZnJvbSAnLi9iZWFubWFuYWdlcic7XG5pbXBvcnQgQ2xhc3NSZXBvc2l0b3J5IGZyb20gJy4vY2xhc3NyZXBvJztcbmltcG9ydCBDb250cm9sbGVyTWFuYWdlciBmcm9tICcuL2NvbnRyb2xsZXJtYW5hZ2VyJztcbmltcG9ydCBDbGllbnRDb250ZXh0IGZyb20gJy4vY2xpZW50Y29udGV4dCc7XG5pbXBvcnQgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIgZnJvbSAnLi9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlcic7XG5cbmNsYXNzIENsaWVudENvbnRleHRGYWN0b3J5IHtcblxuICAgIGNyZWF0ZSh1cmwsIGNvbmZpZyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdjb25uZWN0KHVybCwgY29uZmlnKScpO1xuICAgICAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgICAgICBDbGllbnRDb250ZXh0RmFjdG9yeS5MT0dHRVIuaW5mbygnRG9scGhpbiBQbGF0Zm9ybSBWZXJzaW9uOicgLCBET0xQSElOX1BMQVRGT1JNX1ZFUlNJT04pO1xuICAgICAgICBDbGllbnRDb250ZXh0RmFjdG9yeS5MT0dHRVIuZGVidWcoJ0NyZWF0aW5nIGNsaWVudCBjb250ZXh0JywgdXJsLCBjb25maWcpO1xuXG4gICAgICAgIGxldCBidWlsZGVyID0gbWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChmYWxzZSkuc2xhY2tNUyg0KS5zdXBwb3J0Q09SUyh0cnVlKS5tYXhCYXRjaFNpemUoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpO1xuICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZykpIHtcbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmVycm9ySGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmVycm9ySGFuZGxlcihjb25maWcuZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmhlYWRlcnNJbmZvKSAmJiBPYmplY3Qua2V5cyhjb25maWcuaGVhZGVyc0luZm8pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmhlYWRlcnNJbmZvKGNvbmZpZy5oZWFkZXJzSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZG9scGhpbiA9IGJ1aWxkZXIuYnVpbGQoKTtcblxuICAgICAgICBsZXQgdHJhbnNtaXR0ZXIgPSBuZXcgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIodXJsLCBjb25maWcpO1xuICAgICAgICB0cmFuc21pdHRlci5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNsaWVudENvbnRleHQuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2xwaGluLmNsaWVudENvbm5lY3Rvci50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuXG4gICAgICAgIGxldCBjbGFzc1JlcG9zaXRvcnkgPSBuZXcgQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pO1xuICAgICAgICBsZXQgYmVhbk1hbmFnZXIgPSBuZXcgQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KTtcbiAgICAgICAgbGV0IGNvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyk7XG4gICAgICAgIGxldCBjb250cm9sbGVyTWFuYWdlciA9IG5ldyBDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcik7XG5cbiAgICAgICAgbGV0IGNsaWVudENvbnRleHQgPSBuZXcgQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcik7XG5cbiAgICAgICAgQ2xpZW50Q29udGV4dEZhY3RvcnkuTE9HR0VSLmRlYnVnKCdjbGllbnRDb250ZXh0IGNyZWF0ZWQgd2l0aCcsIGNsaWVudENvbnRleHQpO1xuXG4gICAgICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xuICAgIH1cbn1cblxuQ2xpZW50Q29udGV4dEZhY3RvcnkuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NsaWVudENvbnRleHRGYWN0b3J5Jyk7XG5cbmxldCBjcmVhdGVDbGllbnRDb250ZXh0ID0gbmV3IENsaWVudENvbnRleHRGYWN0b3J5KCkuY3JlYXRlO1xuXG5leHBvcnQgeyBjcmVhdGVDbGllbnRDb250ZXh0LCBDbGllbnRDb250ZXh0RmFjdG9yeSB9OyIsImltcG9ydCBDbGllbnRBdHRyaWJ1dGUgZnJvbSAnLi9jbGllbnRBdHRyaWJ1dGUnXG5pbXBvcnQgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgZnJvbSAnLi9jbGllbnRQcmVzZW50YXRpb25Nb2RlbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RG9scGhpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRDbGllbnRDb25uZWN0b3IoY2xpZW50Q29ubmVjdG9yKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yID0gY2xpZW50Q29ubmVjdG9yO1xuICAgIH1cblxuICAgIGdldENsaWVudENvbm5lY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50Q29ubmVjdG9yO1xuICAgIH1cblxuICAgIHNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSwgLi4uYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoaWQsIHR5cGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQobW9kZWwsIHRydWUpO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50TW9kZWxTdG9yZShjbGllbnRNb2RlbFN0b3JlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50TW9kZWxTdG9yZSA9IGNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50TW9kZWxTdG9yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5saXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKTtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkubGlzdFByZXNlbnRhdGlvbk1vZGVscygpO1xuICAgIH1cblxuICAgIGZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIH1cblxuICAgIGdldEF0KGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgIH1cblxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgIH1cblxuICAgIGRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUpIHtcbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goc291cmNlQXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godGFyZ2V0QXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7IC8vIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGFydFB1c2hMaXN0ZW5pbmcocHVzaENvbW1hbmQsIHJlbGVhc2VDb21tYW5kKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hMaXN0ZW5lcihwdXNoQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFJlbGVhc2VDb21tYW5kKHJlbGVhc2VDb21tYW5kKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQodHJ1ZSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5saXN0ZW4oKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgc3RvcFB1c2hMaXN0ZW5pbmcoKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKGZhbHNlKTtcbiAgICB9XG59IiwiaW1wb3J0IEF0dHJpYnV0ZSBmcm9tICcuL2F0dHJpYnV0ZSdcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL2V2ZW50QnVzJ1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtBRERFRF9UWVBFLCBSRU1PVkVEX1RZUEV9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE1vZGVsU3RvcmUge1xuXG4gICAgY29uc3RydWN0b3IoY2xpZW50RG9scGhpbikge1xuXG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgIH1cblxuICAgIGdldENsaWVudERvbHBoaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudERvbHBoaW47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2hlbmV2ZXIgYW4gYXR0cmlidXRlIGNoYW5nZXMgaXRzIHZhbHVlLCB0aGUgc2VydmVyIG5lZWRzIHRvIGJlIG5vdGlmaWVkXG4gICAgICAgIC8vIGFuZCBhbGwgb3RoZXIgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBhcmUgZ2l2ZW4gdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYoZXZ0Lm5ld1ZhbHVlICE9PSBldnQub2xkVmFsdWUgJiYgZXZ0LnNlbmRUb1NlcnZlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSBDb21tYW5kRmFjdG9yeS5jcmVhdGVWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZS5pZCwgZXZ0Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChjb21tYW5kLCBudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgIGxldCBhdHRycyA9IHRoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0ciAhPT0gYXR0cmlidXRlICYmIGF0dHIuZ2V0UXVhbGlmaWVyKCkgPT09IGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0VmFsdWUoYXR0cmlidXRlLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICBhdHRyaWJ1dGUub25RdWFsaWZpZXJDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZS5pZCwgQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSwgZXZ0Lm5ld1ZhbHVlKSwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZChtb2RlbCwgc2VuZFRvU2VydmVyID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIENsaWVudE1vZGVsU3RvcmUuTE9HR0VSLmVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhIFBNIHdpdGggaWQgXCIgKyBtb2RlbC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFkZGVkID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuc2V0KG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcblxuICAgICAgICAgICAgaWYoc2VuZFRvU2VydmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3RvciA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKTtcbiAgICAgICAgICAgICAgICBjb25uZWN0b3Iuc2VuZChDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQobW9kZWwpLCBudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IEFEREVEX1RZUEUsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGRlZDtcbiAgICB9XG5cbiAgICByZW1vdmUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZW1vdmVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmRlbGV0ZShtb2RlbC5pZCk7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBSRU1PVkVEX1RZUEUsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfVxuXG4gICAgZmluZEF0dHJpYnV0ZXNCeUZpbHRlcihmaWx0ZXIpIHtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSBbXTtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuZm9yRWFjaCgobW9kZWwpID0+IHtcbiAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcihhdHRyKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goYXR0cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0Y2hlcztcbiAgICB9XG5cbiAgICBhZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcmVzZW50YXRpb25Nb2RlbHMgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzID0gW107XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuc2V0KHR5cGUsIHByZXNlbnRhdGlvbk1vZGVscyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpID4gLTEpKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMucHVzaChtb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsIHx8ICEobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcmVzZW50YXRpb25Nb2RlbHMgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnNwbGljZShwcmVzZW50YXRpb25Nb2RlbHMuaW5kZXhPZihtb2RlbCksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZGVsZXRlKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGl0ZXIgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5rZXlzKCk7XG4gICAgICAgIGxldCBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghbmV4dC5kb25lKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGl0ZXIgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy52YWx1ZXMoKTtcbiAgICAgICAgbGV0IG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBmaW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUodHlwZSkge1xuICAgICAgICBpZiAoIXR5cGUgfHwgIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5oYXModHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICB9XG5cbiAgICBkZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCwgbm90aWZ5KSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUobW9kZWwpO1xuICAgICAgICAgICAgaWYgKCFub3RpZnkgfHwgbW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChDb21tYW5kRmFjdG9yeS5jcmVhdGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKG1vZGVsLmlkKSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMoaWQpO1xuICAgIH1cblxuICAgIGFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8IHRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuc2V0KGF0dHJpYnV0ZS5pZCwgYXR0cmlidXRlKTtcbiAgICB9XG5cbiAgICByZW1vdmVBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhdGhpcy5hdHRyaWJ1dGVzUGVySWQuaGFzKGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5kZWxldGUoYXR0cmlidXRlLmlkKTtcbiAgICB9XG5cbiAgICBmaW5kQXR0cmlidXRlQnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVySWQuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIWF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5zZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShhdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIWF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmRlbGV0ZShhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihxdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKCFxdWFsaWZpZXIgfHwgIXRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5oYXMocXVhbGlmaWVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KHF1YWxpZmllcikuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfVxuXG4gICAgb25Nb2RlbFN0b3JlQ2hhbmdlKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uTW9kZWxTdG9yZUNoYW5nZUZvclR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQocG1TdG9yZUV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChwbVN0b3JlRXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlID09IHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcihwbVN0b3JlRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbkNsaWVudE1vZGVsU3RvcmUuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NsaWVudE1vZGVsU3RvcmUnKTtcblxuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vZXZlbnRCdXMnXG5cbnZhciBwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQgPSAwOyAvLyB0b2RvIGRrOiBjb25zaWRlciBtYWtpbmcgdGhpcyBzdGF0aWMgaW4gY2xhc3NcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJyAmJiBpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gKHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCsrKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICB9XG4gICAgLy8gdG9kbyBkazogYWxpZ24gd2l0aCBKYXZhIHZlcnNpb246IG1vdmUgdG8gQ2xpZW50RG9scGhpbiBhbmQgYXV0by1hZGQgdG8gbW9kZWwgc3RvcmVcbiAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIGZvciBhbnl0aGluZyBidXQgSURzLiBQZXIgZGVmYXVsdCwgY29waWVzIGFyZSBjbGllbnQgc2lkZSBvbmx5LCBubyBhdXRvbWF0aWMgdXBkYXRlIGFwcGxpZXMuICovXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChudWxsLCB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHJlc3VsdC5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZUNvcHkgPSBhdHRyaWJ1dGUuY29weSgpO1xuICAgICAgICAgICAgcmVzdWx0LmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGVDb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vYWRkIGFycmF5IG9mIGF0dHJpYnV0ZXNcbiAgICBhZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzIHx8IGF0dHJpYnV0ZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICh0aGlzLmF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHByb3BlcnR5IG5hbWU6IFwiICsgYXR0cmlidXRlLnByb3BlcnR5TmFtZVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSAmJiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHF1YWxpZmllcjogXCIgKyBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKClcbiAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZS5zZXRQcmVzZW50YXRpb25Nb2RlbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQnVzLnRyaWdnZXIoeyBzb3VyY2U6IHRoaXMgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkludmFsaWRhdGVkKGhhbmRsZUludmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzLm9uRXZlbnQoaGFuZGxlSW52YWxpZGF0ZSk7XG4gICAgfVxuICAgIC8qKiByZXR1cm5zIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgc3RhdGUgKi9cbiAgICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNsaWNlKDApO1xuICAgIH1cbiAgICBnZXRBdChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XG4gICAgfVxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5hdHRyaWJ1dGVzW2ldLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5nZXRRdWFsaWZpZXIoKSA9PSBxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlJZChpZCkge1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3luY1dpdGgoc291cmNlUHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKHRhcmdldEF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsLmdldEF0KHRhcmdldEF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgQ29tbWFuZEZhY3RvcnkgZnJvbSAnLi9jb21tYW5kcy9jb21tYW5kRmFjdG9yeSc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250ZXh0e1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3RvciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW5NYW5hZ2VyLCAnYmVhbk1hbmFnZXInKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyTWFuYWdlciwgJ2NvbnRyb2xsZXJNYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29ubmVjdG9yLCAnY29ubmVjdG9yJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5iZWFuTWFuYWdlciA9IGJlYW5NYW5hZ2VyO1xuICAgICAgICB0aGlzLl9jb250cm9sbGVyTWFuYWdlciA9IGNvbnRyb2xsZXJNYW5hZ2VyO1xuICAgICAgICB0aGlzLl9jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvblByb21pc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpe1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uUHJvbWlzZTtcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoKXtcbiAgICAgICAgaWYoZXhpc3RzKHRoaXMuY29ubmVjdGlvblByb21pc2UpKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uUHJvbWlzZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQuY3JlYXRlQ29udHJvbGxlcihuYW1lKScpO1xuICAgICAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdCgpe1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9scGhpbi5zdG9wUHVzaExpc3RlbmluZygpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3koKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCgpKTtcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuYmVhbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXJNYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbkVtaXR0ZXIoQ2xpZW50Q29udGV4dC5wcm90b3R5cGUpOyIsImltcG9ydCB7VkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lELCBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEfSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRDb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbGluZENvbW1hbmRCYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihmb2xkaW5nID0gdHJ1ZSwgbWF4QmF0Y2hTaXplID0gNTApIHtcbiAgICAgICAgdGhpcy5mb2xkaW5nID0gZm9sZGluZztcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemUgPSBtYXhCYXRjaFNpemU7XG4gICAgfVxuICAgIGJhdGNoKHF1ZXVlKSB7XG4gICAgICAgIGxldCBiYXRjaCA9IFtdO1xuICAgICAgICBsZXQgYmF0Y2hMZW5ndGggPSAwO1xuICAgICAgICB3aGlsZShxdWV1ZVtiYXRjaExlbmd0aF0gJiYgYmF0Y2hMZW5ndGggPD0gdGhpcy5tYXhCYXRjaFNpemUpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBxdWV1ZVtiYXRjaExlbmd0aF07XG4gICAgICAgICAgICBiYXRjaExlbmd0aCsrO1xuICAgICAgICAgICAgaWYodGhpcy5mb2xkaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudC5jb21tYW5kLmlkID09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCAmJlxuICAgICAgICAgICAgICAgICAgICBiYXRjaC5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoW2JhdGNoLmxlbmd0aCAtIDFdLmNvbW1hbmQuaWQgPT0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEICYmXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY29tbWFuZC5hdHRyaWJ1dGVJZCA9PSBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kLmF0dHJpYnV0ZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vbWVyZ2UgVmFsdWVDaGFuZ2UgZm9yIHNhbWUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2hbYmF0Y2gubGVuZ3RoIC0gMV0uY29tbWFuZC5uZXdWYWx1ZSA9IGVsZW1lbnQuY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5jb21tYW5kLmlkID09IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9XZSBkbyBub3QgbmVlZCBpdC4uLlxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoZWxlbWVudC5oYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWUuc3BsaWNlKDAsIGJhdGNoTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGJhdGNoO1xuICAgIH1cbn0iLCJpbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7SlNfU1RSSU5HX1RZUEV9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICAgIENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCxcbiAgICBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQsXG4gICAgQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCxcbiAgICBDQUxMX0FDVElPTl9DT01NQU5EX0lELFxuICAgIENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCxcbiAgICBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lELFxuICAgIENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQsXG4gICAgREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lELFxuICAgIERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lELFxuICAgIERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lELFxuICAgIElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCxcbiAgICBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lELFxuICAgIFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEXG59IGZyb20gJy4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge0lELCBQTV9JRCwgUE1fVFlQRSwgUE1fQVRUUklCVVRFUywgTkFNRSwgQVRUUklCVVRFX0lELCBWQUxVRSwgQ09OVFJPTExFUl9JRCwgUEFSQU1TfSBmcm9tICcuL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IFZhbHVlQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ZhbHVlQ2hhbmdlZENvbW1hbmQnO1xuaW1wb3J0IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQnO1xuaW1wb3J0IENhbGxBY3Rpb25Db21tYW5kIGZyb20gJy4vaW1wbC9jYWxsQWN0aW9uQ29tbWFuZCc7XG5pbXBvcnQgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kIGZyb20gJy4vaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRleHRDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kJztcbmltcG9ydCBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCc7XG5pbXBvcnQgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9kZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnO1xuaW1wb3J0IERlc3Ryb3lDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvZGVzdHJveUNvbnRleHRDb21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQnO1xuaW1wb3J0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9zdGFydExvbmdQb2xsQ29tbWFuZCc7XG5pbXBvcnQgQ29kZWNFcnJvciBmcm9tICcuL2NvZGVjRXJyb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVjIHtcblxuICAgIHN0YXRpYyBfZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQubWV0YWRhdGFOYW1lLCBcImNvbW1hbmQubWV0YWRhdGFOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLm1ldGFkYXRhTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSwgXCJqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVJZCA9IGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF07XG4gICAgICAgIGNvbW1hbmQubWV0YWRhdGFOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQudmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ2FsbEFjdGlvbkNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNhbGxBY3Rpb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLmNvbnRyb2xsZXJpZCwgXCJjb21tYW5kLmNvbnRyb2xsZXJpZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLmFjdGlvbk5hbWUsIFwiY29tbWFuZC5hY3Rpb25OYW1lXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucGFyYW1zLCBcImNvbW1hbmQucGFyYW1zXCIpO1xuXG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IENBTExfQUNUSU9OX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdID0gY29tbWFuZC5jb250cm9sbGVyaWQ7XG4gICAgICAgIGpzb25Db21tYW5kW05BTUVdID0gY29tbWFuZC5hY3Rpb25OYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtQQVJBTVNdID0gY29tbWFuZC5wYXJhbXMubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0W05BTUVdID0gcGFyYW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChleGlzdHMocGFyYW0udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W1ZBTFVFXSA9IHBhcmFtLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNhbGxBY3Rpb25Db21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlQ2FsbEFjdGlvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF0sIFwianNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF1cIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbTkFNRV0sIFwianNvbkNvbW1hbmRbTkFNRV1cIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUEFSQU1TXSwgXCJqc29uQ29tbWFuZFtQQVJBTVNdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENhbGxBY3Rpb25Db21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuY29udHJvbGxlcmlkID0ganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF07XG4gICAgICAgIGNvbW1hbmQuYWN0aW9uTmFtZSA9IGpzb25Db21tYW5kW05BTUVdO1xuICAgICAgICAvL1RPRE86IEbDvHIgZGllIFBhcmFtcyBzb2xsdGVuIHdpciBlaW5lIEtsYXNzZSBiZXJlaXRzdGVsbGVuXG4gICAgICAgIGNvbW1hbmQucGFyYW1zID0ganNvbkNvbW1hbmRbUEFSQU1TXS5tYXAoKHBhcmFtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJzogcGFyYW1bTkFNRV0sXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJzogZXhpc3RzKHBhcmFtW1ZBTFVFXSkgPyBwYXJhbVtWQUxVRV0gOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQubWV0YWRhdGFOYW1lLCBcImNvbW1hbmQubWV0YWRhdGFOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0gPSBjb21tYW5kLmF0dHJpYnV0ZUlkO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQubWV0YWRhdGFOYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtWQUxVRV0gPSBjb21tYW5kLnZhbHVlO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSwgXCJqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZUlkID0ganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXTtcbiAgICAgICAgY29tbWFuZC5tZXRhZGF0YU5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgY29tbWFuZC52YWx1ZSA9IGpzb25Db21tYW5kW1ZBTFVFXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNyZWF0ZUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRleHRDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVyTmFtZSwgXCJjb21tYW5kLmNvbnRyb2xsZXJOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQuY29udHJvbGxlck5hbWU7XG4gICAgICAgIGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdID0gY29tbWFuZC5wYXJlbnRDb250cm9sbGVySWQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuY29udHJvbGxlck5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgY29tbWFuZC5wYXJlbnRDb250cm9sbGVySWQgPSBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbUlkLCBcImNvbW1hbmQucG1JZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBtVHlwZSwgXCJjb21tYW5kLnBtVHlwZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9JRF0gPSBjb21tYW5kLnBtSWQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX1RZUEVdID0gY29tbWFuZC5wbVR5cGU7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0FUVFJJQlVURVNdID0gY29tbWFuZC5hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgICAgICByZXN1bHRbTkFNRV0gPSBhdHRyaWJ1dGUucHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgcmVzdWx0W0FUVFJJQlVURV9JRF0gPSBhdHRyaWJ1dGUuaWQ7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbVkFMVUVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9JRF0sIFwianNvbkNvbW1hbmRbUE1fSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX1RZUEVdLCBcImpzb25Db21tYW5kW1BNX1RZUEVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLnBtSWQgPSBqc29uQ29tbWFuZFtQTV9JRF07XG4gICAgICAgIGNvbW1hbmQucG1UeXBlID0ganNvbkNvbW1hbmRbUE1fVFlQRV07XG5cbiAgICAgICAgLy9UT0RPOiBGw7xyIGRpZSBBdHRyaWJ1dGUgc29sbHRlbiB3aXIgZWluZSBLbGFzc2UgYmVyZWl0c3RlbGxlblxuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZXMgPSBqc29uQ29tbWFuZFtQTV9BVFRSSUJVVEVTXS5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAncHJvcGVydHlOYW1lJzogYXR0cmlidXRlW05BTUVdLFxuICAgICAgICAgICAgICAgICdpZCc6IGF0dHJpYnV0ZVtBVFRSSUJVVEVfSURdLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGVbVkFMVUVdKSA/IGF0dHJpYnV0ZVtWQUxVRV0gOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX0lEXSwgXCJqc29uQ29tbWFuZFtQTV9JRF1cIik7XG5cblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5wbUlkID0ganNvbkNvbW1hbmRbUE1fSURdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IERlc3Ryb3lDb250ZXh0Q29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVySWQsIFwiY29tbWFuZC5jb250cm9sbGVySWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQuY29udHJvbGxlcklkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJJZCA9IGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbUlkLCBcImNvbW1hbmQucG1JZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUE1fSURdLCBcImpzb25Db21tYW5kW1BNX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQucG1JZCA9IGpzb25Db21tYW5kW1BNX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IFN0YXJ0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0gPSBjb21tYW5kLmF0dHJpYnV0ZUlkO1xuICAgICAgICBpZiAoZXhpc3RzKGNvbW1hbmQubmV3VmFsdWUpKSB7XG4gICAgICAgICAgICBqc29uQ29tbWFuZFtWQUxVRV0gPSBjb21tYW5kLm5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuYXR0cmlidXRlSWQgPSBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdO1xuICAgICAgICBpZiAoZXhpc3RzKGpzb25Db21tYW5kW1ZBTFVFXSkpIHtcbiAgICAgICAgICAgIGNvbW1hbmQubmV3VmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21tYW5kLm5ld1ZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlKGNvbW1hbmRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmRzLCBcImNvbW1hbmRzXCIpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0FMTF9BQ1RJT05fQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDYWxsQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05URVhUX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlU3RhcnRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZWNFcnJvcignQ29tbWFuZCBvZiB0eXBlICcgKyBjb21tYW5kLmlkICsgJyBjYW4gbm90IGJlIGhhbmRsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWNvZGUodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVcIik7XG4gICAgICAgIGNoZWNrUGFyYW0odHJhbnNtaXR0ZWQsIFwidHJhbnNtaXR0ZWRcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PT0gSlNfU1RSSU5HX1RZUEUpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKS5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENBTExfQUNUSU9OX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUNhbGxBY3Rpb25Db21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb2RlY0Vycm9yKCdDb21tYW5kIG9mIHR5cGUgJyArIGNvbW1hbmQuaWQgKyAnIGNhbiBub3QgYmUgaGFuZGxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IENvZGVjRXJyb3IoJ0NhbiBub3QgZGVjb2RlIGRhdGEgdGhhdCBpcyBub3Qgb2YgdHlwZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlY0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufSIsImV4cG9ydCBjb25zdCBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEID0gJ0F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZCc7XG5leHBvcnQgY29uc3QgQ0FMTF9BQ1RJT05fQ09NTUFORF9JRCA9ICdDYWxsQWN0aW9uJztcbmV4cG9ydCBjb25zdCBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQgPSAnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGEnO1xuZXhwb3J0IGNvbnN0IENSRUFURV9DT05URVhUX0NPTU1BTkRfSUQgPSAnQ3JlYXRlQ29udGV4dCc7XG5leHBvcnQgY29uc3QgQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRCA9ICdDcmVhdGVDb250cm9sbGVyJztcbmV4cG9ydCBjb25zdCBDUkVBVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQgPSAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnO1xuZXhwb3J0IGNvbnN0IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCA9ICdEZWxldGVQcmVzZW50YXRpb25Nb2RlbCc7XG5leHBvcnQgY29uc3QgREVTVFJPWV9DT05URVhUX0NPTU1BTkRfSUQgPSAnRGVzdHJveUNvbnRleHQnO1xuZXhwb3J0IGNvbnN0IERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lEID0gJ0Rlc3Ryb3lDb250cm9sbGVyJztcbmV4cG9ydCBjb25zdCBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQgPSAnSW50ZXJydXB0TG9uZ1BvbGwnO1xuZXhwb3J0IGNvbnN0IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQgPSAnUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkJztcbmV4cG9ydCBjb25zdCBTVEFSVF9MT05HX1BPTExfQ09NTUFORF9JRCA9ICdTdGFydExvbmdQb2xsJztcbmV4cG9ydCBjb25zdCBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQgPSAnVmFsdWVDaGFuZ2VkJztcblxuZXhwb3J0IGNvbnN0IElEID0gXCJpZFwiO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9JRCA9IFwiYV9pZFwiO1xuZXhwb3J0IGNvbnN0IFBNX0lEID0gXCJwX2lkXCI7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRCA9IFwiY19pZFwiO1xuZXhwb3J0IGNvbnN0IFBNX1RZUEUgPSBcInRcIjtcbmV4cG9ydCBjb25zdCBOQU1FID0gXCJuXCI7XG5leHBvcnQgY29uc3QgVkFMVUUgPSBcInZcIjtcbmV4cG9ydCBjb25zdCBQQVJBTVMgPSBcInBcIjtcbmV4cG9ydCBjb25zdCBQTV9BVFRSSUJVVEVTID0gXCJhXCI7IiwiaW1wb3J0IENyZWF0ZUNvbnRleHRDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kJztcbmltcG9ydCBDYWxsQWN0aW9uQ29tbWFuZCBmcm9tICcuL2ltcGwvY2FsbEFjdGlvbkNvbW1hbmQnO1xuaW1wb3J0IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCBmcm9tICcuL2ltcGwvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udGV4dENvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgU3RhcnRMb25nUG9sbENvbW1hbmQgZnJvbSAnLi9pbXBsL3N0YXJ0TG9uZ1BvbGxDb21tYW5kJztcbmltcG9ydCBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQgZnJvbSAnLi9pbXBsL2ludGVycnVwdExvbmdQb2xsQ29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnO1xuaW1wb3J0IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCBmcm9tICcuL2ltcGwvZGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kJztcbmltcG9ydCBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kIGZyb20gJy4vaW1wbC9wcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kJztcbmltcG9ydCBWYWx1ZUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kJztcbmltcG9ydCBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQgZnJvbSAnLi9pbXBsL2NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCc7XG5pbXBvcnQgQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCBmcm9tICcuL2ltcGwvYXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRGYWN0b3J5IHtcblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVDb250ZXh0Q29tbWFuZCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ2FsbEFjdGlvbkNvbW1hbmQoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDYWxsQWN0aW9uQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJJZCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoY29udHJvbGxlcklkKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZXN0cm95Q29udGV4dENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhcnRMb25nUG9sbENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KHByZXNlbnRhdGlvbk1vZGVsKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChwbUlkKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQocG1JZCkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChwbUlkKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IFZhbHVlQ2hhbmdlZENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGF0dHJpYnV0ZUlkLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxufSIsImltcG9ydCB7QVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYXR0cmlidXRlSWQsICdhdHRyaWJ1dGVJZCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1ldGFkYXRhTmFtZSwgJ21ldGFkYXRhTmFtZScpO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgdGhpcy5tZXRhZGF0YU5hbWUgPSBtZXRhZGF0YU5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59IiwiaW1wb3J0IHtDQUxMX0FDVElPTl9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbEFjdGlvbkNvbW1hbmQge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ0FMTF9BQ1RJT05fQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyaWQsICdjb250cm9sbGVyaWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlcmlkID0gY29udHJvbGxlcmlkO1xuICAgICAgICB0aGlzLmFjdGlvbk5hbWUgPSBhY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYXR0cmlidXRlSWQsICdhdHRyaWJ1dGVJZCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1ldGFkYXRhTmFtZSwgJ21ldGFkYXRhTmFtZScpO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgdGhpcy5tZXRhZGF0YU5hbWUgPSBtZXRhZGF0YU5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59IiwiaW1wb3J0IHtDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQ29udGV4dENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgIH1cblxufSIsImltcG9ydCB7Q1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJOYW1lLCAnY29udHJvbGxlck5hbWUnKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJOYW1lID0gY29udHJvbGxlck5hbWU7XG4gICAgICAgIHRoaXMucGFyZW50Q29udHJvbGxlcklkID0gcGFyZW50Q29udHJvbGxlcklkO1xuICAgIH1cblxufSIsImltcG9ydCB7Q1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcmVzZW50YXRpb25Nb2RlbCwgJ3ByZXNlbnRhdGlvbk1vZGVsJyk7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbUlkID0gcHJlc2VudGF0aW9uTW9kZWwuaWQ7XG4gICAgICAgIHRoaXMucG1UeXBlID0gcHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICB2YXIgY29tbWFuZCA9IHRoaXM7XG4gICAgICAgIHByZXNlbnRhdGlvbk1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBhdHRyLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICBpZDogYXR0ci5pZCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogYXR0ci5nZXRWYWx1ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7REVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQocG1JZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKHBtSWQsICdwbUlkJyk7XG5cbiAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICB9XG59XG4iLCJpbXBvcnQge0RFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVzdHJveUNvbnRleHRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gREVTVFJPWV9DT05URVhUX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoY29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdEZXN0cm95Q29udHJvbGxlckNvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVycnVwdExvbmdQb2xsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRDtcbiAgICB9XG59IiwiaW1wb3J0IHtQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChwbUlkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKHBtSWQsICdwbUlkJyk7XG5cbiAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICB9XG59IiwiaW1wb3J0IHtTVEFSVF9MT05HX1BPTExfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhcnRMb25nUG9sbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBTVEFSVF9MT05HX1BPTExfQ09NTUFORF9JRDtcbiAgICB9XG59XG4iLCJpbXBvcnQge1ZBTFVFX0NIQU5HRURfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhbHVlQ2hhbmdlZENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChhdHRyaWJ1dGVJZCwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ1ZhbHVlQ2hhbmdlZENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYXR0cmlidXRlSWQsICdhdHRyaWJ1dGVJZCcpO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQgUHJvbWlzZSBmcm9tICdjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtBRERFRF9UWVBFLCBSRU1PVkVEX1RZUEV9IGZyb20gJy4vY29uc3RhbnRzJztcblxuXG5jb25zdCBET0xQSElOX0JFQU4gPSAnQEBAIERPTFBISU5fQkVBTiBAQEAnO1xuY29uc3QgQUNUSU9OX0NBTExfQkVBTiA9ICdAQEAgQ09OVFJPTExFUl9BQ1RJT05fQ0FMTF9CRUFOIEBAQCc7XG5jb25zdCBISUdITEFOREVSX0JFQU4gPSAnQEBAIEhJR0hMQU5ERVJfQkVBTiBAQEAnO1xuY29uc3QgRE9MUEhJTl9MSVNUX1NQTElDRSA9ICdARFA6TFNAJztcbmNvbnN0IFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbmNvbnN0IFNPVVJDRV9TWVNURU1fQ0xJRU5UID0gJ2NsaWVudCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX1NFUlZFUiA9ICdzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgc2VsZi5oaWdobGFuZGVyUE1SZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IGV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICAgICAgbGV0IHNvdXJjZVN5c3RlbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShTT1VSQ0VfU1lTVEVNKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gQURERURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxBZGRlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFR5cGUgPT09IFJFTU9WRURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxSZW1vdmVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGF0LmRvbHBoaW4uc3RhcnRQdXNoTGlzdGVuaW5nKENvbW1hbmRGYWN0b3J5LmNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKCksIENvbW1hbmRGYWN0b3J5LmNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsQWRkZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsQWRkZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQUNUSU9OX0NBTExfQkVBTjpcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBISUdITEFOREVSX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlcihtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW9kZWxSZW1vdmVkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbFJlbW92ZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludm9rZShjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IuaW52b2tlKGNvbW1hbmQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgJ2NvbW1hbmQnKTtcblxuICAgICAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBkb2xwaGluLnNlbmQoY29tbWFuZCwge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRIaWdobGFuZGVyUE0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG4gICAgfVxufVxuXG5leHBvcnQgeyBTT1VSQ0VfU1lTVEVNLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCwgU09VUkNFX1NZU1RFTV9TRVJWRVIsIEFDVElPTl9DQUxMX0JFQU4gfTtcbiIsImV4cG9ydCBjb25zdCBKU19TVFJJTkdfVFlQRSA9ICdzdHJpbmcnO1xuXG5leHBvcnQgY29uc3QgRE9MUEhJTl9CRUFOID0gMDtcbmV4cG9ydCBjb25zdCBCWVRFID0gMTtcbmV4cG9ydCBjb25zdCBTSE9SVCA9IDI7XG5leHBvcnQgY29uc3QgSU5UID0gMztcbmV4cG9ydCBjb25zdCBMT05HID0gNDtcbmV4cG9ydCBjb25zdCBGTE9BVCA9IDU7XG5leHBvcnQgY29uc3QgRE9VQkxFID0gNjtcbmV4cG9ydCBjb25zdCBCT09MRUFOID0gNztcbmV4cG9ydCBjb25zdCBTVFJJTkcgPSA4O1xuZXhwb3J0IGNvbnN0IERBVEUgPSA5O1xuZXhwb3J0IGNvbnN0IEVOVU0gPSAxMDtcbmV4cG9ydCBjb25zdCBDQUxFTkRBUiA9IDExO1xuZXhwb3J0IGNvbnN0IExPQ0FMX0RBVEVfRklFTERfVFlQRSA9IDU1O1xuZXhwb3J0IGNvbnN0IExPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFID0gNTI7XG5leHBvcnQgY29uc3QgWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEUgPSA1NDtcblxuXG5leHBvcnQgY29uc3QgQURERURfVFlQRSA9IFwiQURERURcIjtcbmV4cG9ydCBjb25zdCBSRU1PVkVEX1RZUEUgPSBcIlJFTU9WRURcIjtcbiIsImltcG9ydCBQcm9taXNlIGZyb20gJ2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCBTZXQgZnJvbSdjb3JlLWpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7ZXhpc3RzLCBjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmltcG9ydCBDb250cm9sbGVyUHJveHkgZnJvbSAnLi9jb250cm9sbGVycHJveHkuanMnO1xuXG5pbXBvcnQgQ29tbWFuZEZhY3RvcnkgZnJvbSAnLi9jb21tYW5kcy9jb21tYW5kRmFjdG9yeS5qcyc7XG5cblxuaW1wb3J0IHsgU09VUkNFX1NZU1RFTSB9IGZyb20gJy4vY29ubmVjdG9yLmpzJztcbmltcG9ydCB7IFNPVVJDRV9TWVNURU1fQ0xJRU5UIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IHsgQUNUSU9OX0NBTExfQkVBTiB9IGZyb20gJy4vY29ubmVjdG9yLmpzJztcblxuY29uc3QgQ09OVFJPTExFUl9JRCA9ICdjb250cm9sbGVySWQnO1xuY29uc3QgTU9ERUwgPSAnbW9kZWwnO1xuY29uc3QgRVJST1JfQ09ERSA9ICdlcnJvckNvZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyTWFuYWdlcntcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKScpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29ubmVjdG9yLCAnY29ubmVjdG9yJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQ29udHJvbGxlcihuYW1lLCBudWxsKVxuICAgIH1cblxuICAgIF9jcmVhdGVDb250cm9sbGVyKG5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuY3JlYXRlQ29udHJvbGxlcihuYW1lKScpO1xuICAgICAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgY29udHJvbGxlcklkLCBtb2RlbElkLCBtb2RlbCwgY29udHJvbGxlcjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5nZXRIaWdobGFuZGVyUE0oKS50aGVuKChoaWdobGFuZGVyUE0pID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQobmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJJZCA9IGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxJZCA9IGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoTU9ERUwpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gc2VsZi5jbGFzc1JlcG9zaXRvcnkubWFwRG9scGhpblRvQmVhbihtb2RlbElkKTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuYWRkKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGludm9rZUFjdGlvbihjb250cm9sbGVySWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuICAgICAgICBjaGVja1BhcmFtKGFjdGlvbk5hbWUsICdhY3Rpb25OYW1lJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT57XG5cbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgICAgIHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoU09VUkNFX1NZU1RFTSwgbnVsbCwgU09VUkNFX1NZU1RFTV9DTElFTlQpLFxuICAgICAgICAgICAgICAgIHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoRVJST1JfQ09ERSlcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGxldCBwbSA9IHNlbGYuZG9scGhpbi5wcmVzZW50YXRpb25Nb2RlbC5hcHBseShzZWxmLmRvbHBoaW4sIFtudWxsLCBBQ1RJT05fQ0FMTF9CRUFOXS5jb25jYXQoYXR0cmlidXRlcykpO1xuXG4gICAgICAgICAgICBsZXQgYWN0aW9uUGFyYW1zID0gW107XG4gICAgICAgICAgICBpZihleGlzdHMocGFyYW1zKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhcmFtIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KHBhcmFtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc2VsZi5jbGFzc1JlcG9zaXRvcnkubWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW1zW3BhcmFtXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25QYXJhbXMucHVzaCh7bmFtZTogcGFyYW0sIHZhbHVlOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ2FsbEFjdGlvbkNvbW1hbmQoY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBhY3Rpb25QYXJhbXMpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXNFcnJvciA9IHBtLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShFUlJPUl9DT0RFKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGlmIChpc0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJTZXJ2ZXIgc2lkZSBDb250cm9sbGVyQWN0aW9uIFwiICsgYWN0aW9uTmFtZSArIFwiIGNhdXNlZCBhbiBlcnJvci4gUGxlYXNlIHNlZSBzZXJ2ZXIgbG9nIGZvciBkZXRhaWxzLlwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwocG0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc3Ryb3lDb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKGNvbnRyb2xsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlciwgJ2NvbnRyb2xsZXInKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbigoaGlnaGxhbmRlclBNKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5kZWxldGUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5zZXRWYWx1ZShjb250cm9sbGVyLmNvbnRyb2xsZXJJZCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVyLmdldElkKCkpKS50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGxldCBjb250cm9sbGVyc0NvcHkgPSB0aGlzLmNvbnRyb2xsZXJzO1xuICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICAgICAgY29udHJvbGxlcnNDb3B5LmZvckVhY2goKGNvbnRyb2xsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChjb250cm9sbGVyLmRlc3Ryb3koKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbn1cbiIsImltcG9ydCBTZXQgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyUHJveHkge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obWFuYWdlciwgJ21hbmFnZXInKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJZCA9IGNvbnRyb2xsZXJJZDtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySWQ7XG4gICAgfVxuXG4gICAgaW52b2tlKG5hbWUsIHBhcmFtcyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkuaW52b2tlKG5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmludm9rZUFjdGlvbih0aGlzLmNvbnRyb2xsZXJJZCwgbmFtZSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5fY3JlYXRlQ29udHJvbGxlcihuYW1lLCB0aGlzLmdldElkKCkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKXtcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJQcm94eS5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uRGVzdHJveWVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuZGVzdHJveUNvbnRyb2xsZXIodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ZWQoaGFuZGxlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkub25EZXN0cm95ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbkRlc3Ryb3llZEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbkNvbnRyb2xsZXJQcm94eS5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignQ29udHJvbGxlclByb3h5Jyk7XG4iLCJpbXBvcnQgQ2xpZW50Q29ubmVjdG9yIGZyb20gJy4vY2xpZW50Q29ubmVjdG9yJ1xuaW1wb3J0IENsaWVudERvbHBoaW4gZnJvbSAnLi9jbGllbnREb2xwaGluJ1xuaW1wb3J0IENsaWVudE1vZGVsU3RvcmUgZnJvbSAnLi9jbGllbnRNb2RlbFN0b3JlJ1xuaW1wb3J0IEh0dHBUcmFuc21pdHRlciBmcm9tICcuL2h0dHBUcmFuc21pdHRlcidcbmltcG9ydCBOb1RyYW5zbWl0dGVyIGZyb20gJy4vbm9UcmFuc21pdHRlcidcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbHBoaW5CdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB1cmwodXJsKSB7XG4gICAgICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzZXQocmVzZXQpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSByZXNldDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2xhY2tNUyhzbGFja01TKSB7XG4gICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtYXhCYXRjaFNpemUobWF4QmF0Y2hTaXplKSB7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3VwcG9ydENPUlMoc3VwcG9ydENPUlMpIHtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBzdXBwb3J0Q09SUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcikge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcnNJbmZvKGhlYWRlcnNJbmZvKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm9fID0gaGVhZGVyc0luZm87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICBsZXQgY2xpZW50RG9scGhpbiA9IG5ldyBDbGllbnREb2xwaGluKCk7XG4gICAgICAgIGxldCB0cmFuc21pdHRlcjtcbiAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBIdHRwVHJhbnNtaXR0ZXIodGhpcy51cmxfLCB0aGlzLnJlc2V0XywgXCJVVEYtOFwiLCB0aGlzLmVycm9ySGFuZGxlcl8sIHRoaXMuc3VwcG9ydENPUlNfLCB0aGlzLmhlYWRlcnNJbmZvXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBOb1RyYW5zbWl0dGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRDb25uZWN0b3IobmV3IENsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgdGhpcy5zbGFja01TXywgdGhpcy5tYXhCYXRjaFNpemVfKSk7XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50TW9kZWxTdG9yZShuZXcgQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLkxPR0dFUi5kZWJ1ZyhcIkNsaWVudERvbHBoaW4gaW5pdGlhbGl6ZWRcIiwgY2xpZW50RG9scGhpbiwgdHJhbnNtaXR0ZXIpO1xuICAgICAgICByZXR1cm4gY2xpZW50RG9scGhpbjtcbiAgICB9XG59XG5cbkRvbHBoaW5CdWlsZGVyLkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdEb2xwaGluQnVpbGRlcicpOyIsImV4cG9ydCBjbGFzcyBEb2xwaGluUmVtb3RpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdSZW1vdGluZyBFcnJvcicsIGRldGFpbCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGV0YWlsID0gZGV0YWlsIHx8IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9scGhpblNlc3Npb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdTZXNzaW9uIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdIdHRwIFJlc3BvbnNlIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwTmV0d29ya0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBOZXR3b3JrIEVycm9yJykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXMge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIG9uRXZlbnQoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihldmVudCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZm9yRWFjaChoYW5kbGUgPT4gaGFuZGxlKGV2ZW50KSk7XG4gICAgfVxufSIsImltcG9ydCBDb2RlYyBmcm9tICcuL2NvbW1hbmRzL2NvZGVjJ1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0dHBUcmFuc21pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHJlc2V0ID0gdHJ1ZSwgY2hhcnNldCA9IFwiVVRGLThcIiwgZXJyb3JIYW5kbGVyID0gbnVsbCwgc3VwcG9ydENPUlMgPSBmYWxzZSwgaGVhZGVyc0luZm8gPSBudWxsKSB7XG5cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuY2hhcnNldCA9IGNoYXJzZXQ7XG4gICAgICAgIHRoaXMuSHR0cENvZGVzID0ge1xuICAgICAgICAgICAgZmluaXNoZWQ6IDQsXG4gICAgICAgICAgICBzdWNjZXNzOiAyMDBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIgPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlMgPSBzdXBwb3J0Q09SUztcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mbyA9IGhlYWRlcnNJbmZvO1xuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5zaWcgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydENPUlMpIHtcbiAgICAgICAgICAgIGlmIChcIndpdGhDcmVkZW50aWFsc1wiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaHR0cC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlOyAvLyBOT1RFOiBkb2luZyB0aGlzIGZvciBub24gQ09SUyByZXF1ZXN0cyBoYXMgbm8gaW1wYWN0XG4gICAgICAgICAgICAgICAgdGhpcy5zaWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjKCk7XG4gICAgICAgIGlmIChyZXNldCkge1xuICAgICAgICAgICAgSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcignSHR0cFRyYW5zbWl0dGVyLmludmFsaWRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2UgQ2xpZW50RG9scGhpbi5yZXNldChPblN1Y2Nlc3NIYW5kbGVyKSBpbnN0ZWFkJyk7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdGhpcy5odHRwLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdvbmVycm9yJywgXCJcIik7XG4gICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaHR0cC5yZWFkeVN0YXRlID09PSB0aGlzLkh0dHBDb2Rlcy5maW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmh0dHAuc3RhdHVzID09PSB0aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVRleHQgPSB0aGlzLmh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUNvbW1hbmRzID0gdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcihcIkVycm9yIG9jY3VycmVkIHBhcnNpbmcgcmVzcG9uc2VUZXh0OiBcIiwgZXJyLCByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEluY29ycmVjdCByZXNwb25zZVRleHQ6IFwiICsgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogZW1wdHkgcmVzcG9uc2VUZXh0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSFRUUCBTdGF0dXMgIT0gMjAwXCIpO1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLmh0dHApO1xuICAgICAgICBpZiAoXCJvdmVycmlkZU1pbWVUeXBlXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICB0aGlzLmh0dHAub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9XCIgKyB0aGlzLmNoYXJzZXQpOyAvLyB0b2RvIG1ha2UgaW5qZWN0YWJsZVxuICAgICAgICB9XG4gICAgICAgIGxldCBlbmNvZGVkQ29tbWFuZHMgPSB0aGlzLmNvZGVjLmVuY29kZShbY29tbWFuZHNdKTtcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi50cmFjZSgndHJhbnNtaXR0aW5nJywgY29tbWFuZHMsIGVuY29kZWRDb21tYW5kcyk7XG4gICAgICAgIHRoaXMuaHR0cC5zZW5kKGVuY29kZWRDb21tYW5kcyk7XG4gICAgfVxuXG4gICAgc2V0SGVhZGVycyhodHRwUmVxKSB7XG4gICAgICAgIGlmICh0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoaSwgdGhpcy5oZWFkZXJzSW5mb1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlRXJyb3Ioa2luZCwgbWVzc2FnZSkge1xuICAgICAgICBsZXQgZXJyb3JFdmVudCA9IHsga2luZDoga2luZCwgdXJsOiB0aGlzLnVybCwgaHR0cFN0YXR1czogdGhpcy5odHRwLnN0YXR1cywgbWVzc2FnZTogbWVzc2FnZSB9O1xuICAgICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcihcIkVycm9yIG9jY3VycmVkOiBcIiwgZXJyb3JFdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaWduYWwoY29tbWFuZCkge1xuICAgICAgICB0aGlzLnNpZy5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5zaWcpO1xuICAgICAgICBsZXQgZW5jb2RlZENvbW1hbmQgPSB0aGlzLmNvZGVjLmVuY29kZShbY29tbWFuZF0pO1xuICAgICAgICBIdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLnRyYWNlKCdzaWduYWwnLCBjb21tYW5kLCBlbmNvZGVkQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuc2lnLnNlbmQoZW5jb2RlZENvbW1hbmQpO1xuICAgIH1cblxuICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwgKyAnaW52YWxpZGF0ZT8nLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuaHR0cC5zZW5kKCk7XG4gICAgfVxufVxuXG5IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0h0dHBUcmFuc21pdHRlcicpOyIsImNvbnN0IExvZ0xldmVsID0ge1xuICAgIE5PTkU6IHsgbmFtZTogJ05PTkUnLCB0ZXh0OiAnW05PTkUgXScsIGxldmVsOiAwIH0sXG4gICAgQUxMOiB7IG5hbWU6ICdBTEwnLCB0ZXh0OiAnW0FMTCAgXScsIGxldmVsOiAxMDAgfSxcbiAgICBUUkFDRTogeyBuYW1lOiAnVFJBQ0UnLCB0ZXh0OiAnW1RSQUNFXScsIGxldmVsOiA1IH0sXG4gICAgREVCVUc6IHsgbmFtZTogJ0RFQlVHJywgdGV4dDogJ1tERUJVR10nLCBsZXZlbDogNCB9LFxuICAgIElORk86IHsgbmFtZTogJ0lORk8nLCB0ZXh0OiAnW0lORk8gXScsIGxldmVsOiAzIH0sXG4gICAgV0FSTjogeyBuYW1lOiAnV0FSTicsIHRleHQ6ICdbV0FSTiBdJywgbGV2ZWw6IDIgfSxcbiAgICBFUlJPUjogeyBuYW1lOiAnRVJST1InLCB0ZXh0OiAnW0VSUk9SXScsIGxldmVsOiAxIH1cbn07XG5cbmV4cG9ydCB7IExvZ0xldmVsIH07XG4iLCJpbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gXCIuL2xvZ2dlcmZhY3RvcnlcIjtcblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlckZhY3RvcnkgfTsiLCJpbXBvcnQge2NoZWNrUGFyYW0sIGV4aXN0c30gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG4vLyBwcml2YXRlIG1ldGhvZHNcbmNvbnN0IExPQ0FMUyA9IHtcbiAgICBwYWQgKHRleHQsIHNpemUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnICsgdGV4dDtcbiAgICAgICAgd2hpbGUgKHJlc3VsdC5sZW5ndGggPCBzaXplKSB7XG4gICAgICAgICAgICByZXN1bHQgPSAnMCcgKyByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIGludGVybmFsTG9nICgpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgICAgIGxldCBmdW5jID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBsZXQgY29udGV4dCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgbGV0IGxvZ0xldmVsID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGxldCBkYXRlU3RyaW5nID0gIGRhdGUuZ2V0RnVsbFllYXIoKSArICctJyArIExPQ0FMUy5wYWQoZGF0ZS5nZXRNb250aCgpLCAyKSArICctJyArIExPQ0FMUy5wYWQoZGF0ZS5nZXREYXRlKCksIDIpICsgJyAnICsgTE9DQUxTLnBhZChkYXRlLmdldEhvdXJzKCksIDIpICsgJzonICsgTE9DQUxTLnBhZChkYXRlLmdldE1pbnV0ZXMoKSwgMikgKyAnOicgKyBMT0NBTFMucGFkKGRhdGUuZ2V0U2Vjb25kcygpLCAyKSArICcuJyArIExPQ0FMUy5wYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMyk7XG4gICAgICAgIGZ1bmMoZGF0ZVN0cmluZywgbG9nTGV2ZWwudGV4dCwgY29udGV4dCwgLi4uYXJncyk7XG5cbiAgICB9LFxuICAgIGdldENvb2tpZSAobmFtZSkge1xuICAgICAgICBpZiAoZXhpc3RzKHdpbmRvdykgJiYgZXhpc3RzKHdpbmRvdy5kb2N1bWVudCkgJiYgZXhpc3RzKHdpbmRvdy5kb2N1bWVudC5jb29raWUpKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnOyAnICsgZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgbGV0IHBhcnRzID0gdmFsdWUuc3BsaXQoJzsgJyArIG5hbWUgKyAnPScpO1xuICAgICAgICAgICAgaWYgKCBwYXJ0cy5sZW5ndGggPT09IDIgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KCc7Jykuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLy8gcHVibGljXG5jbGFzcyBMb2dnZXIge1xuXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgcm9vdExvZ2dlcikge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnJvb3RMb2dnZXIgPSByb290TG9nZ2VyO1xuICAgICAgICBsZXQgY29va2llTG9nTGV2ZWwgPSBMT0NBTFMuZ2V0Q29va2llKCdET0xQSElOX1BMQVRGT1JNXycgKyB0aGlzLmNvbnRleHQpO1xuICAgICAgICBzd2l0Y2ggKGNvb2tpZUxvZ0xldmVsKSB7XG4gICAgICAgICAgICBjYXNlICdOT05FJzpcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0xldmVsID0gTG9nTGV2ZWwuTk9ORTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0FMTCc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLkFMTDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1RSQUNFJzpcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0xldmVsID0gTG9nTGV2ZWwuVFJBQ0U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdERUJVRyc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLkRFQlVHO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnSU5GTyc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLklORk87XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdXQVJOJzpcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0xldmVsID0gTG9nTGV2ZWwuV0FSTjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0VSUk9SJzpcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0xldmVsID0gTG9nTGV2ZWwuRVJST1I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHRyYWNlKCkge1xuICAgICAgICBpZiAoZXhpc3RzKGNvbnNvbGUpICYmIHRoaXMuaXNMb2dMZXZlbChMb2dMZXZlbC5UUkFDRSkpIHtcbiAgICAgICAgICAgIExPQ0FMUy5pbnRlcm5hbExvZyhjb25zb2xlLmxvZywgdGhpcy5jb250ZXh0LCBMb2dMZXZlbC5UUkFDRSwgLi4uYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCkge1xuICAgICAgICBpZiAoZXhpc3RzKGNvbnNvbGUpICYmIHRoaXMuaXNMb2dMZXZlbChMb2dMZXZlbC5ERUJVRykpIHtcbiAgICAgICAgICAgIExPQ0FMUy5pbnRlcm5hbExvZyhjb25zb2xlLmxvZywgdGhpcy5jb250ZXh0LCBMb2dMZXZlbC5ERUJVRywgLi4uYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluZm8oKSB7XG4gICAgICAgIGlmIChleGlzdHMoY29uc29sZSkgJiYgdGhpcy5pc0xvZ0xldmVsKExvZ0xldmVsLklORk8pKSB7XG4gICAgICAgICAgICBMT0NBTFMuaW50ZXJuYWxMb2coY29uc29sZS5sb2csIHRoaXMuY29udGV4dCwgTG9nTGV2ZWwuSU5GTywgLi4uYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhcm4oKSB7XG4gICAgICAgIGlmIChleGlzdHMoY29uc29sZSkgJiYgdGhpcy5pc0xvZ0xldmVsKExvZ0xldmVsLldBUk4pKSB7XG4gICAgICAgICAgICBMT0NBTFMuaW50ZXJuYWxMb2coY29uc29sZS53YXJuLCB0aGlzLmNvbnRleHQsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcnJvcigpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhjb25zb2xlKSAmJiB0aGlzLmlzTG9nTGV2ZWwoTG9nTGV2ZWwuRVJST1IpKSB7XG4gICAgICAgICAgICBMT0NBTFMuaW50ZXJuYWxMb2coY29uc29sZS5lcnJvciwgdGhpcy5jb250ZXh0LCBMb2dMZXZlbC5FUlJPUiwgLi4uYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExvZ0xldmVsKCkge1xuICAgICAgICBpZiAoZXhpc3RzKHRoaXMubG9nTGV2ZWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dMZXZlbDtcbiAgICAgICAgfSBlbHNlIGlmIChleGlzdHModGhpcy5yb290TG9nZ2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdExvZ2dlci5nZXRMb2dMZXZlbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExvZ0xldmVsLklORk87XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2dMZXZlbChsZXZlbCkge1xuICAgICAgICB0aGlzLmxvZ0xldmVsID0gbGV2ZWw7XG4gICAgfVxuXG4gICAgc2V0TG9nTGV2ZWxCeU5hbWUobGV2ZWxOYW1lKSB7XG4gICAgICAgIGlmIChleGlzdHMoTG9nTGV2ZWxbbGV2ZWxOYW1lXSkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nTGV2ZWwgPSBMb2dMZXZlbFtsZXZlbE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNMb2dMZXZlbChsZXZlbCkge1xuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5OT05FKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0TG9nTGV2ZWwoKSA9PT0gTG9nTGV2ZWwuQUxMKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5UUkFDRSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0TG9nTGV2ZWwoKSA9PT0gTG9nTGV2ZWwuREVCVUcgJiYgbGV2ZWwgIT09IExvZ0xldmVsLlRSQUNFKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5JTkZPICYmIGxldmVsICE9PSBMb2dMZXZlbC5UUkFDRSAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuREVCVUcpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldExvZ0xldmVsKCkgPT09IExvZ0xldmVsLldBUk4gJiYgbGV2ZWwgIT09IExvZ0xldmVsLlRSQUNFICYmIGxldmVsICE9PSBMb2dMZXZlbC5ERUJVRyAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuSU5GTykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0TG9nTGV2ZWwoKSA9PT0gTG9nTGV2ZWwuRVJST1IgJiYgbGV2ZWwgIT09IExvZ0xldmVsLlRSQUNFICYmIGxldmVsICE9PSBMb2dMZXZlbC5ERUJVRyAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuSU5GTyAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuV0FSTikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzTG9nTGV2ZWxVc2VhYmxlKGxldmVsKSB7XG4gICAgICAgIGNoZWNrUGFyYW0obGV2ZWwsICdsZXZlbCcpO1xuICAgICAgICBpZiAobGV2ZWwubGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExvZ0xldmVsKCkubGV2ZWwgPj0gbGV2ZWwubGV2ZWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExvZ2dlciB9O1xuIiwiaW1wb3J0ICBNYXAgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQgeyBleGlzdHMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlclwiO1xuXG5jb25zdCBST09UX0xPR0dFUiA9IG5ldyBMb2dnZXIoJ1JPT1QnKTtcblxuLy8gcHJpdmF0ZSBtZXRob2RzXG5jb25zdCBMT0NBTFMgPSB7XG4gICAgbG9nZ2VyczogbmV3IE1hcCgpXG59O1xuXG5cbi8vIHB1YmxpY1xuY2xhc3MgTG9nZ2VyRmFjdG9yeSB7XG5cbiAgICBzdGF0aWMgZ2V0TG9nZ2VyKGNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFleGlzdHMoY29udGV4dCkgfHwgY29udGV4dCA9PT0gJ1JPT1QnKSB7XG4gICAgICAgICAgICByZXR1cm4gUk9PVF9MT0dHRVI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGV4aXN0aW5nTG9nZ2VyID0gTE9DQUxTLmxvZ2dlcnMuZ2V0KGNvbnRleHQpO1xuICAgICAgICBpZiAoZXhpc3RpbmdMb2dnZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0xvZ2dlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsb2dnZXIgPSBuZXcgTG9nZ2VyKGNvbnRleHQsIFJPT1RfTE9HR0VSKTtcbiAgICAgICAgTE9DQUxTLmxvZ2dlcnMuc2V0KGNvbnRleHQsIGxvZ2dlcik7XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBMb2dnZXJGYWN0b3J5IH0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBOb1RyYW5zbWl0dGVyIHtcblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyBzcGVjaWFsXG4gICAgICAgIG9uRG9uZShbXSk7XG4gICAgfVxuXG4gICAgc2lnbmFsKCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59IiwiaW1wb3J0IERvbHBoaW5CdWlsZGVyIGZyb20gJy4vZG9scGhpbkJ1aWxkZXInXG5cbmV4cG9ydCBmdW5jdGlvbiBkb2xwaGluKHVybCwgcmVzZXQsIHNsYWNrTVMgPSAzMDApIHtcbiAgICByZXR1cm4gbWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChyZXNldCkuc2xhY2tNUyhzbGFja01TKS5idWlsZCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZURvbHBoaW4oKSB7XG4gICAgcmV0dXJuIG5ldyBEb2xwaGluQnVpbGRlcigpO1xufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2VtaXR0ZXItY29tcG9uZW50JztcblxuXG5pbXBvcnQgeyBleGlzdHMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERvbHBoaW5SZW1vdGluZ0Vycm9yLCBIdHRwTmV0d29ya0Vycm9yLCBEb2xwaGluU2Vzc2lvbkVycm9yLCBIdHRwUmVzcG9uc2VFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCBDb2RlYyBmcm9tICcuL2NvbW1hbmRzL2NvZGVjJztcbmltcG9ydCBSZW1vdGluZ0Vycm9ySGFuZGxlciBmcm9tICcuL3JlbW90aW5nRXJyb3JIYW5kbGVyJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnksIExvZ0xldmVsIH0gZnJvbSAnLi9sb2dnaW5nJztcbmltcG9ydCB7VkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEfSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRDb25zdGFudHMnO1xuXG5jb25zdCBGSU5JU0hFRCA9IDQ7XG5jb25zdCBTVUNDRVNTID0gMjAwO1xuY29uc3QgUkVRVUVTVF9USU1FT1VUID0gNDA4O1xuXG5jb25zdCBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xuY29uc3QgQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkb2xwaGluQ2xpZW50SWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm8gPSBleGlzdHMoY29uZmlnKSA/IGNvbmZpZy5oZWFkZXJzSW5mbyA6IG51bGw7XG4gICAgICAgIGxldCBjb25uZWN0aW9uQ29uZmlnID0gZXhpc3RzKGNvbmZpZykgPyBjb25maWcuY29ubmVjdGlvbiA6IG51bGw7XG4gICAgICAgIHRoaXMubWF4UmV0cnkgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcubWF4UmV0cnkpP2Nvbm5lY3Rpb25Db25maWcubWF4UmV0cnk6IDM7XG4gICAgICAgIHRoaXMudGltZW91dCA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy50aW1lb3V0KT9jb25uZWN0aW9uQ29uZmlnLnRpbWVvdXQ6IDUwMDA7XG4gICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgIH1cblxuICAgIF9oYW5kbGVFcnJvcihyZWplY3QsIGVycm9yKSB7XG4gICAgICAgIGxldCBjb25uZWN0aW9uQ29uZmlnID0gZXhpc3RzKHRoaXMuY29uZmlnKSA/IHRoaXMuY29uZmlnLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICBsZXQgZXJyb3JIYW5kbGVycyA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy5lcnJvckhhbmRsZXJzKT9jb25uZWN0aW9uQ29uZmlnLmVycm9ySGFuZGxlcnM6IFtuZXcgUmVtb3RpbmdFcnJvckhhbmRsZXIoKV07XG4gICAgICAgIGVycm9ySGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICBfc2VuZChjb21tYW5kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgaHR0cC5vbmVycm9yID0gKGVycm9yQ29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcignSFRUUCBuZXR3b3JrIGVycm9yJywgZXJyb3JDb250ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwTmV0d29ya0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogTmV0d29yayBlcnJvcicsIGVycm9yQ29udGVudCkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHAucmVhZHlTdGF0ZSA9PT0gRklOSVNIRUQpe1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGh0dHAuc3RhdHVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgU1VDQ0VTUzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xpZW50SWQgPSBodHRwLmdldFJlc3BvbnNlSGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGN1cnJlbnRDbGllbnRJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSAmJiB0aGlzLmNsaWVudElkICE9PSBjdXJyZW50Q2xpZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBDbGllbnRJZCBvZiB0aGUgcmVzcG9uc2UgZGlkIG5vdCBtYXRjaCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY3VycmVudENsaWVudElkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXJ2ZXIgZGlkIG5vdCBzZW5kIGEgY2xpZW50SWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5pc0xvZ0xldmVsVXNlYWJsZShMb2dMZXZlbC5ERUJVRykgJiYgIVBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5pc0xvZ0xldmVsVXNlYWJsZShMb2dMZXZlbC5UUkFDRSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqc29uID0gSlNPTi5wYXJzZShodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLmRlYnVnKCdIVFRQIHJlc3BvbnNlIHdpdGggU1VDQ0VTUycsIGN1cnJlbnRDbGllbnRJZCwganNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuZXJyb3IoJ1Jlc3BvbnNlIGNvdWxkIG5vdCBiZSBwYXJzZWQgdG8gSlNPTiBmb3IgbG9nZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLnRyYWNlKCdIVFRQIHJlc3BvbnNlIHdpdGggU1VDQ0VTUycsIGN1cnJlbnRDbGllbnRJZCwgaHR0cC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaHR0cC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFUVVFU1RfVElNRU9VVDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuZXJyb3IoJ0hUVFAgcmVxdWVzdCB0aW1lb3V0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlc3Npb24gVGltZW91dCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZhaWxlZF9hdHRlbXB0IDw9IHRoaXMubWF4UmV0cnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gdGhpcy5mYWlsZWRfYXR0ZW1wdCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcignSFRUUCB1bnN1cHBvcnRlZCBzdGF0dXMsIHdpdGggSFRUUCBzdGF0dXMnLCBodHRwLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgSHR0cFJlc3BvbnNlRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDAgKCcgKyBodHRwLnN0YXR1cyArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSkge1xuICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSwgdGhpcy5jbGllbnRJZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleGlzdHModGhpcy5oZWFkZXJzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVuY29kZWRDb21tYW5kcyA9IENvZGVjLmVuY29kZShjb21tYW5kcyk7XG5cbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuaXNMb2dMZXZlbFVzZWFibGUoTG9nTGV2ZWwuREVCVUcpICYmICFQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuaXNMb2dMZXZlbFVzZWFibGUoTG9nTGV2ZWwuVFJBQ0UpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tYW5kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tbWFuZCA9IGNvbW1hbmRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuZGVidWcoJ3NlbmQnLCBjb21tYW5kLCBlbmNvZGVkQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIudHJhY2UoJ3NlbmQnLCBjb21tYW5kcywgZW5jb2RlZENvbW1hbmRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZhaWxlZF9hdHRlbXB0ID4gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAuc2VuZChlbmNvZGVkQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBodHRwLnNlbmQoZW5jb2RlZENvbW1hbmRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0cmFuc21pdChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIHRoaXMuX3NlbmQoY29tbWFuZHMpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZVRleHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVRleHQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlQ29tbWFuZHMgPSBDb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShyZXNwb25zZUNvbW1hbmRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IERvbHBoaW5SZW1vdGluZ0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogUGFyc2UgZXJyb3I6IChJbmNvcnJlY3QgcmVzcG9uc2UgPSAnICsgcmVzcG9uc2VUZXh0ICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBEb2xwaGluUmVtb3RpbmdFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEVtcHR5IHJlc3BvbnNlJykpO1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNpZ25hbChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuX3NlbmQoW2NvbW1hbmRdKVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcikpO1xuICAgIH1cbn1cblxuUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyJyk7XG5cbkVtaXR0ZXIoUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlKTtcbiIsImltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGluZ0Vycm9ySGFuZGxlciB7XG5cbiAgICBvbkVycm9yKGVycm9yKSB7XG4gICAgICAgIFJlbW90aW5nRXJyb3JIYW5kbGVyLkxPR0dFUi5lcnJvcihlcnJvcik7XG4gICAgfVxuXG59XG5cblJlbW90aW5nRXJyb3JIYW5kbGVyLkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdSZW1vdGluZ0Vycm9ySGFuZGxlcicpOyIsInZhciBfY2hlY2tNZXRob2ROYW1lO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhpc3RzKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja01ldGhvZChuYW1lKSB7XG4gICAgX2NoZWNrTWV0aG9kTmFtZSA9IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1BhcmFtKHBhcmFtLCBwYXJhbWV0ZXJOYW1lKSB7XG4gICAgaWYoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcGFyYW1ldGVyICcgKyBwYXJhbWV0ZXJOYW1lICsgJyBpcyBtYW5kYXRvcnkgaW4gJyArIF9jaGVja01ldGhvZE5hbWUpO1xuICAgIH1cbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIFBvbHltZXIsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQmluZGVyID0gcmVxdWlyZSgnLi9iaW5kZXIuanMnKS5CaW5kZXI7XG5cblxuZnVuY3Rpb24gZXhpc3RzKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59XG5cblxudmFyIGFycmF5S2V5QnVnO1xuZnVuY3Rpb24gcG9seW1lcjFfMWhhY2soZWxlbWVudCwgcGF0aCkge1xuICAgIC8vIFRoaXMgaXMgYSB0ZW1wb3JhcnkgaGFjayB0byBkZWFsIHdpdGggUG9seW1lcidzIEFQSSBjb25zaXN0ZW5jeSBjb25jZXJuaW5nIGFycmF5cyBhbmQgcGF0aHMuXG4gICAgLy8gQW4gb2JzZXJ2ZXIgdXNlcyBrZXlzIGluIGFuIGFycmF5LCB3aGlsZSB0aGUgZ2V0KCkgYW5kIHNldCgpIG1ldGhvZHMgZXhwZWN0IHRoZSBpbmRleC5cbiAgICAvLyBUaGlzIGlzIGhvcGVmdWxseSBmaXhlZCBpbiBQb2x5bWVyIDEuMi5cbiAgICBkbyB7XG4gICAgICAgIHZhciBwYXRoRWxlbWVudHMgPSBwYXRoLm1hdGNoKC9eKFteXFwuXSspXFwuKC4qKSQvKTtcbiAgICAgICAgdmFyIGtleSA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzFdIDogcGF0aDtcbiAgICAgICAgcGF0aCA9IHBhdGhFbGVtZW50cyAhPT0gbnVsbD8gcGF0aEVsZW1lbnRzWzJdIDogbnVsbDtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50KSkge1xuICAgICAgICAgICAgdmFyIGFycmF5S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICAgICAgICAgIGlmIChpc05hTihhcnJheUtleSkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFBvbHltZXIuQ29sbGVjdGlvbi5nZXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGNvbGxlY3Rpb24uZ2V0SXRlbShhcnJheUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudFtrZXldO1xuICAgICAgICB9XG4gICAgfSB3aGlsZSAocGF0aCAhPT0gbnVsbCAmJiBleGlzdHMoZWxlbWVudCkpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5mdW5jdGlvbiBuYXZpZ2F0ZVRvQmVhbihlbGVtZW50LCBwYXRoKSB7XG4gICAgdmFyIG5hdmlnYXRpb24gPSBwYXRoLm1hdGNoKC9eKC4qKVxcLlteXFwuXSokLyk7XG4gICAgaWYgKCEgZXhpc3RzKG5hdmlnYXRpb24pKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZXhpc3RzKGFycmF5S2V5QnVnKSkge1xuICAgICAgICAgICAgYXJyYXlLZXlCdWcgPSB0eXBlb2YgUG9seW1lci52ZXJzaW9uICE9PSAnc3RyaW5nJyB8fCAoUG9seW1lci52ZXJzaW9uLm1hdGNoKC9eMVxcLlswMV1cXC4vKSAhPT0gbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5S2V5QnVnPyBwb2x5bWVyMV8xaGFjayhlbGVtZW50LCBuYXZpZ2F0aW9uWzFdKSA6IGVsZW1lbnQuZ2V0KG5hdmlnYXRpb25bMV0sIGVsZW1lbnQpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpIHtcblxuICAgIHZhciBiaW5kZXIgPSBuZXcgQmluZGVyKGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9ICdJTklUSUFMSVpJTkcnO1xuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9ic2VydmVyczogWydfZG9scGhpbk9ic2VydmVyKG1vZGVsLiopJ10sXG5cbiAgICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBjbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUpLnRoZW4oZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAnUkVBRFknO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgnbW9kZWwnLCBjb250cm9sbGVyLm1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpcmUoJ2NvbnRyb2xsZXItcmVhZHknKTtcblxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLm9uRGVzdHJveWVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAnREVTVFJPWUVEJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0KCdtb2RlbCcsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5maXJlKCdjb250cm9sbGVyLWRlc3Ryb3llZCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGludm9rZTogZnVuY3Rpb24oYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBDYWxsIHRoaXMgYWZ0ZXIgaW5pdCBoYXMgZmluaXNoZWRcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09ICdSRUFEWScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb250cm9sbGVyLmludm9rZSgpIGNhbGxlZCBiZWZvcmUgaW5pdCgpIGZpbmlzaGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXIuaW52b2tlKGFjdGlvbk5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIF9kb2xwaGluT2JzZXJ2ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSAnUkVBRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBldmVudC5wYXRoO1xuICAgICAgICAgICAgICAgIHZhciBiZWFuLCBwcm9wZXJ0eU5hbWUsIGksIGo7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gZXZlbnQudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5ld1ZhbHVlKSAmJiBleGlzdHMobmV3VmFsdWUuaW5kZXhTcGxpY2VzKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSBcIi5zcGxpY2VzXCIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYmVhbiA9IG5hdmlnYXRlVG9CZWFuKHRoaXMsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwYXRoLm1hdGNoKC9bXlxcLl0rJC8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBuZXdWYWx1ZS5pbmRleFNwbGljZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFuZ2UgPSBuZXdWYWx1ZS5pbmRleFNwbGljZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50Q29udGV4dC5iZWFuTWFuYWdlci5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWVbMF0sIGNoYW5nZS5pbmRleCwgY2hhbmdlLmFkZGVkQ291bnQsIGNoYW5nZS5yZW1vdmVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlLnJlbW92ZWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoICsgJy4nICsgKGNoYW5nZS5pbmRleCArIGopLCBjaGFuZ2UucmVtb3ZlZFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGNoYW5nZS5pbmRleCArIGNoYW5nZS5hZGRlZENvdW50OyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFBvcyA9IGogLSBjaGFuZ2UuYWRkZWRDb3VudCArIGNoYW5nZS5yZW1vdmVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoICsgJy4nICsgb2xkUG9zLCBhcnJheVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGNoYW5nZS5pbmRleDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci5iaW5kKHRoaXMsIHBhdGggKyAnLicgKyBqLCBhcnJheVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmVhbiA9IG5hdmlnYXRlVG9CZWFuKHRoaXMsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pICYmICFBcnJheS5pc0FycmF5KGJlYW4pICYmICFBcnJheS5pc0FycmF5KG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcGF0aC5tYXRjaCgvW15cXC5dKyQvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWVbMF0sIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMob2xkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGVyLnVuYmluZCh0aGlzLCBwYXRoLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci5iaW5kKHRoaXMsIHBhdGgsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5cblxuZXhwb3J0cy5zZXR1cENyZWF0ZUJlaGF2aW9yID0gc2V0dXBDcmVhdGVCZWhhdmlvcjsiLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBNYXAgID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJyk7XG5cblxuXG5mdW5jdGlvbiBleGlzdHMob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmluZFNjb3BlKHNjb3BlLCBmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZuLmFwcGx5KHNjb3BlLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbChhcnJheTEsIGFycmF5Mikge1xuICAgIGlmIChhcnJheTEgPT09IGFycmF5MiB8fCAoIWV4aXN0cyhhcnJheTEpICYmICFleGlzdHMoYXJyYXkyKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChleGlzdHMoYXJyYXkxKSAhPT0gZXhpc3RzKGFycmF5MikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbiA9IGFycmF5MS5sZW5ndGg7XG4gICAgaWYgKGFycmF5Mi5sZW5ndGggIT09IG4pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5mdW5jdGlvbiBCaW5kZXIoYmVhbk1hbmFnZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcblxuICAgIGJlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShiaW5kU2NvcGUodGhpcywgdGhpcy5vbkJlYW5VcGRhdGVIYW5kbGVyKSk7XG4gICAgYmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShiaW5kU2NvcGUodGhpcywgdGhpcy5vbkFycmF5VXBkYXRlSGFuZGxlcikpO1xufVxuXG5cbkJpbmRlci5wcm90b3R5cGUub25CZWFuVXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgaWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQoYmVhbik7XG4gICAgaWYgKGV4aXN0cyhsaXN0ZW5lckxpc3QpICYmIGxpc3RlbmVyTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGxpc3RlbmVyTGlzdFswXTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlbnRyeS5lbGVtZW50O1xuICAgICAgICB2YXIgcGF0aCA9IGVudHJ5LnJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lO1xuICAgICAgICBlbGVtZW50LnNldChwYXRoLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmVhbltwcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxufTtcblxuXG5CaW5kZXIucHJvdG90eXBlLm9uQXJyYXlVcGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSB7XG4gICAgdmFyIGFycmF5ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgIHZhciBvbGRFbGVtZW50cyA9IGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KTtcbiAgICBpZiAoZGVlcEVxdWFsKG5ld0VsZW1lbnRzLCBvbGRFbGVtZW50cykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGJlYW4pO1xuICAgIGlmIChleGlzdHMobGlzdGVuZXJMaXN0KSAmJiBsaXN0ZW5lckxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgZW50cnkgPSBsaXN0ZW5lckxpc3RbMF07XG4gICAgICAgIHZhciBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgICAgdmFyIHBhdGggPSBlbnRyeS5yb290UGF0aCArICcuJyArIHByb3BlcnR5TmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdFbGVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3BsaWNlKHBhdGgsIGluZGV4LCBjb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnNwbGljZS5hcHBseShlbGVtZW50LCBbcGF0aCwgaW5kZXgsIGNvdW50XS5jb25jYXQobmV3RWxlbWVudHMpKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3RWxlbWVudHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIGNvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZS5hcHBseShhcnJheSwgW2luZGV4LCBjb3VudF0uY29uY2F0KG5ld0VsZW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbkJpbmRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChlbGVtZW50LCByb290UGF0aCwgdmFsdWUpIHtcbiAgICBpZiAoIWV4aXN0cyh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQodmFsdWUpO1xuICAgIGlmICghZXhpc3RzKGxpc3RlbmVyTGlzdCkpIHtcbiAgICAgICAgbGlzdGVuZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNldCh2YWx1ZSwgbGlzdGVuZXJMaXN0KTtcbiAgICB9XG4gICAgbGlzdGVuZXJMaXN0LnB1c2goe2VsZW1lbnQ6IGVsZW1lbnQsIHJvb3RQYXRoOiByb290UGF0aH0pO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmluZChlbGVtZW50LCByb290UGF0aCArICcuJyArIGksIHZhbHVlW2ldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lLCB2YWx1ZVtwcm9wZXJ0eU5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbkJpbmRlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJvb3RQYXRoLCB2YWx1ZSkge1xuICAgIGlmICghZXhpc3RzKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldCh2YWx1ZSk7XG4gICAgaWYgKGV4aXN0cyhsaXN0ZW5lckxpc3QpKSB7XG4gICAgICAgIHZhciBuID0gbGlzdGVuZXJMaXN0Lmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGxpc3RlbmVyTGlzdFtpXTtcbiAgICAgICAgICAgIGlmIChlbnRyeS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGVudHJ5LnJvb3RQYXRoID09PSByb290UGF0aCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyTGlzdC5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bmJpbmQoZWxlbWVudCwgcm9vdFBhdGggKyAnLicgKyBqLCB2YWx1ZVtqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lLCB2YWx1ZVtwcm9wZXJ0eU5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuZXhwb3J0cy5CaW5kZXIgPSBCaW5kZXI7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkb2xwaGluQ2xpZW50ID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvZG9scGhpbi1wbGF0Zm9ybS5qcycpO1xudmFyIHNldHVwQ3JlYXRlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9yLmpzJykuc2V0dXBDcmVhdGVCZWhhdmlvcjtcblxuZXhwb3J0cy5jbGllbnRDb250ZXh0ID0gZnVuY3Rpb24odXJsLCBjb25maWcpe1xuICAgIHZhciBjbGllbnRDb250ZXh0RmFjdG9yeSA9IG5ldyBkb2xwaGluQ2xpZW50LkNsaWVudENvbnRleHRGYWN0b3J5KCk7XG4gICAgdmFyIGNsaWVudENvbnRleHQgPSBjbGllbnRDb250ZXh0RmFjdG9yeS5jcmVhdGUodXJsLCBjb25maWcpO1xuICAgIGNsaWVudENvbnRleHQuY3JlYXRlQmVoYXZpb3IgPSBzZXR1cENyZWF0ZUJlaGF2aW9yKGNsaWVudENvbnRleHQpO1xuICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xufTtcblxuIl19
