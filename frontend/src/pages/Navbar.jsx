import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch {
      role = null;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <nav style={{
      padding: "10px",
      background: "#282c34",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
        {!token && <Link to="/register" style={{ color: "white", marginRight: "15px" }}>Register</Link>}

        {role === "teacher" && <Link to="/teacher" style={{ color: "white", marginRight: "15px" }}>Teacher Dashboard</Link>}
        {role === "student" && <Link to="/student" style={{ color: "white", marginRight: "15px" }}>Student Dashboard</Link>}
      </div>

      <div>
        {token ? (
          <button onClick={logout} style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}>
            Logout
          </button>
        ) : (
          <Link to="/" style={{ color: "white" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}
