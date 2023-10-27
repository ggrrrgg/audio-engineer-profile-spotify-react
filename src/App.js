
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import { Spotify } from 'react-spotify-embed';
import footer from './footer';
// import BandcampPlayer from 'react-bandcamp';

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


    // remove duplicates by saving as a set
    const uniqueAlbumIDs = await [...new Set(albumID)]

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
      <Container fluid class='position-relative' className='all_cards'>
            <Row className='mx-2 row row-cols-3'>
                {creditAlbums.map((album) => {
                  return (
                    <Card className='spoti_card' key={album.id}>
                      <Card.Img src={album.images[0].url} alt={album.name} />
                      <Card.Body>
                        {/* <Card.Title>{album.name} - {album.artists[0].name} </Card.Title> */}
                        <Card.Title><Spotify wide link={album.external_urls.spotify}></Spotify></Card.Title>
                      </Card.Body>
                    </Card>
                   )
                })}
                <Card className='bandcamp_tile'>
                  
                  <Card.Body>
                      <iframe title='cf'class= 'embed-responsive embed-responsive-16by9'style={{border: '0', width: '100%', height: '100%'}} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=3276653023/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                        <a href="https://colourfields1.bandcamp.com/album/body-objects">Body Objects by Colourfields</a></iframe>
                  </Card.Body>
                </Card>
                <Card className='bandcamp_tile'>
                  
                  <Card.Body>
                  <iframe title='wearevfar'class= 'embed-responsive embed-responsive-16by9'style={{border: '0', width: '100%', height: '100%' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=2463401670/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://grownocean.bandcamp.com/album/we-are-very-far">We Are Very Far by Grown Ocean</a></iframe>
                  </Card.Body>
                </Card>
                <Card className='bandcamp_tile'>
                  
                  <Card.Body>
                  <iframe title='enzo'class= 'embed-responsive embed-responsive-16by9'style={{border: '0', width: '100%', height: '100%' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=191477950/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://enzolunch.bandcamp.com/album/early-lunch">Early Lunch by Enzo Lunch</a></iframe>
                  </Card.Body>
                </Card>
                <Card className='bandcamp_tile'>
                  
                  <Card.Body>
                  <iframe title='triplex'class= 'embed-responsive embed-responsive-16by9'style={{border: '0', width: '100%', height: '100%' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=2787108074/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://triplex1.bandcamp.com/album/into-the-void">INTO THE VOID by TRIPLEX</a></iframe>
                  </Card.Body>
                </Card>
            </Row>
      </Container>
      </div>
      <div>{footer}</div>
  </div>
  );
}

export default App;
