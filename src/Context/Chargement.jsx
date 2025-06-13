import React , {createContext, useState} from 'react';

/*
    - Context pour gerer l'état du loader
*/

export const ContextChargement = createContext();

const ContextChargementProvider = (props) => {
    const [chargement, setChargement] = useState(true);
    const [darkLight, setDarkLight] = useState(false);
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [role, setRole] = useState('');

    const stopChargement = () => {
        setChargement(false);
    }

    const startChargement = () => {
        setChargement(true);
    }

    const toogleTheme = () => {
        setDarkLight(!darkLight);
    }

    const changeDateDebut = (newDate) => {
        setDateDebut(newDate)
    }

    const changeDateFin = (newDate) => {
        setDateFin(newDate)
    }
    
    return (
        <ContextChargement.Provider value={{chargement, stopChargement, startChargement, darkLight, toogleTheme, role, setRole, dateDebut, dateFin, changeDateDebut, changeDateFin}}>
            {props.children}
        </ContextChargement.Provider>
    )
}

export default ContextChargementProvider;