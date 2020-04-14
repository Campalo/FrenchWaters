import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import Content from './components/Content';

import { List, Avatar, Button } from 'antd';
import { Spin } from 'antd';
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
    const urlStationsByDept = `https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/stations?code_departement=${dept.code}&page=1`;
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
  const [depth, setDepth]=useState('');
  const [altitude, setAltitude]=useState('');

  async function fetchMeasurementsByStation(station) {
    const urlMeasurementsByStation = `https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques?code_bss=${station}&size=1&sort=desc`;
    const response = await fetch(urlMeasurementsByStation);
    const responseJson = await response.json();
    setDepth(responseJson.data[0].profondeur_nappe);
    setAltitude(responseJson.data[0].niveau_nappe_eau);
  }

  async function handleSelectStation(event) {
    await fetchMeasurementsByStation(event.target.value);
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
          {isloading ? <div className="icon"><Spin/></div> :
            <div className="list">
              <DepartementList isloading={isloading} departements={depts} showStations={handleSelectDept}/>
            </div>
          }
        </div>
        {isDeptSelected ?
          <div>
            <h2>Stations de mesures du département :<br/>{`${selectedDept.code} - ${selectedDept.nom}`}</h2>
            <p><i>Une commune peut avoir plusieurs stations.<br/>Seules les stations ayant effectué des relevés sont listées.</i></p>
            <div className="list">
              <StationsListForOneDept stations={stations} showMeasurements={handleSelectStation}/>
            </div>
          </div>
        : ''}
        {isStationSelected ?
          <div>
            <h2>Relevés</h2>
            <h3>Profondeur de la nappe</h3>
            <p>{depth} mètres</p>
            <h3>Altitude de la nappe</h3>
            <p>{altitude} mètres</p>
          </div>
        : ''}
      </section>

      </main>
    </div>
  );
}

export default App;


function DepartementList({departements, showStations}) {
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

function StationsListForOneDept({stations, showMeasurements}) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={stations}
      renderItem={station => ( station.nb_mesures_piezo > 0 ?
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://images.unsplash.com/photo-1533201357341-8d79b10dd0f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" />}
            title={`Piézomètre de ${station.nom_commune}`}
            description={station.date_fin_mesure !== null ? `Date du dernier relevé : ${station.date_fin_mesure}` : 'Date non communiquée'}
          />
           <div className="btn-list">
            <Button onClick={showMeasurements} value={station.code_bss}>Select</Button>
          </div>
        </List.Item>
        :
        <div className='hidden'></div> // Do not show the station if it does not have any measurements
      )}
    />
  )
}
