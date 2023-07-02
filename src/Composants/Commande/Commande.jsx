import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import AfficherProd from '../AfficherProd/AfficherProd';
import { ContextChargement } from '../../Context/Chargement';
import AfficherPatient from '../Patients/AfficherPatient';
import EditerPatient from '../Patients/EditerPatient';
import ModalPatient from '../Patients/ModalPatient';
import { nomDns, nomServeur } from '../../shared/Globals';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";
import { FaPlusSquare } from "react-icons/fa";
import { useSpring, animated } from 'react-spring';
import { io } from 'socket.io-client';
import { CCloseButton } from '@coreui/react';
import EditerProd from '../Approvisionner/EditerProd';

const socket = io.connect(`${nomServeur}`);

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

const customStyles3 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fa222a',
      },
};

const customStyles4 = {
    content: {
      top: '48%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#04a567',
      width: '80%',
      height: '97vh',
      borderRadius: '10px'
    }, 
};

const customStyles5 = {
    content: {
      top: '47%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#e5f3fc',
      color: '#000',
      width: '65%'
    },
};


const stylePatient = {
    marginTop: '5px',
    height: '50vh',
    border: '1px solid gray',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: '#fff'
}

const customStylesNvProd = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#18202e',
        color: '#fff',
        // fontSize: 'medium',
        height: '70vh',
        width: '78vw',
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: '30px',
        lineHeight: '28px',
        border: '1px solid lightgray'
    },
};

const detailsDuPatient = {
    code: '',
    nom: '',
    age: '',
    sexe: '',
    quartier: '',
    assurance: 'aucune',
    type_assurance: '0',
}

const medocs = {
    code_prod: '',
    designation: '',
    classe: 'antibiotiques',
    pu_achat: '0',
    pu_vente: '',
    conditionnement: '',
    stock_ajoute: '',
    min_rec: '0',
    categorie: '',
    date_peremption: '',
    montant_commande: '',
    genre: 'generique',
}

