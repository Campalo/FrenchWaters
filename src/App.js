import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import Content from './components/Content';


const options = {
  root: null, //body
  rootMargin: '-80px 0px 0px 0px', // height of the header
  threshold: 1 //100% target has crossed the intersection
}

const observer = new IntersectionObserver(([intersection]) => {
  const enterTop = intersection.isIntersecting && intersection.intersectionRect.top <= 80 + intersection.target.clientHeight;
  const leaveTop = !intersection.isIntersecting && intersection.intersectionRect.top <= 80;

  if (enterTop) {
    const navigation = document.getElementById('nav');
    navigation.classList.remove('hidden')
  }
  if (leaveTop) {
    const navigation = document.getElementById('nav');
    navigation.classList.add('hidden')
  }
}, options);


function App() {

  //SideNav effect
  useEffect(() => {
   const subNavigation = document.getElementById('subNav');
   observer.observe(subNavigation)
  });

  const departements = new Array (95)
    .fill("")
    .map( (_, index) => (index + 1).toString() )
    .concat(["971", "972", "973", "974", "976"])

  departements.splice(19, 1, "2A", "2B")

  console.log(departements)

  const [stations, setStations] = useState([]);
  let hasFetched = false;

  // TODO : stop infinite loop
  async function fetchCountStations() {
    const urls = departements.map( dept => `https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=${dept}`);
    const requests = urls.map( url => fetch(url) )
    const responses = await Promise.all(requests);
    const responsesJson = responses.map( response => response.json())
    const result = await Promise.all(responsesJson)
    setStations(result)
    console.log(stations)
  }

  useEffect(() => {
    fetchCountStations();
  });

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />
        <p>Departements</p>
        <ul>
          {stations.map( (station, i) => (<li>{departements[i]}: {station.count} stations</li>))}
        </ul>
        <br></br>
      </main>
    </div>
  );
}

export default App;
