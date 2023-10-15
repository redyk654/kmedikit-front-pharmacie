import React, { useContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import './ListeProduits.css'
import AfficherListe from './AfficherListe/AfficherListe';
import RechercherProd from '../RechercherProd/RechercherProd';
import { ROLES, nomDns, regrouperParClasse, serveurNodeProd } from '../../shared/Globals';
import { CBadge, CButton, CFormCheck, CFormInput, CListGroup, CListGroupItem, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { ContextChargement } from '../../Context/Chargement';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import Loader from 'react-loader-spinner';
import { io } from 'socket.io-client';

const socket = io.connect(`${serveurNodeProd}`);

export default function ListeProduits() {

    const listeClasses = [
        'antibiotiques',
        'antipaludiques',
        'antiinflammatoiresetantalgiques',
        'antispamodiques',
        'antigrippaux',
        'antihistaminiqueh1',
        'antiulcereuxetantiacide',
        'vermifuges',
        'vitaminesetelectrolytes',
        'antianemiques',
    ]

    const refDci = useRef();

    const [listeProduits, setListeProduits] = useState([]);
    const [listeProduitsSauvegarde, setListeProduitsSauvegarde] = useState([]);
    const [listeDesDci, setListeDesDci] = useState([]);
    const [msgErreur, setMsgErreur] = useState('')
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [ajoutEnCours, setAjoutEnCours] = useState(false);
    const [designationDci, setDesignationDci] = useState('');
    const [chargementEnCours, setChargementEnCours] = useState(true);
    const [filtrerPar, setFiltrerPar] = useState('nom commercial');

    const { darkLight, role } = useContext(ContextChargement)

    useEffect(() => {
        recupererListeProduits();
        recupererListeDci();
    }, []);

    useEffect(() => {
        socket.on('actualiser_produits', () => {
            recupererListeProduits();
            console.log('actualiser_produits');
        })
    }, [socket])

    const recupererListeProduits = () => {
        fetch(`${nomDns}liste_produits_par_classe.php`)
        .then(response => response.json())
        .then(data => {
            
            setMsgErreur('')
            setListeProduits(data);
            setListeProduitsSauvegarde(data);
            setChargementEnCours(false);
            // console.log(regrouperParClasse(data));
        })
        .catch(error => {
            setMsgErreur("erreur réseau");
            console.log(error.message);
        })
    }

    const recupererListeDci = () => {
        fetch(`${nomDns}gerer_dci.php?liste_dci`)
        .then(response => response.json())
        .then(data => {
            setListeDesDci(data);
        })
        .catch(error => {
            setMsgErreur('erreur réseau');
        })
    }

    const modifierListeProduits = (liste) => {
        setListeProduits(liste);
    }

    const ouvrirModalDci = () => {
        setModalIsVisible(true)
    }

    const fermerModalDci = () => {
        setModalIsVisible(false)
    }

    const ajouterDci = () => {
        setAjoutEnCours(true)
        const dci = designationDci.trim().toLowerCase();

        if (dci.length > 0) {
            fetch(`${nomDns}gerer_dci.php?dci=${dci}`)
            .then()
            .then(data => {
                recupererListeDci();
                setDesignationDci('');
                setAjoutEnCours(false)
            })
            .catch(error => {
                // setAjoutEnCours(false)
                setMsgErreur('erreur réseau');
            })
        }
    }

    const supprimerDci = (id_dci) => {
        fetch(`${nomDns}gerer_dci.php?id_dci=${id_dci}`)
        .then()
        .then(data => {
            setListeDesDci(listeDesDci.filter(item => item.id !== id_dci));
        })
        .catch(error => {
            setMsgErreur('erreur réseau');
        })
    }

    const handleRadioFiltre = (e) => {
        if (e.target.id === 'filter-par-designation') {
            setFiltrerPar('nom commercial');
        } else if (e.target.id === 'filter-par-dci') {
            setFiltrerPar('dci');
        } else if (e.target.id === 'filter-par-classe') {
            setFiltrerPar('classe');
        }
        // setFiltrerPar(e.target.id === 'filter-par-designation' ? 'designation' : 'dci');
    }

  return (
    chargementEnCours ?
    <div className='text-center pt-5'>
        <Loader type="TailSpin" color="#03ca7e" height={50} width={50}/>
        chargement...
    </div> 
    :

    <div className='liste-prod'>
        <RechercherProd
            listeProduitsSauvegarde={listeProduitsSauvegarde}
            setListeProduits={setListeProduits}
            placeholder={`rechercher par ${filtrerPar}`}
            filtrerPar={filtrerPar}
        />
        <div>
            <CFormCheck
                checked={filtrerPar === 'nom commercial'}
                onChange={handleRadioFiltre}
                type='radio'
                name='filter-par'
                id='filter-par-designation'
                label='par nom commercial'
                defaultChecked
            />
            <CFormCheck
                checked={filtrerPar === 'dci'}
                onChange={handleRadioFiltre}
                type='radio'
                name='filter-par'
                id='filter-par-dci'
                label='par DCI'
            />
            <CFormCheck
                checked={filtrerPar === 'classe'}
                onChange={handleRadioFiltre}
                type='radio'
                name='filter-par'
                id='filter-par-classe'
                label='par classe'
            />
        </div>
        {/* <div className={`m-2 ${role.toLowerCase() !== ROLES.medecinAdmin.toLowerCase() && 'd-none'}`}>
            <a
                className={`${darkLight ? 'link-light' : 'link-primary'}`}
                role='button'
                onClick={ouvrirModalDci}
            >
                Gérer D.C.I
            </a>
        </div> */}
        <p className='erreur-message'>{msgErreur}</p>
        <AfficherListe
            listeProduits={listeProduits}
            listeDesDci={listeDesDci}
            modifierListeProduits={modifierListeProduits}
        />
        <CModal
            visible={modalIsVisible}
            backdrop="static"
            onClose={fermerModalDci}
            scrollable
        >
            <CModalHeader onClose={fermerModalDci}>
                <CModalTitle>Gérer DCI</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput
                    placeholder='ajouter DCI'
                    ref={refDci}
                    value={designationDci}
                    onChange={(e) => setDesignationDci(e.target.value)}
                />
                <CButton 
                    className='mt-2'
                    color='dark'
                    size='sm'
                    disabled={ajoutEnCours}
                    onClick={ajouterDci}
                >
                    Ajouter
                </CButton>
                <CListGroup className=' mt-3'>
                    {listeDesDci.map(dci => (
                        <CListGroupItem>
                            {dci.designation} &nbsp;
                            {/* <CBadge 
                                className=' float-end'
                                role='button'
                                color='danger'
                                onClick={() => supprimerDci(dci.id)}
                            >
                                <CIcon icon={cilTrash} />
                            </CBadge> */}
                        </CListGroupItem>
                    ))}
                </CListGroup>
            </CModalBody>
        </CModal>
    </div>
  )
}
