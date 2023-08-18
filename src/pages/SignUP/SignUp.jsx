
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { db } from "../../firebase.config";
import {ReactComponent as KeyboardArrowRightIcon} from '../../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../../assets/svg/visibilityIcon.svg'

function SignUp() {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {name, email, password} = formData ;

  const navigate = useNavigate();

  const onChange = (e) => {

    setFormData((prevValue) => ({
      ...prevValue,
        [e.target.id]: e.target.value
    })
    )
  }

  //firebase auth section
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      console.log(auth)
      const userCredential = await  createUserWithEmailAndPassword(auth, email, password)
      // const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name
      })
      navigate('/forgot-password')
      
    } catch (error) {
      console.log(error)
    }
    

  }




  return (
    <>
      <div className="pageContainer">
        <header className="pageHeader">
          <p>Welcome back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input className="nameInput" value={name} onChange={onChange} type="text" id="name" placeholder="Name"/>
            <input className="emailInput" value={email} onChange={onChange} type="email" id="email" placeholder="Email"/>
            <div className="passwordInputDiv">
              <input className="passwordInput" value={password} onChange={onChange} type={showPassword ? 'text': 'password'} id="password" placeholder='Password'/>
              <img className="showPassword" src={visibilityIcon} alt="visibility icon" onClick={()=> setShowPassword((prevValue) => !prevValue)} />
            </div>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className='signUpButton'>
                <KeyboardArrowRightIcon fill='#fff' width='34px'/>  
              </button>
            </div>
          </form>
          {/* google oAuth */}
            <Link to='/sign-in' className="registerLink">
              <p>sign in instead</p>
            </Link>
        </main>
      </div>
    </>
  )
}
  
export default SignUp
  