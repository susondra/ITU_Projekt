import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function App() {

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);


  //Make api call to news api
  async function getNewsData() {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make news api call using axios
    const resp = await axios.get("https://newsapi.org/v2/everything?q=Bitcoin&apiKey=828bf842c33f483bb89259b6304ecbc5&pageSize=10");
    {/*console.log(resp.data.articles)*/ }
    setNewsData(resp.data.articles);

    //Set loading boolean to false so that we know to show news articles
    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        {loading ? "Loading..." : <Container>

          {newsData.map((newsData, index) =>
            <Row className="d-flex justify-content-center">
              <Col xs={12} md={10} lg={8} className="mt-5" key={index}>
                <a target="_blank" href={newsData.url}>
                  <Card >
                    <Card.Body className="card-body">
                      {/*<div className="card-header">*/}
                      <Card.Title className="my-3">  {newsData.title}</Card.Title>
                      <Card.Img src={newsData.urlToImage} className="small-image" />
                      {/*</div>*/}

                    </Card.Body>
                    <Card.Footer>
                      <Card.Text>
                        {newsData.description}
                      </Card.Text>
                    </Card.Footer>
                  </Card>
                </a>
              </Col>
            </Row>
          )}

        </Container>
        }
      </header>
    </div>
  );
}

export default App;
