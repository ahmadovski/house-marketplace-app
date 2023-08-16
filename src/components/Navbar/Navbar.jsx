import React from "react";
import { useNavigate, useLocation } from "react-router-dom"
import {ReactComponent as ExploreIcon} from "../../assets/svg/exploreIcon.svg"
import {ReactComponent as PersonOutlineIcon} from "../../assets/svg/personOutlineIcon.svg"
import {ReactComponent as LocalOfferIcon} from "../../assets/svg/localOfferIcon.svg"


function Navbar() {

    const navigate = useNavigate();

    const location = useLocation();

    const pathMatchRoute = (route) => {
        if(location.pathname == route){
            return true
        } 
        
    }

    return (

        <footer className="navbar">
            <nav className="navbarNav">
                <ul className="navbarListItems">
                    <li className="navbarListItem" onClick={()=>navigate('/')}>
                        <ExploreIcon  height="30px" width="30px" fill={pathMatchRoute('/') ? "#2c2c2c" : "#8f8f8f"}/>
                        <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' :'navbarListItemName' } >explore</p>
                    </li>
                    <li className="navbarListItem" onClick={()=>navigate('/offer')} >
                        <LocalOfferIcon  height="30px" width="30px" fill={pathMatchRoute('/offer') ? "#2c2c2c" : "#8f8f8f"}/>
                        <p className={pathMatchRoute('/offer') ? 'navbarListItemNameActive' :'navbarListItemName' }>Offer</p>
                    </li>
                    <li className="navbarListItem" onClick={()=>navigate('/profile')}>
                        <PersonOutlineIcon  height="30px" width="30px" fill={pathMatchRoute('/profile') ? "#2c2c2c" : "#8f8f8f"} />
                        <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' :'navbarListItemName' }>Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
      
    )
  }
  
  export default Navbar
  
//   
// .navbarListItemName,
// .navbarListItemNameActive 
