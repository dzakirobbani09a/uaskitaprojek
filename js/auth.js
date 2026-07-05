const Auth = {
  TOKEN_KEY: "authToken",
  USER_KEY: "authUser",

  saveSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  hasRole(...roles) {
    const user = this.getUser();
    return !!user && roles.includes(user.role);
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (e) {
      console.warn("Gagal memberi tahu server saat logout:", e.message);
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = "login.html";
  },

  authHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
    }
  },

  requireRole(...roles) {
    this.requireLogin();
    if (!this.hasRole(...roles)) {
      alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
      window.location.href = "index.html";
    }
  },

  renderNavSlot() {
    const slot = document.getElementById("authSlot");
    if (!slot) return;

    const user = this.getUser();
    if (user) {
      slot.innerHTML = `
        <span style="margin-right:12px;">Hai, <b>${user.name}</b> (${user.role})</span>
        <a href="#" id="logoutLink">Logout</a>
      `;
      document.getElementById("logoutLink").addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout();
      });
    } else {
      slot.innerHTML = `<a href="login.html">Login</a>`;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => Auth.renderNavSlot());