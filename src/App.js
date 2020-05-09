import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import MainIntro from './components/MainIntro';
import DepartementList from './components/DepartementList';
import StationsListForOneDept from './components/StationList';

import Spin from './components/Spin';
import 'antd/dist/antd.css';

import Odometer from 'react-odometerjs';
import './components/Odometer.css';
import "odometer/themes/odometer-theme-default.css";


// const TTL = 1000*60*60*24 // one day in milisecond ; TTL = time to live

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
      // const fromStorage = localStorage.getItem("data")
      // const createddAt = localStorage.getItem("createdAt")
      // const  belowTTL = createddAt && (Date.now() - parseInt(createddAt, 10)) <  TTL

      // if (fromStorage && belowTTL) {
      //   const everything = JSON.parse(fromStorage)
      //   setDept(everything)
      //   setLoading(false)
      // } else {
        const depts = await fetchDepartements();
        const requests = await depts.map(dept => fetchStationsByDepartement(dept));
        const everything = await Promise.all(requests) // array with all departements and info of the station for each of them
        setDept(everything)
        setLoading(false)
      //   localStorage.setItem("data", JSON.stringify(everything))
      //   localStorage.setItem("createdAt", Date.now().toString()) // today's date in milisecond
      // }
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
  const [selectedStation, setselectedStation]=useState([]);
  const [depth, setDepth]=useState(0);
  const [altitude, setAltitude]=useState(0);

  async function fetchMeasurementsByStation(station) {
    const urlMeasurementsByStation = `https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques?code_bss=${station}&size=1&sort=desc`;
    const response = await fetch(urlMeasurementsByStation);
    const responseJson = await response.json();
    setDepth(responseJson.data[0].profondeur_nappe);
    setAltitude(responseJson.data[0].niveau_nappe_eau);
  }

  async function handleSelectStation(code, commune) {
    setselectedStation([code, commune]);
    await fetchMeasurementsByStation(code)
    setIsStationSelected(true);
  }

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>

        <MainIntro />

        <SubNavigation />

        <section className="mainColumns">
        <div>
          <div className="intro">
            <h2>Departements</h2>
            <h3>Séléctionnez un département <br/> pour découvrir ses stations de mesure</h3>
          </div>
          {error ? <p><i>{error}</i></p> : null}
          {isloading ? <Spin/> :
            <div className="list">
              <DepartementList departements={depts} showStations={handleSelectDept}/>
            </div>
          }
        </div>
        {isDeptSelected ?
          <div>
              <div className="intro">
                <h2>Stations de mesure du département :</h2>
                <h3>{`${selectedDept.code} - ${selectedDept.nom}`}</h3>
                <p><i>Une commune peut avoir plusieurs stations.<br/>Seules les stations ayant effectué des relevés sont listées.</i></p>
              </div>
            <div className="list">
              <StationsListForOneDept stations={stations} showMeasurements={handleSelectStation}/>
            </div>
          </div>
        : ''}
        {isStationSelected ?
          <div>
            <div className="intro">
              <h2>Relevés de la station:</h2>
              <h3>{`${selectedStation[0]}`}<br/>située à {`${selectedStation[1]}`}</h3>
            </div>
            <div className="odometer-container card">
              <div>
                <h4 className="ant-list-item-meta-title">Profondeur de la nappe :</h4>
                <div className="odometer-units">
                  <Odometer format="(.ddd),dd" duration={1000} value={depth} />
                  <span className="ant-list-item-meta-description units">mètres</span>
                </div>
              </div>
              <div id="altitude">
                <h4 className="ant-list-item-meta-title">Altitude de la nappe :</h4>
                <div className="odometer-units">
                  <Odometer format="(.ddd),dd" duration={1000} value={altitude} />
                  <span className="ant-list-item-meta-description units">mètres</span>
                </div>
             </div>
            </div>
          </div>
        : ''}
      </section>

      </main>
    </div>
  );
}

export default App;




