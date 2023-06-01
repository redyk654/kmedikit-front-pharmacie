import React, { useState, useEffect } from 'react';
import { nomDns, problemeConnexion } from '../../shared/Globals';
import UseMsgErreur from '../../Customs/UseMsgErreur';


export default function EditerProd(props) {

    const [listeDesClasses, setListeDesClasses] = useState([]);
    const [msgErreur, setMsgErreur] = useState('');

    const handleChange = (e) => {
        if (props.nvProd || e.target.name === "stock_ajoute") {
            props.handleChange(e);
        }
    }

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
        .catch(err => setMsgErreur(problemeConnexion));
    }

  return (
    <>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Code</label>
                    <input type="text" name="code" value={props.code} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Stock Minimum</label>
                    <input type="text" name="min_rec" value={props.min_rec} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Désignation</label>
                    <input type="text" name="designation" value={props.designation} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Forme</label>
                    <input type="text" name="categorie" value={props.categorie} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix de vente</label>
                    <input type="text" name="pu_vente" value={props.pu_vente} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Conditionnement</label>
                    <input type="text" name="conditionnement" value={props.conditionnement} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
        </div>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Date Péremption</label>
                    <input type="text" name="date_peremption" placeholder="mm-aa" value={props.date_peremption} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item" style={{display: `${!props.nvProd ? 'block' : 'none'}`}}>
                    <label htmlFor="">Quantité commandé</label>
                    <input type="text" name="stock_ajoute" value={props.stock_ajoute} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <button onClick={props.ajouterMedoc}>Ajouter</button>
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix d'achat</label>
                    <input type="text" name="pu_achat" value={props.pu_achat} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Catégorie</label>
                    <select name="genre" id="genre" onChange={handleChange} value={props.genre}>
                        <option value="">non répertorié</option>
                        <option value="generique">générique</option>
                        <option value="sp">spécialité</option>
                    </select>
                </div>
            </div>
            <div className='box'>
                <div className="detail-item">
                    <label htmlFor="">Classe</label>
                    <select name="classe" id="classe" onChange={handleChange} value={props.classe}>
                        {
                            listeDesClasses.map(classe => {
                                return <option key={classe.id} value={classe.designation}>{classe.designation}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>
    </>
  )
}
