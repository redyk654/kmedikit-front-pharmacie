import React, { useState, useEffect } from 'react';
import { CTable, CForm, CFormInput, CContainer, CRow, CCol, CButton } from '@coreui/react';
import { nomDns } from '../../shared/Globals';
import UseMsgErreur from '../../Customs/UseMsgErreur';

export default function GererClasses() {

    const colonnes = [
        {
          key: 'id',
          label: 'num',
          _props: { scope: 'col' },
        },
        {
            key: 'designation',
            label: 'classe',
            _props: { scope: 'col' },
        }
    ];

    const [listeDesClasses, setListeDesClasses] = useState([]);
    const [msgErreur, setMsgErreur] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        recupererClasses();
    }, [])

    const recupererClasses = () => {
        fetch(`${nomDns}ajouter_classes_produits.php?liste_classes`)
        .then(res => res.json())
        .then(data => {
            setMsgErreur('');
            setListeDesClasses(data);
        })
        .catch(err => setMsgErreur("erreur réseau"));
    }

    const handleChange = (e) => {
        setDesignation(e.target.value);
    }

    const ajouterClasse = (e) => {
        e.preventDefault();
        if (designation !== '') {
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}ajouter_classes_produits.php?ajouter_classe&designation=${designation}`);
    
            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    const result = JSON.parse(req.responseText);
                    if (result.status === 'existe') {
                        setMsgErreur('Cette classe existe déjà');
                    } else {
                        recupererClasses();
                        setDesignation('');
                        setMsgErreur('');
                    }
                }
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMsgErreur("erreur réseau");
            });
    
            req.send();
        } else {
            setMsgErreur('La désignation est obligatoire');
        }

    }

  return (
    <div>
        <h2 className='text-center'>Gestion des classes</h2>
        <CContainer >
            <CRow>
                <CCol>
                    <CForm>
                        <CFormInput
                            onChange={handleChange}
                            type="text"
                            name="designation"
                            placeholder="nouvelle classe"
                            value={designation}
                            valid={designation !== ''}
                        />
                    </CForm>
                </CCol>
                <CCol>
                    <CButton onClick={ajouterClasse} color="dark">Ajouter</CButton>
                </CCol>
            </CRow>
        </CContainer>
        {UseMsgErreur(msgErreur)}
        <CTable columns={colonnes} items={listeDesClasses} striped />
    </div>
  )
}