import React, { useState, useEffect, useContext } from 'react';
import { ROLES, nomDns, problemeConnexion } from '../../shared/Globals';
import UseMsgErreur from '../../Customs/UseMsgErreur';
import { CContainer, CRow, CCol } from '@coreui/react';
import { ContextChargement } from '../../Context/Chargement';

export default function EditerProd(props) {

    const { role } = useContext(ContextChargement);

    const [listeDesClasses, setListeDesClasses] = useState([]);
    const [msgErreur, setMsgErreur] = useState('');


    const handleChange = (e) => {
        if (props.nvProd || e.target.name === "stock_ajoute") {
            props.handleChange(e);
        }
    }

    useEffect(() => {
        recupererClasses();
    }, [])

    const recupererClasses = () => {
        fetch(`${nomDns}ajouter_classes_produits.php?liste_classes`)
        .then(res => res.json())
        .then(data => {
            setMsgErreur('');
            setListeDesClasses(data);
        })
        .catch(err => setMsgErreur(problemeConnexion));
    }

  return (
    <CContainer className=''>
        <CRow className="box">
            {/* <CCol className="detail-item">
                <label htmlFor="">Code</label>
                <input type="text" name="code" value={props.code} onChange={handleChange} autoComplete="off" />
            </CCol> */}
            <CCol className="d-flex flex-column">
                <label htmlFor="">Désignation</label>
                <input type="text" name="designation" value={props.designation} onChange={handleChange} autoComplete="off" />
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Stock Minimum</label>
                <input type="text" name="min_rec" value={props.min_rec} onChange={handleChange} autoComplete="off" />
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Forme</label>
                <input type="text" name="categorie" value={props.categorie} onChange={handleChange} autoComplete="off" />
            </CCol>
        </CRow>
        <CRow className="box">
            <CCol className="d-flex flex-column">
                <label htmlFor="">Prix de vente</label>
                <input type="text" name="pu_vente" value={props.pu_vente} onChange={handleChange} autoComplete="off" />
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Conditionnement</label>
                <input type="text" name="conditionnement" value={props.conditionnement} onChange={handleChange} autoComplete="off" />
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Date Péremption</label>
                <input type="text" name="date_peremption" placeholder="mm-aa" value={props.date_peremption} onChange={handleChange} autoComplete="off" />
            </CCol>
        </CRow>
        <CRow 
            // style={{visibility: `${role.toUpperCase() === ROLES.vendeur.toUpperCase() && 'invisible'}`}} 
            className={`box ${role.toUpperCase() === ROLES.vendeur.toUpperCase() && 'd-none'}`}>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Prix d'achat</label>
                <input type="text" name="pu_achat" value={props.pu_achat} onChange={handleChange} autoComplete="off" />
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Catégorie</label>
                <select name="genre" id="genre" onChange={handleChange} value={props.genre}>
                    <option value="">non répertorié</option>
                    <option value="generique">générique</option>
                    <option value="sp">spécialité</option>
                </select>
            </CCol>
            <CCol className="d-flex flex-column">
                <label htmlFor="">Classe</label>
                <select name="classe" id="classe" onChange={handleChange} value={props.classe}>
                    {
                        listeDesClasses.map(classe => {
                            return <option key={classe.id} value={classe.designation}>{classe.designation}</option>
                        })
                    }
                </select>
            </CCol>
        </CRow>
        <CRow className="box">
            <CCol xs={3} className="d-flex flex-column" style={{display: `${!props.nvProd ? 'block' : 'none'}`}}>
                <label htmlFor="">Quantité commandé</label>
                <input type="text" name="stock_ajoute" value={props.stock_ajoute} onChange={handleChange} autoComplete="off" />
            </CCol>
        </CRow>
        <CRow>
            <CCol xs={3} className="d-flex flex-column">
                <button className='bootstrap-btn w-100' onClick={props.ajouterMedoc}>Ajouter</button>
            </CCol>
        </CRow>
    </CContainer>
  )
}
