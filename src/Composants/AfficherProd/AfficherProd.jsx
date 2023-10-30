import React, { Fragment, useContext } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import { CContainer, CRow, CCol } from '@coreui/react';
import { genres } from '../../shared/Globals';

export default function AfficherProd(props) {

    const {darkLight, role} = useContext(ContextChargement)

    return (
        <CContainer>
            <CRow className="box">
                <CCol className="item">
                    <p>Désignation</p>
                    <p>{props.designation}</p>
                </CCol>
                <CCol className="item">
                    <p>Prix de vente</p>
                    <p>{props.pu_vente + ' Fcfa'}</p>
                </CCol>
                <CCol className="item">
                    <p>En stock</p>
                    <p style={{color: `${parseInt(props.en_stock) < parseInt(props.min_rec) ? '#ec4641' : ''}`}}>{props.en_stock}</p>
                </CCol>
            </CRow>
            <CRow className="box">
                <CCol className="item">
                    <p>Forme</p>
                    <p>{props.categorie}</p>
                </CCol>
                <CCol className="item">
                    <p>stock minimum</p>
                    <p>{props.min_rec}</p> 
                </CCol>
                <CCol className="item">
                    <p>Conditionnement</p>
                    <p>{props.conditionnement}</p> 
                </CCol>
            </CRow>
            <CRow className={`box`}>
                <CCol className="item">
                    <p>Classe</p>
                    <p>{props.classe === "" ? "non classé" : props.classe}</p>
                </CCol>
                <CCol className="item">
                    <p>Date depéremption</p>
                    <p>{props.date_peremption}</p>
                </CCol>
                <CCol className="item">
                    <p>Categorie</p>
                    <p>{genres[props.genre]}</p> 
                </CCol>
            </CRow>
            <CRow className="box">
                <CCol className={`item d-${role.toUpperCase() !== "admin".toUpperCase() && 'none'}`}>
                    <p>Prix d'achat</p>
                    <p>{props.pu_achat}</p>
                </CCol>
                <CCol className={`item d-${role.toUpperCase() !== "admin".toUpperCase() && 'none'}`}>
                    <p>D.C.I</p>
                    <p>{props.dci === "" ? "non défini" : props.dci}</p>
                </CCol>
            </CRow>
        </CContainer>
    )
}
