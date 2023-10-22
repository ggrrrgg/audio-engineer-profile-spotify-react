
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import { Spotify } from 'react-spotify-embed';
import footer from './footer';

const CLIENT_ID = 'f9700cee755943ddb35762c10d83a4f6';
const CLIENT_SECRET = '2a4d0dc01cdc44b48029f6fd432a75a4';

function App() {

  const [token, setToken] = useState('');
  const [creditAlbums, setCreditAlbums] = useState([]);

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

  useEffect(() => {
    if (token) {
      getAlbums();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function getAlbums() {
    
    let playlistParameters = {
    method: 'GET',
    headers: 
      {'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    
      }
    }
    // albumID array
    let albumID = []
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

    // Assuming data, get the album ID
    albumID = data.items.map(item => item.track.album.id);

    console.log(albumID);

  } catch (error) {
    console.error('Error fetching playlist:', error);

  }


    function removeDuplicates(albumID) {
      const result = [];

      for (let i = 0; i < albumID.length; i++) {
        if (result.indexOf(albumID[i]) === -1) {
          result.push(albumID[i]);
        }
      }

      return result;
    }

    const uniqueAlbumIDs = await removeDuplicates(albumID);

    // console.log(uniqueAlbumIDs);

    function removeEmptyAndSpaces(arr) {
      return arr.filter(item => item && item.trim());
    }
    
    const cleanAlbumIDs = removeEmptyAndSpaces(uniqueAlbumIDs);

    const cleanAlbumIDsString = cleanAlbumIDs.join(',');
    console.log(cleanAlbumIDsString);

    let albumParameters = {
      method: 'GET',
      headers: 
        {
        'Authorization': 'Bearer ' + token
      
        }
      }

    let returnedAlbums = await fetch('https://api.spotify.com/v1/albums?ids=' + cleanAlbumIDsString + '?markets=US', albumParameters)
    .then(response => response.json())
    .then(data => {
      // console.log(data)
    //   console.log('Before setAlbums:', data.albums);
    // setCreditAlbums(data.albums);
    //   console.log('After setAlbums:', creditAlbums);
    console.log('Raw data.albums:', data.albums);
    let filteredData = data.albums.filter(album => album != null);
    console.log('Filtered albums: ', filteredData);
    return filteredData;
    })

    setCreditAlbums(returnedAlbums);
}

    useEffect (() => {
      if (creditAlbums)
      console.log('Album state updated ', creditAlbums);
    }, [creditAlbums])
  //   getAlbums();
  // console.log(creditAlbums);

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
            <Row className='mx-2 row row-cols-3'>
                {creditAlbums.map((album) => {
                  return (
                    <Card key={album.id}>
                      <Card.Img src={album.images[0].url} alt={album.name} />
                      <Card.Body>
                        <Card.Title>{album.name} - {album.artists[0].name} </Card.Title>
                        <Card.Title><Spotify wide link={album.external_urls.spotify}></Spotify></Card.Title>
                      </Card.Body>
                    </Card>
                   )
                })}
            </Row>
      </Container>
      </div>
      <div>{footer}</div>
  </div>
  );
}

export default App;
