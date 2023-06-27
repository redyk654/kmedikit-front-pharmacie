import React from 'react';
import "./AfficherInventaire.css"
import { CFormInput } from '@coreui/react';

export default function AfficherInventaire(props) {
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
                        <td>{item.stock_theorique}</td>
                        <td>
                            <CFormInput id={item.id_prod} value={item.stock_reel} onChange={props.corrigerStock} type="text" autoComplete='off' />
                        </td>
                        <td>{parseInt(item.difference) > 0 ? '+' + item.difference : item.difference}</td>
                        <td>{item.pu_achat + 'f'}</td>
                        <td>{item.p_total + 'f'}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    </div>
  )
}
