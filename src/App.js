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
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


// const TTL = 1000*60*60*24 // one day in milisecond ; TTL = time to live




function App() {

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
      setLoading(false)
      setError(err.message) // TODO: Why error message not showing when fetch fail ?
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
  } // TODO: useEffect + catch error

  async function handleSelectStation(code, commune) {
    setselectedStation([code, commune]);
    await fetchMeasurementsByStation(code)
    setIsStationSelected(true);
  }

  const depth_text = "En mètres par rapport au repère de mesure (le sol, le haut du tube piézométrique, ...)";
  const altitude_text = "En mètres NGF (système de mesure des altitudes sur les cartes topographiques)";

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>

        <MainIntro />

        <SubNavigation />

        <section className="mainColumns padding-left">
        <div>
          <div className="intro">
            <h3><u>Départements</u></h3>
            <h3>Séléctionnez un département <br/> pour découvrir ses stations de mesure</h3>
          </div>
          {isloading ? <Spin/> :
            <div className="list">
              <DepartementList departements={depts} showStations={handleSelectDept}/>
            </div>
          }
          {error ? <p><i>{error}</i></p> : null}
        </div>
        {isDeptSelected ?
          <div className="middleCol">
              <div className="intro">
                <h3><u>Stations de mesure du département :</u></h3>
                <h3>{`${selectedDept.code} - ${selectedDept.nom}`}</h3>
                <p><i>Une commune peut avoir plusieurs stations.<br/>Seules les stations ayant effectué des relevés sont listées.</i></p>
              </div>
            <div className="list">
              <StationsListForOneDept stations={stations} showMeasurements={handleSelectStation}/>
            </div>
          </div>
        : ''}
        {isStationSelected ?
          <div className="padding-right">
            <div className="intro">
              <h3><u>Relevés de la station :</u></h3>
              <h3>{`${selectedStation[0]}`}<br/>située à {`${selectedStation[1]}`}</h3>
            </div>
            <div className="odometer-container card">
              <div>
                <h4 className="ant-list-item-meta-title">Profondeur de la nappe :</h4>
                <div className="odometer-units">
                  <Odometer format="(.ddd),dd" duration={1000} value={depth} />
                  <Tooltip title={depth_text}>
                    <span className="ant-list-item-meta-description units">mètres</span>
                    <span className="ant-list-item-meta-description tooltip"><QuestionCircleOutlined /></span>
                  </Tooltip>
                </div>
              </div>
              <div id="altitude">
                <h4 className="ant-list-item-meta-title">Altitude de la nappe :</h4>
                <div className="odometer-units">
                  <Odometer format="(.ddd),dd" duration={1000} value={altitude} />
                  <Tooltip title={altitude_text}>
                    <span className="ant-list-item-meta-description units">mètres</span>
                    <span className="ant-list-item-meta-description tooltip"><QuestionCircleOutlined /></span>
                  </Tooltip>
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




