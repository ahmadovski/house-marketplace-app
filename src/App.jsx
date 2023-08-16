import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
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
        <Route path="/profile" element={<Profile/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/forgot-Password" element={<ForgotPassword/>} />
        <Route path="/offer" element={<Offer/>} />
      </Routes>
      <Navbar/>
    </Router>
      
    </>
  )
}

export default App
