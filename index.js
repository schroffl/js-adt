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
            var ctor = function() {
                return { ctor: ctor, args: arguments };
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

    adt.other = {};

    adt.match = function(ctor, fn) {
        var ctx = this;

        if (!ctx.type || !ctx.matchers) {
            ctx = { type: ctor.type, matchers: [] };
        } else if (ctx.type !== ctor.type) {
            // TODO This should cause an error
        }

        ctx.matchers.push({ ctor: ctor, fn: fn });

        return {
            match: adt.match.bind(ctx),
            of: function(inst, fnCtx) {
                if (ctx.type !== inst.ctor.type) {
                    // TODO This should cause an error
                }

                for (var i = 0; i < ctx.matchers.length; i++) {
                    var matcher = ctx.matchers[i];

                    if (inst.ctor === matcher.ctor || matcher.ctor === adt.other) {
                        return matcher.fn.apply(fnCtx, inst.args);
                    }
                }
            }
        };
    };

    adt.is = function(type, inst) {
        return inst.ctor.type === type;
    };

    return adt;
}));
