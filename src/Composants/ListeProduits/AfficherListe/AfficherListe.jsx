import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ContextChargement } from '../../../Context/Chargement';
import { CBadge, CContainer, CHeader, CHeaderBrand, CListGroup, CListGroupItem, CModal, CModalBody, CModalHeader, CModalTitle, CPopover, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { formaterNombre, nomDns, regrouperParClasse } from '../../../shared/Globals';
import Loader from 'react-loader-spinner';

const styles1 = {
    textAlign: 'right'
}

export default function AfficherListe(props) {

    const {darkLight} = useContext(ContextChargement)

    const [modalModifDci, setModalModifDci] = useState(false);
    const [modificationEnCours, setModificationEnCours] = useState(false);
    const [produitAModifier, setProduitAModifier] = useState({});

    useEffect(() => {
        if(produitAModifier.id) {
            ouvrirModalModifDci();
        }
    }, [produitAModifier])

    const afficherStatusProduit = (stock) => {
        return parseInt(stock) > 0 ?
                <CBadge color='success'>EN STOCK</CBadge> :
                <CBadge color='danger'>EN RUPTURE</CBadge>
    }

    const modifierDci = (e, id_dci) => {
        setModificationEnCours(true);
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
            setModificationEnCours(false);
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
        {regrouperParClasse(props.listeProduits).map((item, index) => (
            <div key={index} className=''>
                <CHeaderBrand className='bg-dark'>
                    <strong className='text-light'>
                        {item?.classe}
                    </strong>
                </CHeaderBrand>
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
                        {item.produits.map(item2 => (
                        <CTableRow key={item.id}>
                            <CTableDataCell>
                                <div 
                                    className='d-flex flex-column' 
                                    onClick={() => setProduitAModifier(props.listeProduits.filter(produit => produit.id === item2.id)[0])}
                                >
                                    <div className='fw-bold'>
                                        {item2.designation.toLowerCase()}
                                    </div>
                                    <div>
                                        {item2.dci.toLowerCase()}
                                    </div>
                                </div>
                            </CTableDataCell>
                            {/* <CTableDataCell>{item2.categorie}</CTableDataCell> */}
                            <CTableDataCell>{formaterNombre(item2.pu_vente) + 'f'}</CTableDataCell>
                            <CTableDataCell>{afficherStatusProduit(item2.en_stock)}</CTableDataCell>
                        </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>
        ))}
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
                {modificationEnCours 
                    ?
                    <div className='text-center pt-5'>
                        <Loader type='TailSpin'  color="#03ca7e" height={50} width={50} /> 
                        modification...
                    </div>
                    : 
                    <CListGroup className='mt-3'>
                        {props.listeDesDci.map(dci => (
                            <CListGroupItem
                                key={dci.id}
                                component={'button'}
                                onClick={(e) => modifierDci(e, dci.id)}>
                                {dci.designation}
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                }

            </CModalBody>
        </CModal>
    </>
  )
}
