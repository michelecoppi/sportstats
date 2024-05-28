const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bearerToken = functions.config().someservice.bearer;
const api_key=functions.config().someservice.api;
const bearer_esport = functions.config().someservice.bearer_esport;
const gemini_api_key= functions.config().someservice.gemini_api_key

const config = {
  apiKey: functions.config().someservice.firebase_api_key,
  authDomain: functions.config().someservice.firebase_auth_domain,
  databaseURL: functions.config().someservice.firebase_database_url,
  projectId: functions.config().someservice.firebase_project_id,
  storageBucket: functions.config().someservice.firebase_storage_bucket,
  messagingSenderId: functions.config().someservice.firebase_messaging_sender_id,
  appId: functions.config().someservice.firebase_app_id,
};
admin.initializeApp(config);
exports.getGeminiResponse = functions.region("europe-west1")
  .https.onRequest(function (req, res) {
    try {
      const genAI = new GoogleGenerativeAI(gemini_api_key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = req.query.input; 

      model.generateContent(prompt)
        .then(result => result.response.text())
        .then(text => {
          res.set("Access-Control-Allow-Origin", "*");
          res.status(200).send(text);
        })
        .catch(error => {
          console.error("Error generating AI response", error);
          res.set("Access-Control-Allow-Origin", "*");
          res.status(500).send("Error generating AI response");
        });

    } catch (error) {
      console.error("Error generating AI response", error);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(500).send("Error generating AI response");
    }
  });

exports.getTournaments = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const game=req.query.game;
      fetch(`https://api.pandascore.co/${game}/tournaments/upcoming?sort=&page=1&per_page=50`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });


exports.getTournamentsRunning = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const game=req.query.game;
      fetch(`https://api.pandascore.co/${game}/tournaments/running?sort=&page=1&per_page=50`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });


exports.getTournamentsMatches = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const id = req.query.id;
      fetch(`https://api.pandascore.co/tournaments/${id}/matches?sort=&page=1&per_page=100`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });


exports.getMatches = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const id = req.query.id;
      fetch(`https://api.pandascore.co/matches/${id}`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });

exports.getLatestTweets = functions.region("europe-west1")
    .https.onRequest(function(request, response) {
      fetch(`https://api.twitter.com/1.1/statuses/
      user_timeline.json?screen_name=twitterapi&count=10`, {
        headers: {
          "Authorization": `Bearer ${bearerToken}`,
          "Access-Control-Allow-Origin": "*",
        },
      }).then(function(tweets) {
        response.set("Access-Control-Allow-Origin", "*");
        response.send(tweets);
      }).catch(function(error) {
        console.log(error);
        response.status(500).send("An error occurred");
      });
    });

exports.getUser = functions.region("europe-west1")
    .https.onRequest((req, res) => {
      const url = "https://api.twitter.com/2/users/19923144";
      const options = {
        headers: {
          "Authorization": `Bearer ${bearerToken}`,
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      };
      fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send("An error occurred");
          });
    });

exports.getTeamsEsports = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const name = req.query.name;
      fetch(`https://api.pandascore.co/teams?search[name]=
      ${name}&sort=&page=1&per_page=50`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });
exports.getPlayerE = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const id = req.query.id;
      fetch(`https://api.pandascore.co/players/${id}`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });
exports.getAllPlayersE = functions.region("europe-west1")
    .https.onRequest(function(req, res) {
      const name = req.query.name;
      fetch(`https://api.pandascore.co/players?search[name]=
      ${name}&sort=&page=1&per_page=50`, {
        headers: {
          "Authorization":
          bearer_esport,
        },
      })
          .then(function(response) {
            res.set("Access-Control-Allow-Origin", "*");
            return response.json();
          })
          .then(function(data) {
            res.status(200).send(data);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Errore nella richiesta API");
          });
    });
exports.dailyBonus = functions.region("europe-west1")
    .pubsub.schedule("every day 21:00").onRun(() => {
      const usersRef = admin.firestore().collection("users");
      return usersRef.get()
          .then((snapshot) => {
            const batch = admin.firestore().batch();
            snapshot.forEach((doc) => {
              const userRef = usersRef.doc(doc.id);
              const currentCoins = doc.data().coins || 0;
              batch.update(userRef, {coins: currentCoins + 20});
            });
            return batch.commit();
          })
          .catch((error) => {
            console.error("Error getting users: ", error);
            throw new Error("Error getting users");
          });
    });

exports.getFeed = functions.https.onRequest((req, res) => {
      const url = "https://www.espn.com/espn/rss/nba/news";
        
        fetch(url)
          .then(response => response.text())
            .then(xml => {
              res.set("Access-Control-Allow-Origin", "*");
              res.set("Content-Type", "text/xml");
              res.send(xml);
            })
            .catch(error => {
              console.log(error);
              res.status(500).send(error);
            });
        });
exports.getFeedEsports = functions.region("europe-west1")
       .https.onRequest((req, res) => {
        const url ="https://dotesports.com/feed"
        fetch(url)
          .then(response => response.text())
            .then(xml => {
              res.set("Access-Control-Allow-Origin", "*");
              res.set("Content-Type", "text/xml");
              res.send(xml);
            }
            )
            .catch(error => {
              console.log(error);
              res.status(500).send(error);
            });
        });
  
exports.updateStandings = functions.region("europe-west1").pubsub.schedule("every day 22:00").onRun(function() {
          var requestOptions = {
              method: "GET",
              redirect: "follow",
          };
          return fetch(`https://api.sportradar.com/nba/trial/v8/en/seasons/2022/REG/standings.json?api_key=${api_key}`, requestOptions)
              .then(response => response.text())
              .then(jsonData => {
                  const storageRef = admin.storage().bucket().file("standings/currentStandings.json");
                  return storageRef.save(JSON.stringify(jsonData), { contentType: "application/json" });
              })
              .then(() => {
                  console.log("Success! Updated currentStandings in Firebase Storage.");
                  return fetch(`https://api.sportradar.us/nba/trial/v8/en/seasons/2022/REG/leaders.json?api_key=${api_key}`, requestOptions);
              })
              .then(response => response.text())
              .then(jsonData => {
                  const storageRef = admin.storage().bucket().file("standings/currentLeaders.json");
                  return storageRef.save(JSON.stringify(jsonData), { contentType: "application/json" });
              })
              .then(() => {
                  console.log("Success! Updated currentLeaders in Firebase Storage.");
                  return null;
              })
              .catch(error => {
                  console.error("Error", error);
                  return null;
              });
      });

exports.getStandings = functions.region("europe-west1").https.onRequest(function(req, res) {
        const storage = admin.storage();
        const bucket = storage.bucket();
      
        const downloadLeaders = bucket.file("standings/currentLeaders.json").download();
        const downloadStandings = bucket.file("standings/currentStandings.json").download();
  
        Promise.all([downloadLeaders, downloadStandings])
          .then(results => {
            const leaders = JSON.parse(results[0][0].toString());
            const standings = JSON.parse(results[1][0].toString());
      
            const responseData = {
              leaders: leaders,
              standings: standings
            };
      
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).send(responseData);
          })
          .catch(error => {
            console.error("Errore nel recupero dei dati delle classifiche:", error);
            res.status(500).send("Error");
          });
      });
      
      
      