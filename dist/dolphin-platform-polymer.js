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
    TAG = _dereq_('./_wks')('toStringTag')
// ES3 wrong here
,
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
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
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
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attribute = function Attribute() {
  _classCallCheck(this, Attribute);
};

Attribute.QUALIFIER_PROPERTY = "qualifier";
Attribute.VALUE = "value";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Attribute;



},{}],82:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');

var ChangeAttributeMetadataCommand = function (_Command_1$default) {
    _inherits(ChangeAttributeMetadataCommand, _Command_1$default);

    function ChangeAttributeMetadataCommand(attributeId, metadataName, value) {
        _classCallCheck(this, ChangeAttributeMetadataCommand);

        var _this = _possibleConstructorReturn(this, (ChangeAttributeMetadataCommand.__proto__ || Object.getPrototypeOf(ChangeAttributeMetadataCommand)).call(this));

        _this.attributeId = attributeId;
        _this.metadataName = metadataName;
        _this.value = value;
        _this.id = 'ChangeAttributeMetadata';
        _this.className = "org.opendolphin.core.comm.ChangeAttributeMetadataCommand";
        return _this;
    }

    return ChangeAttributeMetadataCommand;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChangeAttributeMetadataCommand;



},{"./Command":89}],83:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus_1 = _dereq_('./EventBus');

var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        _classCallCheck(this, ClientAttribute);

        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new EventBus_1.default();
        this.qualifierChangeBus = new EventBus_1.default();
        this.setValue(value);
        this.setQualifier(qualifier);
    }
    /** a copy constructor with new id and no presentation model */


    _createClass(ClientAttribute, [{
        key: "copy",
        value: function copy() {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
            return result;
        }
    }, {
        key: "setPresentationModel",
        value: function setPresentationModel(presentationModel) {
            if (this.presentationModel) {
                alert("You can not set a presentation model for an attribute that is already bound.");
            }
            this.presentationModel = presentationModel;
        }
    }, {
        key: "getPresentationModel",
        value: function getPresentationModel() {
            return this.presentationModel;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return this.value;
        }
    }, {
        key: "setValue",
        value: function setValue(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value == verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
        }
    }, {
        key: "setQualifier",
        value: function setQualifier(newQualifier) {
            if (this.qualifier == newQualifier) return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
        }
    }, {
        key: "getQualifier",
        value: function getQualifier() {
            return this.qualifier;
        }
    }, {
        key: "onValueChange",
        value: function onValueChange(eventHandler) {
            this.valueChangeBus.onEvent(eventHandler);
            eventHandler({ "oldValue": this.value, "newValue": this.value });
        }
    }, {
        key: "onQualifierChange",
        value: function onQualifierChange(eventHandler) {
            this.qualifierChangeBus.onEvent(eventHandler);
        }
    }, {
        key: "syncWith",
        value: function syncWith(sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setValue(sourceAttribute.value);
            }
        }
    }], [{
        key: "checkValue",
        value: function checkValue(value) {
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
        }
    }]);

    return ClientAttribute;
}();

ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;
exports.ClientAttribute = ClientAttribute;



},{"./EventBus":95}],84:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");
var Codec_1 = _dereq_("./Codec");
var CommandBatcher_1 = _dereq_("./CommandBatcher");

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
        this.codec = new Codec_1.default();
        this.commandBatcher = new CommandBatcher_1.BlindCommandBatcher(true, maxBatchSize);
    }

    _createClass(ClientConnector, [{
        key: "setCommandBatcher",
        value: function setCommandBatcher(newBatcher) {
            this.commandBatcher = newBatcher;
        }
    }, {
        key: "setPushEnabled",
        value: function setPushEnabled(enabled) {
            this.pushEnabled = enabled;
        }
    }, {
        key: "setPushListener",
        value: function setPushListener(newListener) {
            this.pushListener = newListener;
        }
    }, {
        key: "setReleaseCommand",
        value: function setReleaseCommand(newCommand) {
            this.releaseCommand = newCommand;
        }
    }, {
        key: "send",
        value: function send(command, onFinished) {
            this.commandQueue.push({ command: command, handler: onFinished });
            if (this.currentlySending) {
                this.release(); // there is not point in releasing if we do not send atm
                return;
            }
            this.doSendNext();
        }
    }, {
        key: "doSendNext",
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
        }
    }, {
        key: "handle",
        value: function handle(command) {
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
        }
    }, {
        key: "handleDeletePresentationModelCommand",
        value: function handleDeletePresentationModelCommand(serverCommand) {
            var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
            if (!model) return null;
            this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
            return model;
        }
    }, {
        key: "handleCreatePresentationModelCommand",
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
            var clientPm = new ClientPresentationModel_1.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            return clientPm;
        }
    }, {
        key: "handleValueChangedCommand",
        value: function handleValueChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() == serverCommand.newValue) {
                //console.log("nothing to do. new value == old value");
                return null;
            }
            clientAttribute.setValue(serverCommand.newValue);
            return null;
        }
    }, {
        key: "handleAttributeMetadataChangedCommand",
        value: function handleAttributeMetadataChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) return null;
            clientAttribute[serverCommand.metadataName] = serverCommand.value;
            return null;
        }
        ///////////// push support ///////////////

    }, {
        key: "listen",
        value: function listen() {
            if (!this.pushEnabled) return;
            if (this.waiting) return;
            // todo: how to issue a warning if no pushListener is set?
            if (!this.currentlySending) {
                this.doSendNext();
            }
        }
    }, {
        key: "enqueuePushCommand",
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
        key: "release",
        value: function release() {
            if (!this.waiting) return;
            this.waiting = false;
            // todo: how to issue a warning if no releaseCommand is set?
            this.transmitter.signal(this.releaseCommand);
        }
    }]);

    return ClientConnector;
}();

exports.ClientConnector = ClientConnector;



},{"./ClientPresentationModel":87,"./Codec":88,"./CommandBatcher":90}],85:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientAttribute_1 = _dereq_("./ClientAttribute");
var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");

var ClientDolphin = function () {
    function ClientDolphin() {
        _classCallCheck(this, ClientDolphin);
    }

    _createClass(ClientDolphin, [{
        key: "setClientConnector",
        value: function setClientConnector(clientConnector) {
            this.clientConnector = clientConnector;
        }
    }, {
        key: "getClientConnector",
        value: function getClientConnector() {
            return this.clientConnector;
        }
    }, {
        key: "send",
        value: function send(command, onFinished) {
            this.clientConnector.send(command, onFinished);
        }
        // factory method for attributes

    }, {
        key: "attribute",
        value: function attribute(propertyName, qualifier, value) {
            return new ClientAttribute_1.ClientAttribute(propertyName, qualifier, value);
        }
        // factory method for presentation models

    }, {
        key: "presentationModel",
        value: function presentationModel(id, type) {
            var model = new ClientPresentationModel_1.ClientPresentationModel(id, type);

            for (var _len = arguments.length, attributes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                attributes[_key - 2] = arguments[_key];
            }

            if (attributes && attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    model.addAttribute(attribute);
                });
            }
            this.getClientModelStore().add(model);
            return model;
        }
    }, {
        key: "setClientModelStore",
        value: function setClientModelStore(clientModelStore) {
            this.clientModelStore = clientModelStore;
        }
    }, {
        key: "getClientModelStore",
        value: function getClientModelStore() {
            return this.clientModelStore;
        }
    }, {
        key: "listPresentationModelIds",
        value: function listPresentationModelIds() {
            return this.getClientModelStore().listPresentationModelIds();
        }
    }, {
        key: "listPresentationModels",
        value: function listPresentationModels() {
            return this.getClientModelStore().listPresentationModels();
        }
    }, {
        key: "findAllPresentationModelByType",
        value: function findAllPresentationModelByType(presentationModelType) {
            return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
        }
    }, {
        key: "getAt",
        value: function getAt(id) {
            return this.findPresentationModelById(id);
        }
    }, {
        key: "findPresentationModelById",
        value: function findPresentationModelById(id) {
            return this.getClientModelStore().findPresentationModelById(id);
        }
    }, {
        key: "deletePresentationModel",
        value: function deletePresentationModel(modelToDelete) {
            this.getClientModelStore().deletePresentationModel(modelToDelete, true);
        }
    }, {
        key: "updatePresentationModelQualifier",
        value: function updatePresentationModelQualifier(presentationModel) {
            var _this = this;

            presentationModel.getAttributes().forEach(function (sourceAttribute) {
                _this.updateAttributeQualifier(sourceAttribute);
            });
        }
    }, {
        key: "updateAttributeQualifier",
        value: function updateAttributeQualifier(sourceAttribute) {
            if (!sourceAttribute.getQualifier()) return;
            var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
            attributes.forEach(function (targetAttribute) {
                targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
            });
        }
        ////// push support ///////

    }, {
        key: "startPushListening",
        value: function startPushListening(pushCommand, releaseCommand) {
            this.clientConnector.setPushListener(pushCommand);
            this.clientConnector.setReleaseCommand(releaseCommand);
            this.clientConnector.setPushEnabled(true);
            this.clientConnector.listen();
        }
    }, {
        key: "stopPushListening",
        value: function stopPushListening() {
            this.clientConnector.setPushEnabled(false);
        }
    }]);

    return ClientDolphin;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientDolphin;



},{"./ClientAttribute":83,"./ClientPresentationModel":87}],86:[function(_dereq_,module,exports){
/// <reference path="./core-js.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        _classCallCheck(this, ClientModelStore);

        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new EventBus_1.default();
    }

    _createClass(ClientModelStore, [{
        key: "getClientDolphin",
        value: function getClientDolphin() {
            return this.clientDolphin;
        }
    }, {
        key: "registerModel",
        value: function registerModel(model) {
            var _this = this;

            if (model.clientSideOnly) {
                return;
            }
            var connector = this.clientDolphin.getClientConnector();
            var createPMCommand = new CreatePresentationModelCommand_1.default(model);
            connector.send(createPMCommand, null);
            model.getAttributes().forEach(function (attribute) {
                _this.registerAttribute(attribute);
            });
        }
    }, {
        key: "registerAttribute",
        value: function registerAttribute(attribute) {
            var _this2 = this;

            this.addAttributeById(attribute);
            if (attribute.getQualifier()) {
                this.addAttributeByQualifier(attribute);
            }
            // whenever an attribute changes its value, the server needs to be notified
            // and all other attributes with the same qualifier are given the same value
            attribute.onValueChange(function (evt) {
                var valueChangeCommand = new ValueChangedCommand_1.default(attribute.id, evt.newValue);
                _this2.clientDolphin.getClientConnector().send(valueChangeCommand, null);
                if (attribute.getQualifier()) {
                    var attrs = _this2.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setValue(attribute.getValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                var changeAttrMetadataCmd = new ChangeAttributeMetadataCommand_1.default(attribute.id, Attribute_1.default.QUALIFIER_PROPERTY, evt.newValue);
                _this2.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
            });
        }
    }, {
        key: "add",
        value: function add(model) {
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
        }
    }, {
        key: "remove",
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
                this.modelStoreChangeBus.trigger({ 'eventType': Type.REMOVED, 'clientPresentationModel': model });
                removed = true;
            }
            return removed;
        }
    }, {
        key: "findAttributesByFilter",
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
        key: "addPresentationModelByType",
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
        key: "removePresentationModelByType",
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
        key: "listPresentationModelIds",
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
        key: "listPresentationModels",
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
        key: "findPresentationModelById",
        value: function findPresentationModelById(id) {
            return this.presentationModels.get(id);
        }
    }, {
        key: "findAllPresentationModelByType",
        value: function findAllPresentationModelByType(type) {
            if (!type || !this.presentationModelsPerType.has(type)) {
                return [];
            }
            return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
        }
    }, {
        key: "deletePresentationModel",
        value: function deletePresentationModel(model, notify) {
            if (!model) {
                return;
            }
            if (this.containsPresentationModel(model.id)) {
                this.remove(model);
                if (!notify || model.clientSideOnly) {
                    return;
                }
                this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification_1.default(model.id), null);
            }
        }
    }, {
        key: "containsPresentationModel",
        value: function containsPresentationModel(id) {
            return this.presentationModels.has(id);
        }
    }, {
        key: "addAttributeById",
        value: function addAttributeById(attribute) {
            if (!attribute || this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.set(attribute.id, attribute);
        }
    }, {
        key: "removeAttributeById",
        value: function removeAttributeById(attribute) {
            if (!attribute || !this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.delete(attribute.id);
        }
    }, {
        key: "findAttributeById",
        value: function findAttributeById(id) {
            return this.attributesPerId.get(id);
        }
    }, {
        key: "addAttributeByQualifier",
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
        key: "removeAttributeByQualifier",
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
        key: "findAllAttributesByQualifier",
        value: function findAllAttributesByQualifier(qualifier) {
            if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
                return [];
            }
            return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
        }
    }, {
        key: "onModelStoreChange",
        value: function onModelStoreChange(eventHandler) {
            this.modelStoreChangeBus.onEvent(eventHandler);
        }
    }, {
        key: "onModelStoreChangeForType",
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

exports.ClientModelStore = ClientModelStore;



},{"./Attribute":81,"./ChangeAttributeMetadataCommand":82,"./CreatePresentationModelCommand":92,"./DeletedPresentationModelNotification":93,"./EventBus":95,"./ValueChangedCommand":102}],87:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus_1 = _dereq_('./EventBus');
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
        this.invalidBus = new EventBus_1.default();
        this.dirtyValueChangeBus = new EventBus_1.default();
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

exports.ClientPresentationModel = ClientPresentationModel;



},{"./EventBus":95}],88:[function(_dereq_,module,exports){
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

},{"./utils.js":121}],89:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function Command() {
    _classCallCheck(this, Command);

    this.id = "dolphin-core-command";
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;



},{}],90:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueChangedCommand_1 = _dereq_('./ValueChangedCommand');
/** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */

var NoCommandBatcher = function () {
    function NoCommandBatcher() {
        _classCallCheck(this, NoCommandBatcher);
    }

    _createClass(NoCommandBatcher, [{
        key: 'batch',
        value: function batch(queue) {
            return [queue.shift()];
        }
    }]);

    return NoCommandBatcher;
}();

exports.NoCommandBatcher = NoCommandBatcher;
/** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */

