import { Link } from "react-router-dom"
import sellCategoryImage from "../../assets/jpg/sellCategoryImage.jpg"
import rentCategoryImage from "../../assets/jpg/rentCategoryImage.jpg"

function Explore() {
    return (
      <div className="explore">
        <header>
          <p className="pageHeader">Explore</p>
        </header>
        <main>
          {/* slider */}
          <div className="exploreCategoryHeading">Categories</div>
          <div className="exploreCategories">
            <Link to='/category/sale'>
              <img className="exploreCategoryImg" src={sellCategoryImage} alt="sell category image" />
              <p className="exploreCategoryName">places for sale</p>

            </Link>
            <Link to='/category/rent'>
              <img className="exploreCategoryImg" src={rentCategoryImage} alt="sell category image" />
              <p className="exploreCategoryName">places for rent</p>

            </Link>
          </div>
        </main>
          
      </div>
    )
  }
  
  export default Explore
  