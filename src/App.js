
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import { Spotify } from 'react-spotify-embed';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import backgroundImage from './docs/cassettesplat.png'


const CLIENT_ID = 'f9700cee755943ddb35762c10d83a4f6';
const REACT_APP_CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET

function App() {

  const [token, setToken] = useState('');
  const [creditAlbums, setCreditAlbums] = useState([]);

  // request spotify token on page load
  useEffect(() => {
    let authParameters = {
      method:'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + REACT_APP_CLIENT_SECRET

    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setToken(data.access_token))

    // console.log(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // then request albums
  useEffect(() => {
    if (token) {
      getAlbums();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // request albums from user playlist
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
    const response = await fetch('https://api.spotify.com/v1/playlists/7iJI8La0UoPBAC2aCj4Oa0/tracks', playlistParameters);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the structure of the response is correct
    // console.log(data);

    // Assuming data, get the album ID from each track in the playlist
    albumID = data.items.map(item => item.track.album.id);
    
    // console.log(albumID);
  } catch (error) {
    console.error('Error fetching playlist:', error);

  }
    
    // remove duplicates by saving as a set
    const uniqueAlbumIDs = await [...new Set(albumID)]
    
    // console.log(uniqueAlbumIDs);
    // prepare album IDs or album request
    function removeEmptyAndSpaces(arr) {
      return arr.filter(item => item && item.trim());
    }
    
    const cleanAlbumIDs = removeEmptyAndSpaces(uniqueAlbumIDs);

    const cleanAlbumIDsString = cleanAlbumIDs.join(',');
    // console.log(cleanAlbumIDsString);
    // make request for albums
    let albumParameters = {
      method: 'GET',
      headers: 
        {
        'Authorization': 'Bearer ' + token
      }
    }

    let returnedAlbums = await fetch('https://api.spotify.com/v1/albums?ids=' + cleanAlbumIDsString + '&markets=US', albumParameters)
    .then(response => response.json())
    .then(data => {
    // console.log('Raw data albums:', data.albums);
    // Reorder albums by their release date, most recent first
    let orderedData = data.albums.sort((albumA, albumB) => albumB.release_date.localeCompare(albumA.release_date));
    // filter any albums that return null
    let filteredData = orderedData.filter(album => album != null);

    
    // console.log('Filtered albums: ', filteredData);
    return filteredData;
    })
    // set album list to state
    setCreditAlbums(returnedAlbums);
}
    // check album state is updating correctly
    // useEffect (() => {
    //   if (creditAlbums)
    //   console.log('Album state updated ', creditAlbums);
    // }, [creditAlbums])
 
  //simple bootstrap layout 
  return (
    <div className="App" style={{ 
      backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: 'contain', 
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className='head' 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0)', color: '#ffffff', textShadow: '2px 2px 2px #000000' }}>
        <h2>George Sheridan</h2>
        <h4>Musician / Engineer / Producer</h4>
        <h6>email: george.sheridan@gmail.com</h6>
        <a href="https://www.instagram.com/georgesheridann/" target="_blank" rel="noreferrer" 
        className="insta" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
          <InstagramIcon />
        </a>
        <a href="https://www.facebook.com/george.sheridan.12" target="_blank" rel="noreferrer" 
        className="fb"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
          <FacebookIcon />
        </a>
      </div>
      <div className='credits_title' style={{ backgroundColor: 'rgba(255, 255, 255, 0)', color: '#ffffff', textShadow: '2px 2px 2px #000000' }}>
        <h4>Credits:</h4>
      </div>
      {/* page tiles from spotify */}
      <div className='credit_tiles' style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
      <Container class='position-relative' className='all_cards' style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
            <Row className='mx-2 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3'>
                {creditAlbums.map((album) => {
                  return (
                    <Card className='spoti_card' key={album.id} style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                      <Card.Img src={album.images[0].url} alt={album.name} />
                      <Card.Body>
                        <Card.Title><Spotify wide link={album.external_urls.spotify}></Spotify></Card.Title>
                      </Card.Body>
                    </Card>
                   )
                })}
        {/* page tiles rom bandcamp */}
                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                  <Card.Body>
                      <iframe title='cf'style={{border: '0', width: '100%', height: '500px'}} 
                      src="https://bandcamp.com/EmbeddedPlayer/album=3276653023/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                        <a href="https://colourfields1.bandcamp.com/album/body-objects">Body Objects by Colourfields</a></iframe>
                  </Card.Body>
                </Card>

                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}>  
                  <Card.Body>
                  <iframe title='wearevfar'style={{border: '0', width: '100%', height: '500px' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=2463401670/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://grownocean.bandcamp.com/album/we-are-very-far">We Are Very Far by Grown Ocean</a></iframe>
                  </Card.Body>
                </Card>

                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                  <Card.Body>
                  <iframe title='enzo'style={{border: '0', width: '100%', height: '500px' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=191477950/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://enzolunch.bandcamp.com/album/early-lunch">Early Lunch by Enzo Lunch</a></iframe>
                  </Card.Body>
                </Card>

                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}> 
                  <Card.Body>
                  <iframe title='triplex'style={{border: '0', width: '100%', height: '500px' }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=2787108074/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless>
                    <a href="https://triplex1.bandcamp.com/album/into-the-void">INTO THE VOID by TRIPLEX</a></iframe>
                  </Card.Body>
                </Card>

                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}> 
                  <Card.Body>
                  <iframe title='3070'style={{border: '0', width: '100%', height: '500px' }} 
                  src="https://bandcamp.com/EmbeddedPlayer/album=2830375107/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=1068104892/transparent=true/" seamless>
                    <a href="https://thirtyseventy.bandcamp.com/album/30-70-remix-tape">30/70 Remix Tape by George Sheridan</a></iframe>
                  </Card.Body>
                </Card>
                
                <Card class='col'className='bandcamp_tile' style={{ border: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}> 
                  <Card.Body>
                  <iframe title='ma'style={{border: '0', width: '100%', height: '500px' }} 
                  src="https://bandcamp.com/EmbeddedPlayer/album=1264425630/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=541352634/transparent=true/" seamless>
                    <a href="https://mamusic.bandcamp.com/album/across-the-city-and-into-your-remix-2">Across the City and Into Your REMIX by MA</a></iframe>
                  </Card.Body>
                </Card>
                
          </Row>
      </Container>
      </div>
      
  </div>
  );
}

export default App;
