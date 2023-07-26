import React, { useState, useContext } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import Entrees from './Entrees';
import Sorties from './Sorties';
import '../Maj/Maj.css';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';

export default function Operations(props) {

    const { darkLight } = useContext(ContextChargement)
    const [onglet, setOnglet] = useState(1);

    let contenu;

    switch(onglet) {
        case 1:
          contenu = <Entrees nomConnecte={props.nomConnecte} />
          break;
        case 2:
          contenu = <Sorties nomConnecte={props.nomConnecte} />
          break;
        default:
          break;
      }

  return (
    <section className="conteneur-sous-onglets">
        <div className="onglets-blocs" style={{width: '25%', fontSize: '10px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
                <CIcon icon={cilArrowBottom} size={'sm'} />
                &nbsp;
                Entrées
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
                <CIcon icon={cilArrowTop} size={'sm'} />
                &nbsp;
                Sorties
            </div>
        </div>
        <div className="onglets-contenu">
            {contenu}
        </div>
    </section>
  )
}
