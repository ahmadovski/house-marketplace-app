import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import OAuth from "../../components/OAuth/OAuth";
import { ReactComponent as KeyboardArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import { toast } from "react-toastify";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevValue) => ({
      ...prevValue,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/profile");
      }
    } catch (error) {
      toast.error("bad user credentials.");
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header className='pageHeader'>
          <p>Welcome back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              className='emailInput'
              value={email}
              onChange={onChange}
              type='email'
              id='email'
              placeholder='Email'
              required
            />
            <div className='passwordInputDiv'>
              <input
                className='passwordInput'
                value={password}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                id='password'
                placeholder='Password'
                required
              />
              <img
                className='showPassword'
                src={visibilityIcon}
                alt='visibility icon'
                onClick={() => setShowPassword((prevValue) => !prevValue)}
              />
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              forgot password
            </Link>
            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <KeyboardArrowRightIcon fill='#fff' width='34px' />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to='/sign-up' className='registerLink'>
            <p>sign up instead</p>
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
