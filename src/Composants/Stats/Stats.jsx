import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import '../Etats/Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import ReactToPrint from 'react-to-print';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ImprimerStats from './ImprimerStats';
import { useSpring, animated } from 'react-spring';
import { nomDns } from '../../shared/Globals';

export default function Stats(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const componentRef = useRef();
    const admin = "admin";

    // let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();
    let mois_select = useRef()

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [historiqueSauvegarde, setHistoriqueSauvegarde] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [recetteTotal, setRecetteTotal] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [moisActu, setMoisActu] = useState('');
    const [search, setSearch] = useState(false);
    const [caissier, setCaissier] = useState('');
    const [filtre, setFiltre] = useState(false);
    const [non_paye, setNonPaye] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        startChargement();

        if (moisActu.length > 0) {

            const data = new FormData();
            data.append('mois', moisActu);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}stats.php`);
            
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                sethistorique(result);
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });

            req.send(data);
        }

        

    }, [moisActu]);

    const rechercherHistorique = () => {
        setSearch(!search);
        setMoisActu(mois_select.current.value);
    }

    return (
        <animated.div style={props1}>
        <section className="etats">
            <h1>Stats des produits</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                        <div>
                            <p>
                                <label htmlFor="">Du : </label>
                                <input type="month" ref={mois_select} />
                            </p>
                            <p style={{display: 'none'}}>
                                {
                                props.role === admin && 
                                <Fragment>
                                    <label htmlFor="filtre">Filtrer : </label>
                                    <input type="checkbox" id="filtre" checked={filtre} onChange={(e) => setFiltre(!filtre)} />
                                </Fragment>
                                }
                            </p>
                            <p style={{display: `${filtre ? 'block' : 'none'}`}}>
                            <p>
                                <label htmlFor="non_paye">non payés : </label>
                                <input type="checkbox" id="non_paye" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                            </p>
                            <label htmlFor="">Vendeur : </label>
                                <select name="caissier" id="caissier" onChange={(e) => setCaissier(e.target.value)}>
                                    {props.role !== admin ? 
                                    <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> :
                                    listeComptes.map(item => (
                                        <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                        <button className='bootstrap-btn' onClick={rechercherHistorique}>rechercher</button>
                    </div>
                    <div className='erreur-message'>{messageErreur}</div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Qte sortie</td>
                                <td>Qte entrée</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 ? historique.map(item => (
                                <tr>
                                    <td>{item.designation}</td>
                                    <td style={{fontWeight: 'bold',}}>{item.qte_out}</td>
                                    <td style={{fontWeight: 'bold',}}>{item.qte_in}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
                {historique.length > 0 && (
                    <div style={{textAlign: 'center'}}>
                        <ReactToPrint
                            trigger={() => <button className='bootstrap-btn' style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600', margin: '15px'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                )}
            </div>
            <div style={{display: 'none'}}>
                <ImprimerStats
                    ref={componentRef}
                    historique={historique}
                    moisActu={moisActu}
                />
            </div>
        </section>
        </animated.div>
    )
}
