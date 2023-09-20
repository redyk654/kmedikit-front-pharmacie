import React from 'react';
import { useContext } from 'react';
import { ContextChargement } from '../../../Context/Chargement';
import { CBadge, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const styles1 = {
    textAlign: 'right'
}

export default function AfficherListe(props) {

    const {darkLight} = useContext(ContextChargement)


    const verifierClasse = () => {
        return props.listeProduits.filter(item => item.classe === props.classe).length > 0 ? true : false;
    }

    const afficherStatusProduit = (stock) => {
        return parseInt(stock) > 0 ?
                <CBadge color='success'>EN STOCK</CBadge> :
                <CBadge color='danger'>EN RUPTURE</CBadge>
    }

  return (
    <>
        <CTable color={`${darkLight ? 'dark' : 'light'}`} striped>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope='col'>Des</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>Forme</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>Pu.vente</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>Status</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
            {props.listeProduits.map(item => (
                <CTableRow>
                    <CTableDataCell>{item.designation}</CTableDataCell>
                    <CTableDataCell>{item.categorie}</CTableDataCell>
                    <CTableDataCell>{item.pu_vente}</CTableDataCell>
                    <CTableDataCell>{afficherStatusProduit(item.en_stock)}</CTableDataCell>
                </CTableRow>
            ))}
            </CTableBody>
        </CTable>
        {/* {verifierClasse() &&  (
            <table style={{width: '98%', paddingLeft: '5px', backgroundColor: `${darkLight ? '#18202e' : '#fff'}`}}>
                <caption style={{backgroundColor: '#323888', color: '#fff'}}>{props.classe.toUpperCase()}</caption>
                <thead>
                    <tr style={{backgroundColor: '#323888', color: '#fff'}}>
                        <td>Désignation</td>
                        <td style={styles1}>Forme</td>
                        <td style={styles1}>Pu vente</td>
                        <td style={styles1}>Disponibilité</td>
                    </tr>
                </thead>
                <tbody>
                    {props.listeProduits.filter(item => item.classe === props.classe).map(item => (
                        <tr key={item.id}>
                            <td style={{textTransform: 'capitalize'}}>{item.designation}</td>
                            <td style={styles1}>{item.categorie}</td>
                            <td style={styles1}>{item.pu_vente}</td>
                            <td style={{...styles1, backgroundColor: `${parseInt(item.en_stock)>0 ? '#03ca7e' : '#dd4c47'}`, color: '#fff'}}>{parseInt(item.en_stock)>0 ? 'EN STOCK' : 'EN RUPTURE' }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )} */}
    </>
  )
}
