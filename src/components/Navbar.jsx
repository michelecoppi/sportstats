import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
  const [activeMenu, setActiveMenu] = useState('basketball');
  const [homeRoute, setHomeRoute] = useState('/');
  const [iconImage, setIconImage] = useState('./images/basketball.webp');
  const [playersRoute, setPlayersRoute] = useState('/players');
  const [teamsRoute, setTeamsRoute] = useState('/teams');
  const [matchesRoute, setMatchesRoute] = useState('/matches');

  const handleMenuClick = (menu) => {
    sessionStorage.setItem('activeMenu', menu);
    setActiveMenu(menu);
  };

  useEffect(() => {
    const savedMenu = sessionStorage.getItem('activeMenu');
    if (savedMenu) {
      setActiveMenu(savedMenu);
     
    }

    if (activeMenu === 'basketball') {
      setIconImage('./images/basketball.webp');
      setHomeRoute('/');
      setPlayersRoute('/players');
      setTeamsRoute('/teams');
      setMatchesRoute('/matches');
    } else {
      setIconImage('./images/esports.webp');
      setHomeRoute('/esports');
      setPlayersRoute('/esportsplayers');
      setTeamsRoute('/esportsteams');
      setMatchesRoute('/esportsmatches');
    }
  }, [activeMenu]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div  className="navbar-brand" style={{ marginLeft: '10px' }}>
        SportStats{' '}
        {activeMenu === 'basketball' ? (
          <img src={iconImage} style={{ width: '20px', height: '20px' }} />
        ) : (
          <img src={iconImage} style={{ width: '20px', height: '20px' }}  />
        )}
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
        <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              SportStats {activeMenu === 'basketball' ? 'Basket' : 'Esports'}
            </a>
            <div className="dropdown-menu text-white bg-dark " aria-labelledby="navbarDropdownMenuLink">
             <Link to="/" style={{textDecoration:"none", marginBottom: "0", marginTop: "0"}}> <button className="dropdown-item text-white" onClick={() => handleMenuClick('basketball')} style={{ backgroundColor: "transparent"}}>
                SportStats Basket
              </button></Link>
              <Link to="/esports" style={{textDecoration:"none", marginBottom: "0", marginTop: "0"}}> <button className="dropdown-item text-white" onClick={() => handleMenuClick('esports') } style={{ backgroundColor: "transparent"}}>
                SportStats Esports
              </button></Link>
            </div>
          </li>
          <li className="nav-item">
            <Link to={homeRoute} className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={playersRoute} className="nav-link">
              Players
            </Link>
          </li>
          <li className="nav-item">
            <Link to={teamsRoute} className="nav-link">
              Teams
            </Link>
          </li>
          <li className="nav-item">
            <Link to={matchesRoute} className="nav-link">
              Matches
            </Link>
          </li>
       {activeMenu === 'basketball' ? ( 
        <li className="nav-item"><Link to="/standings" className="nav-link">Standings</Link></li>) : ( "" )}

          <li className="nav-item">
            <Link to="/signin" className="nav-link">
              Account
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
