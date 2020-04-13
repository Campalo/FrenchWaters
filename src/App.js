import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import Content from './components/Content';
import { List, Avatar, Button } from 'antd';
import 'antd/dist/antd.css';

const TTL = 1000*60*60*24 // one day in milisecond ; TTL = time to live

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

  const [depts, setDept] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDepartements() {
    const urlDept = 'https://geo.api.gouv.fr/departements/';
    const response = await fetch(urlDept);
    const responseJson = await response.json();
    return responseJson;
  }

  async function fetchStationsByDepartement(dept) {
    const urlStationsByDept = `https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=${dept.code}&page=1&size=10`;
    const response = await fetch(urlStationsByDept);
    const responseJson = await response.json();
    return {...responseJson, ...dept};
  }

  useEffect( () => {
    async function fetchEverything() {
      const fromStorage = localStorage.getItem("data")
      const createddAt = localStorage.getItem("createdAt")
      const  belowTTL = createddAt && (Date.now() - parseInt(createddAt, 10)) <  TTL

      if (fromStorage && belowTTL) {
        const everything = JSON.parse(fromStorage)
        setDept(everything)
        setLoading(false)
      } else {
        const depts = await fetchDepartements();
        const requests = await depts.map(dept => fetchStationsByDepartement(dept));
        const everything = await Promise.all(requests) // array with all departements and info of the station for each of them
        setDept(everything)
        setLoading(false)
        localStorage.setItem("data", JSON.stringify(everything))
        localStorage.setItem("createdAt", Date.now().toString()) // today's date in milisecond
      }
    }

    try {
      fetchEverything()
    } catch(err) {
      setError(err.message)
      setLoading(false)
    }
  }, []);

  const [isDeptSelected, setIsDeptSelected]=useState(false);
  const [selectedDept, setSelectedDept]=useState('');
  const [stations, setStations]=useState([]);

  function handleSelectDept(event) {
    const selectedDepartement = depts.find( dept => dept.code === event.target.value)
    setIsDeptSelected(true);
    setSelectedDept(selectedDepartement)
    setStations(selectedDepartement.data);
    setIsStationSelected(false)
  }

  const [isStationSelected, setIsStationSelected]=useState(false);
  const [selectedStation, setSelectedStation]=useState('');
  const [depth, setDepth]=useState('');
  const [altitude, setAltitude]=useState('');

  function handleSelectStation(event) {
    setIsStationSelected(true);
  }

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />

      <section className="mainColumns">
        <div>
          <h2>Departements</h2>
          <h3>Séléctionnez un département <br/> pour découvrir ses stations de mesure</h3>
          {error ? <p><i>{error}</i></p> : null}
          <div className="list">
            <DepartementList isloading={isloading} departements={depts} showStations={handleSelectDept}/>
          </div>
        </div>
        {isDeptSelected ?
          <div>
            <h2>Stations de mesures du département :<br/>{`${selectedDept.code} - ${selectedDept.nom}`}</h2>
            <p><i>10 premières stations uniquement</i></p>
            <div className="list">
              <StationsListForOneDept isloading={isloading} stations={stations} showMeasurements={handleSelectStation}/>
            </div>
          </div>
        : ''}
        {isStationSelected ?
          <div>
            <h2>Mesures</h2>
            <h3>Profondeur de la nappe en mètre</h3>
            <p></p>
            <h3>Altitude de la nappe en mètre</h3>
            <p></p>
          </div>
        : ''}
      </section>

      </main>
    </div>
  );
}

export default App;


function DepartementList({isloading, departements, showStations}) {
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
            avatar={<Avatar src="https://images.unsplash.com/photo-1541103335697-086d3519c039?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" />}
            title={`${dept.code} - ${dept.nom}`}
            description={`${dept.count} stations`}
          />
          <div className="btn-list">
            <Button onClick={showStations} value={dept.code}>Select</Button>
          </div>
        </List.Item>
      )}
    />
  )
};

function StationsListForOneDept({isloading, stations, showMeasurements}) {
  if (isloading) {
    return <span>Loading...</span>
  }
  return (
    <List
      itemLayout="horizontal"
      dataSource={stations}
      renderItem={station => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://images.unsplash.com/photo-1533201357341-8d79b10dd0f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" />}
            title={`Piézomètre de ${station.nom_commune}`}
            description={station.date_debut_mesure !== null ? `Relevés sur la période du ${station.date_debut_mesure} au ${station.date_fin_mesure}` : 'Dates non communiquées'}
          />
           <div className="btn-list">
            <Button onClick={showMeasurements} value={station.code_bss}>Select</Button>
          </div>
        </List.Item>
      )}
    />
  )
}
