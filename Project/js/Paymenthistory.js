function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
  }