import React, { useRef, useState } from 'react';
import './Connexion.css';
import { convertirDateAvecTiret, liensPhilmedical, nomDns } from '../../shared/Globals';

export default function Connexion(props) {
    let name_field = useRef()
    let password_field = useRef()
    const nom_match = 'admin';
    const mdp_match = '123';

    const date_e = new Date();
    const [erreur, setErreur] = useState('')
    const [nom, setNom] = useState('');
    const [mdp, setMdp] = useState('');
    const [showMdp, setShowMdp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Contrôle des zone de saisie avec le state
    const handleChange = (e) => {
        if(e.target.name === "nom") {
            setNom(e.target.value);
        } else if (e.target.name === "mdp"){
            setMdp(e.target.value);
        }
    }

    const verifConnexion = async (e) => {
        e.preventDefault();

        /* vérification de l'identifiant et du mot de passe */

        const data = new FormData();
        data.append('nom', nom.trim());
        data.append('mdp', mdp.trim());

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}connexion.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText == "identifiant ou mot de passe incorrect") {
                    setErreur(req.responseText);
                } else {
                    setErreur('');
                    const result = JSON.parse(req.responseText);
                    props.setRole(result.rol);
                    props.setNomConnecte(result.nom_user);
                    props.setConnecter(true);
                }
            } else {
                console.log(req.status + " " + req.statusText);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setErreur('Erreur réseau');
        });

        req.send(data);
    }

    return (
         <div className='form'>
            <div className='developer-credit'>
                Phimedical - Développé par Chrisppo Youmbissi - Tous droits réservés © {date_e.getFullYear()} - Version 2.0.0
            </div>
            <div className='back-link'>
                <a href={`${liensPhilmedical.acceuil}`} className='link-light' role='button'>
                    ← Retour à l'accueil
                </a>
            </div>
            <form onSubmit={verifConnexion}>
                <h1 className='title'>Connexion Pharmacie</h1>
                <div className='text-field'>
                    <input
                        type="text"
                        name="nom"
                        id="nom"
                        value={nom}
                        autoComplete='off'
                        onChange={handleChange}
                        placeholder=" "
                        required
                    />
                    <label htmlFor="nom">Identifiant</label>
                </div>
                <div className='text-field'>
                    <input
                        type={showMdp ? 'text' : 'password'}
                        name="mdp"
                        id="mdp"
                        value={mdp}
                        autoComplete='off'
                        onChange={handleChange}
                        placeholder=" "
                        required
                    />
                    <label htmlFor="mdp">Mot de passe</label>
                </div>
                <div className='checkbox-field'>
                    <input 
                        type="checkbox" 
                        id="showPassword"
                        checked={showMdp} 
                        onChange={(e) => setShowMdp(!showMdp)} 
                    />
                    <label htmlFor="showPassword">Afficher le mot de passe</label>
                </div>
                <button 
                    type='submit' 
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                >
                    {isLoading ? '' : 'Se connecter'}
                </button>
                {erreur && <div className='message-erreur'>{erreur}</div>}
            </form>
        </div>
    )
}
