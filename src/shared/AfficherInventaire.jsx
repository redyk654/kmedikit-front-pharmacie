import React, { useContext } from 'react';
import "./AfficherInventaire.css"
import { CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { ContextChargement } from '../Context/Chargement';
import { ROLES } from './Globals';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';


export default function AfficherInventaire(props) {

    const { role } = useContext(ContextChargement);

  return (
    <div className='modal-inventaire' style={{width: '100%', height: '60vh', overflowY: 'scroll'}}>
        <CTable color='dark' striped className='position-relative'>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Désignation</CTableHeaderCell>
                    <CTableHeaderCell>Stock théorique</CTableHeaderCell>
                    <CTableHeaderCell>Stock réel</CTableHeaderCell>
                    <CTableHeaderCell>Différence</CTableHeaderCell>
                    {/* {
                        role.toLowerCase() === ROLES.admin.toLowerCase() ?
                        <CTableHeaderCell>Pu achat</CTableHeaderCell> : null
                    }
                    {
                        role.toLowerCase() === ROLES.admin.toLowerCase() ?
                        <CTableHeaderCell>P Total</CTableHeaderCell> : null
                    } */}
                </CTableRow>
            </CTableHead>
            <CTableBody style={{lineHeight: 2.9}}>
                {props.listeProds ? props.listeProds.map(item => (
                    <CTableRow key={item.id_table}>
                        <CTableDataCell>
                            <CIcon id={item.id_prod} icon={cilTrash} onClick={props.supprimerProd} size="lg" role='button' />
                            {item.designation.toLowerCase()}
                        </CTableDataCell>
                        <CTableDataCell>{item.stock_theorique}</CTableDataCell>
                        <CTableDataCell>
                            <CFormInput id={item.id_prod} value={item.stock_reel} onChange={props.corrigerStock} type="text" autoComplete='off' />
                        </CTableDataCell>
                        <CTableDataCell>{parseInt(item.difference) > 0 ? '+' + item.difference : item.difference}</CTableDataCell>
                        {/* {
                            role.toLowerCase() === ROLES.admin.toLowerCase() ?
                            <CTableDataCell>{item.pu_achat + 'f'}</CTableDataCell> : null
                        }
                        {
                            role.toLowerCase() === ROLES.admin.toLowerCase() ?
                            <CTableDataCell>{item.p_total + 'f'}</CTableDataCell> : null
                        } */}
                    </CTableRow>
                )) : null}
            </CTableBody>
        </CTable>
    </div>
  )
}