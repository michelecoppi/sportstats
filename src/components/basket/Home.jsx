

import React, { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import BottomBar from '../BottomBar';
import { Carousel } from 'react-bootstrap';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import './homepage.css'


const Home = () => {

  const [news, setNews] = useState([]);


  useEffect(() => {
    fetch('https://us-central1-sportstats-42976.cloudfunctions.net/getFeed')
      .then(response => response.text())
      .then(data => {
        const parser = new Parser();
        parser.parseString(data)
          .then(feed => {
            const latestNews = feed.items?.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 5);
            setNews(latestNews);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }, []);



  return (
    <div className='text-center'>
     
  
      <h1 className=" h1-homepage" style={{marginTop:"10px"}}>Welcome to my NBA website!</h1>
      <div className='logo'></div>
      <h1 className=" h1-homepage">News</h1>

      {news.length === 0 ? <Spinner/> : (
  <Carousel style={{ margin: 'auto', maxWidth: '600px' }}>
    {news.map((item, index) => (
      <Carousel.Item className="carousel-item" key={index}>
        <img className="d-block " src={item.enclosure?.url} alt="basket news"/>
        <Carousel.Caption>
          <h4 className='title-carousel'>{item.title}</h4>
          <p className='p-carousel'>{item.content}</p>
          <a href={item.link} target="_blank" rel="noreferrer" className="p-carousel">Read more</a>
        </Carousel.Caption>
      </Carousel.Item>
    ))}
  </Carousel>
)}
    
      <h2 className=" h1-homepage">Nba Stats </h2>
      <p className=" p-homepage">Welcome to our gaming nba platform, where you can find all the latest news and updates about your favorite games. We offer a wide range of features and services to enhance your gaming experience, including account creation, clan creation, and a leaderboard of the best betters. Join our community today and start playing with gamers from all around the world.</p>
      <h2 className=" h1-homepage">Account Page</h2>
      <p className=" p-homepage">Create an account and join our gaming community to take advantage of all the features we offer. With an account, you can create your own clan, bet in matches, and climb the rankings to become the best gamer around. <Link to="/signup">Sign up</Link> now and start your journey towards gaming greatness.</p>
      <h2 className=" h1-homepage">Matches Page</h2>
      <p className=" p-homepage">Check out our matches page to see the latest upcoming events and competitions. We offer a variety of matches, from casual play to competitive tournaments, so there's something for everyone. Stay up-to-date with our schedule and never miss a match again.</p>
      <h2 className=" h1-homepage">Players Page</h2>
      <p className=" p-homepage">Looking for information on NBA players? Look no further than our Players page! Our database includes comprehensive stats and profiles for all current NBA players, from seasoned veterans to rising stars. Use our search function to easily find the player you're looking for and access their stats, highlights, and more.</p>
      <h2 className=" h1-homepage">Teams Page</h2>
      <p className=" p-homepage" >Our Teams page is your go-to source for all things NBA teams. From team stats to player rosters to upcoming games, we've got it all. Follow your favorite team or discover a new one with our comprehensive database of all 30 NBA teams. Find out about their history, key players, and current standings in the league. Whether you're a die-hard fan or just getting started, our Teams page has everything you need to know about the NBA.</p>
      <h2 className=" h1-homepage">Clans Page</h2>
      <p className=" p-homepage" >Looking for a clan to join? Check out our Clans page to find the perfect clan for you. Create or join a clan to connect with other gamers and compete in matches. Clans are a great way to make new friends and improve your gaming skills. Join a clan today and start playing with other gamers from around the world.</p>
      <h2 className=" h1-homepage">Standings Page</h2>
      <p className=" p-homepage" style={{marginBottom:"20px"}}>Check out our standings page </p>
      <BottomBar/>
    </div>
  
  );
};

export default Home;






