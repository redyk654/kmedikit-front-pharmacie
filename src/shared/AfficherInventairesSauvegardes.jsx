import React, { useContext } from 'react';
import "./AfficherInventaire.css"
import { ROLES, formaterNombre } from './Globals';
import { ContextChargement } from '../Context/Chargement';

export default function AfficherInventairesSauvegardes(props) {

    const { role } = useContext(ContextChargement);

  return (
    <div className='modal-inventaire' style={{width: '100%', height: '60vh', overflowY: 'scroll'}}>
        <table style={{width: '100%'}} cellSpacing={0}>
            <thead>
                <tr>
                    <td>Designation</td>
                    <td>Stock théorique</td>
                    <td>Stock réel</td>
                    <td>Différence</td>
                    <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>Pu achat</td>
                    <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>P Total</td>
                </tr>
            </thead>
            <tbody style={{lineHeight: 2.9}}>
                {props.listeProds ? props.listeProds.map(item => (
                    <tr key={item.id_table}>
                        <td>{item.designation.toLowerCase()}</td>
                        <td>{item.stock_theoric}</td>
                        <td>{item.stock_reel}</td>
                        <td>{parseInt(item.ecart_stocks) > 0 ? '+' + item.ecart_stocks : item.ecart_stocks}</td>
                        <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>{formaterNombre(item.pu_achat)}</td>
                        <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>{formaterNombre(item.prix_total)}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    </div>
  )
}
