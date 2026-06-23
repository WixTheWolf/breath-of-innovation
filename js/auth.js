(function (global) {
  var STORAGE_KEY = "tff-session-v1";

  function isAuthed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; }
    catch (e) { return false; }
  }

  function setAuthed() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
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

  global.TFF = { isAuthed: isAuthed, login: login };
})(window);