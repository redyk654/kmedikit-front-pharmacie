import React, { useState, useContext } from 'react';
import Historique from '../Historique/Historique';
import '../Maj/Maj.css';
import { AiFillSave } from 'react-icons/ai';
import { TbActivity } from "react-icons/tb";
import { ContextChargement } from '../../Context/Chargement';
import Bordereau from '../Bordereau/Bordereau';
import { FaClipboardList, FaList } from 'react-icons/fa';


export default function Dispensaire(props) {

    const {darkLight} = useContext(ContextChargement)
    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <Historique nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <Bordereau nomConnecte={props.nomConnecte} />
        break;
      default:
        break;
    }

    return (
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '40%', fontSize: '10px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
              <FaClipboardList size={18} />
              &nbsp;
              Fiche des stocks
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
              <FaList size={17} />
              &nbsp;
              Commandes
            </div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
    )
}
