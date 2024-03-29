import React, { useEffect, useState, useContext, useRef } from 'react';
import './Activites.css';
import { ContextChargement } from '../../Context/Chargement';
import { isAlertStockShow, mois, selectProd, genererId, badges, nomDns, corrigerStock, filtrerListe, ROLES, supprimerProd, serveurNodeProd } from "../../shared/Globals";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Modal from 'react-modal';
import { Toaster, toast } from "react-hot-toast";
import { useSpring, animated } from 'react-spring';
import { CBadge } from "@coreui/react";
import AfficherListeProdInventaires from '../../shared/AfficherListeProdInventaires';
import SaveInventaire from '../SaveInventaire/SaveInventaire';
import { io } from 'socket.io-client';

const socket = io.connect(`${serveurNodeProd}`);

Modal.setAppElement('#root')

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#ccc',
        width: '97vw',
        height: '97vh'
      },
};

const customStyles1 = {
    content: {
      top: '25%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '45vw',
      borderRadius: '10px',
    },
};

export default function Activites(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const { stopChargement, startChargement, darkLight, role} = useContext(ContextChargement);
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    let date_filtre = useRef();
    let btnModifStock = useRef();
    const date_e = new Date('2024-02-15');
    const date_j = new Date();

    const [listeHistorique, setListeHistorique] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [listeProduitsRecherches, setListeProduitsRecherches] = useState([]);
    const [listeProduitsInventaires, setListeProduitsInventaires] = useState([]);
    const [idProd, setIdProd] = useState(false);
    const [puVente, setPuVente] = useState(false);
    const [medocSelectionne, setMedocSelectionne] = useState(false);
    const [medocSelectionneSauvegarde, setMedocSelectionneSauvegarde] = useState(false);
    const [qteEntre, setQteEntre] = useState(0);
    const [qteSortie, SetQteSortie] = useState(0);
    const [designation, setDesignation] = useState('');
    const [stockRestant, setStockRestant] = useState(false);
    const [datePeremption, setDatePeremtion] = useState(false);
    const [dateApprov, setDateApprov] = useState(false);
    const [dateAffiche, setDateAffiche] = useState('');
    const [modalInventaire, setModalInventaire] = useState(false);
    const [non_paye, setNonPaye] = useState(false);
    const [ecart, setEcart] = useState(0);
    const [stockPhy, setStockPhy] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [state, setState] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');
    const [enCours, setEnCours] = useState(false);
    const [searchProd, setSearchProd] = useState('');

    const propSearchDesignation = "designation";
    const vueListeProduitsInventaires = filtrerListe(propSearchDesignation, searchProd, listeProduitsInventaires);

    const handleChangeProd = (e) => {
        if (e.target.value.length === 0) {
            setListeProduitsRecherches([]);
        } else {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_produits.php?designation=${e.target.value}`);

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setListeProduitsRecherches(result);
            });
            
            req.send();
        }

    }

    const ajouterProduitDansInventaire = (e) => {
        const prod = listeProduitsRecherches.filter(item => item.id == e.target.id)[0];
        const prodInventaire = {
            id_inventaire: '',
            id_prod: prod.id,
            designation: prod.designation,
            stock_theorique: parseInt(prod.en_stock),
            stock_reel: parseInt(prod.en_stock),
            difference: 0,
            pu_achat: parseInt(prod.pu_achat),
            p_total: parseInt(prod.pu_achat) * parseInt(prod.en_stock),
            genre: prod.genre,
        }

        const retirerDoublons = listeProduitsInventaires.filter(item => item.id_prod !== prod.id);
        const liste = [...retirerDoublons, prodInventaire];
        setListeProduitsInventaires(liste);
        document.querySelector('#rechercher-produit').focus();
    }

    useEffect(() => {
        startChargement();
        if (date_j.getTime() <= date_e.getTime()) {
            // Récupération de la liste de produits
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_historique.php`);

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setListeHistorique(result);
                setListeSauvegarde(result);
                // creerListeProduitsInventaires(result);
                setTimeout(() => {
                    stopChargement();
                }, 500);
            });

            req.send();

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 10000);
        }

    }, [state]);

    // const creerListeProduitsInventaires = (listeProduits) => {
    //     let liste = [];
    //     listeProduits.forEach(item => {
    //         const prod = {
    //             id_inventaire: '',
    //             id_prod: item.id,
    //             designation: item.designation,
    //             stock_theorique: parseInt(item.en_stock),
    //             stock_reel: parseInt(item.en_stock),
    //             difference: 0,
    //             pu_achat: parseInt(item.pu_achat),
    //             p_total: parseInt(item.pu_achat) * parseInt(item.en_stock),
    //             genre: item.genre,
    //         }
    //         liste.push(prod);
    //     });
    //     setListeProduitsInventaires(liste);
    // }

    useEffect(() => {

        if (parseInt(stockPhy) > 0 && parseInt(stockPhy) !== parseInt(stockRestant)) {
            const data = new FormData();

            data.append('id_prod', idProd);
            data.append('designation', designation);
            data.append('par', props.nomConnecte);
            data.append('qte_dispo', stockPhy);
            data.append('pu_vente', puVente);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}gestion_stock.php?rem=correction`);
    
            req.addEventListener('load', () => {
                fermerModalConfirmation();
                setMedocSelectionne(false);
                setState(!state);
                setDesignation('');
                setDatePeremtion(false);
                setStockRestant(false);
                toast.success('Stock corrigé avec succès !');
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send(data);
        }
    }, [stockPhy]);


    useEffect(() => {
        if (medocSelectionne && medocSelectionneSauvegarde) {
            if (non_paye) {
                const d = dateApprov ? new Date(dateApprov) : new Date();
                setMedocSelectionne(medocSelectionneSauvegarde.filter(item => (item.date_heure.indexOf(d.toLocaleDateString()) !== -1)));
                setDateAffiche(d.toLocaleDateString());
            } else {
                setMedocSelectionne(medocSelectionneSauvegarde);
            }
        }
    }, [non_paye, dateApprov, medocSelectionneSauvegarde]);


    useEffect(() => {
        if (medocSelectionne && medocSelectionneSauvegarde) {
            let Tentre=0, Tsortie=0;
            medocSelectionne.forEach(item => {
                Tentre += parseInt(item.qte_entre);
                Tsortie += parseInt(item.qte_sortie);
            });

            setQteEntre(Tentre);
            SetQteSortie(Tsortie);
        }
    }, [medocSelectionne]);

    const filtrerListe2 = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase().trim()) !== -1));
        setListeHistorique(medocFilter);
    }

    const trierAffichage = (e) => {
        if (e.target.value === "tout") {
            setListeHistorique(listeSauvegarde);
        } else {
            setListeHistorique(listeSauvegarde.filter(item => (item.genre.toLowerCase() == e.target.value)));
        }
    }

    const afficherHistorique = (e) => {
        setDateApprov(false);
        const medocSelectionne = selectProd(e.target.value, listeHistorique);

        isAlertStockShow(medocSelectionne)

        setStockRestant(medocSelectionne.en_stock);
        setDatePeremtion(medocSelectionne.date_peremption);

        const req1 = new XMLHttpRequest();
        req1.open('POST', `${nomDns}gestion_stock.php?id=${medocSelectionne.id}`);
        req1.addEventListener('load', () => {
            if (req1.status >= 200 && req1.status < 400) {
                const result = JSON.parse(req1.responseText);
                setIdProd(medocSelectionne.id)
                setPuVente(medocSelectionne.pu_vente)
                setMedocSelectionne(result);
                setMedocSelectionneSauvegarde(result);
                // setNonPaye(true);
                setDesignation(medocSelectionne.designation)
            } else {
                console.error(req1.status + " " + req1.statusText);
            }
        });

        req1.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        if (role.toUpperCase() === ROLES.admin.toUpperCase()) {
            req1.send();
        }
    }

    const handleChange = (e) => {
        if (stockRestant) {
            let valeur = parseInt(e.target.value.trim());
            setEcart(valeur - parseInt(stockRestant));
        }
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const ouvrirModalInventaire = () => {
        setModalInventaire(true);
    }

    const fermerModalInventaire = () => {
        setModalInventaire(false);
        setListeProduitsRecherches([]);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setEcart(0);
        setStockPhy(0);
    }

    const modifierStock = () => {
        btnModifStock.current.disabled = true;
        setStockPhy(parseInt(stockRestant) + ecart);
    }

    const sauvegarderInfosInventaire = () => {
        if (listeProduitsInventaires.length === 0) {
            toast.error('Aucun produit ajouté à l\'inventaire');
            return;
        } else {
            setEnCours(true);
            const idInventaire = genererId()
    
            const infosInventaire = {
                id: idInventaire,
                auteur: props.nomConnecte,
            }
    
            const data = new FormData();
            data.append('infosInv', JSON.stringify(infosInventaire));
    
            const req = new XMLHttpRequest();
    
            req.open('POST', `${nomDns}sauvegarder_inventaire.php`);
            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    sauvegarderProduitsInventaire(idInventaire);
                } else {
                    console.error(req.status + " " + req.statusText);
                }
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send(data);
        }
    }

    const sauvegarderProduitsInventaire = (idInventaire) => {
        // console.log(listeProduitsInventaires);
        const data = new FormData();
        data.append('id_inventaire', idInventaire);
        data.append('auteur', props.nomConnecte);
        data.append('produits', JSON.stringify(listeProduitsInventaires));

        const req = new XMLHttpRequest();

        req.open('POST', `${nomDns}sauvegarder_inventaire.php`);
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setEnCours(false);
                fermerModalInventaire();
                setListeProduitsInventaires([]);
                setListeProduitsRecherches([]);
                setMedocSelectionne(false);
                setState(!state);
                socket.emit('modification_produit');
                toast.success('Inventaire sauvegardé avec succès');
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);

    }

    const callCorrigerStock = (e) => {
        setListeProduitsInventaires(corrigerStock(e, listeProduitsInventaires));
        // console.log(listeProduitsInventaires);
    }

    const supprimerProdInventaire = (e) => {
        setListeProduitsInventaires(supprimerProd(e, listeProduitsInventaires));
    }

    return (
        <animated.div style={props1}>
        <div><Toaster/></div>
        <section className="historique">
            <Modal
                isOpen={modalInventaire}
                style={customStyles2}
                // onRequestClose={fermerModalInventaire}
            >
                <SaveInventaire
                    listeProds={vueListeProduitsInventaires}
                    listeProduitsRecherches={listeProduitsRecherches}
                    handleClick={sauvegarderInfosInventaire}
                    searchProd={searchProd}
                    handleChangeProd={handleChangeProd}
                    enCours={enCours}
                    fermerModalInventaire={fermerModalInventaire}
                    corrigerStock={callCorrigerStock}
                    ajouterProduitDansInventaire={ajouterProduitDansInventaire}
                    supprimerProd={supprimerProdInventaire}
                />
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Correction du stock de {designation}</h2>
                <div style={{lineHeight: '24px'}}>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <label htmlFor="">Stock théorique: </label>
                        <strong>{stockRestant && stockRestant}</strong>
                    </div>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <label htmlFor="">Stock réel : </label>
                        <input type="text" style={{width: '75px'}} id="" onChange={handleChange} />
                    </div>
                    <div style={{display: `${ecart > 0 || ecart < 0 ? 'block' : 'none'}`, textAlign: 'center'}}>
                        <label htmlFor="">Ecart : </label>
                        <strong style={{color: '#ffca18'}}>{ecart > 0 ?  '+' + ecart : ecart}</strong>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button ref={btnModifStock} className='bootstrap-btn' style={{cursor: 'pointer', width: '180px', marginTop: '15px'}} onClick={modifierStock}>Enregistrer</button>
                    </div>
                </div>
            </Modal>
            <h1 >Fiches des stocks du dispensaire</h1>
            <div className='erreur-message'>{messageErreur}</div>
            <div className="container-historique">
                <div className="medocs-sortis">
                    <p className="search-zone">
                        <input type="text" placeholder="recherchez un produit" onChange={filtrerListe2} />
                    </p>
                    <p>
                        <button onClick={ouvrirModalInventaire} className='bootstrap-btn valider' style={{width: '40%'}}>inventaires</button>
                    </p>
                    <p>
                        <select name="genre" id="" onChange={trierAffichage}>
                            <option value="tout">aucune catégorie</option>
                            <option value="generique">générique</option>
                            <option value="sp">spécialité</option>
                        </select>
                    </p>
                    <h1>Produits</h1>
                    <ul>
                        <AfficherListeProdInventaires
                            listeHistorique={listeHistorique}
                            afficherHistorique={afficherHistorique}
                        />
                    </ul>
                </div>
                <div className="table-commandes">
                    <div className="entete-historique" style={{display: 'none'}}>
                        <label htmlFor="filtre">Filtrer : </label>
                        <input type="checkbox" id="filtre" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                    </div>
                    {/* <div className="entete-historique">
                        <button className='bootstrap-btn' onClick={() => {setModalConfirmation(true); afterModal();}}>Corriger</button>
                    </div> */}
                    <div className="entete-historique" style={{display: `${non_paye ? 'block' : 'none'}`}}>
                        <label htmlFor="">Date : </label>
                        <input type="date" id="" ref={date_filtre} onChange={(e) => setDateApprov(e.target.value)} />
                    </div>
                    {/* <div className="entete-historique">
                        Listing du : <span style={{fontWeight: '600'}}>{mois(dateAffiche)}</span>
                    </div> */}
                    <div className="entete-historique">Désignation: <span style={{fontWeight: '600'}}>{designation}</span></div>
                    <div className="entete-historique">Date péremption : <span style={{fontWeight: '600'}}>{datePeremption && datePeremption}</span></div>
                    <div className="entete-historique">
                        Total entrées : <span style={{fontWeight: '600'}}>{qteEntre}</span>
                    </div>
                    <div className="entete-historique">
                        Total sorties : <span style={{fontWeight: '600'}}>{qteSortie}</span>
                    </div>
                    <div className="entete-historique">Stock Disponible : <span style={{fontWeight: '600'}}>{stockRestant && stockRestant}</span></div>
                    <h1>Fiche de stock de {designation}</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Le</td>
                                <td>À</td>
                                <td>Auteur</td>
                                <td>Entrée</td>
                                <td>Sortie</td>
                                <td>Dispo</td>
                                <td>Note</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocSelectionne ? medocSelectionne.map(item => (
                                <tr key={item.id_table}>
                                    <td>{mois(item.date_heure.substring(0, 10))}</td>
                                    <td>{item.date_heure.substring(11)}</td>
                                    <td>{item.par.toUpperCase()}</td>
                                    <td>{item.qte_entre}</td>
                                    <td>{item.qte_sortie}</td>
                                    <td>{item.qte_dispo}</td>
                                    <td>
                                        <CBadge color={badges[item.remarque]}>{item.remarque}</CBadge>
                                    </td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        </animated.div>
    )
}