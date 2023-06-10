import React, { useState, useContext } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import ModifierProduit from '../ModifierProduit/ModifierProduit';
import Operations from './Operations';
import '../Maj/Maj.css';
import { FaList, FaPen, FaClipboardList } from 'react-icons/fa';
import CIcon from '@coreui/icons-react';
import { cilSwapVertical, cilSpreadsheet, cilNotes } from '@coreui/icons';
import FicheStockMag from './FicheStockMag';
import BordereauMag from './BordereauMag';
import Recap from './Recap';

export default function Magasin(props) {

    const { darkLight } = useContext(ContextChargement)
    const [onglet, setOnglet] = useState(1);

    let contenu;

    switch(onglet) {
        case 1:
          contenu = <Operations nomConnecte={props.nomConnecte} />
          break;
        case 2:
          contenu = <ModifierProduit />
          break;
        case 3:
          contenu = <BordereauMag nomConnecte={props.nomConnecte} />
          break;
        case 4:
            contenu = <FicheStockMag nomConnecte={props.nomConnecte} />
            break;
        case 5:
            contenu = <Recap nomConnecte={props.nomConnecte} />
            break;
        default:
            break;
      }

  return (
    <section className="conteneur-sous-onglets">
        <div className="onglets-blocs" style={{width: '70%', fontSize: '10px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
                <CIcon content={cilSwapVertical} size={'lg'} />
                &nbsp;
                Opérations
            </div>
            <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(3)}}>
                <FaList size={15} />
                &nbsp;
                Commandes
            </div>
            <div className={`tab ${onglet === 4 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(4)}}>
                <FaClipboardList size={16} />
                &nbsp;
                Fiches des stocks
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
                <FaPen size={14} />
                &nbsp;
                Modifier infos
            </div>
            <div className={`tab ${onglet === 5 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(5)}}>
                <CIcon content={cilNotes} size={'lg'} />
                &nbsp;
                Récap
            </div>
        </div>
        <div className="onglets-contenu">
            {contenu}
        </div>
    </section>
  )
}
