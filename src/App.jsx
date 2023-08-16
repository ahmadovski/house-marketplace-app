import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Explore from "./pages/Explore/Explore"
import Profile from "./pages/Profile/Profile"
import Offer from "./pages/Offer/Offer"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import SignIn from "./pages/SignIn/SignIn"
import SignUp from "./pages/SignUp/SignUp"

function App() {
  

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Explore/>} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="/Sign-in" element={<SignIn/>} />
        <Route path="/Sign-up" element={<SignUp/>} />
        <Route path="/Forgot-Password" element={<ForgotPassword/>} />
        <Route path="/Offer" element={<Offer/>} />
      </Routes>
      {/* navbar */}
    </Router>
      
    </>
  )
}

export default App
