import { useState} from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase.config"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../../assets/svg/homeIcon.svg"


function Profile() {
  const [change ,setChange] = useState(false)
  const auth = getAuth()
  const [formData , setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name , email } = formData;

  const navigate = useNavigate()
  const onLogout = () => {
    auth.signOut()
    navigate('/sign-in')

  }
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }
  const onSubmit = async () => {
    
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in fb
        await updateProfile(auth.currentUser,{displayName:name})
        //update in firestore       
        const userRef = doc(db, 'users', auth.currentUser.uid )
        await updateDoc(userRef, {
          name
        })
      }     
    } catch (error) {
      console.log(error)
      toast.error(' sorry! we could not update the user details')
    }

  }
  



  
  return <div className="profile ">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="buttun" className="logOut" onClick={onLogout}> logout</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="personalDetailsText">Profile Details</p>
        <p className="changePersonalDetails" 
        onClick={() => {
          change && onSubmit()
          setChange((prevValue)=> !prevValue)
        }}> 
        {change ? 'done' :'change' }</p>
      </div>
      <div className="profileCard">
        <form >
          <input 
          type="text"
          className={change ? "profileNameActive" : "profileName"}
          onChange={onChange}
          value={name}
          id="name" 
          disabled={!change}/>

          <input 
          type="text"
          className={change ? "profileEmailActive" : "profileEmail"}
          onChange={onChange}
          value={email}
          id="email" 
          disabled={!change}/>
        </form>
      </div>
      <Link to='/create-listing' className="createListing">
        <img src={homeIcon} alt="home" />
        <p>sell or rent your home</p>
        <img src={arrowRight} alt="arrow" />
      </Link>
    </main>
  </div>
}

export default Profile
