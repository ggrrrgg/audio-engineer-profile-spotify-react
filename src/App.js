
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';

const CLIENT_ID = 'f9700cee755943ddb35762c10d83a4f6';
const CLIENT_SECRET = '';

function App() {

  const [token, setToken] = useState('');
  const [albums, setAlbums] = useState('');

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
    let playlistRequest = {
    method: 'GET',
    headers: 
      {'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    
  }
}
  // get my credits playlist
    let albumID = await fetch ('https://api.spotify.com/v1/playlists/7iJI8La0UoPBAC2aCj4Oa0/tracks', playlistRequest)
    .then(result => result.json())
    // get album id from each track in the playlist
    .then(data => {return data.track.items[0].album.id})


    console.log(albumID);

  //   // get each album using album id and set to state
  // // eslint-disable-next-line no-unused-vars
    let returnedAlbums = await fetch('https://api.spotify.com/v1/albums/' + albumID, playlistRequest)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    })
}

getPlaylist();
// eslint-disable-next-line react-hooks/exhaustive-deps

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
          {/* {albums.map( (album, i) => {
              console.log(album);
            return (
              <Card>
            <Card.Img src={album.images[0].url}/>
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
            </Card.Body>
          </Card>
            )
          })} */}
            </Row>
        </Container>
       </div>
    </div>
  );
}

export default App;
