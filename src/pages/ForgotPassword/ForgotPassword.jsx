import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { ReactComponent as ArrowRight} from "../../assets/svg/keyboardArrowRightIcon.svg"
import { toast } from "react-toastify"

function ForgotPassword() {
  const [email , setEmail] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }
  const onSubmit = async(e) => {
    e.preventDefault()
    try {
      const auth =  getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('email was sent')
      
    } catch (error) {
      toast.error('something went wrong!')
      
    }

  }
    return (
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Forgot Password</p>
        </header>
        <main>
          <form onSubmit={onSubmit}> 
            <input type="email"
            placeholder="email"
            value={email} 
            id="email" 
            onChange={onChange} 
            className="emailInput" />
            <Link className="forgotPasswordLink" to="/sign-in">Sign in</Link>
          </form>
          <div className="signInBar">
            <div className="signInText">send reset link</div>
            <button type="submit" onClick={onSubmit} className="signInButton" color="white">
              <ArrowRight fill='#fff' width='34px' height='34px' />
            </button>
            
          </div>
        </main>
      </div>
    )
  }
  
  export default ForgotPassword
  