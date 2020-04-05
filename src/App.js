import React, {useEffect, useState} from 'react';
import './App.css';
import Navigation from './components/Navigation';
import SubNavigation from './components/SubNavigation';
import Content from './components/Content';
import { List, Avatar, Button } from 'antd';
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
      const depts = await fetchDepartements();
      const requests = await depts.map(dept => fetchStationsByDepartement(dept));
      const everything = await Promise.all(requests) // array with all departements and info of the station for each of them
      setDept(everything)
      console.log(everything)
      setLoading(false)
    }

    try {
      fetchEverything()
    } catch(err){
      setError(err.message)
      setLoading(false)
    }
  }, []);

  const [isDeptSelected, setIsDeptSelected]=useState(false);
  const [stations, setStations]=useState([]);

  function handleSelectDept(event) {
    setIsDeptSelected(true);
    const selectedDept = depts.find( dept => dept.code === event.target.value)
    setStations(selectedDept.data);
  }

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />

      <section className="twoColumns">
        <div>
          <h2>Departements</h2>
          {error ? <p><i>{error}</i></p> : null}
          <div className="list">
            <DepartementList isloading={isloading} departements={depts} showMesurements={handleSelectDept}/>
          </div>
        </div>
        {isDeptSelected ?
          <div>
            <h2>Station selectionnée pour les mesures</h2>
            <h3>Nom departement selectionne</h3>
            <div className="list">
              <StationsListForOneDept isloading={isloading} stations={stations}/>
            </div>
          </div>
        : 'Choisissez un département'}
      </section>

      </main>
    </div>
  );
}

export default App;


function DepartementList({isloading, departements, showMesurements}) {
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
            <Button onClick={showMesurements} value={dept.code}>Select</Button>
          </div>
        </List.Item>
      )}
    />
  )
};

function StationsListForOneDept({isloading, stations}) { //WIP
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
            title={`Piézomètre: ${station.code_bss}`}
            description="Profondeur nappe et altitude de la nappe"
          />
        </List.Item>
      )}
    />
  )
}
