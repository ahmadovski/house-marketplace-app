import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../../assets/svg/googleIcon.svg"

function OAuth() {
    const navigate = useNavigate();
    const locataion = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user 
            
            // check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            
            // if user doesn't exist, create user
            if(!docSnap.exists()) {
               await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                timeStamp: serverTimestamp()
               })
            }
            navigate('/')
            
        } catch (error) {
            toast.error('could not authorize with Google')
        }
    }

  return (
    <div className="socialLogin">
      <p>Sign {locataion.pathname === '/sign-in' ? 'in' : 'up'} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google icon" />
      </button>
    </div>
  )
}

export default OAuth
