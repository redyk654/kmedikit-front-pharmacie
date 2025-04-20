import React, { useEffect, useState, useRef } from 'react';
import './GestionFactures.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';
import { mois, nomDns, ROLES } from "../../shared/Globals";
import { CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilReload, cilXCircle } from '@coreui/icons';
import { io } from 'socket.io-client';
import FacturePharmacie from '../Facture/Facture';

// const socket = io.connect('http://serveur:3010');

const customStyles1 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        color: '#333',
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
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        color: '#333',
        textAlign: 'center',
    },
};

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '50%',
    marginTop: '15px',
    fontSize: '15px'
}


export default function GestionFactures(props) {

    const componentRef = useRef();

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [montantVerse, setmontantVerse] = useState('');
    const [verse, setverse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [filtrer, setFiltrer] = useState(false);
    const [manquantTotal, setManquantTotal] = useState(0);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [supp, setSupp] =  useState(true);
    const [modalReussi, setModalReussi] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setFactures([])
        setfactureSauvegarde([]);
        const req = new XMLHttpRequest();
        if (filtrer) {
            req.open('GET', `${nomDns}factures_pharmacie.php`);
            const req2 = new XMLHttpRequest();
            req2.open('GET', `${nomDns}factures_pharmacie.php`);
            req2.addEventListener('load', () => {
                const result = JSON.parse(req2.responseText);
                setManquantTotal(result[0].manquant);
            })
            req2.send();

        } else {
            req.open('GET', `${nomDns}factures_pharmacie.php`);
        }
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                const result = JSON.parse(req.responseText);
                setFactures(result);
                setfactureSauvegarde(result);

            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            console.error("Erreur réseau");
        });

        req.send();
    }, [filtrer, effet])

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            const req = new XMLHttpRequest();
    
            req.open('GET', `${nomDns}factures_pharmacie.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
                fermerModalConfirmation();
            });

            req.send();
        }

    }, [effet2])

    // useEffect(() => {
    //     socket.on('acte_supprime', () => {
    //         seteffet(!effet);
    //         setdetailsFacture([]);
    //     })
    // }, [socket])

    const afficherInfos = (e) => {
        // Affichage des informations de la facture selectionnée
        reinitialsation();
        setfactureSelectionne(factures.filter(item => (item.id == e.target.id)))
        seteffet2(!effet2);
    }

     const reinitialsation = () => {
         setverse(0);
         setrelicat(0);
         setresteaPayer(0);
     }

    const filtrerListe = (e) => {
        // filter la liste des factures selon le nom du patient ou l'identifiant de la facture
        const val = e.target.value.toUpperCase().trim();
        if (val.length > 0) {
            setFactures(factureSauvegarde.filter(item => (item.patient.toUpperCase().includes(val) || item.id.toString().toUpperCase().includes(val))));
        } else {
            setFactures(factureSauvegarde);
        }
    }

    const majDesStocks = () => {
        // console.log("Données envoyées:", JSON.stringify(detailsFacture));
        
        // Mettre à jour les stocks de médicaments
        fetch(`${nomDns}maj_stocks_supprimes.php?user=${props.nomConnecte}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(detailsFacture)
        })
        .then(response => {
            console.log("Status:", response.status);
            if (response.ok) {
                return response.text().then(text => {
                    console.log("Réponse du serveur:", text);
                    
                    setModalReussi(true);
                    setModalConfirmation(false);
                    setSupp(false);
                    seteffet(!effet);
                    setfactureSelectionne([]);
                    setdetailsFacture([]);
                });
            } else {
                return response.text().then(text => {
                    console.error('Erreur:', response.status, text);
                    throw new Error(`Erreur ${response.status}: ${text}`);
                });
            }
        })
        .catch(error => {
            console.error('Erreur complète:', error);
        });
    }

    const supprimerFacture = () => {
        // console.log(JSON.stringify(detailsFacture));
        majDesStocks();
        
        document.querySelector('.valider').disabled = true;
        document.querySelector('.supp').disabled = true;
        // Suppression d'une facture
        const data = new FormData();
        data.append('id', factureSelectionne[0].id);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}supprimer_facture.php`);
        
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                majDesStocks();
            }
        });

        req.send(data);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        seteffet(!effet);
        reinitialsation();
        setfactureSelectionne([]);
        setdetailsFacture([]);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    return (
        <div className="container-facture">
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
                onRequestClose={fermerModalConfirmation}
            >
                <h4 style={{color: '#000'}}>Annuler une facture entraine sa suppression de la base de données. Voulez-vous continuer ?</h4>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button className="supp bootstrap-btn annuler" style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>NON</button>
                    <button className="bootstrap-btn valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={supprimerFacture}>OUI</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
                onRequestClose={fermerModalReussi}
            >
                {
                    supp ? 
                    (<h2 style={{color: '#000'}}>Facture annulé ✔ !</h2>) :
                    (<h2 style={{color: '#000'}}>Facture annulé ✔ !</h2>)
                }
                <button className='bootstrap-btn valider' style={{width: '50%'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <div className="liste-medoc">

                <p className="search-zone">
                    <input type="text" placeholder="Nom patient" onChange={filtrerListe} />
                </p>
                {/* <p>
                    <label htmlFor="" style={{marginRight: 5, fontWeight: 700}}>Non réglés</label>
                    <input type="checkbox" name="non_regle" id="non_regle" checked={filtrer} onChange={() => setFiltrer(!filtrer)} />
                </p> */}
                {/* <div>
                    {filtrer ? (
                        <div>Total non réglés: <span style={{fontWeight: 700}}>{manquantTotal == null ? '0 Fcfa' : manquantTotal + ' Fcfa'}</span></div>
                        ) : null}
                </div> */}
                <h3>{filtrer ? 'Factures non réglés' : 'Factures'}</h3>
                <ul>
                    {factures.length > 0 ? factures.map(item => (
                        <li id={item.id} key={item.id} onClick={afficherInfos}>{item.patient}</li>
                    )) : null}
                </ul>
            </div>
            <div className="details">
                <h3>Détails facture</h3>
                <div style={{textAlign: 'center', paddingTop: 10}}>
                    <div>
                        <div>Facture N°<span style={{color: '#038654', fontWeight: 700}}>{factureSelectionne.length > 0 && factureSelectionne[0].id}</span></div>
                    </div>
                    <div>
                        <div>Le <strong>{factureSelectionne.length > 0 && mois(factureSelectionne[0].date_heure.substring(0, 10))}</strong> à <strong>{factureSelectionne.length > 0 && factureSelectionne[0].date_heure.substring(11, )}</strong></div>
                    </div>
                    <div style={{marginTop: 5}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].patient}</span></div>
                    <div style={{marginTop: 5}}>code patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].code_patient}</span></div>
                    {factureSelectionne.length > 0 && factureSelectionne[0].assurance.toUpperCase() !== "aucune".toUpperCase() ? <div>couvert par : <strong>{factureSelectionne[0].assurance.toUpperCase()}</strong></div> : null}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%'}}>
                        <table style={table_styles}>
                            <thead>
                                <th style={table_styles1}>Désignation </th>
                                <td>Pu</td>
                                <td>Qtés</td>
                                <td>Total</td>
                            </thead>
                            <tbody>
                                {detailsFacture.map(item => (
                                    <tr>
                                        <td style={table_styles1} role="button" onClick={() => setVisible(true)}>
                                            {item.designation}
                                            {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}  
                                        </td>
                                        <td style={table_styles2}>{parseInt(item.prix_total) / parseInt(item.quantite)}</td>
                                        <td style={table_styles2}>{item.quantite}</td>
                                        <td style={table_styles2}>{item.prix_total}</td>
                                        {/* {(props.role.toUpperCase() === ROLES.regisseur.toUpperCase() || props.role.toUpperCase() === ROLES.admin.toUpperCase()) && (                                            
                                            <td>
                                                {parseInt(item.statu_acte) ? 
                                                (<CIcon
                                                    onClick={() => restaurerActe(item.id_facture, item.designation)}
                                                    icon={cilReload}
                                                    className="text-success"
                                                    role="button"
                                                    size='lg'
                                                />) : 
                                                (
                                                    <CIcon
                                                        onClick={() => annulerActe(item.id_facture, item.designation)}
                                                        icon={cilXCircle}
                                                        className="text-danger"
                                                        role="button"
                                                        size='lg'
                                                    />
                                                )}
                                            </td>
                                        )} */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4'>
                        <div>Net à payer <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div>
                        <div>Reste à payer <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].reste_a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div>
                        <div>Commis pharmacie <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].vendeur}</span></div>
                    </div>
                    <div>
                        <div>Caissier <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].caissier.toUpperCase()}</span></div>
                    </div>
                    <div style={{display: `${'flex'}`, justifyContent: 'center'}}>
                        <div style={{display: `${'block'}`}}>
                            <ReactToPrint
                                trigger={() => <button className='bootstrap-btn valider' style={{color: '#f1f1f1', height: '5vh', width: '15vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                                content={() => componentRef.current}
                            />
                        </div>
                        <div style={{display: `${props.role.toUpperCase() !== ROLES.admin.toUpperCase() && 'none' }`}}>
                            <button className='bootstrap-btn annuler' style={{width: '15vw', height: '5vh', marginLeft: '30px'}} onClick={() => {if(detailsFacture.length > 0) setModalConfirmation(true)}}>Annuler</button>
                        </div>
                    </div>
                    <div>
                        {factureSelectionne.length > 0 && (
                            <div style={{display: 'none'}}>
                                <FacturePharmacie
                                    ref={componentRef}
                                    medocCommandes={detailsFacture}
                                    idFacture={factureSelectionne[0].id}
                                    patient={factureSelectionne[0].patient}
                                    codePatient={factureSelectionne[0].code_patient}
                                    prixTotal={factureSelectionne[0].prix_total}
                                    reduction={factureSelectionne[0].reduction}
                                    aPayer={factureSelectionne[0].a_payer}
                                    montantVerse={factureSelectionne[0].a_payer}
                                    relicat={relicat}
                                    resteaPayer={0}
                                    date={factureSelectionne[0].date_heure}
                                    caissier={props.nomConnecte}
                                    commis={factureSelectionne[0].vendeur}
                                    assurance={factureSelectionne[0].assurance}
                                    type_assurance={factureSelectionne[0].type_assurance}
                                    dateJour={factureSelectionne[0].date_heure}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
