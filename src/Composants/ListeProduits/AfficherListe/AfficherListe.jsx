import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ContextChargement } from '../../../Context/Chargement';
import { CBadge, CListGroup, CListGroupItem, CModal, CModalBody, CModalHeader, CModalTitle, CPopover, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { formaterNombre, nomDns } from '../../../shared/Globals';

const styles1 = {
    textAlign: 'right'
}

export default function AfficherListe(props) {

    const {darkLight} = useContext(ContextChargement)

    const [modalModifDci, setModalModifDci] = useState(false);
    const [produitAModifier, setProduitAModifier] = useState({});

    useEffect(() => {
        if(produitAModifier.id) {
            ouvrirModalModifDci();
        }
    }, [produitAModifier])

    const verifierClasse = () => {
        return props.listeProduits.filter(item => item.classe === props.classe).length > 0 ? true : false;
    }

    const afficherStatusProduit = (stock) => {
        return parseInt(stock) > 0 ?
                <CBadge color='success'>EN STOCK</CBadge> :
                <CBadge color='danger'>EN RUPTURE</CBadge>
    }

    const modifierDci = (e, id_dci) => {
        const designaionDci = props.listeDesDci.filter(item => item.id === id_dci)[0].designation;
        fetch(`${nomDns}gerer_dci.php?modifier_dci&id_produit=${produitAModifier.id}&designation_dci=${designaionDci}`)
        .then()
        .then(data => {
            setModalModifDci(false);
            const liste = props.listeProduits.map(item => {
                if(item.id === produitAModifier.id) {
                    item.dci = designaionDci;
                }
                return item;
            })
            props.modifierListeProduits(liste);
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    const fermerModalModifDci = () => {
        setModalModifDci(false);
    }

    const ouvrirModalModifDci = () => {
        setModalModifDci(true);
    }

  return (
    <>
        <CTable color={`${darkLight ? 'dark' : 'light'}`} striped>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope='col'>Des</CTableHeaderCell>
                    {/* <CTableHeaderCell scope='col'>Forme</CTableHeaderCell> */}
                    <CTableHeaderCell scope='col'>Pu.vente</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>Status</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
            {props.listeProduits.map(item => (
                <CTableRow>
                    <CTableDataCell>
                        <div 
                            className=' d-flex flex-column' 
                            onClick={() => setProduitAModifier(props.listeProduits.filter(produit => produit.id === item.id)[0])}
                        >
                            <div className='fw-bold'>
                                {item.designation.toLowerCase()}
                            </div>
                            <div>
                                {item.dci.toLowerCase()}
                            </div>
                        </div>
                    </CTableDataCell>
                    {/* <CTableDataCell>{item.categorie}</CTableDataCell> */}
                    <CTableDataCell>{formaterNombre(item.pu_vente) + 'f'}</CTableDataCell>
                    <CTableDataCell>{afficherStatusProduit(item.en_stock)}</CTableDataCell>
                </CTableRow>
            ))}
            </CTableBody>
        </CTable>
        <CModal
            visible={modalModifDci}
            onClose={fermerModalModifDci}
            backdrop="static"
            size='sm'
        >
            <CModalHeader onClose={fermerModalModifDci}>
                <CModalTitle>Modifer dci de <strong>{produitAModifier?.designation}</strong></CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CListGroup className=' mt-3'>
                    {props.listeDesDci.map(dci => (
                        <CListGroupItem
                            key={dci.id}
                            component={'button'}
                            onClick={(e) => modifierDci(e, dci.id)}>
                            {dci.designation}
                        </CListGroupItem>
                    ))}
                </CListGroup>
            </CModalBody>
        </CModal>
    </>
  )
}
