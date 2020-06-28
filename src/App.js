import React, { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import SubNavigation from "./components/SubNavigation";
import MainIntro from "./components/MainIntro";
import DepartementList from "./components/DepartementList";
import StationsListForOneDept from "./components/StationList";

import Spin from "./components/Spin";
import "antd/dist/antd.css";

import Odometer from "react-odometerjs";
import "./components/Odometer.css";
import "odometer/themes/odometer-theme-default.css";
import { Tooltip, Button } from "antd";
import { QuestionCircleOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";


function App() {
  const [depts, setDept] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDepartements() {
    const urlDept = "https://geo.api.gouv.fr/departements/";
    const response = await fetch(urlDept);
    const responseJson = await response.json();
    return responseJson;
  }

  async function fetchStationsByDepartement(dept) {
    const urlStationsByDept = `https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/stations?code_departement=${dept.code}&page=1`;
    const response = await fetch(urlStationsByDept);
    const responseJson = await response.json();
    return { ...responseJson, ...dept };
  }

  useEffect(() => {
    async function fetchEverything() {
      const depts = await fetchDepartements();
      const requests = await depts.map((dept) =>
        fetchStationsByDepartement(dept)
      );
      const everything = await Promise.all(requests); // array with all departements and info of the station for each of them
      setDept(everything);
      setLoading(false);
    }

    try {
      fetchEverything();
    } catch (err) {
      setLoading(false);
      setError(err.message); // TODO: Why error message not showing when fetch fail ?
    }
  }, []);

  const [activeColumn, setActiveColumn] = useState(0);

  const [isDeptSelected, setIsDeptSelected] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [stations, setStations] = useState([]);

  function handleSelectDept(event) {
    const selectedDepartement = depts.find(
      (dept) => dept.code === event.target.value
    );
    setIsDeptSelected(true);
    setSelectedDept(selectedDepartement);
    setStations(selectedDepartement.data);
    setIsStationSelected(false);
    setActiveColumn(1);
  }

  const [isStationSelected, setIsStationSelected] = useState(false);
  const [selectedStation, setselectedStation] = useState([]);
  const [depth, setDepth] = useState(0);
  const [altitude, setAltitude] = useState(0);

  async function fetchMeasurementsByStation(station) {
    const urlMeasurementsByStation = `https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques?code_bss=${station}&size=1&sort=desc`;
    const response = await fetch(urlMeasurementsByStation);
    const responseJson = await response.json();
    setDepth(responseJson.data[0].profondeur_nappe);
    setAltitude(responseJson.data[0].niveau_nappe_eau);
  }

  async function handleSelectStation(code, commune) {
    setselectedStation([code, commune]);
    await fetchMeasurementsByStation(code);
    setIsStationSelected(true);
    setActiveColumn(2);
  }

  function goBack() {
    if (activeColumn > 0){
      setActiveColumn(activeColumn -1)
    }
  }

  function goNext() {
    const canViewAllColumns = isStationSelected && activeColumn < 2;
    const canViewOnlyColumnOneAndTwo = isDeptSelected && !isStationSelected && activeColumn < 1;

    if (canViewOnlyColumnOneAndTwo || canViewAllColumns) {
      setActiveColumn(activeColumn +1)
    }
  }

  const depth_text =
    "En mètres par rapport au repère de mesure (le sol, le haut du tube piézométrique, ...)";
  const altitude_text =
    "En mètres NGF (système de mesure des altitudes sur les cartes topographiques)";

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <MainIntro />
        <SubNavigation />
        <section
          className="mainColumns padding-left padding-right"
          style={{ "--activeColumn": activeColumn }}
        >
          <article>
            <div className="intro">
              <h3>
                <u>Départements</u>
              </h3>
              <h3>
                Séléctionnez un département <br /> pour découvrir ses stations
                de mesure
              </h3>
            </div>
            {isloading ? (
              <Spin />
            ) : (
              <div className="list">
                <DepartementList
                  departements={depts}
                  showStations={handleSelectDept}
                />
              </div>
            )}
            {error ? (
              <p>
                <i>{error}</i>
              </p>
            ) : null}
          </article>
          <article className="middleCol">
            {isDeptSelected ? (
              <div>
                <div className="intro">
                  <h3>
                    <u>Stations de mesure</u>
                  </h3>
                  <h3>{`${selectedDept.code} - ${selectedDept.nom}`}</h3>
                  <p>
                    <i>
                      Une commune peut avoir plusieurs stations. Seules les stations ayant effectué des relevés sont
                      listées.
                    </i>
                  </p>
                </div>
                <div className="list">
                  <StationsListForOneDept
                    stations={stations}
                    showMeasurements={handleSelectStation}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </article>
          <article>
            {isStationSelected ? (
              <div>
                <div className="intro">
                  <h3>
                    <u>Relevés de la station</u>
                  </h3>
                  <h3>
                    {`${selectedStation[0]}`}
                    <br />
                    située à {`${selectedStation[1]}`}
                  </h3>
                </div>
                <div className="odometer-container card">
                  <div>
                    <h4 className="ant-list-item-meta-title">
                      Profondeur de la nappe :
                    </h4>
                    <div className="odometer-units">
                      <Odometer
                        format="(.ddd),d"
                        duration={1000}
                        value={depth}
                      />
                      <Tooltip title={depth_text}>
                        <span className="ant-list-item-meta-description units">
                          mètres
                        </span>
                        <span className="ant-list-item-meta-description tooltip">
                          <QuestionCircleOutlined />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  <div id="altitude">
                    <h4 className="ant-list-item-meta-title">
                      Altitude de la nappe :
                    </h4>
                    <div className="odometer-units">
                      <Odometer
                        format="(.ddd),d"
                        duration={1000}
                        value={altitude}
                      />
                      <Tooltip title={altitude_text}>
                        <span className="ant-list-item-meta-description units">
                          mètres
                        </span>
                        <span className="ant-list-item-meta-description tooltip">
                          <QuestionCircleOutlined />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </article>
        </section>
        <section className="padding-left">
          <Button shape="circle" icon={<LeftOutlined />} onClick={goBack}></Button>
          <Button shape="circle" icon={<RightOutlined />} onClick={goNext}></Button>
        </section>
      </main>
    </div>
  );
}

export default App;
