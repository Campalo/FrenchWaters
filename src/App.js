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

  // const departements = new Array (95)
  //   .fill("")
  //   .map( (_, index) => (index + 1).toString() )
  //   .concat(["971", "972", "973", "974", "976"])

  // departements.splice(19, 1, "2A", "2B")

  // const [stations, setStations] = useState([]);
  // const [deptName, setDeptName] = useState([]);

  // TODO : stop infinite loop
  // async function fetchCountStations() {
  //   const urls = departements.map( deptTest => `https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=${dept}`);
  //   const requests = urls.map( url => fetch(url) )
  //   const responses = await Promise.all(requests);
  //   const responsesJson = responses.map( response => response.json())
  //   const result = await Promise.all(responsesJson)
  //   setStations(result)
  //   setDeptName(result)
    // console.log('stations', stations)
    // console.log('deptName', deptName)
    // if (deptName.length > 0){
    //   console.log('deptName-one', deptName[10].data[0].nom_departement)
    // }
  // }

  // useEffect(() => {
  //   fetchCountStations();
  // });

  // TEST
  const [deptsTest, setDeptTest] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDepartements() {
    console.log('test')
    try {
      const urlDept = 'https://geo.api.gouv.fr/departements/';
      const response = await fetch(urlDept);
      const responseJson = await response.json();
      setDeptTest(responseJson);
    } catch(err){
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect( () => {
    fetchDepartements();
  }, []);

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />
        {/* <p>Departements</p>
        <ul>
          {stations.map( (station, i) => <li>{departements[i]}: {station.count} stations</li>)}
        </ul>
        <br></br> */}

        <p>Departements</p>

        {error ? <p>{error}</p> : null}

        {!isloading ? (
          deptsTest.map( deptTest => {
            const { code, nom } = deptTest ;
            return (
              <ul key={code}>
                <li>{code} - {nom}</li>
              </ul>
            )
          })
        ) : (
          <span>Loading...</span>
        )}

      </main>
    </div>
  );
}

export default App;
