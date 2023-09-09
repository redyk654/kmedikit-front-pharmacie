import React, { useState, useContext } from 'react';
// import '../Maj/Maj.css';
import { AiFillSave } from 'react-icons/ai';
import { TbActivity } from "react-icons/tb";
import { ContextChargement } from '../../Context/Chargement';
import ActivitesMag from './ActivitesMag';
import InventairesMag from './InventairesMag';

export default function FicheStockMag(props) {

    const {darkLight} = useContext(ContextChargement)
    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <ActivitesMag nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <InventairesMag nomConnecte={props.nomConnecte} />
        break;
      default:
        break;
    }

    return (
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '40%', fontSize: '10px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
              <TbActivity size={20} />
              &nbsp;
              Activites
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
              <AiFillSave size={19} />
              &nbsp;
              Sauvegardes inventaires
            </div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
    )
}
