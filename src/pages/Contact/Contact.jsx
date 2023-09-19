import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";

function Contact() {
  const [message, setMessage] = useState(" ");
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getlandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        setLoading(false);
      } else {
        toast.error("could not get landlord data");
        setLoading(false);
      }
    };

    getlandlord();
  }, [params.landlordId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  if (loading) return <Spinner />;

  if (landlord !== null)
    return (
      <div className='pageConatainer'>
        <header>
          <p className='pageHeader'>Contact landlord</p>
        </header>
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>
          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:/${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      </div>
    );
}

export default Contact;
