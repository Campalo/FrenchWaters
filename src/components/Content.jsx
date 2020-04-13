import React, { Fragment } from 'react';

function Content() {
    return (
        <Fragment>
            <h1>
                Qualité des nappes d'eau souterraines en France
            </h1>
            <p>
                Une nappe d'eau souterraine est une eau contenue dans les interstices ou les fissures d'une roche du sous-sol.
                <i>Selon la définition donnée par Hub'eau.</i>
            </p>
            <ul>
                Les mesures:
               <li>
                    Les niveaux d'eau sont exprimés en mètres NGF selon le même système que les altitudes sur les cartes topographiques ;
                </li>
               <li>
                    Les profondeurs d'eau sont exprimées en mètres par rapport au repère de mesure. Le repère peut être le sol, le haut du tube piézométrique ou la margelle du puits par exemple.
                </li>
            </ul>
            <p>
                Les stations de mesures de la qualité des eaux souterraines, aussi appelées <i>piézomètres</i> sont répartis sir l'ensemble du territoir français.
            </p>
        </Fragment>
    )
}

export default Content;