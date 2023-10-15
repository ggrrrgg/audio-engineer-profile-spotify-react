
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';

const CLIENT_ID = 'f9700cee755943ddb35762c10d83a4f6';
const CLIENT_SECRET = '2a4d0dc01cdc44b48029f6fd432a75a4';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    let authParameters = {
      method:'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET

    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setToken(data.access_token))

    // console.log(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const scopes = [
    'playlist-read-collaborative',
    'playlist-read-private'
  ] 


async function getPlaylist() {
    let playlistRequest = {
    method: 'GET',
    headers: 
      {'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    
  }
}

    let playlists = await fetch ('https://api.spotify.com/v1/playlists/7iJI8La0UoPBAC2aCj4Oa0/tracks', playlistRequest)
    .then(result => result.json())

    console.log(playlists);
}

getPlaylist();


  return (
    <div className="App">
       <div className='head'>
          <h2>George Sheridan</h2>
          <h4>Musician / Engineer / Producer</h4>
        </div>
       <div className='credits_title'>
        <h5>Credits:</h5>
       </div>
       <div className='credit_tiles'>
        <Container>
          <Row className='mx-2 row row-cols-4'>
          {playlists.map( (track, i) => {
              console.log(track);
            return (
              <Card>
            <Card.Img src={track.images[0].url}/>
            <Card.Body>
              <Card.Title>{track.name}</Card.Title>
            </Card.Body>
          </Card>
            )
          })}
            </Row>
        </Container>
       </div>
    </div>
  );
}

export default App;
