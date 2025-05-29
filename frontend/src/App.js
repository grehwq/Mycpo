import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [review, setReview] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [mode, setMode] = useState("none"); // "login" | "signup" | "none"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [allReviews, setAllReviews] = useState([]);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("bookReviewUser");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5001/reviews");
        const data = await res.json();
        setAllReviews(data);
      } catch (err) {
        console.error("❌ Failed to fetch reviews:", err);
      }
    };
  
    fetchReviews();
  }, []);
  


  const handleLogin = async () => {
    const res = await fetch("http://localhost:5001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      setCurrentUser(username);
      localStorage.setItem("bookReviewUser", username);
      setMode("none");
      setUsername("");
      setPassword("");
    }
  };

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      setCurrentUser(username);
      localStorage.setItem("bookReviewUser", username);
      setMode("none");
      setUsername("");
      setPassword("");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("bookReviewUser");
    setCurrentUser("");
    setUsername("");
    setPassword("");
    setMode("none");
    alert("You have been logged out.");
  };
  

  const handleSubmit = async () => {
    console.log("🟡 Submit clicked");
    console.log("currentUser:", currentUser);
    console.log("review:", review);
  
    if (!currentUser) {
      alert("Please log in to submit a review.");
      return;
    }
  
    if (!review.trim()) {
      alert("Please type a review before submitting.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5001/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, content: review }),
      });
  
      console.log("Response status:", res.status);
  
      const data = await res.json();
      console.log("✅ Response data:", data);
  
      alert(data.message || data.error);
      setReview(""); // Clear box
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Something went wrong while submitting your review.");
    }
  };
  
  return (
    <div className="container">
      <div className="sidebar">
        <h2>Paste</h2>
      </div>
      <div className="main-content">
        <div className="top-right">
        {currentUser ? (
  <>
    <p style={{ fontWeight: 'bold' }}>
      Logged in as: {currentUser}
    </p>
    <button className="auth-button" onClick={handleLogout}>Logout</button>
  </>
) : (
  <>
    <button className="auth-button" onClick={() => setMode("login")}>Login</button>
    <button className="auth-button" onClick={() => setMode("signup")}>Sign up</button>
  </>
)}
 </div>

        {/* Inline Login / Signup Form */}
        {mode !== "none" && !currentUser && (
          <div className="auth-form">
            <h3>{mode === "login" ? "Login" : "Sign Up"}</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="submit-button"
              onClick={mode === "login" ? handleLogin : handleSignup}
            >
              Submit
            </button>
          </div>
        )}

        <textarea
          className="review-box"
          placeholder="Paste your book review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit Review
        </button>
        <div className="review-list">
  <h3>All Reviews:</h3>
  {allReviews.length === 0 ? (
    <p>No reviews yet.</p>
  ) : (
    allReviews.map((r, index) => (
      <div key={index} className="review-item">
        <p><strong>{r.username}</strong>:</p>
        <p>{r.content}</p>
        <hr />
      </div>
    ))
  )}
</div>


      </div>
    </div>
  );
}

export default App;
