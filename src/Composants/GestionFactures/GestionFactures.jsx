import React, { useEffect, useState, useRef, useContext } from 'react';
import './GestionFactures.css';
import ReactToPrint from 'react-to-print';
import { mois, nomDns, ROLES } from "../../shared/Globals";
import { CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons';
import FacturePharmacie from '../Facture/Facture';
import { ContextChargement } from '../../Context/Chargement';

// Table styles
const table_styles1 = { border: '1px solid #000', borderCollapse: 'collapse', padding: 10, textAlign: 'left' }
const table_styles2 = { border: '1px solid #000', borderCollapse: 'collapse', padding: 10, textAlign: 'right' }
const table_styles = { border: '1px solid #000', borderCollapse: 'collapse', padding: 10, width: '50%', marginTop: '15px', fontSize: '15px' }

// --- RechercheFactures ---
function RechercheFactures({ date_select1, date_select2, rechercherHistorique, filtrerListe }) {
    return (
        <div style={{ margin: 2 }}>
            <p>
                <label>Date début : </label>
                <input id='date-d-listing' type="date" ref={date_select1} />
            </p>
            <p>
                <label>Date fin : </label>
                <input id='date-f-listing' type="date" ref={date_select2} />
            </p>
            <button onClick={rechercherHistorique}>rechercher</button>
            <p className="search-zone">
                <input type="text" placeholder="Nom patient" onChange={filtrerListe} />
            </p>
        </div>
    );
}

// --- ListeFactures ---
function ListeFactures({ factures, afficherInfos }) {
    return (
        <>
            <p>{factures.length + ' factures trouvées'}</p>
            <h3>Liste des factures</h3>
            <ul>
                {factures.length > 0 ? factures.map(item => (
                    <li id={item.id} key={item.id} onClick={afficherInfos}>{item.patient}</li>
                )) : null}
            </ul>
        </>
    );
}

// --- TableauProduitsFacture ---
function TableauProduitsFacture({ detailsFacture, annulerProduit, isLoad, role }) {
    return (
        <table style={table_styles}>
            <thead>
                <tr>
                    <th style={table_styles1}>Désignation </th>
                    <td>Pu</td>
                    <td>Qtés</td>
                    <td>Total</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {detailsFacture.map(item => (
                    <tr key={item.id}>
                        <td style={table_styles1}>
                            {item.designation}
                            {item.status_vente === "payé" ? null : <CBadge color='danger'>annulé</CBadge>}
                        </td>
                        <td style={table_styles2}>{parseInt(item.prix_total) / parseInt(item.quantite)}</td>
                        <td style={table_styles2}>{item.quantite}</td>
                        <td style={table_styles2}>{item.prix_total}</td>
                        <td>
                            {item.status_vente === "payé" && role === ROLES.admin &&
                                <button
                                    style={{ background: '#fff', border: 'none', cursor: 'pointer' }}
                                    id='annuler-produit'
                                    onClick={() => annulerProduit(item)}
                                    disabled={isLoad}
                                >
                                    <CIcon
                                        icon={cilXCircle}
                                        className="text-danger"
                                        size='lg'
                                    />
                                </button>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// --- ActionsFacture ---
function ActionsFacture({ factureSelectionne, detailsFacture, componentRef, relicat, nomConnecte }) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'block' }}>
                    <ReactToPrint
                        trigger={() => <button className='bootstrap-btn valider' style={{ color: '#f1f1f1', height: '5vh', width: '15vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600' }}>Imprimer</button>}
                        content={() => componentRef.current}
                    />
                </div>
            </div>
            <div>
                {factureSelectionne.length > 0 && (
                    <div style={{ display: 'none' }}>
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
                            caissier={nomConnecte}
                            commis={factureSelectionne[0].vendeur}
                            assurance={factureSelectionne[0].assurance}
                            type_assurance={factureSelectionne[0].type_assurance}
                            dateJour={factureSelectionne[0].date_heure}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

// --- DetailsFacture ---
function DetailsFacture({
    factureSelectionne,
    detailsFacture,
    mois,
    annulerProduit,
    isLoad,
    role,
    relicat,
    componentRef,
    nomConnecte
}) {
    if (factureSelectionne.length === 0) return <div>Sélectionnez une facture</div>;
    const facture = factureSelectionne[0];
    return (
        <div style={{ textAlign: 'center', paddingTop: 10 }}>
            <div>
                <div>Facture N°<span style={{ color: '#038654', fontWeight: 700 }}>{facture.id}</span></div>
            </div>
            <div>
                <div>Le <strong>{mois(facture.date_heure.substring(0, 10))}</strong> à <strong>{facture.date_heure.substring(11)}</strong></div>
            </div>
            <div style={{ marginTop: 5 }}>patient : <span style={{ fontWeight: '600', marginTop: '15px' }}>{facture.patient}</span></div>
            <div style={{ marginTop: 5 }}>code patient : <span style={{ fontWeight: '600', marginTop: '15px' }}>{facture.code_patient}</span></div>
            {facture.assurance.toUpperCase() !== "AUCUNE" &&
                <div>couvert par : <strong>{facture.assurance.toUpperCase()}</strong></div>
            }
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%' }}>
                <TableauProduitsFacture
                    detailsFacture={detailsFacture}
                    annulerProduit={annulerProduit}
                    isLoad={isLoad}
                    role={role}
                />
            </div>
            <div className='mt-4'>
                <div>Net à payer <span style={{ fontWeight: 700, color: '#038654' }}>{facture.a_payer + ' Fcfa'}</span></div>
            </div>
            <div>
                <div>Reste à payer <span style={{ fontWeight: 700, color: '#038654' }}>{facture.reste_a_payer + ' Fcfa'}</span></div>
            </div>
            <div>
                <div>Commis pharmacie <span style={{ fontWeight: 700, color: '#038654' }}>{facture.vendeur}</span></div>
            </div>
            <div>
                <div>Caissier <span style={{ fontWeight: 700, color: '#038654' }}>{facture.caissier.toUpperCase()}</span></div>
            </div>
            <ActionsFacture
                factureSelectionne={factureSelectionne}
                detailsFacture={detailsFacture}
                componentRef={componentRef}
                relicat={relicat}
                nomConnecte={nomConnecte}
            />
        </div>
    );
}

// --- GestionFactures principal ---
export default function GestionFactures(props) {
    const { dateDebut, dateFin, changeDateDebut, changeDateFin } = useContext(ContextChargement);
    const componentRef = useRef();
    let date_select1 = useRef();
    let date_select2 = useRef();

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [verse, setverse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [isLoad, SetIsLoad] = useState(false);

    useEffect(() => { fetchFactures() }, [dateDebut, dateFin, effet]);

    const fetchFactures = () => {
        if (!dateDebut || !dateFin) return;
        setFactures([]);
        setfactureSauvegarde([]);
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}get_factures_pharmacie_by_date.php?pharmacie&debut=${dateDebut}&fin=${dateFin}`);
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setFactures(result);
                setfactureSauvegarde(result);
            } else {
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () { console.error("Erreur réseau"); });
        req.send();
    }

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}factures_pharmacie.php?id=${factureSelectionne[0].id}`);
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
            });
            req.send();
        }
    }, [effet2]);

    const afficherInfos = (e) => {
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
        const val = e.target.value.toUpperCase().trim();
        if (val.length > 0) {
            setFactures(factureSauvegarde.filter(item => (item.patient.toUpperCase().includes(val) || item.id.toString().toUpperCase().includes(val))));
        } else {
            setFactures(factureSauvegarde);
        }
    }

    const annulerProduit = (produit) => {
        SetIsLoad(true);
        fetch(`${nomDns}maj_stocks_supprimes.php?user=${props.nomConnecte}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produit)
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(() => { majLaVue(produit); });
                } else {
                    return response.text().then(text => { throw new Error(`Erreur ${response.status}: ${text}`); });
                }
            })
            .catch(error => { console.error('Erreur complète:', error); });
    }

    const majLaVue = (produit) => {
        produit = { ...produit, status_vente: 'annuled' };
        let filterDetailsFacture = detailsFacture.filter(item => item.id !== produit.id);
        filterDetailsFacture.push(produit);
        setdetailsFacture(filterDetailsFacture);
        let nouveauNetAPayer = parseInt(factureSelectionne[0].a_payer) - parseInt(produit.prix_total);
        setfactureSelectionne([{ ...factureSelectionne[0], a_payer: nouveauNetAPayer < 0 ? 0 : nouveauNetAPayer }]);
        const elt = document.getElementById('annuler-produit');
        if (elt) {
            elt.disabled = false;
            elt.style.cursor = 'pointer';
        }
        seteffet(!effet);
    }

    const rechercherHistorique = () => {
        changeDateDebut(date_select1.current.value + ' 00:00:00')
        changeDateFin(date_select2.current.value + ' 23:59:59')
        seteffet(!effet)
    }

    return (
        <div className="container-facture">
            <div className="liste-medoc">
                <RechercheFactures
                    date_select1={date_select1}
                    date_select2={date_select2}
                    rechercherHistorique={rechercherHistorique}
                    filtrerListe={filtrerListe}
                />
                <ListeFactures factures={factures} afficherInfos={afficherInfos} />
            </div>
            <div className="details">
                <h3>Détails facture</h3>
                <DetailsFacture
                    factureSelectionne={factureSelectionne}
                    detailsFacture={detailsFacture}
                    mois={mois}
                    annulerProduit={annulerProduit}
                    isLoad={isLoad}
                    role={props.role}
                    relicat={relicat}
                    componentRef={componentRef}
                    nomConnecte={props.nomConnecte}
                />
            </div>
        </div>
    );
}