var BlindCommandBatcher = function () {
    /** folding: whether we should try folding ValueChangedCommands */
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
            var n = Math.min(queue.length, this.maxBatchSize);
            for (var counter = 0; counter < n; counter++) {
                var candidate = queue.shift();
                if (this.folding && candidate.command instanceof ValueChangedCommand_1.default && !candidate.handler) {
                    var canCmd = candidate.command;
                    if (batch.length > 0 && batch[batch.length - 1].command instanceof ValueChangedCommand_1.default) {
                        var batchCmd = batch[batch.length - 1].command;
                        if (canCmd.attributeId == batchCmd.attributeId) {
                            batchCmd.newValue = canCmd.newValue;
                        } else {
                            batch.push(candidate); // we cannot merge, so batch the candidate
                        }
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
        }
    }]);

    return BlindCommandBatcher;
}();

exports.BlindCommandBatcher = BlindCommandBatcher;



},{"./ValueChangedCommand":102}],91:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandConstants = function CommandConstants() {
  _classCallCheck(this, CommandConstants);
};

CommandConstants.DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
CommandConstants.CREATE_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
CommandConstants.DESTROY_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';
CommandConstants.CREATE_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'registerController';
CommandConstants.DESTROY_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'destroyController';
CommandConstants.CALL_CONTROLLER_ACTION_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
CommandConstants.START_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'longPoll';
CommandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'release';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommandConstants;



},{}],92:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');

var CreatePresentationModelCommand = function (_Command_1$default) {
    _inherits(CreatePresentationModelCommand, _Command_1$default);

    function CreatePresentationModelCommand(presentationModel) {
        _classCallCheck(this, CreatePresentationModelCommand);

        var _this = _possibleConstructorReturn(this, (CreatePresentationModelCommand.__proto__ || Object.getPrototypeOf(CreatePresentationModelCommand)).call(this));

        _this.attributes = [];
        _this.clientSideOnly = false;
        _this.id = "CreatePresentationModel";
        _this.className = "org.opendolphin.core.comm.CreatePresentationModelCommand";
        _this.pmId = presentationModel.id;
        _this.pmType = presentationModel.presentationModelType;
        var attrs = _this.attributes;
        presentationModel.getAttributes().forEach(function (attr) {
            attrs.push({
                propertyName: attr.propertyName,
                id: attr.id,
                qualifier: attr.getQualifier(),
                value: attr.getValue()
            });
        });
        return _this;
    }

    return CreatePresentationModelCommand;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreatePresentationModelCommand;



},{"./Command":89}],93:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');

var DeletedPresentationModelNotification = function (_Command_1$default) {
    _inherits(DeletedPresentationModelNotification, _Command_1$default);

    function DeletedPresentationModelNotification(pmId) {
        _classCallCheck(this, DeletedPresentationModelNotification);

        var _this = _possibleConstructorReturn(this, (DeletedPresentationModelNotification.__proto__ || Object.getPrototypeOf(DeletedPresentationModelNotification)).call(this));

        _this.pmId = pmId;
        _this.id = 'DeletedPresentationModel';
        _this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
        return _this;
    }

    return DeletedPresentationModelNotification;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeletedPresentationModelNotification;



},{"./Command":89}],94:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientConnector_1 = _dereq_("./ClientConnector");
var ClientDolphin_1 = _dereq_("./ClientDolphin");
var ClientModelStore_1 = _dereq_("./ClientModelStore");
var HttpTransmitter_1 = _dereq_("./HttpTransmitter");
var NoTransmitter_1 = _dereq_("./NoTransmitter");

var DolphinBuilder = function () {
    function DolphinBuilder() {
        _classCallCheck(this, DolphinBuilder);

        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }

    _createClass(DolphinBuilder, [{
        key: "url",
        value: function url(_url) {
            this.url_ = _url;
            return this;
        }
    }, {
        key: "reset",
        value: function reset(_reset) {
            this.reset_ = _reset;
            return this;
        }
    }, {
        key: "slackMS",
        value: function slackMS(_slackMS) {
            this.slackMS_ = _slackMS;
            return this;
        }
    }, {
        key: "maxBatchSize",
        value: function maxBatchSize(_maxBatchSize) {
            this.maxBatchSize_ = _maxBatchSize;
            return this;
        }
    }, {
        key: "supportCORS",
        value: function supportCORS(_supportCORS) {
            this.supportCORS_ = _supportCORS;
            return this;
        }
    }, {
        key: "errorHandler",
        value: function errorHandler(_errorHandler) {
            this.errorHandler_ = _errorHandler;
            return this;
        }
    }, {
        key: "headersInfo",
        value: function headersInfo(_headersInfo) {
            this.headersInfo_ = _headersInfo;
            return this;
        }
    }, {
        key: "build",
        value: function build() {
            console.log("OpenDolphin js found");
            var clientDolphin = new ClientDolphin_1.default();
            var transmitter;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new HttpTransmitter_1.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
            } else {
                transmitter = new NoTransmitter_1.default();
            }
            clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new ClientModelStore_1.ClientModelStore(clientDolphin));
            console.log("ClientDolphin initialized");
            return clientDolphin;
        }
    }]);

    return DolphinBuilder;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DolphinBuilder;



},{"./ClientConnector":84,"./ClientDolphin":85,"./ClientModelStore":86,"./HttpTransmitter":96,"./NoTransmitter":98}],95:[function(_dereq_,module,exports){
"use strict";

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

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventBus;



},{}],96:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codec_1 = _dereq_("./Codec");

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
        this.codec = new Codec_1.default();
        if (reset) {
            console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    _createClass(HttpTransmitter, [{
        key: "transmit",
        value: function transmit(commands, onDone) {
            var _this = this;

            this.http.onerror = function () {
                _this.handleError('onerror', "");
                onDone([]);
            };
            this.http.onreadystatechange = function () {
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
        }
    }, {
        key: "setHeaders",
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
        key: "handleError",
        value: function handleError(kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            } else {
                console.log("Error occurred: ", errorEvent);
            }
        }
    }, {
        key: "signal",
        value: function signal(command) {
            this.sig.open('POST', this.url, true);
            this.setHeaders(this.sig);
            this.sig.send(this.codec.encode([command]));
        }
        // Deprecated ! Use 'reset(OnSuccessHandler) instead

    }, {
        key: "invalidate",
        value: function invalidate() {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        }
    }]);

    return HttpTransmitter;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HttpTransmitter;



},{"./Codec":88}],97:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignalCommand_1 = _dereq_("./SignalCommand");
var CommandConstants_1 = _dereq_("./CommandConstants");

var InterruptLongPollCommand = function (_SignalCommand_1$defa) {
    _inherits(InterruptLongPollCommand, _SignalCommand_1$defa);

    function InterruptLongPollCommand() {
        _classCallCheck(this, InterruptLongPollCommand);

        var _this = _possibleConstructorReturn(this, (InterruptLongPollCommand.__proto__ || Object.getPrototypeOf(InterruptLongPollCommand)).call(this, CommandConstants_1.default.INTERRUPT_LONG_POLL_COMMAND_NAME));

        _this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
        return _this;
    }

    return InterruptLongPollCommand;
}(SignalCommand_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InterruptLongPollCommand;



},{"./CommandConstants":91,"./SignalCommand":100}],98:[function(_dereq_,module,exports){
"use strict";
/**
 * A transmitter that is not transmitting at all.
 * It may serve as a stand-in when no real transmitter is needed.
 */

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

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoTransmitter;



},{}],99:[function(_dereq_,module,exports){
"use strict";

var DolphinBuilder_1 = _dereq_("./DolphinBuilder");
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
function dolphin(url, reset) {
    var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}
exports.dolphin = dolphin;
// factory method to build an initialized dolphin
function makeDolphin() {
    return new DolphinBuilder_1.default();
}
exports.makeDolphin = makeDolphin;
//Factory methods to have a better integration of ts sources in JS & es6
function createInterruptLongPollCommand() {
    return new InterruptLongPollCommand_1.default();
}
exports.createInterruptLongPollCommand = createInterruptLongPollCommand;
function createStartLongPollCommand() {
    return new StartLongPollCommand_1.default();
}
exports.createStartLongPollCommand = createStartLongPollCommand;



},{"./DolphinBuilder":94,"./InterruptLongPollCommand":97,"./StartLongPollCommand":101}],100:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');

var SignalCommand = function (_Command_1$default) {
    _inherits(SignalCommand, _Command_1$default);

    function SignalCommand(name) {
        _classCallCheck(this, SignalCommand);

        var _this = _possibleConstructorReturn(this, (SignalCommand.__proto__ || Object.getPrototypeOf(SignalCommand)).call(this));

        _this.id = name;
        _this.className = "org.opendolphin.core.comm.SignalCommand";
        return _this;
    }

    return SignalCommand;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignalCommand;



},{"./Command":89}],101:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');
var CommandConstants_1 = _dereq_("./CommandConstants");

var StartLongPollCommand = function (_Command_1$default) {
    _inherits(StartLongPollCommand, _Command_1$default);

    function StartLongPollCommand() {
        _classCallCheck(this, StartLongPollCommand);

        var _this = _possibleConstructorReturn(this, (StartLongPollCommand.__proto__ || Object.getPrototypeOf(StartLongPollCommand)).call(this));

        _this.id = CommandConstants_1.default.START_LONG_POLL_COMMAND_NAME;
        _this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
        return _this;
    }

    return StartLongPollCommand;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StartLongPollCommand;



},{"./Command":89,"./CommandConstants":91}],102:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Command_1 = _dereq_('./Command');

var ValueChangedCommand = function (_Command_1$default) {
    _inherits(ValueChangedCommand, _Command_1$default);

    function ValueChangedCommand(attributeId, newValue) {
        _classCallCheck(this, ValueChangedCommand);

        var _this = _possibleConstructorReturn(this, (ValueChangedCommand.__proto__ || Object.getPrototypeOf(ValueChangedCommand)).call(this));

        _this.attributeId = attributeId;
        _this.newValue = newValue;
        _this.id = "ValueChanged";
        _this.className = "org.opendolphin.core.comm.ValueChangedCommand";
        return _this;
    }

    return ValueChangedCommand;
}(Command_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValueChangedCommand;



},{"./Command":89}],103:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/map":1,"./utils":121,"./utils.js":121}],104:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/map":1,"./constants":115,"./utils":121,"./utils.js":121}],105:[function(_dereq_,module,exports){
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

var _OpenDolphin = _dereq_('./OpenDolphin.js');

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

},{"./OpenDolphin.js":99,"./beanmanager.js":103,"./classrepo.js":104,"./clientcontext.js":106,"./connector.js":114,"./controllermanager.js":116,"./platformHttpTransmitter.js":119,"./utils":121}],106:[function(_dereq_,module,exports){
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

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _commandFactory = _dereq_('./commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

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

},{"../bower_components/core.js/library/fn/promise":2,"./commandFactory":108,"./utils":121,"./utils.js":121,"emitter-component":80}],107:[function(_dereq_,module,exports){
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

},{"./utils.js":121}],108:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createContextCommand = _dereq_('./commands/createContextCommand.js');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./commands/createControllerCommand.js');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./commands/callActionCommand.js');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _destroyControllerCommand = _dereq_('./commands/destroyControllerCommand.js');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _destroyContextCommand = _dereq_('./commands/destroyContextCommand.js');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

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
            return new _createControllerCommand2.default(controllerName, parentControllerId);
        }
    }, {
        key: 'createCallActionCommand',
        value: function createCallActionCommand(controllerid, actionName, params) {
            return new _callActionCommand2.default(controllerid, actionName, params);
        }
    }, {
        key: 'createDestroyControllerCommand',
        value: function createDestroyControllerCommand(controllerId) {
            return new _destroyControllerCommand2.default(controllerId);
        }
    }, {
        key: 'createDestroyContextCommand',
        value: function createDestroyContextCommand() {
            return new _destroyContextCommand2.default();
        }
    }]);

    return CommandFactory;
}();

exports.default = CommandFactory;

},{"./commands/callActionCommand.js":109,"./commands/createContextCommand.js":110,"./commands/createControllerCommand.js":111,"./commands/destroyContextCommand.js":112,"./commands/destroyControllerCommand.js":113}],109:[function(_dereq_,module,exports){
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

},{"../utils":121}],110:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateContextCommand = function CreateContextCommand() {
    _classCallCheck(this, CreateContextCommand);

    (0, _utils.checkMethod)('CreateContextCommand.invoke()');
    this.id = 'CreateContext';
};

exports.default = CreateContextCommand;

},{"../utils":121}],111:[function(_dereq_,module,exports){
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

},{"../utils":121}],112:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyContextCommand = function DestroyContextCommand() {
    _classCallCheck(this, DestroyContextCommand);

    (0, _utils.checkMethod)('DestroyContextCommand()');

    this.id = 'DestroyContext';
};

exports.default = DestroyContextCommand;

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

