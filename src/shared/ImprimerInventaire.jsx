import React, { Component } from 'react';
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { ROLES, formaterNombre, mois } from './Globals';
import EnteteHopital from './EnteteHopital';

export default class ImprimerInventaire extends Component {

    render() {
        return (
            <div>
                <EnteteHopital />
                <div style={{fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px'}}>
                    <div style={{fontSize: 18, width: '90vw'}}>
                        <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>
                            SERVICE DE LA PHARMACIE: Fiche d'inventaire
                        </h3>
                        <div style={{marginTop: 5}}>
                            Date : &nbsp;
                            <span style={{fontWeight: '600', marginTop: '15px'}}>
                                {this.props.inventaireSelectionne.date_effectue && mois(this.props.inventaireSelectionne.date_effectue.substring(0, 10))}
                            </span>
                        </div>
                        <div className='mb-3' style={{marginTop: 5}}>
                            Auteur : &nbsp;
                            <span style={{fontWeight: '600', marginTop: '15px'}}>
                                {this.props.inventaireSelectionne.auteur && this.props.inventaireSelectionne.auteur.toUpperCase()}
                            </span>
                        </div>
                        <div className='' style={{width: '90vw'}}>
                                <CTable striped>
                                    <CTableHead>
                                        <CTableRow>
                                        <CTableHeaderCell scope="col">Désignation</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">St théorique</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">St réel</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Différence</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {this.props.listeProds ? this.props.listeProds.map(item => (
                                            <CTableRow key={item.id_table}>
                                                <CTableHeaderCell>{item.designation.toLowerCase()}</CTableHeaderCell>
                                                <CTableHeaderCell>{item.stock_theoric}</CTableHeaderCell>
                                                <CTableHeaderCell>{item.stock_reel}</CTableHeaderCell>
                                                <CTableHeaderCell>{parseInt(item.ecart_stocks) > 0 ? '+' + item.ecart_stocks : item.ecart_stocks}</CTableHeaderCell>
                                            </CTableRow>
                                        )) : null}
                                    </CTableBody>
                                </CTable>
                        </div>
                        {/* <div style={{ visibility: `${this.props.role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`, marginTop: '15px', borderTop: '1px dotted #000', paddingTop: '10px'}}>
                            Montant total : {formaterNombre(this.props.calculerMontantTotal())}
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}