
import React, { useEffect, useState } from 'react';
import BottomBar from './BottomBar';
import Spinner from './Spinner';
import xml2js from 'xml2js';
import { Carousel } from 'react-bootstrap';

function HomeEsports() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('https://europe-west1-sportstats-42976.cloudfunctions.net/getFeedEsports')
      .then(response => response.text())
      .then(data => {
        const parser = new xml2js.Parser();
        parser.parseString(data, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            const latestNews = result.rss.channel[0].item.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 5);
            setNews(latestNews);
          }
        });
      })
      .catch(error => console.log(error));
  }, []);



  return (
    <div><h1 className="text-center h1-homepage" style={{ marginTop: "10px" }}>Welcome to the Esports website!</h1>
      <div className='logoEsports'></div>
      <h1 className="text-center h1-homepage" style={{ marginTop: "10px" }}>News</h1>
      {news.length === 0 ? <Spinner /> : (
        <Carousel style={{ margin: 'auto', maxWidth: '600px' }}>
          {news.map((item, index) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(item['content:encoded'][0], 'text/html');
            const imgSrc = doc.querySelector('img').getAttribute('src');
            return (
              <Carousel.Item className="carousel-item-esports" key={index}>

                <Carousel.Caption className="carousel-caption-container"><p className="title-carousel">{item.category[0]}</p></Carousel.Caption>

                <img src={imgSrc} className="d-block w-100" alt="esports news" />
                <Carousel.Caption >
                  <p className='p-carousel'> {item.title[0]}</p>
                  <a href={item.link[0]} target="_blank" rel="noreferrer" className="p-carousel">Read more</a>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}

      <p className="text-center p-homepage" style={{ padding: "20px" }}>Welcome to our esports section! We offer a comprehensive platform for fans of competitive gaming. Our website features a Players section where you can search for your favorite gamers from various teams. We also have a Teams section where you can find information about different teams competing in tournaments. In our Matches section, you can view stats for ongoing tournaments, check out upcoming matches and tournaments, and stay up-to-date on the latest esports news. Join our community of gaming enthusiasts today and experience the excitement of competitive gaming like never before!</p><br></br>

      <BottomBar />
    </div>
  )
}

export default HomeEsports