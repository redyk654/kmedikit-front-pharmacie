import React, { useEffect, useState, useContext } from 'react';
import AfficherProd from '../AfficherProd/AfficherProd';
import './ModifierProduit.css';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import { ContextChargement } from '../../Context/Chargement';
import { Toaster, toast } from "react-hot-toast";
import EditerProd from '../Approvisionner/EditerProd';
import { nomDns, type_recherche } from '../../shared/Globals';
import GererClasses from '../GererClasses/GererClasses';
import { CBadge, CButton, CFormCheck, CFormInput, CListGroup, CListGroupItem, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { useRef } from 'react';

const customStyles1 = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
    //   background: '#0e771a',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
    },
};

const customStyles3 = {
    content: {
        top: '45%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        width: '60vw',
        height: '70vh',
    },
};

const medocs = {
    code: '',
    designation: '',
    classe: '',
    pu_achat: '',
    pu_vente: '',
    conditionnement: '',
    stock_ajoute: '',
    min_rec: '',
    categorie: '',
    date_peremption: '',
    montant_commande: '',
    genre: 'generique',
    dci: '',
};

export default function ModifierProduit() {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const {darkLight} = useContext(ContextChargement);
    const refDci = useRef();

    const [afficherListe, setAfficherListe] = useState(false);
    const [listeProduit, setListeProduit] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [nvprix, setnvprix] = useState('');
    const [valeurSaisi, setValeurSaisi] = useState('');
    const [produitSelectionne, setproduitSelectionne] = useState([]);
    const [infosMedoc, setInfosMedoc] = useState(medocs);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalModifPrix, setModalModifPrix] = useState(false)
    const [modalReussi, setModalReussi] = useState(false);
    const [messageReussi, setMessageReussi] = useState('');
    const [modalGererClasses, setModalGererClasses] = useState(false);
    const [refecth, setRefetch] = useState(false)
    const [modif, setModif] = useState(false)
    const [msgErreur, setMsgErreur] = useState('');
    const [listeDesDci, setListeDesDci] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [ajoutEnCours, setAjoutEnCours] = useState(false);
    const [designationDci, setDesignationDci] = useState('');
    const [filtrerPar, setFiltrerPar] = useState(type_recherche.nom);


    const {code, designation, classe, pu_achat, pu_vente, conditionnement, stock_ajoute, min_rec, categorie, date_peremption, montant_commande, genre, dci} = infosMedoc;

    useEffect(() => {
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_medoc.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setListeProduit(result.filter(prod => prod.designation.toLowerCase().indexOf(valeurSaisi.toLowerCase()) !== -1));
                setListeSauvegarde(result);
                setAfficherListe(true);
            }
        });

        req.send();

        recupererListeDci();

    }, [refecth]);

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

    const filtrerListe = (e) => {
        setValeurSaisi(e.target.value);
        let medocFilter;
        switch(filtrerPar) {
            case type_recherche.nom:
                medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
                break;
            case type_recherche.dci:
                medocFilter = listeSauvegarde.filter(item => (item.dci.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
                break;
            case type_recherche.classe:
                medocFilter = listeSauvegarde.filter(item => (item.classe.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
                break;
        }
        setListeProduit(medocFilter);
    }

    const selectionneProduit = (e) => {
        const prod = listeProduit.filter(item => (item.id == e.target.value));
        setproduitSelectionne(prod);
        setInfosMedoc(prod[0]);
        setModif(false);
    }

    const handleChange = (e) => {
        if (e.target.name === "code") {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value.toUpperCase()});
        } else {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value});
        }
    }

    const supprimerProduit = () => {
        // Suppression du produit selectionné
        document.querySelector('#btn-supprimer-prod').disabled = true;
        if (produitSelectionne.length > 0) {
            const data = new FormData();
            data.append('id', produitSelectionne[0].id);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}supprimer_produit.php`);

            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    document.querySelector('#btn-supprimer-prod').disabled = false;
                    toast.success("Suppression éffectué !", {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '18px',
                            backgroundColor: '#fff',
                            letterSpacing: '1px'
                        },
                        
                    });
                    setRefetch(!refecth);
                    setproduitSelectionne([]);
                }
            });

            req.send(data);
        }
    }

    const modifierProd = () => {
        // Mettre à jour le prix
        if (pu_vente.length === 0|| isNaN(parseInt(pu_vente)) && isNaN(parseInt(min_rec)) && isNaN(parseInt(pu_achat))) {
            setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
        } else if (designation.length === 0) {
            setMsgErreur('Le produit doit avoir une designation')
        } else {
            setMsgErreur('')
            const data = new FormData();
            data.append('produit', JSON.stringify(infosMedoc));
            
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}modif_prod.php`);
            
            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    setproduitSelectionne([]);
                    setInfosMedoc(medocs);
                    setModif(false)
                    setRefetch(!refecth);
                    toastReussi();
                }
            });

            req.send(data);
            setnvprix('');
        }
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
    }
    
    const fermerModalClasse = () => {
        setModalGererClasses(false);
    }
    
    const ouvriModalClasse = () => {
        setModalGererClasses(true);
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const toastReussi = () => {
        toast.success("Modification éffectué !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
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
                console.log(error.message);
            })
        }
    }

    const handleRadioFiltre = (e) => {
        if (e.target.id === 'filter-par-designation') {
            setFiltrerPar(type_recherche.nom);
        } else if (e.target.id === 'filter-par-dci') {
            setFiltrerPar(type_recherche.dci);
        } else if (e.target.id === 'filter-par-classe') {
            setFiltrerPar(type_recherche.classe);
        }
        // setFiltrerPar(e.target.id === 'filter-par-designation' ? 'designation' : 'dci');
    }

    return (
        <animated.div style={props1}>
            <div><Toaster/></div>
            <section className="modif-produit">
                <Modal
                    isOpen={modalReussi}
                    onRequestClose={fermerModalReussi}
                    style={customStyles2}
                    contentLabel="réussi"
                >
                    <h2 style={{color: '#fff'}}>{messageReussi}!</h2>
                    <button style={{width: '10%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>OK</button>
                </Modal>
                <Modal
                    isOpen={modalGererClasses}
                    onRequestClose={fermerModalClasse}
                    style={customStyles3}
                    contentLabel="gerer classes"
                >
                    <GererClasses />
                </Modal>
                <div className="col-1">
                    <div className='m-2'>
                        <a role="button" class={`text-${darkLight ? 'light' : 'dark'} fw-bold`} onClick={ouvriModalClasse}>Gerer les classes</a>
                    </div>
                    <div className='m-2'>
                        <a role="button" class={`text-${darkLight ? 'light' : 'dark'} fw-bold`} onClick={ouvrirModalDci}>Gerer les dci</a>
                    </div>
                    <CFormCheck
                        checked={filtrerPar === type_recherche.nom}
                        onChange={handleRadioFiltre}
                        type='radio'
                        name='filter-par'
                        id='filter-par-designation'
                        label='par nom commercial'
                        defaultChecked
                    />
                    <CFormCheck
                        checked={filtrerPar === type_recherche.dci}
                        onChange={handleRadioFiltre}
                        type='radio'
                        name='filter-par'
                        id='filter-par-dci'
                        label='par DCI'
                    />
                    <CFormCheck
                        checked={filtrerPar === type_recherche.classe}
                        onChange={handleRadioFiltre}
                        type='radio'
                        name='filter-par'
                        id='filter-par-classe'
                        label='par classe'
                    />
                    <p className="search-zone">
                        <input type="text" placeholder={`recherchez par ${filtrerPar}`} onChange={filtrerListe} />
                    </p>
                    <h1>Liste des produits</h1>
                    {/* <button onClick={supprimerProduitEpuise}>Vider</button> */}
                    <ul>
                        {afficherListe ? listeProduit.map(item => (
                            <li value={item.id} key={item.id} onClick={selectionneProduit} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? '#dd4c47' : ''}`}}>{item.designation.toLowerCase()}</li>
                            )) : null}
                    </ul>
                </div>
                <div className="col-2">
                    <h1>Détails du produit</h1>
                    {modif ? (
                        <>
                            <EditerProd
                                listeDesDci={listeDesDci}
                                code={code}
                                designation={designation}
                                classe={classe}
                                categorie={categorie}
                                pu_vente={pu_vente}
                                pu_achat={pu_achat}
                                min_rec={min_rec}
                                conditionnement={conditionnement}
                                date_peremption={date_peremption}
                                stock_ajoute={stock_ajoute}
                                genre={genre}
                                dci={dci}
                                nvProd={true}
                                ajouterMedoc={modifierProd}
                                handleChange={handleChange}
                            />
                        </>
                    ) : (
                        <div className="infos-medoc">
                            {produitSelectionne.length > 0 && produitSelectionne.map(item => (
                                <AfficherProd
                                key={item.id}
                                code={item.code}
                                designation={item.designation}
                                pu_achat={item.pu_achat}
                                pu_vente={item.pu_vente}
                                en_stock={item.en_stock}
                                min_rec={item.min_rec}
                                categorie={item.categorie}
                                conditionnement={item.conditionnement}
                                date_peremption={item.date_peremption}
                                classe={item.classe}
                                genre={item.genre}
                                dci={item.dci}
                                />
                            ))}
                        </div>
                    )}
                    <div style={{color: 'red', backgroundColor: `#fff`}}>{msgErreur}</div>

                    <div className="buttons" style={{display: `${!modif ? 'block' : 'none'}`, textAlign: 'center'}}>
                        <button className='bootstrap-btn w-25' onClick={() => { if (produitSelectionne.length > 0) {setModif(true); afterModal();}}}>Modifier</button>
                        <button id='btn-supprimer-prod' className='bootstrap-btn annuler w-25' onClick={() => { produitSelectionne.length > 0 && supprimerProduit()}}>Archiver</button>
                    </div>
                </div>
            </section>

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
        </animated.div>
    )
}
