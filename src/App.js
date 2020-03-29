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
  console.log(intersection)
  const enterTop = intersection.isIntersecting && intersection.intersectionRect.top <= 80 + intersection.target.clientHeight;
  const leaveTop = !intersection.isIntersecting && intersection.intersectionRect.top <= 80;

  if (enterTop) {
    console.log('entertop')
    const navigation = document.getElementById('nav');
    navigation.classList.remove('hidden')
  }
  if (leaveTop) {
    console.log('leavetop')
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

  const [hasError, setErrors] = useState(false);
  const [departments, setDepartments] = useState({});

  async function fetchDepartments() {
    const response = await fetch("https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=44&size=10");
    response
      .json()
      .then( response => setDepartments(response) )
      .catch( error => setErrors(error) )
  }

  useEffect(() => {
    fetchDepartments();
  });

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main>
        <Content />
        <SubNavigation />
        <p>{JSON.stringify(departments)}</p>
        <br></br>
        <span>Error: {JSON.stringify(hasError)}</span>
      </main>
    </div>
  );
}

export default App;