export default function Commande(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const componentRef = useRef();
    const elt = useRef();
    const elt2 = useRef();
    const refPatient= useRef();
    const assuranceDefaut = 'aucune';
    const {chargement, stopChargement, startChargement, darkLight} = useContext(ContextChargement);

    const date_e = new Date('2024-12-15');
    const date_j = new Date();

    const [nouveauPatient, setNouveauPatient] = useState(detailsDuPatient);
    const [patientChoisi, setPatientChoisi] = useState(detailsDuPatient);
    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState('');
    const [infosMedoc, setInfosMedoc] = useState(medocs);
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [messageErreur, setMessageErreur] = useState('');
    const [montantVerse, setmontantVerse] = useState(0);
    const [alerteStock, setAlerteStock] = useState('');
    const [modalAlerte, setModalAlerte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [patient, setPatient] = useState('');
    const [listePatient, setlistePatient] = useState([]);
    const [modalPatient, setModalPatient] = useState(false);
    const [modalEditerPatient, setModalEditerPatient] = useState(false);
    const [statu, setStatu] = useState('pending');
    const [rafraichir, setRafraichir] = useState(false);
    const [enCours, setEncours] = useState(false);
    const [modalNouveauProduit, setModalNouveauProduit] = useState(false);
    const [msgErreur, setMsgErreur] = useState('');

    const { code, nom, age, sexe, quartier, assurance, type_assurance } = nouveauPatient;
    const {code_prod, designation, classe, pu_achat, pu_vente, conditionnement, stock_ajoute, min_rec, categorie, date_peremption, montant_commande, genre} = infosMedoc;


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
    }, [rafraichir]);

    const calculerPrixTotal = () => {
        let prixTotalT = 0;
        if (medocCommandes.length > 0) {
            
            prixTotalT = medocCommandes.reduce((som, curr) => som + parseInt(curr.prix), 0)

        }
        return parseInt(prixTotalT);
    }

    const calculerNetAPayer = () => {
        let netAPayer = (calculerPrixTotal() * ((100 - parseInt(patientChoisi.type_assurance)) / 100));

        return isNaN(netAPayer) ? 0 : parseInt(netAPayer);
    }

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
        req.open('GET', `${nomDns}recuperer_medoc.php`);
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
        document.querySelector('#qte_desire').focus();
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
        setmontantVerse('');
        setMessageErreur('');
        setMedoSelect(false);
        setPatientChoisi(detailsDuPatient);
        document.querySelector('.recherche').value = "";
    }

    const sauvegarder = () => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}backup.php`);
        req.send();

        req.addEventListener('load', () => {
            setMessageErreur('');
        });

        // req.addEventListener("error", function () {
        //     // La requête n'a pas réussi à atteindre le serveur
        //     setMessageErreur('Erreur réseau');
        // });
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000000)
               .toString(32)
               .substring(1).toUpperCase();
    }

    useEffect(() => {
      socket.on('maj_produits', (data) => {
        if (data.length > 0) {
            // setListeMedoc(listeMedoc.map(item => (item.id == data[0].id ? {...item, ["en_stock"]: (parseInt(item.en_stock) - parseInt(data[0].qte_commander))} : item)));
            // setListeMedocSauvegarde(listeMedocSauvegarde.map(item => (item.id == data[0].id ? {...item, ["en_stock"]: (parseInt(item.en_stock) - parseInt(data[0].qte_commander))} : item)));
            
            setListeMedoc(data);
            setListeMedocSauvegarde(data);
            setMedoSelect(false);
            setMedocCommandes([]);
        } else {
            console.log('Aucune donnée à afficher');
        }
      });

    }, [socket])
    

    const majListeProduits = (data) => {
        socket.emit('enreg_facture', data);
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture


        const data = new FormData();

        data.append('id_facture', id);
        data.append('vendeur', props.nomConnecte);
        data.append('prix_total', calculerPrixTotal());
        data.append('net_a_payer', calculerNetAPayer());
        data.append('reste_a_payer', calculerNetAPayer());
        data.append('code_patient', patientChoisi.code);
        data.append('patient', patientChoisi.nom);
        data.append('assurance', patientChoisi.assurance);
        data.append('type_assurance', patientChoisi.type_assurance);
        data.append('statu', statu);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}index.php?enreg_facture_pharmacie`);

        req.addEventListener('load', () => {
            majListeProduits(listeMedocSauvegarde);
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
                data2.append('code', item.code);
                data2.append('designation', item.designation);
                data2.append('id_prod', item.id);
                data2.append('id_facture', idFac);
                data2.append('categorie', item.categorie);
                data2.append('genre', item.genre);
                data2.append('date_peremption', item.date_peremption);
                data2.append('quantite', item.qte_commander);
                data2.append('prix_total', item.prix);
                data2.append('nom_vendeur', props.nomConnecte);
                data2.append('status_vente', 'non payé');
                data2.append('patient', patientChoisi.nom);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', `${nomDns}maj_historique.php`);
                
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
                        if (i === medocCommandes.length) {
                            enregisterFacture(idFac);
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

    const demandeConfirmation = () => {
        if(medocCommandes.length === 0) {
            setMessageErreur("Aucun médicament n'a été ajouté à la facture en cours");
        } else if (patientChoisi.nom === "") {
            setMessageErreur("Choisissez un patient")
        } else {
            afterModal();
            setModalConfirmation(true);
        }
    }

    const contenuModal = () => {
        return (
            <Fragment>
                <CCloseButton onClick={fermerModalPatient} white />
                <h2 style={{color: '#fff', textAlign: 'center'}}>informations du patient</h2>
                <div className="detail-item-patient">
                    <>
                        <ModalPatient
                            patient={patient}
                            filtrerPatient={filtrerPatient}
                            stylePatient={stylePatient}
                            listePatient={listePatient}
                            selectionnePatient={selectionnePatient}
                            ouvrirEditerPatient={ouvrirEditerPatient}
                        />
                    </>
                    <>
                        <AfficherPatient 
                            patientChoisi={patientChoisi} 
                            fermerModalPatient={fermerModalPatient}
                        />
                    </>
                </div>
            </Fragment>
        )
    }

    const infosPatient = () => {

        // Affiche la fenêtre des informations du patient
        setModalPatient(true);

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_patients.php`);

        req.addEventListener('load', () => {
            setMessageErreur('');
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
        })

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });
        req.send();

    }

    const filtrerPatient = (e) => {
        setPatient(e.target.value);

        const req = new XMLHttpRequest();

        req.open('GET', `${nomDns}rechercher_patient.php?str=${e.target.value}`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);

                setlistePatient(result);
            }
            
        });

        req.send();
    }

    const selectionnePatient = (e) => {
        const patientSelectionne = listePatient.filter(patient => patient.code === e.target.id)[0];
        setPatientChoisi(patientSelectionne);
    }

    const fermerModalPatient = () => {
        setModalPatient(false);
        setPatient('');
    }
  
    const fermerModalConfirmation = () => {
      setModalConfirmation(false);
    }

    const fermModalAlerte = () => {
        setModalAlerte(false);
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

    const handleChangePatient = (e) => {
        setNouveauPatient({...nouveauPatient, [e.target.name]: e.target.value});
    }

    const creerCodePatient = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000)
               .toString(32)
               .substring(1).toUpperCase();        
    }


    const ajouterNouveauPatient = () => {
        const req = new XMLHttpRequest();
        const data = new FormData();

        const nouveauCodePatient = creerCodePatient()

        data.append('code', nouveauCodePatient);
        data.append('nouveau_patient', JSON.stringify(nouveauPatient))

        req.open('POST', `${nomDns}index.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setPatientChoisi({...nouveauPatient, code: nouveauCodePatient});
                fermerEditerPatient();
                resetInfosDuPatient();
            }
        });

        req.send(data);
    }

    const fermerEditerPatient = () => {
        setModalEditerPatient(false)
    }

    const ouvrirEditerPatient = () => {
        setModalEditerPatient(true);
        fermerModalPatient();
    }

    const resetInfosDuPatient = () => {
        setNouveauPatient(detailsDuPatient);
    }

    const ouvrirModalPatient = () => {
        setPatient('');
        setModalPatient(true);
    }

    const fermerModalNouveauProd = () => {
        setModalNouveauProduit(false);
    }

    const ouvrirModalNouveauProd = () => {
        setModalNouveauProduit(true);
        setInfosMedoc(medocs);
    }

    const ajouterNouveauProduit = (e) => {
        e.preventDefault();

        if (isNaN(parseInt(pu_vente)) || isNaN(parseInt(min_rec)) || isNaN(parseInt(pu_achat))) {
            setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
        } else if (designation.length === 0) {
            setMsgErreur('Le produit doit avoir une désignation')
        } else if (classe.length === 0) {
            setMsgErreur('le champ classe ne peut pas être vide')
        } else if (parseInt(pu_vente) === 0) {
            setMsgErreur('Le prix unitaire de vente doit supérieur à 0')
        } else {
            setMsgErreur('');
            const data = new FormData();
            data.append('produit', JSON.stringify(infosMedoc));
    
            const req = new XMLHttpRequest();
    
            req.open('POST', `${nomDns}ajouter_produit.php`);
                
            req.addEventListener('load', () => {
                setInfosMedoc(medocs);
                setRafraichir(!rafraichir);
                fermerModalNouveauProd();
                toastProduitEnregistrer();
            });
            req.send(data);
        }
    }

    const toastProduitEnregistrer = () => {
        toast.success("Produit ajouté !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
    }

    const handleChangeNvProd = (e) => {
        if (e.target.name === "code") {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value.toUpperCase()});
        } else {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value});
        }
    }

    const ouvrirChangerPrix = () => {
        setModalReussi(true);
    }

    const fermerChangerPrix = () => {
        setModalReussi(false);
    }

    const changerPrixProd = () => {
        const nvPrix = document.querySelector('#modifier-prix').value;
        if (medocSelect) {
            if (medocSelect.length > 0 && nvPrix.length > 0) {
                const data = new FormData()

                data.append('id_prod', medocSelect[0].id);
                data.append('pu', nvPrix)

                const req = new XMLHttpRequest()

                req.open('POST', `${nomDns}changer_prix_prod.php`);
                
                req.addEventListener('load', () => {
                    setMedoSelect(false);
                    setRafraichir(!rafraichir);
                    fermerChangerPrix();
                    toast.success("Prix modifié avec succès !", {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '18px',
                            backgroundColor: '#fff',
                            letterSpacing: '1px'
                        },
                        
                    });
                });
                req.send(data);
            }
        }
    }

    return (
        <animated.div style={props1}>
        <div><Toaster/></div>
        <section className="commande">
            <Modal
                isOpen={modalNouveauProduit}
                onRequestClose={fermerModalNouveauProd}
                style={customStylesNvProd}
            >
                <h1 style={{textAlign: 'center'}}>Nouveau Produit</h1>
                <EditerProd
                    code={code}
                    min_rec={min_rec}
                    designation={designation}
                    classe={classe}
                    categorie={categorie}
                    pu_vente={pu_vente}
                    conditionnement={conditionnement}
                    date_peremption={date_peremption}
                    stock_ajoute={stock_ajoute}
                    pu_achat={pu_achat}
                    genre={genre}
                    handleChange={handleChangeNvProd}
                    ajouterMedoc={ajouterNouveauProduit}
                    nvProd={true}
                />
                <div className='fw-bold text-danger' style={{backgroundColor: '#fff'}}>{msgErreur}</div>
            </Modal>
            <Modal
                isOpen={modalEditerPatient}
                style={customStyles5}
                contentLabel=""
            >
                <EditerPatient
                    handleChange={handleChangePatient}
                    fermerEditerPatient={fermerEditerPatient}
                    ouvrirModalPatient={ouvrirModalPatient}
                    resetInfosDuPatient={resetInfosDuPatient}
                    ajouterNouveauPatient={ajouterNouveauPatient}
                    nom={nom}
                    age={age}
                    sexe={sexe}
                    quartier={quartier}
                    assurance={assurance}
                    type_assurance={type_assurance}
                />
            </Modal>
            <Modal
                isOpen={modalPatient}
                style={customStyles4}
                contentLabel="information du patient"
                ariaHideApp={false}
                onRequestClose={fermerModalPatient}
            >
                {contenuModal()}
            </Modal>
            <Modal
                isOpen={modalAlerte}
                style={customStyles3}
                onRequestClose={fermModalAlerte}
            >
                <h2 style={{color: '#fff'}}>{alerteStock}</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermModalAlerte}>Fermer</button>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: `${darkLight ? '#fff' : '#18202e'}`, textAlign: 'center', marginBottom: '30px'}}>Confirmation</h2>
                <p style={{fontWeight: '600', textAlign: 'center', opacity: '.8'}}>
                    Vous allez valider la vente. Etes-vous sûr ?
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
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
                onRequestClose={fermerChangerPrix}
            >
                <h2 style={{color: '#fff'}}>modifier le prix de {medocSelect[0]?.designation}</h2>
                <input id='modifier-prix' type="number" />
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={changerPrixProd}>valider</button>
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" placeholder="recherchez un produit" className="recherche" onChange={filtrerListe} />
                </p>
                <p>
                    {/* <button className="rafraichir" onClick={() => {setRafraichir(!rafraichir)}}>rafraichir</button> */}
                </p>
                <div>
                    <a className='link-primary' onClick={ouvrirChangerPrix} role='button'>changer prix</a>
                </div>
                <div className="liste-medoc">
                    <h1>Liste de produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div> : listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) || parseInt(item.en_stock) === 0 ? '#ec4641' : ''}`}}>{item.designation.toLowerCase()}</li>
                        ))}
                    </ul>
                    <div>
                        <button className='bootstrap-btn w-75' onClick={ouvrirModalNouveauProd}>nouveau produit</button>
                    </div>
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
                        <input type="text" id='qte_desire' name="qteDesire" value={qteDesire} onChange={(e) => {setQteDesire(e.target.value)}} autoComplete='off' />
                        {/* <button onClick={ajouterMedoc}>ajouter</button> */}
                        <div onClick={ajouterMedoc} style={{display: 'inline-block', marginTop: '6px', cursor: 'pointer'}}>
                            <FaPlusSquare color='#00BCD4' size={35} />
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className='btn-patient' onClick={infosPatient}>Infos du patient</button>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        {patientChoisi.nom.length > 0 ? (
                            <div>
                                Patient: <span style={{color: `${darkLight ? '#fff' : '#000'}`, fontWeight: '700'}}>{patientChoisi.nom.toUpperCase()}</span>
                            </div>
                        ) : null}
                        {patientChoisi.nom.length > 0 ? (
                            <div>
                                Code patient: <span style={{color: '#0e771a', fontWeight: '700'}}>{patientChoisi.code.toUpperCase()}</span>
                            </div>
                        ) : null}
                        {patientChoisi.assurance.toUpperCase() !== assuranceDefaut.toUpperCase() ? (
                            <div style={{}}>
                                Couvert par: <span style={{color: `${darkLight ? '#fff' : '#000'}`, fontWeight: '700'}}>{patientChoisi.assurance.toLocaleUpperCase()}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <h1>Facture en cours</h1>

                    <table>
                        <thead>
                            <tr>
                                <td>Produits</td>
                                <td>Quantités</td>
                                <td>Pu</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr key={item.id} style={{fontWeight: '600', color: `${darkLight ? '#fff' : '#012557'}`, cursor: 'pointer'}} onClick={(e) => retirerCommande(e, item.id)}>
                                    <td>{item.designation}</td>
                                    <td style={{color: `${parseInt(item.en_stock) < parseInt(item.qte_commander) ? 'red' : ''}`}}>{item.qte_commander}</td>
                                    <td>{item.pu_vente + ' Fcfa'}</td>
                                    <td>{item.prix + ' Fcfa' }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="valider-annuler">

                        <div className="totaux">
                            Produits : <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: "600"}}>{medocCommandes.length}</span>
                        </div>
                        <div className="totaux">
                            Prix total : <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: "600"}}>{calculerPrixTotal() + ' Fcfa'}</span>
                        </div>
                        <div style={{display: `${parseInt(patientChoisi.type_assurance) === 0 ? 'none' : 'block'}`}}>
                            Assurance: <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: '700'}}>{patientChoisi.type_assurance + '%'}</span>
                        </div>
                        <div>
                            Net à payer : <span style={{color: `${darkLight ? '#fff' : '#012557'}`, fontWeight: "600"}}>{calculerNetAPayer() + ' Fcfa'}</span>
                        </div>
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