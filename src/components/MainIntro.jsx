import React from 'react';
import './MainIntro.css';

function MainIntro() {
  return (
    <section className="containerMainIntro">
      <div className="content">
        <div>
            <p>
            Une nappe d'eau souterraine est une eau contenue dans les interstices
            ou les fissures d'une roche du sous-sol.
            <i>Selon la définition donnée par Hub'eau.</i>
            </p>
            <ul>
            Les mesures:
            <li>
                Les niveaux d'eau sont exprimés en mètres NGF selon le même système
                que les altitudes sur les cartes topographiques ;
            </li>
            <li>
                Les profondeurs d'eau sont exprimées en mètres par rapport au repère
                de mesure. Le repère peut être le sol, le haut du tube piézométrique
                ou la margelle du puits par exemple.
            </li>
            </ul>
            <p>
            Les stations de mesures de la qualité des eaux souterraines, aussi
            appelées <i>piézomètres</i> sont répartis sir l'ensemble du territoir
            français.
            </p>
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