import React from 'react'
import { useState, useContext } from 'react'
import AfficherInventaire from '../../shared/AfficherInventaire'
import Btn from '../../shared/Btn'
import TitleH1 from '../../shared/TitleH1'
import TitleH2 from '../../shared/TitleH2'
import { colors, currentDateString } from '../../shared/Globals'
import Loader from "react-loader-spinner";
import { VscError } from "react-icons/vsc";
import BtnIcon from '../../shared/BtnIcon'
import SearchInput from '../../shared/SearchInput'
import { CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react'
import AfficherProduitsRecherches from '../../shared/AfficherProduitsRecherches'

export default function SaveInventaire(props) {
  return (
    <div id='save-inventaire'>
      {/* <ModalConfirmation
        isOpen={isOpen}
        enregister={props.handleClick}
        fermerModalConfirmation={fermerModalConfirmation}
        enCours={props.enCours}
        styles={customStyles1}

      /> */}
        {props.enCours ?
            <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div>
            :
          <>
            <BtnIcon handleClick={props.fermerModalInventaire}>
              <VscError size={40} color={colors.danger} />
            </BtnIcon>
            <TitleH1 val="Fiche Inventaire" />
            <TitleH2 val={`Inventaire du ${currentDateString()}`} />
            <CContainer>
              <CRow>
                <CCol xs={3}>
                  <CForm onSubmit={(e) => e.preventDefault()}>
                    <CFormInput
                      type="text"
                      id="rechercher-produit"
                      label=""
                      placeholder="rechercher un produit"
                      onChange={props.handleChangeProd}
                    />
                  </CForm>
                  <AfficherProduitsRecherches
                    produits={props.listeProduitsRecherches}
                    ajouterProduitDansInventaire={props.ajouterProduitDansInventaire}
                  />
                </CCol>
                <CCol>
                  <AfficherInventaire
                    listeProds={props.listeProds}
                    corrigerStock={props.corrigerStock}
                    supprimerProd={props.supprimerProd}
                  />
                </CCol>
              </CRow>
            </CContainer>
            <div style={{textAlign: 'center'}}>        
              <Btn
                  text="Sauvegarder"
                  classe="bootstrap-btn"
                  handleClick={props.handleClick}
                  styles={{width: '20%', marginTop: '25px'}}
              />
            </div>
          </>
        }
    </div>
  )
}