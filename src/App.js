
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import  {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

 const  CLIENT_ID = "e1a49f51a5a748b7919d2a99bf3897cd";
 const  CLIENT_SECRET = "67dcd1f083d742b581e6633d951af440";

function App() {
  
  const [searchInput, setSearchInput] =useState("");
  const [accessToken, setAccessToken] =useState("");
  const [albums, setAlbums] =useState([]);

  useEffect( () => {
 //token de acceso

 const authParameters ={
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
   // 'Authorization': `Basic ${basic}`
  },
  body: 'grant_type=client_credentials&client_id='+ CLIENT_ID + '&client_secret=' +  CLIENT_SECRET
};

 
   fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(result  => result.json())
  .then(data => console.log(data.access_token));
 
   


  }, [])

  //Funcion de busqueda

  async function search() 
   {
    console.log("Search For" + searchInput);
  //Get request using search to get the Artist ID
//parametros de lo que queremos recibir
  var searchParameters ={
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer' + accessToken
    },
  }
  const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
  .then(response  => response.json())
  .then(data => {return data.artist.items[0].id});

  console.log("el id es " + artistID );

  //Get request with artist Id grab all albums from  that artist
 const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID +'/albums' +'?include_groups=album&market=US&limit=25', searchParameters)
   .then(response  => response.json())
   .then(data => { console.log(data)
    setAlbums(data.items)
  });

  //Display those albums to the user

  console.log(albums);
    
    
  }

  
   
  return (
    <div className="App">
     <Container>
       <InputGroup className="mb-3" size="lg"> 
        <FormControl
        placeholder='Search For Artist'
        type='input'
        onKeyPress={event =>{
          if(event.key == "Enter"){
           search();

          }
        }}
        onChange={event => setSearchInput(event.target.value)}
        
        />
        <Button onClick={search}>Search</Button>


       </InputGroup>
     </Container>
     <Container>
      <Row className="mx-2 row row-cols-4">
        {albums.map((album, i)=>{

          console.log(albums);
          return (
            <Card> 
             <Card.Img src = {album.images[0].url} />
             <Card.Body> 
               <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>

          )
        })}
      
      </Row>
      

     </Container>

      
    </div>
  );
}

export default App;
