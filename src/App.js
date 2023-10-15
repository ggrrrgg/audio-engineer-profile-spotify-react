
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';

const CLIENT_ID = 'f9700cee755943ddb35762c10d83a4f6';
const CLIENT_SECRET = '';

function App() {

  const [token, setToken] = useState('');
  const [albums, setAlbums] = useState([]);

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

    
  }, []);

  async function getPlaylist() {
    
    let playlistParameters = {
    method: 'GET',
    headers: 
      {'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    
      }
    }

    let albumID
    // get my credits playlist
    try {
    // Fetch playlist data
    const response = await fetch('https://api.spotify.com/v1/playlists/7iJI8La0UoPBAC2aCj4Oa0/tracks', playlistParameters);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the structure of the response is correct
    console.log(data);

    // Assuming data is in the correct structure, get the album ID
    albumID = data.items[0].track.album.id;

    console.log(albumID);

  } catch (error) {
    console.error('Error fetching playlist:', error);

   // get each album using album id and set to state
  
  await fetch('https://api.spotify.com/v1/albums/' + albumID, playlistParameters)
  .then(response => response.json())
  .then(data => {
    setAlbums(data.items);
  })
  }
  
}

getPlaylist();


console.log(albums);

  
  // const scopes = [
  //   'playlist-read-collaborative',
  //   'playlist-read-private'
  // ] 







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
            {albums && albums.map((album, i) => {
              console.log(album);
              return (
                <Card key={i}>
                  <Card.Img src={album.images[0].url}/>
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
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
