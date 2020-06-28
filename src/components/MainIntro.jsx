import React from 'react';
import './MainIntro.css';

function MainIntro() {
  return (
    <section className="containerMainIntro">
      <div className="content padding-left">
        <div>
          <p>
          Les eaux souterraines sont composées de l’ensemble des réserves d’eau stockées dans les roches poreuses et perméables du sous-sol.
          </p>
          <p>
          L’eau s’infiltre dans le sol, puis dans les interstices poreux du sous-sol ;
          lorsque son parcours est interrompu par un substrat imperméable elle commence alors à s’accumuler dans les espaces vides
          pour former une nappe. La profondeur des nappes peut atteindre jusqu’à parfois plus de 1000 mètres.
          Certaines sont aussi très proches de la surface, ce sont les nappes phréatiques.
          </p>
          <p>
          Le niveau et la qualité des nappes sont régulièrement mesurés dans les stations, aussi appelées <i>piézomètres</i>,
          présentes sur l’ensemble du territoire français.
          </p>
          <div className="api">
            <img src="../../iconAPI.svg" alt="icon API Hubeau" />
            <p>
              <i>
                L'ensemble des données présentées sont mises à disposition par
                le Service Public d'Information sur l'Eau via{" "}
                <a href="https://hubeau.eaufrance.fr/page/api-piezometrie">
                  l'API Hub'eau
                </a>.
              </i>
            </p>
          </div>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1500440148957-7651acaa127f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=60"
        alt="eau souterraine"
      />
    </section>
  );
}

export default MainIntro;