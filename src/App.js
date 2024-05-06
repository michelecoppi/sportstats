
import React from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Players from './components/Players';
import Standings from './components/Standings';
import Teams from './components/Teams';
import Team from './components/Team';
import Matches from './components/Matches'
import Livematches from './components/Livematches';
import Match from './components/Match';
import Player from './components/Player';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Passwordreset from './components/Passwordreset';
import Account from './components/Account';
import Bet from './components/Bet';
import Leaderboard from './components/Leaderboard';
import Palmares from './components/Palmares';
import Chat from './components/Chat';
import Privatechat from './components/Privatechat';
import Generalchat from './components/Generalchat';
import ViewAccount from './components/ViewAccount';
import SearchUsers from './components/SearchUsers';
import ProtectedRoute from './components/ProtectedRoute';
import Utils from './components/Utils';
import Contactus from './components/Contactus';
import BlockList from './components/BlockList';
import MatchesEsports from './components/MatchesEsports';
import HomeEsports from './components/HomeEsports';
import TeamsEsports from './components/TeamsEsports';
import PlayersEsports from './components/PlayersEsports';
import TournamentLive from './components/TournamentLive';
import MatchInfoE from './components/MatchInfoE';
import TeamEsports from './components/TeamEsports';
import PlayerE from './components/PlayerE';
import Clan from './components/Clan';
import ClanInfo from './components/ClanInfo';
import { AuthContextProvider } from './context/AuthContext';


function App() {
  return (
    <div>
   <Navbar>

   </Navbar>

   <AuthContextProvider>
       <Routes>
       <Route path="/match/:gameId/:homeTeamId/:visitorTeamId/:homeTeamName/:visitorTeamName" element={<Match />} />
       <Route path="/matches" element={<Matches/>} exact/>
        <Route path="/livematches" element={<Livematches/>} exact/>
       <Route path="/team/:id" element={<Team />} />
        <Route path="/matche" element={<MatchInfoE/>} exact/>
        <Route path="/playerE/:id" element={<PlayerE/>} />
       <Route path="/esportsmatches" element={<MatchesEsports/>} exact/>
       <Route path="/tournament/:id" element={<TournamentLive/>} exact/>
        <Route path="/esports" element={<HomeEsports/>} exact/>
        <Route path="/esportsteams" element={<TeamsEsports/>} exact/>
        <Route path="/teamE" element={<TeamEsports/>} />
        <Route path="/esportsplayers" element={<PlayersEsports/>} exact/>
        <Route path="/standings" element={<Standings/>}></Route>
      <Route path="/" element={<Home/>} exact/>
      <Route path="/players" element={<Players/>} exact/>
      <Route path="/teams" element={<Teams/>} exact/>
      <Route path="/player/:id" element={<Player/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/passwordreset" element={<Passwordreset/>} />
      <Route path="/account" element={<ProtectedRoute> <Account/></ProtectedRoute>} />
      <Route path="/searchusers/" element={<ProtectedRoute> <SearchUsers/></ProtectedRoute>} />
      <Route path="/searchusers/viewaccount/:username" element={<ProtectedRoute> <ViewAccount/></ProtectedRoute>} />
      <Route path="/bet" element={<ProtectedRoute> <Bet/></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute> <Leaderboard/></ProtectedRoute>} />
      <Route path="/palmares" element={<ProtectedRoute> <Palmares/></ProtectedRoute>} />
      <Route path="/chat/:username" element={<ProtectedRoute> <Chat/></ProtectedRoute>} />
      <Route path="/chat/:username/:username2" element={<ProtectedRoute> <Privatechat/></ProtectedRoute>} />
      <Route path="/chatgeneral" element={<ProtectedRoute> <Generalchat/></ProtectedRoute>} />
      <Route path="/clan" element={<ProtectedRoute> <Clan/></ProtectedRoute>} />
      <Route path="/myclan" element={<ProtectedRoute> <ClanInfo/></ProtectedRoute>} />
      <Route path="/utils/:utils" element={ <Utils/>} />
      <Route path="esports/utils/:utils" element={ <Utils/>} />
      <Route path="/esports/contactus" element={ <Contactus/>} />
      <Route path="/contactus" element={ <Contactus/>} />
      <Route path="/blocklist" element={<ProtectedRoute> <BlockList/></ProtectedRoute>} />
      
      </Routes>
    </AuthContextProvider>
     
    </div>
  );
}

export default App;
