import './App.css';
import { Fragment, useState, useEffect, useContext } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css'
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';
import Etats from './Composants/Etats/Etats';
import Stats from './Composants/Stats/Stats.jsx';
import { FaChartBar, FaClipboardList, FaLayerGroup, FaReceipt, FaStore, FaUsers } from 'react-icons/fa';
import { ContextChargement } from './Context/Chargement';
import ListeProduits from './Composants/ListeProduits/ListeProduits';
import FactureManuelle from './Composants/FactureManuelle/FactureManuelle';
import { ROLES, liensPhilmedical } from "./shared/Globals";
import Magasin from './Composants/Magasin/Magasin';
import Dispensaire from './Composants/Dispensaire/Dispensaire';
import CIcon from '@coreui/icons-react';
import { cilMedicalCross } from '@coreui/icons';
import Historique from './Composants/Historique/Historique';


function App() {

  const {darkLight, role, setRole} = useContext(ContextChargement)

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');

  useEffect(() => {
    if(role === ROLES.admin) {
      setOnglet(6);
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 2:
      contenu = <Dispensaire nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 3:
      contenu = <Magasin nomConnecte={nomConnecte} />
      break;
    case 4:
      contenu = <Comptes nomConnecte={nomConnecte} />
      break;
    case 5:
      contenu = <GestionFactures nomConnecte={nomConnecte} />
      break;
    case 6:
      contenu = <Etats nomConnecte={nomConnecte} role={role} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 7:
      contenu = <Stats nomConnecte={nomConnecte} />
      break;
    case 8:
      contenu = <FactureManuelle nomConnecte={nomConnecte} />
      break;
    case 9:
      contenu = <Historique nomConnecte={nomConnecte} />
      break;
  }

  const changerOnglet = (onglet) => {
    setOnglet(onglet);
  }

  if (connecter) {
    if(role === ROLES.admin) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '97%', fontSize: '11px'}}>
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(6)}}>
                <FaReceipt size={18} />
                &nbsp;
                Etats
              </div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}  ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(2)}}>
                <CIcon icon={cilMedicalCross} size={'lg'} />
                &nbsp;
                Dispensation
              </div>
              <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(3)}}>
                <FaLayerGroup size={18} />
                &nbsp;
                Magasin
              </div>
              <div className={`tab ${onglet === 4 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(4)}}>
                <FaUsers size={20} />
                &nbsp;
                Comptes
              </div>
              <div className={`tab ${onglet === 7 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(7)}}>
                <FaChartBar size={19} />
                &nbsp;
                Statistiques
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === ROLES.major) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '90%', fontSize: '10px'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(1)}}>
                <FaStore size={22} />
                &nbsp;
                Ventes
              </div>
              {/* <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(3)}}>
                <FaLayerGroup size={22} />
                &nbsp;
                Gestion des stocks
              </div> */}
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(6)}}>
                <FaReceipt size={22} />
                &nbsp;
                Etats
              </div>
            <div className={`tab ${onglet === 8 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(8)}}>
                <FaReceipt size={22} />
                &nbsp;
                Factures Manuelles
            </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
            <div className={`tab ${onglet === 9 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(9)}}>
              <FaClipboardList size={18} />
              &nbsp;
              Fiche des stocks
            </div>
          </section>
        </main>
      );
    } else if (role === ROLES.vendeur) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{ fontSize: '8px'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(1)}}>
                <FaStore size={22} />
                &nbsp;
                Ventes
              </div>
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(6)}}>
                <FaClipboardList size={22} />
                &nbsp;
                Etats
              </div>
              <div className={`tab ${onglet === 8 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {changerOnglet(8)}}>
                <FaReceipt size={22} />
                &nbsp;
                Factures Manuelles
              </div>
              <div className={`tab ${onglet === 9 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(9)}}>
                <FaClipboardList size={18} />
                &nbsp;
                Fiche des stocks
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === ROLES.medecin) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <ListeProduits />
        </main>
      );
    } else {
      <main className='app text-center'>
          <div className='float-start px-3'>
                <a href={`${liensPhilmedical.acceuil}`} className='link-dark' role='button'>
                    retour à l'accueil
                </a>
          </div>
          <strong className='text-bg-danger text-light'>
            Vous n'avez pas les droits pour accéder à cette page.
          </strong>
        </main>
    }
  } else {
    return (
      <Connexion
        connecter={connecter}
        setConnecter={setConnecter}
        nomConnecte={nomConnecte}
        setNomConnecte={setNomConnecte}
        role={role}
        setRole={setRole}
      />
    )
  }
}

export default App;