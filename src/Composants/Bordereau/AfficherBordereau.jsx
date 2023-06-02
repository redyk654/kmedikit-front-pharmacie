import React from 'react'

export default function AfficherBordereau(props) {
    return (
        <div className="bordereau-details">
            <table>
                <thead>
                    <tr>
                        <td>Désignation</td>
                        <td>Forme</td>
                        <td>Qté entrées</td>
                        <td>Pu achat</td>
                        <td>Pu vente</td>
                        <td>Date exp</td>
                    </tr>
                </thead>
                <tbody>
                    {props.commandesSelectionne.length > 0 ? props.commandesSelectionne.map(item => (
                        <tr>
                            <td>{item.designation}</td>
                            <td>{item.categorie}</td>
                            <td>{item.stock_commande}</td>
                            <td>{item.pu_achat}</td>
                            <td>{item.pu_vente}</td>
                            <td>{item.date_peremption}</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    )
}
