import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (!userId) {
    return showSignup 
      ? <Signup setShowSignup={setShowSignup} setUserId={setUserId} /> 
      : <Login setShowSignup={setShowSignup} setUserId={setUserId} />;
  }

  return <Dashboard userId={userId} />;
}
