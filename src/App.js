
import React from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';

import Home from './components/basket/Home';
import Players from './components/basket/Players';
import Standings from './components/basket/Standings';
import Teams from './components/basket/Teams';
import Team from './components/basket/Team';
import Matches from './components/basket/Matches'
import Livematches from './components/basket/Livematches';
import Match from './components/basket/Match';
import Player from './components/basket/Player';
import Bet from './components/basket/Bet';

import MatchesEsports from './components/esports/MatchesEsports';
import HomeEsports from './components/esports/HomeEsports';
import TeamsEsports from './components/esports/TeamsEsports';
import PlayersEsports from './components/esports/PlayersEsports';
import TournamentLive from './components/esports/TournamentLive';
import MatchInfoE from './components/esports/MatchInfoE';
import TeamEsports from './components/esports/TeamEsports';
import PlayerE from './components/esports/PlayerE';

import Signup from './components/account/Signup';
import Signin from './components/account/Signin';
import Passwordreset from './components/account/Passwordreset';
import Account from './components/account/Account';
import Palmares from './components/account/Palmares';
import Chat from './components/account/Chat';
import Privatechat from './components/account/Privatechat';
import Generalchat from './components/account/Generalchat';
import ViewAccount from './components/account/ViewAccount';
import SearchUsers from './components/account/SearchUsers';
import BlockList from './components/account/BlockList';
import Clan from './components/account/Clan';
import ClanInfo from './components/account/ClanInfo';
import Leaderboard from './components/account/Leaderboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Utils from './components/Utils';
import Contactus from './components/Contactus';
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
