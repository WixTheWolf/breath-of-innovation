(function (global) {
  var STORAGE_KEY = "tff-session-v1";

  function isAuthed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; }
    catch (e) { return false; }
  }

  function setAuthed() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }

  function clearAuthed() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function getReturnUrl(fallback) {
    var params = new URLSearchParams(global.location.search);
    var ret = params.get("return");
    if (ret && ret.charAt(0) === "/") return ret;
    return fallback || "/packet";
  }

  function logout() {
    clearAuthed();
    fetch("/api/auth", { method: "DELETE", credentials: "same-origin" }).finally(function () {
      global.location.href = "/gate";
    });
  }

  function login(password) {
    return fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password: password })
    })
      .then(function (res) {
        if (res.ok) { setAuthed(); return true; }
        return false;
      })
      .catch(function () { return false; });
  }

  /* Ask the server whether the auth cookie is valid. The cookie is
     the source of truth; sessionStorage is only a fast-path cache. */
  function verify() {
    return fetch("/api/auth", { method: "GET", credentials: "same-origin" })
      .then(function (res) { return res.ok; })
      .catch(function () { return false; });
  }

  /* For gated pages: resolve true when the visitor is authed, first
     from the cache, otherwise by checking the cookie. Redirect to the
     gate only when both fail, so blocked or cleared sessionStorage
     cannot bounce a validly signed-in visitor. */
  function ensureAuthed(returnPath) {
    if (isAuthed()) return Promise.resolve(true);
    return verify().then(function (ok) {
      if (ok) { setAuthed(); return true; }
      global.location.replace("/gate?return=" + encodeURIComponent(returnPath || global.location.pathname));
      return false;
    });
  }

  global.TFF = {
    isAuthed: isAuthed,
    login: login,
    logout: logout,
    verify: verify,
    ensureAuthed: ensureAuthed,
    getReturnUrl: getReturnUrl
  };
})(window);