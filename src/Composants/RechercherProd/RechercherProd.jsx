import React from 'react'
import { cleanAccent } from '../../shared/Globals';
import { CContainer, CFormInput } from '@coreui/react';

export default function RechercherProd(props) {

    const filtrerListe = (e) => {
        let str = cleanAccent(e.target.value)
        const liste = props.listeProduitsSauvegarde.filter(item => (cleanAccent(item.designation.toLowerCase()).indexOf(str.trim().toLowerCase()) !== -1));
        props.setListeProduits(liste);
    }

  return (
    <CContainer className='pt-2'>
        <CFormInput
          placeholder="désignation"
          onChange={filtrerListe}
        />
        {/* <input type="text" className="rechercher" placeholder="recherchez un produit" onChange={filtrerListe} /> */}
    </CContainer>
  )
}
