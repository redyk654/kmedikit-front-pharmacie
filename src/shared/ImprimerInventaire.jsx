import React, { Component } from 'react';
import { CTable } from '@coreui/react';
import { formaterNombre, mois } from './Globals';
import EnteteHopital from './EnteteHopital';

const colonnes = [
    {
      key: 'designation',
      label: 'designation',
      _props: { scope: 'col' },
    },
    {
        key: 'stock_theoric',
        label: 'St théorique',
        _props: { scope: 'col' },
    },
    {
        key: 'stock_reel',
        label: 'St réel',
        _props: { scope: 'col' },
    },
    {
        key: 'ecart_stocks',
        label: 'diff',
        _props: { scope: 'col' },
    },
    {
        key: 'pu_achat',
        label: 'Pu',
        _props: { scope: 'col' },
    },
    {
        key: 'prix_total',
        label: 'PT',
        _props: { scope: 'col' },
    },
];

export default class ImprimerInventaire extends Component {

    render() {
        return (
            <div>
                <EnteteHopital />
                <div style={{fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px'}}>
                    <div style={{fontSize: 18, width: '90vw'}}>
                        <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>
                            SERVICE DE LA PHARMACIE: Fiche d'inventaire {this.props.nomDuService}
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
                            <CTable columns={colonnes} items={this.props.listeProds} />
                        </div>
                        <div style={{marginTop: '15px', borderTop: '1px dotted #000', paddingTop: '10px'}}>
                            Montant total : {formaterNombre(this.props.calculerMontantTotal())}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
