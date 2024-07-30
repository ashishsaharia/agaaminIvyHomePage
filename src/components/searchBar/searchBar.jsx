import { useState } from "react";
import { useRecoilState } from "recoil";
import Spinner from "../spinner";
import { nameState, inputState, tldState } from "../../atoms/atoms";
import { GiCheckMark } from "react-icons/gi";
import { FaSkullCrossbones } from "react-icons/fa";

function SearchBar() {
  const [name, setName] = useRecoilState(nameState);
  const [input, setInput] = useRecoilState(inputState);
  const [tld, setTld] = useRecoilState(tldState);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  let fullName = name + '.' + tld;


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if(name.length === 0){
        setIsEmpty(true)
    }
    else{
        setIsEmpty(false);
        getStatus()
    }
    }
  };


  // Function to fetch status
  const getStatus = async () => {
    try {
      setIsLoading(true);
      setError(false); 

      let response = await fetch(`https://agaamin.in/modules/registrars/bhregistrar/whois.php?d=${fullName}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.text();
      if (data === "already registered") {
        setInput('taken');
      } else {
        setInput('available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true); 
    } finally {
      setIsLoading(false); 
    }
  };

  // Handle search button click
  const onClick = () => {
    if(name.length === 0){
        setIsEmpty(true)
    }
    else{
        setIsEmpty(false);
        getStatus()
    }
  };

  // checking for alphanumeric characters
  const isAlphanumeric = (char) => {
    let regex = /^[a-z0-9]+$/i;
    return regex.test(char);
  };

  // Handle input change
  const onNameChange = (e) => {
    let currentName = e.target.value;
    let nameSize = currentName.length;
    let lastChar = currentName[nameSize - 1];
    setInput('filling');

    if (!isAlphanumeric(lastChar)) {
      alert("Special characters and spaces are not allowed in the name.");
      setName(currentName.slice(0, nameSize - 1));
    } else {
      setName(currentName);
    }
  };


  const renderIconOrMessage = () => {
    if (isLoading) {
      return <Spinner />; 
    }

    else if(isEmpty){
        return <div style={{
            fontFamily:"fugaz One",
        margin:'8px',
        fontSize:"15px"
        }}>
            Enter a  <strong style={{
                color:'#3F4CE8'
            }}>Name</strong>
        </div>
    }

    else if (error) {
      return <div className="tryAgainMessage" style={{
        fontFamily:"fugaz One",
        margin:'8px',
        fontSize:"15px"
      }}>Server side Error <strong style={{
        color:"#3F4CE8",
      }}>Try again</strong></div>;
    } else if (input === 'taken') {
      return (
        <div style={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"center",
          alignItems:"center",
          fontFamily:"fugaz One",
          margin:'8px',
          fontSize:"15px"
        }}>
          <FaSkullCrossbones className="skull" style={{
            marginRight :"5px"
          }}/>
          <p><strong  style={{
        color:"#3F4CE8",
      }}>{fullName + " "}</strong> is already taken.</p>
        </div>
      ); 
    } else if (input === 'available') {
      return (
        <div style={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"center",
          alignItems:"center",
          fontFamily:"fugaz One",
          margin:'8px',
          fontSize:"15px"
        }}>
          <GiCheckMark className="tick" style={{
            marginRight :"5px"
          }}/>
          <p><strong  style={{
        color:"#3F4CE8",
      }}>{fullName + " "}</strong> is available.</p>
        </div>
      ); 
    }
    return null;
  };

  return (
    <div className="searchBarWrapper">
      <div className="searchBarTop">
        <div className="fullNameWrapper">
          <input className="domainName" type="text" maxLength={30} onKeyDown={handleKeyPress} value={name} onChange={onNameChange} placeholder="Enter Name" />
          <div className="tldWrapper">
            <select className="tldDropdown" name="tldName" id="tld" onChange={(e) => {
              setInput("filling")
              setTld(e.target.value);
            }}>
              <option value={'bh3'}> bh3</option>
              <option value={'mu3'}>mu3</option>
              <option value={'rarity'}>rarity</option>
              <option value={'IN'}>IN</option>
              <option value={'foodz'}>foodz</option>
            </select>
          </div>
        </div>

        <div>
          <button className="nameSearchButton" onClick={onClick} disabled={isLoading}>
            Search
          </button>
        </div>
      </div>
      <div className="searchBarBottom">
        {renderIconOrMessage()} 
      </div>
    </div>
  );
}

export default SearchBar;
