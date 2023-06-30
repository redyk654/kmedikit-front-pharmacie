import React, { useContext } from 'react';
import "./AfficherInventaire.css"
import { CFormInput } from '@coreui/react';
import { ContextChargement } from '../Context/Chargement';
import { ROLES } from './Globals';


export default function AfficherInventaire(props) {

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
                        <td>{item.stock_theorique}</td>
                        <td>
                            <CFormInput id={item.id_prod} value={item.stock_reel} onChange={props.corrigerStock} type="text" autoComplete='off' />
                        </td>
                        <td>{parseInt(item.difference) > 0 ? '+' + item.difference : item.difference}</td>
                        <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>{item.pu_achat + 'f'}</td>
                        <td style={{visibility: `${role.toLowerCase() === ROLES.admin.toLowerCase() ? 'visible' : 'hidden'}`}}>{item.p_total + 'f'}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    </div>
  )
}
