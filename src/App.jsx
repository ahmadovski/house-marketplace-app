import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify"
import Navbar from "./components/Navbar/Navbar";
import Explore from "./pages/Explore/Explore"
import Profile from "./pages/Profile/Profile"
import Offer from "./pages/Offer/Offer"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import SignIn from "./pages/SignIn/SignIn"
import SignUp from "./pages/SignUp/SignUp"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Explore/>} />
        <Route path="/profile" element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>} />
        </Route>
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/forgot-Password" element={<ForgotPassword/>} />
        <Route path="/offer" element={<Offer/>} />
      </Routes>
      <Navbar/>
    </Router>
    <ToastContainer/>
      
    </>
  )
}

export default App
