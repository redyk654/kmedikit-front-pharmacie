import React from 'react';
import "./AfficherInventaire.css"
import { formaterNombre } from './Globals';

export default function AfficherInventairesSauvegardes(props) {
  return (
    <div className='modal-inventaire' style={{width: '100%', height: '60vh', overflowY: 'scroll'}}>
        <table style={{width: '100%'}} cellSpacing={0}>
            <thead>
                <tr>
                    <td>Designation</td>
                    <td>Stock théorique</td>
                    <td>Stock réel</td>
                    <td>Différence</td>
                    <td>Pu achat</td>
                    <td>P Total</td>
                </tr>
            </thead>
            <tbody style={{lineHeight: 2.9}}>
                {props.listeProds ? props.listeProds.map(item => (
                    <tr key={item.id_table}>
                        <td>{item.designation.toLowerCase()}</td>
                        <td>{item.stock_theoric}</td>
                        <td>{item.stock_reel}</td>
                        <td>{parseInt(item.ecart_stocks) > 0 ? '+' + item.ecart_stocks : item.ecart_stocks}</td>
                        <td>{formaterNombre(item.pu_achat)}</td>
                        <td>{formaterNombre(item.prix_total)}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    </div>
  )
}
