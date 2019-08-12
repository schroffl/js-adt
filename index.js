(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.schroffl = root.schroffl || {};
        root.schroffl.adt = factory();
    }
}(this, function () {
    function adt() {
        var obj = {};

        // This function only exists to work around var-hoisting.
        // Otherwise the ctor of an instance would always refer
        // to the last declared ctor of the type.
        function makeCtor() {
            var ctor = function(arg) {
                return { ctor: ctor, arg: arg };
            };

            return ctor;
        }

        for (var name of arguments) {
            var ctor = makeCtor();
            Object.defineProperty(ctor, 'name', { value: name });
            Object.defineProperty(ctor, 'type', { value: obj });
            obj[name] = ctor;
        }

        return obj;
    }

    var otherwise = {};

    function match(matchers) {
        return function(inst, fnCtx) {
            for (var i = 0; i < matchers.length; i++) {
                var matcher = matchers[i];

                if (inst.ctor === matcher.ctor || matcher.ctor === otherwise) {
                    return matcher.fn.call(fnCtx, inst.arg);
                }
            }
        };
    }

    function when(ctor, fn) {
        return { ctor: ctor, fn: fn };
    }

    function is(type, inst) {
        return inst.ctor.type === type;
    }

    function stringify(inst, indentation) {
        if (indentation === undefined)
            indentation = 4;

        return inst.ctor.name + ' ' + JSON.stringify(inst.arg, null, indentation);
    }

    return {
        create: adt,
        match: match,
        when: when,
        otherwise: otherwise,
        stringify: stringify,
        is: is,
    };
}));
