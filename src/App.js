import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import Content from './components/Content';
import { List, Avatar } from 'antd';
import 'antd/dist/antd.css';


const options = {
  root: null, //body
  rootMargin: '-80px 0px 0px 0px', // height of the header
  threshold: 1 //100% target has crossed the intersection
}

//SideNav effect
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

  // Get departements number and name
  const [depts, setDept] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( () => {
    async function fetchDepartements() {
      console.log('test')
      try {
        const urlDept = 'https://geo.api.gouv.fr/departements/';
        const response = await fetch(urlDept);
        const responseJson = await response.json();
        setDept(responseJson);
      } catch(err){
        setError(err.message)
      }
      setLoading(false)
    }
    fetchDepartements();
  }, []);


  // Get Stations number by departement
  const [stations, setStations] = useState([]);

  useEffect( () => {
    if (depts.length > 100) { // Wait for the 101 departements to be loaded before fetching the stations
      async function fetchCountStations() {
        console.log('depts.code', depts.map(dept => dept.code))
        try {
          const urls = depts.map( dept => `https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=${dept.code}`);
          const requests = urls.map( url => fetch(url) )
          const responses = await Promise.all(requests);
          const responsesJson = responses.map( response => response.json())
          const result = await Promise.all(responsesJson)
          setStations(result)
        } catch(err){
          console.log(err.message)
        }
      }
      fetchCountStations();
    }
  }, [depts]);

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />

        <p>Stations</p>
        <ul>
          {stations.map( (station, i) => <li key={depts[i].code}>{depts[i].code}: {station.count} stations</li>)}
        </ul>

        <h2>Departements</h2>
        {error ? <p><i>{error}</i></p> : null}
        <div className="list">
          <DepartementList isloading={isloading} departements={depts}/>
        </div>

      </main>
    </div>
  );
}

export default App;


function DepartementList({isloading, departements}) {
  if (isloading) {
    return <span>Loading...</span>
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={departements}
      renderItem={dept => ( // Equal to: departements.map( dept => <li>{dept.code}-{dept.nom}</li>)
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://images.unsplash.com/photo-1541103335697-086d3519c039?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=80" />}
            title={`${dept.code} - ${dept.nom}`}
            description="Nombre de stations"
            />
        </List.Item>
      )}
    />
  )
}