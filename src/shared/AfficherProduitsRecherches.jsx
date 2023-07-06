import React, { Fragment } from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react'

export default function AfficherProduitsRecherches(props) {

    const { produits, ajouterProduitDansInventaire } = props;

  return (
    <Fragment>
        {produits?.length > 0 ? produits.map(item => (
            <CListGroup>
                <CListGroupItem id={item.id} component="button" onClick={ajouterProduitDansInventaire}>
                    {item.designation}
                </CListGroupItem>
            </CListGroup>
        )) : null}
    </Fragment>
  )
}