var _OpenDolphin = _dereq_('./OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ClientModelStore = _dereq_('./ClientModelStore');

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

},{"../bower_components/core.js/library/fn/promise":2,"./ClientModelStore":86,"./OpenDolphin.js":99,"./utils":121,"./utils.js":121}],115:[function(_dereq_,module,exports){
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
                            actionParams.push({ n: param, v: value });
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

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commandFactory.js":108,"./connector.js":114,"./controllerproxy.js":117,"./utils":121}],117:[function(_dereq_,module,exports){
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

},{"./codec.js":107,"./errors.js":118,"./remotingErrorHandler":120,"./utils":121,"emitter-component":80}],120:[function(_dereq_,module,exports){
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

},{}]},{},[105])(105)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1mcm9tLWl0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm1hcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL0F0dHJpYnV0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvQ2xpZW50QXR0cmlidXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL0NsaWVudENvbm5lY3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9DbGllbnREb2xwaGluLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL0NsaWVudE1vZGVsU3RvcmUuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvQ29kZWMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9Db21tYW5kQmF0Y2hlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9Db21tYW5kQ29uc3RhbnRzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvRG9scGhpbkJ1aWxkZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvRXZlbnRCdXMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvSHR0cFRyYW5zbWl0dGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL0ludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9Ob1RyYW5zbWl0dGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL09wZW5Eb2xwaGluLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL1NpZ25hbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvU3RhcnRMb25nUG9sbENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvVmFsdWVDaGFuZ2VkQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9iZWFubWFuYWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jbGFzc3JlcG8uanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY2xpZW50Q29udGV4dEZhY3RvcnkuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY2xpZW50Y29udGV4dC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb2RlYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kRmFjdG9yeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9jYWxsQWN0aW9uQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9jcmVhdGVDb250ZXh0Q29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9jcmVhdGVDb250cm9sbGVyQ29tbWFuZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb21tYW5kcy9kZXN0cm95Q29udGV4dENvbW1hbmQuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29tbWFuZHMvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Nvbm5lY3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9jb25zdGFudHMuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9ib3dlcl9jb21wb25lbnRzL2RvbHBoaW4tcGxhdGZvcm0tanMvZGlzdC9zcmMvY29udHJvbGxlcnByb3h5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3QvYm93ZXJfY29tcG9uZW50cy9kb2xwaGluLXBsYXRmb3JtLWpzL2Rpc3Qvc3JjL2Vycm9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L3NyYy91dGlscy5qcyIsInNyYy9iZWhhdmlvci5qcyIsInNyYy9iaW5kZXIuanMiLCJzcmMvZG9scGhpbi1wb2x5bWVyLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LG1CQUFtQixhQUFuQixHQUFtQyxtQkFBbkMsR0FBeUQsZUFBbkUsQ0FBTjtBQUNIO0FBQ0osQ0FKRDs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTWFwOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXIsIElURVJBVE9SKXtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUsICRjcmVhdGUpe1xuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYXG4gICAgLCBjcmVhdGUgICAgICAgID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBzZWxmICAgPSBJT2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkXG4gICAgICAsIHZhbCwgcmVzO1xuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwpe1xuICB2YXIgQztcbiAgaWYoaXNBcnJheShvcmlnaW5hbCkpe1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSlDID0gdW5kZWZpbmVkO1xuICAgIGlmKGlzT2JqZWN0KEMpKXtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYoQyA9PT0gbnVsbClDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsZW5ndGgpe1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGNyZWF0ZSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgaGlkZSAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGFuSW5zdGFuY2UgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGRlZmluZWQgICAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBzZXRTcGVjaWVzICA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBmYXN0S2V5ICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5XG4gICwgU0laRSAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgJ2ZvckVhY2gnKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKERFU0NSSVBUT1JTKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBmcm9tICAgID0gcmVxdWlyZSgnLi9fYXJyYXktZnJvbS1pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpe1xuICAgIGlmKGNsYXNzb2YodGhpcykgIT0gTkFNRSl0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHJldHVybiBmcm9tKHRoaXMpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBtZXRhICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGZvck9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBhbkluc3RhbmNlICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZFAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgZWFjaCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMClcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSBnbG9iYWxbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGlmKCFERVNDUklQVE9SUyB8fCB0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgIGVhY2goJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzLHRvSlNPTicuc3BsaXQoJywnKSxmdW5jdGlvbihLRVkpe1xuICAgICAgdmFyIElTX0FEREVSID0gS0VZID09ICdhZGQnIHx8IEtFWSA9PSAnc2V0JztcbiAgICAgIGlmKEtFWSBpbiBwcm90byAmJiAhKElTX1dFQUsgJiYgS0VZID09ICdjbGVhcicpKWhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgS0VZKTtcbiAgICAgICAgaWYoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKXJldHVybiBLRVkgPT0gJ2dldCcgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NbS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gSVNfQURERVIgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoJ3NpemUnIGluIHByb3RvKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAsIEJSRUFLICAgICAgID0ge31cbiAgLCBSRVRVUk4gICAgICA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1Ipe1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbigpeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLICA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIE1FVEEgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKVxuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBoYXMgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgc2V0RGVzYyAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaWQgICAgICAgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24oaXQpe1xuICBzZXREZXNjKGl0LCBNRVRBLCB7dmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9fSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKXNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiAgICAgIE1FVEEsXG4gIE5FRUQ6ICAgICBmYWxzZSxcbiAgZmFzdEtleTogIGZhc3RLZXksXG4gIGdldFdlYWs6ICBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZSgnPHNjcmlwdD5kb2N1bWVudC5GPU9iamVjdDwvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59OyIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXtcbiAgICBpZihzYWZlICYmIHRhcmdldFtrZXldKXRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnTWFwJywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXIsIElURVJBVE9SKXtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUsICRjcmVhdGUpe1xuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYXG4gICAgLCBjcmVhdGUgICAgICAgID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBzZWxmICAgPSBJT2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkXG4gICAgICAsIHZhbCwgcmVzO1xuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwpe1xuICB2YXIgQztcbiAgaWYoaXNBcnJheShvcmlnaW5hbCkpe1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSlDID0gdW5kZWZpbmVkO1xuICAgIGlmKGlzT2JqZWN0KEMpKXtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYoQyA9PT0gbnVsbClDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsZW5ndGgpe1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGNyZWF0ZSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBhbkluc3RhbmNlICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBkZWZpbmVkICAgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIGZvck9mICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgc2V0U3BlY2llcyAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgZmFzdEtleSAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleVxuICAsIFNJWkUgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbih0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsICdmb3JFYWNoJyk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBkZWZpbmVkKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXQuX2YpdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICB0aGlzLl90ID0gaXRlcmF0ZWQ7ICAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7IC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgLCBraW5kICA9IHRoYXQuX2tcbiAgICAgICAgLCBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgZnJvbSAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgbWV0YSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJylcbiAgLCBmYWlscyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBmb3JPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgYW5JbnN0YW5jZSAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGRQICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUsICdfYycpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsIEtFWSk7XG4gICAgICAgIGlmKCFJU19BRERFUiAmJiBJU19XRUFLICYmICFpc09iamVjdChhKSlyZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKCdzaXplJyBpbiBwcm90bylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgLCBCUkVBSyAgICAgICA9IHt9XG4gICwgUkVUVVJOICAgICAgPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyAgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUoaGVhZCl7XG4gICAgICBmbiAgID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgaWYoaGVhZClub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZihpc05vZGUpe1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbiAgfSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZVxuICAgICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihmbil7XG4gICAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWR9O1xuICAgIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZighaGVhZCl7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59OyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXtcbiAgICBpZihzYWZlICYmIHRhcmdldFtrZXldKXRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2h0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIlwidXNlIHN0cmljdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpsY3pZdWIySnFaV04wTG5SdkxYTjBjbWx1Wnk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKClcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlICAgICA9ICRQcm9taXNlLnJlc29sdmUoMSlcbiAgICAgICwgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uKGV4ZWMpeyBleGVjKGVtcHR5LCBlbXB0eSk7IH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIGRvbWFpbiAgPSByZWFjdGlvbi5kb21haW5cbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spe1xuICAgICAgICAgICAgaWYocHJvbWlzZS5faCA9PSAyKW9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGhhbmRsZXIgPT09IHRydWUpcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBhYnJ1cHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmKGFicnVwdCl0aHJvdyBhYnJ1cHQuZXJyb3I7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICBpZihwcm9taXNlLl9oID09IDEpcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gICAgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCAgID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gW11cbiAgICAgICAgLCBpbmRleCAgICAgPSAwXG4gICAgICAgICwgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIHZhciAkaW5kZXggICAgICAgID0gaW5kZXgrK1xuICAgICAgICAgICwgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKX0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbmNsYXNzIEF0dHJpYnV0ZSB7XG59XG5BdHRyaWJ1dGUuUVVBTElGSUVSX1BST1BFUlRZID0gXCJxdWFsaWZpZXJcIjtcbkF0dHJpYnV0ZS5WQUxVRSA9IFwidmFsdWVcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEF0dHJpYnV0ZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXR0cmlidXRlLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCBDb21tYW5kXzEgPSByZXF1aXJlKCcuL0NvbW1hbmQnKTtcbmNsYXNzIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCBleHRlbmRzIENvbW1hbmRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuaWQgPSAnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGEnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIjtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgRXZlbnRCdXNfMSA9IHJlcXVpcmUoJy4vRXZlbnRCdXMnKTtcbmNsYXNzIENsaWVudEF0dHJpYnV0ZSB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1c18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHF1YWxpZmllcik7XG4gICAgfVxuICAgIC8qKiBhIGNvcHkgY29uc3RydWN0b3Igd2l0aCBuZXcgaWQgYW5kIG5vIHByZXNlbnRhdGlvbiBtb2RlbCAqL1xuICAgIGNvcHkoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBzZXRQcmVzZW50YXRpb25Nb2RlbChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgYWxlcnQoXCJZb3UgY2FuIG5vdCBzZXQgYSBwcmVzZW50YXRpb24gbW9kZWwgZm9yIGFuIGF0dHJpYnV0ZSB0aGF0IGlzIGFscmVhZHkgYm91bmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwgPSBwcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9XG4gICAgZ2V0UHJlc2VudGF0aW9uTW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH1cbiAgICBnZXRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuICAgIHNldFZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgICAgIHZhciB2ZXJpZmllZFZhbHVlID0gQ2xpZW50QXR0cmlidXRlLmNoZWNrVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSB2ZXJpZmllZFZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmVyaWZpZWRWYWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsdWUsICduZXdWYWx1ZSc6IHZlcmlmaWVkVmFsdWUgfSk7XG4gICAgfVxuICAgIHNldFF1YWxpZmllcihuZXdRdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucXVhbGlmaWVyID09IG5ld1F1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFF1YWxpZmllciA9IHRoaXMucXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllciA9IG5ld1F1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFF1YWxpZmllciwgJ25ld1ZhbHVlJzogbmV3UXVhbGlmaWVyIH0pO1xuICAgIH1cbiAgICBnZXRRdWFsaWZpZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgICB9XG4gICAgc3RhdGljIGNoZWNrVmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBTdHJpbmcgfHwgcmVzdWx0IGluc3RhbmNlb2YgQm9vbGVhbiB8fCByZXN1bHQgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQ2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFuIEF0dHJpYnV0ZSBtYXkgbm90IGl0c2VsZiBjb250YWluIGFuIGF0dHJpYnV0ZSBhcyBhIHZhbHVlLiBBc3N1bWluZyB5b3UgZm9yZ290IHRvIGNhbGwgdmFsdWUuXCIpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5jaGVja1ZhbHVlKHZhbHVlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb2sgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTLmluZGV4T2YodHlwZW9mIHJlc3VsdCkgPiAtMSB8fCByZXN1bHQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0cmlidXRlIHZhbHVlcyBvZiB0aGlzIHR5cGUgYXJlIG5vdCBhbGxvd2VkOiBcIiArIHR5cGVvZiB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgb25WYWx1ZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIGV2ZW50SGFuZGxlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlIH0pO1xuICAgIH1cbiAgICBvblF1YWxpZmllckNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgIH1cbiAgICBzeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTsgLy8gc2VxdWVuY2UgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5DbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbkNsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50ID0gMDtcbmV4cG9ydHMuQ2xpZW50QXR0cmlidXRlID0gQ2xpZW50QXR0cmlidXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGllbnRBdHRyaWJ1dGUuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IENsaWVudFByZXNlbnRhdGlvbk1vZGVsXzEgPSByZXF1aXJlKFwiLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbFwiKTtcbmNvbnN0IENvZGVjXzEgPSByZXF1aXJlKFwiLi9Db2RlY1wiKTtcbmNvbnN0IENvbW1hbmRCYXRjaGVyXzEgPSByZXF1aXJlKFwiLi9Db21tYW5kQmF0Y2hlclwiKTtcbmNsYXNzIENsaWVudENvbm5lY3RvciB7XG4gICAgY29uc3RydWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHNsYWNrTVMgPSAwLCBtYXhCYXRjaFNpemUgPSA1MCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnNsYWNrTVMgPSBzbGFja01TO1xuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3IENvbW1hbmRCYXRjaGVyXzEuQmxpbmRDb21tYW5kQmF0Y2hlcih0cnVlLCBtYXhCYXRjaFNpemUpO1xuICAgIH1cbiAgICBzZXRDb21tYW5kQmF0Y2hlcihuZXdCYXRjaGVyKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXdCYXRjaGVyO1xuICAgIH1cbiAgICBzZXRQdXNoRW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBlbmFibGVkO1xuICAgIH1cbiAgICBzZXRQdXNoTGlzdGVuZXIobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5wdXNoTGlzdGVuZXIgPSBuZXdMaXN0ZW5lcjtcbiAgICB9XG4gICAgc2V0UmVsZWFzZUNvbW1hbmQobmV3Q29tbWFuZCkge1xuICAgICAgICB0aGlzLnJlbGVhc2VDb21tYW5kID0gbmV3Q29tbWFuZDtcbiAgICB9XG4gICAgc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goeyBjb21tYW5kOiBjb21tYW5kLCBoYW5kbGVyOiBvbkZpbmlzaGVkIH0pO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlTZW5kaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTsgLy8gdGhlcmUgaXMgbm90IHBvaW50IGluIHJlbGVhc2luZyBpZiB3ZSBkbyBub3Qgc2VuZCBhdG1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICB9XG4gICAgZG9TZW5kTmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnB1c2hFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnF1ZXVlUHVzaENvbW1hbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSB0cnVlO1xuICAgICAgICB2YXIgY21kc0FuZEhhbmRsZXJzID0gdGhpcy5jb21tYW5kQmF0Y2hlci5iYXRjaCh0aGlzLmNvbW1hbmRRdWV1ZSk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNtZHNBbmRIYW5kbGVyc1tjbWRzQW5kSGFuZGxlcnMubGVuZ3RoIC0gMV0uaGFuZGxlcjtcbiAgICAgICAgdmFyIGNvbW1hbmRzID0gY21kc0FuZEhhbmRsZXJzLm1hcChjYWggPT4geyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnRyYW5zbWl0KGNvbW1hbmRzLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJ2ZXIgcmVzcG9uc2U6IFtcIiArIHJlc3BvbnNlLm1hcChpdCA9PiBpdC5pZCkuam9pbihcIiwgXCIpICsgXCJdIFwiKTtcbiAgICAgICAgICAgIHZhciB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoZWQgPSB0aGlzLmhhbmRsZShjb21tYW5kKTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hlZClcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hlZFBNcy5wdXNoKHRvdWNoZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5vbkZpbmlzaGVkKHRvdWNoZWRQTXMpOyAvLyB0b2RvOiBtYWtlIHRoZW0gdW5pcXVlP1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlIGNhbGw6IGZldGNoIHRoZSBuZXh0IGluIGxpbmUgYnV0IGFsbG93IGEgYml0IG9mIHNsYWNrIHN1Y2ggdGhhdFxuICAgICAgICAgICAgLy8gZG9jdW1lbnQgZXZlbnRzIGNhbiBmaXJlLCByZW5kZXJpbmcgaXMgZG9uZSBhbmQgY29tbWFuZHMgY2FuIGJhdGNoIHVwXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZG9TZW5kTmV4dCgpLCB0aGlzLnNsYWNrTVMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlKGNvbW1hbmQpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgaGFuZGxlLCB1bmtub3duIGNvbW1hbmQgXCIgKyBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cbiAgICBoYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYSBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiICBrbm93biB0byB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5hdHRyaWJ1dGUoYXR0ci5wcm9wZXJ0eU5hbWUsIGF0dHIucXVhbGlmaWVyLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChhdHRyLmlkICYmIGF0dHIuaWQubWF0Y2goXCIuKlMkXCIpKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50QXR0cmlidXRlLmlkID0gYXR0ci5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNsaWVudFBtID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsXzEuQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkLCBzZXJ2ZXJDb21tYW5kLnBtVHlwZSk7XG4gICAgICAgIGNsaWVudFBtLmFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgICAgIGlmIChzZXJ2ZXJDb21tYW5kLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICBjbGllbnRQbS5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQoY2xpZW50UG0pO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4udXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIoY2xpZW50UG0pO1xuICAgICAgICByZXR1cm4gY2xpZW50UG07XG4gICAgfVxuICAgIGhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgdXBkYXRlIHRvIG5ldyB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpID09IHNlcnZlckNvbW1hbmQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJub3RoaW5nIHRvIGRvLiBuZXcgdmFsdWUgPT0gb2xkIHZhbHVlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50QXR0cmlidXRlLnNldFZhbHVlKHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaGFuZGxlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjbGllbnRBdHRyaWJ1dGVbc2VydmVyQ29tbWFuZC5tZXRhZGF0YU5hbWVdID0gc2VydmVyQ29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8gcHVzaCBzdXBwb3J0IC8vLy8vLy8vLy8vLy8vL1xuICAgIGxpc3RlbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnB1c2hFbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy53YWl0aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHB1c2hMaXN0ZW5lciBpcyBzZXQ/XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50bHlTZW5kaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbnF1ZXVlUHVzaENvbW1hbmQoKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHRoaXMud2FpdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVyOiB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKCkgeyBtZS53YWl0aW5nID0gZmFsc2U7IH0sXG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbGVhc2UoKSB7XG4gICAgICAgIGlmICghdGhpcy53YWl0aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyByZWxlYXNlQ29tbWFuZCBpcyBzZXQ/XG4gICAgICAgIHRoaXMudHJhbnNtaXR0ZXIuc2lnbmFsKHRoaXMucmVsZWFzZUNvbW1hbmQpO1xuICAgIH1cbn1cbmV4cG9ydHMuQ2xpZW50Q29ubmVjdG9yID0gQ2xpZW50Q29ubmVjdG9yO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGllbnRDb25uZWN0b3IuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IENsaWVudEF0dHJpYnV0ZV8xID0gcmVxdWlyZShcIi4vQ2xpZW50QXR0cmlidXRlXCIpO1xuY29uc3QgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMSA9IHJlcXVpcmUoXCIuL0NsaWVudFByZXNlbnRhdGlvbk1vZGVsXCIpO1xuY2xhc3MgQ2xpZW50RG9scGhpbiB7XG4gICAgc2V0Q2xpZW50Q29ubmVjdG9yKGNsaWVudENvbm5lY3Rvcikge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3RvciA9IGNsaWVudENvbm5lY3RvcjtcbiAgICB9XG4gICAgZ2V0Q2xpZW50Q29ubmVjdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRDb25uZWN0b3I7XG4gICAgfVxuICAgIHNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpO1xuICAgIH1cbiAgICAvLyBmYWN0b3J5IG1ldGhvZCBmb3IgYXR0cmlidXRlc1xuICAgIGF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGllbnRBdHRyaWJ1dGVfMS5DbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIHByZXNlbnRhdGlvbiBtb2RlbHNcbiAgICBwcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSwgLi4uYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMS5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBtb2RlbC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChtb2RlbCk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9XG4gICAgc2V0Q2xpZW50TW9kZWxTdG9yZShjbGllbnRNb2RlbFN0b3JlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50TW9kZWxTdG9yZSA9IGNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuICAgIGdldENsaWVudE1vZGVsU3RvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgIH1cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkubGlzdFByZXNlbnRhdGlvbk1vZGVscygpO1xuICAgIH1cbiAgICBmaW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICB9XG4gICAgZ2V0QXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgfVxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgIH1cbiAgICBkZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbFRvRGVsZXRlKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUsIHRydWUpO1xuICAgIH1cbiAgICB1cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChzb3VyY2VBdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godGFyZ2V0QXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7IC8vIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8vLy8vIHB1c2ggc3VwcG9ydCAvLy8vLy8vXG4gICAgc3RhcnRQdXNoTGlzdGVuaW5nKHB1c2hDb21tYW5kLCByZWxlYXNlQ29tbWFuZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoTGlzdGVuZXIocHVzaENvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRSZWxlYXNlQ29tbWFuZChyZWxlYXNlQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKHRydWUpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5saXN0ZW4oKTtcbiAgICB9XG4gICAgc3RvcFB1c2hMaXN0ZW5pbmcoKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKGZhbHNlKTtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDbGllbnREb2xwaGluO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGllbnREb2xwaGluLmpzLm1hcFxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vY29yZS1qcy5kLnRzXCIgLz5cblwidXNlIHN0cmljdFwiO1xuY29uc3QgQXR0cmlidXRlXzEgPSByZXF1aXJlKFwiLi9BdHRyaWJ1dGVcIik7XG5jb25zdCBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiKTtcbmNvbnN0IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIpO1xuY29uc3QgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uXzEgPSByZXF1aXJlKFwiLi9EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25cIik7XG5jb25zdCBFdmVudEJ1c18xID0gcmVxdWlyZShcIi4vRXZlbnRCdXNcIik7XG5jb25zdCBWYWx1ZUNoYW5nZWRDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9WYWx1ZUNoYW5nZWRDb21tYW5kXCIpO1xuKGZ1bmN0aW9uIChUeXBlKSB7XG4gICAgVHlwZVtUeXBlW1wiQURERURcIl0gPSAnQURERUQnXSA9IFwiQURERURcIjtcbiAgICBUeXBlW1R5cGVbXCJSRU1PVkVEXCJdID0gJ1JFTU9WRUQnXSA9IFwiUkVNT1ZFRFwiO1xufSkoZXhwb3J0cy5UeXBlIHx8IChleHBvcnRzLlR5cGUgPSB7fSkpO1xudmFyIFR5cGUgPSBleHBvcnRzLlR5cGU7XG5jbGFzcyBDbGllbnRNb2RlbFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihjbGllbnREb2xwaGluKSB7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1c18xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAgZ2V0Q2xpZW50RG9scGhpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50RG9scGhpbjtcbiAgICB9XG4gICAgcmVnaXN0ZXJNb2RlbChtb2RlbCkge1xuICAgICAgICBpZiAobW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29ubmVjdG9yID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpO1xuICAgICAgICB2YXIgY3JlYXRlUE1Db21tYW5kID0gbmV3IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZF8xLmRlZmF1bHQobW9kZWwpO1xuICAgICAgICBjb25uZWN0b3Iuc2VuZChjcmVhdGVQTUNvbW1hbmQsIG51bGwpO1xuICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2hlbmV2ZXIgYW4gYXR0cmlidXRlIGNoYW5nZXMgaXRzIHZhbHVlLCB0aGUgc2VydmVyIG5lZWRzIHRvIGJlIG5vdGlmaWVkXG4gICAgICAgIC8vIGFuZCBhbGwgb3RoZXIgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBhcmUgZ2l2ZW4gdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdmFyIHZhbHVlQ2hhbmdlQ29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kXzEuZGVmYXVsdChhdHRyaWJ1dGUuaWQsIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZCh2YWx1ZUNoYW5nZUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0ciAhPT0gYXR0cmlidXRlICYmIGF0dHIuZ2V0UXVhbGlmaWVyKCkgPT0gYXR0cmlidXRlLmdldFF1YWxpZmllcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXR0ci5zZXRWYWx1ZShhdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhdHRyaWJ1dGUub25RdWFsaWZpZXJDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNoYW5nZUF0dHJNZXRhZGF0YUNtZCA9IG5ldyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRfMS5kZWZhdWx0KGF0dHJpYnV0ZS5pZCwgQXR0cmlidXRlXzEuZGVmYXVsdC5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChjaGFuZ2VBdHRyTWV0YWRhdGFDbWQsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhbHJlYWR5IGlzIGEgUE0gd2l0aCBpZCBcIiArIG1vZGVsLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5zZXQobW9kZWwuaWQsIG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlck1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFR5cGUuQURERUQsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGRlZDtcbiAgICB9XG4gICAgcmVtb3ZlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5kZWxldGUobW9kZWwuaWQpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogVHlwZS5SRU1PVkVELCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIHJlbW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlc0J5RmlsdGVyKGZpbHRlcikge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChhdHRyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgIH1cbiAgICBhZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVzZW50YXRpb25Nb2RlbHMgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzID0gW107XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuc2V0KHR5cGUsIHByZXNlbnRhdGlvbk1vZGVscyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpID4gLTEpKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMucHVzaChtb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5zcGxpY2UocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmRlbGV0ZShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgaXRlciA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmtleXMoKTtcbiAgICAgICAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGl0ZXIgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy52YWx1ZXMoKTtcbiAgICAgICAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgfVxuICAgIGZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSB8fCAhdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmhhcyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH1cbiAgICBkZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCwgbm90aWZ5KSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUobW9kZWwpO1xuICAgICAgICAgICAgaWYgKCFub3RpZnkgfHwgbW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChuZXcgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uXzEuZGVmYXVsdChtb2RlbC5pZCksIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhpZCk7XG4gICAgfVxuICAgIGFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8IHRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuc2V0KGF0dHJpYnV0ZS5pZCwgYXR0cmlidXRlKTtcbiAgICB9XG4gICAgcmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuZGVsZXRlKGF0dHJpYnV0ZS5pZCk7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5nZXQoaWQpO1xuICAgIH1cbiAgICBhZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIWF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5zZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShhdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5kZWxldGUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllciB8fCAhdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmhhcyhxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQocXVhbGlmaWVyKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICB9XG4gICAgb25Nb2RlbFN0b3JlQ2hhbmdlKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgIH1cbiAgICBvbk1vZGVsU3RvcmVDaGFuZ2VGb3JUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KHBtU3RvcmVFdmVudCA9PiB7XG4gICAgICAgICAgICBpZiAocG1TdG9yZUV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9PSBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5DbGllbnRNb2RlbFN0b3JlID0gQ2xpZW50TW9kZWxTdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xpZW50TW9kZWxTdG9yZS5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgRXZlbnRCdXNfMSA9IHJlcXVpcmUoJy4vRXZlbnRCdXMnKTtcbnZhciBwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQgPSAwOyAvLyB0b2RvIGRrOiBjb25zaWRlciBtYWtpbmcgdGhpcyBzdGF0aWMgaW4gY2xhc3NcbmNsYXNzIENsaWVudFByZXNlbnRhdGlvbk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcgJiYgaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZCA9IChwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQrKykudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRCdXMgPSBuZXcgRXZlbnRCdXNfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1c18xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAgLy8gdG9kbyBkazogYWxpZ24gd2l0aCBKYXZhIHZlcnNpb246IG1vdmUgdG8gQ2xpZW50RG9scGhpbiBhbmQgYXV0by1hZGQgdG8gbW9kZWwgc3RvcmVcbiAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIGZvciBhbnl0aGluZyBidXQgSURzLiBQZXIgZGVmYXVsdCwgY29waWVzIGFyZSBjbGllbnQgc2lkZSBvbmx5LCBubyBhdXRvbWF0aWMgdXBkYXRlIGFwcGxpZXMuICovXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChudWxsLCB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHJlc3VsdC5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZUNvcHkgPSBhdHRyaWJ1dGUuY29weSgpO1xuICAgICAgICAgICAgcmVzdWx0LmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGVDb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vYWRkIGFycmF5IG9mIGF0dHJpYnV0ZXNcbiAgICBhZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzIHx8IGF0dHJpYnV0ZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICh0aGlzLmF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHByb3BlcnR5IG5hbWU6IFwiICsgYXR0cmlidXRlLnByb3BlcnR5TmFtZVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSAmJiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHF1YWxpZmllcjogXCIgKyBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKClcbiAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZS5zZXRQcmVzZW50YXRpb25Nb2RlbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQnVzLnRyaWdnZXIoeyBzb3VyY2U6IHRoaXMgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkludmFsaWRhdGVkKGhhbmRsZUludmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzLm9uRXZlbnQoaGFuZGxlSW52YWxpZGF0ZSk7XG4gICAgfVxuICAgIC8qKiByZXR1cm5zIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgc3RhdGUgKi9cbiAgICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNsaWNlKDApO1xuICAgIH1cbiAgICBnZXRBdChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XG4gICAgfVxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5hdHRyaWJ1dGVzW2ldLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5nZXRRdWFsaWZpZXIoKSA9PSBxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlJZChpZCkge1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3luY1dpdGgoc291cmNlUHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKHRhcmdldEF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsLmdldEF0KHRhcmdldEF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsID0gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudFByZXNlbnRhdGlvbk1vZGVsLmpzLm1hcFxuIiwiLyogQ29weXJpZ2h0IDIwMTYgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblxuXG5pbXBvcnQgeyBleGlzdHMgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZWN7XG5cbiAgICBzdGF0aWMgZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwJzogY29tbWFuZC5wbUlkLFxuICAgICAgICAgICAgJ3QnOiBjb21tYW5kLnBtVHlwZSxcbiAgICAgICAgICAgICdhJzogY29tbWFuZC5hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ24nOiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAnaSc6IGF0dHJpYnV0ZS5pZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC52ID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAnaWQnOiAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnaWQnOiAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnLFxuICAgICAgICAgICAgJ2NsYXNzTmFtZSc6IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIixcbiAgICAgICAgICAgICdjbGllbnRTaWRlT25seSc6IGZhbHNlLFxuICAgICAgICAgICAgJ3BtSWQnOiBjb21tYW5kLnAsXG4gICAgICAgICAgICAncG1UeXBlJzogY29tbWFuZC50LFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZXMnOiBjb21tYW5kLmEubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlOYW1lJzogYXR0cmlidXRlLm4sXG4gICAgICAgICAgICAgICAgICAgICdpZCc6IGF0dHJpYnV0ZS5pLFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBleGlzdHMoYXR0cmlidXRlLnYpPyBhdHRyaWJ1dGUudiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICdxdWFsaWZpZXInOiBudWxsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZUlkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChleGlzdHMoY29tbWFuZC5vbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5vID0gY29tbWFuZC5vbGRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhpc3RzKGNvbW1hbmQubmV3VmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHQubiA9IGNvbW1hbmQubmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmlkID0gJ1ZhbHVlQ2hhbmdlZCc7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2lkJzogJ1ZhbHVlQ2hhbmdlZCcsXG4gICAgICAgICAgICAnY2xhc3NOYW1lJzogXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlZhbHVlQ2hhbmdlZENvbW1hbmRcIixcbiAgICAgICAgICAgICdhdHRyaWJ1dGVJZCc6IGNvbW1hbmQuYSxcbiAgICAgICAgICAgICdvbGRWYWx1ZSc6IGV4aXN0cyhjb21tYW5kLm8pPyBjb21tYW5kLm8gOiBudWxsLFxuICAgICAgICAgICAgJ25ld1ZhbHVlJzogZXhpc3RzKGNvbW1hbmQubik/IGNvbW1hbmQubiA6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlKGNvbW1hbmRzKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09ICdWYWx1ZUNoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZSh0cmFuc21pdHRlZCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCkubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc21pdHRlZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBcImRvbHBoaW4tY29yZS1jb21tYW5kXCI7XG4gICAgfVxufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9WYWx1ZUNoYW5nZWRDb21tYW5kJyk7XG4vKiogQSBCYXRjaGVyIHRoYXQgZG9lcyBubyBiYXRjaGluZyBidXQgbWVyZWx5IHRha2VzIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBxdWV1ZSBhcyB0aGUgc2luZ2xlIGl0ZW0gaW4gdGhlIGJhdGNoICovXG5jbGFzcyBOb0NvbW1hbmRCYXRjaGVyIHtcbiAgICBiYXRjaChxdWV1ZSkge1xuICAgICAgICByZXR1cm4gW3F1ZXVlLnNoaWZ0KCldO1xuICAgIH1cbn1cbmV4cG9ydHMuTm9Db21tYW5kQmF0Y2hlciA9IE5vQ29tbWFuZEJhdGNoZXI7XG4vKiogQSBiYXRjaGVyIHRoYXQgYmF0Y2hlcyB0aGUgYmxpbmRzIChjb21tYW5kcyB3aXRoIG5vIGNhbGxiYWNrKSBhbmQgb3B0aW9uYWxseSBhbHNvIGZvbGRzIHZhbHVlIGNoYW5nZXMgKi9cbmNsYXNzIEJsaW5kQ29tbWFuZEJhdGNoZXIge1xuICAgIC8qKiBmb2xkaW5nOiB3aGV0aGVyIHdlIHNob3VsZCB0cnkgZm9sZGluZyBWYWx1ZUNoYW5nZWRDb21tYW5kcyAqL1xuICAgIGNvbnN0cnVjdG9yKGZvbGRpbmcgPSB0cnVlLCBtYXhCYXRjaFNpemUgPSA1MCkge1xuICAgICAgICB0aGlzLmZvbGRpbmcgPSBmb2xkaW5nO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZSA9IG1heEJhdGNoU2l6ZTtcbiAgICB9XG4gICAgYmF0Y2gocXVldWUpIHtcbiAgICAgICAgbGV0IGJhdGNoID0gW107XG4gICAgICAgIGNvbnN0IG4gPSBNYXRoLm1pbihxdWV1ZS5sZW5ndGgsIHRoaXMubWF4QmF0Y2hTaXplKTtcbiAgICAgICAgZm9yIChsZXQgY291bnRlciA9IDA7IGNvdW50ZXIgPCBuOyBjb3VudGVyKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkaW5nICYmIGNhbmRpZGF0ZS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xLmRlZmF1bHQgJiYgKCFjYW5kaWRhdGUuaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5DbWQgPSBjYW5kaWRhdGUuY29tbWFuZDtcbiAgICAgICAgICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCAmJiBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hDbWQgPSBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuQ21kLmF0dHJpYnV0ZUlkID09IGJhdGNoQ21kLmF0dHJpYnV0ZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaENtZC5uZXdWYWx1ZSA9IGNhbkNtZC5uZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTsgLy8gd2UgY2Fubm90IG1lcmdlLCBzbyBiYXRjaCB0aGUgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTsgLy8gd2UgY2Fubm90IG1lcmdlLCBzbyBiYXRjaCB0aGUgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZS5oYW5kbGVyIHx8XG4gICAgICAgICAgICAgICAgKGNhbmRpZGF0ZS5jb21tYW5kWydjbGFzc05hbWUnXSA9PSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRW1wdHlOb3RpZmljYXRpb25cIikgLy8gb3IgdW5rbm93biBjbGllbnQgc2lkZSBlZmZlY3RcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBsZWF2ZSB0aGUgbG9vcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXRjaDtcbiAgICB9XG59XG5leHBvcnRzLkJsaW5kQ29tbWFuZEJhdGNoZXIgPSBCbGluZENvbW1hbmRCYXRjaGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db21tYW5kQmF0Y2hlci5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY2xhc3MgQ29tbWFuZENvbnN0YW50cyB7XG59XG5Db21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG5Db21tYW5kQ29uc3RhbnRzLkNSRUFURV9DT05URVhUX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnaW5pdENsaWVudENvbnRleHQnO1xuQ29tbWFuZENvbnN0YW50cy5ERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkaXNjb25uZWN0Q2xpZW50Q29udGV4dCc7XG5Db21tYW5kQ29uc3RhbnRzLkNSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVnaXN0ZXJDb250cm9sbGVyJztcbkNvbW1hbmRDb25zdGFudHMuREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZGVzdHJveUNvbnRyb2xsZXInO1xuQ29tbWFuZENvbnN0YW50cy5DQUxMX0NPTlRST0xMRVJfQUNUSU9OX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnY2FsbENvbnRyb2xsZXJBY3Rpb24nO1xuQ29tbWFuZENvbnN0YW50cy5TVEFSVF9MT05HX1BPTExfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdsb25nUG9sbCc7XG5Db21tYW5kQ29uc3RhbnRzLklOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdyZWxlYXNlJztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbW1hbmRDb25zdGFudHM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbW1hbmRDb25zdGFudHMuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xuY2xhc3MgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGV4dGVuZHMgQ29tbWFuZF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaWQgPSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCI7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB0aGlzLnBtSWQgPSBwcmVzZW50YXRpb25Nb2RlbC5pZDtcbiAgICAgICAgdGhpcy5wbVR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIGF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogYXR0ci5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IGF0dHIuaWQsXG4gICAgICAgICAgICAgICAgcXVhbGlmaWVyOiBhdHRyLmdldFF1YWxpZmllcigpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyLmdldFZhbHVlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG5jbGFzcyBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gZXh0ZW5kcyBDb21tYW5kXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IocG1JZCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiO1xuICAgIH1cbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCBDbGllbnRDb25uZWN0b3JfMSA9IHJlcXVpcmUoXCIuL0NsaWVudENvbm5lY3RvclwiKTtcbmNvbnN0IENsaWVudERvbHBoaW5fMSA9IHJlcXVpcmUoXCIuL0NsaWVudERvbHBoaW5cIik7XG5jb25zdCBDbGllbnRNb2RlbFN0b3JlXzEgPSByZXF1aXJlKFwiLi9DbGllbnRNb2RlbFN0b3JlXCIpO1xuY29uc3QgSHR0cFRyYW5zbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9IdHRwVHJhbnNtaXR0ZXJcIik7XG5jb25zdCBOb1RyYW5zbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9Ob1RyYW5zbWl0dGVyXCIpO1xuY2xhc3MgRG9scGhpbkJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICB9XG4gICAgdXJsKHVybCkge1xuICAgICAgICB0aGlzLnVybF8gPSB1cmw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXNldChyZXNldCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IHJlc2V0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2xhY2tNUyhzbGFja01TKSB7XG4gICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbWF4QmF0Y2hTaXplKG1heEJhdGNoU2l6ZSkge1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSBtYXhCYXRjaFNpemU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdXBwb3J0Q09SUyhzdXBwb3J0Q09SUykge1xuICAgICAgICB0aGlzLnN1cHBvcnRDT1JTXyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcikge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBoZWFkZXJzSW5mbyhoZWFkZXJzSW5mbykge1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvXyA9IGhlYWRlcnNJbmZvO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbkRvbHBoaW4ganMgZm91bmRcIik7XG4gICAgICAgIHZhciBjbGllbnREb2xwaGluID0gbmV3IENsaWVudERvbHBoaW5fMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciB0cmFuc21pdHRlcjtcbiAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBIdHRwVHJhbnNtaXR0ZXJfMS5kZWZhdWx0KHRoaXMudXJsXywgdGhpcy5yZXNldF8sIFwiVVRGLThcIiwgdGhpcy5lcnJvckhhbmRsZXJfLCB0aGlzLnN1cHBvcnRDT1JTXywgdGhpcy5oZWFkZXJzSW5mb18pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgTm9UcmFuc21pdHRlcl8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudENvbm5lY3RvcihuZXcgQ2xpZW50Q29ubmVjdG9yXzEuQ2xpZW50Q29ubmVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCB0aGlzLnNsYWNrTVNfLCB0aGlzLm1heEJhdGNoU2l6ZV8pKTtcbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRNb2RlbFN0b3JlKG5ldyBDbGllbnRNb2RlbFN0b3JlXzEuQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50RG9scGhpbiBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgfVxufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRG9scGhpbkJ1aWxkZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURvbHBoaW5CdWlsZGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jbGFzcyBFdmVudEJ1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IFtdO1xuICAgIH1cbiAgICBvbkV2ZW50KGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH1cbiAgICB0cmlnZ2VyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5mb3JFYWNoKGhhbmRsZSA9PiBoYW5kbGUoZXZlbnQpKTtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBFdmVudEJ1cztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RXZlbnRCdXMuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IENvZGVjXzEgPSByZXF1aXJlKFwiLi9Db2RlY1wiKTtcbmNsYXNzIEh0dHBUcmFuc21pdHRlciB7XG4gICAgY29uc3RydWN0b3IodXJsLCByZXNldCA9IHRydWUsIGNoYXJzZXQgPSBcIlVURi04XCIsIGVycm9ySGFuZGxlciA9IG51bGwsIHN1cHBvcnRDT1JTID0gZmFsc2UsIGhlYWRlcnNJbmZvID0gbnVsbCkge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5jaGFyc2V0ID0gY2hhcnNldDtcbiAgICAgICAgdGhpcy5IdHRwQ29kZXMgPSB7XG4gICAgICAgICAgICBmaW5pc2hlZDogNCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IDIwMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SUyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gaGVhZGVyc0luZm87XG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLnNpZyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBpZiAodGhpcy5zdXBwb3J0Q09SUykge1xuICAgICAgICAgICAgaWYgKFwid2l0aENyZWRlbnRpYWxzXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7IC8vIE5PVEU6IGRvaW5nIHRoaXMgZm9yIG5vbiBDT1JTIHJlcXVlc3RzIGhhcyBubyBpbXBhY3RcbiAgICAgICAgICAgICAgICB0aGlzLnNpZy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29kZWMgPSBuZXcgQ29kZWNfMS5kZWZhdWx0KCk7XG4gICAgICAgIGlmIChyZXNldCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0h0dHBUcmFuc21pdHRlci5pbnZhbGlkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIENsaWVudERvbHBoaW4ucmVzZXQoT25TdWNjZXNzSGFuZGxlcikgaW5zdGVhZCcpO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLmh0dHAub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5odHRwLnJlYWR5U3RhdGUgPT0gdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5odHRwLnN0YXR1cyA9PSB0aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSB0aGlzLmh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZUNvbW1hbmRzID0gdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiwgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IGVtcHR5IHJlc3BvbnNlVGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5odHRwKTtcbiAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgIH1cbiAgICBzZXRIZWFkZXJzKGh0dHBSZXEpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlcnNJbmZvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGFuZGxlRXJyb3Ioa2luZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgZXJyb3JFdmVudCA9IHsga2luZDoga2luZCwgdXJsOiB0aGlzLnVybCwgaHR0cFN0YXR1czogdGhpcy5odHRwLnN0YXR1cywgbWVzc2FnZTogbWVzc2FnZSB9O1xuICAgICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZDogXCIsIGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNpZ25hbChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuc2lnLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLnNpZyk7XG4gICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgfVxuICAgIC8vIERlcHJlY2F0ZWQgISBVc2UgJ3Jlc2V0KE9uU3VjY2Vzc0hhbmRsZXIpIGluc3RlYWRcbiAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICB0aGlzLmh0dHAub3BlbignUE9TVCcsIHRoaXMudXJsICsgJ2ludmFsaWRhdGU/JywgZmFsc2UpO1xuICAgICAgICB0aGlzLmh0dHAuc2VuZCgpO1xuICAgIH1cbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEh0dHBUcmFuc21pdHRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SHR0cFRyYW5zbWl0dGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCBTaWduYWxDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9TaWduYWxDb21tYW5kXCIpO1xuY29uc3QgQ29tbWFuZENvbnN0YW50c18xID0gcmVxdWlyZShcIi4vQ29tbWFuZENvbnN0YW50c1wiKTtcbmNsYXNzIEludGVycnVwdExvbmdQb2xsQ29tbWFuZCBleHRlbmRzIFNpZ25hbENvbW1hbmRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoQ29tbWFuZENvbnN0YW50c18xLmRlZmF1bHQuSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX05BTUUpO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiY29tLmNhbm9vLmRvbHBoaW4uaW1wbC5jb21tYW5kcy5JbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIjtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBBIHRyYW5zbWl0dGVyIHRoYXQgaXMgbm90IHRyYW5zbWl0dGluZyBhdCBhbGwuXG4gKiBJdCBtYXkgc2VydmUgYXMgYSBzdGFuZC1pbiB3aGVuIG5vIHJlYWwgdHJhbnNtaXR0ZXIgaXMgbmVlZGVkLlxuICovXG5jbGFzcyBOb1RyYW5zbWl0dGVyIHtcbiAgICB0cmFuc21pdChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgc3BlY2lhbFxuICAgICAgICBvbkRvbmUoW10pO1xuICAgIH1cbiAgICBzaWduYWwoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBOb1RyYW5zbWl0dGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob1RyYW5zbWl0dGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCBEb2xwaGluQnVpbGRlcl8xID0gcmVxdWlyZShcIi4vRG9scGhpbkJ1aWxkZXJcIik7XG5jb25zdCBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0ludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbmNvbnN0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9TdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbi8qKlxuICogSlMtZnJpZW5kbHkgZmFjYWRlIHRvIGF2b2lkIHRvbyBtYW55IGRlcGVuZGVuY2llcyBpbiBwbGFpbiBKUyBjb2RlLlxuICogVGhlIG5hbWUgb2YgdGhpcyBmaWxlIGlzIGFsc28gdXNlZCBmb3IgdGhlIGluaXRpYWwgbG9va3VwIG9mIHRoZVxuICogb25lIGphdmFzY3JpcHQgZmlsZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZG9scGhpbiBjb2RlLlxuICogQ2hhbmdpbmcgdGhlIG5hbWUgcmVxdWlyZXMgdGhlIGJ1aWxkIHN1cHBvcnQgYW5kIGFsbCB1c2Vyc1xuICogdG8gYmUgdXBkYXRlZCBhcyB3ZWxsLlxuICogRGllcmsgS29lbmlnXG4gKi9cbi8vIGZhY3RvcnkgbWV0aG9kIGZvciB0aGUgaW5pdGlhbGl6ZWQgZG9scGhpblxuLy8gRGVwcmVjYXRlZCAhIFVzZSAnbWFrZURvbHBoaW4oKSBpbnN0ZWFkXG5mdW5jdGlvbiBkb2xwaGluKHVybCwgcmVzZXQsIHNsYWNrTVMgPSAzMDApIHtcbiAgICByZXR1cm4gbWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChyZXNldCkuc2xhY2tNUyhzbGFja01TKS5idWlsZCgpO1xufVxuZXhwb3J0cy5kb2xwaGluID0gZG9scGhpbjtcbi8vIGZhY3RvcnkgbWV0aG9kIHRvIGJ1aWxkIGFuIGluaXRpYWxpemVkIGRvbHBoaW5cbmZ1bmN0aW9uIG1ha2VEb2xwaGluKCkge1xuICAgIHJldHVybiBuZXcgRG9scGhpbkJ1aWxkZXJfMS5kZWZhdWx0KCk7XG59XG5leHBvcnRzLm1ha2VEb2xwaGluID0gbWFrZURvbHBoaW47XG4vL0ZhY3RvcnkgbWV0aG9kcyB0byBoYXZlIGEgYmV0dGVyIGludGVncmF0aW9uIG9mIHRzIHNvdXJjZXMgaW4gSlMgJiBlczZcbmZ1bmN0aW9uIGNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICByZXR1cm4gbmV3IEludGVycnVwdExvbmdQb2xsQ29tbWFuZF8xLmRlZmF1bHQoKTtcbn1cbmV4cG9ydHMuY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kID0gY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kO1xuZnVuY3Rpb24gY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIG5ldyBTdGFydExvbmdQb2xsQ29tbWFuZF8xLmRlZmF1bHQoKTtcbn1cbmV4cG9ydHMuY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQgPSBjcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3BlbkRvbHBoaW4uanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xuY2xhc3MgU2lnbmFsQ29tbWFuZCBleHRlbmRzIENvbW1hbmRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBuYW1lO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5TaWduYWxDb21tYW5kXCI7XG4gICAgfVxufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2lnbmFsQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2lnbmFsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG5jb25zdCBDb21tYW5kQ29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9Db21tYW5kQ29uc3RhbnRzXCIpO1xuY2xhc3MgU3RhcnRMb25nUG9sbENvbW1hbmQgZXh0ZW5kcyBDb21tYW5kXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBDb21tYW5kQ29uc3RhbnRzXzEuZGVmYXVsdC5TVEFSVF9MT05HX1BPTExfQ09NTUFORF9OQU1FO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiY29tLmNhbm9vLmRvbHBoaW4uaW1wbC5jb21tYW5kcy5TdGFydExvbmdQb2xsQ29tbWFuZFwiO1xuICAgIH1cbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YXJ0TG9uZ1BvbGxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdGFydExvbmdQb2xsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuY29uc3QgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG5jbGFzcyBWYWx1ZUNoYW5nZWRDb21tYW5kIGV4dGVuZHMgQ29tbWFuZF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZUlkLCBuZXdWYWx1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5pZCA9IFwiVmFsdWVDaGFuZ2VkXCI7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlZhbHVlQ2hhbmdlZENvbW1hbmRcIjtcbiAgICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWYWx1ZUNoYW5nZWRDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1WYWx1ZUNoYW5nZWRDb21tYW5kLmpzLm1hcFxuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0ICBNYXAgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVhbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzUmVwb3NpdG9yeSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hbGxBZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBbXTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xuICAgIH1cblxuXG4gICAgaXNNYW5hZ2VkKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmlzTWFuYWdlZChiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uaXNNYW5hZ2VkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBjcmVhdGUodHlwZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuY3JlYXRlKHR5cGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZCh0eXBlLCBiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGRBbGwodHlwZSwgY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVBbGwoY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUlmKHByZWRpY2F0ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlSWYocHJlZGljYXRlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHByZWRpY2F0ZSwgJ3ByZWRpY2F0ZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBvbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0ICBNYXAgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCAqIGFzIGNvbnN0cyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxudmFyIGJsb2NrZWQgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGFzc1JlcG9zaXRvcnkge1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIGZpeFR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CWVRFOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuU0hPUlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5JTlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT05HOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5GTE9BVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPVUJMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CT09MRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiAndHJ1ZScgPT09IFN0cmluZyh2YWx1ZSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNUUklORzpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkVOVU06XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZyb21Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Gcm9tRG9scGhpbi5nZXQoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Ub0RvbHBoaW4uZ2V0KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRMaXN0U3BsaWNlKGNsYXNzUmVwb3NpdG9yeSwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBmcm9tLCB0bywgbmV3RWxlbWVudHMpIHtcbiAgICAgICAgbGV0IGRvbHBoaW4gPSBjbGFzc1JlcG9zaXRvcnkuZG9scGhpbjtcbiAgICAgICAgbGV0IG1vZGVsID0gZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gY2xhc3NSZXBvc2l0b3J5LmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdAQEAgU09VUkNFX1NZU1RFTSBAQEAnLCBudWxsLCAnY2xpZW50JyksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdzb3VyY2UnLCBudWxsLCBtb2RlbElkKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG51bGwsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdmcm9tJywgbnVsbCwgZnJvbSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCd0bycsIG51bGwsIHRvKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2NvdW50JywgbnVsbCwgbmV3RWxlbWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGRvbHBoaW4uYXR0cmlidXRlKGluZGV4LnRvU3RyaW5nKCksIG51bGwsIHNlbGYudG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgZWxlbWVudCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KGRvbHBoaW4sIFtudWxsLCAnQERQOkxTQCddLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZUxpc3QoY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmICghZXhpc3RzKGxpc3QpKSB7XG4gICAgICAgICAgICBjbGFzc1JlcG9zaXRvcnkucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIFtdLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmxvY2soYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNyZWF0ZSBhIGJsb2NrIHdoaWxlIGFub3RoZXIgYmxvY2sgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tlZCA9IHtcbiAgICAgICAgICAgIGJlYW46IGJlYW4sXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbiAgICB9XG5cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICBibG9ja2VkID0gbnVsbDtcbiAgICB9XG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IHRoaXMuZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gYXR0cmlidXRlLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0aGlzLnRvRG9scGhpbih0aGlzLCB0eXBlLCBuZXdWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCB0eXBlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBsZXQgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkgJiYgZXhpc3RzKGFycmF5KSkge1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRFbGVtZW50c0NvdW50ID0gQXJyYXkuaXNBcnJheShyZW1vdmVkRWxlbWVudHMpID8gcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICB0aGlzLnNlbmRMaXN0U3BsaWNlKHRoaXMsIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgaW5kZXgsIGluZGV4ICsgcmVtb3ZlZEVsZW1lbnRzQ291bnQsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJlYW5BZGRlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuUmVtb3ZlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBpZiAodGhpcy5jbGFzc2VzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbGFzc0luZm8gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMDtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIHRoaXMuY2xhc3Nlc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIH1cblxuICAgIGxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHZhciBiZWFuID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBiZWFuW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5vbGRWYWx1ZSAhPT0gZXZlbnQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4sIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluLnNldChtb2RlbC5pZCwgYmVhbik7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3Muc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgdW5sb2FkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpblsnZGVsZXRlJ10oYmVhbik7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgc3BsaWNlTGlzdEVudHJ5KG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnYXR0cmlidXRlJyk7XG4gICAgICAgIGxldCBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgICAgIGxldCB0byA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgndG8nKTtcbiAgICAgICAgbGV0IGNvdW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdjb3VudCcpO1xuXG4gICAgICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc0luZm9zLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgdmFyIGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgICAgICAvL3ZhciBlbnRyeSA9IGZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50LnZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaCh0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUsIGZyb20udmFsdWUsIHRvLnZhbHVlIC0gZnJvbS52YWx1ZSwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWQuIFNvdXJjZSBiZWFuIHVua25vd24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBQYXJhbVRvRG9scGhpbihwYXJhbSkge1xuICAgICAgICBpZiAoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZiBwYXJhbTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQocGFyYW0pO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGNhbiBiZSB1c2VkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgYW5kIHByaW1pdGl2ZSB0eXBlcyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG5cbiAgICBtYXBEb2xwaGluVG9CZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNvbnN0cy5ET0xQSElOX0JFQU4sIHZhbHVlKTtcbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cbi8qIGdsb2JhbCBleHBvcnRzICovXG5cInVzZSBzdHJpY3RcIjtcbmltcG9ydCBPcGVuRG9scGhpbiBmcm9tICcuL09wZW5Eb2xwaGluLmpzJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IEJlYW5NYW5hZ2VyIGZyb20gJy4vYmVhbm1hbmFnZXIuanMnO1xuaW1wb3J0IENsYXNzUmVwb3NpdG9yeSBmcm9tICcuL2NsYXNzcmVwby5qcyc7XG5pbXBvcnQgQ29udHJvbGxlck1hbmFnZXIgZnJvbSAnLi9jb250cm9sbGVybWFuYWdlci5qcyc7XG5pbXBvcnQgQ2xpZW50Q29udGV4dCBmcm9tICcuL2NsaWVudGNvbnRleHQuanMnO1xuaW1wb3J0IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250ZXh0RmFjdG9yeXtcblxuICAgIGNyZWF0ZSh1cmwsIGNvbmZpZyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdjb25uZWN0KHVybCwgY29uZmlnKScpO1xuICAgICAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnQ3JlYXRpbmcgY2xpZW50IGNvbnRleHQgJysgdXJsICsnICAgICcrIEpTT04uc3RyaW5naWZ5KGNvbmZpZykpO1xuXG4gICAgICAgIGxldCBidWlsZGVyID0gT3BlbkRvbHBoaW4ubWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChmYWxzZSkuc2xhY2tNUyg0KS5zdXBwb3J0Q09SUyh0cnVlKS5tYXhCYXRjaFNpemUoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpO1xuICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZykpIHtcbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmVycm9ySGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmVycm9ySGFuZGxlcihjb25maWcuZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmhlYWRlcnNJbmZvKSAmJiBPYmplY3Qua2V5cyhjb25maWcuaGVhZGVyc0luZm8pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmhlYWRlcnNJbmZvKGNvbmZpZy5oZWFkZXJzSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZG9scGhpbiA9IGJ1aWxkZXIuYnVpbGQoKTtcblxuICAgICAgICB2YXIgdHJhbnNtaXR0ZXIgPSBuZXcgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIodXJsLCBjb25maWcpO1xuICAgICAgICB0cmFuc21pdHRlci5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNsaWVudENvbnRleHQuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2xwaGluLmNsaWVudENvbm5lY3Rvci50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuXG4gICAgICAgIHZhciBjbGFzc1JlcG9zaXRvcnkgPSBuZXcgQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pO1xuICAgICAgICB2YXIgYmVhbk1hbmFnZXIgPSBuZXcgQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KTtcbiAgICAgICAgdmFyIGNvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyk7XG4gICAgICAgIHZhciBjb250cm9sbGVyTWFuYWdlciA9IG5ldyBDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcik7XG5cbiAgICAgICAgdmFyIGNsaWVudENvbnRleHQgPSBuZXcgQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcik7XG4gICAgICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xuICAgIH1cbn1cblxuZXhwb3J0cy5DbGllbnRDb250ZXh0RmFjdG9yeSA9IENsaWVudENvbnRleHRGYWN0b3J5O1xuXG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRGYWN0b3J5JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuTWFuYWdlciwgJ2JlYW5NYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5jb25uZWN0KCk7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KCl7XG4gICAgICAgIGlmKGV4aXN0cyh0aGlzLmNvbm5lY3Rpb25Qcm9taXNlKSl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmJlYW5NYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKENsaWVudENvbnRleHQucHJvdG90eXBlKTsiLCIvKiBDb3B5cmlnaHQgMjAxNiBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlY3tcblxuICAgIHN0YXRpYyBlbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AnOiBjb21tYW5kLnBtSWQsXG4gICAgICAgICAgICAndCc6IGNvbW1hbmQucG1UeXBlLFxuICAgICAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAnbic6IGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdpJzogYXR0cmlidXRlLmlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnYgPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcsXG4gICAgICAgICAgICAnY2xhc3NOYW1lJzogXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2NsaWVudFNpZGVPbmx5JzogZmFsc2UsXG4gICAgICAgICAgICAncG1JZCc6IGNvbW1hbmQucCxcbiAgICAgICAgICAgICdwbVR5cGUnOiBjb21tYW5kLnQsXG4gICAgICAgICAgICAnYXR0cmlidXRlcyc6IGNvbW1hbmQuYS5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eU5hbWUnOiBhdHRyaWJ1dGUubixcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogYXR0cmlidXRlLmksXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGUudik/IGF0dHJpYnV0ZS52IDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgJ3F1YWxpZmllcic6IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICAnYSc6IGNvbW1hbmQuYXR0cmlidXRlSWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm9sZFZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm8gPSBjb21tYW5kLm9sZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleGlzdHMoY29tbWFuZC5uZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5uID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuaWQgPSAnVmFsdWVDaGFuZ2VkJztcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnaWQnOiAnVmFsdWVDaGFuZ2VkJyxcbiAgICAgICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZUlkJzogY29tbWFuZC5hLFxuICAgICAgICAgICAgJ29sZFZhbHVlJzogZXhpc3RzKGNvbW1hbmQubyk/IGNvbW1hbmQubyA6IG51bGwsXG4gICAgICAgICAgICAnbmV3VmFsdWUnOiBleGlzdHMoY29tbWFuZC5uKT8gY29tbWFuZC5uIDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBlbmNvZGUoY29tbWFuZHMpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMubWFwKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKS5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSAnVmFsdWVDaGFuZ2VkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IENyZWF0ZUNvbnRleHRDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvY3JlYXRlQ29udGV4dENvbW1hbmQuanMnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMnO1xuaW1wb3J0IENhbGxBY3Rpb25Db21tYW5kIGZyb20gJy4vY29tbWFuZHMvY2FsbEFjdGlvbkNvbW1hbmQuanMnO1xuaW1wb3J0IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCBmcm9tICcuL2NvbW1hbmRzL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZC5qcyc7XG5pbXBvcnQgRGVzdHJveUNvbnRleHRDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvZGVzdHJveUNvbnRleHRDb21tYW5kLmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kRmFjdG9yeSB7XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udGV4dENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDYWxsQWN0aW9uQ29tbWFuZChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3IENhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJJZCkge1xuICAgICAgICByZXR1cm4gbmV3IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVzdHJveUNvbnRleHRDb21tYW5kKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGxBY3Rpb25Db21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbnZva2UoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcmlkLCAnY29udHJvbGxlcmlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICB0aGlzLmlkID0gJ0NhbGxBY3Rpb24nO1xuICAgICAgICB0aGlzLmMgPSBjb250cm9sbGVyaWQ7XG4gICAgICAgIHRoaXMubiA9IGFjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMucCA9IHBhcmFtcztcbiAgICB9XG5cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUNvbnRleHRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udGV4dENvbW1hbmQuaW52b2tlKCknKTtcbiAgICAgICAgdGhpcy5pZCA9ICdDcmVhdGVDb250ZXh0JztcbiAgICB9XG5cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQuaW52b2tlKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck5hbWUsICdjb250cm9sbGVyTmFtZScpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnQ3JlYXRlQ29udHJvbGxlcic7XG4gICAgICAgIHRoaXMubiA9IGNvbnRyb2xsZXJOYW1lO1xuICAgICAgICB0aGlzLnAgPSBwYXJlbnRDb250cm9sbGVySWQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95Q29udGV4dENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdEZXN0cm95Q29udGV4dENvbW1hbmQoKScpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnRGVzdHJveUNvbnRleHQnO1xuICAgIH1cblxufSIsImltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlcklkKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnRGVzdHJveUNvbnRyb2xsZXInO1xuICAgICAgICB0aGlzLmMgPSBjb250cm9sbGVySWQ7XG4gICAgfVxuXG59IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IE9wZW5Eb2xwaGluIGZyb20gJy4vT3BlbkRvbHBoaW4uanMnO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCBDbGllbnRNb2RlbFN0b3JlIGZyb20gJy4vQ2xpZW50TW9kZWxTdG9yZSc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IERPTFBISU5fQkVBTiA9ICdAQEAgRE9MUEhJTl9CRUFOIEBAQCc7XG5jb25zdCBBQ1RJT05fQ0FMTF9CRUFOID0gJ0BAQCBDT05UUk9MTEVSX0FDVElPTl9DQUxMX0JFQU4gQEBAJztcbmNvbnN0IEhJR0hMQU5ERVJfQkVBTiA9ICdAQEAgSElHSExBTkRFUl9CRUFOIEBAQCc7XG5jb25zdCBET0xQSElOX0xJU1RfU1BMSUNFID0gJ0BEUDpMU0AnO1xuY29uc3QgU09VUkNFX1NZU1RFTSA9ICdAQEAgU09VUkNFX1NZU1RFTSBAQEAnO1xuY29uc3QgU09VUkNFX1NZU1RFTV9DTElFTlQgPSAnY2xpZW50JztcbmNvbnN0IFNPVVJDRV9TWVNURU1fU0VSVkVSID0gJ3NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3RvcntcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKScpO1xuICAgICAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUmVzb2x2ZXIgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICBzZWxmLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkub25Nb2RlbFN0b3JlQ2hhbmdlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gZXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgICAgICBsZXQgc291cmNlU3lzdGVtID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKFNPVVJDRV9TWVNURU0pO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhzb3VyY2VTeXN0ZW0pICYmIHNvdXJjZVN5c3RlbS52YWx1ZSA9PT0gU09VUkNFX1NZU1RFTV9TRVJWRVIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBDbGllbnRNb2RlbFN0b3JlLlR5cGUuQURERUQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBDbGllbnRNb2RlbFN0b3JlLlR5cGUuUkVNT1ZFRCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxSZW1vdmVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5kb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhPcGVuRG9scGhpbi5jcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpLCBPcGVuRG9scGhpbi5jcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSk7XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIG9uTW9kZWxBZGRlZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxBZGRlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBBQ1RJT05fQ0FMTF9CRUFOOlxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhJR0hMQU5ERVJfQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NQTElDRTpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb2RlbFJlbW92ZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsUmVtb3ZlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5pbnZva2UoY29tbWFuZCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCAnY29tbWFuZCcpO1xuXG4gICAgICAgIHZhciBkb2xwaGluID0gdGhpcy5kb2xwaGluO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGRvbHBoaW4uc2VuZChjb21tYW5kLCB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEhpZ2hsYW5kZXJQTSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGxhbmRlclBNUHJvbWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydHMuU09VUkNFX1NZU1RFTSA9IFNPVVJDRV9TWVNURU07XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fQ0xJRU5UID0gU09VUkNFX1NZU1RFTV9DTElFTlQ7XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fU0VSVkVSID0gU09VUkNFX1NZU1RFTV9TRVJWRVI7XG5leHBvcnRzLkFDVElPTl9DQUxMX0JFQU4gPSBBQ1RJT05fQ0FMTF9CRUFOO1xuIiwiZXhwb3J0IGNvbnN0IERPTFBISU5fQkVBTiA9IDA7XG5leHBvcnQgY29uc3QgQllURSA9IDE7XG5leHBvcnQgY29uc3QgU0hPUlQgPSAyO1xuZXhwb3J0IGNvbnN0IElOVCA9IDM7XG5leHBvcnQgY29uc3QgTE9ORyA9IDQ7XG5leHBvcnQgY29uc3QgRkxPQVQgPSA1O1xuZXhwb3J0IGNvbnN0IERPVUJMRSA9IDY7XG5leHBvcnQgY29uc3QgQk9PTEVBTiA9IDc7XG5leHBvcnQgY29uc3QgU1RSSU5HID0gODtcbmV4cG9ydCBjb25zdCBEQVRFID0gOTtcbmV4cG9ydCBjb25zdCBFTlVNID0gMTA7XG5leHBvcnQgY29uc3QgQ0FMRU5EQVIgPSAxMTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX0ZJRUxEX1RZUEUgPSA1NTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDUyO1xuZXhwb3J0IGNvbnN0IFpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFID0gNTQ7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgU2V0IGZyb20nLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IENvbnRyb2xsZXJQcm94eSBmcm9tICcuL2NvbnRyb2xsZXJwcm94eS5qcyc7XG5cbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRGYWN0b3J5LmpzJztcblxuXG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IHsgU09VUkNFX1NZU1RFTV9DTElFTlQgfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBBQ1RJT05fQ0FMTF9CRUFOIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuXG5jb25zdCBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG5jb25zdCBNT0RFTCA9ICdtb2RlbCc7XG5jb25zdCBFUlJPUl9DT0RFID0gJ2Vycm9yQ29kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVDb250cm9sbGVyKG5hbWUsIG51bGwpXG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBjb250cm9sbGVySWQsIG1vZGVsSWQsIG1vZGVsLCBjb250cm9sbGVyO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcklkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbElkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShNT0RFTCkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5hZGQoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5pbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShTT1VSQ0VfU1lTVEVNLCBudWxsLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCksXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShFUlJPUl9DT0RFKVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgbGV0IHBtID0gc2VsZi5kb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KHNlbGYuZG9scGhpbiwgW251bGwsIEFDVElPTl9DQUxMX0JFQU5dLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpb25QYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGlmKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBQYXJhbVRvRG9scGhpbihwYXJhbXNbcGFyYW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblBhcmFtcy5wdXNoKHtuOiBwYXJhbSwgdjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgYWN0aW9uUGFyYW1zKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGlzRXJyb3IgPSBwbS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoRVJST1JfQ09ERSkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiU2VydmVyIHNpZGUgQ29udHJvbGxlckFjdGlvbiBcIiArIGFjdGlvbk5hbWUgKyBcIiBjYXVzZWQgYW4gZXJyb3IuIFBsZWFzZSBzZWUgc2VydmVyIGxvZyBmb3IgZGV0YWlscy5cIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXIsICdjb250cm9sbGVyJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuc2V0VmFsdWUoY29udHJvbGxlci5jb250cm9sbGVySWQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlci5nZXRJZCgpKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goY29udHJvbGxlci5kZXN0cm95KCkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgU2V0IGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJQcm94eXtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1hbmFnZXIsICdtYW5hZ2VyJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGdldE1vZGVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcklkO1xuICAgIH1cblxuICAgIGludm9rZShuYW1lLCBwYXJhbXMpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lmludm9rZShuYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5pbnZva2VBY3Rpb24odGhpcy5jb250cm9sbGVySWQsIG5hbWUsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgdGhpcy5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCl7XG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uRGVzdHJveWVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuZGVzdHJveUNvbnRyb2xsZXIodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ZWQoaGFuZGxlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkub25EZXN0cm95ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbkRlc3Ryb3llZEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRG9scGhpblJlbW90aW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnUmVtb3RpbmcgRXJyb3InLCBkZXRhaWwpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmRldGFpbCA9IGRldGFpbCB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbHBoaW5TZXNzaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnU2Vzc2lvbiBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cFJlc3BvbnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBSZXNwb25zZSBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ0h0dHAgTmV0d29yayBFcnJvcicpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE2IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5cblxuaW1wb3J0IHsgZXhpc3RzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEb2xwaGluUmVtb3RpbmdFcnJvciwgSHR0cE5ldHdvcmtFcnJvciwgRG9scGhpblNlc3Npb25FcnJvciwgSHR0cFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL2Vycm9ycy5qcyc7XG5pbXBvcnQgQ29kZWMgZnJvbSAnLi9jb2RlYy5qcyc7XG5pbXBvcnQgUmVtb3RpbmdFcnJvckhhbmRsZXIgZnJvbSAnLi9yZW1vdGluZ0Vycm9ySGFuZGxlcic7XG5cblxuY29uc3QgRklOSVNIRUQgPSA0O1xuY29uc3QgU1VDQ0VTUyA9IDIwMDtcbmNvbnN0IFJFUVVFU1RfVElNRU9VVCA9IDQwODtcblxuY29uc3QgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbmNvbnN0IENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZG9scGhpbkNsaWVudElkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IodXJsLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gZXhpc3RzKGNvbmZpZykgPyBjb25maWcuaGVhZGVyc0luZm8gOiBudWxsO1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICB0aGlzLm1heFJldHJ5ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5KT9jb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5OiAzO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcudGltZW91dCk/Y29ubmVjdGlvbkNvbmZpZy50aW1lb3V0OiA1MDAwO1xuICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICB9XG5cbiAgICBfaGFuZGxlRXJyb3IocmVqZWN0LCBlcnJvcikge1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyh0aGlzLmNvbmZpZykgPyB0aGlzLmNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgbGV0IGVycm9ySGFuZGxlcnMgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVycyk/Y29ubmVjdGlvbkNvbmZpZy5lcnJvckhhbmRsZXJzOiBbbmV3IFJlbW90aW5nRXJyb3JIYW5kbGVyKCldO1xuICAgICAgICBlcnJvckhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlci5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgX3NlbmQoY29tbWFuZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIGh0dHAub25lcnJvciA9IChlcnJvckNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwTmV0d29ya0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogTmV0d29yayBlcnJvcicsIGVycm9yQ29udGVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cC5yZWFkeVN0YXRlID09PSBGSU5JU0hFRCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaHR0cC5zdGF0dXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBTVUNDRVNTOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGllbnRJZCA9IGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoY3VycmVudENsaWVudElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpICYmIHRoaXMuY2xpZW50SWQgIT09IGN1cnJlbnRDbGllbnRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IENsaWVudElkIG9mIHRoZSByZXNwb25zZSBkaWQgbm90IG1hdGNoJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjdXJyZW50Q2xpZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlcnZlciBkaWQgbm90IHNlbmQgYSBjbGllbnRJZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVRVUVTVF9USU1FT1VUOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXNzaW9uIFRpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mYWlsZWRfYXR0ZW1wdCA8PSB0aGlzLm1heFJldHJ5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IHRoaXMuZmFpbGVkX2F0dGVtcHQgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwUmVzcG9uc2VFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMCAoJyArIGh0dHAuc3RhdHVzICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpKSB7XG4gICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FLCB0aGlzLmNsaWVudElkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmhlYWRlcnNJbmZvKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmFpbGVkX2F0dGVtcHQgPiB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cC5zZW5kKENvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBodHRwLnNlbmQoQ29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLl9zZW5kKGNvbW1hbmRzKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2VUZXh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUNvbW1hbmRzID0gQ29kZWMuZGVjb2RlKHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBEb2xwaGluUmVtb3RpbmdFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFBhcnNlIGVycm9yOiAoSW5jb3JyZWN0IHJlc3BvbnNlID0gJyArIHJlc3BvbnNlVGV4dCArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBFbXB0eSByZXNwb25zZScpKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaWduYWwoY29tbWFuZCkge1xuICAgICAgICB0aGlzLl9zZW5kKFtjb21tYW5kXSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpKTtcbiAgICB9XG59XG5cbkVtaXR0ZXIoUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlKTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RpbmdFcnJvckhhbmRsZXIge1xuXG4gICAgb25FcnJvcihlcnJvcikge1xuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG59IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hlY2tNZXRob2ROYW1lO1xuXG52YXIgZXhpc3RzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2ROYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNoZWNrUGFyYW0gPSBmdW5jdGlvbihwYXJhbSwgcGFyYW1ldGVyTmFtZSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgJyArIHBhcmFtZXRlck5hbWUgKyAnIGlzIG1hbmRhdG9yeSBpbiAnICsgY2hlY2tNZXRob2ROYW1lKTtcbiAgICB9XG59O1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBQb2x5bWVyLCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEJpbmRlciA9IHJlcXVpcmUoJy4vYmluZGVyLmpzJykuQmluZGVyO1xuXG5cbmZ1bmN0aW9uIGV4aXN0cyhvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0ICE9PSBudWxsO1xufVxuXG5cbnZhciBhcnJheUtleUJ1ZztcbmZ1bmN0aW9uIHBvbHltZXIxXzFoYWNrKGVsZW1lbnQsIHBhdGgpIHtcbiAgICAvLyBUaGlzIGlzIGEgdGVtcG9yYXJ5IGhhY2sgdG8gZGVhbCB3aXRoIFBvbHltZXIncyBBUEkgY29uc2lzdGVuY3kgY29uY2VybmluZyBhcnJheXMgYW5kIHBhdGhzLlxuICAgIC8vIEFuIG9ic2VydmVyIHVzZXMga2V5cyBpbiBhbiBhcnJheSwgd2hpbGUgdGhlIGdldCgpIGFuZCBzZXQoKSBtZXRob2RzIGV4cGVjdCB0aGUgaW5kZXguXG4gICAgLy8gVGhpcyBpcyBob3BlZnVsbHkgZml4ZWQgaW4gUG9seW1lciAxLjIuXG4gICAgZG8ge1xuICAgICAgICB2YXIgcGF0aEVsZW1lbnRzID0gcGF0aC5tYXRjaCgvXihbXlxcLl0rKVxcLiguKikkLyk7XG4gICAgICAgIHZhciBrZXkgPSBwYXRoRWxlbWVudHMgIT09IG51bGw/IHBhdGhFbGVtZW50c1sxXSA6IHBhdGg7XG4gICAgICAgIHBhdGggPSBwYXRoRWxlbWVudHMgIT09IG51bGw/IHBhdGhFbGVtZW50c1syXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHZhciBhcnJheUtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgICAgICAgICBpZiAoaXNOYU4oYXJyYXlLZXkpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRba2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBQb2x5bWVyLkNvbGxlY3Rpb24uZ2V0KGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBjb2xsZWN0aW9uLmdldEl0ZW0oYXJyYXlLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRba2V5XTtcbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKHBhdGggIT09IG51bGwgJiYgZXhpc3RzKGVsZW1lbnQpKTtcblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuZnVuY3Rpb24gbmF2aWdhdGVUb0JlYW4oZWxlbWVudCwgcGF0aCkge1xuICAgIHZhciBuYXZpZ2F0aW9uID0gcGF0aC5tYXRjaCgvXiguKilcXC5bXlxcLl0qJC8pO1xuICAgIGlmICghIGV4aXN0cyhuYXZpZ2F0aW9uKSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWV4aXN0cyhhcnJheUtleUJ1ZykpIHtcbiAgICAgICAgICAgIGFycmF5S2V5QnVnID0gdHlwZW9mIFBvbHltZXIudmVyc2lvbiAhPT0gJ3N0cmluZycgfHwgKFBvbHltZXIudmVyc2lvbi5tYXRjaCgvXjFcXC5bMDFdXFwuLykgIT09IG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheUtleUJ1Zz8gcG9seW1lcjFfMWhhY2soZWxlbWVudCwgbmF2aWdhdGlvblsxXSkgOiBlbGVtZW50LmdldChuYXZpZ2F0aW9uWzFdLCBlbGVtZW50KTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gc2V0dXBDcmVhdGVCZWhhdmlvcihjbGllbnRDb250ZXh0KSB7XG5cbiAgICB2YXIgYmluZGVyID0gbmV3IEJpbmRlcihjbGllbnRDb250ZXh0LmJlYW5NYW5hZ2VyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sbGVyTmFtZSkge1xuICAgICAgICB2YXIgc3RhdGUgPSAnSU5JVElBTElaSU5HJztcbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4ge307IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvYnNlcnZlcnM6IFsnX2RvbHBoaW5PYnNlcnZlcihtb2RlbC4qKSddLFxuXG4gICAgICAgICAgICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY2xpZW50Q29udGV4dC5jcmVhdGVDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lKS50aGVuKGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gJ1JFQURZJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXQoJ21vZGVsJywgY29udHJvbGxlci5tb2RlbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maXJlKCdjb250cm9sbGVyLXJlYWR5Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5vbkRlc3Ryb3llZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlID0gJ0RFU1RST1lFRCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgnbW9kZWwnLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmlyZSgnY29udHJvbGxlci1kZXN0cm95ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbnZva2U6IGZ1bmN0aW9uKGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gQ2FsbCB0aGlzIGFmdGVyIGluaXQgaGFzIGZpbmlzaGVkXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSAnUkVBRFknKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29udHJvbGxlci5pbnZva2UoKSBjYWxsZWQgYmVmb3JlIGluaXQoKSBmaW5pc2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyLmludm9rZShhY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBfZG9scGhpbk9ic2VydmVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gJ1JFQURZJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gZXZlbnQucGF0aDtcbiAgICAgICAgICAgICAgICB2YXIgYmVhbiwgcHJvcGVydHlOYW1lLCBpLCBqO1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGV2ZW50LnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhuZXdWYWx1ZSkgJiYgZXhpc3RzKG5ld1ZhbHVlLmluZGV4U3BsaWNlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gXCIuc3BsaWNlc1wiLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJlYW4gPSBuYXZpZ2F0ZVRvQmVhbih0aGlzLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcGF0aC5tYXRjaCgvW15cXC5dKyQvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gbmV3VmFsdWUuaW5kZXhTcGxpY2VzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhbmdlID0gbmV3VmFsdWUuaW5kZXhTcGxpY2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudENvbnRleHQuYmVhbk1hbmFnZXIubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lWzBdLCBjaGFuZ2UuaW5kZXgsIGNoYW5nZS5hZGRlZENvdW50LCBjaGFuZ2UucmVtb3ZlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZVswXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNoYW5nZS5yZW1vdmVkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci51bmJpbmQodGhpcywgcGF0aCArICcuJyArIChjaGFuZ2UuaW5kZXggKyBqKSwgY2hhbmdlLnJlbW92ZWRbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBjaGFuZ2UuaW5kZXggKyBjaGFuZ2UuYWRkZWRDb3VudDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRQb3MgPSBqIC0gY2hhbmdlLmFkZGVkQ291bnQgKyBjaGFuZ2UucmVtb3ZlZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci51bmJpbmQodGhpcywgcGF0aCArICcuJyArIG9sZFBvcywgYXJyYXlbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBjaGFuZ2UuaW5kZXg7IGogPCBhcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kZXIuYmluZCh0aGlzLCBwYXRoICsgJy4nICsgaiwgYXJyYXlbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJlYW4gPSBuYXZpZ2F0ZVRvQmVhbih0aGlzLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSAmJiAhQXJyYXkuaXNBcnJheShiZWFuKSAmJiAhQXJyYXkuaXNBcnJheShuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHBhdGgubWF0Y2goL1teXFwuXSskLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBjbGllbnRDb250ZXh0LmJlYW5NYW5hZ2VyLm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lWzBdLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG9sZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRlci51bmJpbmQodGhpcywgcGF0aCwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kZXIuYmluZCh0aGlzLCBwYXRoLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuXG5cbmV4cG9ydHMuc2V0dXBDcmVhdGVCZWhhdmlvciA9IHNldHVwQ3JlYXRlQmVoYXZpb3I7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgTWFwICA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCcpO1xuXG5cblxuZnVuY3Rpb24gZXhpc3RzKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGJpbmRTY29wZShzY29wZSwgZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkZWVwRXF1YWwoYXJyYXkxLCBhcnJheTIpIHtcbiAgICBpZiAoYXJyYXkxID09PSBhcnJheTIgfHwgKCFleGlzdHMoYXJyYXkxKSAmJiAhZXhpc3RzKGFycmF5MikpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoZXhpc3RzKGFycmF5MSkgIT09IGV4aXN0cyhhcnJheTIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG4gPSBhcnJheTEubGVuZ3RoO1xuICAgIGlmIChhcnJheTIubGVuZ3RoICE9PSBuKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaWYgKGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuZnVuY3Rpb24gQmluZGVyKGJlYW5NYW5hZ2VyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5cbiAgICBiZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUoYmluZFNjb3BlKHRoaXMsIHRoaXMub25CZWFuVXBkYXRlSGFuZGxlcikpO1xuICAgIGJlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUoYmluZFNjb3BlKHRoaXMsIHRoaXMub25BcnJheVVwZGF0ZUhhbmRsZXIpKTtcbn1cblxuXG5CaW5kZXIucHJvdG90eXBlLm9uQmVhblVwZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgIGlmIChvbGRWYWx1ZSA9PT0gbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGJlYW4pO1xuICAgIGlmIChleGlzdHMobGlzdGVuZXJMaXN0KSAmJiBsaXN0ZW5lckxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgZW50cnkgPSBsaXN0ZW5lckxpc3RbMF07XG4gICAgICAgIHZhciBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgICAgdmFyIHBhdGggPSBlbnRyeS5yb290UGF0aCArICcuJyArIHByb3BlcnR5TmFtZTtcbiAgICAgICAgZWxlbWVudC5zZXQocGF0aCwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJlYW5bcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbn07XG5cblxuQmluZGVyLnByb3RvdHlwZS5vbkFycmF5VXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cykge1xuICAgIHZhciBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICB2YXIgb2xkRWxlbWVudHMgPSBhcnJheS5zbGljZShpbmRleCwgaW5kZXggKyBjb3VudCk7XG4gICAgaWYgKGRlZXBFcXVhbChuZXdFbGVtZW50cywgb2xkRWxlbWVudHMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyTGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldChiZWFuKTtcbiAgICBpZiAoZXhpc3RzKGxpc3RlbmVyTGlzdCkgJiYgbGlzdGVuZXJMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gbGlzdGVuZXJMaXN0WzBdO1xuICAgICAgICB2YXIgZWxlbWVudCA9IGVudHJ5LmVsZW1lbnQ7XG4gICAgICAgIHZhciBwYXRoID0gZW50cnkucm9vdFBhdGggKyAnLicgKyBwcm9wZXJ0eU5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3RWxlbWVudHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50LnNwbGljZShwYXRoLCBpbmRleCwgY291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zcGxpY2UuYXBwbHkoZWxlbWVudCwgW3BhdGgsIGluZGV4LCBjb3VudF0uY29uY2F0KG5ld0VsZW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIG5ld0VsZW1lbnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCBjb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UuYXBwbHkoYXJyYXksIFtpbmRleCwgY291bnRdLmNvbmNhdChuZXdFbGVtZW50cykpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5CaW5kZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcm9vdFBhdGgsIHZhbHVlKSB7XG4gICAgaWYgKCFleGlzdHModmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJMaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHZhbHVlKTtcbiAgICBpZiAoIWV4aXN0cyhsaXN0ZW5lckxpc3QpKSB7XG4gICAgICAgIGxpc3RlbmVyTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQodmFsdWUsIGxpc3RlbmVyTGlzdCk7XG4gICAgfVxuICAgIGxpc3RlbmVyTGlzdC5wdXNoKHtlbGVtZW50OiBlbGVtZW50LCByb290UGF0aDogcm9vdFBhdGh9KTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmQoZWxlbWVudCwgcm9vdFBhdGggKyAnLicgKyBpLCB2YWx1ZVtpXSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZChlbGVtZW50LCByb290UGF0aCArICcuJyArIHByb3BlcnR5TmFtZSwgdmFsdWVbcHJvcGVydHlOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5CaW5kZXIucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uIChlbGVtZW50LCByb290UGF0aCwgdmFsdWUpIHtcbiAgICBpZiAoIWV4aXN0cyh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lckxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQodmFsdWUpO1xuICAgIGlmIChleGlzdHMobGlzdGVuZXJMaXN0KSkge1xuICAgICAgICB2YXIgbiA9IGxpc3RlbmVyTGlzdC5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZW50cnkgPSBsaXN0ZW5lckxpc3RbaV07XG4gICAgICAgICAgICBpZiAoZW50cnkuZWxlbWVudCA9PT0gZWxlbWVudCAmJiBlbnRyeS5yb290UGF0aCA9PT0gcm9vdFBhdGgpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckxpc3Quc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKGVsZW1lbnQsIHJvb3RQYXRoICsgJy4nICsgaiwgdmFsdWVbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZChlbGVtZW50LCByb290UGF0aCArICcuJyArIHByb3BlcnR5TmFtZSwgdmFsdWVbcHJvcGVydHlOYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbmV4cG9ydHMuQmluZGVyID0gQmluZGVyO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZG9scGhpbkNsaWVudCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZG9scGhpbi1wbGF0Zm9ybS1qcy9kaXN0L2RvbHBoaW4tcGxhdGZvcm0uanMnKTtcbnZhciBzZXR1cENyZWF0ZUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvci5qcycpLnNldHVwQ3JlYXRlQmVoYXZpb3I7XG5cbmV4cG9ydHMuY2xpZW50Q29udGV4dCA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKXtcbiAgICB2YXIgY2xpZW50Q29udGV4dEZhY3RvcnkgPSBuZXcgZG9scGhpbkNsaWVudC5DbGllbnRDb250ZXh0RmFjdG9yeSgpO1xuICAgIHZhciBjbGllbnRDb250ZXh0ID0gY2xpZW50Q29udGV4dEZhY3RvcnkuY3JlYXRlKHVybCwgY29uZmlnKTtcbiAgICBjbGllbnRDb250ZXh0LmNyZWF0ZUJlaGF2aW9yID0gc2V0dXBDcmVhdGVCZWhhdmlvcihjbGllbnRDb250ZXh0KTtcbiAgICByZXR1cm4gY2xpZW50Q29udGV4dDtcbn07XG5cbiJdfQ==
