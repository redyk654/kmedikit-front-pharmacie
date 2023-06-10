import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import '../Etats/Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import { useSpring, animated } from 'react-spring';
import { CFormSwitch, CFormSelect } from '@coreui/react';

import { genres, nomDns } from '../../shared/Globals';

export default function Recap(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const componentRef = useRef();
    const admin = "admin";
    const date_e = new Date('2024-12-15');
    const date_j = new Date();

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [historiqueSauvegarde, setHistoriqueSauvegarde] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [recetteReel, setRecetteReel] = useState(false);
    const [total, setTotal] = useState(false);
    const [recetteGenerique, setRecetteGenerique] = useState(0);
    const [recetteSp, setRecetteSp] = useState(0);
    const [messageErreur, setMessageErreur] = useState('');
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);
    const [caissier, setCaissier] = useState('');
    const [filtre, setFiltre] = useState(false);
    const [non_paye, setNonPaye] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {

        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 6000);
        }
    }, []);

    useEffect(() => {
        startChargement();

        if (dateDepart.length > 0) {

            let dateD = dateDepart;

            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recap.php?date_recap=${dateD}`);
            
            req.addEventListener('load', () => {
                // console.log(req.responseText);
                setMessageErreur('');
                const result = JSON.parse(req.responseText);

                setHistoriqueSauvegarde(result);
                sethistorique(result);
                stopChargement();
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });

            req.send();
        }

    }, [dateDepart, dateFin, search, filtre, caissier]);

    const rechercherHistorique = () => {
        // console.log(heure_select1.current.value);
        setSearch(!search);
        setdateDepart(date_select1.current.value);
    }    

    const calculerRecetteParGenre = (tab) => {

        let recetteG = tab.reduce((acc, curr) => {
            if (curr.genre === genres.generique) {
                return acc + parseInt(curr.prix_total)
            } else {
                return acc;
            }
        }, 0)

        let recetteS = tab.reduce((acc, curr) => {
            if (curr.genre === genres.specialite) {
                return acc + parseInt(curr.prix_total)
            } else {
                return acc;
            }
        }, 0)

        setRecetteGenerique(recetteG);
        setRecetteSp(recetteS);
    }

    return (
        <animated.div style={props1}>
            <section className="etats">
                <h1>Historique des ventes</h1>
                <div className="container-historique">
                    <div className="table-commandes">
                        <div className="entete-historique">
                            <div>
                                <p>
                                    <label htmlFor="recapitulatif">Récapitulatif du : </label>
                                    <input id="recapitulatif" type="date" ref={date_select1} />
                                </p>
                                <div className='p-2'>
                                    <button onClick={rechercherHistorique} className='bootstrap-btn'>Rechercher</button>
                                </div>
                            </div>
                        </div>
                        <div className='erreur-message'>{messageErreur}</div>

                        <table>
                            <thead>
                                <tr>
                                    {/* <td>Le</td>
                                    <td>À</td>
                                    <td>Par</td> */}
                                    <td>Désignation</td>
                                    <td>Qte sortie</td>
                                    {/* <td>Montant</td> */}
                                    {/* <td>Status</td> */}
                                </tr>
                            </thead>
                            <tbody>
                                {historique.length > 0 ? historique.map(item => (
                                    <tr>
                                        {/* <td>{mois(item.date_heure.substring(0, 10))}</td>
                                        <td>{item.date_heure.substring(11)}</td>
                                        <td>{item.nom_vendeur}</td> */}
                                        <td>{item.designation}</td>
                                        <td>{item.quantite}</td>
                                        {/* <td>{item.prix_total + ' Fcfa'}</td> */}
                                        {/* <td>{item.status_vente}</td> */}
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>
                    {/* <div style={{textAlign: 'center'}}>
                        <ReactToPrint
                            trigger={() => <button className='bootstrap-btn' style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div> */}
                </div>
            </section>
        </animated.div>
    )
}
