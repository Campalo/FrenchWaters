# The underground French waters 
On this landing page, a French speaking user will discover the multitude of underground waters located over the French landscape. 
The user selects a departement, then sees a list of all the stations of measurement located in this specific departement, by clicking on one of the stations it displays the depth and altitude of the selected underground water station. 

## Open source API 
All the data used in this application is coming from the _Hub'eau_ open source API made available by the _Service Public d'Information sur l'Eau_ from the French governement. 

## Made with:
- [open source API piezometrie](https://hubeau.eaufrance.fr/page/api-piezometrie) from the French governement (for example [here](https://hubeau.eaufrance.fr/api/v1/qualite_nappes/stations?format=json&num_departement=06&page=1&size=5) is the response for the departement 06)
- [Ant design](https://ant.design/components/list/#components-list-demo-infinite-load) component library
- React.js
- CSS 
- Netlify
