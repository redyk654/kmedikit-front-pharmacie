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
            <SearchInput
              placeholder="rechercher un produit"
              searchTerm={props.searchProd}
              handleChange={props.handleChangeProd}
              styles1={{textAlign: 'center'}}
              styles2={{width: '20%'}}
            />
            <AfficherInventaire
              listeProds={props.listeProds}
              corrigerStock={props.corrigerStock}
            />
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
