import { useState, useEffect} from "react"
import { getAuth } from "firebase/auth"


function Profile() {
  const [user,setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth()
    setUser(auth.currentUser)
    
  },[])
  return user ? <h1>{user.displayName}</h1> : <h1>Not Loggen In</h1>
}

export default Profile
