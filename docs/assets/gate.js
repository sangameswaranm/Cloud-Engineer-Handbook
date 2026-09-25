(function () {
  "use strict";
  var SALT = "972d13a85dbea54665de7197f1909678", HASH = "c5fea5c6df0095ab85c4a5e69ce880ff77d588060711fc97cdce2154b988bc1f", KEY = "ceh-gate";
  var root = document.documentElement;
  function stored() { try { return localStorage.getItem(KEY) || sessionStorage.getItem(KEY); } catch (e) { return null; } }
  if (stored() === HASH) { root.classList.add("ceh-ok"); addLogout(); return; }

  function sha(t) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function build() {
    var g = document.createElement("div"); g.id = "ceh-gate";
    g.innerHTML = '<form class="ceh-gate-box" autocomplete="on">' +
      '<div class="ceh-gate-mark" aria-hidden="true">&#9679;</div>' +
      '<h1>Cloud Engineer Handbook</h1><p class="ceh-gate-sub">Sign in to continue</p>' +
      '<label>Username<input id="ceh-u" name="username" autocomplete="username" required></label>' +
      '<label>Password<input id="ceh-p" name="password" type="password" autocomplete="current-password" required></label>' +
      '<label class="ceh-gate-rem"><input id="ceh-r" type="checkbox" checked> Remember me on this device</label>' +
      '<button type="submit">Sign in</button><p id="ceh-e" class="ceh-gate-err" role="alert"></p></form>';
    document.body.appendChild(g);
    var f = g.querySelector("form"), e = g.querySelector("#ceh-e");
    g.querySelector("#ceh-u").focus();
    f.addEventListener("input", function () { e.textContent = ""; });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = g.querySelector("#ceh-u").value.trim(), p = g.querySelector("#ceh-p").value;
      sha(SALT + "|" + u + "|" + p).then(function (h) {
        if (h !== HASH) { e.textContent = "Wrong username or password."; g.querySelector("#ceh-p").value = ""; return; }
        try { (g.querySelector("#ceh-r").checked ? localStorage : sessionStorage).setItem(KEY, HASH); } catch (x) {}
        root.classList.add("ceh-ok"); g.remove(); addLogout();
      });
    });
  }
  function addLogout() {
    var go = function () {
      var hdr = document.querySelector(".md-header__inner");
      if (!hdr || document.getElementById("ceh-logout")) return;
      var b = document.createElement("button"); b.id = "ceh-logout"; b.textContent = "Log out"; b.type = "button";
      b.onclick = function () { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (x) {} location.reload(); };
      hdr.appendChild(b);
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", build) : build();
})();
