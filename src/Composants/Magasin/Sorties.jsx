import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import '../Commande/Commande.css';
import AfficherProd from '../AfficherProd/AfficherProd';
import { ContextChargement } from '../../Context/Chargement';
import { nomDns } from '../../shared/Globals';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";
import { FaPlusSquare } from "react-icons/fa";
import { useSpring, animated } from 'react-spring';

// Styles pour las fenêtres modales
const customStyles1 = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#18202e',
        color: '#fff',
        height: '45vh',
        width: '38vw',
        display: 'flex',
        flexDirection: 'column',
      //   alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
        border: '1px solid lightgray'
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
      },
};

export default function Sorties(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const componentRef = useRef();
    const elt = useRef();
    const elt2 = useRef();
    const {chargement, stopChargement, startChargement, darkLight} = useContext(ContextChargement);

    const date_e = new Date('2024-12-15');
    const date_j = new Date();

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState('');
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [messageErreur, setMessageErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [statu, setStatu] = useState('pending');
    const [enCours, setEncours] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {
            fetchProduits();
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 10000);
        }
    }, []);

    const calculerPrixTotal = () => {
        let prixTotalT = 0;
        if (medocCommandes.length > 0) {
            
            prixTotalT = medocCommandes.reduce((som, curr) => som + parseInt(curr.prix), 0)

        }
        return parseInt(prixTotalT);
    }

    // const calculerNetAPayer = () => {
    //     let netAPayer = (calculerPrixTotal() * ((100 - parseInt(patientChoisi.type_assurance)) / 100));

    //     return isNaN(netAPayer) ? 0 : parseInt(netAPayer);
    // }

    const retirerCommande = (e, id) => {
        const tab = medocCommandes.filter(item => item.id != id);
        setMedocCommandes([...tab]);
    }

        // Enregistrement d'un médicament dans la commande
    const ajouterMedoc = () => {
        /* 
            - Mise à jour de la quantité du médicament commandé dans la liste des commandes
            - Mise à jour du prix total du médicament commandé

            - Mise à jour du nombre total de médicaments commandés
            - Mise à jour de la quantité total des médicaments commandés
            - Mise à jour du prix total de la commande
        */

        if (qteDesire && !isNaN(qteDesire) && medocSelect) {

            if (parseInt(qteDesire) > medocSelect[0].en_stock) {
                setMessageErreur('La quantité commandé ne peut pas être supérieure au stock')
            } else if (medocSelect[0].en_stock == 0) {
                setMessageErreur('Le stock de ' + medocSelect[0].designation + ' est épuisé')
            } else {
                setMessageErreur('');
                Object.defineProperty(medocSelect[0], 'qte_commander', {
                    value: qteDesire,
                    configurable: true,
                    enumerable: true
                });
                
                Object.defineProperty(medocSelect[0], 'prix', {
                    value: parseInt(medocSelect[0].pu_vente) * parseInt(qteDesire),
                    configurable: true,
                    enumerable: true
                });
                
                // Utilisation d'une variable intermédiare pour empêcher les doublons dans les commandes
                let varIntermediaire = medocCommandes.filter(item => (item.designation !== medocSelect[0].designation));
                setMedocCommandes([...varIntermediaire, medocSelect[0]]);
                
                setQteDesire('');
                document.querySelector('.recherche').value = "";
                document.querySelector('.recherche').focus();
            }
        } else {
            setMessageErreur("La quantité désiré est manquante ou n'est pas un nombre")
        }

    }

    const fetchProduits = () => {
        // Récupération des médicaments dans la base via une requête Ajax
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_medoc_magasin.php`);
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                setMessageErreur('');
                const result = JSON.parse(req.responseText);

                // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                setListeMedoc(result);
                setListeMedocSauvegarde(result);
                stopChargement();

            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        if (parseInt(medocSelectionne[0].en_stock) === 0) {
            var msgAlerteStock = 'le stock de ' + medocSelectionne[0].designation + ' est épuisé ! Pensez à vous approvisionner';
            toastAlerteStock(msgAlerteStock, '#dd4c47');
        } else if (parseInt(medocSelectionne[0].en_stock) < parseInt(medocSelectionne[0].min_rec)) {
            var msgAlerteStock = medocSelectionne[0].designation + ' bientôt en rupture de stock ! Pensez à vous approvisionner';
            toastAlerteStock(msgAlerteStock, '#FFB900');
        }
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1))
        setListeMedoc(medocFilter);
    }

    const annulerCommande = () => {
        setMedocCommandes([]);
        setMessageErreur('');
        setMedoSelect(false);
        document.querySelector('.recherche').value = "";
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000000)
               .toString(32)
               .substring(1).toUpperCase();
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture


        const data = new FormData();

        data.append('id_facture', id);
        data.append('vendeur', props.nomConnecte);
        data.append('prix_total', calculerPrixTotal());
        
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}enreg_facture_magasin.php`);

        req.addEventListener('load', () => {
            setMedoSelect(false);
            setMessageErreur('');
            toastVenteEnregistrer();
            setModalConfirmation(false);
            setEncours(false);
            annulerCommande();
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);

    }

    const validerCommande = () => {

        setEncours(true)

        /* 
            Organisation des données qui seront envoyés au serveur :
                - pour la mise à jour des stocks de médicaments
                - pour la mise à jour de l'historique des ventes
        */
        
        if(medocCommandes.length > 0) {

            // document.querySelector('.valider').disabled = true;
            // console.log(elt.current.disabled);
            elt.current.disabled = true;
            elt2.current.disabled = true;

            
            medocCommandes.map(item => {
                item.stock_restant = parseInt(item.en_stock) - parseInt(item.qte_commander);
            });

            let i = 0;
            const idFac = idUnique();
            medocCommandes.map(item => {

                const data2 = new FormData();
                data2.append('designation', item.designation);
                data2.append('id_prod', item.id);
                data2.append('id_facture', idFac);
                data2.append('quantite', item.qte_commander);
                data2.append('prix_total', item.prix);
                data2.append('nom_vendeur', props.nomConnecte);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', `${nomDns}maj_historique_magasin.php`);
                
                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
                        setMessageErreur('');
                        listeMedocSauvegarde.map(item2 => {
                            if (item2.id == item.id) {
                                Object.defineProperty(item2, 'en_stock', {
                                    value: parseInt(item.en_stock) - parseInt(item.qte_commander),
                                    configurable: true,
                                    enumerable: true,
                                });
                            }
                        });
                        i++;
                        console.log(req2.response);
                        if (i === medocCommandes.length) {
                            enregisterFacture(idFac);
                            finaliserCommande(idFac);
                        }
                    }
                });

                req2.addEventListener("error", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('Erreur réseau');
                });
                req2.send(data2);
            });
        }
    }

    const enregistrerCommande = (idCommande) => {
        // Remplissage de la table d'approvisionnement
            
        const data = new FormData();
        data.append('id_commande', idCommande);
        data.append('produit', JSON.stringify(medocCommandes));

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}approvisionnement.php`);
        
        // req.addEventListener('load', () => {
        //     mettreAjourStock();
        // });
        
        req.send(data);
    }

    const finaliserCommande = (idCommande) => {
        /**
         * Enregistrement des produits Commandés dans la table des produits
         * Enregistrement du borderau de la commande éffectué
         */

        const data = new FormData();
        
        // Données relatives aux informations de la commande
        data.append('id_commande', idCommande);
        data.append('vendeur', props.nomConnecte);
        
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}approvisionnement.php`);
        
        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                enregistrerCommande(idCommande);
            }
        });
        
        req.send(data);
    }

    const demandeConfirmation = () => {
        if(medocCommandes.length === 0) {
            setMessageErreur("Aucun médicament n'a été ajouté à la facture en cours");
        } else {
            afterModal();
            setModalConfirmation(true);
        }
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const toastVenteEnregistrer = () => {
        toast.success("Vente enregistré !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
    }

    const toastAlerteStock = (msg, bg) => {
        toast.error(msg, {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#fff',
                backgroundColor: bg,
                letterSpacing: '1px'
            },
            
        });
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    return (
        <animated.div style={props1}>
        <div><Toaster/></div>
        <section className="commande">
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: `${darkLight ? '#fff' : '#18202e'}`, textAlign: 'center', marginBottom: '30px'}}>Confirmation</h2>
                <p style={{fontWeight: '600', textAlign: 'center', opacity: '.8'}}>
                    Vous allez valider la sortie. Etes-vous sûr ?
                </p>
                <div style={{textAlign: 'center', marginTop: '12px'}} className=''>
                    {enCours ? 
                    <Loader type="TailSpin" color="#03ca7e" height={50} width={50}/> 
                        : 
                    <div>
                        <button ref={elt2} className='bootstrap-btn annuler' style={{width: '30%', height: '5vh', cursor: 'pointer', marginRight: '10px', borderRadius: '15px'}} onClick={fermerModalConfirmation}>Annuler</button>
                        <button ref={elt} className="bootstrap-btn valider" style={{width: '30%', height: '5vh', cursor: 'pointer', borderRadius: '15px'}} onClick={validerCommande}>Confirmer</button>
                    </div>
                    }
                </div>
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" placeholder="recherchez un produit" className="recherche" onChange={filtrerListe} />
                </p>
                <p>
                    {/* <button className="rafraichir" onClick={() => {setRafraichir(!rafraichir)}}>rafraichir</button> */}
                </p>
                <div className="liste-medoc">
                    <h1>Liste de produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div> : listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) || parseInt(item.en_stock) === 0 ? '#ec4641' : ''}`}}>{item.designation.toLowerCase()}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="right-side">
                <h1>{medocSelect ? "Détails du produit" : "Selectionnez un produit pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                    <AfficherProd
                        key={item.id}
                        code={item.code}
                        designation={item.designation}
                        pu_vente={item.pu_vente}
                        en_stock={item.en_stock}
                        min_rec={item.min_rec}
                        categorie={item.categorie}
                        conditionnement={item.conditionnement}
                        date_peremption={item.date_peremption}
                        genre={item.genre}
                        />
                    ))}
                </div>
                <div className="box">
                    <div className="detail-item">
                        <input type="text" name="qteDesire" value={qteDesire} onChange={(e) => {setQteDesire(e.target.value)}} autoComplete='off' />
                        {/* <button onClick={ajouterMedoc}>ajouter</button> */}
                        <div onClick={ajouterMedoc} style={{display: 'inline-block', marginTop: '6px', cursor: 'pointer'}}>
                            <FaPlusSquare color='#00BCD4' size={35} />
                        </div>
                    </div>
                </div>

                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <h1>Sortie en cours</h1>

                    <table>
                        <thead>
                            <tr>
                                <td>Produits</td>
                                <td>Quantités</td>
                                {/* <td>Pu</td>
                                <td>Total</td> */}
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr key={item.id} style={{fontWeight: '600', color: `${darkLight ? '#fff' : '#012557'}`, cursor: 'pointer'}} onClick={(e) => retirerCommande(e, item.id)}>
                                    <td>{item.designation}</td>
                                    <td style={{color: `${parseInt(item.en_stock) < parseInt(item.qte_commander) ? 'red' : ''}`}}>{item.qte_commander}</td>
                                    {/* <td>{item.pu_vente + ' Fcfa'}</td>
                                    <td>{item.prix + ' Fcfa' }</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="valider-annuler">

                        <div className="totaux">
                            Produits : <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: "600"}}>{medocCommandes.length}</span>
                        </div>
                        {/* <div className="totaux">
                            Prix total : <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: "600"}}>{calculerPrixTotal() + ' Fcfa'}</span>
                        </div> */}
                        <button className='bootstrap-btn annuler' onClick={annulerCommande}>Annnuler</button>
                        <button className='bootstrap-btn valider' onClick={demandeConfirmation}>Valider</button>

                    </div>
                    {/* <div>
                        <div style={{display: 'none'}}>
                            <Facture 
                            ref={componentRef}
                            medocCommandes={medocCommandes}
                            nomConnecte={props.nomConnecte} 
                            idFacture={idFacture}
                            prixTotal={qtePrixTotal.prix_total}
                            aPayer={qtePrixTotal.a_payer}
                            montantVerse={montantVerse}
                            relicat={relicat}
                            resteaPayer={resteaPayer}
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
        </animated.div>
    )
}