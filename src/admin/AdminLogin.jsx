import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const ADMIN_PIN = "9825";

function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isAuthorized") === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin !== ADMIN_PIN) {
      setError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem("isAuthorized", "true");
    window.dispatchEvent(new Event("authChange"));
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="container">
      <section className="card" aria-labelledby="admin-login-title">
        <h2 id="admin-login-title">Admin Login</h2>
        <p>Enter your password to open the admin panel.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-pin">Password</label>
          <input
            id="admin-pin"
            type="password"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value);
              setError("");
            }}
            placeholder="Enter password"
            autoComplete="current-password"
            required
            autoFocus
          />
          {error && <p role="alert">{error}</p>}
          <button type="submit">Open Admin Panel</button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
