import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import AfficherProd from '../AfficherProd/AfficherProd';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";
import { useSpring, animated } from 'react-spring';
import { nomDns } from '../../shared/Globals';

// Modal.defaultStyles.overlay.backgroundColor = '#18202ebe';

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

export default function GestionArchives(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const assuranceDefaut = 'aucune';
    const {chargement, stopChargement, startChargement, darkLight} = useContext(ContextChargement);

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [medocSelect, setMedoSelect] = useState([]);
    const [messageErreur, setMessageErreur] = useState('');
    const [rafraichir, setRafraichir] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        fetchProduits();
    }, [rafraichir]);

    const fetchProduits = () => {
        // Récupération des médicaments dans la base via une requête Ajax
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_medoc.php?archive`);
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
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1))
        setListeMedoc(medocFilter);
    }

    // Enregistrement d'un médicament dans la commande
   
    const desarchiverProduit = () => {
        document.querySelector('.annuler').disabled = true;
        if (medocSelect.length > 0) {
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}desarchiver_prod.php?id=${medocSelect[0].id}`);
    
            req.addEventListener("load", function () {
                setMessageErreur('');
                toastProduitArchive();
                document.querySelector('.annuler').disabled = true;
                fetchProduits();
                setMedoSelect([]);
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send();
        }
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const toastProduitArchive = () => {
        toast.success("Produit archivé !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
    }

    return (
        <animated.div style={props1}>
        <div><Toaster/></div>
        <section className="commande">
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
                <h1>{medocSelect.length > 0 ? "Détails du produit" : "Selectionnez un produit pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect.length > 0 && medocSelect.map(item => (
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
                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <div className="valider-annuler">
                        <button className='bootstrap-btn annuler w-25' onClick={desarchiverProduit}>Désarchiver</button>
                    </div>
                </div>
            </div>
        </section>
        </animated.div>
    )
}
