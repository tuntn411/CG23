// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.

var Ammo = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (Ammo = {}) {
    var b;
    b || (b = typeof Ammo !== "undefined" ? Ammo : {});
    var aa, ba;
    b.ready = new Promise(function (a, c) {
      aa = a;
      ba = c;
    });
    var ca = Object.assign({}, b),
      da = "object" == typeof window,
      ea = "function" == typeof importScripts,
      fa =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node,
      ha = "",
      ia,
      ja,
      ka;
    if (fa) {
      var fs = require("fs"),
        la = require("path");
      ha = ea ? la.dirname(ha) + "/" : __dirname + "/";
      ia = (a, c) => {
        a = a.startsWith("file://") ? new URL(a) : la.normalize(a);
        return fs.readFileSync(a, c ? void 0 : "utf8");
      };
      ka = (a) => {
        a = ia(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      ja = (a, c, d) => {
        a = a.startsWith("file://") ? new URL(a) : la.normalize(a);
        fs.readFile(a, function (e, g) {
          e ? d(e) : c(g.buffer);
        });
      };
      1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
      process.argv.slice(2);
      b.inspect = function () {
        return "[Emscripten Module object]";
      };
    } else if (da || ea)
      ea
        ? (ha = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (ha = document.currentScript.src),
        _scriptDir && (ha = _scriptDir),
        (ha =
          0 !== ha.indexOf("blob:")
            ? ha.substr(0, ha.replace(/[?#].*/, "").lastIndexOf("/") + 1)
            : ""),
        (ia = (a) => {
          var c = new XMLHttpRequest();
          c.open("GET", a, !1);
          c.send(null);
          return c.responseText;
        }),
        ea &&
          (ka = (a) => {
            var c = new XMLHttpRequest();
            c.open("GET", a, !1);
            c.responseType = "arraybuffer";
            c.send(null);
            return new Uint8Array(c.response);
          }),
        (ja = (a, c, d) => {
          var e = new XMLHttpRequest();
          e.open("GET", a, !0);
          e.responseType = "arraybuffer";
          e.onload = () => {
            200 == e.status || (0 == e.status && e.response)
              ? c(e.response)
              : d();
          };
          e.onerror = d;
          e.send(null);
        });
    b.print || console.log.bind(console);
    var ma = b.printErr || console.warn.bind(console);
    Object.assign(b, ca);
    ca = null;
    var na;
    b.wasmBinary && (na = b.wasmBinary);
    var noExitRuntime = b.noExitRuntime || !0;
    "object" != typeof WebAssembly && oa("no native wasm support detected");
    var pa,
      qa = !1,
      ra = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    function sa(a, c) {
      if (a) {
        var d = ta,
          e = a + c;
        for (c = a; d[c] && !(c >= e); ) ++c;
        if (16 < c - a && d.buffer && ra) a = ra.decode(d.subarray(a, c));
        else {
          for (e = ""; a < c; ) {
            var g = d[a++];
            if (g & 128) {
              var n = d[a++] & 63;
              if (192 == (g & 224))
                e += String.fromCharCode(((g & 31) << 6) | n);
              else {
                var z = d[a++] & 63;
                g =
                  224 == (g & 240)
                    ? ((g & 15) << 12) | (n << 6) | z
                    : ((g & 7) << 18) | (n << 12) | (z << 6) | (d[a++] & 63);
                65536 > g
                  ? (e += String.fromCharCode(g))
                  : ((g -= 65536),
                    (e += String.fromCharCode(
                      55296 | (g >> 10),
                      56320 | (g & 1023)
                    )));
              }
            } else e += String.fromCharCode(g);
          }
          a = e;
        }
      } else a = "";
      return a;
    }
    var ua,
      ta,
      va,
      wa,
      xa,
      ya,
      za = [],
      Aa = [],
      Ba = [],
      Ca = !1;
    function Ea() {
      var a = b.preRun.shift();
      za.unshift(a);
    }
    var Fa = 0,
      Ga = null,
      Ha = null;
    function oa(a) {
      if (b.onAbort) b.onAbort(a);
      a = "Aborted(" + a + ")";
      ma(a);
      qa = !0;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info."
      );
      ba(a);
      throw a;
    }
    function Ia(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var Ja;
    Ja = "ammo.wasm.wasm";
    if (!Ia(Ja)) {
      var Ka = Ja;
      Ja = b.locateFile ? b.locateFile(Ka, ha) : ha + Ka;
    }
    function La(a) {
      try {
        if (a == Ja && na) return new Uint8Array(na);
        if (ka) return ka(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (c) {
        oa(c);
      }
    }
    function Ma(a) {
      if (!na && (da || ea)) {
        if ("function" == typeof fetch && !a.startsWith("file://"))
          return fetch(a, { credentials: "same-origin" })
            .then(function (c) {
              if (!c.ok) throw "failed to load wasm binary file at '" + a + "'";
              return c.arrayBuffer();
            })
            .catch(function () {
              return La(a);
            });
        if (ja)
          return new Promise(function (c, d) {
            ja(
              a,
              function (e) {
                c(new Uint8Array(e));
              },
              d
            );
          });
      }
      return Promise.resolve().then(function () {
        return La(a);
      });
    }
    function Na(a, c, d) {
      return Ma(a)
        .then(function (e) {
          return WebAssembly.instantiate(e, c);
        })
        .then(function (e) {
          return e;
        })
        .then(d, function (e) {
          ma("failed to asynchronously prepare wasm: " + e);
          oa(e);
        });
    }
    function Oa(a, c) {
      var d = Ja;
      return na ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        Ia(d) ||
        d.startsWith("file://") ||
        fa ||
        "function" != typeof fetch
        ? Na(d, a, c)
        : fetch(d, { credentials: "same-origin" }).then(function (e) {
            return WebAssembly.instantiateStreaming(e, a).then(c, function (g) {
              ma("wasm streaming compile failed: " + g);
              ma("falling back to ArrayBuffer instantiation");
              return Na(d, a, c);
            });
          });
    }
    var Pa = {
      27338: (a, c, d, e) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("drawLine"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::drawLine.";
        a.drawLine(c, d, e);
      },
      27558: (a, c, d, e, g, n) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("drawContactPoint"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::drawContactPoint.";
        a.drawContactPoint(c, d, e, g, n);
      },
      27808: (a, c) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("reportErrorWarning"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::reportErrorWarning.";
        a.reportErrorWarning(c);
      },
      28052: (a, c, d) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("draw3dText"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::draw3dText.";
        a.draw3dText(c, d);
      },
      28275: (a, c) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("setDebugMode"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::setDebugMode.";
        a.setDebugMode(c);
      },
      28501: (a) => {
        a = b.getCache(b.DebugDrawer)[a];
        if (!a.hasOwnProperty("getDebugMode"))
          throw "a JSImplementation must implement all functions, you forgot DebugDrawer::getDebugMode.";
        return a.getDebugMode();
      },
      28732: (a, c) => {
        a = b.getCache(b.MotionState)[a];
        if (!a.hasOwnProperty("getWorldTransform"))
          throw "a JSImplementation must implement all functions, you forgot MotionState::getWorldTransform.";
        a.getWorldTransform(c);
      },
      28973: (a, c) => {
        a = b.getCache(b.MotionState)[a];
        if (!a.hasOwnProperty("setWorldTransform"))
          throw "a JSImplementation must implement all functions, you forgot MotionState::setWorldTransform.";
        a.setWorldTransform(c);
      },
      29214: (a, c, d, e, g, n, z, T) => {
        a = b.getCache(b.ConcreteContactResultCallback)[a];
        if (!a.hasOwnProperty("addSingleResult"))
          throw "a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.";
        return a.addSingleResult(c, d, e, g, n, z, T);
      },
    };
    function Qa(a) {
      for (; 0 < a.length; ) a.shift()(b);
    }
    var Ra = [];
    function Sa(a, c, d) {
      Ra.length = 0;
      var e;
      for (d >>= 2; (e = ta[c++]); )
        (d += (105 != e) & d), Ra.push(105 == e ? va[d] : xa[d++ >> 1]), ++d;
      return Pa[a].apply(null, Ra);
    }
    var Ta = [],
      Ua = void 0,
      Va = [],
      Wa = {
        b: function () {
          oa("");
        },
        f: function (a, c, d) {
          return Sa(a, c, d);
        },
        a: function (a, c, d) {
          return Sa(a, c, d);
        },
        d: function () {
          return Date.now();
        },
        e: function (a, c, d) {
          ta.copyWithin(a, c, c + d);
        },
        c: function () {
          oa("OOM");
        },
      };
    (function () {
      function a(d) {
        d = d.exports;
        b.asm = d;
        pa = b.asm.g;
        var e = pa.buffer;
        b.HEAP8 = ua = new Int8Array(e);
        b.HEAP16 = new Int16Array(e);
        b.HEAP32 = va = new Int32Array(e);
        b.HEAPU8 = ta = new Uint8Array(e);
        b.HEAPU16 = new Uint16Array(e);
        b.HEAPU32 = new Uint32Array(e);
        b.HEAPF32 = wa = new Float32Array(e);
        b.HEAPF64 = xa = new Float64Array(e);
        ya = b.asm.iB;
        Aa.unshift(b.asm.h);
        Fa--;
        b.monitorRunDependencies && b.monitorRunDependencies(Fa);
        0 == Fa &&
          (null !== Ga && (clearInterval(Ga), (Ga = null)),
          Ha && ((e = Ha), (Ha = null), e()));
        return d;
      }
      var c = { a: Wa };
      Fa++;
      b.monitorRunDependencies && b.monitorRunDependencies(Fa);
      if (b.instantiateWasm)
        try {
          return b.instantiateWasm(c, a);
        } catch (d) {
          ma("Module.instantiateWasm callback failed with error: " + d), ba(d);
        }
      Oa(c, function (d) {
        a(d.instance);
      }).catch(ba);
      return {};
    })();
    var Xa = (b._emscripten_bind_btCollisionShape_setLocalScaling_1 =
        function () {
          return (Xa = b._emscripten_bind_btCollisionShape_setLocalScaling_1 =
            b.asm.i).apply(null, arguments);
        }),
      Ya = (b._emscripten_bind_btCollisionShape_getLocalScaling_0 =
        function () {
          return (Ya = b._emscripten_bind_btCollisionShape_getLocalScaling_0 =
            b.asm.j).apply(null, arguments);
        }),
      Za = (b._emscripten_bind_btCollisionShape_calculateLocalInertia_2 =
        function () {
          return (Za =
            b._emscripten_bind_btCollisionShape_calculateLocalInertia_2 =
              b.asm.k).apply(null, arguments);
        }),
      $a = (b._emscripten_bind_btCollisionShape_setMargin_1 = function () {
        return ($a = b._emscripten_bind_btCollisionShape_setMargin_1 =
          b.asm.l).apply(null, arguments);
      }),
      ab = (b._emscripten_bind_btCollisionShape_getMargin_0 = function () {
        return (ab = b._emscripten_bind_btCollisionShape_getMargin_0 =
          b.asm.m).apply(null, arguments);
      }),
      bb = (b._emscripten_bind_btCollisionShape___destroy___0 = function () {
        return (bb = b._emscripten_bind_btCollisionShape___destroy___0 =
          b.asm.n).apply(null, arguments);
      }),
      cb = (b._emscripten_bind_btCollisionWorld_getDispatcher_0 = function () {
        return (cb = b._emscripten_bind_btCollisionWorld_getDispatcher_0 =
          b.asm.o).apply(null, arguments);
      }),
      db = (b._emscripten_bind_btCollisionWorld_rayTest_3 = function () {
        return (db = b._emscripten_bind_btCollisionWorld_rayTest_3 =
          b.asm.p).apply(null, arguments);
      }),
      eb = (b._emscripten_bind_btCollisionWorld_getPairCache_0 = function () {
        return (eb = b._emscripten_bind_btCollisionWorld_getPairCache_0 =
          b.asm.q).apply(null, arguments);
      }),
      fb = (b._emscripten_bind_btCollisionWorld_getDispatchInfo_0 =
        function () {
          return (fb = b._emscripten_bind_btCollisionWorld_getDispatchInfo_0 =
            b.asm.r).apply(null, arguments);
        }),
      gb = (b._emscripten_bind_btCollisionWorld_addCollisionObject_1 =
        function () {
          return (gb =
            b._emscripten_bind_btCollisionWorld_addCollisionObject_1 =
              b.asm.s).apply(null, arguments);
        }),
      hb = (b._emscripten_bind_btCollisionWorld_addCollisionObject_2 =
        function () {
          return (hb =
            b._emscripten_bind_btCollisionWorld_addCollisionObject_2 =
              b.asm.t).apply(null, arguments);
        }),
      ib = (b._emscripten_bind_btCollisionWorld_addCollisionObject_3 =
        function () {
          return (ib =
            b._emscripten_bind_btCollisionWorld_addCollisionObject_3 =
              b.asm.u).apply(null, arguments);
        }),
      jb = (b._emscripten_bind_btCollisionWorld_removeCollisionObject_1 =
        function () {
          return (jb =
            b._emscripten_bind_btCollisionWorld_removeCollisionObject_1 =
              b.asm.v).apply(null, arguments);
        }),
      kb = (b._emscripten_bind_btCollisionWorld_getBroadphase_0 = function () {
        return (kb = b._emscripten_bind_btCollisionWorld_getBroadphase_0 =
          b.asm.w).apply(null, arguments);
      }),
      lb = (b._emscripten_bind_btCollisionWorld_convexSweepTest_5 =
        function () {
          return (lb = b._emscripten_bind_btCollisionWorld_convexSweepTest_5 =
            b.asm.x).apply(null, arguments);
        }),
      mb = (b._emscripten_bind_btCollisionWorld_contactPairTest_3 =
        function () {
          return (mb = b._emscripten_bind_btCollisionWorld_contactPairTest_3 =
            b.asm.y).apply(null, arguments);
        }),
      nb = (b._emscripten_bind_btCollisionWorld_contactTest_2 = function () {
        return (nb = b._emscripten_bind_btCollisionWorld_contactTest_2 =
          b.asm.z).apply(null, arguments);
      }),
      ob = (b._emscripten_bind_btCollisionWorld_updateSingleAabb_1 =
        function () {
          return (ob = b._emscripten_bind_btCollisionWorld_updateSingleAabb_1 =
            b.asm.A).apply(null, arguments);
        }),
      pb = (b._emscripten_bind_btCollisionWorld_setDebugDrawer_1 = function () {
        return (pb = b._emscripten_bind_btCollisionWorld_setDebugDrawer_1 =
          b.asm.B).apply(null, arguments);
      }),
      qb = (b._emscripten_bind_btCollisionWorld_getDebugDrawer_0 = function () {
        return (qb = b._emscripten_bind_btCollisionWorld_getDebugDrawer_0 =
          b.asm.C).apply(null, arguments);
      }),
      rb = (b._emscripten_bind_btCollisionWorld_debugDrawWorld_0 = function () {
        return (rb = b._emscripten_bind_btCollisionWorld_debugDrawWorld_0 =
          b.asm.D).apply(null, arguments);
      }),
      sb = (b._emscripten_bind_btCollisionWorld_debugDrawObject_3 =
        function () {
          return (sb = b._emscripten_bind_btCollisionWorld_debugDrawObject_3 =
            b.asm.E).apply(null, arguments);
        }),
      tb = (b._emscripten_bind_btCollisionWorld___destroy___0 = function () {
        return (tb = b._emscripten_bind_btCollisionWorld___destroy___0 =
          b.asm.F).apply(null, arguments);
      }),
      ub = (b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 =
        function () {
          return (ub =
            b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 =
              b.asm.G).apply(null, arguments);
        }),
      vb = (b._emscripten_bind_btCollisionObject_getCollisionShape_0 =
        function () {
          return (vb =
            b._emscripten_bind_btCollisionObject_getCollisionShape_0 =
              b.asm.H).apply(null, arguments);
        }),
      wb =
        (b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 =
          function () {
            return (wb =
              b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 =
                b.asm.I).apply(null, arguments);
          }),
      xb = (b._emscripten_bind_btCollisionObject_setActivationState_1 =
        function () {
          return (xb =
            b._emscripten_bind_btCollisionObject_setActivationState_1 =
              b.asm.J).apply(null, arguments);
        }),
      yb = (b._emscripten_bind_btCollisionObject_forceActivationState_1 =
        function () {
          return (yb =
            b._emscripten_bind_btCollisionObject_forceActivationState_1 =
              b.asm.K).apply(null, arguments);
        }),
      zb = (b._emscripten_bind_btCollisionObject_activate_0 = function () {
        return (zb = b._emscripten_bind_btCollisionObject_activate_0 =
          b.asm.L).apply(null, arguments);
      }),
      Ab = (b._emscripten_bind_btCollisionObject_activate_1 = function () {
        return (Ab = b._emscripten_bind_btCollisionObject_activate_1 =
          b.asm.M).apply(null, arguments);
      }),
      Bb = (b._emscripten_bind_btCollisionObject_isActive_0 = function () {
        return (Bb = b._emscripten_bind_btCollisionObject_isActive_0 =
          b.asm.N).apply(null, arguments);
      }),
      Cb = (b._emscripten_bind_btCollisionObject_isKinematicObject_0 =
        function () {
          return (Cb =
            b._emscripten_bind_btCollisionObject_isKinematicObject_0 =
              b.asm.O).apply(null, arguments);
        }),
      Db = (b._emscripten_bind_btCollisionObject_isStaticObject_0 =
        function () {
          return (Db = b._emscripten_bind_btCollisionObject_isStaticObject_0 =
            b.asm.P).apply(null, arguments);
        }),
      Eb = (b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 =
        function () {
          return (Eb =
            b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 =
              b.asm.Q).apply(null, arguments);
        }),
      Fb = (b._emscripten_bind_btCollisionObject_getRestitution_0 =
        function () {
          return (Fb = b._emscripten_bind_btCollisionObject_getRestitution_0 =
            b.asm.R).apply(null, arguments);
        }),
      Gb = (b._emscripten_bind_btCollisionObject_getFriction_0 = function () {
        return (Gb = b._emscripten_bind_btCollisionObject_getFriction_0 =
          b.asm.S).apply(null, arguments);
      }),
      Hb = (b._emscripten_bind_btCollisionObject_getRollingFriction_0 =
        function () {
          return (Hb =
            b._emscripten_bind_btCollisionObject_getRollingFriction_0 =
              b.asm.T).apply(null, arguments);
        }),
      Ib = (b._emscripten_bind_btCollisionObject_setRestitution_1 =
        function () {
          return (Ib = b._emscripten_bind_btCollisionObject_setRestitution_1 =
            b.asm.U).apply(null, arguments);
        }),
      Jb = (b._emscripten_bind_btCollisionObject_setFriction_1 = function () {
        return (Jb = b._emscripten_bind_btCollisionObject_setFriction_1 =
          b.asm.V).apply(null, arguments);
      }),
      Kb = (b._emscripten_bind_btCollisionObject_setRollingFriction_1 =
        function () {
          return (Kb =
            b._emscripten_bind_btCollisionObject_setRollingFriction_1 =
              b.asm.W).apply(null, arguments);
        }),
      Lb = (b._emscripten_bind_btCollisionObject_getWorldTransform_0 =
        function () {
          return (Lb =
            b._emscripten_bind_btCollisionObject_getWorldTransform_0 =
              b.asm.X).apply(null, arguments);
        }),
      Mb = (b._emscripten_bind_btCollisionObject_getCollisionFlags_0 =
        function () {
          return (Mb =
            b._emscripten_bind_btCollisionObject_getCollisionFlags_0 =
              b.asm.Y).apply(null, arguments);
        }),
      Nb = (b._emscripten_bind_btCollisionObject_setCollisionFlags_1 =
        function () {
          return (Nb =
            b._emscripten_bind_btCollisionObject_setCollisionFlags_1 =
              b.asm.Z).apply(null, arguments);
        }),
      Ob = (b._emscripten_bind_btCollisionObject_setWorldTransform_1 =
        function () {
          return (Ob =
            b._emscripten_bind_btCollisionObject_setWorldTransform_1 =
              b.asm._).apply(null, arguments);
        }),
      Pb = (b._emscripten_bind_btCollisionObject_setCollisionShape_1 =
        function () {
          return (Pb =
            b._emscripten_bind_btCollisionObject_setCollisionShape_1 =
              b.asm.$).apply(null, arguments);
        }),
      Qb = (b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 =
        function () {
          return (Qb =
            b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 =
              b.asm.aa).apply(null, arguments);
        }),
      Rb = (b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 =
        function () {
          return (Rb =
            b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 =
              b.asm.ba).apply(null, arguments);
        }),
      Sb = (b._emscripten_bind_btCollisionObject_getUserIndex_0 = function () {
        return (Sb = b._emscripten_bind_btCollisionObject_getUserIndex_0 =
          b.asm.ca).apply(null, arguments);
      }),
      Tb = (b._emscripten_bind_btCollisionObject_setUserIndex_1 = function () {
        return (Tb = b._emscripten_bind_btCollisionObject_setUserIndex_1 =
          b.asm.da).apply(null, arguments);
      }),
      Ub = (b._emscripten_bind_btCollisionObject_getUserPointer_0 =
        function () {
          return (Ub = b._emscripten_bind_btCollisionObject_getUserPointer_0 =
            b.asm.ea).apply(null, arguments);
        }),
      Vb = (b._emscripten_bind_btCollisionObject_setUserPointer_1 =
        function () {
          return (Vb = b._emscripten_bind_btCollisionObject_setUserPointer_1 =
            b.asm.fa).apply(null, arguments);
        }),
      Wb = (b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 =
        function () {
          return (Wb =
            b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 =
              b.asm.ga).apply(null, arguments);
        }),
      Xb = (b._emscripten_bind_btCollisionObject___destroy___0 = function () {
        return (Xb = b._emscripten_bind_btCollisionObject___destroy___0 =
          b.asm.ha).apply(null, arguments);
      }),
      Yb = (b._emscripten_bind_btConcaveShape_setLocalScaling_1 = function () {
        return (Yb = b._emscripten_bind_btConcaveShape_setLocalScaling_1 =
          b.asm.ia).apply(null, arguments);
      }),
      Zb = (b._emscripten_bind_btConcaveShape_getLocalScaling_0 = function () {
        return (Zb = b._emscripten_bind_btConcaveShape_getLocalScaling_0 =
          b.asm.ja).apply(null, arguments);
      }),
      $b = (b._emscripten_bind_btConcaveShape_calculateLocalInertia_2 =
        function () {
          return ($b =
            b._emscripten_bind_btConcaveShape_calculateLocalInertia_2 =
              b.asm.ka).apply(null, arguments);
        }),
      ac = (b._emscripten_bind_btConcaveShape___destroy___0 = function () {
        return (ac = b._emscripten_bind_btConcaveShape___destroy___0 =
          b.asm.la).apply(null, arguments);
      }),
      bc = (b._emscripten_bind_btCollisionAlgorithm___destroy___0 =
        function () {
          return (bc = b._emscripten_bind_btCollisionAlgorithm___destroy___0 =
            b.asm.ma).apply(null, arguments);
        }),
      cc = (b._emscripten_bind_btTypedConstraint_enableFeedback_1 =
        function () {
          return (cc = b._emscripten_bind_btTypedConstraint_enableFeedback_1 =
            b.asm.na).apply(null, arguments);
        }),
      ec = (b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 =
        function () {
          return (ec =
            b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 =
              b.asm.oa).apply(null, arguments);
        }),
      fc = (b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 =
        function () {
          return (fc =
            b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 =
              b.asm.pa).apply(null, arguments);
        }),
      gc = (b._emscripten_bind_btTypedConstraint_getParam_2 = function () {
        return (gc = b._emscripten_bind_btTypedConstraint_getParam_2 =
          b.asm.qa).apply(null, arguments);
      }),
      hc = (b._emscripten_bind_btTypedConstraint_setParam_3 = function () {
        return (hc = b._emscripten_bind_btTypedConstraint_setParam_3 =
          b.asm.ra).apply(null, arguments);
      }),
      ic = (b._emscripten_bind_btTypedConstraint___destroy___0 = function () {
        return (ic = b._emscripten_bind_btTypedConstraint___destroy___0 =
          b.asm.sa).apply(null, arguments);
      }),
      jc = (b._emscripten_bind_btDynamicsWorld_addAction_1 = function () {
        return (jc = b._emscripten_bind_btDynamicsWorld_addAction_1 =
          b.asm.ta).apply(null, arguments);
      }),
      kc = (b._emscripten_bind_btDynamicsWorld_removeAction_1 = function () {
        return (kc = b._emscripten_bind_btDynamicsWorld_removeAction_1 =
          b.asm.ua).apply(null, arguments);
      }),
      lc = (b._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = function () {
        return (lc = b._emscripten_bind_btDynamicsWorld_getSolverInfo_0 =
          b.asm.va).apply(null, arguments);
      }),
      mc = (b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 =
        function () {
          return (mc =
            b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 =
              b.asm.wa).apply(null, arguments);
        }),
      nc = (b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 =
        function () {
          return (nc =
            b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 =
              b.asm.xa).apply(null, arguments);
        }),
      oc = (b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 =
        function () {
          return (oc =
            b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 =
              b.asm.ya).apply(null, arguments);
        }),
      pc = (b._emscripten_bind_btDynamicsWorld_getDispatcher_0 = function () {
        return (pc = b._emscripten_bind_btDynamicsWorld_getDispatcher_0 =
          b.asm.za).apply(null, arguments);
      }),
      qc = (b._emscripten_bind_btDynamicsWorld_rayTest_3 = function () {
        return (qc = b._emscripten_bind_btDynamicsWorld_rayTest_3 =
          b.asm.Aa).apply(null, arguments);
      }),
      rc = (b._emscripten_bind_btDynamicsWorld_getPairCache_0 = function () {
        return (rc = b._emscripten_bind_btDynamicsWorld_getPairCache_0 =
          b.asm.Ba).apply(null, arguments);
      }),
      sc = (b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = function () {
        return (sc = b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 =
          b.asm.Ca).apply(null, arguments);
      }),
      tc = (b._emscripten_bind_btDynamicsWorld_addCollisionObject_1 =
        function () {
          return (tc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_1 =
            b.asm.Da).apply(null, arguments);
        }),
      uc = (b._emscripten_bind_btDynamicsWorld_addCollisionObject_2 =
        function () {
          return (uc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_2 =
            b.asm.Ea).apply(null, arguments);
        }),
      vc = (b._emscripten_bind_btDynamicsWorld_addCollisionObject_3 =
        function () {
          return (vc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_3 =
            b.asm.Fa).apply(null, arguments);
        }),
      wc = (b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 =
        function () {
          return (wc =
            b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 =
              b.asm.Ga).apply(null, arguments);
        }),
      xc = (b._emscripten_bind_btDynamicsWorld_getBroadphase_0 = function () {
        return (xc = b._emscripten_bind_btDynamicsWorld_getBroadphase_0 =
          b.asm.Ha).apply(null, arguments);
      }),
      yc = (b._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = function () {
        return (yc = b._emscripten_bind_btDynamicsWorld_convexSweepTest_5 =
          b.asm.Ia).apply(null, arguments);
      }),
      zc = (b._emscripten_bind_btDynamicsWorld_contactPairTest_3 = function () {
        return (zc = b._emscripten_bind_btDynamicsWorld_contactPairTest_3 =
          b.asm.Ja).apply(null, arguments);
      }),
      Ac = (b._emscripten_bind_btDynamicsWorld_contactTest_2 = function () {
        return (Ac = b._emscripten_bind_btDynamicsWorld_contactTest_2 =
          b.asm.Ka).apply(null, arguments);
      }),
      Bc = (b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 =
        function () {
          return (Bc = b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 =
            b.asm.La).apply(null, arguments);
        }),
      Cc = (b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1 = function () {
        return (Cc = b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1 =
          b.asm.Ma).apply(null, arguments);
      }),
      Dc = (b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0 = function () {
        return (Dc = b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0 =
          b.asm.Na).apply(null, arguments);
      }),
      Ec = (b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0 = function () {
        return (Ec = b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0 =
          b.asm.Oa).apply(null, arguments);
      }),
      Fc = (b._emscripten_bind_btDynamicsWorld_debugDrawObject_3 = function () {
        return (Fc = b._emscripten_bind_btDynamicsWorld_debugDrawObject_3 =
          b.asm.Pa).apply(null, arguments);
      }),
      Gc = (b._emscripten_bind_btDynamicsWorld___destroy___0 = function () {
        return (Gc = b._emscripten_bind_btDynamicsWorld___destroy___0 =
          b.asm.Qa).apply(null, arguments);
      }),
      Hc = (b._emscripten_bind_btIDebugDraw_drawLine_3 = function () {
        return (Hc = b._emscripten_bind_btIDebugDraw_drawLine_3 =
          b.asm.Ra).apply(null, arguments);
      }),
      Ic = (b._emscripten_bind_btIDebugDraw_drawContactPoint_5 = function () {
        return (Ic = b._emscripten_bind_btIDebugDraw_drawContactPoint_5 =
          b.asm.Sa).apply(null, arguments);
      }),
      Jc = (b._emscripten_bind_btIDebugDraw_reportErrorWarning_1 = function () {
        return (Jc = b._emscripten_bind_btIDebugDraw_reportErrorWarning_1 =
          b.asm.Ta).apply(null, arguments);
      }),
      Kc = (b._emscripten_bind_btIDebugDraw_draw3dText_2 = function () {
        return (Kc = b._emscripten_bind_btIDebugDraw_draw3dText_2 =
          b.asm.Ua).apply(null, arguments);
      }),
      Lc = (b._emscripten_bind_btIDebugDraw_setDebugMode_1 = function () {
        return (Lc = b._emscripten_bind_btIDebugDraw_setDebugMode_1 =
          b.asm.Va).apply(null, arguments);
      }),
      Mc = (b._emscripten_bind_btIDebugDraw_getDebugMode_0 = function () {
        return (Mc = b._emscripten_bind_btIDebugDraw_getDebugMode_0 =
          b.asm.Wa).apply(null, arguments);
      }),
      Nc = (b._emscripten_bind_btIDebugDraw___destroy___0 = function () {
        return (Nc = b._emscripten_bind_btIDebugDraw___destroy___0 =
          b.asm.Xa).apply(null, arguments);
      }),
      Oc = (b._emscripten_bind_btVector3_btVector3_0 = function () {
        return (Oc = b._emscripten_bind_btVector3_btVector3_0 = b.asm.Ya).apply(
          null,
          arguments
        );
      }),
      Pc = (b._emscripten_bind_btVector3_btVector3_3 = function () {
        return (Pc = b._emscripten_bind_btVector3_btVector3_3 = b.asm.Za).apply(
          null,
          arguments
        );
      }),
      Qc = (b._emscripten_bind_btVector3_length_0 = function () {
        return (Qc = b._emscripten_bind_btVector3_length_0 = b.asm._a).apply(
          null,
          arguments
        );
      }),
      Rc = (b._emscripten_bind_btVector3_x_0 = function () {
        return (Rc = b._emscripten_bind_btVector3_x_0 = b.asm.$a).apply(
          null,
          arguments
        );
      }),
      Sc = (b._emscripten_bind_btVector3_y_0 = function () {
        return (Sc = b._emscripten_bind_btVector3_y_0 = b.asm.ab).apply(
          null,
          arguments
        );
      }),
      Tc = (b._emscripten_bind_btVector3_z_0 = function () {
        return (Tc = b._emscripten_bind_btVector3_z_0 = b.asm.bb).apply(
          null,
          arguments
        );
      }),
      Uc = (b._emscripten_bind_btVector3_setX_1 = function () {
        return (Uc = b._emscripten_bind_btVector3_setX_1 = b.asm.cb).apply(
          null,
          arguments
        );
      }),
      Vc = (b._emscripten_bind_btVector3_setY_1 = function () {
        return (Vc = b._emscripten_bind_btVector3_setY_1 = b.asm.db).apply(
          null,
          arguments
        );
      }),
      Wc = (b._emscripten_bind_btVector3_setZ_1 = function () {
        return (Wc = b._emscripten_bind_btVector3_setZ_1 = b.asm.eb).apply(
          null,
          arguments
        );
      }),
      Xc = (b._emscripten_bind_btVector3_setValue_3 = function () {
        return (Xc = b._emscripten_bind_btVector3_setValue_3 = b.asm.fb).apply(
          null,
          arguments
        );
      }),
      Yc = (b._emscripten_bind_btVector3_normalize_0 = function () {
        return (Yc = b._emscripten_bind_btVector3_normalize_0 = b.asm.gb).apply(
          null,
          arguments
        );
      }),
      Zc = (b._emscripten_bind_btVector3_rotate_2 = function () {
        return (Zc = b._emscripten_bind_btVector3_rotate_2 = b.asm.hb).apply(
          null,
          arguments
        );
      }),
      $c = (b._emscripten_bind_btVector3_dot_1 = function () {
        return ($c = b._emscripten_bind_btVector3_dot_1 = b.asm.ib).apply(
          null,
          arguments
        );
      }),
      ad = (b._emscripten_bind_btVector3_op_mul_1 = function () {
        return (ad = b._emscripten_bind_btVector3_op_mul_1 = b.asm.jb).apply(
          null,
          arguments
        );
      }),
      bd = (b._emscripten_bind_btVector3_op_add_1 = function () {
        return (bd = b._emscripten_bind_btVector3_op_add_1 = b.asm.kb).apply(
          null,
          arguments
        );
      }),
      cd = (b._emscripten_bind_btVector3_op_sub_1 = function () {
        return (cd = b._emscripten_bind_btVector3_op_sub_1 = b.asm.lb).apply(
          null,
          arguments
        );
      }),
      dd = (b._emscripten_bind_btVector3___destroy___0 = function () {
        return (dd = b._emscripten_bind_btVector3___destroy___0 =
          b.asm.mb).apply(null, arguments);
      }),
      ed = (b._emscripten_bind_btQuadWord_x_0 = function () {
        return (ed = b._emscripten_bind_btQuadWord_x_0 = b.asm.nb).apply(
          null,
          arguments
        );
      }),
      fd = (b._emscripten_bind_btQuadWord_y_0 = function () {
        return (fd = b._emscripten_bind_btQuadWord_y_0 = b.asm.ob).apply(
          null,
          arguments
        );
      }),
      gd = (b._emscripten_bind_btQuadWord_z_0 = function () {
        return (gd = b._emscripten_bind_btQuadWord_z_0 = b.asm.pb).apply(
          null,
          arguments
        );
      }),
      hd = (b._emscripten_bind_btQuadWord_w_0 = function () {
        return (hd = b._emscripten_bind_btQuadWord_w_0 = b.asm.qb).apply(
          null,
          arguments
        );
      }),
      jd = (b._emscripten_bind_btQuadWord_setX_1 = function () {
        return (jd = b._emscripten_bind_btQuadWord_setX_1 = b.asm.rb).apply(
          null,
          arguments
        );
      }),
      kd = (b._emscripten_bind_btQuadWord_setY_1 = function () {
        return (kd = b._emscripten_bind_btQuadWord_setY_1 = b.asm.sb).apply(
          null,
          arguments
        );
      }),
      ld = (b._emscripten_bind_btQuadWord_setZ_1 = function () {
        return (ld = b._emscripten_bind_btQuadWord_setZ_1 = b.asm.tb).apply(
          null,
          arguments
        );
      }),
      md = (b._emscripten_bind_btQuadWord_setW_1 = function () {
        return (md = b._emscripten_bind_btQuadWord_setW_1 = b.asm.ub).apply(
          null,
          arguments
        );
      }),
      nd = (b._emscripten_bind_btQuadWord___destroy___0 = function () {
        return (nd = b._emscripten_bind_btQuadWord___destroy___0 =
          b.asm.vb).apply(null, arguments);
      }),
      od = (b._emscripten_bind_btMotionState_getWorldTransform_1 = function () {
        return (od = b._emscripten_bind_btMotionState_getWorldTransform_1 =
          b.asm.wb).apply(null, arguments);
      }),
      pd = (b._emscripten_bind_btMotionState_setWorldTransform_1 = function () {
        return (pd = b._emscripten_bind_btMotionState_setWorldTransform_1 =
          b.asm.xb).apply(null, arguments);
      }),
      qd = (b._emscripten_bind_btMotionState___destroy___0 = function () {
        return (qd = b._emscripten_bind_btMotionState___destroy___0 =
          b.asm.yb).apply(null, arguments);
      }),
      rd = (b._emscripten_bind_RayResultCallback_hasHit_0 = function () {
        return (rd = b._emscripten_bind_RayResultCallback_hasHit_0 =
          b.asm.zb).apply(null, arguments);
      }),
      sd = (b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 =
        function () {
          return (sd =
            b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 =
              b.asm.Ab).apply(null, arguments);
        }),
      td = (b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 =
        function () {
          return (td =
            b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 =
              b.asm.Bb).apply(null, arguments);
        }),
      ud = (b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 =
        function () {
          return (ud =
            b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 =
              b.asm.Cb).apply(null, arguments);
        }),
      vd = (b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 =
        function () {
          return (vd =
            b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 =
              b.asm.Db).apply(null, arguments);
        }),
      wd = (b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 =
        function () {
          return (wd =
            b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 =
              b.asm.Eb).apply(null, arguments);
        }),
      xd = (b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 =
        function () {
          return (xd =
            b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 =
              b.asm.Fb).apply(null, arguments);
        }),
      yd = (b._emscripten_bind_RayResultCallback_get_m_collisionObject_0 =
        function () {
          return (yd =
            b._emscripten_bind_RayResultCallback_get_m_collisionObject_0 =
              b.asm.Gb).apply(null, arguments);
        }),
      zd = (b._emscripten_bind_RayResultCallback_set_m_collisionObject_1 =
        function () {
          return (zd =
            b._emscripten_bind_RayResultCallback_set_m_collisionObject_1 =
              b.asm.Hb).apply(null, arguments);
        }),
      Ad = (b._emscripten_bind_RayResultCallback_get_m_flags_0 = function () {
        return (Ad = b._emscripten_bind_RayResultCallback_get_m_flags_0 =
          b.asm.Ib).apply(null, arguments);
      }),
      Bd = (b._emscripten_bind_RayResultCallback_set_m_flags_1 = function () {
        return (Bd = b._emscripten_bind_RayResultCallback_set_m_flags_1 =
          b.asm.Jb).apply(null, arguments);
      }),
      Cd = (b._emscripten_bind_RayResultCallback___destroy___0 = function () {
        return (Cd = b._emscripten_bind_RayResultCallback___destroy___0 =
          b.asm.Kb).apply(null, arguments);
      }),
      Dd = (b._emscripten_bind_ContactResultCallback_addSingleResult_7 =
        function () {
          return (Dd =
            b._emscripten_bind_ContactResultCallback_addSingleResult_7 =
              b.asm.Lb).apply(null, arguments);
        }),
      Ed = (b._emscripten_bind_ContactResultCallback___destroy___0 =
        function () {
          return (Ed = b._emscripten_bind_ContactResultCallback___destroy___0 =
            b.asm.Mb).apply(null, arguments);
        }),
      Fd = (b._emscripten_bind_ConvexResultCallback_hasHit_0 = function () {
        return (Fd = b._emscripten_bind_ConvexResultCallback_hasHit_0 =
          b.asm.Nb).apply(null, arguments);
      }),
      Gd =
        (b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 =
          function () {
            return (Gd =
              b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 =
                b.asm.Ob).apply(null, arguments);
          }),
      Hd =
        (b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 =
          function () {
            return (Hd =
              b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 =
                b.asm.Pb).apply(null, arguments);
          }),
      Id =
        (b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 =
          function () {
            return (Id =
              b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 =
                b.asm.Qb).apply(null, arguments);
          }),
      Jd =
        (b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 =
          function () {
            return (Jd =
              b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 =
                b.asm.Rb).apply(null, arguments);
          }),
      Kd = (b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 =
        function () {
          return (Kd =
            b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 =
              b.asm.Sb).apply(null, arguments);
        }),
      Ld = (b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 =
        function () {
          return (Ld =
            b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 =
              b.asm.Tb).apply(null, arguments);
        }),
      Md = (b._emscripten_bind_ConvexResultCallback___destroy___0 =
        function () {
          return (Md = b._emscripten_bind_ConvexResultCallback___destroy___0 =
            b.asm.Ub).apply(null, arguments);
        }),
      Nd = (b._emscripten_bind_btConvexShape_setLocalScaling_1 = function () {
        return (Nd = b._emscripten_bind_btConvexShape_setLocalScaling_1 =
          b.asm.Vb).apply(null, arguments);
      }),
      Od = (b._emscripten_bind_btConvexShape_getLocalScaling_0 = function () {
        return (Od = b._emscripten_bind_btConvexShape_getLocalScaling_0 =
          b.asm.Wb).apply(null, arguments);
      }),
      Pd = (b._emscripten_bind_btConvexShape_calculateLocalInertia_2 =
        function () {
          return (Pd =
            b._emscripten_bind_btConvexShape_calculateLocalInertia_2 =
              b.asm.Xb).apply(null, arguments);
        }),
      Qd = (b._emscripten_bind_btConvexShape_setMargin_1 = function () {
        return (Qd = b._emscripten_bind_btConvexShape_setMargin_1 =
          b.asm.Yb).apply(null, arguments);
      }),
      Rd = (b._emscripten_bind_btConvexShape_getMargin_0 = function () {
        return (Rd = b._emscripten_bind_btConvexShape_getMargin_0 =
          b.asm.Zb).apply(null, arguments);
      }),
      Sd = (b._emscripten_bind_btConvexShape___destroy___0 = function () {
        return (Sd = b._emscripten_bind_btConvexShape___destroy___0 =
          b.asm._b).apply(null, arguments);
      }),
      Td = (b._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = function () {
        return (Td = b._emscripten_bind_btCapsuleShape_btCapsuleShape_2 =
          b.asm.$b).apply(null, arguments);
      }),
      Ud = (b._emscripten_bind_btCapsuleShape_setMargin_1 = function () {
        return (Ud = b._emscripten_bind_btCapsuleShape_setMargin_1 =
          b.asm.ac).apply(null, arguments);
      }),
      Vd = (b._emscripten_bind_btCapsuleShape_getMargin_0 = function () {
        return (Vd = b._emscripten_bind_btCapsuleShape_getMargin_0 =
          b.asm.bc).apply(null, arguments);
      }),
      Wd = (b._emscripten_bind_btCapsuleShape_getUpAxis_0 = function () {
        return (Wd = b._emscripten_bind_btCapsuleShape_getUpAxis_0 =
          b.asm.cc).apply(null, arguments);
      }),
      Xd = (b._emscripten_bind_btCapsuleShape_getRadius_0 = function () {
        return (Xd = b._emscripten_bind_btCapsuleShape_getRadius_0 =
          b.asm.dc).apply(null, arguments);
      }),
      Yd = (b._emscripten_bind_btCapsuleShape_getHalfHeight_0 = function () {
        return (Yd = b._emscripten_bind_btCapsuleShape_getHalfHeight_0 =
          b.asm.ec).apply(null, arguments);
      }),
      Zd = (b._emscripten_bind_btCapsuleShape_setLocalScaling_1 = function () {
        return (Zd = b._emscripten_bind_btCapsuleShape_setLocalScaling_1 =
          b.asm.fc).apply(null, arguments);
      }),
      $d = (b._emscripten_bind_btCapsuleShape_getLocalScaling_0 = function () {
        return ($d = b._emscripten_bind_btCapsuleShape_getLocalScaling_0 =
          b.asm.gc).apply(null, arguments);
      }),
      ae = (b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 =
        function () {
          return (ae =
            b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 =
              b.asm.hc).apply(null, arguments);
        }),
      be = (b._emscripten_bind_btCapsuleShape___destroy___0 = function () {
        return (be = b._emscripten_bind_btCapsuleShape___destroy___0 =
          b.asm.ic).apply(null, arguments);
      }),
      ce = (b._emscripten_bind_btCylinderShape_btCylinderShape_1 = function () {
        return (ce = b._emscripten_bind_btCylinderShape_btCylinderShape_1 =
          b.asm.jc).apply(null, arguments);
      }),
      de = (b._emscripten_bind_btCylinderShape_setMargin_1 = function () {
        return (de = b._emscripten_bind_btCylinderShape_setMargin_1 =
          b.asm.kc).apply(null, arguments);
      }),
      ee = (b._emscripten_bind_btCylinderShape_getMargin_0 = function () {
        return (ee = b._emscripten_bind_btCylinderShape_getMargin_0 =
          b.asm.lc).apply(null, arguments);
      }),
      fe = (b._emscripten_bind_btCylinderShape_setLocalScaling_1 = function () {
        return (fe = b._emscripten_bind_btCylinderShape_setLocalScaling_1 =
          b.asm.mc).apply(null, arguments);
      }),
      ge = (b._emscripten_bind_btCylinderShape_getLocalScaling_0 = function () {
        return (ge = b._emscripten_bind_btCylinderShape_getLocalScaling_0 =
          b.asm.nc).apply(null, arguments);
      }),
      he = (b._emscripten_bind_btCylinderShape_calculateLocalInertia_2 =
        function () {
          return (he =
            b._emscripten_bind_btCylinderShape_calculateLocalInertia_2 =
              b.asm.oc).apply(null, arguments);
        }),
      ie = (b._emscripten_bind_btCylinderShape___destroy___0 = function () {
        return (ie = b._emscripten_bind_btCylinderShape___destroy___0 =
          b.asm.pc).apply(null, arguments);
      }),
      je = (b._emscripten_bind_btConeShape_btConeShape_2 = function () {
        return (je = b._emscripten_bind_btConeShape_btConeShape_2 =
          b.asm.qc).apply(null, arguments);
      }),
      ke = (b._emscripten_bind_btConeShape_setLocalScaling_1 = function () {
        return (ke = b._emscripten_bind_btConeShape_setLocalScaling_1 =
          b.asm.rc).apply(null, arguments);
      }),
      le = (b._emscripten_bind_btConeShape_getLocalScaling_0 = function () {
        return (le = b._emscripten_bind_btConeShape_getLocalScaling_0 =
          b.asm.sc).apply(null, arguments);
      }),
      me = (b._emscripten_bind_btConeShape_calculateLocalInertia_2 =
        function () {
          return (me = b._emscripten_bind_btConeShape_calculateLocalInertia_2 =
            b.asm.tc).apply(null, arguments);
        }),
      ne = (b._emscripten_bind_btConeShape___destroy___0 = function () {
        return (ne = b._emscripten_bind_btConeShape___destroy___0 =
          b.asm.uc).apply(null, arguments);
      }),
      oe = (b._emscripten_bind_btStridingMeshInterface_setScaling_1 =
        function () {
          return (oe = b._emscripten_bind_btStridingMeshInterface_setScaling_1 =
            b.asm.vc).apply(null, arguments);
        }),
      pe = (b._emscripten_bind_btStridingMeshInterface___destroy___0 =
        function () {
          return (pe =
            b._emscripten_bind_btStridingMeshInterface___destroy___0 =
              b.asm.wc).apply(null, arguments);
        }),
      qe = (b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 =
        function () {
          return (qe =
            b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 =
              b.asm.xc).apply(null, arguments);
        }),
      re = (b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 =
        function () {
          return (re =
            b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 =
              b.asm.yc).apply(null, arguments);
        }),
      se = (b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 =
        function () {
          return (se =
            b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 =
              b.asm.zc).apply(null, arguments);
        }),
      te = (b._emscripten_bind_btTriangleMeshShape___destroy___0 = function () {
        return (te = b._emscripten_bind_btTriangleMeshShape___destroy___0 =
          b.asm.Ac).apply(null, arguments);
      }),
      ue = (b._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 =
        function () {
          return (ue = b._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 =
            b.asm.Bc).apply(null, arguments);
        }),
      ve = (b._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 =
        function () {
          return (ve =
            b._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 =
              b.asm.Cc).apply(null, arguments);
        }),
      we = (b._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 =
        function () {
          return (we =
            b._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 =
              b.asm.Dc).apply(null, arguments);
        }),
      xe = (b._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 =
        function () {
          return (xe =
            b._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 =
              b.asm.Ec).apply(null, arguments);
        }),
      ye = (b._emscripten_bind_btPrimitiveManagerBase___destroy___0 =
        function () {
          return (ye = b._emscripten_bind_btPrimitiveManagerBase___destroy___0 =
            b.asm.Fc).apply(null, arguments);
        }),
      ze = (b._emscripten_bind_btGImpactShapeInterface_updateBound_0 =
        function () {
          return (ze =
            b._emscripten_bind_btGImpactShapeInterface_updateBound_0 =
              b.asm.Gc).apply(null, arguments);
        }),
      Ae = (b._emscripten_bind_btGImpactShapeInterface_postUpdate_0 =
        function () {
          return (Ae = b._emscripten_bind_btGImpactShapeInterface_postUpdate_0 =
            b.asm.Hc).apply(null, arguments);
        }),
      Be = (b._emscripten_bind_btGImpactShapeInterface_getShapeType_0 =
        function () {
          return (Be =
            b._emscripten_bind_btGImpactShapeInterface_getShapeType_0 =
              b.asm.Ic).apply(null, arguments);
        }),
      Ce = (b._emscripten_bind_btGImpactShapeInterface_getName_0 = function () {
        return (Ce = b._emscripten_bind_btGImpactShapeInterface_getName_0 =
          b.asm.Jc).apply(null, arguments);
      }),
      De = (b._emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0 =
        function () {
          return (De =
            b._emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0 =
              b.asm.Kc).apply(null, arguments);
        }),
      Ee = (b._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 =
        function () {
          return (Ee =
            b._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 =
              b.asm.Lc).apply(null, arguments);
        }),
      Fe = (b._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 =
        function () {
          return (Fe =
            b._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 =
              b.asm.Mc).apply(null, arguments);
        }),
      Ge = (b._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 =
        function () {
          return (Ge =
            b._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 =
              b.asm.Nc).apply(null, arguments);
        }),
      He =
        (b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 =
          function () {
            return (He =
              b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 =
                b.asm.Oc).apply(null, arguments);
          }),
      Ie =
        (b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 =
          function () {
            return (Ie =
              b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 =
                b.asm.Pc).apply(null, arguments);
          }),
      Je = (b._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 =
        function () {
          return (Je =
            b._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 =
              b.asm.Qc).apply(null, arguments);
        }),
      Ke = (b._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 =
        function () {
          return (Ke =
            b._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 =
              b.asm.Rc).apply(null, arguments);
        }),
      Le = (b._emscripten_bind_btGImpactShapeInterface_getChildShape_1 =
        function () {
          return (Le =
            b._emscripten_bind_btGImpactShapeInterface_getChildShape_1 =
              b.asm.Sc).apply(null, arguments);
        }),
      Me = (b._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 =
        function () {
          return (Me =
            b._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 =
              b.asm.Tc).apply(null, arguments);
        }),
      Ne = (b._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 =
        function () {
          return (Ne =
            b._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 =
              b.asm.Uc).apply(null, arguments);
        }),
      Oe = (b._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 =
        function () {
          return (Oe =
            b._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 =
              b.asm.Vc).apply(null, arguments);
        }),
      Pe = (b._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 =
        function () {
          return (Pe =
            b._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 =
              b.asm.Wc).apply(null, arguments);
        }),
      Qe = (b._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 =
        function () {
          return (Qe =
            b._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 =
              b.asm.Xc).apply(null, arguments);
        }),
      Re = (b._emscripten_bind_btGImpactShapeInterface___destroy___0 =
        function () {
          return (Re =
            b._emscripten_bind_btGImpactShapeInterface___destroy___0 =
              b.asm.Yc).apply(null, arguments);
        }),
      Se = (b._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 =
        function () {
          return (Se =
            b._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 =
              b.asm.Zc).apply(null, arguments);
        }),
      Te =
        (b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 =
          function () {
            return (Te =
              b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 =
                b.asm._c).apply(null, arguments);
          }),
      Ue =
        (b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 =
          function () {
            return (Ue =
              b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 =
                b.asm.$c).apply(null, arguments);
          }),
      Ve = (b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 =
        function () {
          return (Ve =
            b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 =
              b.asm.ad).apply(null, arguments);
        }),
      We = (b._emscripten_bind_btDispatcher_getNumManifolds_0 = function () {
        return (We = b._emscripten_bind_btDispatcher_getNumManifolds_0 =
          b.asm.bd).apply(null, arguments);
      }),
      Xe = (b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 =
        function () {
          return (Xe =
            b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 =
              b.asm.cd).apply(null, arguments);
        }),
      Ye = (b._emscripten_bind_btDispatcher___destroy___0 = function () {
        return (Ye = b._emscripten_bind_btDispatcher___destroy___0 =
          b.asm.dd).apply(null, arguments);
      }),
      Ze =
        (b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 =
          function () {
            return (Ze =
              b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 =
                b.asm.ed).apply(null, arguments);
          }),
      $e =
        (b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 =
          function () {
            return ($e =
              b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 =
                b.asm.fd).apply(null, arguments);
          }),
      af = (b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 =
        function () {
          return (af =
            b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 =
              b.asm.gd).apply(null, arguments);
        }),
      bf = (b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 =
        function () {
          return (bf =
            b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 =
              b.asm.hd).apply(null, arguments);
        }),
      cf = (b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 =
        function () {
          return (cf =
            b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 =
              b.asm.id).apply(null, arguments);
        }),
      df = (b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 =
        function () {
          return (df =
            b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 =
              b.asm.jd).apply(null, arguments);
        }),
      ef = (b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0 =
        function () {
          return (ef =
            b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0 =
              b.asm.kd).apply(null, arguments);
        }),
      ff = (b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 =
        function () {
          return (ff =
            b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 =
              b.asm.ld).apply(null, arguments);
        }),
      gf =
        (b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 =
          function () {
            return (gf =
              b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 =
                b.asm.md).apply(null, arguments);
          }),
      hf =
        (b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 =
          function () {
            return (hf =
              b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 =
                b.asm.nd).apply(null, arguments);
          }),
      jf = (b._emscripten_bind_btGeneric6DofConstraint_getParam_2 =
        function () {
          return (jf = b._emscripten_bind_btGeneric6DofConstraint_getParam_2 =
            b.asm.od).apply(null, arguments);
        }),
      kf = (b._emscripten_bind_btGeneric6DofConstraint_setParam_3 =
        function () {
          return (kf = b._emscripten_bind_btGeneric6DofConstraint_setParam_3 =
            b.asm.pd).apply(null, arguments);
        }),
      lf = (b._emscripten_bind_btGeneric6DofConstraint___destroy___0 =
        function () {
          return (lf =
            b._emscripten_bind_btGeneric6DofConstraint___destroy___0 =
              b.asm.qd).apply(null, arguments);
        }),
      mf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 =
          function () {
            return (mf =
              b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 =
                b.asm.rd).apply(null, arguments);
          }),
      nf = (b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 =
        function () {
          return (nf = b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 =
            b.asm.sd).apply(null, arguments);
        }),
      of = (b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 =
        function () {
          return (of = b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 =
            b.asm.td).apply(null, arguments);
        }),
      pf = (b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 =
        function () {
          return (pf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 =
              b.asm.ud).apply(null, arguments);
        }),
      qf = (b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 =
        function () {
          return (qf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 =
              b.asm.vd).apply(null, arguments);
        }),
      rf = (b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 =
        function () {
          return (rf =
            b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 =
              b.asm.wd).apply(null, arguments);
        }),
      sf = (b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 =
        function () {
          return (sf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 =
              b.asm.xd).apply(null, arguments);
        }),
      tf = (b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 =
        function () {
          return (tf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 =
              b.asm.yd).apply(null, arguments);
        }),
      uf = (b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 =
        function () {
          return (uf =
            b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 =
              b.asm.zd).apply(null, arguments);
        }),
      vf = (b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 =
        function () {
          return (vf =
            b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 =
              b.asm.Ad).apply(null, arguments);
        }),
      wf = (b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 =
        function () {
          return (wf =
            b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 =
              b.asm.Bd).apply(null, arguments);
        }),
      xf = (b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 =
        function () {
          return (xf =
            b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 =
              b.asm.Cd).apply(null, arguments);
        }),
      yf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 =
          function () {
            return (yf =
              b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 =
                b.asm.Dd).apply(null, arguments);
          }),
      zf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 =
          function () {
            return (zf =
              b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 =
                b.asm.Ed).apply(null, arguments);
          }),
      Af =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 =
          function () {
            return (Af =
              b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 =
                b.asm.Fd).apply(null, arguments);
          }),
      Bf = (b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 =
        function () {
          return (Bf =
            b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 =
              b.asm.Gd).apply(null, arguments);
        }),
      Cf = (b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = function () {
        return (Cf = b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 =
          b.asm.Hd).apply(null, arguments);
      }),
      Df = (b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 =
        function () {
          return (Df =
            b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 =
              b.asm.Id).apply(null, arguments);
        }),
      Ef = (b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 =
        function () {
          return (Ef =
            b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 =
              b.asm.Jd).apply(null, arguments);
        }),
      Ff = (b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 =
        function () {
          return (Ff =
            b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 =
              b.asm.Kd).apply(null, arguments);
        }),
      Gf = (b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 =
        function () {
          return (Gf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 =
              b.asm.Ld).apply(null, arguments);
        }),
      Hf = (b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 =
        function () {
          return (Hf =
            b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 =
              b.asm.Md).apply(null, arguments);
        }),
      If = (b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 =
        function () {
          return (If =
            b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 =
              b.asm.Nd).apply(null, arguments);
        }),
      Jf = (b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 =
        function () {
          return (Jf =
            b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 =
              b.asm.Od).apply(null, arguments);
        }),
      Kf = (b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 =
        function () {
          return (Kf =
            b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 =
              b.asm.Pd).apply(null, arguments);
        }),
      Lf = (b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 =
        function () {
          return (Lf =
            b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 =
              b.asm.Qd).apply(null, arguments);
        }),
      Mf = (b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 =
        function () {
          return (Mf =
            b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 =
              b.asm.Rd).apply(null, arguments);
        }),
      Nf = (b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 =
        function () {
          return (Nf =
            b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 =
              b.asm.Sd).apply(null, arguments);
        }),
      Of = (b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1 =
        function () {
          return (Of =
            b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1 =
              b.asm.Td).apply(null, arguments);
        }),
      Pf = (b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0 =
        function () {
          return (Pf =
            b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0 =
              b.asm.Ud).apply(null, arguments);
        }),
      Qf = (b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0 =
        function () {
          return (Qf =
            b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0 =
              b.asm.Vd).apply(null, arguments);
        }),
      Rf = (b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3 =
        function () {
          return (Rf =
            b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3 =
              b.asm.Wd).apply(null, arguments);
        }),
      Sf = (b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 =
        function () {
          return (Sf = b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 =
            b.asm.Xd).apply(null, arguments);
        }),
      Tf = (b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 =
        function () {
          return (Tf =
            b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 =
              b.asm.Yd).apply(null, arguments);
        }),
      Uf = (b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 =
        function () {
          return (Uf =
            b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 =
              b.asm.Zd).apply(null, arguments);
        }),
      Vf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 =
          function () {
            return (Vf =
              b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 =
                b.asm._d).apply(null, arguments);
          }),
      Wf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 =
          function () {
            return (Wf =
              b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 =
                b.asm.$d).apply(null, arguments);
          }),
      Xf =
        (b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 =
          function () {
            return (Xf =
              b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 =
                b.asm.ae).apply(null, arguments);
          }),
      Yf = (b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 =
        function () {
          return (Yf =
            b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 =
              b.asm.be).apply(null, arguments);
        }),
      Zf = (b._emscripten_bind_btVehicleRaycaster_castRay_3 = function () {
        return (Zf = b._emscripten_bind_btVehicleRaycaster_castRay_3 =
          b.asm.ce).apply(null, arguments);
      }),
      $f = (b._emscripten_bind_btVehicleRaycaster___destroy___0 = function () {
        return ($f = b._emscripten_bind_btVehicleRaycaster___destroy___0 =
          b.asm.de).apply(null, arguments);
      }),
      ag = (b._emscripten_bind_btActionInterface_updateAction_2 = function () {
        return (ag = b._emscripten_bind_btActionInterface_updateAction_2 =
          b.asm.ee).apply(null, arguments);
      }),
      bg = (b._emscripten_bind_btActionInterface___destroy___0 = function () {
        return (bg = b._emscripten_bind_btActionInterface___destroy___0 =
          b.asm.fe).apply(null, arguments);
      }),
      cg = (b._emscripten_bind_btGhostObject_btGhostObject_0 = function () {
        return (cg = b._emscripten_bind_btGhostObject_btGhostObject_0 =
          b.asm.ge).apply(null, arguments);
      }),
      dg = (b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0 =
        function () {
          return (dg =
            b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0 =
              b.asm.he).apply(null, arguments);
        }),
      eg = (b._emscripten_bind_btGhostObject_getOverlappingObject_1 =
        function () {
          return (eg = b._emscripten_bind_btGhostObject_getOverlappingObject_1 =
            b.asm.ie).apply(null, arguments);
        }),
      fg = (b._emscripten_bind_btGhostObject_setAnisotropicFriction_2 =
        function () {
          return (fg =
            b._emscripten_bind_btGhostObject_setAnisotropicFriction_2 =
              b.asm.je).apply(null, arguments);
        }),
      gg = (b._emscripten_bind_btGhostObject_getCollisionShape_0 = function () {
        return (gg = b._emscripten_bind_btGhostObject_getCollisionShape_0 =
          b.asm.ke).apply(null, arguments);
      }),
      hg = (b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1 =
        function () {
          return (hg =
            b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1 =
              b.asm.le).apply(null, arguments);
        }),
      ig = (b._emscripten_bind_btGhostObject_setActivationState_1 =
        function () {
          return (ig = b._emscripten_bind_btGhostObject_setActivationState_1 =
            b.asm.me).apply(null, arguments);
        }),
      jg = (b._emscripten_bind_btGhostObject_forceActivationState_1 =
        function () {
          return (jg = b._emscripten_bind_btGhostObject_forceActivationState_1 =
            b.asm.ne).apply(null, arguments);
        }),
      kg = (b._emscripten_bind_btGhostObject_activate_0 = function () {
        return (kg = b._emscripten_bind_btGhostObject_activate_0 =
          b.asm.oe).apply(null, arguments);
      }),
      lg = (b._emscripten_bind_btGhostObject_activate_1 = function () {
        return (lg = b._emscripten_bind_btGhostObject_activate_1 =
          b.asm.pe).apply(null, arguments);
      }),
      mg = (b._emscripten_bind_btGhostObject_isActive_0 = function () {
        return (mg = b._emscripten_bind_btGhostObject_isActive_0 =
          b.asm.qe).apply(null, arguments);
      }),
      ng = (b._emscripten_bind_btGhostObject_isKinematicObject_0 = function () {
        return (ng = b._emscripten_bind_btGhostObject_isKinematicObject_0 =
          b.asm.re).apply(null, arguments);
      }),
      og = (b._emscripten_bind_btGhostObject_isStaticObject_0 = function () {
        return (og = b._emscripten_bind_btGhostObject_isStaticObject_0 =
          b.asm.se).apply(null, arguments);
      }),
      pg = (b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 =
        function () {
          return (pg =
            b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 =
              b.asm.te).apply(null, arguments);
        }),
      qg = (b._emscripten_bind_btGhostObject_getRestitution_0 = function () {
        return (qg = b._emscripten_bind_btGhostObject_getRestitution_0 =
          b.asm.ue).apply(null, arguments);
      }),
      rg = (b._emscripten_bind_btGhostObject_getFriction_0 = function () {
        return (rg = b._emscripten_bind_btGhostObject_getFriction_0 =
          b.asm.ve).apply(null, arguments);
      }),
      sg = (b._emscripten_bind_btGhostObject_getRollingFriction_0 =
        function () {
          return (sg = b._emscripten_bind_btGhostObject_getRollingFriction_0 =
            b.asm.we).apply(null, arguments);
        }),
      tg = (b._emscripten_bind_btGhostObject_setRestitution_1 = function () {
        return (tg = b._emscripten_bind_btGhostObject_setRestitution_1 =
          b.asm.xe).apply(null, arguments);
      }),
      ug = (b._emscripten_bind_btGhostObject_setFriction_1 = function () {
        return (ug = b._emscripten_bind_btGhostObject_setFriction_1 =
          b.asm.ye).apply(null, arguments);
      }),
      vg = (b._emscripten_bind_btGhostObject_setRollingFriction_1 =
        function () {
          return (vg = b._emscripten_bind_btGhostObject_setRollingFriction_1 =
            b.asm.ze).apply(null, arguments);
        }),
      wg = (b._emscripten_bind_btGhostObject_getWorldTransform_0 = function () {
        return (wg = b._emscripten_bind_btGhostObject_getWorldTransform_0 =
          b.asm.Ae).apply(null, arguments);
      }),
      xg = (b._emscripten_bind_btGhostObject_getCollisionFlags_0 = function () {
        return (xg = b._emscripten_bind_btGhostObject_getCollisionFlags_0 =
          b.asm.Be).apply(null, arguments);
      }),
      yg = (b._emscripten_bind_btGhostObject_setCollisionFlags_1 = function () {
        return (yg = b._emscripten_bind_btGhostObject_setCollisionFlags_1 =
          b.asm.Ce).apply(null, arguments);
      }),
      zg = (b._emscripten_bind_btGhostObject_setWorldTransform_1 = function () {
        return (zg = b._emscripten_bind_btGhostObject_setWorldTransform_1 =
          b.asm.De).apply(null, arguments);
      }),
      Ag = (b._emscripten_bind_btGhostObject_setCollisionShape_1 = function () {
        return (Ag = b._emscripten_bind_btGhostObject_setCollisionShape_1 =
          b.asm.Ee).apply(null, arguments);
      }),
      Bg = (b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1 =
        function () {
          return (Bg =
            b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1 =
              b.asm.Fe).apply(null, arguments);
        }),
      Cg = (b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 =
        function () {
          return (Cg =
            b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 =
              b.asm.Ge).apply(null, arguments);
        }),
      Dg = (b._emscripten_bind_btGhostObject_getUserIndex_0 = function () {
        return (Dg = b._emscripten_bind_btGhostObject_getUserIndex_0 =
          b.asm.He).apply(null, arguments);
      }),
      Eg = (b._emscripten_bind_btGhostObject_setUserIndex_1 = function () {
        return (Eg = b._emscripten_bind_btGhostObject_setUserIndex_1 =
          b.asm.Ie).apply(null, arguments);
      }),
      Fg = (b._emscripten_bind_btGhostObject_getUserPointer_0 = function () {
        return (Fg = b._emscripten_bind_btGhostObject_getUserPointer_0 =
          b.asm.Je).apply(null, arguments);
      }),
      Gg = (b._emscripten_bind_btGhostObject_setUserPointer_1 = function () {
        return (Gg = b._emscripten_bind_btGhostObject_setUserPointer_1 =
          b.asm.Ke).apply(null, arguments);
      }),
      Hg = (b._emscripten_bind_btGhostObject_getBroadphaseHandle_0 =
        function () {
          return (Hg = b._emscripten_bind_btGhostObject_getBroadphaseHandle_0 =
            b.asm.Le).apply(null, arguments);
        }),
      Ig = (b._emscripten_bind_btGhostObject___destroy___0 = function () {
        return (Ig = b._emscripten_bind_btGhostObject___destroy___0 =
          b.asm.Me).apply(null, arguments);
      }),
      Jg = (b._emscripten_bind_btSoftBodySolver___destroy___0 = function () {
        return (Jg = b._emscripten_bind_btSoftBodySolver___destroy___0 =
          b.asm.Ne).apply(null, arguments);
      }),
      Kg = (b._emscripten_bind_VoidPtr___destroy___0 = function () {
        return (Kg = b._emscripten_bind_VoidPtr___destroy___0 = b.asm.Oe).apply(
          null,
          arguments
        );
      }),
      Lg = (b._emscripten_bind_DebugDrawer_DebugDrawer_0 = function () {
        return (Lg = b._emscripten_bind_DebugDrawer_DebugDrawer_0 =
          b.asm.Pe).apply(null, arguments);
      }),
      Mg = (b._emscripten_bind_DebugDrawer_drawLine_3 = function () {
        return (Mg = b._emscripten_bind_DebugDrawer_drawLine_3 =
          b.asm.Qe).apply(null, arguments);
      }),
      Ng = (b._emscripten_bind_DebugDrawer_drawContactPoint_5 = function () {
        return (Ng = b._emscripten_bind_DebugDrawer_drawContactPoint_5 =
          b.asm.Re).apply(null, arguments);
      }),
      Og = (b._emscripten_bind_DebugDrawer_reportErrorWarning_1 = function () {
        return (Og = b._emscripten_bind_DebugDrawer_reportErrorWarning_1 =
          b.asm.Se).apply(null, arguments);
      }),
      Pg = (b._emscripten_bind_DebugDrawer_draw3dText_2 = function () {
        return (Pg = b._emscripten_bind_DebugDrawer_draw3dText_2 =
          b.asm.Te).apply(null, arguments);
      }),
      Qg = (b._emscripten_bind_DebugDrawer_setDebugMode_1 = function () {
        return (Qg = b._emscripten_bind_DebugDrawer_setDebugMode_1 =
          b.asm.Ue).apply(null, arguments);
      }),
      Rg = (b._emscripten_bind_DebugDrawer_getDebugMode_0 = function () {
        return (Rg = b._emscripten_bind_DebugDrawer_getDebugMode_0 =
          b.asm.Ve).apply(null, arguments);
      }),
      Sg = (b._emscripten_bind_DebugDrawer___destroy___0 = function () {
        return (Sg = b._emscripten_bind_DebugDrawer___destroy___0 =
          b.asm.We).apply(null, arguments);
      }),
      Tg = (b._emscripten_bind_btVector4_btVector4_0 = function () {
        return (Tg = b._emscripten_bind_btVector4_btVector4_0 = b.asm.Xe).apply(
          null,
          arguments
        );
      }),
      Ug = (b._emscripten_bind_btVector4_btVector4_4 = function () {
        return (Ug = b._emscripten_bind_btVector4_btVector4_4 = b.asm.Ye).apply(
          null,
          arguments
        );
      }),
      Vg = (b._emscripten_bind_btVector4_w_0 = function () {
        return (Vg = b._emscripten_bind_btVector4_w_0 = b.asm.Ze).apply(
          null,
          arguments
        );
      }),
      Wg = (b._emscripten_bind_btVector4_setValue_4 = function () {
        return (Wg = b._emscripten_bind_btVector4_setValue_4 = b.asm._e).apply(
          null,
          arguments
        );
      }),
      Xg = (b._emscripten_bind_btVector4_length_0 = function () {
        return (Xg = b._emscripten_bind_btVector4_length_0 = b.asm.$e).apply(
          null,
          arguments
        );
      }),
      Yg = (b._emscripten_bind_btVector4_x_0 = function () {
        return (Yg = b._emscripten_bind_btVector4_x_0 = b.asm.af).apply(
          null,
          arguments
        );
      }),
      Zg = (b._emscripten_bind_btVector4_y_0 = function () {
        return (Zg = b._emscripten_bind_btVector4_y_0 = b.asm.bf).apply(
          null,
          arguments
        );
      }),
      $g = (b._emscripten_bind_btVector4_z_0 = function () {
        return ($g = b._emscripten_bind_btVector4_z_0 = b.asm.cf).apply(
          null,
          arguments
        );
      }),
      ah = (b._emscripten_bind_btVector4_setX_1 = function () {
        return (ah = b._emscripten_bind_btVector4_setX_1 = b.asm.df).apply(
          null,
          arguments
        );
      }),
      bh = (b._emscripten_bind_btVector4_setY_1 = function () {
        return (bh = b._emscripten_bind_btVector4_setY_1 = b.asm.ef).apply(
          null,
          arguments
        );
      }),
      ch = (b._emscripten_bind_btVector4_setZ_1 = function () {
        return (ch = b._emscripten_bind_btVector4_setZ_1 = b.asm.ff).apply(
          null,
          arguments
        );
      }),
      dh = (b._emscripten_bind_btVector4_normalize_0 = function () {
        return (dh = b._emscripten_bind_btVector4_normalize_0 = b.asm.gf).apply(
          null,
          arguments
        );
      }),
      eh = (b._emscripten_bind_btVector4_rotate_2 = function () {
        return (eh = b._emscripten_bind_btVector4_rotate_2 = b.asm.hf).apply(
          null,
          arguments
        );
      }),
      fh = (b._emscripten_bind_btVector4_dot_1 = function () {
        return (fh = b._emscripten_bind_btVector4_dot_1 = b.asm.jf).apply(
          null,
          arguments
        );
      }),
      gh = (b._emscripten_bind_btVector4_op_mul_1 = function () {
        return (gh = b._emscripten_bind_btVector4_op_mul_1 = b.asm.kf).apply(
          null,
          arguments
        );
      }),
      hh = (b._emscripten_bind_btVector4_op_add_1 = function () {
        return (hh = b._emscripten_bind_btVector4_op_add_1 = b.asm.lf).apply(
          null,
          arguments
        );
      }),
      ih = (b._emscripten_bind_btVector4_op_sub_1 = function () {
        return (ih = b._emscripten_bind_btVector4_op_sub_1 = b.asm.mf).apply(
          null,
          arguments
        );
      }),
      jh = (b._emscripten_bind_btVector4___destroy___0 = function () {
        return (jh = b._emscripten_bind_btVector4___destroy___0 =
          b.asm.nf).apply(null, arguments);
      }),
      kh = (b._emscripten_bind_btQuaternion_btQuaternion_4 = function () {
        return (kh = b._emscripten_bind_btQuaternion_btQuaternion_4 =
          b.asm.of).apply(null, arguments);
      }),
      lh = (b._emscripten_bind_btQuaternion_setValue_4 = function () {
        return (lh = b._emscripten_bind_btQuaternion_setValue_4 =
          b.asm.pf).apply(null, arguments);
      }),
      mh = (b._emscripten_bind_btQuaternion_setEulerZYX_3 = function () {
        return (mh = b._emscripten_bind_btQuaternion_setEulerZYX_3 =
          b.asm.qf).apply(null, arguments);
      }),
      nh = (b._emscripten_bind_btQuaternion_setRotation_2 = function () {
        return (nh = b._emscripten_bind_btQuaternion_setRotation_2 =
          b.asm.rf).apply(null, arguments);
      }),
      oh = (b._emscripten_bind_btQuaternion_normalize_0 = function () {
        return (oh = b._emscripten_bind_btQuaternion_normalize_0 =
          b.asm.sf).apply(null, arguments);
      }),
      ph = (b._emscripten_bind_btQuaternion_length2_0 = function () {
        return (ph = b._emscripten_bind_btQuaternion_length2_0 =
          b.asm.tf).apply(null, arguments);
      }),
      qh = (b._emscripten_bind_btQuaternion_length_0 = function () {
        return (qh = b._emscripten_bind_btQuaternion_length_0 = b.asm.uf).apply(
          null,
          arguments
        );
      }),
      rh = (b._emscripten_bind_btQuaternion_dot_1 = function () {
        return (rh = b._emscripten_bind_btQuaternion_dot_1 = b.asm.vf).apply(
          null,
          arguments
        );
      }),
      sh = (b._emscripten_bind_btQuaternion_normalized_0 = function () {
        return (sh = b._emscripten_bind_btQuaternion_normalized_0 =
          b.asm.wf).apply(null, arguments);
      }),
      th = (b._emscripten_bind_btQuaternion_getAxis_0 = function () {
        return (th = b._emscripten_bind_btQuaternion_getAxis_0 =
          b.asm.xf).apply(null, arguments);
      }),
      uh = (b._emscripten_bind_btQuaternion_inverse_0 = function () {
        return (uh = b._emscripten_bind_btQuaternion_inverse_0 =
          b.asm.yf).apply(null, arguments);
      }),
      vh = (b._emscripten_bind_btQuaternion_getAngle_0 = function () {
        return (vh = b._emscripten_bind_btQuaternion_getAngle_0 =
          b.asm.zf).apply(null, arguments);
      }),
      wh = (b._emscripten_bind_btQuaternion_getAngleShortestPath_0 =
        function () {
          return (wh = b._emscripten_bind_btQuaternion_getAngleShortestPath_0 =
            b.asm.Af).apply(null, arguments);
        }),
      xh = (b._emscripten_bind_btQuaternion_angle_1 = function () {
        return (xh = b._emscripten_bind_btQuaternion_angle_1 = b.asm.Bf).apply(
          null,
          arguments
        );
      }),
      yh = (b._emscripten_bind_btQuaternion_angleShortestPath_1 = function () {
        return (yh = b._emscripten_bind_btQuaternion_angleShortestPath_1 =
          b.asm.Cf).apply(null, arguments);
      }),
      zh = (b._emscripten_bind_btQuaternion_op_add_1 = function () {
        return (zh = b._emscripten_bind_btQuaternion_op_add_1 = b.asm.Df).apply(
          null,
          arguments
        );
      }),
      Ah = (b._emscripten_bind_btQuaternion_op_sub_1 = function () {
        return (Ah = b._emscripten_bind_btQuaternion_op_sub_1 = b.asm.Ef).apply(
          null,
          arguments
        );
      }),
      Bh = (b._emscripten_bind_btQuaternion_op_mul_1 = function () {
        return (Bh = b._emscripten_bind_btQuaternion_op_mul_1 = b.asm.Ff).apply(
          null,
          arguments
        );
      }),
      Ch = (b._emscripten_bind_btQuaternion_op_mulq_1 = function () {
        return (Ch = b._emscripten_bind_btQuaternion_op_mulq_1 =
          b.asm.Gf).apply(null, arguments);
      }),
      Dh = (b._emscripten_bind_btQuaternion_op_div_1 = function () {
        return (Dh = b._emscripten_bind_btQuaternion_op_div_1 = b.asm.Hf).apply(
          null,
          arguments
        );
      }),
      Eh = (b._emscripten_bind_btQuaternion_x_0 = function () {
        return (Eh = b._emscripten_bind_btQuaternion_x_0 = b.asm.If).apply(
          null,
          arguments
        );
      }),
      Fh = (b._emscripten_bind_btQuaternion_y_0 = function () {
        return (Fh = b._emscripten_bind_btQuaternion_y_0 = b.asm.Jf).apply(
          null,
          arguments
        );
      }),
      Gh = (b._emscripten_bind_btQuaternion_z_0 = function () {
        return (Gh = b._emscripten_bind_btQuaternion_z_0 = b.asm.Kf).apply(
          null,
          arguments
        );
      }),
      Hh = (b._emscripten_bind_btQuaternion_w_0 = function () {
        return (Hh = b._emscripten_bind_btQuaternion_w_0 = b.asm.Lf).apply(
          null,
          arguments
        );
      }),
      Ih = (b._emscripten_bind_btQuaternion_setX_1 = function () {
        return (Ih = b._emscripten_bind_btQuaternion_setX_1 = b.asm.Mf).apply(
          null,
          arguments
        );
      }),
      Jh = (b._emscripten_bind_btQuaternion_setY_1 = function () {
        return (Jh = b._emscripten_bind_btQuaternion_setY_1 = b.asm.Nf).apply(
          null,
          arguments
        );
      }),
      Kh = (b._emscripten_bind_btQuaternion_setZ_1 = function () {
        return (Kh = b._emscripten_bind_btQuaternion_setZ_1 = b.asm.Of).apply(
          null,
          arguments
        );
      }),
      Lh = (b._emscripten_bind_btQuaternion_setW_1 = function () {
        return (Lh = b._emscripten_bind_btQuaternion_setW_1 = b.asm.Pf).apply(
          null,
          arguments
        );
      }),
      Mh = (b._emscripten_bind_btQuaternion___destroy___0 = function () {
        return (Mh = b._emscripten_bind_btQuaternion___destroy___0 =
          b.asm.Qf).apply(null, arguments);
      }),
      Nh = (b._emscripten_bind_btMatrix3x3_setEulerZYX_3 = function () {
        return (Nh = b._emscripten_bind_btMatrix3x3_setEulerZYX_3 =
          b.asm.Rf).apply(null, arguments);
      }),
      Oh = (b._emscripten_bind_btMatrix3x3_getRotation_1 = function () {
        return (Oh = b._emscripten_bind_btMatrix3x3_getRotation_1 =
          b.asm.Sf).apply(null, arguments);
      }),
      Ph = (b._emscripten_bind_btMatrix3x3_getRow_1 = function () {
        return (Ph = b._emscripten_bind_btMatrix3x3_getRow_1 = b.asm.Tf).apply(
          null,
          arguments
        );
      }),
      Qh = (b._emscripten_bind_btMatrix3x3___destroy___0 = function () {
        return (Qh = b._emscripten_bind_btMatrix3x3___destroy___0 =
          b.asm.Uf).apply(null, arguments);
      }),
      Rh = (b._emscripten_bind_btTransform_btTransform_0 = function () {
        return (Rh = b._emscripten_bind_btTransform_btTransform_0 =
          b.asm.Vf).apply(null, arguments);
      }),
      Sh = (b._emscripten_bind_btTransform_btTransform_2 = function () {
        return (Sh = b._emscripten_bind_btTransform_btTransform_2 =
          b.asm.Wf).apply(null, arguments);
      }),
      Th = (b._emscripten_bind_btTransform_setIdentity_0 = function () {
        return (Th = b._emscripten_bind_btTransform_setIdentity_0 =
          b.asm.Xf).apply(null, arguments);
      }),
      Uh = (b._emscripten_bind_btTransform_setOrigin_1 = function () {
        return (Uh = b._emscripten_bind_btTransform_setOrigin_1 =
          b.asm.Yf).apply(null, arguments);
      }),
      Vh = (b._emscripten_bind_btTransform_setRotation_1 = function () {
        return (Vh = b._emscripten_bind_btTransform_setRotation_1 =
          b.asm.Zf).apply(null, arguments);
      }),
      Wh = (b._emscripten_bind_btTransform_getOrigin_0 = function () {
        return (Wh = b._emscripten_bind_btTransform_getOrigin_0 =
          b.asm._f).apply(null, arguments);
      }),
      Xh = (b._emscripten_bind_btTransform_getRotation_0 = function () {
        return (Xh = b._emscripten_bind_btTransform_getRotation_0 =
          b.asm.$f).apply(null, arguments);
      }),
      Yh = (b._emscripten_bind_btTransform_getBasis_0 = function () {
        return (Yh = b._emscripten_bind_btTransform_getBasis_0 =
          b.asm.ag).apply(null, arguments);
      }),
      Zh = (b._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = function () {
        return (Zh = b._emscripten_bind_btTransform_setFromOpenGLMatrix_1 =
          b.asm.bg).apply(null, arguments);
      }),
      $h = (b._emscripten_bind_btTransform_inverse_0 = function () {
        return ($h = b._emscripten_bind_btTransform_inverse_0 = b.asm.cg).apply(
          null,
          arguments
        );
      }),
      ai = (b._emscripten_bind_btTransform_op_mul_1 = function () {
        return (ai = b._emscripten_bind_btTransform_op_mul_1 = b.asm.dg).apply(
          null,
          arguments
        );
      }),
      bi = (b._emscripten_bind_btTransform___destroy___0 = function () {
        return (bi = b._emscripten_bind_btTransform___destroy___0 =
          b.asm.eg).apply(null, arguments);
      }),
      ci = (b._emscripten_bind_MotionState_MotionState_0 = function () {
        return (ci = b._emscripten_bind_MotionState_MotionState_0 =
          b.asm.fg).apply(null, arguments);
      }),
      di = (b._emscripten_bind_MotionState_getWorldTransform_1 = function () {
        return (di = b._emscripten_bind_MotionState_getWorldTransform_1 =
          b.asm.gg).apply(null, arguments);
      }),
      ei = (b._emscripten_bind_MotionState_setWorldTransform_1 = function () {
        return (ei = b._emscripten_bind_MotionState_setWorldTransform_1 =
          b.asm.hg).apply(null, arguments);
      }),
      fi = (b._emscripten_bind_MotionState___destroy___0 = function () {
        return (fi = b._emscripten_bind_MotionState___destroy___0 =
          b.asm.ig).apply(null, arguments);
      }),
      gi = (b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 =
        function () {
          return (gi =
            b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 =
              b.asm.jg).apply(null, arguments);
        }),
      hi = (b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 =
        function () {
          return (hi =
            b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 =
              b.asm.kg).apply(null, arguments);
        }),
      ii = (b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 =
        function () {
          return (ii =
            b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 =
              b.asm.lg).apply(null, arguments);
        }),
      ji = (b._emscripten_bind_btDefaultMotionState_getWorldTransform_1 =
        function () {
          return (ji =
            b._emscripten_bind_btDefaultMotionState_getWorldTransform_1 =
              b.asm.mg).apply(null, arguments);
        }),
      ki = (b._emscripten_bind_btDefaultMotionState_setWorldTransform_1 =
        function () {
          return (ki =
            b._emscripten_bind_btDefaultMotionState_setWorldTransform_1 =
              b.asm.ng).apply(null, arguments);
        }),
      li = (b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 =
        function () {
          return (li =
            b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 =
              b.asm.og).apply(null, arguments);
        }),
      mi = (b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 =
        function () {
          return (mi =
            b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 =
              b.asm.pg).apply(null, arguments);
        }),
      ni = (b._emscripten_bind_btDefaultMotionState___destroy___0 =
        function () {
          return (ni = b._emscripten_bind_btDefaultMotionState___destroy___0 =
            b.asm.qg).apply(null, arguments);
        }),
      oi = (b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 =
        function () {
          return (oi =
            b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 =
              b.asm.rg).apply(null, arguments);
        }),
      pi = (b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 =
        function () {
          return (pi =
            b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 =
              b.asm.sg).apply(null, arguments);
        }),
      qi = (b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 =
        function () {
          return (qi =
            b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 =
              b.asm.tg).apply(null, arguments);
        }),
      ri =
        (b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 =
          function () {
            return (ri =
              b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 =
                b.asm.ug).apply(null, arguments);
          }),
      si = (b._emscripten_bind_ClosestRayResultCallback_hasHit_0 = function () {
        return (si = b._emscripten_bind_ClosestRayResultCallback_hasHit_0 =
          b.asm.vg).apply(null, arguments);
      }),
      ti = (b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 =
        function () {
          return (ti =
            b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 =
              b.asm.wg).apply(null, arguments);
        }),
      ui = (b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 =
        function () {
          return (ui =
            b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 =
              b.asm.xg).apply(null, arguments);
        }),
      vi = (b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 =
        function () {
          return (vi =
            b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 =
              b.asm.yg).apply(null, arguments);
        }),
      wi = (b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 =
        function () {
          return (wi =
            b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 =
              b.asm.zg).apply(null, arguments);
        }),
      xi = (b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 =
        function () {
          return (xi =
            b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 =
              b.asm.Ag).apply(null, arguments);
        }),
      yi = (b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 =
        function () {
          return (yi =
            b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 =
              b.asm.Bg).apply(null, arguments);
        }),
      zi = (b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 =
        function () {
          return (zi =
            b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 =
              b.asm.Cg).apply(null, arguments);
        }),
      Ai = (b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 =
        function () {
          return (Ai =
            b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 =
              b.asm.Dg).apply(null, arguments);
        }),
      Bi =
        (b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 =
          function () {
            return (Bi =
              b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 =
                b.asm.Eg).apply(null, arguments);
          }),
      Ci =
        (b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 =
          function () {
            return (Ci =
              b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 =
                b.asm.Fg).apply(null, arguments);
          }),
      Di =
        (b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 =
          function () {
            return (Di =
              b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 =
                b.asm.Gg).apply(null, arguments);
          }),
      Ei =
        (b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 =
          function () {
            return (Ei =
              b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 =
                b.asm.Hg).apply(null, arguments);
          }),
      Fi =
        (b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 =
          function () {
            return (Fi =
              b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 =
                b.asm.Ig).apply(null, arguments);
          }),
      Gi =
        (b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 =
          function () {
            return (Gi =
              b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 =
                b.asm.Jg).apply(null, arguments);
          }),
      Hi =
        (b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 =
          function () {
            return (Hi =
              b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 =
                b.asm.Kg).apply(null, arguments);
          }),
      Ii =
        (b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 =
          function () {
            return (Ii =
              b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 =
                b.asm.Lg).apply(null, arguments);
          }),
      Ji = (b._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 =
        function () {
          return (Ji =
            b._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 =
              b.asm.Mg).apply(null, arguments);
        }),
      Ki = (b._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 =
        function () {
          return (Ki =
            b._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 =
              b.asm.Ng).apply(null, arguments);
        }),
      Li = (b._emscripten_bind_ClosestRayResultCallback___destroy___0 =
        function () {
          return (Li =
            b._emscripten_bind_ClosestRayResultCallback___destroy___0 =
              b.asm.Og).apply(null, arguments);
        }),
      Mi = (b._emscripten_bind_btConstCollisionObjectArray_size_0 =
        function () {
          return (Mi = b._emscripten_bind_btConstCollisionObjectArray_size_0 =
            b.asm.Pg).apply(null, arguments);
        }),
      Ni = (b._emscripten_bind_btConstCollisionObjectArray_at_1 = function () {
        return (Ni = b._emscripten_bind_btConstCollisionObjectArray_at_1 =
          b.asm.Qg).apply(null, arguments);
      }),
      Oi = (b._emscripten_bind_btConstCollisionObjectArray___destroy___0 =
        function () {
          return (Oi =
            b._emscripten_bind_btConstCollisionObjectArray___destroy___0 =
              b.asm.Rg).apply(null, arguments);
        }),
      Pi = (b._emscripten_bind_btScalarArray_size_0 = function () {
        return (Pi = b._emscripten_bind_btScalarArray_size_0 = b.asm.Sg).apply(
          null,
          arguments
        );
      }),
      Qi = (b._emscripten_bind_btScalarArray_at_1 = function () {
        return (Qi = b._emscripten_bind_btScalarArray_at_1 = b.asm.Tg).apply(
          null,
          arguments
        );
      }),
      Ri = (b._emscripten_bind_btScalarArray___destroy___0 = function () {
        return (Ri = b._emscripten_bind_btScalarArray___destroy___0 =
          b.asm.Ug).apply(null, arguments);
      }),
      Si =
        (b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 =
          function () {
            return (Si =
              b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 =
                b.asm.Vg).apply(null, arguments);
          }),
      Ti = (b._emscripten_bind_AllHitsRayResultCallback_hasHit_0 = function () {
        return (Ti = b._emscripten_bind_AllHitsRayResultCallback_hasHit_0 =
          b.asm.Wg).apply(null, arguments);
      }),
      Ui =
        (b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 =
          function () {
            return (Ui =
              b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 =
                b.asm.Xg).apply(null, arguments);
          }),
      Vi =
        (b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 =
          function () {
            return (Vi =
              b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 =
                b.asm.Yg).apply(null, arguments);
          }),
      Wi = (b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 =
        function () {
          return (Wi =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 =
              b.asm.Zg).apply(null, arguments);
        }),
      Xi = (b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 =
        function () {
          return (Xi =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 =
              b.asm._g).apply(null, arguments);
        }),
      Yi = (b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 =
        function () {
          return (Yi =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 =
              b.asm.$g).apply(null, arguments);
        }),
      Zi = (b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 =
        function () {
          return (Zi =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 =
              b.asm.ah).apply(null, arguments);
        }),
      $i = (b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 =
        function () {
          return ($i =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 =
              b.asm.bh).apply(null, arguments);
        }),
      aj = (b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 =
        function () {
          return (aj =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 =
              b.asm.ch).apply(null, arguments);
        }),
      bj = (b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 =
        function () {
          return (bj =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 =
              b.asm.dh).apply(null, arguments);
        }),
      cj = (b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 =
        function () {
          return (cj =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 =
              b.asm.eh).apply(null, arguments);
        }),
      dj = (b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 =
        function () {
          return (dj =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 =
              b.asm.fh).apply(null, arguments);
        }),
      ej = (b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 =
        function () {
          return (ej =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 =
              b.asm.gh).apply(null, arguments);
        }),
      fj =
        (b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 =
          function () {
            return (fj =
              b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 =
                b.asm.hh).apply(null, arguments);
          }),
      gj =
        (b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 =
          function () {
            return (gj =
              b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 =
                b.asm.ih).apply(null, arguments);
          }),
      hj =
        (b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 =
          function () {
            return (hj =
              b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 =
                b.asm.jh).apply(null, arguments);
          }),
      ij =
        (b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 =
          function () {
            return (ij =
              b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 =
                b.asm.kh).apply(null, arguments);
          }),
      jj =
        (b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 =
          function () {
            return (jj =
              b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 =
                b.asm.lh).apply(null, arguments);
          }),
      kj =
        (b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 =
          function () {
            return (kj =
              b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 =
                b.asm.mh).apply(null, arguments);
          }),
      lj =
        (b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 =
          function () {
            return (lj =
              b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 =
                b.asm.nh).apply(null, arguments);
          }),
      mj =
        (b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 =
          function () {
            return (mj =
              b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 =
                b.asm.oh).apply(null, arguments);
          }),
      nj = (b._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 =
        function () {
          return (nj =
            b._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 =
              b.asm.ph).apply(null, arguments);
        }),
      oj = (b._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 =
        function () {
          return (oj =
            b._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 =
              b.asm.qh).apply(null, arguments);
        }),
      pj = (b._emscripten_bind_AllHitsRayResultCallback___destroy___0 =
        function () {
          return (pj =
            b._emscripten_bind_AllHitsRayResultCallback___destroy___0 =
              b.asm.rh).apply(null, arguments);
        }),
      qj = (b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 =
        function () {
          return (qj =
            b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 =
              b.asm.sh).apply(null, arguments);
        }),
      rj = (b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 =
        function () {
          return (rj =
            b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 =
              b.asm.th).apply(null, arguments);
        }),
      sj = (b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 =
        function () {
          return (sj = b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 =
            b.asm.uh).apply(null, arguments);
        }),
      tj = (b._emscripten_bind_btManifoldPoint_getDistance_0 = function () {
        return (tj = b._emscripten_bind_btManifoldPoint_getDistance_0 =
          b.asm.vh).apply(null, arguments);
      }),
      uj = (b._emscripten_bind_btManifoldPoint_get_m_localPointA_0 =
        function () {
          return (uj = b._emscripten_bind_btManifoldPoint_get_m_localPointA_0 =
            b.asm.wh).apply(null, arguments);
        }),
      vj = (b._emscripten_bind_btManifoldPoint_set_m_localPointA_1 =
        function () {
          return (vj = b._emscripten_bind_btManifoldPoint_set_m_localPointA_1 =
            b.asm.xh).apply(null, arguments);
        }),
      wj = (b._emscripten_bind_btManifoldPoint_get_m_localPointB_0 =
        function () {
          return (wj = b._emscripten_bind_btManifoldPoint_get_m_localPointB_0 =
            b.asm.yh).apply(null, arguments);
        }),
      xj = (b._emscripten_bind_btManifoldPoint_set_m_localPointB_1 =
        function () {
          return (xj = b._emscripten_bind_btManifoldPoint_set_m_localPointB_1 =
            b.asm.zh).apply(null, arguments);
        }),
      yj = (b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 =
        function () {
          return (yj =
            b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 =
              b.asm.Ah).apply(null, arguments);
        }),
      zj = (b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 =
        function () {
          return (zj =
            b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 =
              b.asm.Bh).apply(null, arguments);
        }),
      Aj = (b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 =
        function () {
          return (Aj =
            b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 =
              b.asm.Ch).apply(null, arguments);
        }),
      Bj = (b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 =
        function () {
          return (Bj =
            b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 =
              b.asm.Dh).apply(null, arguments);
        }),
      Cj = (b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 =
        function () {
          return (Cj =
            b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 =
              b.asm.Eh).apply(null, arguments);
        }),
      Dj = (b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 =
        function () {
          return (Dj =
            b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 =
              b.asm.Fh).apply(null, arguments);
        }),
      Ej = (b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 =
        function () {
          return (Ej =
            b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 =
              b.asm.Gh).apply(null, arguments);
        }),
      Fj = (b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 =
        function () {
          return (Fj =
            b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 =
              b.asm.Hh).apply(null, arguments);
        }),
      Gj = (b._emscripten_bind_btManifoldPoint___destroy___0 = function () {
        return (Gj = b._emscripten_bind_btManifoldPoint___destroy___0 =
          b.asm.Ih).apply(null, arguments);
      }),
      Hj =
        (b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 =
          function () {
            return (Hj =
              b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 =
                b.asm.Jh).apply(null, arguments);
          }),
      Ij = (b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 =
        function () {
          return (Ij =
            b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 =
              b.asm.Kh).apply(null, arguments);
        }),
      Jj = (b._emscripten_bind_ConcreteContactResultCallback___destroy___0 =
        function () {
          return (Jj =
            b._emscripten_bind_ConcreteContactResultCallback___destroy___0 =
              b.asm.Lh).apply(null, arguments);
        }),
      Kj = (b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = function () {
        return (Kj = b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 =
          b.asm.Mh).apply(null, arguments);
      }),
      Lj = (b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = function () {
        return (Lj = b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 =
          b.asm.Nh).apply(null, arguments);
      }),
      Mj = (b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 =
        function () {
          return (Mj = b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 =
            b.asm.Oh).apply(null, arguments);
        }),
      Nj = (b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 =
        function () {
          return (Nj = b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 =
            b.asm.Ph).apply(null, arguments);
        }),
      Oj = (b._emscripten_bind_LocalShapeInfo___destroy___0 = function () {
        return (Oj = b._emscripten_bind_LocalShapeInfo___destroy___0 =
          b.asm.Qh).apply(null, arguments);
      }),
      Pj = (b._emscripten_bind_LocalConvexResult_LocalConvexResult_5 =
        function () {
          return (Pj =
            b._emscripten_bind_LocalConvexResult_LocalConvexResult_5 =
              b.asm.Rh).apply(null, arguments);
        }),
      Qj = (b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 =
        function () {
          return (Qj =
            b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 =
              b.asm.Sh).apply(null, arguments);
        }),
      Rj = (b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 =
        function () {
          return (Rj =
            b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 =
              b.asm.Th).apply(null, arguments);
        }),
      Sj = (b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 =
        function () {
          return (Sj =
            b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 =
              b.asm.Uh).apply(null, arguments);
        }),
      Tj = (b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 =
        function () {
          return (Tj =
            b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 =
              b.asm.Vh).apply(null, arguments);
        }),
      Uj = (b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 =
        function () {
          return (Uj =
            b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 =
              b.asm.Wh).apply(null, arguments);
        }),
      Vj = (b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 =
        function () {
          return (Vj =
            b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 =
              b.asm.Xh).apply(null, arguments);
        }),
      Wj = (b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 =
        function () {
          return (Wj =
            b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 =
              b.asm.Yh).apply(null, arguments);
        }),
      Xj = (b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 =
        function () {
          return (Xj =
            b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 =
              b.asm.Zh).apply(null, arguments);
        }),
      Yj = (b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 =
        function () {
          return (Yj =
            b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 =
              b.asm._h).apply(null, arguments);
        }),
      Zj = (b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 =
        function () {
          return (Zj =
            b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 =
              b.asm.$h).apply(null, arguments);
        }),
      ak = (b._emscripten_bind_LocalConvexResult___destroy___0 = function () {
        return (ak = b._emscripten_bind_LocalConvexResult___destroy___0 =
          b.asm.ai).apply(null, arguments);
      }),
      bk =
        (b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 =
          function () {
            return (bk =
              b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 =
                b.asm.bi).apply(null, arguments);
          }),
      ck = (b._emscripten_bind_ClosestConvexResultCallback_hasHit_0 =
        function () {
          return (ck = b._emscripten_bind_ClosestConvexResultCallback_hasHit_0 =
            b.asm.ci).apply(null, arguments);
        }),
      dk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 =
          function () {
            return (dk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 =
                b.asm.di).apply(null, arguments);
          }),
      ek =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 =
          function () {
            return (ek =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 =
                b.asm.ei).apply(null, arguments);
          }),
      fk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 =
          function () {
            return (fk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 =
                b.asm.fi).apply(null, arguments);
          }),
      gk =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 =
          function () {
            return (gk =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 =
                b.asm.gi).apply(null, arguments);
          }),
      hk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 =
          function () {
            return (hk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 =
                b.asm.hi).apply(null, arguments);
          }),
      ik =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 =
          function () {
            return (ik =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 =
                b.asm.ii).apply(null, arguments);
          }),
      jk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 =
          function () {
            return (jk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 =
                b.asm.ji).apply(null, arguments);
          }),
      kk =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 =
          function () {
            return (kk =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 =
                b.asm.ki).apply(null, arguments);
          }),
      lk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 =
          function () {
            return (lk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 =
                b.asm.li).apply(null, arguments);
          }),
      mk =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 =
          function () {
            return (mk =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 =
                b.asm.mi).apply(null, arguments);
          }),
      nk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 =
          function () {
            return (nk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 =
                b.asm.ni).apply(null, arguments);
          }),
      ok =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 =
          function () {
            return (ok =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 =
                b.asm.oi).apply(null, arguments);
          }),
      pk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 =
          function () {
            return (pk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 =
                b.asm.pi).apply(null, arguments);
          }),
      qk =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 =
          function () {
            return (qk =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 =
                b.asm.qi).apply(null, arguments);
          }),
      rk =
        (b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 =
          function () {
            return (rk =
              b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 =
                b.asm.ri).apply(null, arguments);
          }),
      sk =
        (b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 =
          function () {
            return (sk =
              b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 =
                b.asm.si).apply(null, arguments);
          }),
      tk = (b._emscripten_bind_ClosestConvexResultCallback___destroy___0 =
        function () {
          return (tk =
            b._emscripten_bind_ClosestConvexResultCallback___destroy___0 =
              b.asm.ti).apply(null, arguments);
        }),
      uk =
        (b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 =
          function () {
            return (uk =
              b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 =
                b.asm.ui).apply(null, arguments);
          }),
      vk =
        (b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 =
          function () {
            return (vk =
              b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 =
                b.asm.vi).apply(null, arguments);
          }),
      wk = (b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 =
        function () {
          return (wk =
            b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 =
              b.asm.wi).apply(null, arguments);
        }),
      xk = (b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 =
        function () {
          return (xk =
            b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 =
              b.asm.xi).apply(null, arguments);
        }),
      yk =
        (b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 =
          function () {
            return (yk =
              b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 =
                b.asm.yi).apply(null, arguments);
          }),
      zk = (b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 =
        function () {
          return (zk =
            b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 =
              b.asm.zi).apply(null, arguments);
        }),
      Ak = (b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 =
        function () {
          return (Ak =
            b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 =
              b.asm.Ai).apply(null, arguments);
        }),
      Bk = (b._emscripten_bind_btConvexTriangleMeshShape___destroy___0 =
        function () {
          return (Bk =
            b._emscripten_bind_btConvexTriangleMeshShape___destroy___0 =
              b.asm.Bi).apply(null, arguments);
        }),
      Ck = (b._emscripten_bind_btBoxShape_btBoxShape_1 = function () {
        return (Ck = b._emscripten_bind_btBoxShape_btBoxShape_1 =
          b.asm.Ci).apply(null, arguments);
      }),
      Dk = (b._emscripten_bind_btBoxShape_setMargin_1 = function () {
        return (Dk = b._emscripten_bind_btBoxShape_setMargin_1 =
          b.asm.Di).apply(null, arguments);
      }),
      Ek = (b._emscripten_bind_btBoxShape_getMargin_0 = function () {
        return (Ek = b._emscripten_bind_btBoxShape_getMargin_0 =
          b.asm.Ei).apply(null, arguments);
      }),
      Fk = (b._emscripten_bind_btBoxShape_setLocalScaling_1 = function () {
        return (Fk = b._emscripten_bind_btBoxShape_setLocalScaling_1 =
          b.asm.Fi).apply(null, arguments);
      }),
      Gk = (b._emscripten_bind_btBoxShape_getLocalScaling_0 = function () {
        return (Gk = b._emscripten_bind_btBoxShape_getLocalScaling_0 =
          b.asm.Gi).apply(null, arguments);
      }),
      Hk = (b._emscripten_bind_btBoxShape_calculateLocalInertia_2 =
        function () {
          return (Hk = b._emscripten_bind_btBoxShape_calculateLocalInertia_2 =
            b.asm.Hi).apply(null, arguments);
        }),
      Ik = (b._emscripten_bind_btBoxShape___destroy___0 = function () {
        return (Ik = b._emscripten_bind_btBoxShape___destroy___0 =
          b.asm.Ii).apply(null, arguments);
      }),
      Jk = (b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 = function () {
        return (Jk = b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 =
          b.asm.Ji).apply(null, arguments);
      }),
      Kk = (b._emscripten_bind_btCapsuleShapeX_setMargin_1 = function () {
        return (Kk = b._emscripten_bind_btCapsuleShapeX_setMargin_1 =
          b.asm.Ki).apply(null, arguments);
      }),
      Lk = (b._emscripten_bind_btCapsuleShapeX_getMargin_0 = function () {
        return (Lk = b._emscripten_bind_btCapsuleShapeX_getMargin_0 =
          b.asm.Li).apply(null, arguments);
      }),
      Mk = (b._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = function () {
        return (Mk = b._emscripten_bind_btCapsuleShapeX_getUpAxis_0 =
          b.asm.Mi).apply(null, arguments);
      }),
      Nk = (b._emscripten_bind_btCapsuleShapeX_getRadius_0 = function () {
        return (Nk = b._emscripten_bind_btCapsuleShapeX_getRadius_0 =
          b.asm.Ni).apply(null, arguments);
      }),
      Ok = (b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = function () {
        return (Ok = b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 =
          b.asm.Oi).apply(null, arguments);
      }),
      Pk = (b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = function () {
        return (Pk = b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 =
          b.asm.Pi).apply(null, arguments);
      }),
      Qk = (b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 = function () {
        return (Qk = b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 =
          b.asm.Qi).apply(null, arguments);
      }),
      Rk = (b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 =
        function () {
          return (Rk =
            b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 =
              b.asm.Ri).apply(null, arguments);
        }),
      Sk = (b._emscripten_bind_btCapsuleShapeX___destroy___0 = function () {
        return (Sk = b._emscripten_bind_btCapsuleShapeX___destroy___0 =
          b.asm.Si).apply(null, arguments);
      }),
      Tk = (b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = function () {
        return (Tk = b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 =
          b.asm.Ti).apply(null, arguments);
      }),
      Uk = (b._emscripten_bind_btCapsuleShapeZ_setMargin_1 = function () {
        return (Uk = b._emscripten_bind_btCapsuleShapeZ_setMargin_1 =
          b.asm.Ui).apply(null, arguments);
      }),
      Vk = (b._emscripten_bind_btCapsuleShapeZ_getMargin_0 = function () {
        return (Vk = b._emscripten_bind_btCapsuleShapeZ_getMargin_0 =
          b.asm.Vi).apply(null, arguments);
      }),
      Wk = (b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = function () {
        return (Wk = b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 =
          b.asm.Wi).apply(null, arguments);
      }),
      Xk = (b._emscripten_bind_btCapsuleShapeZ_getRadius_0 = function () {
        return (Xk = b._emscripten_bind_btCapsuleShapeZ_getRadius_0 =
          b.asm.Xi).apply(null, arguments);
      }),
      Yk = (b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = function () {
        return (Yk = b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 =
          b.asm.Yi).apply(null, arguments);
      }),
      Zk = (b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = function () {
        return (Zk = b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 =
          b.asm.Zi).apply(null, arguments);
      }),
      $k = (b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 = function () {
        return ($k = b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 =
          b.asm._i).apply(null, arguments);
      }),
      al = (b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 =
        function () {
          return (al =
            b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 =
              b.asm.$i).apply(null, arguments);
        }),
      bl = (b._emscripten_bind_btCapsuleShapeZ___destroy___0 = function () {
        return (bl = b._emscripten_bind_btCapsuleShapeZ___destroy___0 =
          b.asm.aj).apply(null, arguments);
      }),
      cl = (b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 =
        function () {
          return (cl = b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 =
            b.asm.bj).apply(null, arguments);
        }),
      dl = (b._emscripten_bind_btCylinderShapeX_setMargin_1 = function () {
        return (dl = b._emscripten_bind_btCylinderShapeX_setMargin_1 =
          b.asm.cj).apply(null, arguments);
      }),
      el = (b._emscripten_bind_btCylinderShapeX_getMargin_0 = function () {
        return (el = b._emscripten_bind_btCylinderShapeX_getMargin_0 =
          b.asm.dj).apply(null, arguments);
      }),
      fl = (b._emscripten_bind_btCylinderShapeX_setLocalScaling_1 =
        function () {
          return (fl = b._emscripten_bind_btCylinderShapeX_setLocalScaling_1 =
            b.asm.ej).apply(null, arguments);
        }),
      gl = (b._emscripten_bind_btCylinderShapeX_getLocalScaling_0 =
        function () {
          return (gl = b._emscripten_bind_btCylinderShapeX_getLocalScaling_0 =
            b.asm.fj).apply(null, arguments);
        }),
      hl = (b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 =
        function () {
          return (hl =
            b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 =
              b.asm.gj).apply(null, arguments);
        }),
      il = (b._emscripten_bind_btCylinderShapeX___destroy___0 = function () {
        return (il = b._emscripten_bind_btCylinderShapeX___destroy___0 =
          b.asm.hj).apply(null, arguments);
      }),
      jl = (b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 =
        function () {
          return (jl = b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 =
            b.asm.ij).apply(null, arguments);
        }),
      kl = (b._emscripten_bind_btCylinderShapeZ_setMargin_1 = function () {
        return (kl = b._emscripten_bind_btCylinderShapeZ_setMargin_1 =
          b.asm.jj).apply(null, arguments);
      }),
      ll = (b._emscripten_bind_btCylinderShapeZ_getMargin_0 = function () {
        return (ll = b._emscripten_bind_btCylinderShapeZ_getMargin_0 =
          b.asm.kj).apply(null, arguments);
      }),
      ml = (b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 =
        function () {
          return (ml = b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 =
            b.asm.lj).apply(null, arguments);
        }),
      nl = (b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 =
        function () {
          return (nl = b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 =
            b.asm.mj).apply(null, arguments);
        }),
      ol = (b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 =
        function () {
          return (ol =
            b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 =
              b.asm.nj).apply(null, arguments);
        }),
      pl = (b._emscripten_bind_btCylinderShapeZ___destroy___0 = function () {
        return (pl = b._emscripten_bind_btCylinderShapeZ___destroy___0 =
          b.asm.oj).apply(null, arguments);
      }),
      ql = (b._emscripten_bind_btSphereShape_btSphereShape_1 = function () {
        return (ql = b._emscripten_bind_btSphereShape_btSphereShape_1 =
          b.asm.pj).apply(null, arguments);
      }),
      rl = (b._emscripten_bind_btSphereShape_setMargin_1 = function () {
        return (rl = b._emscripten_bind_btSphereShape_setMargin_1 =
          b.asm.qj).apply(null, arguments);
      }),
      sl = (b._emscripten_bind_btSphereShape_getMargin_0 = function () {
        return (sl = b._emscripten_bind_btSphereShape_getMargin_0 =
          b.asm.rj).apply(null, arguments);
      }),
      tl = (b._emscripten_bind_btSphereShape_setLocalScaling_1 = function () {
        return (tl = b._emscripten_bind_btSphereShape_setLocalScaling_1 =
          b.asm.sj).apply(null, arguments);
      }),
      ul = (b._emscripten_bind_btSphereShape_getLocalScaling_0 = function () {
        return (ul = b._emscripten_bind_btSphereShape_getLocalScaling_0 =
          b.asm.tj).apply(null, arguments);
      }),
      vl = (b._emscripten_bind_btSphereShape_calculateLocalInertia_2 =
        function () {
          return (vl =
            b._emscripten_bind_btSphereShape_calculateLocalInertia_2 =
              b.asm.uj).apply(null, arguments);
        }),
      wl = (b._emscripten_bind_btSphereShape___destroy___0 = function () {
        return (wl = b._emscripten_bind_btSphereShape___destroy___0 =
          b.asm.vj).apply(null, arguments);
      }),
      xl = (b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 =
        function () {
          return (xl =
            b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 =
              b.asm.wj).apply(null, arguments);
        }),
      yl = (b._emscripten_bind_btMultiSphereShape_setLocalScaling_1 =
        function () {
          return (yl = b._emscripten_bind_btMultiSphereShape_setLocalScaling_1 =
            b.asm.xj).apply(null, arguments);
        }),
      zl = (b._emscripten_bind_btMultiSphereShape_getLocalScaling_0 =
        function () {
          return (zl = b._emscripten_bind_btMultiSphereShape_getLocalScaling_0 =
            b.asm.yj).apply(null, arguments);
        }),
      Al = (b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 =
        function () {
          return (Al =
            b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 =
              b.asm.zj).apply(null, arguments);
        }),
      Bl = (b._emscripten_bind_btMultiSphereShape___destroy___0 = function () {
        return (Bl = b._emscripten_bind_btMultiSphereShape___destroy___0 =
          b.asm.Aj).apply(null, arguments);
      }),
      Cl = (b._emscripten_bind_btConeShapeX_btConeShapeX_2 = function () {
        return (Cl = b._emscripten_bind_btConeShapeX_btConeShapeX_2 =
          b.asm.Bj).apply(null, arguments);
      }),
      Dl = (b._emscripten_bind_btConeShapeX_setLocalScaling_1 = function () {
        return (Dl = b._emscripten_bind_btConeShapeX_setLocalScaling_1 =
          b.asm.Cj).apply(null, arguments);
      }),
      El = (b._emscripten_bind_btConeShapeX_getLocalScaling_0 = function () {
        return (El = b._emscripten_bind_btConeShapeX_getLocalScaling_0 =
          b.asm.Dj).apply(null, arguments);
      }),
      Fl = (b._emscripten_bind_btConeShapeX_calculateLocalInertia_2 =
        function () {
          return (Fl = b._emscripten_bind_btConeShapeX_calculateLocalInertia_2 =
            b.asm.Ej).apply(null, arguments);
        }),
      Gl = (b._emscripten_bind_btConeShapeX___destroy___0 = function () {
        return (Gl = b._emscripten_bind_btConeShapeX___destroy___0 =
          b.asm.Fj).apply(null, arguments);
      }),
      Hl = (b._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = function () {
        return (Hl = b._emscripten_bind_btConeShapeZ_btConeShapeZ_2 =
          b.asm.Gj).apply(null, arguments);
      }),
      Il = (b._emscripten_bind_btConeShapeZ_setLocalScaling_1 = function () {
        return (Il = b._emscripten_bind_btConeShapeZ_setLocalScaling_1 =
          b.asm.Hj).apply(null, arguments);
      }),
      Jl = (b._emscripten_bind_btConeShapeZ_getLocalScaling_0 = function () {
        return (Jl = b._emscripten_bind_btConeShapeZ_getLocalScaling_0 =
          b.asm.Ij).apply(null, arguments);
      }),
      Kl = (b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 =
        function () {
          return (Kl = b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 =
            b.asm.Jj).apply(null, arguments);
        }),
      Ll = (b._emscripten_bind_btConeShapeZ___destroy___0 = function () {
        return (Ll = b._emscripten_bind_btConeShapeZ___destroy___0 =
          b.asm.Kj).apply(null, arguments);
      }),
      Ml = (b._emscripten_bind_btIntArray_size_0 = function () {
        return (Ml = b._emscripten_bind_btIntArray_size_0 = b.asm.Lj).apply(
          null,
          arguments
        );
      }),
      Nl = (b._emscripten_bind_btIntArray_at_1 = function () {
        return (Nl = b._emscripten_bind_btIntArray_at_1 = b.asm.Mj).apply(
          null,
          arguments
        );
      }),
      Ol = (b._emscripten_bind_btIntArray___destroy___0 = function () {
        return (Ol = b._emscripten_bind_btIntArray___destroy___0 =
          b.asm.Nj).apply(null, arguments);
      }),
      Pl = (b._emscripten_bind_btFace_get_m_indices_0 = function () {
        return (Pl = b._emscripten_bind_btFace_get_m_indices_0 =
          b.asm.Oj).apply(null, arguments);
      }),
      Ql = (b._emscripten_bind_btFace_set_m_indices_1 = function () {
        return (Ql = b._emscripten_bind_btFace_set_m_indices_1 =
          b.asm.Pj).apply(null, arguments);
      }),
      Rl = (b._emscripten_bind_btFace_get_m_plane_1 = function () {
        return (Rl = b._emscripten_bind_btFace_get_m_plane_1 = b.asm.Qj).apply(
          null,
          arguments
        );
      }),
      Sl = (b._emscripten_bind_btFace_set_m_plane_2 = function () {
        return (Sl = b._emscripten_bind_btFace_set_m_plane_2 = b.asm.Rj).apply(
          null,
          arguments
        );
      }),
      Tl = (b._emscripten_bind_btFace___destroy___0 = function () {
        return (Tl = b._emscripten_bind_btFace___destroy___0 = b.asm.Sj).apply(
          null,
          arguments
        );
      }),
      Ul = (b._emscripten_bind_btVector3Array_size_0 = function () {
        return (Ul = b._emscripten_bind_btVector3Array_size_0 = b.asm.Tj).apply(
          null,
          arguments
        );
      }),
      Vl = (b._emscripten_bind_btVector3Array_at_1 = function () {
        return (Vl = b._emscripten_bind_btVector3Array_at_1 = b.asm.Uj).apply(
          null,
          arguments
        );
      }),
      Wl = (b._emscripten_bind_btVector3Array___destroy___0 = function () {
        return (Wl = b._emscripten_bind_btVector3Array___destroy___0 =
          b.asm.Vj).apply(null, arguments);
      }),
      Xl = (b._emscripten_bind_btFaceArray_size_0 = function () {
        return (Xl = b._emscripten_bind_btFaceArray_size_0 = b.asm.Wj).apply(
          null,
          arguments
        );
      }),
      Yl = (b._emscripten_bind_btFaceArray_at_1 = function () {
        return (Yl = b._emscripten_bind_btFaceArray_at_1 = b.asm.Xj).apply(
          null,
          arguments
        );
      }),
      Zl = (b._emscripten_bind_btFaceArray___destroy___0 = function () {
        return (Zl = b._emscripten_bind_btFaceArray___destroy___0 =
          b.asm.Yj).apply(null, arguments);
      }),
      $l = (b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 =
        function () {
          return ($l = b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 =
            b.asm.Zj).apply(null, arguments);
        }),
      am = (b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 =
        function () {
          return (am = b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 =
            b.asm._j).apply(null, arguments);
        }),
      bm = (b._emscripten_bind_btConvexPolyhedron_get_m_faces_0 = function () {
        return (bm = b._emscripten_bind_btConvexPolyhedron_get_m_faces_0 =
          b.asm.$j).apply(null, arguments);
      }),
      cm = (b._emscripten_bind_btConvexPolyhedron_set_m_faces_1 = function () {
        return (cm = b._emscripten_bind_btConvexPolyhedron_set_m_faces_1 =
          b.asm.ak).apply(null, arguments);
      }),
      dm = (b._emscripten_bind_btConvexPolyhedron___destroy___0 = function () {
        return (dm = b._emscripten_bind_btConvexPolyhedron___destroy___0 =
          b.asm.bk).apply(null, arguments);
      }),
      em = (b._emscripten_bind_btConvexHullShape_btConvexHullShape_0 =
        function () {
          return (em =
            b._emscripten_bind_btConvexHullShape_btConvexHullShape_0 =
              b.asm.ck).apply(null, arguments);
        }),
      fm = (b._emscripten_bind_btConvexHullShape_btConvexHullShape_1 =
        function () {
          return (fm =
            b._emscripten_bind_btConvexHullShape_btConvexHullShape_1 =
              b.asm.dk).apply(null, arguments);
        }),
      gm = (b._emscripten_bind_btConvexHullShape_btConvexHullShape_2 =
        function () {
          return (gm =
            b._emscripten_bind_btConvexHullShape_btConvexHullShape_2 =
              b.asm.ek).apply(null, arguments);
        }),
      hm = (b._emscripten_bind_btConvexHullShape_addPoint_1 = function () {
        return (hm = b._emscripten_bind_btConvexHullShape_addPoint_1 =
          b.asm.fk).apply(null, arguments);
      }),
      im = (b._emscripten_bind_btConvexHullShape_addPoint_2 = function () {
        return (im = b._emscripten_bind_btConvexHullShape_addPoint_2 =
          b.asm.gk).apply(null, arguments);
      }),
      jm = (b._emscripten_bind_btConvexHullShape_setMargin_1 = function () {
        return (jm = b._emscripten_bind_btConvexHullShape_setMargin_1 =
          b.asm.hk).apply(null, arguments);
      }),
      km = (b._emscripten_bind_btConvexHullShape_getMargin_0 = function () {
        return (km = b._emscripten_bind_btConvexHullShape_getMargin_0 =
          b.asm.ik).apply(null, arguments);
      }),
      lm = (b._emscripten_bind_btConvexHullShape_getNumVertices_0 =
        function () {
          return (lm = b._emscripten_bind_btConvexHullShape_getNumVertices_0 =
            b.asm.jk).apply(null, arguments);
        }),
      mm =
        (b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1 =
          function () {
            return (mm =
              b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1 =
                b.asm.kk).apply(null, arguments);
          }),
      nm = (b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0 =
        function () {
          return (nm = b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0 =
            b.asm.lk).apply(null, arguments);
        }),
      om = (b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0 =
        function () {
          return (om =
            b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0 =
              b.asm.mk).apply(null, arguments);
        }),
      pm = (b._emscripten_bind_btConvexHullShape_setLocalScaling_1 =
        function () {
          return (pm = b._emscripten_bind_btConvexHullShape_setLocalScaling_1 =
            b.asm.nk).apply(null, arguments);
        }),
      qm = (b._emscripten_bind_btConvexHullShape_getLocalScaling_0 =
        function () {
          return (qm = b._emscripten_bind_btConvexHullShape_getLocalScaling_0 =
            b.asm.ok).apply(null, arguments);
        }),
      rm = (b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2 =
        function () {
          return (rm =
            b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2 =
              b.asm.pk).apply(null, arguments);
        }),
      sm = (b._emscripten_bind_btConvexHullShape___destroy___0 = function () {
        return (sm = b._emscripten_bind_btConvexHullShape___destroy___0 =
          b.asm.qk).apply(null, arguments);
      }),
      tm = (b._emscripten_bind_btShapeHull_btShapeHull_1 = function () {
        return (tm = b._emscripten_bind_btShapeHull_btShapeHull_1 =
          b.asm.rk).apply(null, arguments);
      }),
      um = (b._emscripten_bind_btShapeHull_buildHull_1 = function () {
        return (um = b._emscripten_bind_btShapeHull_buildHull_1 =
          b.asm.sk).apply(null, arguments);
      }),
      wm = (b._emscripten_bind_btShapeHull_numVertices_0 = function () {
        return (wm = b._emscripten_bind_btShapeHull_numVertices_0 =
          b.asm.tk).apply(null, arguments);
      }),
      xm = (b._emscripten_bind_btShapeHull_getVertexPointer_0 = function () {
        return (xm = b._emscripten_bind_btShapeHull_getVertexPointer_0 =
          b.asm.uk).apply(null, arguments);
      }),
      ym = (b._emscripten_bind_btShapeHull___destroy___0 = function () {
        return (ym = b._emscripten_bind_btShapeHull___destroy___0 =
          b.asm.vk).apply(null, arguments);
      }),
      zm = (b._emscripten_bind_btCompoundShape_btCompoundShape_0 = function () {
        return (zm = b._emscripten_bind_btCompoundShape_btCompoundShape_0 =
          b.asm.wk).apply(null, arguments);
      }),
      Am = (b._emscripten_bind_btCompoundShape_btCompoundShape_1 = function () {
        return (Am = b._emscripten_bind_btCompoundShape_btCompoundShape_1 =
          b.asm.xk).apply(null, arguments);
      }),
      Bm = (b._emscripten_bind_btCompoundShape_addChildShape_2 = function () {
        return (Bm = b._emscripten_bind_btCompoundShape_addChildShape_2 =
          b.asm.yk).apply(null, arguments);
      }),
      Cm = (b._emscripten_bind_btCompoundShape_removeChildShape_1 =
        function () {
          return (Cm = b._emscripten_bind_btCompoundShape_removeChildShape_1 =
            b.asm.zk).apply(null, arguments);
        }),
      Dm = (b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 =
        function () {
          return (Dm =
            b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 =
              b.asm.Ak).apply(null, arguments);
        }),
      Em = (b._emscripten_bind_btCompoundShape_getNumChildShapes_0 =
        function () {
          return (Em = b._emscripten_bind_btCompoundShape_getNumChildShapes_0 =
            b.asm.Bk).apply(null, arguments);
        }),
      Fm = (b._emscripten_bind_btCompoundShape_getChildShape_1 = function () {
        return (Fm = b._emscripten_bind_btCompoundShape_getChildShape_1 =
          b.asm.Ck).apply(null, arguments);
      }),
      Gm = (b._emscripten_bind_btCompoundShape_updateChildTransform_2 =
        function () {
          return (Gm =
            b._emscripten_bind_btCompoundShape_updateChildTransform_2 =
              b.asm.Dk).apply(null, arguments);
        }),
      Hm = (b._emscripten_bind_btCompoundShape_updateChildTransform_3 =
        function () {
          return (Hm =
            b._emscripten_bind_btCompoundShape_updateChildTransform_3 =
              b.asm.Ek).apply(null, arguments);
        }),
      Im = (b._emscripten_bind_btCompoundShape_setMargin_1 = function () {
        return (Im = b._emscripten_bind_btCompoundShape_setMargin_1 =
          b.asm.Fk).apply(null, arguments);
      }),
      Jm = (b._emscripten_bind_btCompoundShape_getMargin_0 = function () {
        return (Jm = b._emscripten_bind_btCompoundShape_getMargin_0 =
          b.asm.Gk).apply(null, arguments);
      }),
      Km = (b._emscripten_bind_btCompoundShape_setLocalScaling_1 = function () {
        return (Km = b._emscripten_bind_btCompoundShape_setLocalScaling_1 =
          b.asm.Hk).apply(null, arguments);
      }),
      Lm = (b._emscripten_bind_btCompoundShape_getLocalScaling_0 = function () {
        return (Lm = b._emscripten_bind_btCompoundShape_getLocalScaling_0 =
          b.asm.Ik).apply(null, arguments);
      }),
      Mm = (b._emscripten_bind_btCompoundShape_calculateLocalInertia_2 =
        function () {
          return (Mm =
            b._emscripten_bind_btCompoundShape_calculateLocalInertia_2 =
              b.asm.Jk).apply(null, arguments);
        }),
      Nm = (b._emscripten_bind_btCompoundShape___destroy___0 = function () {
        return (Nm = b._emscripten_bind_btCompoundShape___destroy___0 =
          b.asm.Kk).apply(null, arguments);
      }),
      Om = (b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 =
        function () {
          return (Om = b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 =
            b.asm.Lk).apply(null, arguments);
        }),
      Pm = (b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 =
        function () {
          return (Pm = b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 =
            b.asm.Mk).apply(null, arguments);
        }),
      Qm = (b._emscripten_bind_btIndexedMesh___destroy___0 = function () {
        return (Qm = b._emscripten_bind_btIndexedMesh___destroy___0 =
          b.asm.Nk).apply(null, arguments);
      }),
      Rm = (b._emscripten_bind_btIndexedMeshArray_size_0 = function () {
        return (Rm = b._emscripten_bind_btIndexedMeshArray_size_0 =
          b.asm.Ok).apply(null, arguments);
      }),
      Sm = (b._emscripten_bind_btIndexedMeshArray_at_1 = function () {
        return (Sm = b._emscripten_bind_btIndexedMeshArray_at_1 =
          b.asm.Pk).apply(null, arguments);
      }),
      Tm = (b._emscripten_bind_btIndexedMeshArray___destroy___0 = function () {
        return (Tm = b._emscripten_bind_btIndexedMeshArray___destroy___0 =
          b.asm.Qk).apply(null, arguments);
      }),
      Um = (b._emscripten_bind_btTriangleMesh_btTriangleMesh_0 = function () {
        return (Um = b._emscripten_bind_btTriangleMesh_btTriangleMesh_0 =
          b.asm.Rk).apply(null, arguments);
      }),
      Vm = (b._emscripten_bind_btTriangleMesh_btTriangleMesh_1 = function () {
        return (Vm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_1 =
          b.asm.Sk).apply(null, arguments);
      }),
      Wm = (b._emscripten_bind_btTriangleMesh_btTriangleMesh_2 = function () {
        return (Wm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_2 =
          b.asm.Tk).apply(null, arguments);
      }),
      Xm = (b._emscripten_bind_btTriangleMesh_addTriangle_3 = function () {
        return (Xm = b._emscripten_bind_btTriangleMesh_addTriangle_3 =
          b.asm.Uk).apply(null, arguments);
      }),
      Ym = (b._emscripten_bind_btTriangleMesh_addTriangle_4 = function () {
        return (Ym = b._emscripten_bind_btTriangleMesh_addTriangle_4 =
          b.asm.Vk).apply(null, arguments);
      }),
      Zm = (b._emscripten_bind_btTriangleMesh_findOrAddVertex_2 = function () {
        return (Zm = b._emscripten_bind_btTriangleMesh_findOrAddVertex_2 =
          b.asm.Wk).apply(null, arguments);
      }),
      $m = (b._emscripten_bind_btTriangleMesh_addIndex_1 = function () {
        return ($m = b._emscripten_bind_btTriangleMesh_addIndex_1 =
          b.asm.Xk).apply(null, arguments);
      }),
      an = (b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 =
        function () {
          return (an = b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 =
            b.asm.Yk).apply(null, arguments);
        }),
      bn = (b._emscripten_bind_btTriangleMesh_setScaling_1 = function () {
        return (bn = b._emscripten_bind_btTriangleMesh_setScaling_1 =
          b.asm.Zk).apply(null, arguments);
      }),
      cn = (b._emscripten_bind_btTriangleMesh___destroy___0 = function () {
        return (cn = b._emscripten_bind_btTriangleMesh___destroy___0 =
          b.asm._k).apply(null, arguments);
      }),
      dn = (b._emscripten_bind_btEmptyShape_btEmptyShape_0 = function () {
        return (dn = b._emscripten_bind_btEmptyShape_btEmptyShape_0 =
          b.asm.$k).apply(null, arguments);
      }),
      en = (b._emscripten_bind_btEmptyShape_setLocalScaling_1 = function () {
        return (en = b._emscripten_bind_btEmptyShape_setLocalScaling_1 =
          b.asm.al).apply(null, arguments);
      }),
      fn = (b._emscripten_bind_btEmptyShape_getLocalScaling_0 = function () {
        return (fn = b._emscripten_bind_btEmptyShape_getLocalScaling_0 =
          b.asm.bl).apply(null, arguments);
      }),
      gn = (b._emscripten_bind_btEmptyShape_calculateLocalInertia_2 =
        function () {
          return (gn = b._emscripten_bind_btEmptyShape_calculateLocalInertia_2 =
            b.asm.cl).apply(null, arguments);
        }),
      hn = (b._emscripten_bind_btEmptyShape___destroy___0 = function () {
        return (hn = b._emscripten_bind_btEmptyShape___destroy___0 =
          b.asm.dl).apply(null, arguments);
      }),
      jn = (b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 =
        function () {
          return (jn =
            b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 =
              b.asm.el).apply(null, arguments);
        }),
      kn = (b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 =
        function () {
          return (kn = b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 =
            b.asm.fl).apply(null, arguments);
        }),
      ln = (b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 =
        function () {
          return (ln = b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 =
            b.asm.gl).apply(null, arguments);
        }),
      mn = (b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 =
        function () {
          return (mn =
            b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 =
              b.asm.hl).apply(null, arguments);
        }),
      nn = (b._emscripten_bind_btStaticPlaneShape___destroy___0 = function () {
        return (nn = b._emscripten_bind_btStaticPlaneShape___destroy___0 =
          b.asm.il).apply(null, arguments);
      }),
      on = (b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 =
        function () {
          return (on =
            b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 =
              b.asm.jl).apply(null, arguments);
        }),
      pn = (b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 =
        function () {
          return (pn =
            b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 =
              b.asm.kl).apply(null, arguments);
        }),
      qn = (b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 =
        function () {
          return (qn =
            b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 =
              b.asm.ll).apply(null, arguments);
        }),
      rn = (b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 =
        function () {
          return (rn =
            b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 =
              b.asm.ml).apply(null, arguments);
        }),
      sn = (b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 =
        function () {
          return (sn =
            b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 =
              b.asm.nl).apply(null, arguments);
        }),
      tn = (b._emscripten_bind_btBvhTriangleMeshShape___destroy___0 =
        function () {
          return (tn = b._emscripten_bind_btBvhTriangleMeshShape___destroy___0 =
            b.asm.ol).apply(null, arguments);
        }),
      un =
        (b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 =
          function () {
            return (un =
              b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 =
                b.asm.pl).apply(null, arguments);
          }),
      vn = (b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1 =
        function () {
          return (vn =
            b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1 =
              b.asm.ql).apply(null, arguments);
        }),
      wn = (b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0 =
        function () {
          return (wn =
            b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0 =
              b.asm.rl).apply(null, arguments);
        }),
      xn = (b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 =
        function () {
          return (xn =
            b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 =
              b.asm.sl).apply(null, arguments);
        }),
      yn = (b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 =
        function () {
          return (yn =
            b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 =
              b.asm.tl).apply(null, arguments);
        }),
      zn =
        (b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 =
          function () {
            return (zn =
              b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 =
                b.asm.ul).apply(null, arguments);
          }),
      An = (b._emscripten_bind_btHeightfieldTerrainShape___destroy___0 =
        function () {
          return (An =
            b._emscripten_bind_btHeightfieldTerrainShape___destroy___0 =
              b.asm.vl).apply(null, arguments);
        }),
      Bn = (b._emscripten_bind_btAABB_btAABB_4 = function () {
        return (Bn = b._emscripten_bind_btAABB_btAABB_4 = b.asm.wl).apply(
          null,
          arguments
        );
      }),
      Cn = (b._emscripten_bind_btAABB_invalidate_0 = function () {
        return (Cn = b._emscripten_bind_btAABB_invalidate_0 = b.asm.xl).apply(
          null,
          arguments
        );
      }),
      Dn = (b._emscripten_bind_btAABB_increment_margin_1 = function () {
        return (Dn = b._emscripten_bind_btAABB_increment_margin_1 =
          b.asm.yl).apply(null, arguments);
      }),
      En = (b._emscripten_bind_btAABB_copy_with_margin_2 = function () {
        return (En = b._emscripten_bind_btAABB_copy_with_margin_2 =
          b.asm.zl).apply(null, arguments);
      }),
      Fn = (b._emscripten_bind_btAABB___destroy___0 = function () {
        return (Fn = b._emscripten_bind_btAABB___destroy___0 = b.asm.Al).apply(
          null,
          arguments
        );
      }),
      Gn = (b._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 =
        function () {
          return (Gn =
            b._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 =
              b.asm.Bl).apply(null, arguments);
        }),
      Hn = (b._emscripten_bind_btPrimitiveTriangle___destroy___0 = function () {
        return (Hn = b._emscripten_bind_btPrimitiveTriangle___destroy___0 =
          b.asm.Cl).apply(null, arguments);
      }),
      In = (b._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 =
        function () {
          return (In =
            b._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 =
              b.asm.Dl).apply(null, arguments);
        }),
      Jn = (b._emscripten_bind_btTriangleShapeEx_getAabb_3 = function () {
        return (Jn = b._emscripten_bind_btTriangleShapeEx_getAabb_3 =
          b.asm.El).apply(null, arguments);
      }),
      Kn = (b._emscripten_bind_btTriangleShapeEx_applyTransform_1 =
        function () {
          return (Kn = b._emscripten_bind_btTriangleShapeEx_applyTransform_1 =
            b.asm.Fl).apply(null, arguments);
        }),
      Ln = (b._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 = function () {
        return (Ln = b._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 =
          b.asm.Gl).apply(null, arguments);
      }),
      Mn = (b._emscripten_bind_btTriangleShapeEx___destroy___0 = function () {
        return (Mn = b._emscripten_bind_btTriangleShapeEx___destroy___0 =
          b.asm.Hl).apply(null, arguments);
      }),
      Nn = (b._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 =
        function () {
          return (Nn =
            b._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 =
              b.asm.Il).apply(null, arguments);
        }),
      On = (b._emscripten_bind_btTetrahedronShapeEx_setVertices_4 =
        function () {
          return (On = b._emscripten_bind_btTetrahedronShapeEx_setVertices_4 =
            b.asm.Jl).apply(null, arguments);
        }),
      Pn = (b._emscripten_bind_btTetrahedronShapeEx___destroy___0 =
        function () {
          return (Pn = b._emscripten_bind_btTetrahedronShapeEx___destroy___0 =
            b.asm.Kl).apply(null, arguments);
        }),
      Qn = (b._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 =
        function () {
          return (Qn =
            b._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 =
              b.asm.Ll).apply(null, arguments);
        }),
      Rn = (b._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 =
        function () {
          return (Rn =
            b._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 =
              b.asm.Ml).apply(null, arguments);
        }),
      Sn =
        (b._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 =
          function () {
            return (Sn =
              b._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 =
                b.asm.Nl).apply(null, arguments);
          }),
      Tn = (b._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 =
        function () {
          return (Tn =
            b._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 =
              b.asm.Ol).apply(null, arguments);
        }),
      Un = (b._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 =
        function () {
          return (Un =
            b._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 =
              b.asm.Pl).apply(null, arguments);
        }),
      Vn = (b._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 =
        function () {
          return (Vn =
            b._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 =
              b.asm.Ql).apply(null, arguments);
        }),
      Wn = (b._emscripten_bind_CompoundPrimitiveManager___destroy___0 =
        function () {
          return (Wn =
            b._emscripten_bind_CompoundPrimitiveManager___destroy___0 =
              b.asm.Rl).apply(null, arguments);
        }),
      Xn = (b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 =
        function () {
          return (Xn =
            b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 =
              b.asm.Sl).apply(null, arguments);
        }),
      Yn = (b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 =
        function () {
          return (Yn =
            b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 =
              b.asm.Tl).apply(null, arguments);
        }),
      Zn = (b._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 =
        function () {
          return (Zn =
            b._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 =
              b.asm.Ul).apply(null, arguments);
        }),
      $n = (b._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 =
        function () {
          return ($n =
            b._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 =
              b.asm.Vl).apply(null, arguments);
        }),
      ao =
        (b._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 =
          function () {
            return (ao =
              b._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 =
                b.asm.Wl).apply(null, arguments);
          }),
      bo = (b._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 =
        function () {
          return (bo =
            b._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 =
              b.asm.Xl).apply(null, arguments);
        }),
      co = (b._emscripten_bind_btGImpactCompoundShape_addChildShape_2 =
        function () {
          return (co =
            b._emscripten_bind_btGImpactCompoundShape_addChildShape_2 =
              b.asm.Yl).apply(null, arguments);
        }),
      eo = (b._emscripten_bind_btGImpactCompoundShape_getChildShape_1 =
        function () {
          return (eo =
            b._emscripten_bind_btGImpactCompoundShape_getChildShape_1 =
              b.asm.Zl).apply(null, arguments);
        }),
      fo = (b._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 =
        function () {
          return (fo =
            b._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 =
              b.asm._l).apply(null, arguments);
        }),
      go = (b._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 =
        function () {
          return (go =
            b._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 =
              b.asm.$l).apply(null, arguments);
        }),
      ho = (b._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 =
        function () {
          return (ho =
            b._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 =
              b.asm.am).apply(null, arguments);
        }),
      io = (b._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 =
        function () {
          return (io =
            b._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 =
              b.asm.bm).apply(null, arguments);
        }),
      jo = (b._emscripten_bind_btGImpactCompoundShape_getName_0 = function () {
        return (jo = b._emscripten_bind_btGImpactCompoundShape_getName_0 =
          b.asm.cm).apply(null, arguments);
      }),
      ko = (b._emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0 =
        function () {
          return (ko =
            b._emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0 =
              b.asm.dm).apply(null, arguments);
        }),
      lo = (b._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 =
        function () {
          return (lo =
            b._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 =
              b.asm.em).apply(null, arguments);
        }),
      mo = (b._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 =
        function () {
          return (mo =
            b._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 =
              b.asm.fm).apply(null, arguments);
        }),
      no = (b._emscripten_bind_btGImpactCompoundShape_updateBound_0 =
        function () {
          return (no = b._emscripten_bind_btGImpactCompoundShape_updateBound_0 =
            b.asm.gm).apply(null, arguments);
        }),
      oo = (b._emscripten_bind_btGImpactCompoundShape_postUpdate_0 =
        function () {
          return (oo = b._emscripten_bind_btGImpactCompoundShape_postUpdate_0 =
            b.asm.hm).apply(null, arguments);
        }),
      po = (b._emscripten_bind_btGImpactCompoundShape_getShapeType_0 =
        function () {
          return (po =
            b._emscripten_bind_btGImpactCompoundShape_getShapeType_0 =
              b.asm.im).apply(null, arguments);
        }),
      qo = (b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 =
        function () {
          return (qo =
            b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 =
              b.asm.jm).apply(null, arguments);
        }),
      ro =
        (b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 =
          function () {
            return (ro =
              b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 =
                b.asm.km).apply(null, arguments);
          }),
      so = (b._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 =
        function () {
          return (so =
            b._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 =
              b.asm.lm).apply(null, arguments);
        }),
      to = (b._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 =
        function () {
          return (to =
            b._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 =
              b.asm.mm).apply(null, arguments);
        }),
      uo = (b._emscripten_bind_btGImpactCompoundShape___destroy___0 =
        function () {
          return (uo = b._emscripten_bind_btGImpactCompoundShape___destroy___0 =
            b.asm.nm).apply(null, arguments);
        }),
      vo =
        (b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 =
          function () {
            return (vo =
              b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 =
                b.asm.om).apply(null, arguments);
          }),
      wo =
        (b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 =
          function () {
            return (wo =
              b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 =
                b.asm.pm).apply(null, arguments);
          }),
      xo = (b._emscripten_bind_TrimeshPrimitiveManager_lock_0 = function () {
        return (xo = b._emscripten_bind_TrimeshPrimitiveManager_lock_0 =
          b.asm.qm).apply(null, arguments);
      }),
      yo = (b._emscripten_bind_TrimeshPrimitiveManager_unlock_0 = function () {
        return (yo = b._emscripten_bind_TrimeshPrimitiveManager_unlock_0 =
          b.asm.rm).apply(null, arguments);
      }),
      zo = (b._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 =
        function () {
          return (zo = b._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 =
            b.asm.sm).apply(null, arguments);
        }),
      Ao = (b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 =
        function () {
          return (Ao =
            b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 =
              b.asm.tm).apply(null, arguments);
        }),
      Bo = (b._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 =
        function () {
          return (Bo =
            b._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 =
              b.asm.um).apply(null, arguments);
        }),
      Co = (b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 =
        function () {
          return (Co = b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 =
            b.asm.vm).apply(null, arguments);
        }),
      Do = (b._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 =
        function () {
          return (Do =
            b._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 =
              b.asm.wm).apply(null, arguments);
        }),
      Eo = (b._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 =
        function () {
          return (Eo =
            b._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 =
              b.asm.xm).apply(null, arguments);
        }),
      Fo = (b._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 =
        function () {
          return (Fo =
            b._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 =
              b.asm.ym).apply(null, arguments);
        }),
      Go = (b._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 =
        function () {
          return (Go =
            b._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 =
              b.asm.zm).apply(null, arguments);
        }),
      Ho = (b._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 =
        function () {
          return (Ho =
            b._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 =
              b.asm.Am).apply(null, arguments);
        }),
      Io = (b._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 =
        function () {
          return (Io = b._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 =
            b.asm.Bm).apply(null, arguments);
        }),
      Jo = (b._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 =
        function () {
          return (Jo = b._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 =
            b.asm.Cm).apply(null, arguments);
        }),
      Ko = (b._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 =
        function () {
          return (Ko =
            b._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 =
              b.asm.Dm).apply(null, arguments);
        }),
      Lo = (b._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 =
        function () {
          return (Lo =
            b._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 =
              b.asm.Em).apply(null, arguments);
        }),
      Mo = (b._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 =
        function () {
          return (Mo =
            b._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 =
              b.asm.Fm).apply(null, arguments);
        }),
      No = (b._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 =
        function () {
          return (No =
            b._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 =
              b.asm.Gm).apply(null, arguments);
        }),
      Oo = (b._emscripten_bind_TrimeshPrimitiveManager_get_type_0 =
        function () {
          return (Oo = b._emscripten_bind_TrimeshPrimitiveManager_get_type_0 =
            b.asm.Hm).apply(null, arguments);
        }),
      Po = (b._emscripten_bind_TrimeshPrimitiveManager_set_type_1 =
        function () {
          return (Po = b._emscripten_bind_TrimeshPrimitiveManager_set_type_1 =
            b.asm.Im).apply(null, arguments);
        }),
      Qo = (b._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 =
        function () {
          return (Qo = b._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 =
            b.asm.Jm).apply(null, arguments);
        }),
      Ro = (b._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 =
        function () {
          return (Ro = b._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 =
            b.asm.Km).apply(null, arguments);
        }),
      So = (b._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 =
        function () {
          return (So =
            b._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 =
              b.asm.Lm).apply(null, arguments);
        }),
      To = (b._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 =
        function () {
          return (To =
            b._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 =
              b.asm.Mm).apply(null, arguments);
        }),
      Uo = (b._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 =
        function () {
          return (Uo =
            b._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 =
              b.asm.Nm).apply(null, arguments);
        }),
      Vo = (b._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 =
        function () {
          return (Vo =
            b._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 =
              b.asm.Om).apply(null, arguments);
        }),
      Wo = (b._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 =
        function () {
          return (Wo =
            b._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 =
              b.asm.Pm).apply(null, arguments);
        }),
      Xo = (b._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 =
        function () {
          return (Xo =
            b._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 =
              b.asm.Qm).apply(null, arguments);
        }),
      Yo = (b._emscripten_bind_TrimeshPrimitiveManager___destroy___0 =
        function () {
          return (Yo =
            b._emscripten_bind_TrimeshPrimitiveManager___destroy___0 =
              b.asm.Rm).apply(null, arguments);
        }),
      Zo = (b._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 =
        function () {
          return (Zo =
            b._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 =
              b.asm.Sm).apply(null, arguments);
        }),
      $o =
        (b._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 =
          function () {
            return ($o =
              b._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 =
                b.asm.Tm).apply(null, arguments);
          }),
      ap = (b._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 =
        function () {
          return (ap =
            b._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 =
              b.asm.Um).apply(null, arguments);
        }),
      bp = (b._emscripten_bind_btGImpactMeshShapePart_getVertex_2 =
        function () {
          return (bp = b._emscripten_bind_btGImpactMeshShapePart_getVertex_2 =
            b.asm.Vm).apply(null, arguments);
        }),
      cp = (b._emscripten_bind_btGImpactMeshShapePart_getPart_0 = function () {
        return (cp = b._emscripten_bind_btGImpactMeshShapePart_getPart_0 =
          b.asm.Wm).apply(null, arguments);
      }),
      dp = (b._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 =
        function () {
          return (dp =
            b._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 =
              b.asm.Xm).apply(null, arguments);
        }),
      ep = (b._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 =
        function () {
          return (ep =
            b._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 =
              b.asm.Ym).apply(null, arguments);
        }),
      fp = (b._emscripten_bind_btGImpactMeshShapePart_updateBound_0 =
        function () {
          return (fp = b._emscripten_bind_btGImpactMeshShapePart_updateBound_0 =
            b.asm.Zm).apply(null, arguments);
        }),
      gp = (b._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 =
        function () {
          return (gp = b._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 =
            b.asm._m).apply(null, arguments);
        }),
      hp = (b._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 =
        function () {
          return (hp =
            b._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 =
              b.asm.$m).apply(null, arguments);
        }),
      ip = (b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 =
        function () {
          return (ip =
            b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 =
              b.asm.an).apply(null, arguments);
        }),
      jp =
        (b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 =
          function () {
            return (jp =
              b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 =
                b.asm.bn).apply(null, arguments);
          }),
      kp = (b._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 =
        function () {
          return (kp =
            b._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 =
              b.asm.cn).apply(null, arguments);
        }),
      lp = (b._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 =
        function () {
          return (lp =
            b._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 =
              b.asm.dn).apply(null, arguments);
        }),
      mp = (b._emscripten_bind_btGImpactMeshShapePart___destroy___0 =
        function () {
          return (mp = b._emscripten_bind_btGImpactMeshShapePart___destroy___0 =
            b.asm.en).apply(null, arguments);
        }),
      np = (b._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 =
        function () {
          return (np =
            b._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 =
              b.asm.fn).apply(null, arguments);
        }),
      op = (b._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 =
        function () {
          return (op =
            b._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 =
              b.asm.gn).apply(null, arguments);
        }),
      pp = (b._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 =
        function () {
          return (pp =
            b._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 =
              b.asm.hn).apply(null, arguments);
        }),
      qp = (b._emscripten_bind_btGImpactMeshShape_getMeshPart_1 = function () {
        return (qp = b._emscripten_bind_btGImpactMeshShape_getMeshPart_1 =
          b.asm.jn).apply(null, arguments);
      }),
      rp =
        (b._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 =
          function () {
            return (rp =
              b._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 =
                b.asm.kn).apply(null, arguments);
          }),
      sp = (b._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 =
        function () {
          return (sp = b._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 =
            b.asm.ln).apply(null, arguments);
        }),
      tp = (b._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 =
        function () {
          return (tp = b._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 =
            b.asm.mn).apply(null, arguments);
        }),
      up = (b._emscripten_bind_btGImpactMeshShape_updateBound_0 = function () {
        return (up = b._emscripten_bind_btGImpactMeshShape_updateBound_0 =
          b.asm.nn).apply(null, arguments);
      }),
      vp = (b._emscripten_bind_btGImpactMeshShape_postUpdate_0 = function () {
        return (vp = b._emscripten_bind_btGImpactMeshShape_postUpdate_0 =
          b.asm.on).apply(null, arguments);
      }),
      wp = (b._emscripten_bind_btGImpactMeshShape_getShapeType_0 = function () {
        return (wp = b._emscripten_bind_btGImpactMeshShape_getShapeType_0 =
          b.asm.pn).apply(null, arguments);
      }),
      xp = (b._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 =
        function () {
          return (xp =
            b._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 =
              b.asm.qn).apply(null, arguments);
        }),
      yp = (b._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 =
        function () {
          return (yp =
            b._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 =
              b.asm.rn).apply(null, arguments);
        }),
      zp = (b._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 =
        function () {
          return (zp =
            b._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 =
              b.asm.sn).apply(null, arguments);
        }),
      Ap = (b._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 =
        function () {
          return (Ap =
            b._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 =
              b.asm.tn).apply(null, arguments);
        }),
      Bp = (b._emscripten_bind_btGImpactMeshShape___destroy___0 = function () {
        return (Bp = b._emscripten_bind_btGImpactMeshShape___destroy___0 =
          b.asm.un).apply(null, arguments);
      }),
      Cp =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 =
          function () {
            return (Cp =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 =
                b.asm.vn).apply(null, arguments);
          }),
      Dp =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 =
          function () {
            return (Dp =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 =
                b.asm.wn).apply(null, arguments);
          }),
      Ep =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 =
          function () {
            return (Ep =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 =
                b.asm.xn).apply(null, arguments);
          }),
      Fp =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 =
          function () {
            return (Fp =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 =
                b.asm.yn).apply(null, arguments);
          }),
      Gp =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 =
          function () {
            return (Gp =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 =
                b.asm.zn).apply(null, arguments);
          }),
      Hp =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 =
          function () {
            return (Hp =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 =
                b.asm.An).apply(null, arguments);
          }),
      Ip =
        (b._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 =
          function () {
            return (Ip =
              b._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 =
                b.asm.Bn).apply(null, arguments);
          }),
      Jp =
        (b._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 =
          function () {
            return (Jp =
              b._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 =
                b.asm.Cn).apply(null, arguments);
          }),
      Kp = (b._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 =
        function () {
          return (Kp =
            b._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 =
              b.asm.Dn).apply(null, arguments);
        }),
      Lp = (b._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 =
        function () {
          return (Lp =
            b._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 =
              b.asm.En).apply(null, arguments);
        }),
      Mp =
        (b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 =
          function () {
            return (Mp =
              b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 =
                b.asm.Fn).apply(null, arguments);
          }),
      Np =
        (b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 =
          function () {
            return (Np =
              b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 =
                b.asm.Gn).apply(null, arguments);
          }),
      Op = (b._emscripten_bind_btPersistentManifold_btPersistentManifold_0 =
        function () {
          return (Op =
            b._emscripten_bind_btPersistentManifold_btPersistentManifold_0 =
              b.asm.Hn).apply(null, arguments);
        }),
      Pp = (b._emscripten_bind_btPersistentManifold_getBody0_0 = function () {
        return (Pp = b._emscripten_bind_btPersistentManifold_getBody0_0 =
          b.asm.In).apply(null, arguments);
      }),
      Qp = (b._emscripten_bind_btPersistentManifold_getBody1_0 = function () {
        return (Qp = b._emscripten_bind_btPersistentManifold_getBody1_0 =
          b.asm.Jn).apply(null, arguments);
      }),
      Rp = (b._emscripten_bind_btPersistentManifold_getNumContacts_0 =
        function () {
          return (Rp =
            b._emscripten_bind_btPersistentManifold_getNumContacts_0 =
              b.asm.Kn).apply(null, arguments);
        }),
      Sp = (b._emscripten_bind_btPersistentManifold_getContactPoint_1 =
        function () {
          return (Sp =
            b._emscripten_bind_btPersistentManifold_getContactPoint_1 =
              b.asm.Ln).apply(null, arguments);
        }),
      Tp = (b._emscripten_bind_btPersistentManifold___destroy___0 =
        function () {
          return (Tp = b._emscripten_bind_btPersistentManifold___destroy___0 =
            b.asm.Mn).apply(null, arguments);
        }),
      Up = (b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 =
        function () {
          return (Up =
            b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 =
              b.asm.Nn).apply(null, arguments);
        }),
      Vp = (b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 =
        function () {
          return (Vp =
            b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 =
              b.asm.On).apply(null, arguments);
        }),
      Wp =
        (b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 =
          function () {
            return (Wp =
              b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 =
                b.asm.Pn).apply(null, arguments);
          }),
      Xp = (b._emscripten_bind_btCollisionDispatcher___destroy___0 =
        function () {
          return (Xp = b._emscripten_bind_btCollisionDispatcher___destroy___0 =
            b.asm.Qn).apply(null, arguments);
        }),
      Yp = (b._emscripten_bind_btOverlappingPairCallback___destroy___0 =
        function () {
          return (Yp =
            b._emscripten_bind_btOverlappingPairCallback___destroy___0 =
              b.asm.Rn).apply(null, arguments);
        }),
      Zp =
        (b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 =
          function () {
            return (Zp =
              b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 =
                b.asm.Sn).apply(null, arguments);
          }),
      $p = (b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 =
        function () {
          return ($p =
            b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 =
              b.asm.Tn).apply(null, arguments);
        }),
      aq = (b._emscripten_bind_btOverlappingPairCache___destroy___0 =
        function () {
          return (aq = b._emscripten_bind_btOverlappingPairCache___destroy___0 =
            b.asm.Un).apply(null, arguments);
        }),
      bq = (b._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = function () {
        return (bq = b._emscripten_bind_btAxisSweep3_btAxisSweep3_2 =
          b.asm.Vn).apply(null, arguments);
      }),
      cq = (b._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = function () {
        return (cq = b._emscripten_bind_btAxisSweep3_btAxisSweep3_3 =
          b.asm.Wn).apply(null, arguments);
      }),
      dq = (b._emscripten_bind_btAxisSweep3_btAxisSweep3_4 = function () {
        return (dq = b._emscripten_bind_btAxisSweep3_btAxisSweep3_4 =
          b.asm.Xn).apply(null, arguments);
      }),
      eq = (b._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = function () {
        return (eq = b._emscripten_bind_btAxisSweep3_btAxisSweep3_5 =
          b.asm.Yn).apply(null, arguments);
      }),
      fq = (b._emscripten_bind_btAxisSweep3___destroy___0 = function () {
        return (fq = b._emscripten_bind_btAxisSweep3___destroy___0 =
          b.asm.Zn).apply(null, arguments);
      }),
      gq = (b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 =
        function () {
          return (gq =
            b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 =
              b.asm._n).apply(null, arguments);
        }),
      hq = (b._emscripten_bind_btBroadphaseInterface___destroy___0 =
        function () {
          return (hq = b._emscripten_bind_btBroadphaseInterface___destroy___0 =
            b.asm.$n).apply(null, arguments);
        }),
      iq = (b._emscripten_bind_btCollisionConfiguration___destroy___0 =
        function () {
          return (iq =
            b._emscripten_bind_btCollisionConfiguration___destroy___0 =
              b.asm.ao).apply(null, arguments);
        }),
      jq = (b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 =
        function () {
          return (jq = b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 =
            b.asm.bo).apply(null, arguments);
        }),
      kq = (b._emscripten_bind_btDbvtBroadphase___destroy___0 = function () {
        return (kq = b._emscripten_bind_btDbvtBroadphase___destroy___0 =
          b.asm.co).apply(null, arguments);
      }),
      lq = (b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 =
        function () {
          return (lq =
            b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 =
              b.asm.eo).apply(null, arguments);
        }),
      mq = (b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 =
        function () {
          return (mq =
            b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 =
              b.asm.fo).apply(null, arguments);
        }),
      nq = (b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 =
        function () {
          return (nq =
            b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 =
              b.asm.go).apply(null, arguments);
        }),
      oq = (b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 =
        function () {
          return (oq =
            b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 =
              b.asm.ho).apply(null, arguments);
        }),
      pq = (b._emscripten_bind_btBroadphaseProxy___destroy___0 = function () {
        return (pq = b._emscripten_bind_btBroadphaseProxy___destroy___0 =
          b.asm.io).apply(null, arguments);
      }),
      qq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 =
          function () {
            return (qq =
              b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 =
                b.asm.jo).apply(null, arguments);
          }),
      rq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 =
          function () {
            return (rq =
              b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 =
                b.asm.ko).apply(null, arguments);
          }),
      sq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 =
          function () {
            return (sq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 =
                b.asm.lo).apply(null, arguments);
          }),
      tq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 =
          function () {
            return (tq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 =
                b.asm.mo).apply(null, arguments);
          }),
      uq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 =
          function () {
            return (uq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 =
                b.asm.no).apply(null, arguments);
          }),
      vq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 =
          function () {
            return (vq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 =
                b.asm.oo).apply(null, arguments);
          }),
      wq = (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 =
        function () {
          return (wq =
            b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 =
              b.asm.po).apply(null, arguments);
        }),
      xq = (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 =
        function () {
          return (xq =
            b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 =
              b.asm.qo).apply(null, arguments);
        }),
      yq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 =
          function () {
            return (yq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 =
                b.asm.ro).apply(null, arguments);
          }),
      zq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 =
          function () {
            return (zq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 =
                b.asm.so).apply(null, arguments);
          }),
      Aq = (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 =
        function () {
          return (Aq =
            b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 =
              b.asm.to).apply(null, arguments);
        }),
      Bq = (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 =
        function () {
          return (Bq =
            b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 =
              b.asm.uo).apply(null, arguments);
        }),
      Cq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 =
          function () {
            return (Cq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 =
                b.asm.vo).apply(null, arguments);
          }),
      Dq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 =
          function () {
            return (Dq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 =
                b.asm.wo).apply(null, arguments);
          }),
      Eq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 =
          function () {
            return (Eq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 =
                b.asm.xo).apply(null, arguments);
          }),
      Fq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 =
          function () {
            return (Fq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 =
                b.asm.yo).apply(null, arguments);
          }),
      Gq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 =
          function () {
            return (Gq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 =
                b.asm.zo).apply(null, arguments);
          }),
      Hq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 =
          function () {
            return (Hq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 =
                b.asm.Ao).apply(null, arguments);
          }),
      Iq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 =
          function () {
            return (Iq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 =
                b.asm.Bo).apply(null, arguments);
          }),
      Jq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 =
          function () {
            return (Jq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 =
                b.asm.Co).apply(null, arguments);
          }),
      Kq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 =
          function () {
            return (Kq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 =
                b.asm.Do).apply(null, arguments);
          }),
      Lq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 =
          function () {
            return (Lq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 =
                b.asm.Eo).apply(null, arguments);
          }),
      Mq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 =
          function () {
            return (Mq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 =
                b.asm.Fo).apply(null, arguments);
          }),
      Nq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 =
          function () {
            return (Nq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 =
                b.asm.Go).apply(null, arguments);
          }),
      Oq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 =
          function () {
            return (Oq =
              b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 =
                b.asm.Ho).apply(null, arguments);
          }),
      Pq =
        (b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 =
          function () {
            return (Pq =
              b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 =
                b.asm.Io).apply(null, arguments);
          }),
      Qq = (b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 =
        function () {
          return (Qq =
            b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 =
              b.asm.Jo).apply(null, arguments);
        }),
      Rq = (b._emscripten_bind_btRigidBody_btRigidBody_1 = function () {
        return (Rq = b._emscripten_bind_btRigidBody_btRigidBody_1 =
          b.asm.Ko).apply(null, arguments);
      }),
      Sq = (b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 =
        function () {
          return (Sq =
            b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 =
              b.asm.Lo).apply(null, arguments);
        }),
      Tq = (b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 =
        function () {
          return (Tq =
            b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 =
              b.asm.Mo).apply(null, arguments);
        }),
      Uq = (b._emscripten_bind_btRigidBody_setSleepingThresholds_2 =
        function () {
          return (Uq = b._emscripten_bind_btRigidBody_setSleepingThresholds_2 =
            b.asm.No).apply(null, arguments);
        }),
      Vq = (b._emscripten_bind_btRigidBody_getLinearDamping_0 = function () {
        return (Vq = b._emscripten_bind_btRigidBody_getLinearDamping_0 =
          b.asm.Oo).apply(null, arguments);
      }),
      Wq = (b._emscripten_bind_btRigidBody_getAngularDamping_0 = function () {
        return (Wq = b._emscripten_bind_btRigidBody_getAngularDamping_0 =
          b.asm.Po).apply(null, arguments);
      }),
      Xq = (b._emscripten_bind_btRigidBody_setDamping_2 = function () {
        return (Xq = b._emscripten_bind_btRigidBody_setDamping_2 =
          b.asm.Qo).apply(null, arguments);
      }),
      Yq = (b._emscripten_bind_btRigidBody_setMassProps_2 = function () {
        return (Yq = b._emscripten_bind_btRigidBody_setMassProps_2 =
          b.asm.Ro).apply(null, arguments);
      }),
      Zq = (b._emscripten_bind_btRigidBody_getLinearFactor_0 = function () {
        return (Zq = b._emscripten_bind_btRigidBody_getLinearFactor_0 =
          b.asm.So).apply(null, arguments);
      }),
      $q = (b._emscripten_bind_btRigidBody_setLinearFactor_1 = function () {
        return ($q = b._emscripten_bind_btRigidBody_setLinearFactor_1 =
          b.asm.To).apply(null, arguments);
      }),
      ar = (b._emscripten_bind_btRigidBody_applyTorque_1 = function () {
        return (ar = b._emscripten_bind_btRigidBody_applyTorque_1 =
          b.asm.Uo).apply(null, arguments);
      }),
      br = (b._emscripten_bind_btRigidBody_applyLocalTorque_1 = function () {
        return (br = b._emscripten_bind_btRigidBody_applyLocalTorque_1 =
          b.asm.Vo).apply(null, arguments);
      }),
      cr = (b._emscripten_bind_btRigidBody_applyForce_2 = function () {
        return (cr = b._emscripten_bind_btRigidBody_applyForce_2 =
          b.asm.Wo).apply(null, arguments);
      }),
      dr = (b._emscripten_bind_btRigidBody_applyCentralForce_1 = function () {
        return (dr = b._emscripten_bind_btRigidBody_applyCentralForce_1 =
          b.asm.Xo).apply(null, arguments);
      }),
      er = (b._emscripten_bind_btRigidBody_applyCentralLocalForce_1 =
        function () {
          return (er = b._emscripten_bind_btRigidBody_applyCentralLocalForce_1 =
            b.asm.Yo).apply(null, arguments);
        }),
      fr = (b._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = function () {
        return (fr = b._emscripten_bind_btRigidBody_applyTorqueImpulse_1 =
          b.asm.Zo).apply(null, arguments);
      }),
      gr = (b._emscripten_bind_btRigidBody_applyImpulse_2 = function () {
        return (gr = b._emscripten_bind_btRigidBody_applyImpulse_2 =
          b.asm._o).apply(null, arguments);
      }),
      hr = (b._emscripten_bind_btRigidBody_applyCentralImpulse_1 = function () {
        return (hr = b._emscripten_bind_btRigidBody_applyCentralImpulse_1 =
          b.asm.$o).apply(null, arguments);
      }),
      ir = (b._emscripten_bind_btRigidBody_updateInertiaTensor_0 = function () {
        return (ir = b._emscripten_bind_btRigidBody_updateInertiaTensor_0 =
          b.asm.ap).apply(null, arguments);
      }),
      jr = (b._emscripten_bind_btRigidBody_getLinearVelocity_0 = function () {
        return (jr = b._emscripten_bind_btRigidBody_getLinearVelocity_0 =
          b.asm.bp).apply(null, arguments);
      }),
      kr = (b._emscripten_bind_btRigidBody_getAngularVelocity_0 = function () {
        return (kr = b._emscripten_bind_btRigidBody_getAngularVelocity_0 =
          b.asm.cp).apply(null, arguments);
      }),
      lr = (b._emscripten_bind_btRigidBody_setLinearVelocity_1 = function () {
        return (lr = b._emscripten_bind_btRigidBody_setLinearVelocity_1 =
          b.asm.dp).apply(null, arguments);
      }),
      mr = (b._emscripten_bind_btRigidBody_setAngularVelocity_1 = function () {
        return (mr = b._emscripten_bind_btRigidBody_setAngularVelocity_1 =
          b.asm.ep).apply(null, arguments);
      }),
      nr = (b._emscripten_bind_btRigidBody_getMotionState_0 = function () {
        return (nr = b._emscripten_bind_btRigidBody_getMotionState_0 =
          b.asm.fp).apply(null, arguments);
      }),
      or = (b._emscripten_bind_btRigidBody_setMotionState_1 = function () {
        return (or = b._emscripten_bind_btRigidBody_setMotionState_1 =
          b.asm.gp).apply(null, arguments);
      }),
      pr = (b._emscripten_bind_btRigidBody_getAngularFactor_0 = function () {
        return (pr = b._emscripten_bind_btRigidBody_getAngularFactor_0 =
          b.asm.hp).apply(null, arguments);
      }),
      qr = (b._emscripten_bind_btRigidBody_setAngularFactor_1 = function () {
        return (qr = b._emscripten_bind_btRigidBody_setAngularFactor_1 =
          b.asm.ip).apply(null, arguments);
      }),
      rr = (b._emscripten_bind_btRigidBody_upcast_1 = function () {
        return (rr = b._emscripten_bind_btRigidBody_upcast_1 = b.asm.jp).apply(
          null,
          arguments
        );
      }),
      sr = (b._emscripten_bind_btRigidBody_getAabb_2 = function () {
        return (sr = b._emscripten_bind_btRigidBody_getAabb_2 = b.asm.kp).apply(
          null,
          arguments
        );
      }),
      tr = (b._emscripten_bind_btRigidBody_applyGravity_0 = function () {
        return (tr = b._emscripten_bind_btRigidBody_applyGravity_0 =
          b.asm.lp).apply(null, arguments);
      }),
      ur = (b._emscripten_bind_btRigidBody_getGravity_0 = function () {
        return (ur = b._emscripten_bind_btRigidBody_getGravity_0 =
          b.asm.mp).apply(null, arguments);
      }),
      vr = (b._emscripten_bind_btRigidBody_setGravity_1 = function () {
        return (vr = b._emscripten_bind_btRigidBody_setGravity_1 =
          b.asm.np).apply(null, arguments);
      }),
      wr = (b._emscripten_bind_btRigidBody_getBroadphaseProxy_0 = function () {
        return (wr = b._emscripten_bind_btRigidBody_getBroadphaseProxy_0 =
          b.asm.op).apply(null, arguments);
      }),
      xr = (b._emscripten_bind_btRigidBody_clearForces_0 = function () {
        return (xr = b._emscripten_bind_btRigidBody_clearForces_0 =
          b.asm.pp).apply(null, arguments);
      }),
      yr = (b._emscripten_bind_btRigidBody_setFlags_1 = function () {
        return (yr = b._emscripten_bind_btRigidBody_setFlags_1 =
          b.asm.qp).apply(null, arguments);
      }),
      zr = (b._emscripten_bind_btRigidBody_getFlags_0 = function () {
        return (zr = b._emscripten_bind_btRigidBody_getFlags_0 =
          b.asm.rp).apply(null, arguments);
      }),
      Ar = (b._emscripten_bind_btRigidBody_setAnisotropicFriction_2 =
        function () {
          return (Ar = b._emscripten_bind_btRigidBody_setAnisotropicFriction_2 =
            b.asm.sp).apply(null, arguments);
        }),
      Br = (b._emscripten_bind_btRigidBody_getCollisionShape_0 = function () {
        return (Br = b._emscripten_bind_btRigidBody_getCollisionShape_0 =
          b.asm.tp).apply(null, arguments);
      }),
      Cr = (b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 =
        function () {
          return (Cr =
            b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 =
              b.asm.up).apply(null, arguments);
        }),
      Dr = (b._emscripten_bind_btRigidBody_setActivationState_1 = function () {
        return (Dr = b._emscripten_bind_btRigidBody_setActivationState_1 =
          b.asm.vp).apply(null, arguments);
      }),
      Er = (b._emscripten_bind_btRigidBody_forceActivationState_1 =
        function () {
          return (Er = b._emscripten_bind_btRigidBody_forceActivationState_1 =
            b.asm.wp).apply(null, arguments);
        }),
      Fr = (b._emscripten_bind_btRigidBody_activate_0 = function () {
        return (Fr = b._emscripten_bind_btRigidBody_activate_0 =
          b.asm.xp).apply(null, arguments);
      }),
      Gr = (b._emscripten_bind_btRigidBody_activate_1 = function () {
        return (Gr = b._emscripten_bind_btRigidBody_activate_1 =
          b.asm.yp).apply(null, arguments);
      }),
      Hr = (b._emscripten_bind_btRigidBody_isActive_0 = function () {
        return (Hr = b._emscripten_bind_btRigidBody_isActive_0 =
          b.asm.zp).apply(null, arguments);
      }),
      Ir = (b._emscripten_bind_btRigidBody_isKinematicObject_0 = function () {
        return (Ir = b._emscripten_bind_btRigidBody_isKinematicObject_0 =
          b.asm.Ap).apply(null, arguments);
      }),
      Jr = (b._emscripten_bind_btRigidBody_isStaticObject_0 = function () {
        return (Jr = b._emscripten_bind_btRigidBody_isStaticObject_0 =
          b.asm.Bp).apply(null, arguments);
      }),
      Kr = (b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 =
        function () {
          return (Kr =
            b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 =
              b.asm.Cp).apply(null, arguments);
        }),
      Lr = (b._emscripten_bind_btRigidBody_getRestitution_0 = function () {
        return (Lr = b._emscripten_bind_btRigidBody_getRestitution_0 =
          b.asm.Dp).apply(null, arguments);
      }),
      Mr = (b._emscripten_bind_btRigidBody_getFriction_0 = function () {
        return (Mr = b._emscripten_bind_btRigidBody_getFriction_0 =
          b.asm.Ep).apply(null, arguments);
      }),
      Nr = (b._emscripten_bind_btRigidBody_getRollingFriction_0 = function () {
        return (Nr = b._emscripten_bind_btRigidBody_getRollingFriction_0 =
          b.asm.Fp).apply(null, arguments);
      }),
      Or = (b._emscripten_bind_btRigidBody_setRestitution_1 = function () {
        return (Or = b._emscripten_bind_btRigidBody_setRestitution_1 =
          b.asm.Gp).apply(null, arguments);
      }),
      Pr = (b._emscripten_bind_btRigidBody_setFriction_1 = function () {
        return (Pr = b._emscripten_bind_btRigidBody_setFriction_1 =
          b.asm.Hp).apply(null, arguments);
      }),
      Qr = (b._emscripten_bind_btRigidBody_setRollingFriction_1 = function () {
        return (Qr = b._emscripten_bind_btRigidBody_setRollingFriction_1 =
          b.asm.Ip).apply(null, arguments);
      }),
      Rr = (b._emscripten_bind_btRigidBody_getWorldTransform_0 = function () {
        return (Rr = b._emscripten_bind_btRigidBody_getWorldTransform_0 =
          b.asm.Jp).apply(null, arguments);
      }),
      Sr = (b._emscripten_bind_btRigidBody_getCollisionFlags_0 = function () {
        return (Sr = b._emscripten_bind_btRigidBody_getCollisionFlags_0 =
          b.asm.Kp).apply(null, arguments);
      }),
      Tr = (b._emscripten_bind_btRigidBody_setCollisionFlags_1 = function () {
        return (Tr = b._emscripten_bind_btRigidBody_setCollisionFlags_1 =
          b.asm.Lp).apply(null, arguments);
      }),
      Ur = (b._emscripten_bind_btRigidBody_setWorldTransform_1 = function () {
        return (Ur = b._emscripten_bind_btRigidBody_setWorldTransform_1 =
          b.asm.Mp).apply(null, arguments);
      }),
      Vr = (b._emscripten_bind_btRigidBody_setCollisionShape_1 = function () {
        return (Vr = b._emscripten_bind_btRigidBody_setCollisionShape_1 =
          b.asm.Np).apply(null, arguments);
      }),
      Wr = (b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 =
        function () {
          return (Wr = b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 =
            b.asm.Op).apply(null, arguments);
        }),
      Xr = (b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 =
        function () {
          return (Xr =
            b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 =
              b.asm.Pp).apply(null, arguments);
        }),
      Yr = (b._emscripten_bind_btRigidBody_getUserIndex_0 = function () {
        return (Yr = b._emscripten_bind_btRigidBody_getUserIndex_0 =
          b.asm.Qp).apply(null, arguments);
      }),
      Zr = (b._emscripten_bind_btRigidBody_setUserIndex_1 = function () {
        return (Zr = b._emscripten_bind_btRigidBody_setUserIndex_1 =
          b.asm.Rp).apply(null, arguments);
      }),
      $r = (b._emscripten_bind_btRigidBody_getUserPointer_0 = function () {
        return ($r = b._emscripten_bind_btRigidBody_getUserPointer_0 =
          b.asm.Sp).apply(null, arguments);
      }),
      as = (b._emscripten_bind_btRigidBody_setUserPointer_1 = function () {
        return (as = b._emscripten_bind_btRigidBody_setUserPointer_1 =
          b.asm.Tp).apply(null, arguments);
      }),
      bs = (b._emscripten_bind_btRigidBody_getBroadphaseHandle_0 = function () {
        return (bs = b._emscripten_bind_btRigidBody_getBroadphaseHandle_0 =
          b.asm.Up).apply(null, arguments);
      }),
      cs = (b._emscripten_bind_btRigidBody___destroy___0 = function () {
        return (cs = b._emscripten_bind_btRigidBody___destroy___0 =
          b.asm.Vp).apply(null, arguments);
      }),
      ds = (b._emscripten_bind_btConstraintSetting_btConstraintSetting_0 =
        function () {
          return (ds =
            b._emscripten_bind_btConstraintSetting_btConstraintSetting_0 =
              b.asm.Wp).apply(null, arguments);
        }),
      es = (b._emscripten_bind_btConstraintSetting_get_m_tau_0 = function () {
        return (es = b._emscripten_bind_btConstraintSetting_get_m_tau_0 =
          b.asm.Xp).apply(null, arguments);
      }),
      gs = (b._emscripten_bind_btConstraintSetting_set_m_tau_1 = function () {
        return (gs = b._emscripten_bind_btConstraintSetting_set_m_tau_1 =
          b.asm.Yp).apply(null, arguments);
      }),
      hs = (b._emscripten_bind_btConstraintSetting_get_m_damping_0 =
        function () {
          return (hs = b._emscripten_bind_btConstraintSetting_get_m_damping_0 =
            b.asm.Zp).apply(null, arguments);
        }),
      is = (b._emscripten_bind_btConstraintSetting_set_m_damping_1 =
        function () {
          return (is = b._emscripten_bind_btConstraintSetting_set_m_damping_1 =
            b.asm._p).apply(null, arguments);
        }),
      js = (b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 =
        function () {
          return (js =
            b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 =
              b.asm.$p).apply(null, arguments);
        }),
      ks = (b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 =
        function () {
          return (ks =
            b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 =
              b.asm.aq).apply(null, arguments);
        }),
      ls = (b._emscripten_bind_btConstraintSetting___destroy___0 = function () {
        return (ls = b._emscripten_bind_btConstraintSetting___destroy___0 =
          b.asm.bq).apply(null, arguments);
      }),
      ms =
        (b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 =
          function () {
            return (ms =
              b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 =
                b.asm.cq).apply(null, arguments);
          }),
      ns =
        (b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 =
          function () {
            return (ns =
              b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 =
                b.asm.dq).apply(null, arguments);
          }),
      ps = (b._emscripten_bind_btPoint2PointConstraint_setPivotA_1 =
        function () {
          return (ps = b._emscripten_bind_btPoint2PointConstraint_setPivotA_1 =
            b.asm.eq).apply(null, arguments);
        }),
      qs = (b._emscripten_bind_btPoint2PointConstraint_setPivotB_1 =
        function () {
          return (qs = b._emscripten_bind_btPoint2PointConstraint_setPivotB_1 =
            b.asm.fq).apply(null, arguments);
        }),
      rs = (b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 =
        function () {
          return (rs =
            b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 =
              b.asm.gq).apply(null, arguments);
        }),
      ss = (b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 =
        function () {
          return (ss =
            b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 =
              b.asm.hq).apply(null, arguments);
        }),
      ts = (b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 =
        function () {
          return (ts =
            b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 =
              b.asm.iq).apply(null, arguments);
        }),
      us =
        (b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 =
          function () {
            return (us =
              b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 =
                b.asm.jq).apply(null, arguments);
          }),
      vs =
        (b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 =
          function () {
            return (vs =
              b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 =
                b.asm.kq).apply(null, arguments);
          }),
      xs = (b._emscripten_bind_btPoint2PointConstraint_getParam_2 =
        function () {
          return (xs = b._emscripten_bind_btPoint2PointConstraint_getParam_2 =
            b.asm.lq).apply(null, arguments);
        }),
      ys = (b._emscripten_bind_btPoint2PointConstraint_setParam_3 =
        function () {
          return (ys = b._emscripten_bind_btPoint2PointConstraint_setParam_3 =
            b.asm.mq).apply(null, arguments);
        }),
      zs = (b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 =
        function () {
          return (zs =
            b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 =
              b.asm.nq).apply(null, arguments);
        }),
      As = (b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 =
        function () {
          return (As =
            b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 =
              b.asm.oq).apply(null, arguments);
        }),
      Bs = (b._emscripten_bind_btPoint2PointConstraint___destroy___0 =
        function () {
          return (Bs =
            b._emscripten_bind_btPoint2PointConstraint___destroy___0 =
              b.asm.pq).apply(null, arguments);
        }),
      Cs =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 =
          function () {
            return (Cs =
              b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 =
                b.asm.qq).apply(null, arguments);
          }),
      Ds =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 =
          function () {
            return (Ds =
              b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 =
                b.asm.rq).apply(null, arguments);
          }),
      Es = (b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 =
        function () {
          return (Es =
            b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 =
              b.asm.sq).apply(null, arguments);
        }),
      Fs = (b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 =
        function () {
          return (Fs =
            b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 =
              b.asm.tq).apply(null, arguments);
        }),
      Gs = (b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 =
        function () {
          return (Gs =
            b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 =
              b.asm.uq).apply(null, arguments);
        }),
      Hs =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0 =
          function () {
            return (Hs =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0 =
                b.asm.vq).apply(null, arguments);
          }),
      Is =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1 =
          function () {
            return (Is =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1 =
                b.asm.wq).apply(null, arguments);
          }),
      Js =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2 =
          function () {
            return (Js =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2 =
                b.asm.xq).apply(null, arguments);
          }),
      Ks =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 =
          function () {
            return (Ks =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 =
                b.asm.yq).apply(null, arguments);
          }),
      Ls =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 =
          function () {
            return (Ls =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 =
                b.asm.zq).apply(null, arguments);
          }),
      Ms =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 =
          function () {
            return (Ms =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 =
                b.asm.Aq).apply(null, arguments);
          }),
      Ns =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 =
          function () {
            return (Ns =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 =
                b.asm.Bq).apply(null, arguments);
          }),
      Os = (b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0 =
        function () {
          return (Os =
            b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0 =
              b.asm.Cq).apply(null, arguments);
        }),
      Ps = (b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 =
        function () {
          return (Ps =
            b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 =
              b.asm.Dq).apply(null, arguments);
        }),
      Qs =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 =
          function () {
            return (Qs =
              b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 =
                b.asm.Eq).apply(null, arguments);
          }),
      Rs =
        (b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 =
          function () {
            return (Rs =
              b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 =
                b.asm.Fq).apply(null, arguments);
          }),
      Ss = (b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 =
        function () {
          return (Ss =
            b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 =
              b.asm.Gq).apply(null, arguments);
        }),
      Ts = (b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 =
        function () {
          return (Ts =
            b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 =
              b.asm.Hq).apply(null, arguments);
        }),
      Us = (b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 =
        function () {
          return (Us =
            b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 =
              b.asm.Iq).apply(null, arguments);
        }),
      Vs =
        (b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 =
          function () {
            return (Vs =
              b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 =
                b.asm.Jq).apply(null, arguments);
          }),
      Ws =
        (b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 =
          function () {
            return (Ws =
              b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 =
                b.asm.Kq).apply(null, arguments);
          }),
      Xs = (b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 =
        function () {
          return (Xs =
            b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 =
              b.asm.Lq).apply(null, arguments);
        }),
      Ys = (b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 =
        function () {
          return (Ys =
            b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 =
              b.asm.Mq).apply(null, arguments);
        }),
      Zs = (b._emscripten_bind_btConeTwistConstraint_setLimit_2 = function () {
        return (Zs = b._emscripten_bind_btConeTwistConstraint_setLimit_2 =
          b.asm.Nq).apply(null, arguments);
      }),
      $s = (b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1 =
        function () {
          return ($s =
            b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1 =
              b.asm.Oq).apply(null, arguments);
        }),
      at = (b._emscripten_bind_btConeTwistConstraint_setDamping_1 =
        function () {
          return (at = b._emscripten_bind_btConeTwistConstraint_setDamping_1 =
            b.asm.Pq).apply(null, arguments);
        }),
      bt = (b._emscripten_bind_btConeTwistConstraint_enableMotor_1 =
        function () {
          return (bt = b._emscripten_bind_btConeTwistConstraint_enableMotor_1 =
            b.asm.Qq).apply(null, arguments);
        }),
      ct = (b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 =
        function () {
          return (ct =
            b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 =
              b.asm.Rq).apply(null, arguments);
        }),
      dt =
        (b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 =
          function () {
            return (dt =
              b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 =
                b.asm.Sq).apply(null, arguments);
          }),
      et = (b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1 =
        function () {
          return (et =
            b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1 =
              b.asm.Tq).apply(null, arguments);
        }),
      ft =
        (b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 =
          function () {
            return (ft =
              b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 =
                b.asm.Uq).apply(null, arguments);
          }),
      gt = (b._emscripten_bind_btConeTwistConstraint_enableFeedback_1 =
        function () {
          return (gt =
            b._emscripten_bind_btConeTwistConstraint_enableFeedback_1 =
              b.asm.Vq).apply(null, arguments);
        }),
      ht =
        (b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 =
          function () {
            return (ht =
              b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 =
                b.asm.Wq).apply(null, arguments);
          }),
      it =
        (b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 =
          function () {
            return (it =
              b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 =
                b.asm.Xq).apply(null, arguments);
          }),
      jt = (b._emscripten_bind_btConeTwistConstraint_getParam_2 = function () {
        return (jt = b._emscripten_bind_btConeTwistConstraint_getParam_2 =
          b.asm.Yq).apply(null, arguments);
      }),
      kt = (b._emscripten_bind_btConeTwistConstraint_setParam_3 = function () {
        return (kt = b._emscripten_bind_btConeTwistConstraint_setParam_3 =
          b.asm.Zq).apply(null, arguments);
      }),
      lt = (b._emscripten_bind_btConeTwistConstraint___destroy___0 =
        function () {
          return (lt = b._emscripten_bind_btConeTwistConstraint___destroy___0 =
            b.asm._q).apply(null, arguments);
        }),
      mt = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_2 =
        function () {
          return (mt =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_2 =
              b.asm.$q).apply(null, arguments);
        }),
      nt = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_3 =
        function () {
          return (nt =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_3 =
              b.asm.ar).apply(null, arguments);
        }),
      ot = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_4 =
        function () {
          return (ot =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_4 =
              b.asm.br).apply(null, arguments);
        }),
      pt = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_5 =
        function () {
          return (pt =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_5 =
              b.asm.cr).apply(null, arguments);
        }),
      qt = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_6 =
        function () {
          return (qt =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_6 =
              b.asm.dr).apply(null, arguments);
        }),
      rt = (b._emscripten_bind_btHingeConstraint_btHingeConstraint_7 =
        function () {
          return (rt =
            b._emscripten_bind_btHingeConstraint_btHingeConstraint_7 =
              b.asm.er).apply(null, arguments);
        }),
      st = (b._emscripten_bind_btHingeConstraint_getHingeAngle_0 = function () {
        return (st = b._emscripten_bind_btHingeConstraint_getHingeAngle_0 =
          b.asm.fr).apply(null, arguments);
      }),
      tt = (b._emscripten_bind_btHingeConstraint_setLimit_4 = function () {
        return (tt = b._emscripten_bind_btHingeConstraint_setLimit_4 =
          b.asm.gr).apply(null, arguments);
      }),
      ut = (b._emscripten_bind_btHingeConstraint_setLimit_5 = function () {
        return (ut = b._emscripten_bind_btHingeConstraint_setLimit_5 =
          b.asm.hr).apply(null, arguments);
      }),
      vt = (b._emscripten_bind_btHingeConstraint_enableAngularMotor_3 =
        function () {
          return (vt =
            b._emscripten_bind_btHingeConstraint_enableAngularMotor_3 =
              b.asm.ir).apply(null, arguments);
        }),
      wt = (b._emscripten_bind_btHingeConstraint_setAngularOnly_1 =
        function () {
          return (wt = b._emscripten_bind_btHingeConstraint_setAngularOnly_1 =
            b.asm.jr).apply(null, arguments);
        }),
      xt = (b._emscripten_bind_btHingeConstraint_enableMotor_1 = function () {
        return (xt = b._emscripten_bind_btHingeConstraint_enableMotor_1 =
          b.asm.kr).apply(null, arguments);
      }),
      yt = (b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 =
        function () {
          return (yt =
            b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 =
              b.asm.lr).apply(null, arguments);
        }),
      zt = (b._emscripten_bind_btHingeConstraint_setMotorTarget_2 =
        function () {
          return (zt = b._emscripten_bind_btHingeConstraint_setMotorTarget_2 =
            b.asm.mr).apply(null, arguments);
        }),
      At = (b._emscripten_bind_btHingeConstraint_enableFeedback_1 =
        function () {
          return (At = b._emscripten_bind_btHingeConstraint_enableFeedback_1 =
            b.asm.nr).apply(null, arguments);
        }),
      Bt = (b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 =
        function () {
          return (Bt =
            b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 =
              b.asm.or).apply(null, arguments);
        }),
      Ct = (b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 =
        function () {
          return (Ct =
            b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 =
              b.asm.pr).apply(null, arguments);
        }),
      Dt = (b._emscripten_bind_btHingeConstraint_getParam_2 = function () {
        return (Dt = b._emscripten_bind_btHingeConstraint_getParam_2 =
          b.asm.qr).apply(null, arguments);
      }),
      Et = (b._emscripten_bind_btHingeConstraint_setParam_3 = function () {
        return (Et = b._emscripten_bind_btHingeConstraint_setParam_3 =
          b.asm.rr).apply(null, arguments);
      }),
      Ft = (b._emscripten_bind_btHingeConstraint___destroy___0 = function () {
        return (Ft = b._emscripten_bind_btHingeConstraint___destroy___0 =
          b.asm.sr).apply(null, arguments);
      }),
      Gt = (b._emscripten_bind_btSliderConstraint_btSliderConstraint_3 =
        function () {
          return (Gt =
            b._emscripten_bind_btSliderConstraint_btSliderConstraint_3 =
              b.asm.tr).apply(null, arguments);
        }),
      Ht = (b._emscripten_bind_btSliderConstraint_btSliderConstraint_5 =
        function () {
          return (Ht =
            b._emscripten_bind_btSliderConstraint_btSliderConstraint_5 =
              b.asm.ur).apply(null, arguments);
        }),
      It = (b._emscripten_bind_btSliderConstraint_getLinearPos_0 = function () {
        return (It = b._emscripten_bind_btSliderConstraint_getLinearPos_0 =
          b.asm.vr).apply(null, arguments);
      }),
      Jt = (b._emscripten_bind_btSliderConstraint_getAngularPos_0 =
        function () {
          return (Jt = b._emscripten_bind_btSliderConstraint_getAngularPos_0 =
            b.asm.wr).apply(null, arguments);
        }),
      Kt = (b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1 =
        function () {
          return (Kt =
            b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1 =
              b.asm.xr).apply(null, arguments);
        }),
      Lt = (b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1 =
        function () {
          return (Lt =
            b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1 =
              b.asm.yr).apply(null, arguments);
        }),
      Mt = (b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1 =
        function () {
          return (Mt =
            b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1 =
              b.asm.zr).apply(null, arguments);
        }),
      Nt = (b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1 =
        function () {
          return (Nt =
            b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1 =
              b.asm.Ar).apply(null, arguments);
        }),
      Ot = (b._emscripten_bind_btSliderConstraint_setPoweredLinMotor_1 =
        function () {
          return (Ot =
            b._emscripten_bind_btSliderConstraint_setPoweredLinMotor_1 =
              b.asm.Br).apply(null, arguments);
        }),
      Pt = (b._emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1 =
        function () {
          return (Pt =
            b._emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1 =
              b.asm.Cr).apply(null, arguments);
        }),
      Qt = (b._emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1 =
        function () {
          return (Qt =
            b._emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1 =
              b.asm.Dr).apply(null, arguments);
        }),
      Rt = (b._emscripten_bind_btSliderConstraint_enableFeedback_1 =
        function () {
          return (Rt = b._emscripten_bind_btSliderConstraint_enableFeedback_1 =
            b.asm.Er).apply(null, arguments);
        }),
      St =
        (b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 =
          function () {
            return (St =
              b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 =
                b.asm.Fr).apply(null, arguments);
          }),
      Tt =
        (b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 =
          function () {
            return (Tt =
              b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 =
                b.asm.Gr).apply(null, arguments);
          }),
      Ut = (b._emscripten_bind_btSliderConstraint_getParam_2 = function () {
        return (Ut = b._emscripten_bind_btSliderConstraint_getParam_2 =
          b.asm.Hr).apply(null, arguments);
      }),
      Vt = (b._emscripten_bind_btSliderConstraint_setParam_3 = function () {
        return (Vt = b._emscripten_bind_btSliderConstraint_setParam_3 =
          b.asm.Ir).apply(null, arguments);
      }),
      Wt = (b._emscripten_bind_btSliderConstraint___destroy___0 = function () {
        return (Wt = b._emscripten_bind_btSliderConstraint___destroy___0 =
          b.asm.Jr).apply(null, arguments);
      }),
      Xt = (b._emscripten_bind_btFixedConstraint_btFixedConstraint_4 =
        function () {
          return (Xt =
            b._emscripten_bind_btFixedConstraint_btFixedConstraint_4 =
              b.asm.Kr).apply(null, arguments);
        }),
      Yt = (b._emscripten_bind_btFixedConstraint_enableFeedback_1 =
        function () {
          return (Yt = b._emscripten_bind_btFixedConstraint_enableFeedback_1 =
            b.asm.Lr).apply(null, arguments);
        }),
      Zt = (b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 =
        function () {
          return (Zt =
            b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 =
              b.asm.Mr).apply(null, arguments);
        }),
      $t = (b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 =
        function () {
          return ($t =
            b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 =
              b.asm.Nr).apply(null, arguments);
        }),
      au = (b._emscripten_bind_btFixedConstraint_getParam_2 = function () {
        return (au = b._emscripten_bind_btFixedConstraint_getParam_2 =
          b.asm.Or).apply(null, arguments);
      }),
      bu = (b._emscripten_bind_btFixedConstraint_setParam_3 = function () {
        return (bu = b._emscripten_bind_btFixedConstraint_setParam_3 =
          b.asm.Pr).apply(null, arguments);
      }),
      cu = (b._emscripten_bind_btFixedConstraint___destroy___0 = function () {
        return (cu = b._emscripten_bind_btFixedConstraint___destroy___0 =
          b.asm.Qr).apply(null, arguments);
      }),
      du = (b._emscripten_bind_btConstraintSolver___destroy___0 = function () {
        return (du = b._emscripten_bind_btConstraintSolver___destroy___0 =
          b.asm.Rr).apply(null, arguments);
      }),
      eu = (b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 = function () {
        return (eu = b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 =
          b.asm.Sr).apply(null, arguments);
      }),
      fu = (b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = function () {
        return (fu = b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 =
          b.asm.Tr).apply(null, arguments);
      }),
      gu = (b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 =
        function () {
          return (gu = b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 =
            b.asm.Ur).apply(null, arguments);
        }),
      hu = (b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 =
        function () {
          return (hu = b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 =
            b.asm.Vr).apply(null, arguments);
        }),
      iu = (b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 =
        function () {
          return (iu =
            b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 =
              b.asm.Wr).apply(null, arguments);
        }),
      ju = (b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 =
        function () {
          return (ju =
            b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 =
              b.asm.Xr).apply(null, arguments);
        }),
      ku = (b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 =
        function () {
          return (ku =
            b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 =
              b.asm.Yr).apply(null, arguments);
        }),
      lu = (b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 =
        function () {
          return (lu =
            b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 =
              b.asm.Zr).apply(null, arguments);
        }),
      mu = (b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 =
        function () {
          return (mu =
            b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 =
              b.asm._r).apply(null, arguments);
        }),
      nu = (b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 =
        function () {
          return (nu =
            b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 =
              b.asm.$r).apply(null, arguments);
        }),
      ou = (b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 =
        function () {
          return (ou =
            b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 =
              b.asm.as).apply(null, arguments);
        }),
      pu = (b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 =
        function () {
          return (pu =
            b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 =
              b.asm.bs).apply(null, arguments);
        }),
      qu = (b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 =
        function () {
          return (qu = b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 =
            b.asm.cs).apply(null, arguments);
        }),
      ru = (b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 =
        function () {
          return (ru = b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 =
            b.asm.ds).apply(null, arguments);
        }),
      su = (b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = function () {
        return (su = b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 =
          b.asm.es).apply(null, arguments);
      }),
      tu = (b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = function () {
        return (tu = b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 =
          b.asm.fs).apply(null, arguments);
      }),
      uu = (b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 =
        function () {
          return (uu =
            b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 =
              b.asm.gs).apply(null, arguments);
        }),
      vu = (b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 =
        function () {
          return (vu =
            b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 =
              b.asm.hs).apply(null, arguments);
        }),
      wu =
        (b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 =
          function () {
            return (wu =
              b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 =
                b.asm.is).apply(null, arguments);
          }),
      xu =
        (b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 =
          function () {
            return (xu =
              b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 =
                b.asm.js).apply(null, arguments);
          }),
      yu =
        (b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 =
          function () {
            return (yu =
              b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 =
                b.asm.ks).apply(null, arguments);
          }),
      zu =
        (b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 =
          function () {
            return (zu =
              b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 =
                b.asm.ls).apply(null, arguments);
          }),
      Au = (b._emscripten_bind_btDispatcherInfo___destroy___0 = function () {
        return (Au = b._emscripten_bind_btDispatcherInfo___destroy___0 =
          b.asm.ms).apply(null, arguments);
      }),
      Bu = (b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 =
        function () {
          return (Bu =
            b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 =
              b.asm.ns).apply(null, arguments);
        }),
      Cu = (b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 =
        function () {
          return (Cu =
            b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 =
              b.asm.os).apply(null, arguments);
        }),
      Du =
        (b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 =
          function () {
            return (Du =
              b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 =
                b.asm.ps).apply(null, arguments);
          }),
      Eu =
        (b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 =
          function () {
            return (Eu =
              b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 =
                b.asm.qs).apply(null, arguments);
          }),
      Fu = (b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 =
        function () {
          return (Fu =
            b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 =
              b.asm.rs).apply(null, arguments);
        }),
      Gu = (b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 =
        function () {
          return (Gu =
            b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 =
              b.asm.ss).apply(null, arguments);
        }),
      Hu = (b._emscripten_bind_btContactSolverInfo___destroy___0 = function () {
        return (Hu = b._emscripten_bind_btContactSolverInfo___destroy___0 =
          b.asm.ts).apply(null, arguments);
      }),
      Iu = (b._emscripten_bind_btVehicleTuning_btVehicleTuning_0 = function () {
        return (Iu = b._emscripten_bind_btVehicleTuning_btVehicleTuning_0 =
          b.asm.us).apply(null, arguments);
      }),
      Ju = (b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 =
        function () {
          return (Ju =
            b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 =
              b.asm.vs).apply(null, arguments);
        }),
      Ku = (b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 =
        function () {
          return (Ku =
            b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 =
              b.asm.ws).apply(null, arguments);
        }),
      Lu = (b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 =
        function () {
          return (Lu =
            b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 =
              b.asm.xs).apply(null, arguments);
        }),
      Mu = (b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 =
        function () {
          return (Mu =
            b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 =
              b.asm.ys).apply(null, arguments);
        }),
      Nu = (b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 =
        function () {
          return (Nu =
            b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 =
              b.asm.zs).apply(null, arguments);
        }),
      Ou = (b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 =
        function () {
          return (Ou =
            b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 =
              b.asm.As).apply(null, arguments);
        }),
      Pu = (b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 =
        function () {
          return (Pu =
            b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 =
              b.asm.Bs).apply(null, arguments);
        }),
      Qu = (b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 =
        function () {
          return (Qu =
            b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 =
              b.asm.Cs).apply(null, arguments);
        }),
      Ru = (b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 =
        function () {
          return (Ru = b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 =
            b.asm.Ds).apply(null, arguments);
        }),
      Su = (b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 =
        function () {
          return (Su = b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 =
            b.asm.Es).apply(null, arguments);
        }),
      Tu = (b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 =
        function () {
          return (Tu =
            b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 =
              b.asm.Fs).apply(null, arguments);
        }),
      Uu = (b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 =
        function () {
          return (Uu =
            b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 =
              b.asm.Gs).apply(null, arguments);
        }),
      Vu =
        (b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 =
          function () {
            return (Vu =
              b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 =
                b.asm.Hs).apply(null, arguments);
          }),
      Wu =
        (b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 =
          function () {
            return (Wu =
              b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 =
                b.asm.Is).apply(null, arguments);
          }),
      Xu =
        (b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 =
          function () {
            return (Xu =
              b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 =
                b.asm.Js).apply(null, arguments);
          }),
      Yu =
        (b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 =
          function () {
            return (Yu =
              b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 =
                b.asm.Ks).apply(null, arguments);
          }),
      Zu = (b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 =
        function () {
          return (Zu =
            b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 =
              b.asm.Ls).apply(null, arguments);
        }),
      $u = (b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 =
        function () {
          return ($u =
            b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 =
              b.asm.Ms).apply(null, arguments);
        }),
      av = (b._emscripten_bind_btVehicleRaycasterResult___destroy___0 =
        function () {
          return (av =
            b._emscripten_bind_btVehicleRaycasterResult___destroy___0 =
              b.asm.Ns).apply(null, arguments);
        }),
      bv =
        (b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 =
          function () {
            return (bv =
              b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 =
                b.asm.Os).apply(null, arguments);
          }),
      cv = (b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3 =
        function () {
          return (cv = b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3 =
            b.asm.Ps).apply(null, arguments);
        }),
      dv = (b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0 =
        function () {
          return (dv =
            b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0 =
              b.asm.Qs).apply(null, arguments);
        }),
      ev = (b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 =
        function () {
          return (ev = b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 =
            b.asm.Rs).apply(null, arguments);
        }),
      fv = (b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 =
        function () {
          return (fv = b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 =
            b.asm.Ss).apply(null, arguments);
        }),
      gv = (b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0 =
        function () {
          return (gv = b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0 =
            b.asm.Ts).apply(null, arguments);
        }),
      hv = (b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1 =
        function () {
          return (hv = b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1 =
            b.asm.Us).apply(null, arguments);
        }),
      iv = (b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0 =
        function () {
          return (iv = b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0 =
            b.asm.Vs).apply(null, arguments);
        }),
      jv = (b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1 =
        function () {
          return (jv = b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1 =
            b.asm.Ws).apply(null, arguments);
        }),
      kv = (b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0 = function () {
        return (kv = b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0 =
          b.asm.Xs).apply(null, arguments);
      }),
      lv = (b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1 = function () {
        return (lv = b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1 =
          b.asm.Ys).apply(null, arguments);
      }),
      mv = (b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 =
        function () {
          return (mv = b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 =
            b.asm.Zs).apply(null, arguments);
        }),
      nv = (b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 =
        function () {
          return (nv = b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 =
            b.asm._s).apply(null, arguments);
        }),
      ov = (b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 = function () {
        return (ov = b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 =
          b.asm.$s).apply(null, arguments);
      }),
      pv = (b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 = function () {
        return (pv = b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 =
          b.asm.at).apply(null, arguments);
      }),
      qv = (b._emscripten_bind_RaycastInfo_get_m_isInContact_0 = function () {
        return (qv = b._emscripten_bind_RaycastInfo_get_m_isInContact_0 =
          b.asm.bt).apply(null, arguments);
      }),
      rv = (b._emscripten_bind_RaycastInfo_set_m_isInContact_1 = function () {
        return (rv = b._emscripten_bind_RaycastInfo_set_m_isInContact_1 =
          b.asm.ct).apply(null, arguments);
      }),
      sv = (b._emscripten_bind_RaycastInfo_get_m_groundObject_0 = function () {
        return (sv = b._emscripten_bind_RaycastInfo_get_m_groundObject_0 =
          b.asm.dt).apply(null, arguments);
      }),
      tv = (b._emscripten_bind_RaycastInfo_set_m_groundObject_1 = function () {
        return (tv = b._emscripten_bind_RaycastInfo_set_m_groundObject_1 =
          b.asm.et).apply(null, arguments);
      }),
      uv = (b._emscripten_bind_RaycastInfo___destroy___0 = function () {
        return (uv = b._emscripten_bind_RaycastInfo___destroy___0 =
          b.asm.ft).apply(null, arguments);
      }),
      vv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 =
          function () {
            return (vv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 =
                b.asm.gt).apply(null, arguments);
          }),
      wv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 =
          function () {
            return (wv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 =
                b.asm.ht).apply(null, arguments);
          }),
      xv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 =
          function () {
            return (xv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 =
                b.asm.it).apply(null, arguments);
          }),
      yv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 =
          function () {
            return (yv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 =
                b.asm.jt).apply(null, arguments);
          }),
      zv = (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 =
        function () {
          return (zv =
            b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 =
              b.asm.kt).apply(null, arguments);
        }),
      Av = (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 =
        function () {
          return (Av =
            b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 =
              b.asm.lt).apply(null, arguments);
        }),
      Bv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 =
          function () {
            return (Bv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 =
                b.asm.mt).apply(null, arguments);
          }),
      Cv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 =
          function () {
            return (Cv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 =
                b.asm.nt).apply(null, arguments);
          }),
      Dv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 =
          function () {
            return (Dv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 =
                b.asm.ot).apply(null, arguments);
          }),
      Ev =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 =
          function () {
            return (Ev =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 =
                b.asm.pt).apply(null, arguments);
          }),
      Fv = (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 =
        function () {
          return (Fv =
            b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 =
              b.asm.qt).apply(null, arguments);
        }),
      Gv = (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 =
        function () {
          return (Gv =
            b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 =
              b.asm.rt).apply(null, arguments);
        }),
      Hv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 =
          function () {
            return (Hv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 =
                b.asm.st).apply(null, arguments);
          }),
      Iv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 =
          function () {
            return (Iv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 =
                b.asm.tt).apply(null, arguments);
          }),
      Jv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 =
          function () {
            return (Jv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 =
                b.asm.ut).apply(null, arguments);
          }),
      Kv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 =
          function () {
            return (Kv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 =
                b.asm.vt).apply(null, arguments);
          }),
      Lv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 =
          function () {
            return (Lv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 =
                b.asm.wt).apply(null, arguments);
          }),
      Mv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 =
          function () {
            return (Mv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 =
                b.asm.xt).apply(null, arguments);
          }),
      Nv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 =
          function () {
            return (Nv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 =
                b.asm.yt).apply(null, arguments);
          }),
      Ov =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 =
          function () {
            return (Ov =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 =
                b.asm.zt).apply(null, arguments);
          }),
      Pv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 =
          function () {
            return (Pv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 =
                b.asm.At).apply(null, arguments);
          }),
      Qv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 =
          function () {
            return (Qv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 =
                b.asm.Bt).apply(null, arguments);
          }),
      Rv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 =
          function () {
            return (Rv =
              b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 =
                b.asm.Ct).apply(null, arguments);
          }),
      Sv =
        (b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 =
          function () {
            return (Sv =
              b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 =
                b.asm.Dt).apply(null, arguments);
          }),
      Tv = (b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0 =
        function () {
          return (Tv =
            b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0 =
              b.asm.Et).apply(null, arguments);
        }),
      Uv = (b._emscripten_bind_btWheelInfo_btWheelInfo_1 = function () {
        return (Uv = b._emscripten_bind_btWheelInfo_btWheelInfo_1 =
          b.asm.Ft).apply(null, arguments);
      }),
      Vv = (b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0 =
        function () {
          return (Vv =
            b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0 =
              b.asm.Gt).apply(null, arguments);
        }),
      Wv = (b._emscripten_bind_btWheelInfo_updateWheel_2 = function () {
        return (Wv = b._emscripten_bind_btWheelInfo_updateWheel_2 =
          b.asm.Ht).apply(null, arguments);
      }),
      Xv = (b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 =
        function () {
          return (Xv =
            b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 =
              b.asm.It).apply(null, arguments);
        }),
      Yv = (b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 =
        function () {
          return (Yv =
            b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 =
              b.asm.Jt).apply(null, arguments);
        }),
      Zv = (b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0 = function () {
        return (Zv = b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0 =
          b.asm.Kt).apply(null, arguments);
      }),
      $v = (b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1 = function () {
        return ($v = b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1 =
          b.asm.Lt).apply(null, arguments);
      }),
      aw = (b._emscripten_bind_btWheelInfo_get_m_engineForce_0 = function () {
        return (aw = b._emscripten_bind_btWheelInfo_get_m_engineForce_0 =
          b.asm.Mt).apply(null, arguments);
      }),
      bw = (b._emscripten_bind_btWheelInfo_set_m_engineForce_1 = function () {
        return (bw = b._emscripten_bind_btWheelInfo_set_m_engineForce_1 =
          b.asm.Nt).apply(null, arguments);
      }),
      cw = (b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0 = function () {
        return (cw = b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0 =
          b.asm.Ot).apply(null, arguments);
      }),
      dw = (b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1 = function () {
        return (dw = b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1 =
          b.asm.Pt).apply(null, arguments);
      }),
      ew = (b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 =
        function () {
          return (ew =
            b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 =
              b.asm.Qt).apply(null, arguments);
        }),
      fw = (b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 =
        function () {
          return (fw =
            b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 =
              b.asm.Rt).apply(null, arguments);
        }),
      gw = (b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 = function () {
        return (gw = b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 =
          b.asm.St).apply(null, arguments);
      }),
      hw = (b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 = function () {
        return (hw = b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 =
          b.asm.Tt).apply(null, arguments);
      }),
      iw = (b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 =
        function () {
          return (iw =
            b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 =
              b.asm.Ut).apply(null, arguments);
        }),
      jw = (b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 =
        function () {
          return (jw =
            b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 =
              b.asm.Vt).apply(null, arguments);
        }),
      kw = (b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 =
        function () {
          return (kw =
            b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 =
              b.asm.Wt).apply(null, arguments);
        }),
      lw = (b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 =
        function () {
          return (lw =
            b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 =
              b.asm.Xt).apply(null, arguments);
        }),
      mw = (b._emscripten_bind_btWheelInfo_get_m_steering_0 = function () {
        return (mw = b._emscripten_bind_btWheelInfo_get_m_steering_0 =
          b.asm.Yt).apply(null, arguments);
      }),
      nw = (b._emscripten_bind_btWheelInfo_set_m_steering_1 = function () {
        return (nw = b._emscripten_bind_btWheelInfo_set_m_steering_1 =
          b.asm.Zt).apply(null, arguments);
      }),
      ow = (b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 =
        function () {
          return (ow =
            b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 =
              b.asm._t).apply(null, arguments);
        }),
      pw = (b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 =
        function () {
          return (pw =
            b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 =
              b.asm.$t).apply(null, arguments);
        }),
      qw = (b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 =
        function () {
          return (qw =
            b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 =
              b.asm.au).apply(null, arguments);
        }),
      rw = (b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 =
        function () {
          return (rw =
            b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 =
              b.asm.bu).apply(null, arguments);
        }),
      sw = (b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 =
        function () {
          return (sw =
            b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 =
              b.asm.cu).apply(null, arguments);
        }),
      tw = (b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 =
        function () {
          return (tw =
            b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 =
              b.asm.du).apply(null, arguments);
        }),
      uw = (b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 = function () {
        return (uw = b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 =
          b.asm.eu).apply(null, arguments);
      }),
      vw = (b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 = function () {
        return (vw = b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 =
          b.asm.fu).apply(null, arguments);
      }),
      ww = (b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0 = function () {
        return (ww = b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0 =
          b.asm.gu).apply(null, arguments);
      }),
      xw = (b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1 = function () {
        return (xw = b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1 =
          b.asm.hu).apply(null, arguments);
      }),
      yw = (b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 =
        function () {
          return (yw =
            b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 =
              b.asm.iu).apply(null, arguments);
        }),
      zw = (b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 =
        function () {
          return (zw =
            b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 =
              b.asm.ju).apply(null, arguments);
        }),
      Aw = (b._emscripten_bind_btWheelInfo_get_m_worldTransform_0 =
        function () {
          return (Aw = b._emscripten_bind_btWheelInfo_get_m_worldTransform_0 =
            b.asm.ku).apply(null, arguments);
        }),
      Bw = (b._emscripten_bind_btWheelInfo_set_m_worldTransform_1 =
        function () {
          return (Bw = b._emscripten_bind_btWheelInfo_set_m_worldTransform_1 =
            b.asm.lu).apply(null, arguments);
        }),
      Cw = (b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 =
        function () {
          return (Cw = b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 =
            b.asm.mu).apply(null, arguments);
        }),
      Dw = (b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 =
        function () {
          return (Dw = b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 =
            b.asm.nu).apply(null, arguments);
        }),
      Ew = (b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 = function () {
        return (Ew = b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 =
          b.asm.ou).apply(null, arguments);
      }),
      Fw = (b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 = function () {
        return (Fw = b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 =
          b.asm.pu).apply(null, arguments);
      }),
      Gw = (b._emscripten_bind_btWheelInfo_get_m_rotation_0 = function () {
        return (Gw = b._emscripten_bind_btWheelInfo_get_m_rotation_0 =
          b.asm.qu).apply(null, arguments);
      }),
      Hw = (b._emscripten_bind_btWheelInfo_set_m_rotation_1 = function () {
        return (Hw = b._emscripten_bind_btWheelInfo_set_m_rotation_1 =
          b.asm.ru).apply(null, arguments);
      }),
      Iw = (b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0 = function () {
        return (Iw = b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0 =
          b.asm.su).apply(null, arguments);
      }),
      Jw = (b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1 = function () {
        return (Jw = b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1 =
          b.asm.tu).apply(null, arguments);
      }),
      Kw = (b._emscripten_bind_btWheelInfo_get_m_brake_0 = function () {
        return (Kw = b._emscripten_bind_btWheelInfo_get_m_brake_0 =
          b.asm.uu).apply(null, arguments);
      }),
      Lw = (b._emscripten_bind_btWheelInfo_set_m_brake_1 = function () {
        return (Lw = b._emscripten_bind_btWheelInfo_set_m_brake_1 =
          b.asm.vu).apply(null, arguments);
      }),
      Mw =
        (b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 =
          function () {
            return (Mw =
              b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 =
                b.asm.wu).apply(null, arguments);
          }),
      Nw =
        (b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 =
          function () {
            return (Nw =
              b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 =
                b.asm.xu).apply(null, arguments);
          }),
      Ow = (b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 =
        function () {
          return (Ow =
            b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 =
              b.asm.yu).apply(null, arguments);
        }),
      Pw = (b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 =
        function () {
          return (Pw =
            b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 =
              b.asm.zu).apply(null, arguments);
        }),
      Qw = (b._emscripten_bind_btWheelInfo_get_m_skidInfo_0 = function () {
        return (Qw = b._emscripten_bind_btWheelInfo_get_m_skidInfo_0 =
          b.asm.Au).apply(null, arguments);
      }),
      Rw = (b._emscripten_bind_btWheelInfo_set_m_skidInfo_1 = function () {
        return (Rw = b._emscripten_bind_btWheelInfo_set_m_skidInfo_1 =
          b.asm.Bu).apply(null, arguments);
      }),
      Sw = (b._emscripten_bind_btWheelInfo___destroy___0 = function () {
        return (Sw = b._emscripten_bind_btWheelInfo___destroy___0 =
          b.asm.Cu).apply(null, arguments);
      }),
      Tw =
        (b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 =
          function () {
            return (Tw =
              b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 =
                b.asm.Du).apply(null, arguments);
          }),
      Uw =
        (b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 =
          function () {
            return (Uw =
              b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 =
                b.asm.Eu).apply(null, arguments);
          }),
      Vw = (b._emscripten_bind_btKinematicCharacterController_setUpAxis_1 =
        function () {
          return (Vw =
            b._emscripten_bind_btKinematicCharacterController_setUpAxis_1 =
              b.asm.Fu).apply(null, arguments);
        }),
      Ww =
        (b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1 =
          function () {
            return (Ww =
              b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1 =
                b.asm.Gu).apply(null, arguments);
          }),
      Xw =
        (b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 =
          function () {
            return (Xw =
              b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 =
                b.asm.Hu).apply(null, arguments);
          }),
      Yw = (b._emscripten_bind_btKinematicCharacterController_warp_1 =
        function () {
          return (Yw =
            b._emscripten_bind_btKinematicCharacterController_warp_1 =
              b.asm.Iu).apply(null, arguments);
        }),
      Zw = (b._emscripten_bind_btKinematicCharacterController_preStep_1 =
        function () {
          return (Zw =
            b._emscripten_bind_btKinematicCharacterController_preStep_1 =
              b.asm.Ju).apply(null, arguments);
        }),
      $w = (b._emscripten_bind_btKinematicCharacterController_playerStep_2 =
        function () {
          return ($w =
            b._emscripten_bind_btKinematicCharacterController_playerStep_2 =
              b.asm.Ku).apply(null, arguments);
        }),
      ax = (b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1 =
        function () {
          return (ax =
            b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1 =
              b.asm.Lu).apply(null, arguments);
        }),
      bx = (b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 =
        function () {
          return (bx =
            b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 =
              b.asm.Mu).apply(null, arguments);
        }),
      cx =
        (b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 =
          function () {
            return (cx =
              b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 =
                b.asm.Nu).apply(null, arguments);
          }),
      dx = (b._emscripten_bind_btKinematicCharacterController_canJump_0 =
        function () {
          return (dx =
            b._emscripten_bind_btKinematicCharacterController_canJump_0 =
              b.asm.Ou).apply(null, arguments);
        }),
      ex = (b._emscripten_bind_btKinematicCharacterController_jump_0 =
        function () {
          return (ex =
            b._emscripten_bind_btKinematicCharacterController_jump_0 =
              b.asm.Pu).apply(null, arguments);
        }),
      fx = (b._emscripten_bind_btKinematicCharacterController_setGravity_1 =
        function () {
          return (fx =
            b._emscripten_bind_btKinematicCharacterController_setGravity_1 =
              b.asm.Qu).apply(null, arguments);
        }),
      gx = (b._emscripten_bind_btKinematicCharacterController_getGravity_0 =
        function () {
          return (gx =
            b._emscripten_bind_btKinematicCharacterController_getGravity_0 =
              b.asm.Ru).apply(null, arguments);
        }),
      hx = (b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1 =
        function () {
          return (hx =
            b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1 =
              b.asm.Su).apply(null, arguments);
        }),
      ix = (b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0 =
        function () {
          return (ix =
            b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0 =
              b.asm.Tu).apply(null, arguments);
        }),
      jx = (b._emscripten_bind_btKinematicCharacterController_getGhostObject_0 =
        function () {
          return (jx =
            b._emscripten_bind_btKinematicCharacterController_getGhostObject_0 =
              b.asm.Uu).apply(null, arguments);
        }),
      kx =
        (b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 =
          function () {
            return (kx =
              b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 =
                b.asm.Vu).apply(null, arguments);
          }),
      lx = (b._emscripten_bind_btKinematicCharacterController_onGround_0 =
        function () {
          return (lx =
            b._emscripten_bind_btKinematicCharacterController_onGround_0 =
              b.asm.Wu).apply(null, arguments);
        }),
      mx =
        (b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 =
          function () {
            return (mx =
              b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 =
                b.asm.Xu).apply(null, arguments);
          }),
      nx = (b._emscripten_bind_btKinematicCharacterController_updateAction_2 =
        function () {
          return (nx =
            b._emscripten_bind_btKinematicCharacterController_updateAction_2 =
              b.asm.Yu).apply(null, arguments);
        }),
      ox = (b._emscripten_bind_btKinematicCharacterController___destroy___0 =
        function () {
          return (ox =
            b._emscripten_bind_btKinematicCharacterController___destroy___0 =
              b.asm.Zu).apply(null, arguments);
        }),
      px = (b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 =
        function () {
          return (px = b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 =
            b.asm._u).apply(null, arguments);
        }),
      qx = (b._emscripten_bind_btRaycastVehicle_applyEngineForce_2 =
        function () {
          return (qx = b._emscripten_bind_btRaycastVehicle_applyEngineForce_2 =
            b.asm.$u).apply(null, arguments);
        }),
      rx = (b._emscripten_bind_btRaycastVehicle_setSteeringValue_2 =
        function () {
          return (rx = b._emscripten_bind_btRaycastVehicle_setSteeringValue_2 =
            b.asm.av).apply(null, arguments);
        }),
      sx = (b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 =
        function () {
          return (sx =
            b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 =
              b.asm.bv).apply(null, arguments);
        }),
      tx = (b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2 =
        function () {
          return (tx =
            b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2 =
              b.asm.cv).apply(null, arguments);
        }),
      ux = (b._emscripten_bind_btRaycastVehicle_addWheel_7 = function () {
        return (ux = b._emscripten_bind_btRaycastVehicle_addWheel_7 =
          b.asm.dv).apply(null, arguments);
      }),
      vx = (b._emscripten_bind_btRaycastVehicle_getNumWheels_0 = function () {
        return (vx = b._emscripten_bind_btRaycastVehicle_getNumWheels_0 =
          b.asm.ev).apply(null, arguments);
      }),
      wx = (b._emscripten_bind_btRaycastVehicle_getRigidBody_0 = function () {
        return (wx = b._emscripten_bind_btRaycastVehicle_getRigidBody_0 =
          b.asm.fv).apply(null, arguments);
      }),
      xx = (b._emscripten_bind_btRaycastVehicle_getWheelInfo_1 = function () {
        return (xx = b._emscripten_bind_btRaycastVehicle_getWheelInfo_1 =
          b.asm.gv).apply(null, arguments);
      }),
      yx = (b._emscripten_bind_btRaycastVehicle_setBrake_2 = function () {
        return (yx = b._emscripten_bind_btRaycastVehicle_setBrake_2 =
          b.asm.hv).apply(null, arguments);
      }),
      zx = (b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 =
        function () {
          return (zx =
            b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 =
              b.asm.iv).apply(null, arguments);
        }),
      Ax = (b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 =
        function () {
          return (Ax =
            b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 =
              b.asm.jv).apply(null, arguments);
        }),
      Bx = (b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 =
        function () {
          return (Bx =
            b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 =
              b.asm.kv).apply(null, arguments);
        }),
      Cx = (b._emscripten_bind_btRaycastVehicle_rayCast_1 = function () {
        return (Cx = b._emscripten_bind_btRaycastVehicle_rayCast_1 =
          b.asm.lv).apply(null, arguments);
      }),
      Dx = (b._emscripten_bind_btRaycastVehicle_updateVehicle_1 = function () {
        return (Dx = b._emscripten_bind_btRaycastVehicle_updateVehicle_1 =
          b.asm.mv).apply(null, arguments);
      }),
      Ex = (b._emscripten_bind_btRaycastVehicle_resetSuspension_0 =
        function () {
          return (Ex = b._emscripten_bind_btRaycastVehicle_resetSuspension_0 =
            b.asm.nv).apply(null, arguments);
        }),
      Fx = (b._emscripten_bind_btRaycastVehicle_getSteeringValue_1 =
        function () {
          return (Fx = b._emscripten_bind_btRaycastVehicle_getSteeringValue_1 =
            b.asm.ov).apply(null, arguments);
        }),
      Gx = (b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 =
        function () {
          return (Gx =
            b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 =
              b.asm.pv).apply(null, arguments);
        }),
      Hx = (b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 =
        function () {
          return (Hx =
            b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 =
              b.asm.qv).apply(null, arguments);
        }),
      Ix = (b._emscripten_bind_btRaycastVehicle_setPitchControl_1 =
        function () {
          return (Ix = b._emscripten_bind_btRaycastVehicle_setPitchControl_1 =
            b.asm.rv).apply(null, arguments);
        }),
      Jx = (b._emscripten_bind_btRaycastVehicle_updateSuspension_1 =
        function () {
          return (Jx = b._emscripten_bind_btRaycastVehicle_updateSuspension_1 =
            b.asm.sv).apply(null, arguments);
        }),
      Kx = (b._emscripten_bind_btRaycastVehicle_updateFriction_1 = function () {
        return (Kx = b._emscripten_bind_btRaycastVehicle_updateFriction_1 =
          b.asm.tv).apply(null, arguments);
      }),
      Lx = (b._emscripten_bind_btRaycastVehicle_getRightAxis_0 = function () {
        return (Lx = b._emscripten_bind_btRaycastVehicle_getRightAxis_0 =
          b.asm.uv).apply(null, arguments);
      }),
      Mx = (b._emscripten_bind_btRaycastVehicle_getUpAxis_0 = function () {
        return (Mx = b._emscripten_bind_btRaycastVehicle_getUpAxis_0 =
          b.asm.vv).apply(null, arguments);
      }),
      Nx = (b._emscripten_bind_btRaycastVehicle_getForwardAxis_0 = function () {
        return (Nx = b._emscripten_bind_btRaycastVehicle_getForwardAxis_0 =
          b.asm.wv).apply(null, arguments);
      }),
      Ox = (b._emscripten_bind_btRaycastVehicle_getForwardVector_0 =
        function () {
          return (Ox = b._emscripten_bind_btRaycastVehicle_getForwardVector_0 =
            b.asm.xv).apply(null, arguments);
        }),
      Px = (b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0 =
        function () {
          return (Px =
            b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0 =
              b.asm.yv).apply(null, arguments);
        }),
      Qx = (b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1 =
        function () {
          return (Qx =
            b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1 =
              b.asm.zv).apply(null, arguments);
        }),
      Rx = (b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1 =
        function () {
          return (Rx =
            b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1 =
              b.asm.Av).apply(null, arguments);
        }),
      Sx = (b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0 =
        function () {
          return (Sx =
            b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0 =
              b.asm.Bv).apply(null, arguments);
        }),
      Tx = (b._emscripten_bind_btRaycastVehicle_updateAction_2 = function () {
        return (Tx = b._emscripten_bind_btRaycastVehicle_updateAction_2 =
          b.asm.Cv).apply(null, arguments);
      }),
      Ux = (b._emscripten_bind_btRaycastVehicle___destroy___0 = function () {
        return (Ux = b._emscripten_bind_btRaycastVehicle___destroy___0 =
          b.asm.Dv).apply(null, arguments);
      }),
      Vx =
        (b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 =
          function () {
            return (Vx =
              b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 =
                b.asm.Ev).apply(null, arguments);
          }),
      Wx =
        (b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 =
          function () {
            return (Wx =
              b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 =
                b.asm.Fv).apply(null, arguments);
          }),
      Xx = (b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 =
        function () {
          return (Xx =
            b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 =
              b.asm.Gv).apply(null, arguments);
        }),
      Yx =
        (b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 =
          function () {
            return (Yx =
              b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 =
                b.asm.Hv).apply(null, arguments);
          }),
      Zx = (b._emscripten_bind_btPairCachingGhostObject_setActivationState_1 =
        function () {
          return (Zx =
            b._emscripten_bind_btPairCachingGhostObject_setActivationState_1 =
              b.asm.Iv).apply(null, arguments);
        }),
      $x = (b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1 =
        function () {
          return ($x =
            b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1 =
              b.asm.Jv).apply(null, arguments);
        }),
      ay = (b._emscripten_bind_btPairCachingGhostObject_activate_0 =
        function () {
          return (ay = b._emscripten_bind_btPairCachingGhostObject_activate_0 =
            b.asm.Kv).apply(null, arguments);
        }),
      by = (b._emscripten_bind_btPairCachingGhostObject_activate_1 =
        function () {
          return (by = b._emscripten_bind_btPairCachingGhostObject_activate_1 =
            b.asm.Lv).apply(null, arguments);
        }),
      cy = (b._emscripten_bind_btPairCachingGhostObject_isActive_0 =
        function () {
          return (cy = b._emscripten_bind_btPairCachingGhostObject_isActive_0 =
            b.asm.Mv).apply(null, arguments);
        }),
      dy = (b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 =
        function () {
          return (dy =
            b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 =
              b.asm.Nv).apply(null, arguments);
        }),
      ey = (b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0 =
        function () {
          return (ey =
            b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0 =
              b.asm.Ov).apply(null, arguments);
        }),
      fy =
        (b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 =
          function () {
            return (fy =
              b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 =
                b.asm.Pv).apply(null, arguments);
          }),
      gy = (b._emscripten_bind_btPairCachingGhostObject_getRestitution_0 =
        function () {
          return (gy =
            b._emscripten_bind_btPairCachingGhostObject_getRestitution_0 =
              b.asm.Qv).apply(null, arguments);
        }),
      hy = (b._emscripten_bind_btPairCachingGhostObject_getFriction_0 =
        function () {
          return (hy =
            b._emscripten_bind_btPairCachingGhostObject_getFriction_0 =
              b.asm.Rv).apply(null, arguments);
        }),
      iy = (b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0 =
        function () {
          return (iy =
            b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0 =
              b.asm.Sv).apply(null, arguments);
        }),
      jy = (b._emscripten_bind_btPairCachingGhostObject_setRestitution_1 =
        function () {
          return (jy =
            b._emscripten_bind_btPairCachingGhostObject_setRestitution_1 =
              b.asm.Tv).apply(null, arguments);
        }),
      ky = (b._emscripten_bind_btPairCachingGhostObject_setFriction_1 =
        function () {
          return (ky =
            b._emscripten_bind_btPairCachingGhostObject_setFriction_1 =
              b.asm.Uv).apply(null, arguments);
        }),
      ly = (b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 =
        function () {
          return (ly =
            b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 =
              b.asm.Vv).apply(null, arguments);
        }),
      my = (b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 =
        function () {
          return (my =
            b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 =
              b.asm.Wv).apply(null, arguments);
        }),
      ny = (b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 =
        function () {
          return (ny =
            b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 =
              b.asm.Xv).apply(null, arguments);
        }),
      oy = (b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 =
        function () {
          return (oy =
            b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 =
              b.asm.Yv).apply(null, arguments);
        }),
      py = (b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 =
        function () {
          return (py =
            b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 =
              b.asm.Zv).apply(null, arguments);
        }),
      qy = (b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 =
        function () {
          return (qy =
            b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 =
              b.asm._v).apply(null, arguments);
        }),
      ry =
        (b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 =
          function () {
            return (ry =
              b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 =
                b.asm.$v).apply(null, arguments);
          }),
      sy =
        (b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 =
          function () {
            return (sy =
              b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 =
                b.asm.aw).apply(null, arguments);
          }),
      ty = (b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0 =
        function () {
          return (ty =
            b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0 =
              b.asm.bw).apply(null, arguments);
        }),
      uy = (b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1 =
        function () {
          return (uy =
            b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1 =
              b.asm.cw).apply(null, arguments);
        }),
      vy = (b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0 =
        function () {
          return (vy =
            b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0 =
              b.asm.dw).apply(null, arguments);
        }),
      wy = (b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1 =
        function () {
          return (wy =
            b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1 =
              b.asm.ew).apply(null, arguments);
        }),
      xy = (b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0 =
        function () {
          return (xy =
            b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0 =
              b.asm.fw).apply(null, arguments);
        }),
      yy =
        (b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 =
          function () {
            return (yy =
              b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 =
                b.asm.gw).apply(null, arguments);
          }),
      zy = (b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 =
        function () {
          return (zy =
            b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 =
              b.asm.hw).apply(null, arguments);
        }),
      Ay = (b._emscripten_bind_btPairCachingGhostObject___destroy___0 =
        function () {
          return (Ay =
            b._emscripten_bind_btPairCachingGhostObject___destroy___0 =
              b.asm.iw).apply(null, arguments);
        }),
      By = (b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 =
        function () {
          return (By =
            b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 =
              b.asm.jw).apply(null, arguments);
        }),
      Cy = (b._emscripten_bind_btGhostPairCallback___destroy___0 = function () {
        return (Cy = b._emscripten_bind_btGhostPairCallback___destroy___0 =
          b.asm.kw).apply(null, arguments);
      }),
      Dy = (b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 =
        function () {
          return (Dy =
            b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 =
              b.asm.lw).apply(null, arguments);
        }),
      Ey = (b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 =
        function () {
          return (Ey =
            b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 =
              b.asm.mw).apply(null, arguments);
        }),
      Fy = (b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 =
        function () {
          return (Fy =
            b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 =
              b.asm.nw).apply(null, arguments);
        }),
      Gy = (b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 =
        function () {
          return (Gy =
            b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 =
              b.asm.ow).apply(null, arguments);
        }),
      Hy = (b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 =
        function () {
          return (Hy =
            b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 =
              b.asm.pw).apply(null, arguments);
        }),
      Iy = (b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 =
        function () {
          return (Iy =
            b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 =
              b.asm.qw).apply(null, arguments);
        }),
      Jy = (b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 =
        function () {
          return (Jy =
            b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 =
              b.asm.rw).apply(null, arguments);
        }),
      Ky = (b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 =
        function () {
          return (Ky =
            b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 =
              b.asm.sw).apply(null, arguments);
        }),
      Ly = (b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 =
        function () {
          return (Ly =
            b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 =
              b.asm.tw).apply(null, arguments);
        }),
      My = (b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 =
        function () {
          return (My =
            b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 =
              b.asm.uw).apply(null, arguments);
        }),
      Ny = (b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 =
        function () {
          return (Ny =
            b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 =
              b.asm.vw).apply(null, arguments);
        }),
      Oy = (b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 =
        function () {
          return (Oy =
            b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 =
              b.asm.ww).apply(null, arguments);
        }),
      Py = (b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 =
        function () {
          return (Py =
            b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 =
              b.asm.xw).apply(null, arguments);
        }),
      Qy = (b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 =
        function () {
          return (Qy =
            b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 =
              b.asm.yw).apply(null, arguments);
        }),
      Ry = (b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 =
        function () {
          return (Ry =
            b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 =
              b.asm.zw).apply(null, arguments);
        }),
      Sy = (b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 =
        function () {
          return (Sy = b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 =
            b.asm.Aw).apply(null, arguments);
        }),
      Ty = (b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 =
        function () {
          return (Ty = b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 =
            b.asm.Bw).apply(null, arguments);
        }),
      Uy = (b._emscripten_bind_btSoftBodyWorldInfo___destroy___0 = function () {
        return (Uy = b._emscripten_bind_btSoftBodyWorldInfo___destroy___0 =
          b.asm.Cw).apply(null, arguments);
      }),
      Vy = (b._emscripten_bind_Face_get_m_n_1 = function () {
        return (Vy = b._emscripten_bind_Face_get_m_n_1 = b.asm.Dw).apply(
          null,
          arguments
        );
      }),
      Wy = (b._emscripten_bind_Face_set_m_n_2 = function () {
        return (Wy = b._emscripten_bind_Face_set_m_n_2 = b.asm.Ew).apply(
          null,
          arguments
        );
      }),
      Xy = (b._emscripten_bind_Face_get_m_normal_0 = function () {
        return (Xy = b._emscripten_bind_Face_get_m_normal_0 = b.asm.Fw).apply(
          null,
          arguments
        );
      }),
      Yy = (b._emscripten_bind_Face_set_m_normal_1 = function () {
        return (Yy = b._emscripten_bind_Face_set_m_normal_1 = b.asm.Gw).apply(
          null,
          arguments
        );
      }),
      Zy = (b._emscripten_bind_Face_get_m_ra_0 = function () {
        return (Zy = b._emscripten_bind_Face_get_m_ra_0 = b.asm.Hw).apply(
          null,
          arguments
        );
      }),
      $y = (b._emscripten_bind_Face_set_m_ra_1 = function () {
        return ($y = b._emscripten_bind_Face_set_m_ra_1 = b.asm.Iw).apply(
          null,
          arguments
        );
      }),
      az = (b._emscripten_bind_Face___destroy___0 = function () {
        return (az = b._emscripten_bind_Face___destroy___0 = b.asm.Jw).apply(
          null,
          arguments
        );
      }),
      bz = (b._emscripten_bind_tFaceArray_size_0 = function () {
        return (bz = b._emscripten_bind_tFaceArray_size_0 = b.asm.Kw).apply(
          null,
          arguments
        );
      }),
      cz = (b._emscripten_bind_tFaceArray_at_1 = function () {
        return (cz = b._emscripten_bind_tFaceArray_at_1 = b.asm.Lw).apply(
          null,
          arguments
        );
      }),
      dz = (b._emscripten_bind_tFaceArray___destroy___0 = function () {
        return (dz = b._emscripten_bind_tFaceArray___destroy___0 =
          b.asm.Mw).apply(null, arguments);
      }),
      ez = (b._emscripten_bind_Node_get_m_x_0 = function () {
        return (ez = b._emscripten_bind_Node_get_m_x_0 = b.asm.Nw).apply(
          null,
          arguments
        );
      }),
      fz = (b._emscripten_bind_Node_set_m_x_1 = function () {
        return (fz = b._emscripten_bind_Node_set_m_x_1 = b.asm.Ow).apply(
          null,
          arguments
        );
      }),
      gz = (b._emscripten_bind_Node_get_m_q_0 = function () {
        return (gz = b._emscripten_bind_Node_get_m_q_0 = b.asm.Pw).apply(
          null,
          arguments
        );
      }),
      hz = (b._emscripten_bind_Node_set_m_q_1 = function () {
        return (hz = b._emscripten_bind_Node_set_m_q_1 = b.asm.Qw).apply(
          null,
          arguments
        );
      }),
      iz = (b._emscripten_bind_Node_get_m_v_0 = function () {
        return (iz = b._emscripten_bind_Node_get_m_v_0 = b.asm.Rw).apply(
          null,
          arguments
        );
      }),
      jz = (b._emscripten_bind_Node_set_m_v_1 = function () {
        return (jz = b._emscripten_bind_Node_set_m_v_1 = b.asm.Sw).apply(
          null,
          arguments
        );
      }),
      kz = (b._emscripten_bind_Node_get_m_f_0 = function () {
        return (kz = b._emscripten_bind_Node_get_m_f_0 = b.asm.Tw).apply(
          null,
          arguments
        );
      }),
      lz = (b._emscripten_bind_Node_set_m_f_1 = function () {
        return (lz = b._emscripten_bind_Node_set_m_f_1 = b.asm.Uw).apply(
          null,
          arguments
        );
      }),
      mz = (b._emscripten_bind_Node_get_m_n_0 = function () {
        return (mz = b._emscripten_bind_Node_get_m_n_0 = b.asm.Vw).apply(
          null,
          arguments
        );
      }),
      nz = (b._emscripten_bind_Node_set_m_n_1 = function () {
        return (nz = b._emscripten_bind_Node_set_m_n_1 = b.asm.Ww).apply(
          null,
          arguments
        );
      }),
      oz = (b._emscripten_bind_Node_get_m_im_0 = function () {
        return (oz = b._emscripten_bind_Node_get_m_im_0 = b.asm.Xw).apply(
          null,
          arguments
        );
      }),
      pz = (b._emscripten_bind_Node_set_m_im_1 = function () {
        return (pz = b._emscripten_bind_Node_set_m_im_1 = b.asm.Yw).apply(
          null,
          arguments
        );
      }),
      qz = (b._emscripten_bind_Node_get_m_area_0 = function () {
        return (qz = b._emscripten_bind_Node_get_m_area_0 = b.asm.Zw).apply(
          null,
          arguments
        );
      }),
      rz = (b._emscripten_bind_Node_set_m_area_1 = function () {
        return (rz = b._emscripten_bind_Node_set_m_area_1 = b.asm._w).apply(
          null,
          arguments
        );
      }),
      sz = (b._emscripten_bind_Node___destroy___0 = function () {
        return (sz = b._emscripten_bind_Node___destroy___0 = b.asm.$w).apply(
          null,
          arguments
        );
      }),
      tz = (b._emscripten_bind_tNodeArray_size_0 = function () {
        return (tz = b._emscripten_bind_tNodeArray_size_0 = b.asm.ax).apply(
          null,
          arguments
        );
      }),
      uz = (b._emscripten_bind_tNodeArray_at_1 = function () {
        return (uz = b._emscripten_bind_tNodeArray_at_1 = b.asm.bx).apply(
          null,
          arguments
        );
      }),
      vz = (b._emscripten_bind_tNodeArray___destroy___0 = function () {
        return (vz = b._emscripten_bind_tNodeArray___destroy___0 =
          b.asm.cx).apply(null, arguments);
      }),
      wz = (b._emscripten_bind_Material_get_m_kLST_0 = function () {
        return (wz = b._emscripten_bind_Material_get_m_kLST_0 = b.asm.dx).apply(
          null,
          arguments
        );
      }),
      xz = (b._emscripten_bind_Material_set_m_kLST_1 = function () {
        return (xz = b._emscripten_bind_Material_set_m_kLST_1 = b.asm.ex).apply(
          null,
          arguments
        );
      }),
      yz = (b._emscripten_bind_Material_get_m_kAST_0 = function () {
        return (yz = b._emscripten_bind_Material_get_m_kAST_0 = b.asm.fx).apply(
          null,
          arguments
        );
      }),
      zz = (b._emscripten_bind_Material_set_m_kAST_1 = function () {
        return (zz = b._emscripten_bind_Material_set_m_kAST_1 = b.asm.gx).apply(
          null,
          arguments
        );
      }),
      Az = (b._emscripten_bind_Material_get_m_kVST_0 = function () {
        return (Az = b._emscripten_bind_Material_get_m_kVST_0 = b.asm.hx).apply(
          null,
          arguments
        );
      }),
      Bz = (b._emscripten_bind_Material_set_m_kVST_1 = function () {
        return (Bz = b._emscripten_bind_Material_set_m_kVST_1 = b.asm.ix).apply(
          null,
          arguments
        );
      }),
      Cz = (b._emscripten_bind_Material_get_m_flags_0 = function () {
        return (Cz = b._emscripten_bind_Material_get_m_flags_0 =
          b.asm.jx).apply(null, arguments);
      }),
      Dz = (b._emscripten_bind_Material_set_m_flags_1 = function () {
        return (Dz = b._emscripten_bind_Material_set_m_flags_1 =
          b.asm.kx).apply(null, arguments);
      }),
      Ez = (b._emscripten_bind_Material___destroy___0 = function () {
        return (Ez = b._emscripten_bind_Material___destroy___0 =
          b.asm.lx).apply(null, arguments);
      }),
      Fz = (b._emscripten_bind_tMaterialArray_size_0 = function () {
        return (Fz = b._emscripten_bind_tMaterialArray_size_0 = b.asm.mx).apply(
          null,
          arguments
        );
      }),
      Gz = (b._emscripten_bind_tMaterialArray_at_1 = function () {
        return (Gz = b._emscripten_bind_tMaterialArray_at_1 = b.asm.nx).apply(
          null,
          arguments
        );
      }),
      Hz = (b._emscripten_bind_tMaterialArray___destroy___0 = function () {
        return (Hz = b._emscripten_bind_tMaterialArray___destroy___0 =
          b.asm.ox).apply(null, arguments);
      }),
      Iz = (b._emscripten_bind_Anchor_get_m_node_0 = function () {
        return (Iz = b._emscripten_bind_Anchor_get_m_node_0 = b.asm.px).apply(
          null,
          arguments
        );
      }),
      Jz = (b._emscripten_bind_Anchor_set_m_node_1 = function () {
        return (Jz = b._emscripten_bind_Anchor_set_m_node_1 = b.asm.qx).apply(
          null,
          arguments
        );
      }),
      Kz = (b._emscripten_bind_Anchor_get_m_local_0 = function () {
        return (Kz = b._emscripten_bind_Anchor_get_m_local_0 = b.asm.rx).apply(
          null,
          arguments
        );
      }),
      Lz = (b._emscripten_bind_Anchor_set_m_local_1 = function () {
        return (Lz = b._emscripten_bind_Anchor_set_m_local_1 = b.asm.sx).apply(
          null,
          arguments
        );
      }),
      Mz = (b._emscripten_bind_Anchor_get_m_body_0 = function () {
        return (Mz = b._emscripten_bind_Anchor_get_m_body_0 = b.asm.tx).apply(
          null,
          arguments
        );
      }),
      Nz = (b._emscripten_bind_Anchor_set_m_body_1 = function () {
        return (Nz = b._emscripten_bind_Anchor_set_m_body_1 = b.asm.ux).apply(
          null,
          arguments
        );
      }),
      Oz = (b._emscripten_bind_Anchor_get_m_influence_0 = function () {
        return (Oz = b._emscripten_bind_Anchor_get_m_influence_0 =
          b.asm.vx).apply(null, arguments);
      }),
      Pz = (b._emscripten_bind_Anchor_set_m_influence_1 = function () {
        return (Pz = b._emscripten_bind_Anchor_set_m_influence_1 =
          b.asm.wx).apply(null, arguments);
      }),
      Qz = (b._emscripten_bind_Anchor_get_m_c0_0 = function () {
        return (Qz = b._emscripten_bind_Anchor_get_m_c0_0 = b.asm.xx).apply(
          null,
          arguments
        );
      }),
      Rz = (b._emscripten_bind_Anchor_set_m_c0_1 = function () {
        return (Rz = b._emscripten_bind_Anchor_set_m_c0_1 = b.asm.yx).apply(
          null,
          arguments
        );
      }),
      Sz = (b._emscripten_bind_Anchor_get_m_c1_0 = function () {
        return (Sz = b._emscripten_bind_Anchor_get_m_c1_0 = b.asm.zx).apply(
          null,
          arguments
        );
      }),
      Tz = (b._emscripten_bind_Anchor_set_m_c1_1 = function () {
        return (Tz = b._emscripten_bind_Anchor_set_m_c1_1 = b.asm.Ax).apply(
          null,
          arguments
        );
      }),
      Uz = (b._emscripten_bind_Anchor_get_m_c2_0 = function () {
        return (Uz = b._emscripten_bind_Anchor_get_m_c2_0 = b.asm.Bx).apply(
          null,
          arguments
        );
      }),
      Vz = (b._emscripten_bind_Anchor_set_m_c2_1 = function () {
        return (Vz = b._emscripten_bind_Anchor_set_m_c2_1 = b.asm.Cx).apply(
          null,
          arguments
        );
      }),
      Wz = (b._emscripten_bind_Anchor___destroy___0 = function () {
        return (Wz = b._emscripten_bind_Anchor___destroy___0 = b.asm.Dx).apply(
          null,
          arguments
        );
      }),
      Xz = (b._emscripten_bind_tAnchorArray_size_0 = function () {
        return (Xz = b._emscripten_bind_tAnchorArray_size_0 = b.asm.Ex).apply(
          null,
          arguments
        );
      }),
      Yz = (b._emscripten_bind_tAnchorArray_at_1 = function () {
        return (Yz = b._emscripten_bind_tAnchorArray_at_1 = b.asm.Fx).apply(
          null,
          arguments
        );
      }),
      Zz = (b._emscripten_bind_tAnchorArray_clear_0 = function () {
        return (Zz = b._emscripten_bind_tAnchorArray_clear_0 = b.asm.Gx).apply(
          null,
          arguments
        );
      }),
      $z = (b._emscripten_bind_tAnchorArray_push_back_1 = function () {
        return ($z = b._emscripten_bind_tAnchorArray_push_back_1 =
          b.asm.Hx).apply(null, arguments);
      }),
      aA = (b._emscripten_bind_tAnchorArray_pop_back_0 = function () {
        return (aA = b._emscripten_bind_tAnchorArray_pop_back_0 =
          b.asm.Ix).apply(null, arguments);
      }),
      bA = (b._emscripten_bind_tAnchorArray___destroy___0 = function () {
        return (bA = b._emscripten_bind_tAnchorArray___destroy___0 =
          b.asm.Jx).apply(null, arguments);
      }),
      cA = (b._emscripten_bind_Config_get_kVCF_0 = function () {
        return (cA = b._emscripten_bind_Config_get_kVCF_0 = b.asm.Kx).apply(
          null,
          arguments
        );
      }),
      dA = (b._emscripten_bind_Config_set_kVCF_1 = function () {
        return (dA = b._emscripten_bind_Config_set_kVCF_1 = b.asm.Lx).apply(
          null,
          arguments
        );
      }),
      eA = (b._emscripten_bind_Config_get_kDP_0 = function () {
        return (eA = b._emscripten_bind_Config_get_kDP_0 = b.asm.Mx).apply(
          null,
          arguments
        );
      }),
      fA = (b._emscripten_bind_Config_set_kDP_1 = function () {
        return (fA = b._emscripten_bind_Config_set_kDP_1 = b.asm.Nx).apply(
          null,
          arguments
        );
      }),
      gA = (b._emscripten_bind_Config_get_kDG_0 = function () {
        return (gA = b._emscripten_bind_Config_get_kDG_0 = b.asm.Ox).apply(
          null,
          arguments
        );
      }),
      hA = (b._emscripten_bind_Config_set_kDG_1 = function () {
        return (hA = b._emscripten_bind_Config_set_kDG_1 = b.asm.Px).apply(
          null,
          arguments
        );
      }),
      iA = (b._emscripten_bind_Config_get_kLF_0 = function () {
        return (iA = b._emscripten_bind_Config_get_kLF_0 = b.asm.Qx).apply(
          null,
          arguments
        );
      }),
      jA = (b._emscripten_bind_Config_set_kLF_1 = function () {
        return (jA = b._emscripten_bind_Config_set_kLF_1 = b.asm.Rx).apply(
          null,
          arguments
        );
      }),
      kA = (b._emscripten_bind_Config_get_kPR_0 = function () {
        return (kA = b._emscripten_bind_Config_get_kPR_0 = b.asm.Sx).apply(
          null,
          arguments
        );
      }),
      lA = (b._emscripten_bind_Config_set_kPR_1 = function () {
        return (lA = b._emscripten_bind_Config_set_kPR_1 = b.asm.Tx).apply(
          null,
          arguments
        );
      }),
      mA = (b._emscripten_bind_Config_get_kVC_0 = function () {
        return (mA = b._emscripten_bind_Config_get_kVC_0 = b.asm.Ux).apply(
          null,
          arguments
        );
      }),
      nA = (b._emscripten_bind_Config_set_kVC_1 = function () {
        return (nA = b._emscripten_bind_Config_set_kVC_1 = b.asm.Vx).apply(
          null,
          arguments
        );
      }),
      oA = (b._emscripten_bind_Config_get_kDF_0 = function () {
        return (oA = b._emscripten_bind_Config_get_kDF_0 = b.asm.Wx).apply(
          null,
          arguments
        );
      }),
      pA = (b._emscripten_bind_Config_set_kDF_1 = function () {
        return (pA = b._emscripten_bind_Config_set_kDF_1 = b.asm.Xx).apply(
          null,
          arguments
        );
      }),
      qA = (b._emscripten_bind_Config_get_kMT_0 = function () {
        return (qA = b._emscripten_bind_Config_get_kMT_0 = b.asm.Yx).apply(
          null,
          arguments
        );
      }),
      rA = (b._emscripten_bind_Config_set_kMT_1 = function () {
        return (rA = b._emscripten_bind_Config_set_kMT_1 = b.asm.Zx).apply(
          null,
          arguments
        );
      }),
      sA = (b._emscripten_bind_Config_get_kCHR_0 = function () {
        return (sA = b._emscripten_bind_Config_get_kCHR_0 = b.asm._x).apply(
          null,
          arguments
        );
      }),
      tA = (b._emscripten_bind_Config_set_kCHR_1 = function () {
        return (tA = b._emscripten_bind_Config_set_kCHR_1 = b.asm.$x).apply(
          null,
          arguments
        );
      }),
      uA = (b._emscripten_bind_Config_get_kKHR_0 = function () {
        return (uA = b._emscripten_bind_Config_get_kKHR_0 = b.asm.ay).apply(
          null,
          arguments
        );
      }),
      vA = (b._emscripten_bind_Config_set_kKHR_1 = function () {
        return (vA = b._emscripten_bind_Config_set_kKHR_1 = b.asm.by).apply(
          null,
          arguments
        );
      }),
      wA = (b._emscripten_bind_Config_get_kSHR_0 = function () {
        return (wA = b._emscripten_bind_Config_get_kSHR_0 = b.asm.cy).apply(
          null,
          arguments
        );
      }),
      xA = (b._emscripten_bind_Config_set_kSHR_1 = function () {
        return (xA = b._emscripten_bind_Config_set_kSHR_1 = b.asm.dy).apply(
          null,
          arguments
        );
      }),
      yA = (b._emscripten_bind_Config_get_kAHR_0 = function () {
        return (yA = b._emscripten_bind_Config_get_kAHR_0 = b.asm.ey).apply(
          null,
          arguments
        );
      }),
      zA = (b._emscripten_bind_Config_set_kAHR_1 = function () {
        return (zA = b._emscripten_bind_Config_set_kAHR_1 = b.asm.fy).apply(
          null,
          arguments
        );
      }),
      AA = (b._emscripten_bind_Config_get_kSRHR_CL_0 = function () {
        return (AA = b._emscripten_bind_Config_get_kSRHR_CL_0 = b.asm.gy).apply(
          null,
          arguments
        );
      }),
      BA = (b._emscripten_bind_Config_set_kSRHR_CL_1 = function () {
        return (BA = b._emscripten_bind_Config_set_kSRHR_CL_1 = b.asm.hy).apply(
          null,
          arguments
        );
      }),
      CA = (b._emscripten_bind_Config_get_kSKHR_CL_0 = function () {
        return (CA = b._emscripten_bind_Config_get_kSKHR_CL_0 = b.asm.iy).apply(
          null,
          arguments
        );
      }),
      DA = (b._emscripten_bind_Config_set_kSKHR_CL_1 = function () {
        return (DA = b._emscripten_bind_Config_set_kSKHR_CL_1 = b.asm.jy).apply(
          null,
          arguments
        );
      }),
      EA = (b._emscripten_bind_Config_get_kSSHR_CL_0 = function () {
        return (EA = b._emscripten_bind_Config_get_kSSHR_CL_0 = b.asm.ky).apply(
          null,
          arguments
        );
      }),
      FA = (b._emscripten_bind_Config_set_kSSHR_CL_1 = function () {
        return (FA = b._emscripten_bind_Config_set_kSSHR_CL_1 = b.asm.ly).apply(
          null,
          arguments
        );
      }),
      GA = (b._emscripten_bind_Config_get_kSR_SPLT_CL_0 = function () {
        return (GA = b._emscripten_bind_Config_get_kSR_SPLT_CL_0 =
          b.asm.my).apply(null, arguments);
      }),
      HA = (b._emscripten_bind_Config_set_kSR_SPLT_CL_1 = function () {
        return (HA = b._emscripten_bind_Config_set_kSR_SPLT_CL_1 =
          b.asm.ny).apply(null, arguments);
      }),
      IA = (b._emscripten_bind_Config_get_kSK_SPLT_CL_0 = function () {
        return (IA = b._emscripten_bind_Config_get_kSK_SPLT_CL_0 =
          b.asm.oy).apply(null, arguments);
      }),
      JA = (b._emscripten_bind_Config_set_kSK_SPLT_CL_1 = function () {
        return (JA = b._emscripten_bind_Config_set_kSK_SPLT_CL_1 =
          b.asm.py).apply(null, arguments);
      }),
      KA = (b._emscripten_bind_Config_get_kSS_SPLT_CL_0 = function () {
        return (KA = b._emscripten_bind_Config_get_kSS_SPLT_CL_0 =
          b.asm.qy).apply(null, arguments);
      }),
      LA = (b._emscripten_bind_Config_set_kSS_SPLT_CL_1 = function () {
        return (LA = b._emscripten_bind_Config_set_kSS_SPLT_CL_1 =
          b.asm.ry).apply(null, arguments);
      }),
      MA = (b._emscripten_bind_Config_get_maxvolume_0 = function () {
        return (MA = b._emscripten_bind_Config_get_maxvolume_0 =
          b.asm.sy).apply(null, arguments);
      }),
      NA = (b._emscripten_bind_Config_set_maxvolume_1 = function () {
        return (NA = b._emscripten_bind_Config_set_maxvolume_1 =
          b.asm.ty).apply(null, arguments);
      }),
      OA = (b._emscripten_bind_Config_get_timescale_0 = function () {
        return (OA = b._emscripten_bind_Config_get_timescale_0 =
          b.asm.uy).apply(null, arguments);
      }),
      PA = (b._emscripten_bind_Config_set_timescale_1 = function () {
        return (PA = b._emscripten_bind_Config_set_timescale_1 =
          b.asm.vy).apply(null, arguments);
      }),
      QA = (b._emscripten_bind_Config_get_viterations_0 = function () {
        return (QA = b._emscripten_bind_Config_get_viterations_0 =
          b.asm.wy).apply(null, arguments);
      }),
      RA = (b._emscripten_bind_Config_set_viterations_1 = function () {
        return (RA = b._emscripten_bind_Config_set_viterations_1 =
          b.asm.xy).apply(null, arguments);
      }),
      SA = (b._emscripten_bind_Config_get_piterations_0 = function () {
        return (SA = b._emscripten_bind_Config_get_piterations_0 =
          b.asm.yy).apply(null, arguments);
      }),
      TA = (b._emscripten_bind_Config_set_piterations_1 = function () {
        return (TA = b._emscripten_bind_Config_set_piterations_1 =
          b.asm.zy).apply(null, arguments);
      }),
      UA = (b._emscripten_bind_Config_get_diterations_0 = function () {
        return (UA = b._emscripten_bind_Config_get_diterations_0 =
          b.asm.Ay).apply(null, arguments);
      }),
      VA = (b._emscripten_bind_Config_set_diterations_1 = function () {
        return (VA = b._emscripten_bind_Config_set_diterations_1 =
          b.asm.By).apply(null, arguments);
      }),
      WA = (b._emscripten_bind_Config_get_citerations_0 = function () {
        return (WA = b._emscripten_bind_Config_get_citerations_0 =
          b.asm.Cy).apply(null, arguments);
      }),
      XA = (b._emscripten_bind_Config_set_citerations_1 = function () {
        return (XA = b._emscripten_bind_Config_set_citerations_1 =
          b.asm.Dy).apply(null, arguments);
      }),
      YA = (b._emscripten_bind_Config_get_collisions_0 = function () {
        return (YA = b._emscripten_bind_Config_get_collisions_0 =
          b.asm.Ey).apply(null, arguments);
      }),
      ZA = (b._emscripten_bind_Config_set_collisions_1 = function () {
        return (ZA = b._emscripten_bind_Config_set_collisions_1 =
          b.asm.Fy).apply(null, arguments);
      }),
      $A = (b._emscripten_bind_Config___destroy___0 = function () {
        return ($A = b._emscripten_bind_Config___destroy___0 = b.asm.Gy).apply(
          null,
          arguments
        );
      }),
      aB = (b._emscripten_bind_btSoftBody_btSoftBody_4 = function () {
        return (aB = b._emscripten_bind_btSoftBody_btSoftBody_4 =
          b.asm.Hy).apply(null, arguments);
      }),
      bB = (b._emscripten_bind_btSoftBody_checkLink_2 = function () {
        return (bB = b._emscripten_bind_btSoftBody_checkLink_2 =
          b.asm.Iy).apply(null, arguments);
      }),
      cB = (b._emscripten_bind_btSoftBody_checkFace_3 = function () {
        return (cB = b._emscripten_bind_btSoftBody_checkFace_3 =
          b.asm.Jy).apply(null, arguments);
      }),
      dB = (b._emscripten_bind_btSoftBody_appendMaterial_0 = function () {
        return (dB = b._emscripten_bind_btSoftBody_appendMaterial_0 =
          b.asm.Ky).apply(null, arguments);
      }),
      eB = (b._emscripten_bind_btSoftBody_appendNode_2 = function () {
        return (eB = b._emscripten_bind_btSoftBody_appendNode_2 =
          b.asm.Ly).apply(null, arguments);
      }),
      fB = (b._emscripten_bind_btSoftBody_appendLink_4 = function () {
        return (fB = b._emscripten_bind_btSoftBody_appendLink_4 =
          b.asm.My).apply(null, arguments);
      }),
      gB = (b._emscripten_bind_btSoftBody_appendFace_4 = function () {
        return (gB = b._emscripten_bind_btSoftBody_appendFace_4 =
          b.asm.Ny).apply(null, arguments);
      }),
      hB = (b._emscripten_bind_btSoftBody_appendTetra_5 = function () {
        return (hB = b._emscripten_bind_btSoftBody_appendTetra_5 =
          b.asm.Oy).apply(null, arguments);
      }),
      iB = (b._emscripten_bind_btSoftBody_appendAnchor_4 = function () {
        return (iB = b._emscripten_bind_btSoftBody_appendAnchor_4 =
          b.asm.Py).apply(null, arguments);
      }),
      jB = (b._emscripten_bind_btSoftBody_addForce_1 = function () {
        return (jB = b._emscripten_bind_btSoftBody_addForce_1 = b.asm.Qy).apply(
          null,
          arguments
        );
      }),
      kB = (b._emscripten_bind_btSoftBody_addForce_2 = function () {
        return (kB = b._emscripten_bind_btSoftBody_addForce_2 = b.asm.Ry).apply(
          null,
          arguments
        );
      }),
      lB = (b._emscripten_bind_btSoftBody_addAeroForceToNode_2 = function () {
        return (lB = b._emscripten_bind_btSoftBody_addAeroForceToNode_2 =
          b.asm.Sy).apply(null, arguments);
      }),
      mB = (b._emscripten_bind_btSoftBody_getTotalMass_0 = function () {
        return (mB = b._emscripten_bind_btSoftBody_getTotalMass_0 =
          b.asm.Ty).apply(null, arguments);
      }),
      nB = (b._emscripten_bind_btSoftBody_setTotalMass_2 = function () {
        return (nB = b._emscripten_bind_btSoftBody_setTotalMass_2 =
          b.asm.Uy).apply(null, arguments);
      }),
      oB = (b._emscripten_bind_btSoftBody_setMass_2 = function () {
        return (oB = b._emscripten_bind_btSoftBody_setMass_2 = b.asm.Vy).apply(
          null,
          arguments
        );
      }),
      pB = (b._emscripten_bind_btSoftBody_transform_1 = function () {
        return (pB = b._emscripten_bind_btSoftBody_transform_1 =
          b.asm.Wy).apply(null, arguments);
      }),
      qB = (b._emscripten_bind_btSoftBody_translate_1 = function () {
        return (qB = b._emscripten_bind_btSoftBody_translate_1 =
          b.asm.Xy).apply(null, arguments);
      }),
      rB = (b._emscripten_bind_btSoftBody_rotate_1 = function () {
        return (rB = b._emscripten_bind_btSoftBody_rotate_1 = b.asm.Yy).apply(
          null,
          arguments
        );
      }),
      sB = (b._emscripten_bind_btSoftBody_scale_1 = function () {
        return (sB = b._emscripten_bind_btSoftBody_scale_1 = b.asm.Zy).apply(
          null,
          arguments
        );
      }),
      tB = (b._emscripten_bind_btSoftBody_generateClusters_1 = function () {
        return (tB = b._emscripten_bind_btSoftBody_generateClusters_1 =
          b.asm._y).apply(null, arguments);
      }),
      uB = (b._emscripten_bind_btSoftBody_generateClusters_2 = function () {
        return (uB = b._emscripten_bind_btSoftBody_generateClusters_2 =
          b.asm.$y).apply(null, arguments);
      }),
      vB = (b._emscripten_bind_btSoftBody_generateBendingConstraints_2 =
        function () {
          return (vB =
            b._emscripten_bind_btSoftBody_generateBendingConstraints_2 =
              b.asm.az).apply(null, arguments);
        }),
      wB = (b._emscripten_bind_btSoftBody_upcast_1 = function () {
        return (wB = b._emscripten_bind_btSoftBody_upcast_1 = b.asm.bz).apply(
          null,
          arguments
        );
      }),
      xB = (b._emscripten_bind_btSoftBody_getRestLengthScale_0 = function () {
        return (xB = b._emscripten_bind_btSoftBody_getRestLengthScale_0 =
          b.asm.cz).apply(null, arguments);
      }),
      yB = (b._emscripten_bind_btSoftBody_setRestLengthScale_1 = function () {
        return (yB = b._emscripten_bind_btSoftBody_setRestLengthScale_1 =
          b.asm.dz).apply(null, arguments);
      }),
      zB = (b._emscripten_bind_btSoftBody_setAnisotropicFriction_2 =
        function () {
          return (zB = b._emscripten_bind_btSoftBody_setAnisotropicFriction_2 =
            b.asm.ez).apply(null, arguments);
        }),
      AB = (b._emscripten_bind_btSoftBody_getCollisionShape_0 = function () {
        return (AB = b._emscripten_bind_btSoftBody_getCollisionShape_0 =
          b.asm.fz).apply(null, arguments);
      }),
      BB = (b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1 =
        function () {
          return (BB =
            b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1 =
              b.asm.gz).apply(null, arguments);
        }),
      CB = (b._emscripten_bind_btSoftBody_setActivationState_1 = function () {
        return (CB = b._emscripten_bind_btSoftBody_setActivationState_1 =
          b.asm.hz).apply(null, arguments);
      }),
      DB = (b._emscripten_bind_btSoftBody_forceActivationState_1 = function () {
        return (DB = b._emscripten_bind_btSoftBody_forceActivationState_1 =
          b.asm.iz).apply(null, arguments);
      }),
      EB = (b._emscripten_bind_btSoftBody_activate_0 = function () {
        return (EB = b._emscripten_bind_btSoftBody_activate_0 = b.asm.jz).apply(
          null,
          arguments
        );
      }),
      FB = (b._emscripten_bind_btSoftBody_activate_1 = function () {
        return (FB = b._emscripten_bind_btSoftBody_activate_1 = b.asm.kz).apply(
          null,
          arguments
        );
      }),
      GB = (b._emscripten_bind_btSoftBody_isActive_0 = function () {
        return (GB = b._emscripten_bind_btSoftBody_isActive_0 = b.asm.lz).apply(
          null,
          arguments
        );
      }),
      HB = (b._emscripten_bind_btSoftBody_isKinematicObject_0 = function () {
        return (HB = b._emscripten_bind_btSoftBody_isKinematicObject_0 =
          b.asm.mz).apply(null, arguments);
      }),
      IB = (b._emscripten_bind_btSoftBody_isStaticObject_0 = function () {
        return (IB = b._emscripten_bind_btSoftBody_isStaticObject_0 =
          b.asm.nz).apply(null, arguments);
      }),
      JB = (b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 =
        function () {
          return (JB =
            b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 =
              b.asm.oz).apply(null, arguments);
        }),
      KB = (b._emscripten_bind_btSoftBody_getRestitution_0 = function () {
        return (KB = b._emscripten_bind_btSoftBody_getRestitution_0 =
          b.asm.pz).apply(null, arguments);
      }),
      LB = (b._emscripten_bind_btSoftBody_getFriction_0 = function () {
        return (LB = b._emscripten_bind_btSoftBody_getFriction_0 =
          b.asm.qz).apply(null, arguments);
      }),
      MB = (b._emscripten_bind_btSoftBody_getRollingFriction_0 = function () {
        return (MB = b._emscripten_bind_btSoftBody_getRollingFriction_0 =
          b.asm.rz).apply(null, arguments);
      }),
      NB = (b._emscripten_bind_btSoftBody_setRestitution_1 = function () {
        return (NB = b._emscripten_bind_btSoftBody_setRestitution_1 =
          b.asm.sz).apply(null, arguments);
      }),
      OB = (b._emscripten_bind_btSoftBody_setFriction_1 = function () {
        return (OB = b._emscripten_bind_btSoftBody_setFriction_1 =
          b.asm.tz).apply(null, arguments);
      }),
      PB = (b._emscripten_bind_btSoftBody_setRollingFriction_1 = function () {
        return (PB = b._emscripten_bind_btSoftBody_setRollingFriction_1 =
          b.asm.uz).apply(null, arguments);
      }),
      QB = (b._emscripten_bind_btSoftBody_getWorldTransform_0 = function () {
        return (QB = b._emscripten_bind_btSoftBody_getWorldTransform_0 =
          b.asm.vz).apply(null, arguments);
      }),
      RB = (b._emscripten_bind_btSoftBody_getCollisionFlags_0 = function () {
        return (RB = b._emscripten_bind_btSoftBody_getCollisionFlags_0 =
          b.asm.wz).apply(null, arguments);
      }),
      SB = (b._emscripten_bind_btSoftBody_setCollisionFlags_1 = function () {
        return (SB = b._emscripten_bind_btSoftBody_setCollisionFlags_1 =
          b.asm.xz).apply(null, arguments);
      }),
      TB = (b._emscripten_bind_btSoftBody_setWorldTransform_1 = function () {
        return (TB = b._emscripten_bind_btSoftBody_setWorldTransform_1 =
          b.asm.yz).apply(null, arguments);
      }),
      UB = (b._emscripten_bind_btSoftBody_setCollisionShape_1 = function () {
        return (UB = b._emscripten_bind_btSoftBody_setCollisionShape_1 =
          b.asm.zz).apply(null, arguments);
      }),
      VB = (b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1 =
        function () {
          return (VB = b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1 =
            b.asm.Az).apply(null, arguments);
        }),
      WB = (b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 =
        function () {
          return (WB = b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 =
            b.asm.Bz).apply(null, arguments);
        }),
      XB = (b._emscripten_bind_btSoftBody_getUserIndex_0 = function () {
        return (XB = b._emscripten_bind_btSoftBody_getUserIndex_0 =
          b.asm.Cz).apply(null, arguments);
      }),
      YB = (b._emscripten_bind_btSoftBody_setUserIndex_1 = function () {
        return (YB = b._emscripten_bind_btSoftBody_setUserIndex_1 =
          b.asm.Dz).apply(null, arguments);
      }),
      ZB = (b._emscripten_bind_btSoftBody_getUserPointer_0 = function () {
        return (ZB = b._emscripten_bind_btSoftBody_getUserPointer_0 =
          b.asm.Ez).apply(null, arguments);
      }),
      $B = (b._emscripten_bind_btSoftBody_setUserPointer_1 = function () {
        return ($B = b._emscripten_bind_btSoftBody_setUserPointer_1 =
          b.asm.Fz).apply(null, arguments);
      }),
      aC = (b._emscripten_bind_btSoftBody_getBroadphaseHandle_0 = function () {
        return (aC = b._emscripten_bind_btSoftBody_getBroadphaseHandle_0 =
          b.asm.Gz).apply(null, arguments);
      }),
      bC = (b._emscripten_bind_btSoftBody_get_m_cfg_0 = function () {
        return (bC = b._emscripten_bind_btSoftBody_get_m_cfg_0 =
          b.asm.Hz).apply(null, arguments);
      }),
      cC = (b._emscripten_bind_btSoftBody_set_m_cfg_1 = function () {
        return (cC = b._emscripten_bind_btSoftBody_set_m_cfg_1 =
          b.asm.Iz).apply(null, arguments);
      }),
      dC = (b._emscripten_bind_btSoftBody_get_m_nodes_0 = function () {
        return (dC = b._emscripten_bind_btSoftBody_get_m_nodes_0 =
          b.asm.Jz).apply(null, arguments);
      }),
      eC = (b._emscripten_bind_btSoftBody_set_m_nodes_1 = function () {
        return (eC = b._emscripten_bind_btSoftBody_set_m_nodes_1 =
          b.asm.Kz).apply(null, arguments);
      }),
      fC = (b._emscripten_bind_btSoftBody_get_m_faces_0 = function () {
        return (fC = b._emscripten_bind_btSoftBody_get_m_faces_0 =
          b.asm.Lz).apply(null, arguments);
      }),
      gC = (b._emscripten_bind_btSoftBody_set_m_faces_1 = function () {
        return (gC = b._emscripten_bind_btSoftBody_set_m_faces_1 =
          b.asm.Mz).apply(null, arguments);
      }),
      hC = (b._emscripten_bind_btSoftBody_get_m_materials_0 = function () {
        return (hC = b._emscripten_bind_btSoftBody_get_m_materials_0 =
          b.asm.Nz).apply(null, arguments);
      }),
      iC = (b._emscripten_bind_btSoftBody_set_m_materials_1 = function () {
        return (iC = b._emscripten_bind_btSoftBody_set_m_materials_1 =
          b.asm.Oz).apply(null, arguments);
      }),
      jC = (b._emscripten_bind_btSoftBody_get_m_anchors_0 = function () {
        return (jC = b._emscripten_bind_btSoftBody_get_m_anchors_0 =
          b.asm.Pz).apply(null, arguments);
      }),
      kC = (b._emscripten_bind_btSoftBody_set_m_anchors_1 = function () {
        return (kC = b._emscripten_bind_btSoftBody_set_m_anchors_1 =
          b.asm.Qz).apply(null, arguments);
      }),
      lC = (b._emscripten_bind_btSoftBody___destroy___0 = function () {
        return (lC = b._emscripten_bind_btSoftBody___destroy___0 =
          b.asm.Rz).apply(null, arguments);
      }),
      mC =
        (b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 =
          function () {
            return (mC =
              b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 =
                b.asm.Sz).apply(null, arguments);
          }),
      nC =
        (b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 =
          function () {
            return (nC =
              b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 =
                b.asm.Tz).apply(null, arguments);
          }),
      oC =
        (b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 =
          function () {
            return (oC =
              b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 =
                b.asm.Uz).apply(null, arguments);
          }),
      pC =
        (b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 =
          function () {
            return (pC =
              b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 =
                b.asm.Vz).apply(null, arguments);
          }),
      qC = (b._emscripten_bind_btDefaultSoftBodySolver___destroy___0 =
        function () {
          return (qC =
            b._emscripten_bind_btDefaultSoftBodySolver___destroy___0 =
              b.asm.Wz).apply(null, arguments);
        }),
      rC = (b._emscripten_bind_btSoftBodyArray_size_0 = function () {
        return (rC = b._emscripten_bind_btSoftBodyArray_size_0 =
          b.asm.Xz).apply(null, arguments);
      }),
      sC = (b._emscripten_bind_btSoftBodyArray_at_1 = function () {
        return (sC = b._emscripten_bind_btSoftBodyArray_at_1 = b.asm.Yz).apply(
          null,
          arguments
        );
      }),
      tC = (b._emscripten_bind_btSoftBodyArray___destroy___0 = function () {
        return (tC = b._emscripten_bind_btSoftBodyArray___destroy___0 =
          b.asm.Zz).apply(null, arguments);
      }),
      uC =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 =
          function () {
            return (uC =
              b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 =
                b.asm._z).apply(null, arguments);
          }),
      vC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 =
        function () {
          return (vC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 =
              b.asm.$z).apply(null, arguments);
        }),
      wC = (b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 =
        function () {
          return (wC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 =
              b.asm.aA).apply(null, arguments);
        }),
      xC =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 =
          function () {
            return (xC =
              b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 =
                b.asm.bA).apply(null, arguments);
          }),
      yC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 =
        function () {
          return (yC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 =
              b.asm.cA).apply(null, arguments);
        }),
      zC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 =
        function () {
          return (zC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 =
              b.asm.dA).apply(null, arguments);
        }),
      AC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 =
        function () {
          return (AC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 =
              b.asm.eA).apply(null, arguments);
        }),
      BC = (b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 =
        function () {
          return (BC = b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 =
            b.asm.fA).apply(null, arguments);
        }),
      CC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 =
        function () {
          return (CC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 =
              b.asm.gA).apply(null, arguments);
        }),
      DC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 =
        function () {
          return (DC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 =
              b.asm.hA).apply(null, arguments);
        }),
      EC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 =
        function () {
          return (EC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 =
              b.asm.iA).apply(null, arguments);
        }),
      FC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 =
        function () {
          return (FC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 =
              b.asm.jA).apply(null, arguments);
        }),
      GC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 =
        function () {
          return (GC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 =
              b.asm.kA).apply(null, arguments);
        }),
      HC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 =
        function () {
          return (HC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 =
              b.asm.lA).apply(null, arguments);
        }),
      IC = (b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 =
        function () {
          return (IC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 =
              b.asm.mA).apply(null, arguments);
        }),
      JC = (b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 =
        function () {
          return (JC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 =
              b.asm.nA).apply(null, arguments);
        }),
      KC = (b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 =
        function () {
          return (KC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 =
              b.asm.oA).apply(null, arguments);
        }),
      LC = (b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 =
        function () {
          return (LC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 =
              b.asm.pA).apply(null, arguments);
        }),
      MC = (b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1 =
        function () {
          return (MC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1 =
              b.asm.qA).apply(null, arguments);
        }),
      NC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0 =
        function () {
          return (NC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0 =
              b.asm.rA).apply(null, arguments);
        }),
      OC = (b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0 =
        function () {
          return (OC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0 =
              b.asm.sA).apply(null, arguments);
        }),
      PC = (b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3 =
        function () {
          return (PC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3 =
              b.asm.tA).apply(null, arguments);
        }),
      QC = (b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 =
        function () {
          return (QC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 =
              b.asm.uA).apply(null, arguments);
        }),
      RC = (b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 =
        function () {
          return (RC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 =
              b.asm.vA).apply(null, arguments);
        }),
      SC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 =
        function () {
          return (SC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 =
              b.asm.wA).apply(null, arguments);
        }),
      TC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 =
        function () {
          return (TC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 =
              b.asm.xA).apply(null, arguments);
        }),
      UC = (b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 =
        function () {
          return (UC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 =
              b.asm.yA).apply(null, arguments);
        }),
      VC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 =
        function () {
          return (VC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 =
              b.asm.zA).apply(null, arguments);
        }),
      WC = (b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 =
        function () {
          return (WC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 =
              b.asm.AA).apply(null, arguments);
        }),
      XC = (b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 =
        function () {
          return (XC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 =
              b.asm.BA).apply(null, arguments);
        }),
      YC = (b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 =
        function () {
          return (YC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 =
              b.asm.CA).apply(null, arguments);
        }),
      ZC = (b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 =
        function () {
          return (ZC =
            b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 =
              b.asm.DA).apply(null, arguments);
        }),
      $C = (b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 =
        function () {
          return ($C =
            b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 =
              b.asm.EA).apply(null, arguments);
        }),
      aD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1 =
          function () {
            return (aD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1 =
                b.asm.FA).apply(null, arguments);
          }),
      bD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1 =
          function () {
            return (bD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1 =
                b.asm.GA).apply(null, arguments);
          }),
      cD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1 =
          function () {
            return (cD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1 =
                b.asm.HA).apply(null, arguments);
          }),
      dD = (b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 =
        function () {
          return (dD = b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 =
            b.asm.IA).apply(null, arguments);
        }),
      eD = (b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 =
        function () {
          return (eD =
            b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 =
              b.asm.JA).apply(null, arguments);
        }),
      fD = (b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 =
        function () {
          return (fD =
            b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 =
              b.asm.KA).apply(null, arguments);
        }),
      gD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1 =
          function () {
            return (gD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1 =
                b.asm.LA).apply(null, arguments);
          }),
      hD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2 =
          function () {
            return (hD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2 =
                b.asm.MA).apply(null, arguments);
          }),
      iD =
        (b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3 =
          function () {
            return (iD =
              b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3 =
                b.asm.NA).apply(null, arguments);
          }),
      jD = (b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 =
        function () {
          return (jD =
            b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 =
              b.asm.OA).apply(null, arguments);
        }),
      kD = (b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 =
        function () {
          return (kD =
            b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 =
              b.asm.PA).apply(null, arguments);
        }),
      lD = (b._emscripten_bind_btSoftBodyHelpers_CreateRope_5 = function () {
        return (lD = b._emscripten_bind_btSoftBodyHelpers_CreateRope_5 =
          b.asm.QA).apply(null, arguments);
      }),
      mD = (b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9 = function () {
        return (mD = b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9 =
          b.asm.RA).apply(null, arguments);
      }),
      nD = (b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 =
        function () {
          return (nD = b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 =
            b.asm.SA).apply(null, arguments);
        }),
      oD = (b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 =
        function () {
          return (oD = b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 =
            b.asm.TA).apply(null, arguments);
        }),
      pD = (b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 =
        function () {
          return (pD =
            b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 =
              b.asm.UA).apply(null, arguments);
        }),
      qD = (b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 =
        function () {
          return (qD =
            b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 =
              b.asm.VA).apply(null, arguments);
        }),
      rD = (b._emscripten_bind_btSoftBodyHelpers___destroy___0 = function () {
        return (rD = b._emscripten_bind_btSoftBodyHelpers___destroy___0 =
          b.asm.WA).apply(null, arguments);
      }),
      sD = (b._emscripten_enum_PHY_ScalarType_PHY_FLOAT = function () {
        return (sD = b._emscripten_enum_PHY_ScalarType_PHY_FLOAT =
          b.asm.XA).apply(null, arguments);
      }),
      tD = (b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE = function () {
        return (tD = b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE =
          b.asm.YA).apply(null, arguments);
      }),
      uD = (b._emscripten_enum_PHY_ScalarType_PHY_INTEGER = function () {
        return (uD = b._emscripten_enum_PHY_ScalarType_PHY_INTEGER =
          b.asm.ZA).apply(null, arguments);
      }),
      vD = (b._emscripten_enum_PHY_ScalarType_PHY_SHORT = function () {
        return (vD = b._emscripten_enum_PHY_ScalarType_PHY_SHORT =
          b.asm._A).apply(null, arguments);
      }),
      wD = (b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = function () {
        return (wD = b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 =
          b.asm.$A).apply(null, arguments);
      }),
      xD = (b._emscripten_enum_PHY_ScalarType_PHY_UCHAR = function () {
        return (xD = b._emscripten_enum_PHY_ScalarType_PHY_UCHAR =
          b.asm.aB).apply(null, arguments);
      }),
      yD =
        (b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE =
          function () {
            return (yD =
              b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE =
                b.asm.bB).apply(null, arguments);
          }),
      zD =
        (b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART =
          function () {
            return (zD =
              b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART =
                b.asm.cB).apply(null, arguments);
          }),
      AD = (b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE =
        function () {
          return (AD =
            b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE =
              b.asm.dB).apply(null, arguments);
        }),
      BD = (b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP =
        function () {
          return (BD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP =
            b.asm.eB).apply(null, arguments);
        }),
      CD = (b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP =
        function () {
          return (CD =
            b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP =
              b.asm.fB).apply(null, arguments);
        }),
      DD = (b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM =
        function () {
          return (DD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM =
            b.asm.gB).apply(null, arguments);
        }),
      ED = (b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM =
        function () {
          return (ED =
            b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM =
              b.asm.hB).apply(null, arguments);
        });
    b._malloc = function () {
      return (b._malloc = b.asm.jB).apply(null, arguments);
    };
    b.___start_em_js = 27240;
    b.___stop_em_js = 27338;
    b.UTF8ToString = sa;
    b.addFunction = function (a, c) {
      if (!Ua) {
        Ua = new WeakMap();
        var d = ya.length;
        if (Ua)
          for (var e = 0; e < 0 + d; e++) {
            var g = e;
            var n = Ta[g];
            n ||
              (g >= Ta.length && (Ta.length = g + 1), (Ta[g] = n = ya.get(g)));
            (g = n) && Ua.set(g, e);
          }
      }
      if ((d = Ua.get(a) || 0)) return d;
      if (Va.length) d = Va.pop();
      else {
        try {
          ya.grow(1);
        } catch (T) {
          if (!(T instanceof RangeError)) throw T;
          throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
        }
        d = ya.length - 1;
      }
      try {
        (e = d), ya.set(e, a), (Ta[e] = ya.get(e));
      } catch (T) {
        if (!(T instanceof TypeError)) throw T;
        if ("function" == typeof WebAssembly.Function) {
          e = WebAssembly.Function;
          g = { i: "i32", j: "i32", f: "f32", d: "f64", p: "i32" };
          n = { parameters: [], results: "v" == c[0] ? [] : [g[c[0]]] };
          for (var z = 1; z < c.length; ++z)
            n.parameters.push(g[c[z]]),
              "j" === c[z] && n.parameters.push("i32");
          c = new e(n, a);
        } else {
          e = [1];
          g = c.slice(0, 1);
          c = c.slice(1);
          n = { i: 127, p: 127, j: 126, f: 125, d: 124 };
          e.push(96);
          z = c.length;
          128 > z ? e.push(z) : e.push(z % 128 | 128, z >> 7);
          for (z = 0; z < c.length; ++z) e.push(n[c[z]]);
          "v" == g ? e.push(0) : e.push(1, n[g]);
          c = [0, 97, 115, 109, 1, 0, 0, 0, 1];
          g = e.length;
          128 > g ? c.push(g) : c.push(g % 128 | 128, g >> 7);
          c.push.apply(c, e);
          c.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          c = new WebAssembly.Module(new Uint8Array(c));
          c = new WebAssembly.Instance(c, { e: { f: a } }).exports.f;
        }
        e = d;
        ya.set(e, c);
        Ta[e] = ya.get(e);
      }
      Ua.set(a, d);
      return d;
    };
    var FD;
    Ha = function GD() {
      FD || HD();
      FD || (Ha = GD);
    };
    function HD() {
      function a() {
        if (!FD && ((FD = !0), (b.calledRun = !0), !qa)) {
          Ca = !0;
          Qa(Aa);
          aa(b);
          if (b.onRuntimeInitialized) b.onRuntimeInitialized();
          if (b.postRun)
            for (
              "function" == typeof b.postRun && (b.postRun = [b.postRun]);
              b.postRun.length;

            ) {
              var c = b.postRun.shift();
              Ba.unshift(c);
            }
          Qa(Ba);
        }
      }
      if (!(0 < Fa)) {
        if (b.preRun)
          for (
            "function" == typeof b.preRun && (b.preRun = [b.preRun]);
            b.preRun.length;

          )
            Ea();
        Qa(za);
        0 < Fa ||
          (b.setStatus
            ? (b.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  b.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (b.preInit)
      for (
        "function" == typeof b.preInit && (b.preInit = [b.preInit]);
        0 < b.preInit.length;

      )
        b.preInit.pop()();
    HD();
    function f() {}
    f.prototype = Object.create(f.prototype);
    f.prototype.constructor = f;
    f.prototype.lB = f;
    f.mB = {};
    b.WrapperObject = f;
    function h(a) {
      return (a || f).mB;
    }
    b.getCache = h;
    function k(a, c) {
      var d = h(c),
        e = d[a];
      if (e) return e;
      e = Object.create((c || f).prototype);
      e.kB = a;
      return (d[a] = e);
    }
    b.wrapPointer = k;
    b.castObject = function (a, c) {
      return k(a.kB, c);
    };
    b.NULL = k(0);
    b.destroy = function (a) {
      if (!a.__destroy__)
        throw "Error: Cannot destroy object. (Did you create it yourself?)";
      a.__destroy__();
      delete h(a.lB)[a.kB];
    };
    b.compare = function (a, c) {
      return a.kB === c.kB;
    };
    b.getPointer = function (a) {
      return a.kB;
    };
    b.getClass = function (a) {
      return a.lB;
    };
    var ID = 0,
      JD = 0,
      KD = 0,
      LD = [],
      MD = 0;
    function ND() {
      if (MD) {
        for (var a = 0; a < LD.length; a++) b._free(LD[a]);
        LD.length = 0;
        b._free(ID);
        ID = 0;
        JD += MD;
        MD = 0;
      }
      ID || ((JD += 128), (ID = b._malloc(JD)) || oa());
      KD = 0;
    }
    function OD(a, c) {
      ID || oa();
      a = a.length * c.BYTES_PER_ELEMENT;
      a = (a + 7) & -8;
      KD + a >= JD
        ? (0 < a || oa(), (MD += a), (c = b._malloc(a)), LD.push(c))
        : ((c = ID + KD), (KD += a));
      return c;
    }
    function PD(a, c, d) {
      d >>>= 0;
      switch (c.BYTES_PER_ELEMENT) {
        case 2:
          d >>>= 1;
          break;
        case 4:
          d >>>= 2;
          break;
        case 8:
          d >>>= 3;
      }
      for (var e = 0; e < a.length; e++) c[d + e] = a[e];
    }
    function QD(a) {
      if ("string" === typeof a) {
        for (var c = 0, d = 0; d < a.length; ++d) {
          var e = a.charCodeAt(d);
          127 >= e
            ? c++
            : 2047 >= e
            ? (c += 2)
            : 55296 <= e && 57343 >= e
            ? ((c += 4), ++d)
            : (c += 3);
        }
        c = Array(c + 1);
        e = c.length;
        d = 0;
        if (0 < e) {
          e = d + e - 1;
          for (var g = 0; g < a.length; ++g) {
            var n = a.charCodeAt(g);
            if (55296 <= n && 57343 >= n) {
              var z = a.charCodeAt(++g);
              n = (65536 + ((n & 1023) << 10)) | (z & 1023);
            }
            if (127 >= n) {
              if (d >= e) break;
              c[d++] = n;
            } else {
              if (2047 >= n) {
                if (d + 1 >= e) break;
                c[d++] = 192 | (n >> 6);
              } else {
                if (65535 >= n) {
                  if (d + 2 >= e) break;
                  c[d++] = 224 | (n >> 12);
                } else {
                  if (d + 3 >= e) break;
                  c[d++] = 240 | (n >> 18);
                  c[d++] = 128 | ((n >> 12) & 63);
                }
                c[d++] = 128 | ((n >> 6) & 63);
              }
              c[d++] = 128 | (n & 63);
            }
          }
          c[d] = 0;
        }
        a = OD(c, ua);
        PD(c, ua, a);
        return a;
      }
      return a;
    }
    function RD(a) {
      if ("object" === typeof a) {
        var c = OD(a, wa);
        PD(a, wa, c);
        return c;
      }
      return a;
    }
    function l() {
      throw "cannot construct a btCollisionShape, no constructor in IDL";
    }
    l.prototype = Object.create(f.prototype);
    l.prototype.constructor = l;
    l.prototype.lB = l;
    l.mB = {};
    b.btCollisionShape = l;
    l.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Xa(c, a);
    };
    l.prototype.getLocalScaling = function () {
      return k(Ya(this.kB), m);
    };
    l.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Za(d, a, c);
    };
    l.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $a(c, a);
    };
    l.prototype.getMargin = function () {
      return ab(this.kB);
    };
    l.prototype.__destroy__ = function () {
      bb(this.kB);
    };
    function SD() {
      throw "cannot construct a btCollisionWorld, no constructor in IDL";
    }
    SD.prototype = Object.create(f.prototype);
    SD.prototype.constructor = SD;
    SD.prototype.lB = SD;
    SD.mB = {};
    b.btCollisionWorld = SD;
    SD.prototype.getDispatcher = function () {
      return k(cb(this.kB), TD);
    };
    SD.prototype.rayTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      db(e, a, c, d);
    };
    SD.prototype.getPairCache = function () {
      return k(eb(this.kB), UD);
    };
    SD.prototype.getDispatchInfo = function () {
      return k(fb(this.kB), p);
    };
    SD.prototype.addCollisionObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? gb(e, a) : void 0 === d ? hb(e, a, c) : ib(e, a, c, d);
    };
    SD.prototype.removeCollisionObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jb(c, a);
    };
    SD.prototype.getBroadphase = function () {
      return k(kb(this.kB), VD);
    };
    SD.prototype.convexSweepTest = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      lb(n, a, c, d, e, g);
    };
    SD.prototype.contactPairTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      mb(e, a, c, d);
    };
    SD.prototype.contactTest = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      nb(d, a, c);
    };
    SD.prototype.updateSingleAabb = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ob(c, a);
    };
    SD.prototype.setDebugDrawer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pb(c, a);
    };
    SD.prototype.getDebugDrawer = function () {
      return k(qb(this.kB), WD);
    };
    SD.prototype.debugDrawWorld = function () {
      rb(this.kB);
    };
    SD.prototype.debugDrawObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      sb(e, a, c, d);
    };
    SD.prototype.__destroy__ = function () {
      tb(this.kB);
    };
    function q() {
      throw "cannot construct a btCollisionObject, no constructor in IDL";
    }
    q.prototype = Object.create(f.prototype);
    q.prototype.constructor = q;
    q.prototype.lB = q;
    q.mB = {};
    b.btCollisionObject = q;
    q.prototype.setAnisotropicFriction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      ub(d, a, c);
    };
    q.prototype.getCollisionShape = function () {
      return k(vb(this.kB), l);
    };
    q.prototype.setContactProcessingThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wb(c, a);
    };
    q.prototype.setActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xb(c, a);
    };
    q.prototype.forceActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yb(c, a);
    };
    q.prototype.activate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      void 0 === a ? zb(c) : Ab(c, a);
    };
    q.prototype.isActive = function () {
      return !!Bb(this.kB);
    };
    q.prototype.isKinematicObject = function () {
      return !!Cb(this.kB);
    };
    q.prototype.isStaticObject = function () {
      return !!Db(this.kB);
    };
    q.prototype.isStaticOrKinematicObject = function () {
      return !!Eb(this.kB);
    };
    q.prototype.getRestitution = function () {
      return Fb(this.kB);
    };
    q.prototype.getFriction = function () {
      return Gb(this.kB);
    };
    q.prototype.getRollingFriction = function () {
      return Hb(this.kB);
    };
    q.prototype.setRestitution = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ib(c, a);
    };
    q.prototype.setFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jb(c, a);
    };
    q.prototype.setRollingFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kb(c, a);
    };
    q.prototype.getWorldTransform = function () {
      return k(Lb(this.kB), r);
    };
    q.prototype.getCollisionFlags = function () {
      return Mb(this.kB);
    };
    q.prototype.setCollisionFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nb(c, a);
    };
    q.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ob(c, a);
    };
    q.prototype.setCollisionShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pb(c, a);
    };
    q.prototype.setCcdMotionThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qb(c, a);
    };
    q.prototype.setCcdSweptSphereRadius = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rb(c, a);
    };
    q.prototype.getUserIndex = function () {
      return Sb(this.kB);
    };
    q.prototype.setUserIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tb(c, a);
    };
    q.prototype.getUserPointer = function () {
      return k(Ub(this.kB), XD);
    };
    q.prototype.setUserPointer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vb(c, a);
    };
    q.prototype.getBroadphaseHandle = function () {
      return k(Wb(this.kB), YD);
    };
    q.prototype.__destroy__ = function () {
      Xb(this.kB);
    };
    function ZD() {
      throw "cannot construct a btConcaveShape, no constructor in IDL";
    }
    ZD.prototype = Object.create(l.prototype);
    ZD.prototype.constructor = ZD;
    ZD.prototype.lB = ZD;
    ZD.mB = {};
    b.btConcaveShape = ZD;
    ZD.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yb(c, a);
    };
    ZD.prototype.getLocalScaling = function () {
      return k(Zb(this.kB), m);
    };
    ZD.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      $b(d, a, c);
    };
    ZD.prototype.__destroy__ = function () {
      ac(this.kB);
    };
    function $D() {
      throw "cannot construct a btCollisionAlgorithm, no constructor in IDL";
    }
    $D.prototype = Object.create(f.prototype);
    $D.prototype.constructor = $D;
    $D.prototype.lB = $D;
    $D.mB = {};
    b.btCollisionAlgorithm = $D;
    $D.prototype.__destroy__ = function () {
      bc(this.kB);
    };
    function aE() {
      throw "cannot construct a btTypedConstraint, no constructor in IDL";
    }
    aE.prototype = Object.create(f.prototype);
    aE.prototype.constructor = aE;
    aE.prototype.lB = aE;
    aE.mB = {};
    b.btTypedConstraint = aE;
    aE.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cc(c, a);
    };
    aE.prototype.getBreakingImpulseThreshold = function () {
      return ec(this.kB);
    };
    aE.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fc(c, a);
    };
    aE.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return gc(d, a, c);
    };
    aE.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      hc(e, a, c, d);
    };
    aE.prototype.__destroy__ = function () {
      ic(this.kB);
    };
    function bE() {
      throw "cannot construct a btDynamicsWorld, no constructor in IDL";
    }
    bE.prototype = Object.create(SD.prototype);
    bE.prototype.constructor = bE;
    bE.prototype.lB = bE;
    bE.mB = {};
    b.btDynamicsWorld = bE;
    bE.prototype.addAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jc(c, a);
    };
    bE.prototype.removeAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kc(c, a);
    };
    bE.prototype.getSolverInfo = function () {
      return k(lc(this.kB), t);
    };
    bE.prototype.setInternalTickCallback = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? mc(e, a) : void 0 === d ? nc(e, a, c) : oc(e, a, c, d);
    };
    bE.prototype.getDispatcher = function () {
      return k(pc(this.kB), TD);
    };
    bE.prototype.rayTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      qc(e, a, c, d);
    };
    bE.prototype.getPairCache = function () {
      return k(rc(this.kB), UD);
    };
    bE.prototype.getDispatchInfo = function () {
      return k(sc(this.kB), p);
    };
    bE.prototype.addCollisionObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? tc(e, a) : void 0 === d ? uc(e, a, c) : vc(e, a, c, d);
    };
    bE.prototype.removeCollisionObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wc(c, a);
    };
    bE.prototype.getBroadphase = function () {
      return k(xc(this.kB), VD);
    };
    bE.prototype.convexSweepTest = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      yc(n, a, c, d, e, g);
    };
    bE.prototype.contactPairTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      zc(e, a, c, d);
    };
    bE.prototype.contactTest = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Ac(d, a, c);
    };
    bE.prototype.updateSingleAabb = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bc(c, a);
    };
    bE.prototype.setDebugDrawer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cc(c, a);
    };
    bE.prototype.getDebugDrawer = function () {
      return k(Dc(this.kB), WD);
    };
    bE.prototype.debugDrawWorld = function () {
      Ec(this.kB);
    };
    bE.prototype.debugDrawObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Fc(e, a, c, d);
    };
    bE.prototype.__destroy__ = function () {
      Gc(this.kB);
    };
    function WD() {
      throw "cannot construct a btIDebugDraw, no constructor in IDL";
    }
    WD.prototype = Object.create(f.prototype);
    WD.prototype.constructor = WD;
    WD.prototype.lB = WD;
    WD.mB = {};
    b.btIDebugDraw = WD;
    WD.prototype.drawLine = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Hc(e, a, c, d);
    };
    WD.prototype.drawContactPoint = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      Ic(n, a, c, d, e, g);
    };
    WD.prototype.reportErrorWarning = function (a) {
      var c = this.kB;
      ND();
      a = a && "object" === typeof a ? a.kB : QD(a);
      Jc(c, a);
    };
    WD.prototype.draw3dText = function (a, c) {
      var d = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      c = c && "object" === typeof c ? c.kB : QD(c);
      Kc(d, a, c);
    };
    WD.prototype.setDebugMode = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lc(c, a);
    };
    WD.prototype.getDebugMode = function () {
      return Mc(this.kB);
    };
    WD.prototype.__destroy__ = function () {
      Nc(this.kB);
    };
    function m(a, c, d) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      this.kB =
        void 0 === a
          ? Oc()
          : void 0 === c
          ? _emscripten_bind_btVector3_btVector3_1(a)
          : void 0 === d
          ? _emscripten_bind_btVector3_btVector3_2(a, c)
          : Pc(a, c, d);
      h(m)[this.kB] = this;
    }
    m.prototype = Object.create(f.prototype);
    m.prototype.constructor = m;
    m.prototype.lB = m;
    m.mB = {};
    b.btVector3 = m;
    m.prototype.length = m.prototype.length = function () {
      return Qc(this.kB);
    };
    m.prototype.x = m.prototype.x = function () {
      return Rc(this.kB);
    };
    m.prototype.y = m.prototype.y = function () {
      return Sc(this.kB);
    };
    m.prototype.z = m.prototype.z = function () {
      return Tc(this.kB);
    };
    m.prototype.setX = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Uc(c, a);
    };
    m.prototype.setY = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vc(c, a);
    };
    m.prototype.setZ = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Wc(c, a);
    };
    m.prototype.setValue = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Xc(e, a, c, d);
    };
    m.prototype.normalize = m.prototype.normalize = function () {
      Yc(this.kB);
    };
    m.prototype.rotate = m.prototype.rotate = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return k(Zc(d, a, c), m);
    };
    m.prototype.dot = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return $c(c, a);
    };
    m.prototype.op_mul = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(ad(c, a), m);
    };
    m.prototype.op_add = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(bd(c, a), m);
    };
    m.prototype.op_sub = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(cd(c, a), m);
    };
    m.prototype.__destroy__ = function () {
      dd(this.kB);
    };
    function cE() {
      throw "cannot construct a btQuadWord, no constructor in IDL";
    }
    cE.prototype = Object.create(f.prototype);
    cE.prototype.constructor = cE;
    cE.prototype.lB = cE;
    cE.mB = {};
    b.btQuadWord = cE;
    cE.prototype.x = cE.prototype.x = function () {
      return ed(this.kB);
    };
    cE.prototype.y = cE.prototype.y = function () {
      return fd(this.kB);
    };
    cE.prototype.z = cE.prototype.z = function () {
      return gd(this.kB);
    };
    cE.prototype.w = cE.prototype.w = function () {
      return hd(this.kB);
    };
    cE.prototype.setX = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jd(c, a);
    };
    cE.prototype.setY = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kd(c, a);
    };
    cE.prototype.setZ = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ld(c, a);
    };
    cE.prototype.setW = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      md(c, a);
    };
    cE.prototype.__destroy__ = function () {
      nd(this.kB);
    };
    function dE() {
      throw "cannot construct a btMotionState, no constructor in IDL";
    }
    dE.prototype = Object.create(f.prototype);
    dE.prototype.constructor = dE;
    dE.prototype.lB = dE;
    dE.mB = {};
    b.btMotionState = dE;
    dE.prototype.getWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      od(c, a);
    };
    dE.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pd(c, a);
    };
    dE.prototype.__destroy__ = function () {
      qd(this.kB);
    };
    function u() {
      throw "cannot construct a RayResultCallback, no constructor in IDL";
    }
    u.prototype = Object.create(f.prototype);
    u.prototype.constructor = u;
    u.prototype.lB = u;
    u.mB = {};
    b.RayResultCallback = u;
    u.prototype.hasHit = function () {
      return !!rd(this.kB);
    };
    u.prototype.get_m_collisionFilterGroup = u.prototype.nB = function () {
      return sd(this.kB);
    };
    u.prototype.set_m_collisionFilterGroup = u.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      td(c, a);
    };
    Object.defineProperty(u.prototype, "m_collisionFilterGroup", {
      get: u.prototype.nB,
      set: u.prototype.pB,
    });
    u.prototype.get_m_collisionFilterMask = u.prototype.oB = function () {
      return ud(this.kB);
    };
    u.prototype.set_m_collisionFilterMask = u.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vd(c, a);
    };
    Object.defineProperty(u.prototype, "m_collisionFilterMask", {
      get: u.prototype.oB,
      set: u.prototype.qB,
    });
    u.prototype.get_m_closestHitFraction = u.prototype.rB = function () {
      return wd(this.kB);
    };
    u.prototype.set_m_closestHitFraction = u.prototype.sB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xd(c, a);
    };
    Object.defineProperty(u.prototype, "m_closestHitFraction", {
      get: u.prototype.rB,
      set: u.prototype.sB,
    });
    u.prototype.get_m_collisionObject = u.prototype.vB = function () {
      return k(yd(this.kB), q);
    };
    u.prototype.set_m_collisionObject = u.prototype.CB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zd(c, a);
    };
    Object.defineProperty(u.prototype, "m_collisionObject", {
      get: u.prototype.vB,
      set: u.prototype.CB,
    });
    u.prototype.get_m_flags = u.prototype.tB = function () {
      return Ad(this.kB);
    };
    u.prototype.set_m_flags = u.prototype.uB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bd(c, a);
    };
    Object.defineProperty(u.prototype, "m_flags", {
      get: u.prototype.tB,
      set: u.prototype.uB,
    });
    u.prototype.__destroy__ = function () {
      Cd(this.kB);
    };
    function eE() {
      throw "cannot construct a ContactResultCallback, no constructor in IDL";
    }
    eE.prototype = Object.create(f.prototype);
    eE.prototype.constructor = eE;
    eE.prototype.lB = eE;
    eE.mB = {};
    b.ContactResultCallback = eE;
    eE.prototype.addSingleResult = function (a, c, d, e, g, n, z) {
      var T = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      return Dd(T, a, c, d, e, g, n, z);
    };
    eE.prototype.__destroy__ = function () {
      Ed(this.kB);
    };
    function v() {
      throw "cannot construct a ConvexResultCallback, no constructor in IDL";
    }
    v.prototype = Object.create(f.prototype);
    v.prototype.constructor = v;
    v.prototype.lB = v;
    v.mB = {};
    b.ConvexResultCallback = v;
    v.prototype.hasHit = function () {
      return !!Fd(this.kB);
    };
    v.prototype.get_m_collisionFilterGroup = v.prototype.nB = function () {
      return Gd(this.kB);
    };
    v.prototype.set_m_collisionFilterGroup = v.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Hd(c, a);
    };
    Object.defineProperty(v.prototype, "m_collisionFilterGroup", {
      get: v.prototype.nB,
      set: v.prototype.pB,
    });
    v.prototype.get_m_collisionFilterMask = v.prototype.oB = function () {
      return Id(this.kB);
    };
    v.prototype.set_m_collisionFilterMask = v.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jd(c, a);
    };
    Object.defineProperty(v.prototype, "m_collisionFilterMask", {
      get: v.prototype.oB,
      set: v.prototype.qB,
    });
    v.prototype.get_m_closestHitFraction = v.prototype.rB = function () {
      return Kd(this.kB);
    };
    v.prototype.set_m_closestHitFraction = v.prototype.sB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ld(c, a);
    };
    Object.defineProperty(v.prototype, "m_closestHitFraction", {
      get: v.prototype.rB,
      set: v.prototype.sB,
    });
    v.prototype.__destroy__ = function () {
      Md(this.kB);
    };
    function fE() {
      throw "cannot construct a btConvexShape, no constructor in IDL";
    }
    fE.prototype = Object.create(l.prototype);
    fE.prototype.constructor = fE;
    fE.prototype.lB = fE;
    fE.mB = {};
    b.btConvexShape = fE;
    fE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nd(c, a);
    };
    fE.prototype.getLocalScaling = function () {
      return k(Od(this.kB), m);
    };
    fE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Pd(d, a, c);
    };
    fE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qd(c, a);
    };
    fE.prototype.getMargin = function () {
      return Rd(this.kB);
    };
    fE.prototype.__destroy__ = function () {
      Sd(this.kB);
    };
    function gE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Td(a, c);
      h(gE)[this.kB] = this;
    }
    gE.prototype = Object.create(l.prototype);
    gE.prototype.constructor = gE;
    gE.prototype.lB = gE;
    gE.mB = {};
    b.btCapsuleShape = gE;
    gE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ud(c, a);
    };
    gE.prototype.getMargin = function () {
      return Vd(this.kB);
    };
    gE.prototype.getUpAxis = function () {
      return Wd(this.kB);
    };
    gE.prototype.getRadius = function () {
      return Xd(this.kB);
    };
    gE.prototype.getHalfHeight = function () {
      return Yd(this.kB);
    };
    gE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zd(c, a);
    };
    gE.prototype.getLocalScaling = function () {
      return k($d(this.kB), m);
    };
    gE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      ae(d, a, c);
    };
    gE.prototype.__destroy__ = function () {
      be(this.kB);
    };
    function hE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = ce(a);
      h(hE)[this.kB] = this;
    }
    hE.prototype = Object.create(l.prototype);
    hE.prototype.constructor = hE;
    hE.prototype.lB = hE;
    hE.mB = {};
    b.btCylinderShape = hE;
    hE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      de(c, a);
    };
    hE.prototype.getMargin = function () {
      return ee(this.kB);
    };
    hE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fe(c, a);
    };
    hE.prototype.getLocalScaling = function () {
      return k(ge(this.kB), m);
    };
    hE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      he(d, a, c);
    };
    hE.prototype.__destroy__ = function () {
      ie(this.kB);
    };
    function iE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = je(a, c);
      h(iE)[this.kB] = this;
    }
    iE.prototype = Object.create(l.prototype);
    iE.prototype.constructor = iE;
    iE.prototype.lB = iE;
    iE.mB = {};
    b.btConeShape = iE;
    iE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ke(c, a);
    };
    iE.prototype.getLocalScaling = function () {
      return k(le(this.kB), m);
    };
    iE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      me(d, a, c);
    };
    iE.prototype.__destroy__ = function () {
      ne(this.kB);
    };
    function jE() {
      throw "cannot construct a btStridingMeshInterface, no constructor in IDL";
    }
    jE.prototype = Object.create(f.prototype);
    jE.prototype.constructor = jE;
    jE.prototype.lB = jE;
    jE.mB = {};
    b.btStridingMeshInterface = jE;
    jE.prototype.setScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      oe(c, a);
    };
    jE.prototype.__destroy__ = function () {
      pe(this.kB);
    };
    function kE() {
      throw "cannot construct a btTriangleMeshShape, no constructor in IDL";
    }
    kE.prototype = Object.create(ZD.prototype);
    kE.prototype.constructor = kE;
    kE.prototype.lB = kE;
    kE.mB = {};
    b.btTriangleMeshShape = kE;
    kE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qe(c, a);
    };
    kE.prototype.getLocalScaling = function () {
      return k(re(this.kB), m);
    };
    kE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      se(d, a, c);
    };
    kE.prototype.__destroy__ = function () {
      te(this.kB);
    };
    function lE() {
      throw "cannot construct a btPrimitiveManagerBase, no constructor in IDL";
    }
    lE.prototype = Object.create(f.prototype);
    lE.prototype.constructor = lE;
    lE.prototype.lB = lE;
    lE.mB = {};
    b.btPrimitiveManagerBase = lE;
    lE.prototype.is_trimesh = function () {
      return !!ue(this.kB);
    };
    lE.prototype.get_primitive_count = function () {
      return ve(this.kB);
    };
    lE.prototype.get_primitive_box = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      we(d, a, c);
    };
    lE.prototype.get_primitive_triangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      xe(d, a, c);
    };
    lE.prototype.__destroy__ = function () {
      ye(this.kB);
    };
    function w() {
      throw "cannot construct a btGImpactShapeInterface, no constructor in IDL";
    }
    w.prototype = Object.create(ZD.prototype);
    w.prototype.constructor = w;
    w.prototype.lB = w;
    w.mB = {};
    b.btGImpactShapeInterface = w;
    w.prototype.updateBound = function () {
      ze(this.kB);
    };
    w.prototype.postUpdate = function () {
      Ae(this.kB);
    };
    w.prototype.getShapeType = function () {
      return Be(this.kB);
    };
    w.prototype.getName = function () {
      return sa(Ce(this.kB));
    };
    w.prototype.getGImpactShapeType = function () {
      return De(this.kB);
    };
    w.prototype.getPrimitiveManager = function () {
      return k(Ee(this.kB), lE);
    };
    w.prototype.getNumChildShapes = function () {
      return Fe(this.kB);
    };
    w.prototype.childrenHasTransform = function () {
      return !!Ge(this.kB);
    };
    w.prototype.needsRetrieveTriangles = function () {
      return !!He(this.kB);
    };
    w.prototype.needsRetrieveTetrahedrons = function () {
      return !!Ie(this.kB);
    };
    w.prototype.getBulletTriangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Je(d, a, c);
    };
    w.prototype.getBulletTetrahedron = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Ke(d, a, c);
    };
    w.prototype.getChildShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Le(c, a), l);
    };
    w.prototype.getChildTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Me(c, a), r);
    };
    w.prototype.setChildTransform = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Ne(d, a, c);
    };
    w.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Oe(c, a);
    };
    w.prototype.getLocalScaling = function () {
      return k(Pe(this.kB), m);
    };
    w.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Qe(d, a, c);
    };
    w.prototype.__destroy__ = function () {
      Re(this.kB);
    };
    function mE() {
      throw "cannot construct a btActivatingCollisionAlgorithm, no constructor in IDL";
    }
    mE.prototype = Object.create($D.prototype);
    mE.prototype.constructor = mE;
    mE.prototype.lB = mE;
    mE.mB = {};
    b.btActivatingCollisionAlgorithm = mE;
    mE.prototype.__destroy__ = function () {
      Se(this.kB);
    };
    function nE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = void 0 === a ? Te() : Ue(a);
      h(nE)[this.kB] = this;
    }
    nE.prototype = Object.create(f.prototype);
    nE.prototype.constructor = nE;
    nE.prototype.lB = nE;
    nE.mB = {};
    b.btDefaultCollisionConfiguration = nE;
    nE.prototype.__destroy__ = function () {
      Ve(this.kB);
    };
    function TD() {
      throw "cannot construct a btDispatcher, no constructor in IDL";
    }
    TD.prototype = Object.create(f.prototype);
    TD.prototype.constructor = TD;
    TD.prototype.lB = TD;
    TD.mB = {};
    b.btDispatcher = TD;
    TD.prototype.getNumManifolds = function () {
      return We(this.kB);
    };
    TD.prototype.getManifoldByIndexInternal = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Xe(c, a), oE);
    };
    TD.prototype.__destroy__ = function () {
      Ye(this.kB);
    };
    function pE(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB =
        void 0 === e
          ? Ze(a, c, d)
          : void 0 === g
          ? _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(
              a,
              c,
              d,
              e
            )
          : $e(a, c, d, e, g);
      h(pE)[this.kB] = this;
    }
    pE.prototype = Object.create(aE.prototype);
    pE.prototype.constructor = pE;
    pE.prototype.lB = pE;
    pE.mB = {};
    b.btGeneric6DofConstraint = pE;
    pE.prototype.setLinearLowerLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      af(c, a);
    };
    pE.prototype.setLinearUpperLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bf(c, a);
    };
    pE.prototype.setAngularLowerLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cf(c, a);
    };
    pE.prototype.setAngularUpperLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      df(c, a);
    };
    pE.prototype.getFrameOffsetA = function () {
      return k(ef(this.kB), r);
    };
    pE.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ff(c, a);
    };
    pE.prototype.getBreakingImpulseThreshold = function () {
      return gf(this.kB);
    };
    pE.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hf(c, a);
    };
    pE.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return jf(d, a, c);
    };
    pE.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      kf(e, a, c, d);
    };
    pE.prototype.__destroy__ = function () {
      lf(this.kB);
    };
    function x(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = mf(a, c, d, e);
      h(x)[this.kB] = this;
    }
    x.prototype = Object.create(bE.prototype);
    x.prototype.constructor = x;
    x.prototype.lB = x;
    x.mB = {};
    b.btDiscreteDynamicsWorld = x;
    x.prototype.setGravity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nf(c, a);
    };
    x.prototype.getGravity = function () {
      return k(of(this.kB), m);
    };
    x.prototype.addRigidBody = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c
        ? pf(e, a)
        : void 0 === d
        ? _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(e, a, c)
        : qf(e, a, c, d);
    };
    x.prototype.removeRigidBody = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rf(c, a);
    };
    x.prototype.addConstraint = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === c ? sf(d, a) : tf(d, a, c);
    };
    x.prototype.removeConstraint = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      uf(c, a);
    };
    x.prototype.stepSimulation = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      return void 0 === c
        ? vf(e, a)
        : void 0 === d
        ? wf(e, a, c)
        : xf(e, a, c, d);
    };
    x.prototype.setContactAddedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yf(c, a);
    };
    x.prototype.setContactProcessedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zf(c, a);
    };
    x.prototype.setContactDestroyedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Af(c, a);
    };
    x.prototype.getDispatcher = function () {
      return k(Bf(this.kB), TD);
    };
    x.prototype.rayTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Cf(e, a, c, d);
    };
    x.prototype.getPairCache = function () {
      return k(Df(this.kB), UD);
    };
    x.prototype.getDispatchInfo = function () {
      return k(Ef(this.kB), p);
    };
    x.prototype.addCollisionObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? Ff(e, a) : void 0 === d ? Gf(e, a, c) : Hf(e, a, c, d);
    };
    x.prototype.removeCollisionObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      If(c, a);
    };
    x.prototype.getBroadphase = function () {
      return k(Jf(this.kB), VD);
    };
    x.prototype.convexSweepTest = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      Kf(n, a, c, d, e, g);
    };
    x.prototype.contactPairTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Lf(e, a, c, d);
    };
    x.prototype.contactTest = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Mf(d, a, c);
    };
    x.prototype.updateSingleAabb = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nf(c, a);
    };
    x.prototype.setDebugDrawer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Of(c, a);
    };
    x.prototype.getDebugDrawer = function () {
      return k(Pf(this.kB), WD);
    };
    x.prototype.debugDrawWorld = function () {
      Qf(this.kB);
    };
    x.prototype.debugDrawObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Rf(e, a, c, d);
    };
    x.prototype.addAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Sf(c, a);
    };
    x.prototype.removeAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tf(c, a);
    };
    x.prototype.getSolverInfo = function () {
      return k(Uf(this.kB), t);
    };
    x.prototype.setInternalTickCallback = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? Vf(e, a) : void 0 === d ? Wf(e, a, c) : Xf(e, a, c, d);
    };
    x.prototype.__destroy__ = function () {
      Yf(this.kB);
    };
    function qE() {
      throw "cannot construct a btVehicleRaycaster, no constructor in IDL";
    }
    qE.prototype = Object.create(f.prototype);
    qE.prototype.constructor = qE;
    qE.prototype.lB = qE;
    qE.mB = {};
    b.btVehicleRaycaster = qE;
    qE.prototype.castRay = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Zf(e, a, c, d);
    };
    qE.prototype.__destroy__ = function () {
      $f(this.kB);
    };
    function rE() {
      throw "cannot construct a btActionInterface, no constructor in IDL";
    }
    rE.prototype = Object.create(f.prototype);
    rE.prototype.constructor = rE;
    rE.prototype.lB = rE;
    rE.mB = {};
    b.btActionInterface = rE;
    rE.prototype.updateAction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      ag(d, a, c);
    };
    rE.prototype.__destroy__ = function () {
      bg(this.kB);
    };
    function y() {
      this.kB = cg();
      h(y)[this.kB] = this;
    }
    y.prototype = Object.create(q.prototype);
    y.prototype.constructor = y;
    y.prototype.lB = y;
    y.mB = {};
    b.btGhostObject = y;
    y.prototype.getNumOverlappingObjects = function () {
      return dg(this.kB);
    };
    y.prototype.getOverlappingObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(eg(c, a), q);
    };
    y.prototype.setAnisotropicFriction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      fg(d, a, c);
    };
    y.prototype.getCollisionShape = function () {
      return k(gg(this.kB), l);
    };
    y.prototype.setContactProcessingThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hg(c, a);
    };
    y.prototype.setActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ig(c, a);
    };
    y.prototype.forceActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jg(c, a);
    };
    y.prototype.activate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      void 0 === a ? kg(c) : lg(c, a);
    };
    y.prototype.isActive = function () {
      return !!mg(this.kB);
    };
    y.prototype.isKinematicObject = function () {
      return !!ng(this.kB);
    };
    y.prototype.isStaticObject = function () {
      return !!og(this.kB);
    };
    y.prototype.isStaticOrKinematicObject = function () {
      return !!pg(this.kB);
    };
    y.prototype.getRestitution = function () {
      return qg(this.kB);
    };
    y.prototype.getFriction = function () {
      return rg(this.kB);
    };
    y.prototype.getRollingFriction = function () {
      return sg(this.kB);
    };
    y.prototype.setRestitution = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tg(c, a);
    };
    y.prototype.setFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ug(c, a);
    };
    y.prototype.setRollingFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vg(c, a);
    };
    y.prototype.getWorldTransform = function () {
      return k(wg(this.kB), r);
    };
    y.prototype.getCollisionFlags = function () {
      return xg(this.kB);
    };
    y.prototype.setCollisionFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yg(c, a);
    };
    y.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zg(c, a);
    };
    y.prototype.setCollisionShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ag(c, a);
    };
    y.prototype.setCcdMotionThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bg(c, a);
    };
    y.prototype.setCcdSweptSphereRadius = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cg(c, a);
    };
    y.prototype.getUserIndex = function () {
      return Dg(this.kB);
    };
    y.prototype.setUserIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Eg(c, a);
    };
    y.prototype.getUserPointer = function () {
      return k(Fg(this.kB), XD);
    };
    y.prototype.setUserPointer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Gg(c, a);
    };
    y.prototype.getBroadphaseHandle = function () {
      return k(Hg(this.kB), YD);
    };
    y.prototype.__destroy__ = function () {
      Ig(this.kB);
    };
    function sE() {
      throw "cannot construct a btSoftBodySolver, no constructor in IDL";
    }
    sE.prototype = Object.create(f.prototype);
    sE.prototype.constructor = sE;
    sE.prototype.lB = sE;
    sE.mB = {};
    b.btSoftBodySolver = sE;
    sE.prototype.__destroy__ = function () {
      Jg(this.kB);
    };
    function XD() {
      throw "cannot construct a VoidPtr, no constructor in IDL";
    }
    XD.prototype = Object.create(f.prototype);
    XD.prototype.constructor = XD;
    XD.prototype.lB = XD;
    XD.mB = {};
    b.VoidPtr = XD;
    XD.prototype.__destroy__ = function () {
      Kg(this.kB);
    };
    function tE() {
      this.kB = Lg();
      h(tE)[this.kB] = this;
    }
    tE.prototype = Object.create(WD.prototype);
    tE.prototype.constructor = tE;
    tE.prototype.lB = tE;
    tE.mB = {};
    b.DebugDrawer = tE;
    tE.prototype.drawLine = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Mg(e, a, c, d);
    };
    tE.prototype.drawContactPoint = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      Ng(n, a, c, d, e, g);
    };
    tE.prototype.reportErrorWarning = function (a) {
      var c = this.kB;
      ND();
      a = a && "object" === typeof a ? a.kB : QD(a);
      Og(c, a);
    };
    tE.prototype.draw3dText = function (a, c) {
      var d = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      c = c && "object" === typeof c ? c.kB : QD(c);
      Pg(d, a, c);
    };
    tE.prototype.setDebugMode = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qg(c, a);
    };
    tE.prototype.getDebugMode = function () {
      return Rg(this.kB);
    };
    tE.prototype.__destroy__ = function () {
      Sg(this.kB);
    };
    function A(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB =
        void 0 === a
          ? Tg()
          : void 0 === c
          ? _emscripten_bind_btVector4_btVector4_1(a)
          : void 0 === d
          ? _emscripten_bind_btVector4_btVector4_2(a, c)
          : void 0 === e
          ? _emscripten_bind_btVector4_btVector4_3(a, c, d)
          : Ug(a, c, d, e);
      h(A)[this.kB] = this;
    }
    A.prototype = Object.create(m.prototype);
    A.prototype.constructor = A;
    A.prototype.lB = A;
    A.mB = {};
    b.btVector4 = A;
    A.prototype.w = A.prototype.w = function () {
      return Vg(this.kB);
    };
    A.prototype.setValue = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      Wg(g, a, c, d, e);
    };
    A.prototype.length = A.prototype.length = function () {
      return Xg(this.kB);
    };
    A.prototype.x = A.prototype.x = function () {
      return Yg(this.kB);
    };
    A.prototype.y = A.prototype.y = function () {
      return Zg(this.kB);
    };
    A.prototype.z = A.prototype.z = function () {
      return $g(this.kB);
    };
    A.prototype.setX = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ah(c, a);
    };
    A.prototype.setY = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bh(c, a);
    };
    A.prototype.setZ = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ch(c, a);
    };
    A.prototype.normalize = A.prototype.normalize = function () {
      dh(this.kB);
    };
    A.prototype.rotate = A.prototype.rotate = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return k(eh(d, a, c), m);
    };
    A.prototype.dot = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return fh(c, a);
    };
    A.prototype.op_mul = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(gh(c, a), m);
    };
    A.prototype.op_add = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(hh(c, a), m);
    };
    A.prototype.op_sub = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(ih(c, a), m);
    };
    A.prototype.__destroy__ = function () {
      jh(this.kB);
    };
    function B(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = kh(a, c, d, e);
      h(B)[this.kB] = this;
    }
    B.prototype = Object.create(cE.prototype);
    B.prototype.constructor = B;
    B.prototype.lB = B;
    B.mB = {};
    b.btQuaternion = B;
    B.prototype.setValue = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      lh(g, a, c, d, e);
    };
    B.prototype.setEulerZYX = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      mh(e, a, c, d);
    };
    B.prototype.setRotation = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      nh(d, a, c);
    };
    B.prototype.normalize = B.prototype.normalize = function () {
      oh(this.kB);
    };
    B.prototype.length2 = function () {
      return ph(this.kB);
    };
    B.prototype.length = B.prototype.length = function () {
      return qh(this.kB);
    };
    B.prototype.dot = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return rh(c, a);
    };
    B.prototype.normalized = function () {
      return k(sh(this.kB), B);
    };
    B.prototype.getAxis = function () {
      return k(th(this.kB), m);
    };
    B.prototype.inverse = B.prototype.inverse = function () {
      return k(uh(this.kB), B);
    };
    B.prototype.getAngle = function () {
      return vh(this.kB);
    };
    B.prototype.getAngleShortestPath = function () {
      return wh(this.kB);
    };
    B.prototype.angle = B.prototype.angle = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return xh(c, a);
    };
    B.prototype.angleShortestPath = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return yh(c, a);
    };
    B.prototype.op_add = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(zh(c, a), B);
    };
    B.prototype.op_sub = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Ah(c, a), B);
    };
    B.prototype.op_mul = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Bh(c, a), B);
    };
    B.prototype.op_mulq = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Ch(c, a), B);
    };
    B.prototype.op_div = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Dh(c, a), B);
    };
    B.prototype.x = B.prototype.x = function () {
      return Eh(this.kB);
    };
    B.prototype.y = B.prototype.y = function () {
      return Fh(this.kB);
    };
    B.prototype.z = B.prototype.z = function () {
      return Gh(this.kB);
    };
    B.prototype.w = B.prototype.w = function () {
      return Hh(this.kB);
    };
    B.prototype.setX = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ih(c, a);
    };
    B.prototype.setY = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jh(c, a);
    };
    B.prototype.setZ = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kh(c, a);
    };
    B.prototype.setW = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lh(c, a);
    };
    B.prototype.__destroy__ = function () {
      Mh(this.kB);
    };
    function uE() {
      throw "cannot construct a btMatrix3x3, no constructor in IDL";
    }
    uE.prototype = Object.create(f.prototype);
    uE.prototype.constructor = uE;
    uE.prototype.lB = uE;
    uE.mB = {};
    b.btMatrix3x3 = uE;
    uE.prototype.setEulerZYX = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Nh(e, a, c, d);
    };
    uE.prototype.getRotation = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Oh(c, a);
    };
    uE.prototype.getRow = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Ph(c, a), m);
    };
    uE.prototype.__destroy__ = function () {
      Qh(this.kB);
    };
    function r(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB =
        void 0 === a
          ? Rh()
          : void 0 === c
          ? _emscripten_bind_btTransform_btTransform_1(a)
          : Sh(a, c);
      h(r)[this.kB] = this;
    }
    r.prototype = Object.create(f.prototype);
    r.prototype.constructor = r;
    r.prototype.lB = r;
    r.mB = {};
    b.btTransform = r;
    r.prototype.setIdentity = function () {
      Th(this.kB);
    };
    r.prototype.setOrigin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Uh(c, a);
    };
    r.prototype.setRotation = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vh(c, a);
    };
    r.prototype.getOrigin = function () {
      return k(Wh(this.kB), m);
    };
    r.prototype.getRotation = function () {
      return k(Xh(this.kB), B);
    };
    r.prototype.getBasis = function () {
      return k(Yh(this.kB), uE);
    };
    r.prototype.setFromOpenGLMatrix = function (a) {
      var c = this.kB;
      ND();
      "object" == typeof a && (a = RD(a));
      Zh(c, a);
    };
    r.prototype.inverse = r.prototype.inverse = function () {
      return k($h(this.kB), r);
    };
    r.prototype.op_mul = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(ai(c, a), r);
    };
    r.prototype.__destroy__ = function () {
      bi(this.kB);
    };
    function vE() {
      this.kB = ci();
      h(vE)[this.kB] = this;
    }
    vE.prototype = Object.create(dE.prototype);
    vE.prototype.constructor = vE;
    vE.prototype.lB = vE;
    vE.mB = {};
    b.MotionState = vE;
    vE.prototype.getWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      di(c, a);
    };
    vE.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ei(c, a);
    };
    vE.prototype.__destroy__ = function () {
      fi(this.kB);
    };
    function wE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = void 0 === a ? gi() : void 0 === c ? hi(a) : ii(a, c);
      h(wE)[this.kB] = this;
    }
    wE.prototype = Object.create(dE.prototype);
    wE.prototype.constructor = wE;
    wE.prototype.lB = wE;
    wE.mB = {};
    b.btDefaultMotionState = wE;
    wE.prototype.getWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ji(c, a);
    };
    wE.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ki(c, a);
    };
    wE.prototype.get_m_graphicsWorldTrans = wE.prototype.lD = function () {
      return k(li(this.kB), r);
    };
    wE.prototype.set_m_graphicsWorldTrans = wE.prototype.cG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mi(c, a);
    };
    Object.defineProperty(wE.prototype, "m_graphicsWorldTrans", {
      get: wE.prototype.lD,
      set: wE.prototype.cG,
    });
    wE.prototype.__destroy__ = function () {
      ni(this.kB);
    };
    function xE() {
      throw "cannot construct a btCollisionObjectWrapper, no constructor in IDL";
    }
    xE.prototype = Object.create(f.prototype);
    xE.prototype.constructor = xE;
    xE.prototype.lB = xE;
    xE.mB = {};
    b.btCollisionObjectWrapper = xE;
    xE.prototype.getWorldTransform = function () {
      return k(oi(this.kB), r);
    };
    xE.prototype.getCollisionObject = function () {
      return k(pi(this.kB), q);
    };
    xE.prototype.getCollisionShape = function () {
      return k(qi(this.kB), l);
    };
    function C(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = ri(a, c);
      h(C)[this.kB] = this;
    }
    C.prototype = Object.create(u.prototype);
    C.prototype.constructor = C;
    C.prototype.lB = C;
    C.mB = {};
    b.ClosestRayResultCallback = C;
    C.prototype.hasHit = function () {
      return !!si(this.kB);
    };
    C.prototype.get_m_rayFromWorld = C.prototype.NB = function () {
      return k(ti(this.kB), m);
    };
    C.prototype.set_m_rayFromWorld = C.prototype.XB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ui(c, a);
    };
    Object.defineProperty(C.prototype, "m_rayFromWorld", {
      get: C.prototype.NB,
      set: C.prototype.XB,
    });
    C.prototype.get_m_rayToWorld = C.prototype.OB = function () {
      return k(vi(this.kB), m);
    };
    C.prototype.set_m_rayToWorld = C.prototype.YB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wi(c, a);
    };
    Object.defineProperty(C.prototype, "m_rayToWorld", {
      get: C.prototype.OB,
      set: C.prototype.YB,
    });
    C.prototype.get_m_hitNormalWorld = C.prototype.xB = function () {
      return k(xi(this.kB), m);
    };
    C.prototype.set_m_hitNormalWorld = C.prototype.EB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yi(c, a);
    };
    Object.defineProperty(C.prototype, "m_hitNormalWorld", {
      get: C.prototype.xB,
      set: C.prototype.EB,
    });
    C.prototype.get_m_hitPointWorld = C.prototype.yB = function () {
      return k(zi(this.kB), m);
    };
    C.prototype.set_m_hitPointWorld = C.prototype.FB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ai(c, a);
    };
    Object.defineProperty(C.prototype, "m_hitPointWorld", {
      get: C.prototype.yB,
      set: C.prototype.FB,
    });
    C.prototype.get_m_collisionFilterGroup = C.prototype.nB = function () {
      return Bi(this.kB);
    };
    C.prototype.set_m_collisionFilterGroup = C.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ci(c, a);
    };
    Object.defineProperty(C.prototype, "m_collisionFilterGroup", {
      get: C.prototype.nB,
      set: C.prototype.pB,
    });
    C.prototype.get_m_collisionFilterMask = C.prototype.oB = function () {
      return Di(this.kB);
    };
    C.prototype.set_m_collisionFilterMask = C.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ei(c, a);
    };
    Object.defineProperty(C.prototype, "m_collisionFilterMask", {
      get: C.prototype.oB,
      set: C.prototype.qB,
    });
    C.prototype.get_m_closestHitFraction = C.prototype.rB = function () {
      return Fi(this.kB);
    };
    C.prototype.set_m_closestHitFraction = C.prototype.sB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Gi(c, a);
    };
    Object.defineProperty(C.prototype, "m_closestHitFraction", {
      get: C.prototype.rB,
      set: C.prototype.sB,
    });
    C.prototype.get_m_collisionObject = C.prototype.vB = function () {
      return k(Hi(this.kB), q);
    };
    C.prototype.set_m_collisionObject = C.prototype.CB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ii(c, a);
    };
    Object.defineProperty(C.prototype, "m_collisionObject", {
      get: C.prototype.vB,
      set: C.prototype.CB,
    });
    C.prototype.get_m_flags = C.prototype.tB = function () {
      return Ji(this.kB);
    };
    C.prototype.set_m_flags = C.prototype.uB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ki(c, a);
    };
    Object.defineProperty(C.prototype, "m_flags", {
      get: C.prototype.tB,
      set: C.prototype.uB,
    });
    C.prototype.__destroy__ = function () {
      Li(this.kB);
    };
    function yE() {
      throw "cannot construct a btConstCollisionObjectArray, no constructor in IDL";
    }
    yE.prototype = Object.create(f.prototype);
    yE.prototype.constructor = yE;
    yE.prototype.lB = yE;
    yE.mB = {};
    b.btConstCollisionObjectArray = yE;
    yE.prototype.size = yE.prototype.size = function () {
      return Mi(this.kB);
    };
    yE.prototype.at = yE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Ni(c, a), q);
    };
    yE.prototype.__destroy__ = function () {
      Oi(this.kB);
    };
    function zE() {
      throw "cannot construct a btScalarArray, no constructor in IDL";
    }
    zE.prototype = Object.create(f.prototype);
    zE.prototype.constructor = zE;
    zE.prototype.lB = zE;
    zE.mB = {};
    b.btScalarArray = zE;
    zE.prototype.size = zE.prototype.size = function () {
      return Pi(this.kB);
    };
    zE.prototype.at = zE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return Qi(c, a);
    };
    zE.prototype.__destroy__ = function () {
      Ri(this.kB);
    };
    function D(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Si(a, c);
      h(D)[this.kB] = this;
    }
    D.prototype = Object.create(u.prototype);
    D.prototype.constructor = D;
    D.prototype.lB = D;
    D.mB = {};
    b.AllHitsRayResultCallback = D;
    D.prototype.hasHit = function () {
      return !!Ti(this.kB);
    };
    D.prototype.get_m_collisionObjects = D.prototype.UC = function () {
      return k(Ui(this.kB), yE);
    };
    D.prototype.set_m_collisionObjects = D.prototype.LF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vi(c, a);
    };
    Object.defineProperty(D.prototype, "m_collisionObjects", {
      get: D.prototype.UC,
      set: D.prototype.LF,
    });
    D.prototype.get_m_rayFromWorld = D.prototype.NB = function () {
      return k(Wi(this.kB), m);
    };
    D.prototype.set_m_rayFromWorld = D.prototype.XB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Xi(c, a);
    };
    Object.defineProperty(D.prototype, "m_rayFromWorld", {
      get: D.prototype.NB,
      set: D.prototype.XB,
    });
    D.prototype.get_m_rayToWorld = D.prototype.OB = function () {
      return k(Yi(this.kB), m);
    };
    D.prototype.set_m_rayToWorld = D.prototype.YB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zi(c, a);
    };
    Object.defineProperty(D.prototype, "m_rayToWorld", {
      get: D.prototype.OB,
      set: D.prototype.YB,
    });
    D.prototype.get_m_hitNormalWorld = D.prototype.xB = function () {
      return k($i(this.kB), AE);
    };
    D.prototype.set_m_hitNormalWorld = D.prototype.EB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      aj(c, a);
    };
    Object.defineProperty(D.prototype, "m_hitNormalWorld", {
      get: D.prototype.xB,
      set: D.prototype.EB,
    });
    D.prototype.get_m_hitPointWorld = D.prototype.yB = function () {
      return k(bj(this.kB), AE);
    };
    D.prototype.set_m_hitPointWorld = D.prototype.FB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cj(c, a);
    };
    Object.defineProperty(D.prototype, "m_hitPointWorld", {
      get: D.prototype.yB,
      set: D.prototype.FB,
    });
    D.prototype.get_m_hitFractions = D.prototype.qD = function () {
      return k(dj(this.kB), zE);
    };
    D.prototype.set_m_hitFractions = D.prototype.hG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ej(c, a);
    };
    Object.defineProperty(D.prototype, "m_hitFractions", {
      get: D.prototype.qD,
      set: D.prototype.hG,
    });
    D.prototype.get_m_collisionFilterGroup = D.prototype.nB = function () {
      return fj(this.kB);
    };
    D.prototype.set_m_collisionFilterGroup = D.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      gj(c, a);
    };
    Object.defineProperty(D.prototype, "m_collisionFilterGroup", {
      get: D.prototype.nB,
      set: D.prototype.pB,
    });
    D.prototype.get_m_collisionFilterMask = D.prototype.oB = function () {
      return hj(this.kB);
    };
    D.prototype.set_m_collisionFilterMask = D.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ij(c, a);
    };
    Object.defineProperty(D.prototype, "m_collisionFilterMask", {
      get: D.prototype.oB,
      set: D.prototype.qB,
    });
    D.prototype.get_m_closestHitFraction = D.prototype.rB = function () {
      return jj(this.kB);
    };
    D.prototype.set_m_closestHitFraction = D.prototype.sB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kj(c, a);
    };
    Object.defineProperty(D.prototype, "m_closestHitFraction", {
      get: D.prototype.rB,
      set: D.prototype.sB,
    });
    D.prototype.get_m_collisionObject = D.prototype.vB = function () {
      return k(lj(this.kB), q);
    };
    D.prototype.set_m_collisionObject = D.prototype.CB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mj(c, a);
    };
    Object.defineProperty(D.prototype, "m_collisionObject", {
      get: D.prototype.vB,
      set: D.prototype.CB,
    });
    D.prototype.get_m_flags = D.prototype.tB = function () {
      return nj(this.kB);
    };
    D.prototype.set_m_flags = D.prototype.uB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      oj(c, a);
    };
    Object.defineProperty(D.prototype, "m_flags", {
      get: D.prototype.tB,
      set: D.prototype.uB,
    });
    D.prototype.__destroy__ = function () {
      pj(this.kB);
    };
    function E() {
      throw "cannot construct a btManifoldPoint, no constructor in IDL";
    }
    E.prototype = Object.create(f.prototype);
    E.prototype.constructor = E;
    E.prototype.lB = E;
    E.mB = {};
    b.btManifoldPoint = E;
    E.prototype.getPositionWorldOnA = function () {
      return k(qj(this.kB), m);
    };
    E.prototype.getPositionWorldOnB = function () {
      return k(rj(this.kB), m);
    };
    E.prototype.getAppliedImpulse = function () {
      return sj(this.kB);
    };
    E.prototype.getDistance = function () {
      return tj(this.kB);
    };
    E.prototype.get_m_localPointA = E.prototype.GD = function () {
      return k(uj(this.kB), m);
    };
    E.prototype.set_m_localPointA = E.prototype.xG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vj(c, a);
    };
    Object.defineProperty(E.prototype, "m_localPointA", {
      get: E.prototype.GD,
      set: E.prototype.xG,
    });
    E.prototype.get_m_localPointB = E.prototype.HD = function () {
      return k(wj(this.kB), m);
    };
    E.prototype.set_m_localPointB = E.prototype.yG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xj(c, a);
    };
    Object.defineProperty(E.prototype, "m_localPointB", {
      get: E.prototype.HD,
      set: E.prototype.yG,
    });
    E.prototype.get_m_positionWorldOnB = E.prototype.YD = function () {
      return k(yj(this.kB), m);
    };
    E.prototype.set_m_positionWorldOnB = E.prototype.PG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zj(c, a);
    };
    Object.defineProperty(E.prototype, "m_positionWorldOnB", {
      get: E.prototype.YD,
      set: E.prototype.PG,
    });
    E.prototype.get_m_positionWorldOnA = E.prototype.XD = function () {
      return k(Aj(this.kB), m);
    };
    E.prototype.set_m_positionWorldOnA = E.prototype.OG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bj(c, a);
    };
    Object.defineProperty(E.prototype, "m_positionWorldOnA", {
      get: E.prototype.XD,
      set: E.prototype.OG,
    });
    E.prototype.get_m_normalWorldOnB = E.prototype.SD = function () {
      return k(Cj(this.kB), m);
    };
    E.prototype.set_m_normalWorldOnB = E.prototype.JG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dj(c, a);
    };
    Object.defineProperty(E.prototype, "m_normalWorldOnB", {
      get: E.prototype.SD,
      set: E.prototype.JG,
    });
    E.prototype.get_m_userPersistentData = E.prototype.zE = function () {
      return Ej(this.kB);
    };
    E.prototype.set_m_userPersistentData = E.prototype.rH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fj(c, a);
    };
    Object.defineProperty(E.prototype, "m_userPersistentData", {
      get: E.prototype.zE,
      set: E.prototype.rH,
    });
    E.prototype.__destroy__ = function () {
      Gj(this.kB);
    };
    function BE() {
      this.kB = Hj();
      h(BE)[this.kB] = this;
    }
    BE.prototype = Object.create(eE.prototype);
    BE.prototype.constructor = BE;
    BE.prototype.lB = BE;
    BE.mB = {};
    b.ConcreteContactResultCallback = BE;
    BE.prototype.addSingleResult = function (a, c, d, e, g, n, z) {
      var T = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      return Ij(T, a, c, d, e, g, n, z);
    };
    BE.prototype.__destroy__ = function () {
      Jj(this.kB);
    };
    function CE() {
      throw "cannot construct a LocalShapeInfo, no constructor in IDL";
    }
    CE.prototype = Object.create(f.prototype);
    CE.prototype.constructor = CE;
    CE.prototype.lB = CE;
    CE.mB = {};
    b.LocalShapeInfo = CE;
    CE.prototype.get_m_shapePart = CE.prototype.gE = function () {
      return Kj(this.kB);
    };
    CE.prototype.set_m_shapePart = CE.prototype.ZG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lj(c, a);
    };
    Object.defineProperty(CE.prototype, "m_shapePart", {
      get: CE.prototype.gE,
      set: CE.prototype.ZG,
    });
    CE.prototype.get_m_triangleIndex = CE.prototype.vE = function () {
      return Mj(this.kB);
    };
    CE.prototype.set_m_triangleIndex = CE.prototype.nH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nj(c, a);
    };
    Object.defineProperty(CE.prototype, "m_triangleIndex", {
      get: CE.prototype.vE,
      set: CE.prototype.nH,
    });
    CE.prototype.__destroy__ = function () {
      Oj(this.kB);
    };
    function F(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB = Pj(a, c, d, e, g);
      h(F)[this.kB] = this;
    }
    F.prototype = Object.create(f.prototype);
    F.prototype.constructor = F;
    F.prototype.lB = F;
    F.mB = {};
    b.LocalConvexResult = F;
    F.prototype.get_m_hitCollisionObject = F.prototype.LB = function () {
      return k(Qj(this.kB), q);
    };
    F.prototype.set_m_hitCollisionObject = F.prototype.VB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rj(c, a);
    };
    Object.defineProperty(F.prototype, "m_hitCollisionObject", {
      get: F.prototype.LB,
      set: F.prototype.VB,
    });
    F.prototype.get_m_localShapeInfo = F.prototype.ID = function () {
      return k(Sj(this.kB), CE);
    };
    F.prototype.set_m_localShapeInfo = F.prototype.zG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tj(c, a);
    };
    Object.defineProperty(F.prototype, "m_localShapeInfo", {
      get: F.prototype.ID,
      set: F.prototype.zG,
    });
    F.prototype.get_m_hitNormalLocal = F.prototype.sD = function () {
      return k(Uj(this.kB), m);
    };
    F.prototype.set_m_hitNormalLocal = F.prototype.jG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vj(c, a);
    };
    Object.defineProperty(F.prototype, "m_hitNormalLocal", {
      get: F.prototype.sD,
      set: F.prototype.jG,
    });
    F.prototype.get_m_hitPointLocal = F.prototype.uD = function () {
      return k(Wj(this.kB), m);
    };
    F.prototype.set_m_hitPointLocal = F.prototype.lG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Xj(c, a);
    };
    Object.defineProperty(F.prototype, "m_hitPointLocal", {
      get: F.prototype.uD,
      set: F.prototype.lG,
    });
    F.prototype.get_m_hitFraction = F.prototype.pD = function () {
      return Yj(this.kB);
    };
    F.prototype.set_m_hitFraction = F.prototype.gG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zj(c, a);
    };
    Object.defineProperty(F.prototype, "m_hitFraction", {
      get: F.prototype.pD,
      set: F.prototype.gG,
    });
    F.prototype.__destroy__ = function () {
      ak(this.kB);
    };
    function G(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = bk(a, c);
      h(G)[this.kB] = this;
    }
    G.prototype = Object.create(v.prototype);
    G.prototype.constructor = G;
    G.prototype.lB = G;
    G.mB = {};
    b.ClosestConvexResultCallback = G;
    G.prototype.hasHit = function () {
      return !!ck(this.kB);
    };
    G.prototype.get_m_hitCollisionObject = G.prototype.LB = function () {
      return k(dk(this.kB), q);
    };
    G.prototype.set_m_hitCollisionObject = G.prototype.VB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ek(c, a);
    };
    Object.defineProperty(G.prototype, "m_hitCollisionObject", {
      get: G.prototype.LB,
      set: G.prototype.VB,
    });
    G.prototype.get_m_convexFromWorld = G.prototype.ZC = function () {
      return k(fk(this.kB), m);
    };
    G.prototype.set_m_convexFromWorld = G.prototype.QF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      gk(c, a);
    };
    Object.defineProperty(G.prototype, "m_convexFromWorld", {
      get: G.prototype.ZC,
      set: G.prototype.QF,
    });
    G.prototype.get_m_convexToWorld = G.prototype.$C = function () {
      return k(hk(this.kB), m);
    };
    G.prototype.set_m_convexToWorld = G.prototype.RF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ik(c, a);
    };
    Object.defineProperty(G.prototype, "m_convexToWorld", {
      get: G.prototype.$C,
      set: G.prototype.RF,
    });
    G.prototype.get_m_hitNormalWorld = G.prototype.xB = function () {
      return k(jk(this.kB), m);
    };
    G.prototype.set_m_hitNormalWorld = G.prototype.EB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kk(c, a);
    };
    Object.defineProperty(G.prototype, "m_hitNormalWorld", {
      get: G.prototype.xB,
      set: G.prototype.EB,
    });
    G.prototype.get_m_hitPointWorld = G.prototype.yB = function () {
      return k(lk(this.kB), m);
    };
    G.prototype.set_m_hitPointWorld = G.prototype.FB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mk(c, a);
    };
    Object.defineProperty(G.prototype, "m_hitPointWorld", {
      get: G.prototype.yB,
      set: G.prototype.FB,
    });
    G.prototype.get_m_collisionFilterGroup = G.prototype.nB = function () {
      return nk(this.kB);
    };
    G.prototype.set_m_collisionFilterGroup = G.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ok(c, a);
    };
    Object.defineProperty(G.prototype, "m_collisionFilterGroup", {
      get: G.prototype.nB,
      set: G.prototype.pB,
    });
    G.prototype.get_m_collisionFilterMask = G.prototype.oB = function () {
      return pk(this.kB);
    };
    G.prototype.set_m_collisionFilterMask = G.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qk(c, a);
    };
    Object.defineProperty(G.prototype, "m_collisionFilterMask", {
      get: G.prototype.oB,
      set: G.prototype.qB,
    });
    G.prototype.get_m_closestHitFraction = G.prototype.rB = function () {
      return rk(this.kB);
    };
    G.prototype.set_m_closestHitFraction = G.prototype.sB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      sk(c, a);
    };
    Object.defineProperty(G.prototype, "m_closestHitFraction", {
      get: G.prototype.rB,
      set: G.prototype.sB,
    });
    G.prototype.__destroy__ = function () {
      tk(this.kB);
    };
    function DE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = void 0 === c ? uk(a) : vk(a, c);
      h(DE)[this.kB] = this;
    }
    DE.prototype = Object.create(fE.prototype);
    DE.prototype.constructor = DE;
    DE.prototype.lB = DE;
    DE.mB = {};
    b.btConvexTriangleMeshShape = DE;
    DE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wk(c, a);
    };
    DE.prototype.getLocalScaling = function () {
      return k(xk(this.kB), m);
    };
    DE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      yk(d, a, c);
    };
    DE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zk(c, a);
    };
    DE.prototype.getMargin = function () {
      return Ak(this.kB);
    };
    DE.prototype.__destroy__ = function () {
      Bk(this.kB);
    };
    function EE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = Ck(a);
      h(EE)[this.kB] = this;
    }
    EE.prototype = Object.create(l.prototype);
    EE.prototype.constructor = EE;
    EE.prototype.lB = EE;
    EE.mB = {};
    b.btBoxShape = EE;
    EE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dk(c, a);
    };
    EE.prototype.getMargin = function () {
      return Ek(this.kB);
    };
    EE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fk(c, a);
    };
    EE.prototype.getLocalScaling = function () {
      return k(Gk(this.kB), m);
    };
    EE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Hk(d, a, c);
    };
    EE.prototype.__destroy__ = function () {
      Ik(this.kB);
    };
    function FE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Jk(a, c);
      h(FE)[this.kB] = this;
    }
    FE.prototype = Object.create(gE.prototype);
    FE.prototype.constructor = FE;
    FE.prototype.lB = FE;
    FE.mB = {};
    b.btCapsuleShapeX = FE;
    FE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kk(c, a);
    };
    FE.prototype.getMargin = function () {
      return Lk(this.kB);
    };
    FE.prototype.getUpAxis = function () {
      return Mk(this.kB);
    };
    FE.prototype.getRadius = function () {
      return Nk(this.kB);
    };
    FE.prototype.getHalfHeight = function () {
      return Ok(this.kB);
    };
    FE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pk(c, a);
    };
    FE.prototype.getLocalScaling = function () {
      return k(Qk(this.kB), m);
    };
    FE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Rk(d, a, c);
    };
    FE.prototype.__destroy__ = function () {
      Sk(this.kB);
    };
    function GE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Tk(a, c);
      h(GE)[this.kB] = this;
    }
    GE.prototype = Object.create(gE.prototype);
    GE.prototype.constructor = GE;
    GE.prototype.lB = GE;
    GE.mB = {};
    b.btCapsuleShapeZ = GE;
    GE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Uk(c, a);
    };
    GE.prototype.getMargin = function () {
      return Vk(this.kB);
    };
    GE.prototype.getUpAxis = function () {
      return Wk(this.kB);
    };
    GE.prototype.getRadius = function () {
      return Xk(this.kB);
    };
    GE.prototype.getHalfHeight = function () {
      return Yk(this.kB);
    };
    GE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zk(c, a);
    };
    GE.prototype.getLocalScaling = function () {
      return k($k(this.kB), m);
    };
    GE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      al(d, a, c);
    };
    GE.prototype.__destroy__ = function () {
      bl(this.kB);
    };
    function HE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = cl(a);
      h(HE)[this.kB] = this;
    }
    HE.prototype = Object.create(hE.prototype);
    HE.prototype.constructor = HE;
    HE.prototype.lB = HE;
    HE.mB = {};
    b.btCylinderShapeX = HE;
    HE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dl(c, a);
    };
    HE.prototype.getMargin = function () {
      return el(this.kB);
    };
    HE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fl(c, a);
    };
    HE.prototype.getLocalScaling = function () {
      return k(gl(this.kB), m);
    };
    HE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      hl(d, a, c);
    };
    HE.prototype.__destroy__ = function () {
      il(this.kB);
    };
    function IE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = jl(a);
      h(IE)[this.kB] = this;
    }
    IE.prototype = Object.create(hE.prototype);
    IE.prototype.constructor = IE;
    IE.prototype.lB = IE;
    IE.mB = {};
    b.btCylinderShapeZ = IE;
    IE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kl(c, a);
    };
    IE.prototype.getMargin = function () {
      return ll(this.kB);
    };
    IE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ml(c, a);
    };
    IE.prototype.getLocalScaling = function () {
      return k(nl(this.kB), m);
    };
    IE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      ol(d, a, c);
    };
    IE.prototype.__destroy__ = function () {
      pl(this.kB);
    };
    function JE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = ql(a);
      h(JE)[this.kB] = this;
    }
    JE.prototype = Object.create(l.prototype);
    JE.prototype.constructor = JE;
    JE.prototype.lB = JE;
    JE.mB = {};
    b.btSphereShape = JE;
    JE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rl(c, a);
    };
    JE.prototype.getMargin = function () {
      return sl(this.kB);
    };
    JE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tl(c, a);
    };
    JE.prototype.getLocalScaling = function () {
      return k(ul(this.kB), m);
    };
    JE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      vl(d, a, c);
    };
    JE.prototype.__destroy__ = function () {
      wl(this.kB);
    };
    function KE(a, c, d) {
      ND();
      a && "object" === typeof a && (a = a.kB);
      "object" == typeof c && (c = RD(c));
      d && "object" === typeof d && (d = d.kB);
      this.kB = xl(a, c, d);
      h(KE)[this.kB] = this;
    }
    KE.prototype = Object.create(l.prototype);
    KE.prototype.constructor = KE;
    KE.prototype.lB = KE;
    KE.mB = {};
    b.btMultiSphereShape = KE;
    KE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yl(c, a);
    };
    KE.prototype.getLocalScaling = function () {
      return k(zl(this.kB), m);
    };
    KE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Al(d, a, c);
    };
    KE.prototype.__destroy__ = function () {
      Bl(this.kB);
    };
    function LE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Cl(a, c);
      h(LE)[this.kB] = this;
    }
    LE.prototype = Object.create(iE.prototype);
    LE.prototype.constructor = LE;
    LE.prototype.lB = LE;
    LE.mB = {};
    b.btConeShapeX = LE;
    LE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dl(c, a);
    };
    LE.prototype.getLocalScaling = function () {
      return k(El(this.kB), m);
    };
    LE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Fl(d, a, c);
    };
    LE.prototype.__destroy__ = function () {
      Gl(this.kB);
    };
    function ME(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Hl(a, c);
      h(ME)[this.kB] = this;
    }
    ME.prototype = Object.create(iE.prototype);
    ME.prototype.constructor = ME;
    ME.prototype.lB = ME;
    ME.mB = {};
    b.btConeShapeZ = ME;
    ME.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Il(c, a);
    };
    ME.prototype.getLocalScaling = function () {
      return k(Jl(this.kB), m);
    };
    ME.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Kl(d, a, c);
    };
    ME.prototype.__destroy__ = function () {
      Ll(this.kB);
    };
    function NE() {
      throw "cannot construct a btIntArray, no constructor in IDL";
    }
    NE.prototype = Object.create(f.prototype);
    NE.prototype.constructor = NE;
    NE.prototype.lB = NE;
    NE.mB = {};
    b.btIntArray = NE;
    NE.prototype.size = NE.prototype.size = function () {
      return Ml(this.kB);
    };
    NE.prototype.at = NE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return Nl(c, a);
    };
    NE.prototype.__destroy__ = function () {
      Ol(this.kB);
    };
    function OE() {
      throw "cannot construct a btFace, no constructor in IDL";
    }
    OE.prototype = Object.create(f.prototype);
    OE.prototype.constructor = OE;
    OE.prototype.lB = OE;
    OE.mB = {};
    b.btFace = OE;
    OE.prototype.get_m_indices = OE.prototype.xD = function () {
      return k(Pl(this.kB), NE);
    };
    OE.prototype.set_m_indices = OE.prototype.oG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ql(c, a);
    };
    Object.defineProperty(OE.prototype, "m_indices", {
      get: OE.prototype.xD,
      set: OE.prototype.oG,
    });
    OE.prototype.get_m_plane = OE.prototype.WD = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return Rl(c, a);
    };
    OE.prototype.set_m_plane = OE.prototype.NG = function (a, c) {
      var d = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Sl(d, a, c);
    };
    Object.defineProperty(OE.prototype, "m_plane", {
      get: OE.prototype.WD,
      set: OE.prototype.NG,
    });
    OE.prototype.__destroy__ = function () {
      Tl(this.kB);
    };
    function AE() {
      throw "cannot construct a btVector3Array, no constructor in IDL";
    }
    AE.prototype = Object.create(f.prototype);
    AE.prototype.constructor = AE;
    AE.prototype.lB = AE;
    AE.mB = {};
    b.btVector3Array = AE;
    AE.prototype.size = AE.prototype.size = function () {
      return Ul(this.kB);
    };
    AE.prototype.at = AE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Vl(c, a), m);
    };
    AE.prototype.__destroy__ = function () {
      Wl(this.kB);
    };
    function PE() {
      throw "cannot construct a btFaceArray, no constructor in IDL";
    }
    PE.prototype = Object.create(f.prototype);
    PE.prototype.constructor = PE;
    PE.prototype.lB = PE;
    PE.mB = {};
    b.btFaceArray = PE;
    PE.prototype.size = PE.prototype.size = function () {
      return Xl(this.kB);
    };
    PE.prototype.at = PE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Yl(c, a), OE);
    };
    PE.prototype.__destroy__ = function () {
      Zl(this.kB);
    };
    function QE() {
      throw "cannot construct a btConvexPolyhedron, no constructor in IDL";
    }
    QE.prototype = Object.create(f.prototype);
    QE.prototype.constructor = QE;
    QE.prototype.lB = QE;
    QE.mB = {};
    b.btConvexPolyhedron = QE;
    QE.prototype.get_m_vertices = QE.prototype.BE = function () {
      return k($l(this.kB), AE);
    };
    QE.prototype.set_m_vertices = QE.prototype.tH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      am(c, a);
    };
    Object.defineProperty(QE.prototype, "m_vertices", {
      get: QE.prototype.BE,
      set: QE.prototype.tH,
    });
    QE.prototype.get_m_faces = QE.prototype.KB = function () {
      return k(bm(this.kB), PE);
    };
    QE.prototype.set_m_faces = QE.prototype.UB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cm(c, a);
    };
    Object.defineProperty(QE.prototype, "m_faces", {
      get: QE.prototype.KB,
      set: QE.prototype.UB,
    });
    QE.prototype.__destroy__ = function () {
      dm(this.kB);
    };
    function RE(a, c) {
      ND();
      "object" == typeof a && (a = RD(a));
      c && "object" === typeof c && (c = c.kB);
      this.kB = void 0 === a ? em() : void 0 === c ? fm(a) : gm(a, c);
      h(RE)[this.kB] = this;
    }
    RE.prototype = Object.create(l.prototype);
    RE.prototype.constructor = RE;
    RE.prototype.lB = RE;
    RE.mB = {};
    b.btConvexHullShape = RE;
    RE.prototype.addPoint = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === c ? hm(d, a) : im(d, a, c);
    };
    RE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jm(c, a);
    };
    RE.prototype.getMargin = function () {
      return km(this.kB);
    };
    RE.prototype.getNumVertices = function () {
      return lm(this.kB);
    };
    RE.prototype.initializePolyhedralFeatures = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return !!mm(c, a);
    };
    RE.prototype.recalcLocalAabb = function () {
      nm(this.kB);
    };
    RE.prototype.getConvexPolyhedron = function () {
      return k(om(this.kB), QE);
    };
    RE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pm(c, a);
    };
    RE.prototype.getLocalScaling = function () {
      return k(qm(this.kB), m);
    };
    RE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      rm(d, a, c);
    };
    RE.prototype.__destroy__ = function () {
      sm(this.kB);
    };
    function SE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = tm(a);
      h(SE)[this.kB] = this;
    }
    SE.prototype = Object.create(f.prototype);
    SE.prototype.constructor = SE;
    SE.prototype.lB = SE;
    SE.mB = {};
    b.btShapeHull = SE;
    SE.prototype.buildHull = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return !!um(c, a);
    };
    SE.prototype.numVertices = function () {
      return wm(this.kB);
    };
    SE.prototype.getVertexPointer = function () {
      return k(xm(this.kB), m);
    };
    SE.prototype.__destroy__ = function () {
      ym(this.kB);
    };
    function TE(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = void 0 === a ? zm() : Am(a);
      h(TE)[this.kB] = this;
    }
    TE.prototype = Object.create(l.prototype);
    TE.prototype.constructor = TE;
    TE.prototype.lB = TE;
    TE.mB = {};
    b.btCompoundShape = TE;
    TE.prototype.addChildShape = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Bm(d, a, c);
    };
    TE.prototype.removeChildShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cm(c, a);
    };
    TE.prototype.removeChildShapeByIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dm(c, a);
    };
    TE.prototype.getNumChildShapes = function () {
      return Em(this.kB);
    };
    TE.prototype.getChildShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Fm(c, a), l);
    };
    TE.prototype.updateChildTransform = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === d ? Gm(e, a, c) : Hm(e, a, c, d);
    };
    TE.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Im(c, a);
    };
    TE.prototype.getMargin = function () {
      return Jm(this.kB);
    };
    TE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Km(c, a);
    };
    TE.prototype.getLocalScaling = function () {
      return k(Lm(this.kB), m);
    };
    TE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Mm(d, a, c);
    };
    TE.prototype.__destroy__ = function () {
      Nm(this.kB);
    };
    function UE() {
      throw "cannot construct a btIndexedMesh, no constructor in IDL";
    }
    UE.prototype = Object.create(f.prototype);
    UE.prototype.constructor = UE;
    UE.prototype.lB = UE;
    UE.mB = {};
    b.btIndexedMesh = UE;
    UE.prototype.get_m_numTriangles = UE.prototype.UD = function () {
      return Om(this.kB);
    };
    UE.prototype.set_m_numTriangles = UE.prototype.LG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pm(c, a);
    };
    Object.defineProperty(UE.prototype, "m_numTriangles", {
      get: UE.prototype.UD,
      set: UE.prototype.LG,
    });
    UE.prototype.__destroy__ = function () {
      Qm(this.kB);
    };
    function VE() {
      throw "cannot construct a btIndexedMeshArray, no constructor in IDL";
    }
    VE.prototype = Object.create(f.prototype);
    VE.prototype.constructor = VE;
    VE.prototype.lB = VE;
    VE.mB = {};
    b.btIndexedMeshArray = VE;
    VE.prototype.size = VE.prototype.size = function () {
      return Rm(this.kB);
    };
    VE.prototype.at = VE.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Sm(c, a), UE);
    };
    VE.prototype.__destroy__ = function () {
      Tm(this.kB);
    };
    function WE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = void 0 === a ? Um() : void 0 === c ? Vm(a) : Wm(a, c);
      h(WE)[this.kB] = this;
    }
    WE.prototype = Object.create(jE.prototype);
    WE.prototype.constructor = WE;
    WE.prototype.lB = WE;
    WE.mB = {};
    b.btTriangleMesh = WE;
    WE.prototype.addTriangle = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      void 0 === e ? Xm(g, a, c, d) : Ym(g, a, c, d, e);
    };
    WE.prototype.findOrAddVertex = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return Zm(d, a, c);
    };
    WE.prototype.addIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $m(c, a);
    };
    WE.prototype.getIndexedMeshArray = function () {
      return k(an(this.kB), VE);
    };
    WE.prototype.setScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bn(c, a);
    };
    WE.prototype.__destroy__ = function () {
      cn(this.kB);
    };
    function XE() {
      this.kB = dn();
      h(XE)[this.kB] = this;
    }
    XE.prototype = Object.create(ZD.prototype);
    XE.prototype.constructor = XE;
    XE.prototype.lB = XE;
    XE.mB = {};
    b.btEmptyShape = XE;
    XE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      en(c, a);
    };
    XE.prototype.getLocalScaling = function () {
      return k(fn(this.kB), m);
    };
    XE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      gn(d, a, c);
    };
    XE.prototype.__destroy__ = function () {
      hn(this.kB);
    };
    function YE(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = jn(a, c);
      h(YE)[this.kB] = this;
    }
    YE.prototype = Object.create(ZD.prototype);
    YE.prototype.constructor = YE;
    YE.prototype.lB = YE;
    YE.mB = {};
    b.btStaticPlaneShape = YE;
    YE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kn(c, a);
    };
    YE.prototype.getLocalScaling = function () {
      return k(ln(this.kB), m);
    };
    YE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      mn(d, a, c);
    };
    YE.prototype.__destroy__ = function () {
      nn(this.kB);
    };
    function ZE(a, c, d) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      this.kB = void 0 === d ? on(a, c) : pn(a, c, d);
      h(ZE)[this.kB] = this;
    }
    ZE.prototype = Object.create(kE.prototype);
    ZE.prototype.constructor = ZE;
    ZE.prototype.lB = ZE;
    ZE.mB = {};
    b.btBvhTriangleMeshShape = ZE;
    ZE.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qn(c, a);
    };
    ZE.prototype.getLocalScaling = function () {
      return k(rn(this.kB), m);
    };
    ZE.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      sn(d, a, c);
    };
    ZE.prototype.__destroy__ = function () {
      tn(this.kB);
    };
    function $E(a, c, d, e, g, n, z, T, Da) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      T && "object" === typeof T && (T = T.kB);
      Da && "object" === typeof Da && (Da = Da.kB);
      this.kB = un(a, c, d, e, g, n, z, T, Da);
      h($E)[this.kB] = this;
    }
    $E.prototype = Object.create(ZD.prototype);
    $E.prototype.constructor = $E;
    $E.prototype.lB = $E;
    $E.mB = {};
    b.btHeightfieldTerrainShape = $E;
    $E.prototype.setMargin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vn(c, a);
    };
    $E.prototype.getMargin = function () {
      return wn(this.kB);
    };
    $E.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xn(c, a);
    };
    $E.prototype.getLocalScaling = function () {
      return k(yn(this.kB), m);
    };
    $E.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      zn(d, a, c);
    };
    $E.prototype.__destroy__ = function () {
      An(this.kB);
    };
    function aF(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = Bn(a, c, d, e);
      h(aF)[this.kB] = this;
    }
    aF.prototype = Object.create(f.prototype);
    aF.prototype.constructor = aF;
    aF.prototype.lB = aF;
    aF.mB = {};
    b.btAABB = aF;
    aF.prototype.invalidate = function () {
      Cn(this.kB);
    };
    aF.prototype.increment_margin = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dn(c, a);
    };
    aF.prototype.copy_with_margin = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      En(d, a, c);
    };
    aF.prototype.__destroy__ = function () {
      Fn(this.kB);
    };
    function bF() {
      this.kB = Gn();
      h(bF)[this.kB] = this;
    }
    bF.prototype = Object.create(f.prototype);
    bF.prototype.constructor = bF;
    bF.prototype.lB = bF;
    bF.mB = {};
    b.btPrimitiveTriangle = bF;
    bF.prototype.__destroy__ = function () {
      Hn(this.kB);
    };
    function cF(a, c, d) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      this.kB = In(a, c, d);
      h(cF)[this.kB] = this;
    }
    cF.prototype = Object.create(f.prototype);
    cF.prototype.constructor = cF;
    cF.prototype.lB = cF;
    cF.mB = {};
    b.btTriangleShapeEx = cF;
    cF.prototype.getAabb = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Jn(e, a, c, d);
    };
    cF.prototype.applyTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kn(c, a);
    };
    cF.prototype.buildTriPlane = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ln(c, a);
    };
    cF.prototype.__destroy__ = function () {
      Mn(this.kB);
    };
    function dF() {
      this.kB = Nn();
      h(dF)[this.kB] = this;
    }
    dF.prototype = Object.create(f.prototype);
    dF.prototype.constructor = dF;
    dF.prototype.lB = dF;
    dF.mB = {};
    b.btTetrahedronShapeEx = dF;
    dF.prototype.setVertices = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      On(g, a, c, d, e);
    };
    dF.prototype.__destroy__ = function () {
      Pn(this.kB);
    };
    function eF() {
      throw "cannot construct a CompoundPrimitiveManager, no constructor in IDL";
    }
    eF.prototype = Object.create(lE.prototype);
    eF.prototype.constructor = eF;
    eF.prototype.lB = eF;
    eF.mB = {};
    b.CompoundPrimitiveManager = eF;
    eF.prototype.get_primitive_count = function () {
      return Qn(this.kB);
    };
    eF.prototype.get_primitive_box = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Rn(d, a, c);
    };
    eF.prototype.get_primitive_triangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Sn(d, a, c);
    };
    eF.prototype.is_trimesh = function () {
      return !!Tn(this.kB);
    };
    eF.prototype.get_m_compoundShape = eF.prototype.VC = function () {
      return k(Un(this.kB), H);
    };
    eF.prototype.set_m_compoundShape = eF.prototype.MF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vn(c, a);
    };
    Object.defineProperty(eF.prototype, "m_compoundShape", {
      get: eF.prototype.VC,
      set: eF.prototype.MF,
    });
    eF.prototype.__destroy__ = function () {
      Wn(this.kB);
    };
    function H(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = void 0 === a ? Xn() : Yn(a);
      h(H)[this.kB] = this;
    }
    H.prototype = Object.create(w.prototype);
    H.prototype.constructor = H;
    H.prototype.lB = H;
    H.mB = {};
    b.btGImpactCompoundShape = H;
    H.prototype.childrenHasTransform = function () {
      return !!Zn(this.kB);
    };
    H.prototype.getPrimitiveManager = function () {
      return k($n(this.kB), lE);
    };
    H.prototype.getCompoundPrimitiveManager = function () {
      return k(ao(this.kB), eF);
    };
    H.prototype.getNumChildShapes = function () {
      return bo(this.kB);
    };
    H.prototype.addChildShape = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      co(d, a, c);
    };
    H.prototype.getChildShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(eo(c, a), l);
    };
    H.prototype.getChildAabb = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      fo(g, a, c, d, e);
    };
    H.prototype.getChildTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(go(c, a), r);
    };
    H.prototype.setChildTransform = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      ho(d, a, c);
    };
    H.prototype.calculateLocalInertia = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      io(d, a, c);
    };
    H.prototype.getName = function () {
      return sa(jo(this.kB));
    };
    H.prototype.getGImpactShapeType = function () {
      return ko(this.kB);
    };
    H.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lo(c, a);
    };
    H.prototype.getLocalScaling = function () {
      return k(mo(this.kB), m);
    };
    H.prototype.updateBound = function () {
      no(this.kB);
    };
    H.prototype.postUpdate = function () {
      oo(this.kB);
    };
    H.prototype.getShapeType = function () {
      return po(this.kB);
    };
    H.prototype.needsRetrieveTriangles = function () {
      return !!qo(this.kB);
    };
    H.prototype.needsRetrieveTetrahedrons = function () {
      return !!ro(this.kB);
    };
    H.prototype.getBulletTriangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      so(d, a, c);
    };
    H.prototype.getBulletTetrahedron = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      to(d, a, c);
    };
    H.prototype.__destroy__ = function () {
      uo(this.kB);
    };
    function I(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = void 0 === a ? vo() : wo(a);
      h(I)[this.kB] = this;
    }
    I.prototype = Object.create(lE.prototype);
    I.prototype.constructor = I;
    I.prototype.lB = I;
    I.mB = {};
    b.TrimeshPrimitiveManager = I;
    I.prototype.lock = I.prototype.lock = function () {
      xo(this.kB);
    };
    I.prototype.unlock = I.prototype.unlock = function () {
      yo(this.kB);
    };
    I.prototype.is_trimesh = function () {
      return !!zo(this.kB);
    };
    I.prototype.get_vertex_count = function () {
      return Ao(this.kB);
    };
    I.prototype.get_indices = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      Bo(g, a, c, d, e);
    };
    I.prototype.get_vertex = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Co(d, a, c);
    };
    I.prototype.get_bullet_triangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Do(d, a, c);
    };
    I.prototype.get_m_margin = I.prototype.LD = function () {
      return Eo(this.kB);
    };
    I.prototype.set_m_margin = I.prototype.CG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fo(c, a);
    };
    Object.defineProperty(I.prototype, "m_margin", {
      get: I.prototype.LD,
      set: I.prototype.CG,
    });
    I.prototype.get_m_meshInterface = I.prototype.OD = function () {
      return k(Go(this.kB), jE);
    };
    I.prototype.set_m_meshInterface = I.prototype.FG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ho(c, a);
    };
    Object.defineProperty(I.prototype, "m_meshInterface", {
      get: I.prototype.OD,
      set: I.prototype.FG,
    });
    I.prototype.get_m_part = I.prototype.VD = function () {
      return Io(this.kB);
    };
    I.prototype.set_m_part = I.prototype.MG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jo(c, a);
    };
    Object.defineProperty(I.prototype, "m_part", {
      get: I.prototype.VD,
      set: I.prototype.MG,
    });
    I.prototype.get_m_lock_count = I.prototype.JD = function () {
      return Ko(this.kB);
    };
    I.prototype.set_m_lock_count = I.prototype.AG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lo(c, a);
    };
    Object.defineProperty(I.prototype, "m_lock_count", {
      get: I.prototype.JD,
      set: I.prototype.AG,
    });
    I.prototype.get_numverts = I.prototype.LE = function () {
      return Mo(this.kB);
    };
    I.prototype.set_numverts = I.prototype.DH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      No(c, a);
    };
    Object.defineProperty(I.prototype, "numverts", {
      get: I.prototype.LE,
      set: I.prototype.DH,
    });
    I.prototype.get_type = I.prototype.PE = function () {
      return Oo(this.kB);
    };
    I.prototype.set_type = I.prototype.HH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Po(c, a);
    };
    Object.defineProperty(I.prototype, "type", {
      get: I.prototype.PE,
      set: I.prototype.HH,
    });
    I.prototype.get_stride = I.prototype.NE = function () {
      return Qo(this.kB);
    };
    I.prototype.set_stride = I.prototype.FH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ro(c, a);
    };
    Object.defineProperty(I.prototype, "stride", {
      get: I.prototype.NE,
      set: I.prototype.FH,
    });
    I.prototype.get_indexstride = I.prototype.gC = function () {
      return So(this.kB);
    };
    I.prototype.set_indexstride = I.prototype.YE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      To(c, a);
    };
    Object.defineProperty(I.prototype, "indexstride", {
      get: I.prototype.gC,
      set: I.prototype.YE,
    });
    I.prototype.get_numfaces = I.prototype.KE = function () {
      return Uo(this.kB);
    };
    I.prototype.set_numfaces = I.prototype.CH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vo(c, a);
    };
    Object.defineProperty(I.prototype, "numfaces", {
      get: I.prototype.KE,
      set: I.prototype.CH,
    });
    I.prototype.get_indicestype = I.prototype.hC = function () {
      return Wo(this.kB);
    };
    I.prototype.set_indicestype = I.prototype.ZE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Xo(c, a);
    };
    Object.defineProperty(I.prototype, "indicestype", {
      get: I.prototype.hC,
      set: I.prototype.ZE,
    });
    I.prototype.__destroy__ = function () {
      Yo(this.kB);
    };
    function fF(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB = Zo(a, c);
      h(fF)[this.kB] = this;
    }
    fF.prototype = Object.create(w.prototype);
    fF.prototype.constructor = fF;
    fF.prototype.lB = fF;
    fF.mB = {};
    b.btGImpactMeshShapePart = fF;
    fF.prototype.getTrimeshPrimitiveManager = function () {
      return k($o(this.kB), I);
    };
    fF.prototype.getVertexCount = function () {
      return ap(this.kB);
    };
    fF.prototype.getVertex = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      bp(d, a, c);
    };
    fF.prototype.getPart = function () {
      return cp(this.kB);
    };
    fF.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dp(c, a);
    };
    fF.prototype.getLocalScaling = function () {
      return k(ep(this.kB), m);
    };
    fF.prototype.updateBound = function () {
      fp(this.kB);
    };
    fF.prototype.postUpdate = function () {
      gp(this.kB);
    };
    fF.prototype.getShapeType = function () {
      return hp(this.kB);
    };
    fF.prototype.needsRetrieveTriangles = function () {
      return !!ip(this.kB);
    };
    fF.prototype.needsRetrieveTetrahedrons = function () {
      return !!jp(this.kB);
    };
    fF.prototype.getBulletTriangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      kp(d, a, c);
    };
    fF.prototype.getBulletTetrahedron = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      lp(d, a, c);
    };
    fF.prototype.__destroy__ = function () {
      mp(this.kB);
    };
    function gF(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = np(a);
      h(gF)[this.kB] = this;
    }
    gF.prototype = Object.create(w.prototype);
    gF.prototype.constructor = gF;
    gF.prototype.lB = gF;
    gF.mB = {};
    b.btGImpactMeshShape = gF;
    gF.prototype.getMeshInterface = function () {
      return k(op(this.kB), jE);
    };
    gF.prototype.getMeshPartCount = function () {
      return pp(this.kB);
    };
    gF.prototype.getMeshPart = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(qp(c, a), fF);
    };
    gF.prototype.calculateSerializeBufferSize = function () {
      return rp(this.kB);
    };
    gF.prototype.setLocalScaling = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      sp(c, a);
    };
    gF.prototype.getLocalScaling = function () {
      return k(tp(this.kB), m);
    };
    gF.prototype.updateBound = function () {
      up(this.kB);
    };
    gF.prototype.postUpdate = function () {
      vp(this.kB);
    };
    gF.prototype.getShapeType = function () {
      return wp(this.kB);
    };
    gF.prototype.needsRetrieveTriangles = function () {
      return !!xp(this.kB);
    };
    gF.prototype.needsRetrieveTetrahedrons = function () {
      return !!yp(this.kB);
    };
    gF.prototype.getBulletTriangle = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      zp(d, a, c);
    };
    gF.prototype.getBulletTetrahedron = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Ap(d, a, c);
    };
    gF.prototype.__destroy__ = function () {
      Bp(this.kB);
    };
    function hF(a, c) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      this.kB =
        void 0 === a
          ? Cp()
          : void 0 === c
          ? _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_1(
              a
            )
          : Dp(a, c);
      h(hF)[this.kB] = this;
    }
    hF.prototype = Object.create(f.prototype);
    hF.prototype.constructor = hF;
    hF.prototype.lB = hF;
    hF.mB = {};
    b.btCollisionAlgorithmConstructionInfo = hF;
    hF.prototype.get_m_dispatcher1 = hF.prototype.eD = function () {
      return k(Ep(this.kB), TD);
    };
    hF.prototype.set_m_dispatcher1 = hF.prototype.WF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fp(c, a);
    };
    Object.defineProperty(hF.prototype, "m_dispatcher1", {
      get: hF.prototype.eD,
      set: hF.prototype.WF,
    });
    hF.prototype.get_m_manifold = hF.prototype.KD = function () {
      return k(Gp(this.kB), oE);
    };
    hF.prototype.set_m_manifold = hF.prototype.BG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Hp(c, a);
    };
    Object.defineProperty(hF.prototype, "m_manifold", {
      get: hF.prototype.KD,
      set: hF.prototype.BG,
    });
    hF.prototype.__destroy__ = function () {
      Ip(this.kB);
    };
    function iF(a, c, d) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      this.kB = Jp(a, c, d);
      h(iF)[this.kB] = this;
    }
    iF.prototype = Object.create(mE.prototype);
    iF.prototype.constructor = iF;
    iF.prototype.lB = iF;
    iF.mB = {};
    b.btGImpactCollisionAlgorithm = iF;
    iF.prototype.registerAlgorithm = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kp(c, a);
    };
    iF.prototype.__destroy__ = function () {
      Lp(this.kB);
    };
    function jF() {
      this.kB = Mp();
      h(jF)[this.kB] = this;
    }
    jF.prototype = Object.create(f.prototype);
    jF.prototype.constructor = jF;
    jF.prototype.lB = jF;
    jF.mB = {};
    b.btDefaultCollisionConstructionInfo = jF;
    jF.prototype.__destroy__ = function () {
      Np(this.kB);
    };
    function oE() {
      this.kB = Op();
      h(oE)[this.kB] = this;
    }
    oE.prototype = Object.create(f.prototype);
    oE.prototype.constructor = oE;
    oE.prototype.lB = oE;
    oE.mB = {};
    b.btPersistentManifold = oE;
    oE.prototype.getBody0 = function () {
      return k(Pp(this.kB), q);
    };
    oE.prototype.getBody1 = function () {
      return k(Qp(this.kB), q);
    };
    oE.prototype.getNumContacts = function () {
      return Rp(this.kB);
    };
    oE.prototype.getContactPoint = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Sp(c, a), E);
    };
    oE.prototype.__destroy__ = function () {
      Tp(this.kB);
    };
    function kF(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = Up(a);
      h(kF)[this.kB] = this;
    }
    kF.prototype = Object.create(TD.prototype);
    kF.prototype.constructor = kF;
    kF.prototype.lB = kF;
    kF.mB = {};
    b.btCollisionDispatcher = kF;
    kF.prototype.getNumManifolds = function () {
      return Vp(this.kB);
    };
    kF.prototype.getManifoldByIndexInternal = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Wp(c, a), oE);
    };
    kF.prototype.__destroy__ = function () {
      Xp(this.kB);
    };
    function lF() {
      throw "cannot construct a btOverlappingPairCallback, no constructor in IDL";
    }
    lF.prototype = Object.create(f.prototype);
    lF.prototype.constructor = lF;
    lF.prototype.lB = lF;
    lF.mB = {};
    b.btOverlappingPairCallback = lF;
    lF.prototype.__destroy__ = function () {
      Yp(this.kB);
    };
    function UD() {
      throw "cannot construct a btOverlappingPairCache, no constructor in IDL";
    }
    UD.prototype = Object.create(f.prototype);
    UD.prototype.constructor = UD;
    UD.prototype.lB = UD;
    UD.mB = {};
    b.btOverlappingPairCache = UD;
    UD.prototype.setInternalGhostPairCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zp(c, a);
    };
    UD.prototype.getNumOverlappingPairs = function () {
      return $p(this.kB);
    };
    UD.prototype.__destroy__ = function () {
      aq(this.kB);
    };
    function mF(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB =
        void 0 === d
          ? bq(a, c)
          : void 0 === e
          ? cq(a, c, d)
          : void 0 === g
          ? dq(a, c, d, e)
          : eq(a, c, d, e, g);
      h(mF)[this.kB] = this;
    }
    mF.prototype = Object.create(f.prototype);
    mF.prototype.constructor = mF;
    mF.prototype.lB = mF;
    mF.mB = {};
    b.btAxisSweep3 = mF;
    mF.prototype.__destroy__ = function () {
      fq(this.kB);
    };
    function VD() {
      throw "cannot construct a btBroadphaseInterface, no constructor in IDL";
    }
    VD.prototype = Object.create(f.prototype);
    VD.prototype.constructor = VD;
    VD.prototype.lB = VD;
    VD.mB = {};
    b.btBroadphaseInterface = VD;
    VD.prototype.getOverlappingPairCache = function () {
      return k(gq(this.kB), UD);
    };
    VD.prototype.__destroy__ = function () {
      hq(this.kB);
    };
    function nF() {
      throw "cannot construct a btCollisionConfiguration, no constructor in IDL";
    }
    nF.prototype = Object.create(f.prototype);
    nF.prototype.constructor = nF;
    nF.prototype.lB = nF;
    nF.mB = {};
    b.btCollisionConfiguration = nF;
    nF.prototype.__destroy__ = function () {
      iq(this.kB);
    };
    function oF() {
      this.kB = jq();
      h(oF)[this.kB] = this;
    }
    oF.prototype = Object.create(f.prototype);
    oF.prototype.constructor = oF;
    oF.prototype.lB = oF;
    oF.mB = {};
    b.btDbvtBroadphase = oF;
    oF.prototype.__destroy__ = function () {
      kq(this.kB);
    };
    function YD() {
      throw "cannot construct a btBroadphaseProxy, no constructor in IDL";
    }
    YD.prototype = Object.create(f.prototype);
    YD.prototype.constructor = YD;
    YD.prototype.lB = YD;
    YD.mB = {};
    b.btBroadphaseProxy = YD;
    YD.prototype.get_m_collisionFilterGroup = YD.prototype.nB = function () {
      return lq(this.kB);
    };
    YD.prototype.set_m_collisionFilterGroup = YD.prototype.pB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mq(c, a);
    };
    Object.defineProperty(YD.prototype, "m_collisionFilterGroup", {
      get: YD.prototype.nB,
      set: YD.prototype.pB,
    });
    YD.prototype.get_m_collisionFilterMask = YD.prototype.oB = function () {
      return nq(this.kB);
    };
    YD.prototype.set_m_collisionFilterMask = YD.prototype.qB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      oq(c, a);
    };
    Object.defineProperty(YD.prototype, "m_collisionFilterMask", {
      get: YD.prototype.oB,
      set: YD.prototype.qB,
    });
    YD.prototype.__destroy__ = function () {
      pq(this.kB);
    };
    function J(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = void 0 === e ? qq(a, c, d) : rq(a, c, d, e);
      h(J)[this.kB] = this;
    }
    J.prototype = Object.create(f.prototype);
    J.prototype.constructor = J;
    J.prototype.lB = J;
    J.mB = {};
    b.btRigidBodyConstructionInfo = J;
    J.prototype.get_m_linearDamping = J.prototype.DD = function () {
      return sq(this.kB);
    };
    J.prototype.set_m_linearDamping = J.prototype.uG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tq(c, a);
    };
    Object.defineProperty(J.prototype, "m_linearDamping", {
      get: J.prototype.DD,
      set: J.prototype.uG,
    });
    J.prototype.get_m_angularDamping = J.prototype.HC = function () {
      return uq(this.kB);
    };
    J.prototype.set_m_angularDamping = J.prototype.yF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vq(c, a);
    };
    Object.defineProperty(J.prototype, "m_angularDamping", {
      get: J.prototype.HC,
      set: J.prototype.yF,
    });
    J.prototype.get_m_friction = J.prototype.kD = function () {
      return wq(this.kB);
    };
    J.prototype.set_m_friction = J.prototype.bG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xq(c, a);
    };
    Object.defineProperty(J.prototype, "m_friction", {
      get: J.prototype.kD,
      set: J.prototype.bG,
    });
    J.prototype.get_m_rollingFriction = J.prototype.dE = function () {
      return yq(this.kB);
    };
    J.prototype.set_m_rollingFriction = J.prototype.WG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zq(c, a);
    };
    Object.defineProperty(J.prototype, "m_rollingFriction", {
      get: J.prototype.dE,
      set: J.prototype.WG,
    });
    J.prototype.get_m_restitution = J.prototype.bE = function () {
      return Aq(this.kB);
    };
    J.prototype.set_m_restitution = J.prototype.UG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bq(c, a);
    };
    Object.defineProperty(J.prototype, "m_restitution", {
      get: J.prototype.bE,
      set: J.prototype.UG,
    });
    J.prototype.get_m_linearSleepingThreshold = J.prototype.ED = function () {
      return Cq(this.kB);
    };
    J.prototype.set_m_linearSleepingThreshold = J.prototype.vG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dq(c, a);
    };
    Object.defineProperty(J.prototype, "m_linearSleepingThreshold", {
      get: J.prototype.ED,
      set: J.prototype.vG,
    });
    J.prototype.get_m_angularSleepingThreshold = J.prototype.IC = function () {
      return Eq(this.kB);
    };
    J.prototype.set_m_angularSleepingThreshold = J.prototype.zF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fq(c, a);
    };
    Object.defineProperty(J.prototype, "m_angularSleepingThreshold", {
      get: J.prototype.IC,
      set: J.prototype.zF,
    });
    J.prototype.get_m_additionalDamping = J.prototype.CC = function () {
      return !!Gq(this.kB);
    };
    J.prototype.set_m_additionalDamping = J.prototype.tF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Hq(c, a);
    };
    Object.defineProperty(J.prototype, "m_additionalDamping", {
      get: J.prototype.CC,
      set: J.prototype.tF,
    });
    J.prototype.get_m_additionalDampingFactor = J.prototype.DC = function () {
      return Iq(this.kB);
    };
    J.prototype.set_m_additionalDampingFactor = J.prototype.uF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jq(c, a);
    };
    Object.defineProperty(J.prototype, "m_additionalDampingFactor", {
      get: J.prototype.DC,
      set: J.prototype.uF,
    });
    J.prototype.get_m_additionalLinearDampingThresholdSqr = J.prototype.EC =
      function () {
        return Kq(this.kB);
      };
    J.prototype.set_m_additionalLinearDampingThresholdSqr = J.prototype.vF =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        Lq(c, a);
      };
    Object.defineProperty(
      J.prototype,
      "m_additionalLinearDampingThresholdSqr",
      { get: J.prototype.EC, set: J.prototype.vF }
    );
    J.prototype.get_m_additionalAngularDampingThresholdSqr = J.prototype.BC =
      function () {
        return Mq(this.kB);
      };
    J.prototype.set_m_additionalAngularDampingThresholdSqr = J.prototype.sF =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        Nq(c, a);
      };
    Object.defineProperty(
      J.prototype,
      "m_additionalAngularDampingThresholdSqr",
      { get: J.prototype.BC, set: J.prototype.sF }
    );
    J.prototype.get_m_additionalAngularDampingFactor = J.prototype.AC =
      function () {
        return Oq(this.kB);
      };
    J.prototype.set_m_additionalAngularDampingFactor = J.prototype.rF =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        Pq(c, a);
      };
    Object.defineProperty(J.prototype, "m_additionalAngularDampingFactor", {
      get: J.prototype.AC,
      set: J.prototype.rF,
    });
    J.prototype.__destroy__ = function () {
      Qq(this.kB);
    };
    function K(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = Rq(a);
      h(K)[this.kB] = this;
    }
    K.prototype = Object.create(q.prototype);
    K.prototype.constructor = K;
    K.prototype.lB = K;
    K.mB = {};
    b.btRigidBody = K;
    K.prototype.getCenterOfMassTransform = function () {
      return k(Sq(this.kB), r);
    };
    K.prototype.setCenterOfMassTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tq(c, a);
    };
    K.prototype.setSleepingThresholds = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Uq(d, a, c);
    };
    K.prototype.getLinearDamping = function () {
      return Vq(this.kB);
    };
    K.prototype.getAngularDamping = function () {
      return Wq(this.kB);
    };
    K.prototype.setDamping = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Xq(d, a, c);
    };
    K.prototype.setMassProps = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Yq(d, a, c);
    };
    K.prototype.getLinearFactor = function () {
      return k(Zq(this.kB), m);
    };
    K.prototype.setLinearFactor = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $q(c, a);
    };
    K.prototype.applyTorque = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ar(c, a);
    };
    K.prototype.applyLocalTorque = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      br(c, a);
    };
    K.prototype.applyForce = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      cr(d, a, c);
    };
    K.prototype.applyCentralForce = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dr(c, a);
    };
    K.prototype.applyCentralLocalForce = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      er(c, a);
    };
    K.prototype.applyTorqueImpulse = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fr(c, a);
    };
    K.prototype.applyImpulse = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      gr(d, a, c);
    };
    K.prototype.applyCentralImpulse = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hr(c, a);
    };
    K.prototype.updateInertiaTensor = function () {
      ir(this.kB);
    };
    K.prototype.getLinearVelocity = function () {
      return k(jr(this.kB), m);
    };
    K.prototype.getAngularVelocity = function () {
      return k(kr(this.kB), m);
    };
    K.prototype.setLinearVelocity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lr(c, a);
    };
    K.prototype.setAngularVelocity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mr(c, a);
    };
    K.prototype.getMotionState = function () {
      return k(nr(this.kB), dE);
    };
    K.prototype.setMotionState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      or(c, a);
    };
    K.prototype.getAngularFactor = function () {
      return k(pr(this.kB), m);
    };
    K.prototype.setAngularFactor = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qr(c, a);
    };
    K.prototype.upcast = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(rr(c, a), K);
    };
    K.prototype.getAabb = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      sr(d, a, c);
    };
    K.prototype.applyGravity = function () {
      tr(this.kB);
    };
    K.prototype.getGravity = function () {
      return k(ur(this.kB), m);
    };
    K.prototype.setGravity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vr(c, a);
    };
    K.prototype.getBroadphaseProxy = function () {
      return k(wr(this.kB), YD);
    };
    K.prototype.clearForces = function () {
      xr(this.kB);
    };
    K.prototype.setFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yr(c, a);
    };
    K.prototype.getFlags = function () {
      return zr(this.kB);
    };
    K.prototype.setAnisotropicFriction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Ar(d, a, c);
    };
    K.prototype.getCollisionShape = function () {
      return k(Br(this.kB), l);
    };
    K.prototype.setContactProcessingThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cr(c, a);
    };
    K.prototype.setActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dr(c, a);
    };
    K.prototype.forceActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Er(c, a);
    };
    K.prototype.activate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      void 0 === a ? Fr(c) : Gr(c, a);
    };
    K.prototype.isActive = function () {
      return !!Hr(this.kB);
    };
    K.prototype.isKinematicObject = function () {
      return !!Ir(this.kB);
    };
    K.prototype.isStaticObject = function () {
      return !!Jr(this.kB);
    };
    K.prototype.isStaticOrKinematicObject = function () {
      return !!Kr(this.kB);
    };
    K.prototype.getRestitution = function () {
      return Lr(this.kB);
    };
    K.prototype.getFriction = function () {
      return Mr(this.kB);
    };
    K.prototype.getRollingFriction = function () {
      return Nr(this.kB);
    };
    K.prototype.setRestitution = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Or(c, a);
    };
    K.prototype.setFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pr(c, a);
    };
    K.prototype.setRollingFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qr(c, a);
    };
    K.prototype.getWorldTransform = function () {
      return k(Rr(this.kB), r);
    };
    K.prototype.getCollisionFlags = function () {
      return Sr(this.kB);
    };
    K.prototype.setCollisionFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tr(c, a);
    };
    K.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ur(c, a);
    };
    K.prototype.setCollisionShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vr(c, a);
    };
    K.prototype.setCcdMotionThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Wr(c, a);
    };
    K.prototype.setCcdSweptSphereRadius = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Xr(c, a);
    };
    K.prototype.getUserIndex = function () {
      return Yr(this.kB);
    };
    K.prototype.setUserIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zr(c, a);
    };
    K.prototype.getUserPointer = function () {
      return k($r(this.kB), XD);
    };
    K.prototype.setUserPointer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      as(c, a);
    };
    K.prototype.getBroadphaseHandle = function () {
      return k(bs(this.kB), YD);
    };
    K.prototype.__destroy__ = function () {
      cs(this.kB);
    };
    function L() {
      this.kB = ds();
      h(L)[this.kB] = this;
    }
    L.prototype = Object.create(f.prototype);
    L.prototype.constructor = L;
    L.prototype.lB = L;
    L.mB = {};
    b.btConstraintSetting = L;
    L.prototype.get_m_tau = L.prototype.sE = function () {
      return es(this.kB);
    };
    L.prototype.set_m_tau = L.prototype.kH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      gs(c, a);
    };
    Object.defineProperty(L.prototype, "m_tau", {
      get: L.prototype.sE,
      set: L.prototype.kH,
    });
    L.prototype.get_m_damping = L.prototype.aD = function () {
      return hs(this.kB);
    };
    L.prototype.set_m_damping = L.prototype.SF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      is(c, a);
    };
    Object.defineProperty(L.prototype, "m_damping", {
      get: L.prototype.aD,
      set: L.prototype.SF,
    });
    L.prototype.get_m_impulseClamp = L.prototype.wD = function () {
      return js(this.kB);
    };
    L.prototype.set_m_impulseClamp = L.prototype.nG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ks(c, a);
    };
    Object.defineProperty(L.prototype, "m_impulseClamp", {
      get: L.prototype.wD,
      set: L.prototype.nG,
    });
    L.prototype.__destroy__ = function () {
      ls(this.kB);
    };
    function pF(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB =
        void 0 === d
          ? ms(a, c)
          : void 0 === e
          ? _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(
              a,
              c,
              d
            )
          : ns(a, c, d, e);
      h(pF)[this.kB] = this;
    }
    pF.prototype = Object.create(aE.prototype);
    pF.prototype.constructor = pF;
    pF.prototype.lB = pF;
    pF.mB = {};
    b.btPoint2PointConstraint = pF;
    pF.prototype.setPivotA = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ps(c, a);
    };
    pF.prototype.setPivotB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qs(c, a);
    };
    pF.prototype.getPivotInA = function () {
      return k(rs(this.kB), m);
    };
    pF.prototype.getPivotInB = function () {
      return k(ss(this.kB), m);
    };
    pF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ts(c, a);
    };
    pF.prototype.getBreakingImpulseThreshold = function () {
      return us(this.kB);
    };
    pF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vs(c, a);
    };
    pF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return xs(d, a, c);
    };
    pF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      ys(e, a, c, d);
    };
    pF.prototype.get_m_setting = pF.prototype.fE = function () {
      return k(zs(this.kB), L);
    };
    pF.prototype.set_m_setting = pF.prototype.YG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      As(c, a);
    };
    Object.defineProperty(pF.prototype, "m_setting", {
      get: pF.prototype.fE,
      set: pF.prototype.YG,
    });
    pF.prototype.__destroy__ = function () {
      Bs(this.kB);
    };
    function qF(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB =
        void 0 === e
          ? Cs(a, c, d)
          : void 0 === g
          ? _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(
              a,
              c,
              d,
              e
            )
          : Ds(a, c, d, e, g);
      h(qF)[this.kB] = this;
    }
    qF.prototype = Object.create(pE.prototype);
    qF.prototype.constructor = qF;
    qF.prototype.lB = qF;
    qF.mB = {};
    b.btGeneric6DofSpringConstraint = qF;
    qF.prototype.enableSpring = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Es(d, a, c);
    };
    qF.prototype.setStiffness = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Fs(d, a, c);
    };
    qF.prototype.setDamping = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Gs(d, a, c);
    };
    qF.prototype.setEquilibriumPoint = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === a ? Hs(d) : void 0 === c ? Is(d, a) : Js(d, a, c);
    };
    qF.prototype.setLinearLowerLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ks(c, a);
    };
    qF.prototype.setLinearUpperLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ls(c, a);
    };
    qF.prototype.setAngularLowerLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ms(c, a);
    };
    qF.prototype.setAngularUpperLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ns(c, a);
    };
    qF.prototype.getFrameOffsetA = function () {
      return k(Os(this.kB), r);
    };
    qF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ps(c, a);
    };
    qF.prototype.getBreakingImpulseThreshold = function () {
      return Qs(this.kB);
    };
    qF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rs(c, a);
    };
    qF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return Ss(d, a, c);
    };
    qF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Ts(e, a, c, d);
    };
    qF.prototype.__destroy__ = function () {
      Us(this.kB);
    };
    function rF() {
      this.kB = Vs();
      h(rF)[this.kB] = this;
    }
    rF.prototype = Object.create(f.prototype);
    rF.prototype.constructor = rF;
    rF.prototype.lB = rF;
    rF.mB = {};
    b.btSequentialImpulseConstraintSolver = rF;
    rF.prototype.__destroy__ = function () {
      Ws(this.kB);
    };
    function sF(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB =
        void 0 === d
          ? Xs(a, c)
          : void 0 === e
          ? _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(
              a,
              c,
              d
            )
          : Ys(a, c, d, e);
      h(sF)[this.kB] = this;
    }
    sF.prototype = Object.create(aE.prototype);
    sF.prototype.constructor = sF;
    sF.prototype.lB = sF;
    sF.mB = {};
    b.btConeTwistConstraint = sF;
    sF.prototype.setLimit = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Zs(d, a, c);
    };
    sF.prototype.setAngularOnly = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $s(c, a);
    };
    sF.prototype.setDamping = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      at(c, a);
    };
    sF.prototype.enableMotor = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bt(c, a);
    };
    sF.prototype.setMaxMotorImpulse = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ct(c, a);
    };
    sF.prototype.setMaxMotorImpulseNormalized = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dt(c, a);
    };
    sF.prototype.setMotorTarget = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      et(c, a);
    };
    sF.prototype.setMotorTargetInConstraintSpace = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ft(c, a);
    };
    sF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      gt(c, a);
    };
    sF.prototype.getBreakingImpulseThreshold = function () {
      return ht(this.kB);
    };
    sF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      it(c, a);
    };
    sF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return jt(d, a, c);
    };
    sF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      kt(e, a, c, d);
    };
    sF.prototype.__destroy__ = function () {
      lt(this.kB);
    };
    function tF(a, c, d, e, g, n, z) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      this.kB =
        void 0 === d
          ? mt(a, c)
          : void 0 === e
          ? nt(a, c, d)
          : void 0 === g
          ? ot(a, c, d, e)
          : void 0 === n
          ? pt(a, c, d, e, g)
          : void 0 === z
          ? qt(a, c, d, e, g, n)
          : rt(a, c, d, e, g, n, z);
      h(tF)[this.kB] = this;
    }
    tF.prototype = Object.create(aE.prototype);
    tF.prototype.constructor = tF;
    tF.prototype.lB = tF;
    tF.mB = {};
    b.btHingeConstraint = tF;
    tF.prototype.getHingeAngle = function () {
      return st(this.kB);
    };
    tF.prototype.setLimit = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      void 0 === g ? tt(n, a, c, d, e) : ut(n, a, c, d, e, g);
    };
    tF.prototype.enableAngularMotor = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      vt(e, a, c, d);
    };
    tF.prototype.setAngularOnly = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wt(c, a);
    };
    tF.prototype.enableMotor = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xt(c, a);
    };
    tF.prototype.setMaxMotorImpulse = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yt(c, a);
    };
    tF.prototype.setMotorTarget = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      zt(d, a, c);
    };
    tF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      At(c, a);
    };
    tF.prototype.getBreakingImpulseThreshold = function () {
      return Bt(this.kB);
    };
    tF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ct(c, a);
    };
    tF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return Dt(d, a, c);
    };
    tF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Et(e, a, c, d);
    };
    tF.prototype.__destroy__ = function () {
      Ft(this.kB);
    };
    function uF(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB =
        void 0 === e
          ? Gt(a, c, d)
          : void 0 === g
          ? _emscripten_bind_btSliderConstraint_btSliderConstraint_4(a, c, d, e)
          : Ht(a, c, d, e, g);
      h(uF)[this.kB] = this;
    }
    uF.prototype = Object.create(aE.prototype);
    uF.prototype.constructor = uF;
    uF.prototype.lB = uF;
    uF.mB = {};
    b.btSliderConstraint = uF;
    uF.prototype.getLinearPos = function () {
      return It(this.kB);
    };
    uF.prototype.getAngularPos = function () {
      return Jt(this.kB);
    };
    uF.prototype.setLowerLinLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kt(c, a);
    };
    uF.prototype.setUpperLinLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lt(c, a);
    };
    uF.prototype.setLowerAngLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Mt(c, a);
    };
    uF.prototype.setUpperAngLimit = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nt(c, a);
    };
    uF.prototype.setPoweredLinMotor = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ot(c, a);
    };
    uF.prototype.setMaxLinMotorForce = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pt(c, a);
    };
    uF.prototype.setTargetLinMotorVelocity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qt(c, a);
    };
    uF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rt(c, a);
    };
    uF.prototype.getBreakingImpulseThreshold = function () {
      return St(this.kB);
    };
    uF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tt(c, a);
    };
    uF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return Ut(d, a, c);
    };
    uF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      Vt(e, a, c, d);
    };
    uF.prototype.__destroy__ = function () {
      Wt(this.kB);
    };
    function vF(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = Xt(a, c, d, e);
      h(vF)[this.kB] = this;
    }
    vF.prototype = Object.create(aE.prototype);
    vF.prototype.constructor = vF;
    vF.prototype.lB = vF;
    vF.mB = {};
    b.btFixedConstraint = vF;
    vF.prototype.enableFeedback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yt(c, a);
    };
    vF.prototype.getBreakingImpulseThreshold = function () {
      return Zt(this.kB);
    };
    vF.prototype.setBreakingImpulseThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $t(c, a);
    };
    vF.prototype.getParam = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return au(d, a, c);
    };
    vF.prototype.setParam = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      bu(e, a, c, d);
    };
    vF.prototype.__destroy__ = function () {
      cu(this.kB);
    };
    function wF() {
      throw "cannot construct a btConstraintSolver, no constructor in IDL";
    }
    wF.prototype = Object.create(f.prototype);
    wF.prototype.constructor = wF;
    wF.prototype.lB = wF;
    wF.mB = {};
    b.btConstraintSolver = wF;
    wF.prototype.__destroy__ = function () {
      du(this.kB);
    };
    function p() {
      throw "cannot construct a btDispatcherInfo, no constructor in IDL";
    }
    p.prototype = Object.create(f.prototype);
    p.prototype.constructor = p;
    p.prototype.lB = p;
    p.mB = {};
    b.btDispatcherInfo = p;
    p.prototype.get_m_timeStep = p.prototype.uE = function () {
      return eu(this.kB);
    };
    p.prototype.set_m_timeStep = p.prototype.mH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fu(c, a);
    };
    Object.defineProperty(p.prototype, "m_timeStep", {
      get: p.prototype.uE,
      set: p.prototype.mH,
    });
    p.prototype.get_m_stepCount = p.prototype.lE = function () {
      return gu(this.kB);
    };
    p.prototype.set_m_stepCount = p.prototype.dH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hu(c, a);
    };
    Object.defineProperty(p.prototype, "m_stepCount", {
      get: p.prototype.lE,
      set: p.prototype.dH,
    });
    p.prototype.get_m_dispatchFunc = p.prototype.cD = function () {
      return iu(this.kB);
    };
    p.prototype.set_m_dispatchFunc = p.prototype.UF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ju(c, a);
    };
    Object.defineProperty(p.prototype, "m_dispatchFunc", {
      get: p.prototype.cD,
      set: p.prototype.UF,
    });
    p.prototype.get_m_timeOfImpact = p.prototype.tE = function () {
      return ku(this.kB);
    };
    p.prototype.set_m_timeOfImpact = p.prototype.lH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lu(c, a);
    };
    Object.defineProperty(p.prototype, "m_timeOfImpact", {
      get: p.prototype.tE,
      set: p.prototype.lH,
    });
    p.prototype.get_m_useContinuous = p.prototype.wE = function () {
      return !!mu(this.kB);
    };
    p.prototype.set_m_useContinuous = p.prototype.oH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nu(c, a);
    };
    Object.defineProperty(p.prototype, "m_useContinuous", {
      get: p.prototype.wE,
      set: p.prototype.oH,
    });
    p.prototype.get_m_enableSatConvex = p.prototype.hD = function () {
      return !!ou(this.kB);
    };
    p.prototype.set_m_enableSatConvex = p.prototype.ZF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pu(c, a);
    };
    Object.defineProperty(p.prototype, "m_enableSatConvex", {
      get: p.prototype.hD,
      set: p.prototype.ZF,
    });
    p.prototype.get_m_enableSPU = p.prototype.gD = function () {
      return !!qu(this.kB);
    };
    p.prototype.set_m_enableSPU = p.prototype.YF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ru(c, a);
    };
    Object.defineProperty(p.prototype, "m_enableSPU", {
      get: p.prototype.gD,
      set: p.prototype.YF,
    });
    p.prototype.get_m_useEpa = p.prototype.yE = function () {
      return !!su(this.kB);
    };
    p.prototype.set_m_useEpa = p.prototype.qH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tu(c, a);
    };
    Object.defineProperty(p.prototype, "m_useEpa", {
      get: p.prototype.yE,
      set: p.prototype.qH,
    });
    p.prototype.get_m_allowedCcdPenetration = p.prototype.FC = function () {
      return uu(this.kB);
    };
    p.prototype.set_m_allowedCcdPenetration = p.prototype.wF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vu(c, a);
    };
    Object.defineProperty(p.prototype, "m_allowedCcdPenetration", {
      get: p.prototype.FC,
      set: p.prototype.wF,
    });
    p.prototype.get_m_useConvexConservativeDistanceUtil = p.prototype.xE =
      function () {
        return !!wu(this.kB);
      };
    p.prototype.set_m_useConvexConservativeDistanceUtil = p.prototype.pH =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        xu(c, a);
      };
    Object.defineProperty(p.prototype, "m_useConvexConservativeDistanceUtil", {
      get: p.prototype.xE,
      set: p.prototype.pH,
    });
    p.prototype.get_m_convexConservativeDistanceThreshold = p.prototype.YC =
      function () {
        return yu(this.kB);
      };
    p.prototype.set_m_convexConservativeDistanceThreshold = p.prototype.PF =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        zu(c, a);
      };
    Object.defineProperty(
      p.prototype,
      "m_convexConservativeDistanceThreshold",
      { get: p.prototype.YC, set: p.prototype.PF }
    );
    p.prototype.__destroy__ = function () {
      Au(this.kB);
    };
    function t() {
      throw "cannot construct a btContactSolverInfo, no constructor in IDL";
    }
    t.prototype = Object.create(f.prototype);
    t.prototype.constructor = t;
    t.prototype.lB = t;
    t.mB = {};
    b.btContactSolverInfo = t;
    t.prototype.get_m_splitImpulse = t.prototype.iE = function () {
      return !!Bu(this.kB);
    };
    t.prototype.set_m_splitImpulse = t.prototype.aH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cu(c, a);
    };
    Object.defineProperty(t.prototype, "m_splitImpulse", {
      get: t.prototype.iE,
      set: t.prototype.aH,
    });
    t.prototype.get_m_splitImpulsePenetrationThreshold = t.prototype.jE =
      function () {
        return Du(this.kB);
      };
    t.prototype.set_m_splitImpulsePenetrationThreshold = t.prototype.bH =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        Eu(c, a);
      };
    Object.defineProperty(t.prototype, "m_splitImpulsePenetrationThreshold", {
      get: t.prototype.jE,
      set: t.prototype.bH,
    });
    t.prototype.get_m_numIterations = t.prototype.TD = function () {
      return Fu(this.kB);
    };
    t.prototype.set_m_numIterations = t.prototype.KG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Gu(c, a);
    };
    Object.defineProperty(t.prototype, "m_numIterations", {
      get: t.prototype.TD,
      set: t.prototype.KG,
    });
    t.prototype.__destroy__ = function () {
      Hu(this.kB);
    };
    function M() {
      this.kB = Iu();
      h(M)[this.kB] = this;
    }
    M.prototype = Object.create(f.prototype);
    M.prototype.constructor = M;
    M.prototype.lB = M;
    M.mB = {};
    b.btVehicleTuning = M;
    M.prototype.get_m_suspensionStiffness = M.prototype.BB = function () {
      return Ju(this.kB);
    };
    M.prototype.set_m_suspensionStiffness = M.prototype.IB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ku(c, a);
    };
    Object.defineProperty(M.prototype, "m_suspensionStiffness", {
      get: M.prototype.BB,
      set: M.prototype.IB,
    });
    M.prototype.get_m_suspensionCompression = M.prototype.mE = function () {
      return Lu(this.kB);
    };
    M.prototype.set_m_suspensionCompression = M.prototype.eH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Mu(c, a);
    };
    Object.defineProperty(M.prototype, "m_suspensionCompression", {
      get: M.prototype.mE,
      set: M.prototype.eH,
    });
    M.prototype.get_m_suspensionDamping = M.prototype.nE = function () {
      return Nu(this.kB);
    };
    M.prototype.set_m_suspensionDamping = M.prototype.fH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ou(c, a);
    };
    Object.defineProperty(M.prototype, "m_suspensionDamping", {
      get: M.prototype.nE,
      set: M.prototype.fH,
    });
    M.prototype.get_m_maxSuspensionTravelCm = M.prototype.AB = function () {
      return Pu(this.kB);
    };
    M.prototype.set_m_maxSuspensionTravelCm = M.prototype.HB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qu(c, a);
    };
    Object.defineProperty(M.prototype, "m_maxSuspensionTravelCm", {
      get: M.prototype.AB,
      set: M.prototype.HB,
    });
    M.prototype.get_m_frictionSlip = M.prototype.wB = function () {
      return Ru(this.kB);
    };
    M.prototype.set_m_frictionSlip = M.prototype.DB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Su(c, a);
    };
    Object.defineProperty(M.prototype, "m_frictionSlip", {
      get: M.prototype.wB,
      set: M.prototype.DB,
    });
    M.prototype.get_m_maxSuspensionForce = M.prototype.zB = function () {
      return Tu(this.kB);
    };
    M.prototype.set_m_maxSuspensionForce = M.prototype.GB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Uu(c, a);
    };
    Object.defineProperty(M.prototype, "m_maxSuspensionForce", {
      get: M.prototype.zB,
      set: M.prototype.GB,
    });
    function xF() {
      throw "cannot construct a btVehicleRaycasterResult, no constructor in IDL";
    }
    xF.prototype = Object.create(f.prototype);
    xF.prototype.constructor = xF;
    xF.prototype.lB = xF;
    xF.mB = {};
    b.btVehicleRaycasterResult = xF;
    xF.prototype.get_m_hitPointInWorld = xF.prototype.tD = function () {
      return k(Vu(this.kB), m);
    };
    xF.prototype.set_m_hitPointInWorld = xF.prototype.kG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Wu(c, a);
    };
    Object.defineProperty(xF.prototype, "m_hitPointInWorld", {
      get: xF.prototype.tD,
      set: xF.prototype.kG,
    });
    xF.prototype.get_m_hitNormalInWorld = xF.prototype.rD = function () {
      return k(Xu(this.kB), m);
    };
    xF.prototype.set_m_hitNormalInWorld = xF.prototype.iG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yu(c, a);
    };
    Object.defineProperty(xF.prototype, "m_hitNormalInWorld", {
      get: xF.prototype.rD,
      set: xF.prototype.iG,
    });
    xF.prototype.get_m_distFraction = xF.prototype.fD = function () {
      return Zu(this.kB);
    };
    xF.prototype.set_m_distFraction = xF.prototype.XF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $u(c, a);
    };
    Object.defineProperty(xF.prototype, "m_distFraction", {
      get: xF.prototype.fD,
      set: xF.prototype.XF,
    });
    xF.prototype.__destroy__ = function () {
      av(this.kB);
    };
    function yF(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = bv(a);
      h(yF)[this.kB] = this;
    }
    yF.prototype = Object.create(qE.prototype);
    yF.prototype.constructor = yF;
    yF.prototype.lB = yF;
    yF.mB = {};
    b.btDefaultVehicleRaycaster = yF;
    yF.prototype.castRay = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      cv(e, a, c, d);
    };
    yF.prototype.__destroy__ = function () {
      dv(this.kB);
    };
    function N() {
      throw "cannot construct a RaycastInfo, no constructor in IDL";
    }
    N.prototype = Object.create(f.prototype);
    N.prototype.constructor = N;
    N.prototype.lB = N;
    N.mB = {};
    b.RaycastInfo = N;
    N.prototype.get_m_contactNormalWS = N.prototype.WC = function () {
      return k(ev(this.kB), m);
    };
    N.prototype.set_m_contactNormalWS = N.prototype.NF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fv(c, a);
    };
    Object.defineProperty(N.prototype, "m_contactNormalWS", {
      get: N.prototype.WC,
      set: N.prototype.NF,
    });
    N.prototype.get_m_contactPointWS = N.prototype.XC = function () {
      return k(gv(this.kB), m);
    };
    N.prototype.set_m_contactPointWS = N.prototype.OF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hv(c, a);
    };
    Object.defineProperty(N.prototype, "m_contactPointWS", {
      get: N.prototype.XC,
      set: N.prototype.OF,
    });
    N.prototype.get_m_suspensionLength = N.prototype.oE = function () {
      return iv(this.kB);
    };
    N.prototype.set_m_suspensionLength = N.prototype.gH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jv(c, a);
    };
    Object.defineProperty(N.prototype, "m_suspensionLength", {
      get: N.prototype.oE,
      set: N.prototype.gH,
    });
    N.prototype.get_m_hardPointWS = N.prototype.oD = function () {
      return k(kv(this.kB), m);
    };
    N.prototype.set_m_hardPointWS = N.prototype.fG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lv(c, a);
    };
    Object.defineProperty(N.prototype, "m_hardPointWS", {
      get: N.prototype.oD,
      set: N.prototype.fG,
    });
    N.prototype.get_m_wheelDirectionWS = N.prototype.DE = function () {
      return k(mv(this.kB), m);
    };
    N.prototype.set_m_wheelDirectionWS = N.prototype.vH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nv(c, a);
    };
    Object.defineProperty(N.prototype, "m_wheelDirectionWS", {
      get: N.prototype.DE,
      set: N.prototype.vH,
    });
    N.prototype.get_m_wheelAxleWS = N.prototype.CE = function () {
      return k(ov(this.kB), m);
    };
    N.prototype.set_m_wheelAxleWS = N.prototype.uH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pv(c, a);
    };
    Object.defineProperty(N.prototype, "m_wheelAxleWS", {
      get: N.prototype.CE,
      set: N.prototype.uH,
    });
    N.prototype.get_m_isInContact = N.prototype.zD = function () {
      return !!qv(this.kB);
    };
    N.prototype.set_m_isInContact = N.prototype.qG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rv(c, a);
    };
    Object.defineProperty(N.prototype, "m_isInContact", {
      get: N.prototype.zD,
      set: N.prototype.qG,
    });
    N.prototype.get_m_groundObject = N.prototype.nD = function () {
      return sv(this.kB);
    };
    N.prototype.set_m_groundObject = N.prototype.eG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tv(c, a);
    };
    Object.defineProperty(N.prototype, "m_groundObject", {
      get: N.prototype.nD,
      set: N.prototype.eG,
    });
    N.prototype.__destroy__ = function () {
      uv(this.kB);
    };
    function O() {
      throw "cannot construct a btWheelInfoConstructionInfo, no constructor in IDL";
    }
    O.prototype = Object.create(f.prototype);
    O.prototype.constructor = O;
    O.prototype.lB = O;
    O.mB = {};
    b.btWheelInfoConstructionInfo = O;
    O.prototype.get_m_chassisConnectionCS = O.prototype.RC = function () {
      return k(vv(this.kB), m);
    };
    O.prototype.set_m_chassisConnectionCS = O.prototype.IF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wv(c, a);
    };
    Object.defineProperty(O.prototype, "m_chassisConnectionCS", {
      get: O.prototype.RC,
      set: O.prototype.IF,
    });
    O.prototype.get_m_wheelDirectionCS = O.prototype.QB = function () {
      return k(xv(this.kB), m);
    };
    O.prototype.set_m_wheelDirectionCS = O.prototype.$B = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yv(c, a);
    };
    Object.defineProperty(O.prototype, "m_wheelDirectionCS", {
      get: O.prototype.QB,
      set: O.prototype.$B,
    });
    O.prototype.get_m_wheelAxleCS = O.prototype.PB = function () {
      return k(zv(this.kB), m);
    };
    O.prototype.set_m_wheelAxleCS = O.prototype.ZB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Av(c, a);
    };
    Object.defineProperty(O.prototype, "m_wheelAxleCS", {
      get: O.prototype.PB,
      set: O.prototype.ZB,
    });
    O.prototype.get_m_suspensionRestLength = O.prototype.qE = function () {
      return Bv(this.kB);
    };
    O.prototype.set_m_suspensionRestLength = O.prototype.iH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Cv(c, a);
    };
    Object.defineProperty(O.prototype, "m_suspensionRestLength", {
      get: O.prototype.qE,
      set: O.prototype.iH,
    });
    O.prototype.get_m_maxSuspensionTravelCm = O.prototype.AB = function () {
      return Dv(this.kB);
    };
    O.prototype.set_m_maxSuspensionTravelCm = O.prototype.HB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ev(c, a);
    };
    Object.defineProperty(O.prototype, "m_maxSuspensionTravelCm", {
      get: O.prototype.AB,
      set: O.prototype.HB,
    });
    O.prototype.get_m_wheelRadius = O.prototype.EE = function () {
      return Fv(this.kB);
    };
    O.prototype.set_m_wheelRadius = O.prototype.wH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Gv(c, a);
    };
    Object.defineProperty(O.prototype, "m_wheelRadius", {
      get: O.prototype.EE,
      set: O.prototype.wH,
    });
    O.prototype.get_m_suspensionStiffness = O.prototype.BB = function () {
      return Hv(this.kB);
    };
    O.prototype.set_m_suspensionStiffness = O.prototype.IB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Iv(c, a);
    };
    Object.defineProperty(O.prototype, "m_suspensionStiffness", {
      get: O.prototype.BB,
      set: O.prototype.IB,
    });
    O.prototype.get_m_wheelsDampingCompression = O.prototype.RB = function () {
      return Jv(this.kB);
    };
    O.prototype.set_m_wheelsDampingCompression = O.prototype.aC = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kv(c, a);
    };
    Object.defineProperty(O.prototype, "m_wheelsDampingCompression", {
      get: O.prototype.RB,
      set: O.prototype.aC,
    });
    O.prototype.get_m_wheelsDampingRelaxation = O.prototype.SB = function () {
      return Lv(this.kB);
    };
    O.prototype.set_m_wheelsDampingRelaxation = O.prototype.bC = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Mv(c, a);
    };
    Object.defineProperty(O.prototype, "m_wheelsDampingRelaxation", {
      get: O.prototype.SB,
      set: O.prototype.bC,
    });
    O.prototype.get_m_frictionSlip = O.prototype.wB = function () {
      return Nv(this.kB);
    };
    O.prototype.set_m_frictionSlip = O.prototype.DB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ov(c, a);
    };
    Object.defineProperty(O.prototype, "m_frictionSlip", {
      get: O.prototype.wB,
      set: O.prototype.DB,
    });
    O.prototype.get_m_maxSuspensionForce = O.prototype.zB = function () {
      return Pv(this.kB);
    };
    O.prototype.set_m_maxSuspensionForce = O.prototype.GB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qv(c, a);
    };
    Object.defineProperty(O.prototype, "m_maxSuspensionForce", {
      get: O.prototype.zB,
      set: O.prototype.GB,
    });
    O.prototype.get_m_bIsFrontWheel = O.prototype.JB = function () {
      return !!Rv(this.kB);
    };
    O.prototype.set_m_bIsFrontWheel = O.prototype.TB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Sv(c, a);
    };
    Object.defineProperty(O.prototype, "m_bIsFrontWheel", {
      get: O.prototype.JB,
      set: O.prototype.TB,
    });
    O.prototype.__destroy__ = function () {
      Tv(this.kB);
    };
    function P(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = Uv(a);
      h(P)[this.kB] = this;
    }
    P.prototype = Object.create(f.prototype);
    P.prototype.constructor = P;
    P.prototype.lB = P;
    P.mB = {};
    b.btWheelInfo = P;
    P.prototype.getSuspensionRestLength = function () {
      return Vv(this.kB);
    };
    P.prototype.updateWheel = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Wv(d, a, c);
    };
    P.prototype.get_m_suspensionStiffness = P.prototype.BB = function () {
      return Xv(this.kB);
    };
    P.prototype.set_m_suspensionStiffness = P.prototype.IB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yv(c, a);
    };
    Object.defineProperty(P.prototype, "m_suspensionStiffness", {
      get: P.prototype.BB,
      set: P.prototype.IB,
    });
    P.prototype.get_m_frictionSlip = P.prototype.wB = function () {
      return Zv(this.kB);
    };
    P.prototype.set_m_frictionSlip = P.prototype.DB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $v(c, a);
    };
    Object.defineProperty(P.prototype, "m_frictionSlip", {
      get: P.prototype.wB,
      set: P.prototype.DB,
    });
    P.prototype.get_m_engineForce = P.prototype.iD = function () {
      return aw(this.kB);
    };
    P.prototype.set_m_engineForce = P.prototype.$F = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bw(c, a);
    };
    Object.defineProperty(P.prototype, "m_engineForce", {
      get: P.prototype.iD,
      set: P.prototype.$F,
    });
    P.prototype.get_m_rollInfluence = P.prototype.cE = function () {
      return cw(this.kB);
    };
    P.prototype.set_m_rollInfluence = P.prototype.VG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dw(c, a);
    };
    Object.defineProperty(P.prototype, "m_rollInfluence", {
      get: P.prototype.cE,
      set: P.prototype.VG,
    });
    P.prototype.get_m_suspensionRestLength1 = P.prototype.rE = function () {
      return ew(this.kB);
    };
    P.prototype.set_m_suspensionRestLength1 = P.prototype.jH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fw(c, a);
    };
    Object.defineProperty(P.prototype, "m_suspensionRestLength1", {
      get: P.prototype.rE,
      set: P.prototype.jH,
    });
    P.prototype.get_m_wheelsRadius = P.prototype.FE = function () {
      return gw(this.kB);
    };
    P.prototype.set_m_wheelsRadius = P.prototype.xH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelsRadius", {
      get: P.prototype.FE,
      set: P.prototype.xH,
    });
    P.prototype.get_m_wheelsDampingCompression = P.prototype.RB = function () {
      return iw(this.kB);
    };
    P.prototype.set_m_wheelsDampingCompression = P.prototype.aC = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelsDampingCompression", {
      get: P.prototype.RB,
      set: P.prototype.aC,
    });
    P.prototype.get_m_wheelsDampingRelaxation = P.prototype.SB = function () {
      return kw(this.kB);
    };
    P.prototype.set_m_wheelsDampingRelaxation = P.prototype.bC = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelsDampingRelaxation", {
      get: P.prototype.SB,
      set: P.prototype.bC,
    });
    P.prototype.get_m_steering = P.prototype.kE = function () {
      return mw(this.kB);
    };
    P.prototype.set_m_steering = P.prototype.cH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nw(c, a);
    };
    Object.defineProperty(P.prototype, "m_steering", {
      get: P.prototype.kE,
      set: P.prototype.cH,
    });
    P.prototype.get_m_maxSuspensionForce = P.prototype.zB = function () {
      return ow(this.kB);
    };
    P.prototype.set_m_maxSuspensionForce = P.prototype.GB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pw(c, a);
    };
    Object.defineProperty(P.prototype, "m_maxSuspensionForce", {
      get: P.prototype.zB,
      set: P.prototype.GB,
    });
    P.prototype.get_m_maxSuspensionTravelCm = P.prototype.AB = function () {
      return qw(this.kB);
    };
    P.prototype.set_m_maxSuspensionTravelCm = P.prototype.HB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rw(c, a);
    };
    Object.defineProperty(P.prototype, "m_maxSuspensionTravelCm", {
      get: P.prototype.AB,
      set: P.prototype.HB,
    });
    P.prototype.get_m_wheelsSuspensionForce = P.prototype.GE = function () {
      return sw(this.kB);
    };
    P.prototype.set_m_wheelsSuspensionForce = P.prototype.yH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelsSuspensionForce", {
      get: P.prototype.GE,
      set: P.prototype.yH,
    });
    P.prototype.get_m_bIsFrontWheel = P.prototype.JB = function () {
      return !!uw(this.kB);
    };
    P.prototype.set_m_bIsFrontWheel = P.prototype.TB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vw(c, a);
    };
    Object.defineProperty(P.prototype, "m_bIsFrontWheel", {
      get: P.prototype.JB,
      set: P.prototype.TB,
    });
    P.prototype.get_m_raycastInfo = P.prototype.aE = function () {
      return k(ww(this.kB), N);
    };
    P.prototype.set_m_raycastInfo = P.prototype.TG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xw(c, a);
    };
    Object.defineProperty(P.prototype, "m_raycastInfo", {
      get: P.prototype.aE,
      set: P.prototype.TG,
    });
    P.prototype.get_m_chassisConnectionPointCS = P.prototype.SC = function () {
      return k(yw(this.kB), m);
    };
    P.prototype.set_m_chassisConnectionPointCS = P.prototype.JF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zw(c, a);
    };
    Object.defineProperty(P.prototype, "m_chassisConnectionPointCS", {
      get: P.prototype.SC,
      set: P.prototype.JF,
    });
    P.prototype.get_m_worldTransform = P.prototype.HE = function () {
      return k(Aw(this.kB), r);
    };
    P.prototype.set_m_worldTransform = P.prototype.zH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bw(c, a);
    };
    Object.defineProperty(P.prototype, "m_worldTransform", {
      get: P.prototype.HE,
      set: P.prototype.zH,
    });
    P.prototype.get_m_wheelDirectionCS = P.prototype.QB = function () {
      return k(Cw(this.kB), m);
    };
    P.prototype.set_m_wheelDirectionCS = P.prototype.$B = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelDirectionCS", {
      get: P.prototype.QB,
      set: P.prototype.$B,
    });
    P.prototype.get_m_wheelAxleCS = P.prototype.PB = function () {
      return k(Ew(this.kB), m);
    };
    P.prototype.set_m_wheelAxleCS = P.prototype.ZB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fw(c, a);
    };
    Object.defineProperty(P.prototype, "m_wheelAxleCS", {
      get: P.prototype.PB,
      set: P.prototype.ZB,
    });
    P.prototype.get_m_rotation = P.prototype.eE = function () {
      return Gw(this.kB);
    };
    P.prototype.set_m_rotation = P.prototype.XG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Hw(c, a);
    };
    Object.defineProperty(P.prototype, "m_rotation", {
      get: P.prototype.eE,
      set: P.prototype.XG,
    });
    P.prototype.get_m_deltaRotation = P.prototype.bD = function () {
      return Iw(this.kB);
    };
    P.prototype.set_m_deltaRotation = P.prototype.TF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jw(c, a);
    };
    Object.defineProperty(P.prototype, "m_deltaRotation", {
      get: P.prototype.bD,
      set: P.prototype.TF,
    });
    P.prototype.get_m_brake = P.prototype.LC = function () {
      return Kw(this.kB);
    };
    P.prototype.set_m_brake = P.prototype.CF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lw(c, a);
    };
    Object.defineProperty(P.prototype, "m_brake", {
      get: P.prototype.LC,
      set: P.prototype.CF,
    });
    P.prototype.get_m_clippedInvContactDotSuspension = P.prototype.TC =
      function () {
        return Mw(this.kB);
      };
    P.prototype.set_m_clippedInvContactDotSuspension = P.prototype.KF =
      function (a) {
        var c = this.kB;
        a && "object" === typeof a && (a = a.kB);
        Nw(c, a);
      };
    Object.defineProperty(P.prototype, "m_clippedInvContactDotSuspension", {
      get: P.prototype.TC,
      set: P.prototype.KF,
    });
    P.prototype.get_m_suspensionRelativeVelocity = P.prototype.pE =
      function () {
        return Ow(this.kB);
      };
    P.prototype.set_m_suspensionRelativeVelocity = P.prototype.hH = function (
      a
    ) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pw(c, a);
    };
    Object.defineProperty(P.prototype, "m_suspensionRelativeVelocity", {
      get: P.prototype.pE,
      set: P.prototype.hH,
    });
    P.prototype.get_m_skidInfo = P.prototype.hE = function () {
      return Qw(this.kB);
    };
    P.prototype.set_m_skidInfo = P.prototype.$G = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rw(c, a);
    };
    Object.defineProperty(P.prototype, "m_skidInfo", {
      get: P.prototype.hE,
      set: P.prototype.$G,
    });
    P.prototype.__destroy__ = function () {
      Sw(this.kB);
    };
    function zF(a, c, d, e) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      this.kB = void 0 === e ? Tw(a, c, d) : Uw(a, c, d, e);
      h(zF)[this.kB] = this;
    }
    zF.prototype = Object.create(rE.prototype);
    zF.prototype.constructor = zF;
    zF.prototype.lB = zF;
    zF.mB = {};
    b.btKinematicCharacterController = zF;
    zF.prototype.setUpAxis = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vw(c, a);
    };
    zF.prototype.setWalkDirection = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ww(c, a);
    };
    zF.prototype.setVelocityForTimeInterval = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Xw(d, a, c);
    };
    zF.prototype.warp = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yw(c, a);
    };
    zF.prototype.preStep = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zw(c, a);
    };
    zF.prototype.playerStep = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      $w(d, a, c);
    };
    zF.prototype.setFallSpeed = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ax(c, a);
    };
    zF.prototype.setJumpSpeed = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bx(c, a);
    };
    zF.prototype.setMaxJumpHeight = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cx(c, a);
    };
    zF.prototype.canJump = function () {
      return !!dx(this.kB);
    };
    zF.prototype.jump = function () {
      ex(this.kB);
    };
    zF.prototype.setGravity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fx(c, a);
    };
    zF.prototype.getGravity = function () {
      return gx(this.kB);
    };
    zF.prototype.setMaxSlope = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hx(c, a);
    };
    zF.prototype.getMaxSlope = function () {
      return ix(this.kB);
    };
    zF.prototype.getGhostObject = function () {
      return k(jx(this.kB), Q);
    };
    zF.prototype.setUseGhostSweepTest = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kx(c, a);
    };
    zF.prototype.onGround = function () {
      return !!lx(this.kB);
    };
    zF.prototype.setUpInterpolate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      mx(c, a);
    };
    zF.prototype.updateAction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      nx(d, a, c);
    };
    zF.prototype.__destroy__ = function () {
      ox(this.kB);
    };
    function R(a, c, d) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      this.kB = px(a, c, d);
      h(R)[this.kB] = this;
    }
    R.prototype = Object.create(rE.prototype);
    R.prototype.constructor = R;
    R.prototype.lB = R;
    R.mB = {};
    b.btRaycastVehicle = R;
    R.prototype.applyEngineForce = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      qx(d, a, c);
    };
    R.prototype.setSteeringValue = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      rx(d, a, c);
    };
    R.prototype.getWheelTransformWS = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(sx(c, a), r);
    };
    R.prototype.updateWheelTransform = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      tx(d, a, c);
    };
    R.prototype.addWheel = function (a, c, d, e, g, n, z) {
      var T = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      return k(ux(T, a, c, d, e, g, n, z), P);
    };
    R.prototype.getNumWheels = function () {
      return vx(this.kB);
    };
    R.prototype.getRigidBody = function () {
      return k(wx(this.kB), K);
    };
    R.prototype.getWheelInfo = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(xx(c, a), P);
    };
    R.prototype.setBrake = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      yx(d, a, c);
    };
    R.prototype.setCoordinateSystem = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      zx(e, a, c, d);
    };
    R.prototype.getCurrentSpeedKmHour = function () {
      return Ax(this.kB);
    };
    R.prototype.getChassisWorldTransform = function () {
      return k(Bx(this.kB), r);
    };
    R.prototype.rayCast = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return Cx(c, a);
    };
    R.prototype.updateVehicle = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dx(c, a);
    };
    R.prototype.resetSuspension = function () {
      Ex(this.kB);
    };
    R.prototype.getSteeringValue = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return Fx(c, a);
    };
    R.prototype.updateWheelTransformsWS = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === c ? Gx(d, a) : Hx(d, a, c);
    };
    R.prototype.setPitchControl = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ix(c, a);
    };
    R.prototype.updateSuspension = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jx(c, a);
    };
    R.prototype.updateFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Kx(c, a);
    };
    R.prototype.getRightAxis = function () {
      return Lx(this.kB);
    };
    R.prototype.getUpAxis = function () {
      return Mx(this.kB);
    };
    R.prototype.getForwardAxis = function () {
      return Nx(this.kB);
    };
    R.prototype.getForwardVector = function () {
      return k(Ox(this.kB), m);
    };
    R.prototype.getUserConstraintType = function () {
      return Px(this.kB);
    };
    R.prototype.setUserConstraintType = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Qx(c, a);
    };
    R.prototype.setUserConstraintId = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rx(c, a);
    };
    R.prototype.getUserConstraintId = function () {
      return Sx(this.kB);
    };
    R.prototype.updateAction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Tx(d, a, c);
    };
    R.prototype.__destroy__ = function () {
      Ux(this.kB);
    };
    function Q() {
      this.kB = Vx();
      h(Q)[this.kB] = this;
    }
    Q.prototype = Object.create(y.prototype);
    Q.prototype.constructor = Q;
    Q.prototype.lB = Q;
    Q.mB = {};
    b.btPairCachingGhostObject = Q;
    Q.prototype.setAnisotropicFriction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Wx(d, a, c);
    };
    Q.prototype.getCollisionShape = function () {
      return k(Xx(this.kB), l);
    };
    Q.prototype.setContactProcessingThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yx(c, a);
    };
    Q.prototype.setActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Zx(c, a);
    };
    Q.prototype.forceActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $x(c, a);
    };
    Q.prototype.activate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      void 0 === a ? ay(c) : by(c, a);
    };
    Q.prototype.isActive = function () {
      return !!cy(this.kB);
    };
    Q.prototype.isKinematicObject = function () {
      return !!dy(this.kB);
    };
    Q.prototype.isStaticObject = function () {
      return !!ey(this.kB);
    };
    Q.prototype.isStaticOrKinematicObject = function () {
      return !!fy(this.kB);
    };
    Q.prototype.getRestitution = function () {
      return gy(this.kB);
    };
    Q.prototype.getFriction = function () {
      return hy(this.kB);
    };
    Q.prototype.getRollingFriction = function () {
      return iy(this.kB);
    };
    Q.prototype.setRestitution = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jy(c, a);
    };
    Q.prototype.setFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ky(c, a);
    };
    Q.prototype.setRollingFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ly(c, a);
    };
    Q.prototype.getWorldTransform = function () {
      return k(my(this.kB), r);
    };
    Q.prototype.getCollisionFlags = function () {
      return ny(this.kB);
    };
    Q.prototype.setCollisionFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      oy(c, a);
    };
    Q.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      py(c, a);
    };
    Q.prototype.setCollisionShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qy(c, a);
    };
    Q.prototype.setCcdMotionThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ry(c, a);
    };
    Q.prototype.setCcdSweptSphereRadius = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      sy(c, a);
    };
    Q.prototype.getUserIndex = function () {
      return ty(this.kB);
    };
    Q.prototype.setUserIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      uy(c, a);
    };
    Q.prototype.getUserPointer = function () {
      return k(vy(this.kB), XD);
    };
    Q.prototype.setUserPointer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wy(c, a);
    };
    Q.prototype.getBroadphaseHandle = function () {
      return k(xy(this.kB), YD);
    };
    Q.prototype.getNumOverlappingObjects = function () {
      return yy(this.kB);
    };
    Q.prototype.getOverlappingObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(zy(c, a), q);
    };
    Q.prototype.__destroy__ = function () {
      Ay(this.kB);
    };
    function AF() {
      this.kB = By();
      h(AF)[this.kB] = this;
    }
    AF.prototype = Object.create(f.prototype);
    AF.prototype.constructor = AF;
    AF.prototype.lB = AF;
    AF.mB = {};
    b.btGhostPairCallback = AF;
    AF.prototype.__destroy__ = function () {
      Cy(this.kB);
    };
    function S() {
      this.kB = Dy();
      h(S)[this.kB] = this;
    }
    S.prototype = Object.create(f.prototype);
    S.prototype.constructor = S;
    S.prototype.lB = S;
    S.mB = {};
    b.btSoftBodyWorldInfo = S;
    S.prototype.get_air_density = S.prototype.cC = function () {
      return Ey(this.kB);
    };
    S.prototype.set_air_density = S.prototype.UE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Fy(c, a);
    };
    Object.defineProperty(S.prototype, "air_density", {
      get: S.prototype.cC,
      set: S.prototype.UE,
    });
    S.prototype.get_water_density = S.prototype.RE = function () {
      return Gy(this.kB);
    };
    S.prototype.set_water_density = S.prototype.JH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Hy(c, a);
    };
    Object.defineProperty(S.prototype, "water_density", {
      get: S.prototype.RE,
      set: S.prototype.JH,
    });
    S.prototype.get_water_offset = S.prototype.TE = function () {
      return Iy(this.kB);
    };
    S.prototype.set_water_offset = S.prototype.LH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jy(c, a);
    };
    Object.defineProperty(S.prototype, "water_offset", {
      get: S.prototype.TE,
      set: S.prototype.LH,
    });
    S.prototype.get_m_maxDisplacement = S.prototype.ND = function () {
      return Ky(this.kB);
    };
    S.prototype.set_m_maxDisplacement = S.prototype.EG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ly(c, a);
    };
    Object.defineProperty(S.prototype, "m_maxDisplacement", {
      get: S.prototype.ND,
      set: S.prototype.EG,
    });
    S.prototype.get_water_normal = S.prototype.SE = function () {
      return k(My(this.kB), m);
    };
    S.prototype.set_water_normal = S.prototype.KH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ny(c, a);
    };
    Object.defineProperty(S.prototype, "water_normal", {
      get: S.prototype.SE,
      set: S.prototype.KH,
    });
    S.prototype.get_m_broadphase = S.prototype.MC = function () {
      return k(Oy(this.kB), VD);
    };
    S.prototype.set_m_broadphase = S.prototype.DF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Py(c, a);
    };
    Object.defineProperty(S.prototype, "m_broadphase", {
      get: S.prototype.MC,
      set: S.prototype.DF,
    });
    S.prototype.get_m_dispatcher = S.prototype.dD = function () {
      return k(Qy(this.kB), TD);
    };
    S.prototype.set_m_dispatcher = S.prototype.VF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ry(c, a);
    };
    Object.defineProperty(S.prototype, "m_dispatcher", {
      get: S.prototype.dD,
      set: S.prototype.VF,
    });
    S.prototype.get_m_gravity = S.prototype.mD = function () {
      return k(Sy(this.kB), m);
    };
    S.prototype.set_m_gravity = S.prototype.dG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Ty(c, a);
    };
    Object.defineProperty(S.prototype, "m_gravity", {
      get: S.prototype.mD,
      set: S.prototype.dG,
    });
    S.prototype.__destroy__ = function () {
      Uy(this.kB);
    };
    function U() {
      throw "cannot construct a Face, no constructor in IDL";
    }
    U.prototype = Object.create(f.prototype);
    U.prototype.constructor = U;
    U.prototype.lB = U;
    U.mB = {};
    b.Face = U;
    U.prototype.get_m_n = U.prototype.MB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Vy(c, a), Node);
    };
    U.prototype.set_m_n = U.prototype.WB = function (a, c) {
      var d = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      Wy(d, a, c);
    };
    Object.defineProperty(U.prototype, "m_n", {
      get: U.prototype.MB,
      set: U.prototype.WB,
    });
    U.prototype.get_m_normal = U.prototype.RD = function () {
      return k(Xy(this.kB), m);
    };
    U.prototype.set_m_normal = U.prototype.IG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Yy(c, a);
    };
    Object.defineProperty(U.prototype, "m_normal", {
      get: U.prototype.RD,
      set: U.prototype.IG,
    });
    U.prototype.get_m_ra = U.prototype.$D = function () {
      return Zy(this.kB);
    };
    U.prototype.set_m_ra = U.prototype.SG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $y(c, a);
    };
    Object.defineProperty(U.prototype, "m_ra", {
      get: U.prototype.$D,
      set: U.prototype.SG,
    });
    U.prototype.__destroy__ = function () {
      az(this.kB);
    };
    function BF() {
      throw "cannot construct a tFaceArray, no constructor in IDL";
    }
    BF.prototype = Object.create(f.prototype);
    BF.prototype.constructor = BF;
    BF.prototype.lB = BF;
    BF.mB = {};
    b.tFaceArray = BF;
    BF.prototype.size = BF.prototype.size = function () {
      return bz(this.kB);
    };
    BF.prototype.at = BF.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(cz(c, a), U);
    };
    BF.prototype.__destroy__ = function () {
      dz(this.kB);
    };
    function Node() {
      throw "cannot construct a Node, no constructor in IDL";
    }
    Node.prototype = Object.create(f.prototype);
    Node.prototype.constructor = Node;
    Node.prototype.lB = Node;
    Node.mB = {};
    b.Node = Node;
    Node.prototype.get_m_x = Node.prototype.IE = function () {
      return k(ez(this.kB), m);
    };
    Node.prototype.set_m_x = Node.prototype.AH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_x", {
      get: Node.prototype.IE,
      set: Node.prototype.AH,
    });
    Node.prototype.get_m_q = Node.prototype.ZD = function () {
      return k(gz(this.kB), m);
    };
    Node.prototype.set_m_q = Node.prototype.QG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_q", {
      get: Node.prototype.ZD,
      set: Node.prototype.QG,
    });
    Node.prototype.get_m_v = Node.prototype.AE = function () {
      return k(iz(this.kB), m);
    };
    Node.prototype.set_m_v = Node.prototype.sH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_v", {
      get: Node.prototype.AE,
      set: Node.prototype.sH,
    });
    Node.prototype.get_m_f = Node.prototype.jD = function () {
      return k(kz(this.kB), m);
    };
    Node.prototype.set_m_f = Node.prototype.aG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_f", {
      get: Node.prototype.jD,
      set: Node.prototype.aG,
    });
    Node.prototype.get_m_n = Node.prototype.MB = function () {
      return k(mz(this.kB), m);
    };
    Node.prototype.set_m_n = Node.prototype.WB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_n", {
      get: Node.prototype.MB,
      set: Node.prototype.WB,
    });
    Node.prototype.get_m_im = Node.prototype.vD = function () {
      return oz(this.kB);
    };
    Node.prototype.set_m_im = Node.prototype.mG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_im", {
      get: Node.prototype.vD,
      set: Node.prototype.mG,
    });
    Node.prototype.get_m_area = Node.prototype.JC = function () {
      return qz(this.kB);
    };
    Node.prototype.set_m_area = Node.prototype.AF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rz(c, a);
    };
    Object.defineProperty(Node.prototype, "m_area", {
      get: Node.prototype.JC,
      set: Node.prototype.AF,
    });
    Node.prototype.__destroy__ = function () {
      sz(this.kB);
    };
    function CF() {
      throw "cannot construct a tNodeArray, no constructor in IDL";
    }
    CF.prototype = Object.create(f.prototype);
    CF.prototype.constructor = CF;
    CF.prototype.lB = CF;
    CF.mB = {};
    b.tNodeArray = CF;
    CF.prototype.size = CF.prototype.size = function () {
      return tz(this.kB);
    };
    CF.prototype.at = CF.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(uz(c, a), Node);
    };
    CF.prototype.__destroy__ = function () {
      vz(this.kB);
    };
    function V() {
      throw "cannot construct a Material, no constructor in IDL";
    }
    V.prototype = Object.create(f.prototype);
    V.prototype.constructor = V;
    V.prototype.lB = V;
    V.mB = {};
    b.Material = V;
    V.prototype.get_m_kLST = V.prototype.BD = function () {
      return wz(this.kB);
    };
    V.prototype.set_m_kLST = V.prototype.sG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xz(c, a);
    };
    Object.defineProperty(V.prototype, "m_kLST", {
      get: V.prototype.BD,
      set: V.prototype.sG,
    });
    V.prototype.get_m_kAST = V.prototype.AD = function () {
      return yz(this.kB);
    };
    V.prototype.set_m_kAST = V.prototype.rG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zz(c, a);
    };
    Object.defineProperty(V.prototype, "m_kAST", {
      get: V.prototype.AD,
      set: V.prototype.rG,
    });
    V.prototype.get_m_kVST = V.prototype.CD = function () {
      return Az(this.kB);
    };
    V.prototype.set_m_kVST = V.prototype.tG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Bz(c, a);
    };
    Object.defineProperty(V.prototype, "m_kVST", {
      get: V.prototype.CD,
      set: V.prototype.tG,
    });
    V.prototype.get_m_flags = V.prototype.tB = function () {
      return Cz(this.kB);
    };
    V.prototype.set_m_flags = V.prototype.uB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Dz(c, a);
    };
    Object.defineProperty(V.prototype, "m_flags", {
      get: V.prototype.tB,
      set: V.prototype.uB,
    });
    V.prototype.__destroy__ = function () {
      Ez(this.kB);
    };
    function DF() {
      throw "cannot construct a tMaterialArray, no constructor in IDL";
    }
    DF.prototype = Object.create(f.prototype);
    DF.prototype.constructor = DF;
    DF.prototype.lB = DF;
    DF.mB = {};
    b.tMaterialArray = DF;
    DF.prototype.size = DF.prototype.size = function () {
      return Fz(this.kB);
    };
    DF.prototype.at = DF.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Gz(c, a), V);
    };
    DF.prototype.__destroy__ = function () {
      Hz(this.kB);
    };
    function W() {
      throw "cannot construct a Anchor, no constructor in IDL";
    }
    W.prototype = Object.create(f.prototype);
    W.prototype.constructor = W;
    W.prototype.lB = W;
    W.mB = {};
    b.Anchor = W;
    W.prototype.get_m_node = W.prototype.PD = function () {
      return k(Iz(this.kB), Node);
    };
    W.prototype.set_m_node = W.prototype.GG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Jz(c, a);
    };
    Object.defineProperty(W.prototype, "m_node", {
      get: W.prototype.PD,
      set: W.prototype.GG,
    });
    W.prototype.get_m_local = W.prototype.FD = function () {
      return k(Kz(this.kB), m);
    };
    W.prototype.set_m_local = W.prototype.wG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Lz(c, a);
    };
    Object.defineProperty(W.prototype, "m_local", {
      get: W.prototype.FD,
      set: W.prototype.wG,
    });
    W.prototype.get_m_body = W.prototype.KC = function () {
      return k(Mz(this.kB), K);
    };
    W.prototype.set_m_body = W.prototype.BF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Nz(c, a);
    };
    Object.defineProperty(W.prototype, "m_body", {
      get: W.prototype.KC,
      set: W.prototype.BF,
    });
    W.prototype.get_m_influence = W.prototype.yD = function () {
      return Oz(this.kB);
    };
    W.prototype.set_m_influence = W.prototype.pG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Pz(c, a);
    };
    Object.defineProperty(W.prototype, "m_influence", {
      get: W.prototype.yD,
      set: W.prototype.pG,
    });
    W.prototype.get_m_c0 = W.prototype.NC = function () {
      return k(Qz(this.kB), uE);
    };
    W.prototype.set_m_c0 = W.prototype.EF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Rz(c, a);
    };
    Object.defineProperty(W.prototype, "m_c0", {
      get: W.prototype.NC,
      set: W.prototype.EF,
    });
    W.prototype.get_m_c1 = W.prototype.OC = function () {
      return k(Sz(this.kB), m);
    };
    W.prototype.set_m_c1 = W.prototype.FF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Tz(c, a);
    };
    Object.defineProperty(W.prototype, "m_c1", {
      get: W.prototype.OC,
      set: W.prototype.FF,
    });
    W.prototype.get_m_c2 = W.prototype.PC = function () {
      return Uz(this.kB);
    };
    W.prototype.set_m_c2 = W.prototype.GF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      Vz(c, a);
    };
    Object.defineProperty(W.prototype, "m_c2", {
      get: W.prototype.PC,
      set: W.prototype.GF,
    });
    W.prototype.__destroy__ = function () {
      Wz(this.kB);
    };
    function EF() {
      throw "cannot construct a tAnchorArray, no constructor in IDL";
    }
    EF.prototype = Object.create(f.prototype);
    EF.prototype.constructor = EF;
    EF.prototype.lB = EF;
    EF.mB = {};
    b.tAnchorArray = EF;
    EF.prototype.size = EF.prototype.size = function () {
      return Xz(this.kB);
    };
    EF.prototype.at = EF.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(Yz(c, a), W);
    };
    EF.prototype.clear = EF.prototype.clear = function () {
      Zz(this.kB);
    };
    EF.prototype.push_back = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $z(c, a);
    };
    EF.prototype.pop_back = function () {
      aA(this.kB);
    };
    EF.prototype.__destroy__ = function () {
      bA(this.kB);
    };
    function X() {
      throw "cannot construct a Config, no constructor in IDL";
    }
    X.prototype = Object.create(f.prototype);
    X.prototype.constructor = X;
    X.prototype.lB = X;
    X.mB = {};
    b.Config = X;
    X.prototype.get_kVCF = X.prototype.zC = function () {
      return cA(this.kB);
    };
    X.prototype.set_kVCF = X.prototype.qF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dA(c, a);
    };
    Object.defineProperty(X.prototype, "kVCF", {
      get: X.prototype.zC,
      set: X.prototype.qF,
    });
    X.prototype.get_kDP = X.prototype.mC = function () {
      return eA(this.kB);
    };
    X.prototype.set_kDP = X.prototype.dF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      fA(c, a);
    };
    Object.defineProperty(X.prototype, "kDP", {
      get: X.prototype.mC,
      set: X.prototype.dF,
    });
    X.prototype.get_kDG = X.prototype.lC = function () {
      return gA(this.kB);
    };
    X.prototype.set_kDG = X.prototype.cF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      hA(c, a);
    };
    Object.defineProperty(X.prototype, "kDG", {
      get: X.prototype.lC,
      set: X.prototype.cF,
    });
    X.prototype.get_kLF = X.prototype.oC = function () {
      return iA(this.kB);
    };
    X.prototype.set_kLF = X.prototype.fF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      jA(c, a);
    };
    Object.defineProperty(X.prototype, "kLF", {
      get: X.prototype.oC,
      set: X.prototype.fF,
    });
    X.prototype.get_kPR = X.prototype.qC = function () {
      return kA(this.kB);
    };
    X.prototype.set_kPR = X.prototype.hF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      lA(c, a);
    };
    Object.defineProperty(X.prototype, "kPR", {
      get: X.prototype.qC,
      set: X.prototype.hF,
    });
    X.prototype.get_kVC = X.prototype.yC = function () {
      return mA(this.kB);
    };
    X.prototype.set_kVC = X.prototype.pF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      nA(c, a);
    };
    Object.defineProperty(X.prototype, "kVC", {
      get: X.prototype.yC,
      set: X.prototype.pF,
    });
    X.prototype.get_kDF = X.prototype.kC = function () {
      return oA(this.kB);
    };
    X.prototype.set_kDF = X.prototype.bF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pA(c, a);
    };
    Object.defineProperty(X.prototype, "kDF", {
      get: X.prototype.kC,
      set: X.prototype.bF,
    });
    X.prototype.get_kMT = X.prototype.pC = function () {
      return qA(this.kB);
    };
    X.prototype.set_kMT = X.prototype.gF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rA(c, a);
    };
    Object.defineProperty(X.prototype, "kMT", {
      get: X.prototype.pC,
      set: X.prototype.gF,
    });
    X.prototype.get_kCHR = X.prototype.jC = function () {
      return sA(this.kB);
    };
    X.prototype.set_kCHR = X.prototype.aF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      tA(c, a);
    };
    Object.defineProperty(X.prototype, "kCHR", {
      get: X.prototype.jC,
      set: X.prototype.aF,
    });
    X.prototype.get_kKHR = X.prototype.nC = function () {
      return uA(this.kB);
    };
    X.prototype.set_kKHR = X.prototype.eF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      vA(c, a);
    };
    Object.defineProperty(X.prototype, "kKHR", {
      get: X.prototype.nC,
      set: X.prototype.eF,
    });
    X.prototype.get_kSHR = X.prototype.rC = function () {
      return wA(this.kB);
    };
    X.prototype.set_kSHR = X.prototype.iF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xA(c, a);
    };
    Object.defineProperty(X.prototype, "kSHR", {
      get: X.prototype.rC,
      set: X.prototype.iF,
    });
    X.prototype.get_kAHR = X.prototype.iC = function () {
      return yA(this.kB);
    };
    X.prototype.set_kAHR = X.prototype.$E = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      zA(c, a);
    };
    Object.defineProperty(X.prototype, "kAHR", {
      get: X.prototype.iC,
      set: X.prototype.$E,
    });
    X.prototype.get_kSRHR_CL = X.prototype.uC = function () {
      return AA(this.kB);
    };
    X.prototype.set_kSRHR_CL = X.prototype.lF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      BA(c, a);
    };
    Object.defineProperty(X.prototype, "kSRHR_CL", {
      get: X.prototype.uC,
      set: X.prototype.lF,
    });
    X.prototype.get_kSKHR_CL = X.prototype.sC = function () {
      return CA(this.kB);
    };
    X.prototype.set_kSKHR_CL = X.prototype.jF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      DA(c, a);
    };
    Object.defineProperty(X.prototype, "kSKHR_CL", {
      get: X.prototype.sC,
      set: X.prototype.jF,
    });
    X.prototype.get_kSSHR_CL = X.prototype.wC = function () {
      return EA(this.kB);
    };
    X.prototype.set_kSSHR_CL = X.prototype.nF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      FA(c, a);
    };
    Object.defineProperty(X.prototype, "kSSHR_CL", {
      get: X.prototype.wC,
      set: X.prototype.nF,
    });
    X.prototype.get_kSR_SPLT_CL = X.prototype.vC = function () {
      return GA(this.kB);
    };
    X.prototype.set_kSR_SPLT_CL = X.prototype.mF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      HA(c, a);
    };
    Object.defineProperty(X.prototype, "kSR_SPLT_CL", {
      get: X.prototype.vC,
      set: X.prototype.mF,
    });
    X.prototype.get_kSK_SPLT_CL = X.prototype.tC = function () {
      return IA(this.kB);
    };
    X.prototype.set_kSK_SPLT_CL = X.prototype.kF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      JA(c, a);
    };
    Object.defineProperty(X.prototype, "kSK_SPLT_CL", {
      get: X.prototype.tC,
      set: X.prototype.kF,
    });
    X.prototype.get_kSS_SPLT_CL = X.prototype.xC = function () {
      return KA(this.kB);
    };
    X.prototype.set_kSS_SPLT_CL = X.prototype.oF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      LA(c, a);
    };
    Object.defineProperty(X.prototype, "kSS_SPLT_CL", {
      get: X.prototype.xC,
      set: X.prototype.oF,
    });
    X.prototype.get_maxvolume = X.prototype.JE = function () {
      return MA(this.kB);
    };
    X.prototype.set_maxvolume = X.prototype.BH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      NA(c, a);
    };
    Object.defineProperty(X.prototype, "maxvolume", {
      get: X.prototype.JE,
      set: X.prototype.BH,
    });
    X.prototype.get_timescale = X.prototype.OE = function () {
      return OA(this.kB);
    };
    X.prototype.set_timescale = X.prototype.GH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      PA(c, a);
    };
    Object.defineProperty(X.prototype, "timescale", {
      get: X.prototype.OE,
      set: X.prototype.GH,
    });
    X.prototype.get_viterations = X.prototype.QE = function () {
      return QA(this.kB);
    };
    X.prototype.set_viterations = X.prototype.IH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      RA(c, a);
    };
    Object.defineProperty(X.prototype, "viterations", {
      get: X.prototype.QE,
      set: X.prototype.IH,
    });
    X.prototype.get_piterations = X.prototype.ME = function () {
      return SA(this.kB);
    };
    X.prototype.set_piterations = X.prototype.EH = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      TA(c, a);
    };
    Object.defineProperty(X.prototype, "piterations", {
      get: X.prototype.ME,
      set: X.prototype.EH,
    });
    X.prototype.get_diterations = X.prototype.fC = function () {
      return UA(this.kB);
    };
    X.prototype.set_diterations = X.prototype.XE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      VA(c, a);
    };
    Object.defineProperty(X.prototype, "diterations", {
      get: X.prototype.fC,
      set: X.prototype.XE,
    });
    X.prototype.get_citerations = X.prototype.dC = function () {
      return WA(this.kB);
    };
    X.prototype.set_citerations = X.prototype.VE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      XA(c, a);
    };
    Object.defineProperty(X.prototype, "citerations", {
      get: X.prototype.dC,
      set: X.prototype.VE,
    });
    X.prototype.get_collisions = X.prototype.eC = function () {
      return YA(this.kB);
    };
    X.prototype.set_collisions = X.prototype.WE = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      ZA(c, a);
    };
    Object.defineProperty(X.prototype, "collisions", {
      get: X.prototype.eC,
      set: X.prototype.WE,
    });
    X.prototype.__destroy__ = function () {
      $A(this.kB);
    };
    function Y(a, c, d, e) {
      ND();
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      "object" == typeof e && (e = RD(e));
      this.kB = aB(a, c, d, e);
      h(Y)[this.kB] = this;
    }
    Y.prototype = Object.create(q.prototype);
    Y.prototype.constructor = Y;
    Y.prototype.lB = Y;
    Y.mB = {};
    b.btSoftBody = Y;
    Y.prototype.checkLink = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return !!bB(d, a, c);
    };
    Y.prototype.checkFace = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      return !!cB(e, a, c, d);
    };
    Y.prototype.appendMaterial = function () {
      return k(dB(this.kB), V);
    };
    Y.prototype.appendNode = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      eB(d, a, c);
    };
    Y.prototype.appendLink = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      fB(g, a, c, d, e);
    };
    Y.prototype.appendFace = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      gB(g, a, c, d, e);
    };
    Y.prototype.appendTetra = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      hB(n, a, c, d, e, g);
    };
    Y.prototype.appendAnchor = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      iB(g, a, c, d, e);
    };
    Y.prototype.addForce = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === c ? jB(d, a) : kB(d, a, c);
    };
    Y.prototype.addAeroForceToNode = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      lB(d, a, c);
    };
    Y.prototype.getTotalMass = function () {
      return mB(this.kB);
    };
    Y.prototype.setTotalMass = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      nB(d, a, c);
    };
    Y.prototype.setMass = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      oB(d, a, c);
    };
    Y.prototype.transform = Y.prototype.transform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      pB(c, a);
    };
    Y.prototype.translate = Y.prototype.translate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      qB(c, a);
    };
    Y.prototype.rotate = Y.prototype.rotate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      rB(c, a);
    };
    Y.prototype.scale = Y.prototype.scale = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      sB(c, a);
    };
    Y.prototype.generateClusters = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return void 0 === c ? tB(d, a) : uB(d, a, c);
    };
    Y.prototype.generateBendingConstraints = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      return vB(d, a, c);
    };
    Y.prototype.upcast = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(wB(c, a), Y);
    };
    Y.prototype.getRestLengthScale = function () {
      return xB(this.kB);
    };
    Y.prototype.setRestLengthScale = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      yB(c, a);
    };
    Y.prototype.setAnisotropicFriction = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      zB(d, a, c);
    };
    Y.prototype.getCollisionShape = function () {
      return k(AB(this.kB), l);
    };
    Y.prototype.setContactProcessingThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      BB(c, a);
    };
    Y.prototype.setActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      CB(c, a);
    };
    Y.prototype.forceActivationState = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      DB(c, a);
    };
    Y.prototype.activate = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      void 0 === a ? EB(c) : FB(c, a);
    };
    Y.prototype.isActive = function () {
      return !!GB(this.kB);
    };
    Y.prototype.isKinematicObject = function () {
      return !!HB(this.kB);
    };
    Y.prototype.isStaticObject = function () {
      return !!IB(this.kB);
    };
    Y.prototype.isStaticOrKinematicObject = function () {
      return !!JB(this.kB);
    };
    Y.prototype.getRestitution = function () {
      return KB(this.kB);
    };
    Y.prototype.getFriction = function () {
      return LB(this.kB);
    };
    Y.prototype.getRollingFriction = function () {
      return MB(this.kB);
    };
    Y.prototype.setRestitution = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      NB(c, a);
    };
    Y.prototype.setFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      OB(c, a);
    };
    Y.prototype.setRollingFriction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      PB(c, a);
    };
    Y.prototype.getWorldTransform = function () {
      return k(QB(this.kB), r);
    };
    Y.prototype.getCollisionFlags = function () {
      return RB(this.kB);
    };
    Y.prototype.setCollisionFlags = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      SB(c, a);
    };
    Y.prototype.setWorldTransform = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      TB(c, a);
    };
    Y.prototype.setCollisionShape = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      UB(c, a);
    };
    Y.prototype.setCcdMotionThreshold = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      VB(c, a);
    };
    Y.prototype.setCcdSweptSphereRadius = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      WB(c, a);
    };
    Y.prototype.getUserIndex = function () {
      return XB(this.kB);
    };
    Y.prototype.setUserIndex = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      YB(c, a);
    };
    Y.prototype.getUserPointer = function () {
      return k(ZB(this.kB), XD);
    };
    Y.prototype.setUserPointer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      $B(c, a);
    };
    Y.prototype.getBroadphaseHandle = function () {
      return k(aC(this.kB), YD);
    };
    Y.prototype.get_m_cfg = Y.prototype.QC = function () {
      return k(bC(this.kB), X);
    };
    Y.prototype.set_m_cfg = Y.prototype.HF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cC(c, a);
    };
    Object.defineProperty(Y.prototype, "m_cfg", {
      get: Y.prototype.QC,
      set: Y.prototype.HF,
    });
    Y.prototype.get_m_nodes = Y.prototype.QD = function () {
      return k(dC(this.kB), CF);
    };
    Y.prototype.set_m_nodes = Y.prototype.HG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      eC(c, a);
    };
    Object.defineProperty(Y.prototype, "m_nodes", {
      get: Y.prototype.QD,
      set: Y.prototype.HG,
    });
    Y.prototype.get_m_faces = Y.prototype.KB = function () {
      return k(fC(this.kB), BF);
    };
    Y.prototype.set_m_faces = Y.prototype.UB = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      gC(c, a);
    };
    Object.defineProperty(Y.prototype, "m_faces", {
      get: Y.prototype.KB,
      set: Y.prototype.UB,
    });
    Y.prototype.get_m_materials = Y.prototype.MD = function () {
      return k(hC(this.kB), DF);
    };
    Y.prototype.set_m_materials = Y.prototype.DG = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      iC(c, a);
    };
    Object.defineProperty(Y.prototype, "m_materials", {
      get: Y.prototype.MD,
      set: Y.prototype.DG,
    });
    Y.prototype.get_m_anchors = Y.prototype.GC = function () {
      return k(jC(this.kB), EF);
    };
    Y.prototype.set_m_anchors = Y.prototype.xF = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      kC(c, a);
    };
    Object.defineProperty(Y.prototype, "m_anchors", {
      get: Y.prototype.GC,
      set: Y.prototype.xF,
    });
    Y.prototype.__destroy__ = function () {
      lC(this.kB);
    };
    function FF(a) {
      a && "object" === typeof a && (a = a.kB);
      this.kB = void 0 === a ? mC() : nC(a);
      h(FF)[this.kB] = this;
    }
    FF.prototype = Object.create(nE.prototype);
    FF.prototype.constructor = FF;
    FF.prototype.lB = FF;
    FF.mB = {};
    b.btSoftBodyRigidBodyCollisionConfiguration = FF;
    FF.prototype.__destroy__ = function () {
      oC(this.kB);
    };
    function GF() {
      this.kB = pC();
      h(GF)[this.kB] = this;
    }
    GF.prototype = Object.create(sE.prototype);
    GF.prototype.constructor = GF;
    GF.prototype.lB = GF;
    GF.mB = {};
    b.btDefaultSoftBodySolver = GF;
    GF.prototype.__destroy__ = function () {
      qC(this.kB);
    };
    function HF() {
      throw "cannot construct a btSoftBodyArray, no constructor in IDL";
    }
    HF.prototype = Object.create(f.prototype);
    HF.prototype.constructor = HF;
    HF.prototype.lB = HF;
    HF.mB = {};
    b.btSoftBodyArray = HF;
    HF.prototype.size = HF.prototype.size = function () {
      return rC(this.kB);
    };
    HF.prototype.at = HF.prototype.at = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      return k(sC(c, a), Y);
    };
    HF.prototype.__destroy__ = function () {
      tC(this.kB);
    };
    function Z(a, c, d, e, g) {
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      this.kB = uC(a, c, d, e, g);
      h(Z)[this.kB] = this;
    }
    Z.prototype = Object.create(x.prototype);
    Z.prototype.constructor = Z;
    Z.prototype.lB = Z;
    Z.mB = {};
    b.btSoftRigidDynamicsWorld = Z;
    Z.prototype.addSoftBody = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      vC(e, a, c, d);
    };
    Z.prototype.removeSoftBody = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      wC(c, a);
    };
    Z.prototype.removeCollisionObject = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      xC(c, a);
    };
    Z.prototype.getWorldInfo = function () {
      return k(yC(this.kB), S);
    };
    Z.prototype.getSoftBodyArray = function () {
      return k(zC(this.kB), HF);
    };
    Z.prototype.getDispatcher = function () {
      return k(AC(this.kB), TD);
    };
    Z.prototype.rayTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      BC(e, a, c, d);
    };
    Z.prototype.getPairCache = function () {
      return k(CC(this.kB), UD);
    };
    Z.prototype.getDispatchInfo = function () {
      return k(DC(this.kB), p);
    };
    Z.prototype.addCollisionObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? EC(e, a) : void 0 === d ? FC(e, a, c) : GC(e, a, c, d);
    };
    Z.prototype.getBroadphase = function () {
      return k(HC(this.kB), VD);
    };
    Z.prototype.convexSweepTest = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      IC(n, a, c, d, e, g);
    };
    Z.prototype.contactPairTest = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      JC(e, a, c, d);
    };
    Z.prototype.contactTest = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      KC(d, a, c);
    };
    Z.prototype.updateSingleAabb = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      LC(c, a);
    };
    Z.prototype.setDebugDrawer = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      MC(c, a);
    };
    Z.prototype.getDebugDrawer = function () {
      return k(NC(this.kB), WD);
    };
    Z.prototype.debugDrawWorld = function () {
      OC(this.kB);
    };
    Z.prototype.debugDrawObject = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      PC(e, a, c, d);
    };
    Z.prototype.setGravity = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      QC(c, a);
    };
    Z.prototype.getGravity = function () {
      return k(RC(this.kB), m);
    };
    Z.prototype.addRigidBody = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c
        ? SC(e, a)
        : void 0 === d
        ? _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(e, a, c)
        : TC(e, a, c, d);
    };
    Z.prototype.removeRigidBody = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      UC(c, a);
    };
    Z.prototype.addConstraint = function (a, c) {
      var d = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      void 0 === c ? VC(d, a) : WC(d, a, c);
    };
    Z.prototype.removeConstraint = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      XC(c, a);
    };
    Z.prototype.stepSimulation = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      return void 0 === c
        ? YC(e, a)
        : void 0 === d
        ? ZC(e, a, c)
        : $C(e, a, c, d);
    };
    Z.prototype.setContactAddedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      aD(c, a);
    };
    Z.prototype.setContactProcessedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      bD(c, a);
    };
    Z.prototype.setContactDestroyedCallback = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      cD(c, a);
    };
    Z.prototype.addAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      dD(c, a);
    };
    Z.prototype.removeAction = function (a) {
      var c = this.kB;
      a && "object" === typeof a && (a = a.kB);
      eD(c, a);
    };
    Z.prototype.getSolverInfo = function () {
      return k(fD(this.kB), t);
    };
    Z.prototype.setInternalTickCallback = function (a, c, d) {
      var e = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      void 0 === c ? gD(e, a) : void 0 === d ? hD(e, a, c) : iD(e, a, c, d);
    };
    Z.prototype.__destroy__ = function () {
      jD(this.kB);
    };
    function IF() {
      this.kB = kD();
      h(IF)[this.kB] = this;
    }
    IF.prototype = Object.create(f.prototype);
    IF.prototype.constructor = IF;
    IF.prototype.lB = IF;
    IF.mB = {};
    b.btSoftBodyHelpers = IF;
    IF.prototype.CreateRope = function (a, c, d, e, g) {
      var n = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      return k(lD(n, a, c, d, e, g), Y);
    };
    IF.prototype.CreatePatch = function (a, c, d, e, g, n, z, T, Da) {
      var dc = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      T && "object" === typeof T && (T = T.kB);
      Da && "object" === typeof Da && (Da = Da.kB);
      return k(mD(dc, a, c, d, e, g, n, z, T, Da), Y);
    };
    IF.prototype.CreatePatchUV = function (a, c, d, e, g, n, z, T, Da, dc) {
      var JF = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      n && "object" === typeof n && (n = n.kB);
      z && "object" === typeof z && (z = z.kB);
      T && "object" === typeof T && (T = T.kB);
      Da && "object" === typeof Da && (Da = Da.kB);
      "object" == typeof dc && (dc = RD(dc));
      return k(nD(JF, a, c, d, e, g, n, z, T, Da, dc), Y);
    };
    IF.prototype.CreateEllipsoid = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      return k(oD(g, a, c, d, e), Y);
    };
    IF.prototype.CreateFromTriMesh = function (a, c, d, e, g) {
      var n = this.kB;
      ND();
      a && "object" === typeof a && (a = a.kB);
      "object" == typeof c && (c = RD(c));
      if ("object" == typeof d && "object" === typeof d) {
        var z = OD(d, va);
        PD(d, va, z);
        d = z;
      }
      e && "object" === typeof e && (e = e.kB);
      g && "object" === typeof g && (g = g.kB);
      return k(pD(n, a, c, d, e, g), Y);
    };
    IF.prototype.CreateFromConvexHull = function (a, c, d, e) {
      var g = this.kB;
      a && "object" === typeof a && (a = a.kB);
      c && "object" === typeof c && (c = c.kB);
      d && "object" === typeof d && (d = d.kB);
      e && "object" === typeof e && (e = e.kB);
      return k(qD(g, a, c, d, e), Y);
    };
    IF.prototype.__destroy__ = function () {
      rD(this.kB);
    };
    (function () {
      function a() {
        b.PHY_FLOAT = sD();
        b.PHY_DOUBLE = tD();
        b.PHY_INTEGER = uD();
        b.PHY_SHORT = vD();
        b.PHY_FIXEDPOINT88 = wD();
        b.PHY_UCHAR = xD();
        b.CONST_GIMPACT_COMPOUND_SHAPE = yD();
        b.CONST_GIMPACT_TRIMESH_SHAPE_PART = zD();
        b.CONST_GIMPACT_TRIMESH_SHAPE = AD();
        b.BT_CONSTRAINT_ERP = BD();
        b.BT_CONSTRAINT_STOP_ERP = CD();
        b.BT_CONSTRAINT_CFM = DD();
        b.BT_CONSTRAINT_STOP_CFM = ED();
      }
      Ca ? a() : Aa.unshift(a);
    })();
    b.CONTACT_ADDED_CALLBACK_SIGNATURE = "iiiiiiii";
    b.CONTACT_DESTROYED_CALLBACK_SIGNATURE = "ii";
    b.CONTACT_PROCESSED_CALLBACK_SIGNATURE = "iiii";
    b.INTERNAL_TICK_CALLBACK_SIGNATURE = "vif";
    this.Ammo = b;

    return Ammo.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = Ammo;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return Ammo;
  });
else if (typeof exports === "object") exports["Ammo"] = Ammo;
