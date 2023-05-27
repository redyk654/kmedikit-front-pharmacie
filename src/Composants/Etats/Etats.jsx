import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import './Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import ImprimerEtat from './ImprimerEtat';
import { useSpring, animated } from 'react-spring';
import { CFormSwitch, CFormSelect } from '@coreui/react';

import { genres } from '../../shared/Globals';

export default function Etats(props) {

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
        !recetteTotal && sethistorique([])
    }, [recetteTotal]);

    useEffect(() => {
        startChargement();

        if (dateDepart.length > 0 && dateFin.length > 0) {

            let dateD = dateDepart;
            let dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);

            const req = new XMLHttpRequest();
            if (props.role !== admin) {
                req.open('POST', `http://serveur/backend-cmab/etats.php?vendeur=${props.nomConnecte}`);
            } else {
                if (filtre) {
                    req.open('POST', `http://serveur/backend-cmab/etats.php?vendeur=${caissier}`);
                } else {
                    req.open('POST', `http://serveur/backend-cmab/etats.php`);
                }
            }
            
            req.addEventListener('load', () => {
                setMessageErreur('');
                const result = JSON.parse(req.responseText);

                setHistoriqueSauvegarde(result);
                
                stopChargement();
                let recette = 0;
                if (result.length > 0) {
                    recupererRecetteReel(dateD, dateF);
                    if (props.role !== admin) {
                        setFiltre(true);
                        setCaissier(props.nomConnecte);
                    } else {
                        let tab = result.filter(item => (item.status_vente === "payé"));
                        sethistorique(tab);
                        recette = tab.reduce((acc, curr) => acc + parseInt(curr.prix_total), 0);

                        calculerRecetteParGenre(tab);
                        setTotal(recette);
                    }

                } else {
                    setTotal(0);
                }
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });

            req.send(data);
        }

    }, [dateDepart, dateFin, search, filtre, caissier]);

    const recupererRecetteReel = (dateD, dateF) => {
        // console.log("passage");
        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);

        if (props.role !== admin) {
            data.append('vendeur', props.nomConnecte);
        } else {
            data.append('vendeur', caissier);
        }
        const req = new XMLHttpRequest();

        req.open('POST', `http://serveur/backend-cmab/index.php?recette_reel_pharmacie`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            // console.log(req.responseText);
            setRecetteReel(result[0].recette_reel);
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);
    }

    useEffect(() => {
        if (filtre) {
            let recette = 0;
            let tab = historiqueSauvegarde.filter(item => (item.nom_vendeur.toUpperCase() === caissier.toUpperCase()));

            if (tab.length === 0) {
                sethistorique([]);
                setTotal(0);
            } else {
                if (non_paye) {
                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "non payé"));
                    tab.forEach(item => {
                        recette += parseInt(item.prix_total);
                    });
                } else {
                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "payé"));

                    tab.forEach(item => {
                        recette += parseInt(item.prix_total);
                    });
                    calculerRecetteParGenre(tab)

                }
                setTotal(recette);
                sethistorique(tab);
            }
        } else {
            sethistorique(historiqueSauvegarde.filter(item => (item.status_vente.toLowerCase() === "payé")));
            let recette = 0;
            let tab1 = historiqueSauvegarde.filter(item => (item.status_vente.toLowerCase() === "payé"));
            tab1.forEach(item => {
                recette += parseInt(item.prix_total);
            });

            setTotal(recette);
        }
    }, [caissier, filtre, non_paye]);

    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cmab/recuperer_comptes.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "vendeur" || item.rol === "major"))
                setListeComptes(result);
                setCaissier(result[0].nom_user.toUpperCase())
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

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

    const rechercherHistorique = () => {
        setSearch(!search);
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
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
                                    <label htmlFor="">Du : </label>
                                    <input type="date" ref={date_select1} />
                                    <input type="time" ref={heure_select1} />
                                </p>
                                <p>
                                    <label htmlFor="">Au : </label>
                                    <input type="date" ref={date_select2} />
                                    <input type="time" ref={heure_select2} />
                                </p>
                                <p>
                                    {
                                    props.role === admin && 
                                    <Fragment>
                                        <CFormSwitch
                                            label="Filtrer"
                                            id="formSwitchCheckDefault"
                                            checked={filtre}
                                            reverse={true}
                                            onChange={(e) => setFiltre(!filtre)}
                                        />
                                    </Fragment>
                                    }
                                </p>
                                <p style={{display: `${filtre ? 'block' : 'none'}`}}>
                                <p style={{display: 'none'}}>
                                    <label htmlFor="non_paye">non payés : </label>
                                    <input type="checkbox" id="non_paye" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                                </p>
                                <label htmlFor="">Vendeur : </label>
                                    <CFormSelect className='w-10' name="caissier" id="caissier" onChange={(e) => setCaissier(e.target.value)}>
                                        {props.role !== admin ? 
                                            <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> 
                                        :
                                            listeComptes.map(item => (
                                                <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                        ))}
                                    </CFormSelect>
                                </p>
                            </div>
                            <button className='bootstrap-btn' onClick={rechercherHistorique}>rechercher</button>
                            <div>Génériques : <span style={{fontWeight: '700'}}>{total ? recetteGenerique + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div>Spécialités : <span style={{fontWeight: '700'}}>{total ? recetteSp + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div>Total : <span style={{fontWeight: '700'}}>{total ? total + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div>Recette : <span style={{fontWeight: '700'}}>{total ? recetteReel + ' Fcfa' : '0 Fcfa'}</span></div>
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
                                    <td>Montant</td>
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
                                        <td>{item.prix_total + ' Fcfa'}</td>
                                        {/* <td>{item.status_vente}</td> */}
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <ReactToPrint
                            trigger={() => <button className='bootstrap-btn' style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                </div>
                <div style={{display: 'none'}}>
                    <ImprimerEtat
                        ref={componentRef}
                        dateDepart={dateDepart}
                        dateFin={dateFin}
                        caissier={caissier}
                        historique={historique}
                        total={total}
                        recetteReel={recetteReel}
                        recetteGenerique={recetteGenerique}
                        recetteSp={recetteSp}
                        filtre={filtre}
                    />
                </div>
            </section>
        </animated.div>
    )
}
