import { toast } from "react-hot-toast";

const toastAlerteStock = (msg, bg) => {
    toast.error(msg, {
        style: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#fff',
            backgroundColor: bg,
            letterSpacing: '1px',
        },
        
    });
}

const getMsgAlerteStock = (designation, stock) => {
    if (parseInt(stock) === 0)
        return 'le stock de ' + designation + ' est épuisé ! Pensez à vous approvisionner';
    else
        return designation + ' bientôt en rupture de stock ! Pensez à vous approvisionner';
}

export function mois(str) {

    switch(parseInt(str.substring(3, 5))) {
        case 1:
            return str.substring(0, 2) + " janvier " + str.substring(6, 10);
        case 2:
            return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
        case 3:
            return str.substring(0, 2) + " mars " + str.substring(6, 10);
        case 4:
            return str.substring(0, 2) + " avril " +  str.substring(6, 10);
        case 5:
            return str.substring(0, 2) + " mai " + str.substring(6, 10);
        case 6:
            return str.substring(0, 2) + " juin " + str.substring(6, 10);
        case 7:
            return str.substring(0, 2) + " juillet " + str.substring(6, 10);
        case 8:
            return str.substring(0, 2) + " août " + str.substring(6, 10);
        case 9:
            return str.substring(0, 2) + " septembre " + str.substring(6, 10);
        case 10:
            return str.substring(0, 2) + " octobre " + str.substring(6, 10);
        case 11:
            return str.substring(0, 2) + " novembre " + str.substring(6, 10);
        case 12:
            return str.substring(0, 2) + " décembre " + str.substring(6, 10);
    }
}

export function mois2(str) {

    switch(parseInt(str.substring(5, 7))) {
        case 1:
            return str.substring(8, 10) + " janvier " + str.substring(0, 4);
        case 2:
            return str.substring(8, 10) + " fevrier " + str.substring(0, 4);
        case 3:
            return str.substring(8, 10) + " mars " + str.substring(0, 4);
        case 4:
            return str.substring(8, 10) + " avril " +  str.substring(0, 4);
        case 5:
            return str.substring(8, 10) + " mai " + str.substring(0, 4);
        case 6:
            return str.substring(8, 10) + " juin " + str.substring(0, 4);
        case 7:
            return str.substring(8, 10) + " juillet " + str.substring(0, 4);
        case 8:
            return str.substring(8, 10) + " août " + str.substring(0, 4);
        case 9:
            return str.substring(8, 10) + " septembre " + str.substring(0, 4);
        case 10:
            return str.substring(8, 10) + " octobre " + str.substring(0, 4);
        case 11:
            return str.substring(8, 10) + " novembre " + str.substring(0, 4);
        case 12:
            return str.substring(8, 10) + " décembre " + str.substring(0, 4);
    }
}

export const colors = {
    danger: "#dd4c47",
    undef: '',
}

export const badges = {
    inventaire: "dark",
    correction: "dark",
    sortie: "info",
    livraison: "success",
}

export function isAlertStockShow (produit) {
    if (parseInt(produit.en_stock) === 0) {
        var msgAlerteStock = getMsgAlerteStock(produit.designation, produit.en_stock);
        toastAlerteStock(msgAlerteStock, '#dd4c47');
    } else if (parseInt(produit.en_stock) <= parseInt(produit.min_rec)) {
        var msgAlerteStock = getMsgAlerteStock(produit.designation, produit.en_stock);
        toastAlerteStock(msgAlerteStock, '#FFB900');
    }
}

export function selectProd (val, liste) {
    return liste.filter(item => (item.id == val))[0];
}

export function currentDateString() {
    return mois(new Date().toLocaleDateString());
}

export function genererId() {
    // Fonction pour générer un identifiant unique pour une commande
    return Math.floor((1 + Math.random()) * 0x10000000)
           .toString(16)
           .substring(1);

}

export function filtrerListe(prop, val, liste) {
    return liste.filter(item => (item[prop].toLowerCase().includes(val.toLowerCase())));
}

export const tipHeureDebut = "Pour les recettes du jour, choisissez l'heure de début à 6h (sauf si vous avez commencé le service avant) et pour les recettes de la nuit, choisissez l'heure de début à 15h (sauf si vous avez commencé le service avant)"
export const tipHeureFin = "Pour les recettes du jour, choisissez l'heure de fin à 18h (sauf si vous avez terminé le service après) et pour les recettes de la nuit, choisissez l'heure de fin à 8h (sauf si vous avez terminé le service après)"

export const genres = {
    "": "non répertorié",
    specialite: "sp",
    generique: "generique",
}

export const problemeConnexion = "Problème de connexion au serveur !";

export function afficherSexe (sexe) {
    let val;
    switch(sexe) {
        case 'H':
            val = 'homme';
            break;
        case 'F':
            val = 'femme';
            break;
        default:
            val = 'non renseigné'
    }

    return val.toUpperCase();
}

export function afficherAge (age) {
    if (parseInt(age) > 1)
        return age + "ans"
    else
        return "non renseigné".toUpperCase()
}

export const ROLES = {
    vendeur: "vendeur",
    major: "major",
    admin: "admin",
    medecin: "medecin",
}

export const SEXES = {
    h: 'H',
    f: 'F'
}

export const styleEntete = {
    color: 'black',
    borderBottom: '1px dotted #000',
    letterSpacing: '1px'
}

export const corrigerStock = (e, listeProduitsInventaires) => {
    let liste = [];
    if (e.target.value.trim() === '') {
        liste = listeProduitsInventaires.map(item => {
            if (item.id_prod === e.target.id) {
                item.stock_reel = 0;
                item.difference = parseInt(item.stock_reel) - parseInt(item.stock_theorique);
                item.p_total = parseInt(item.pu_achat) * parseInt(item.stock_reel);
            }
            return item;
        });
    } else {

        liste = listeProduitsInventaires.map(item => {
            if (item.id_prod === e.target.id) {
                item.stock_reel = parseInt(e.target.value.trim());
                item.difference = parseInt(item.stock_reel) - parseInt(item.stock_theorique);
                item.p_total = parseInt(item.pu_achat) * parseInt(item.stock_reel);
            }
            return item;
        });
    }

    return liste;
}

export const formaterNombre = (nombre) => {
    return nombre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const recupererDateJour = (idElement) => {
    let today = new Date();

    document.querySelector(`#${idElement}`).value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}

export const recupererHeureJour = (idElement) => {
    let today = new Date();

    document.querySelector(`#${idElement}`).value = ('0' + (today.getHours())).slice(-2) +  ":" + ('0' + (today.getMinutes())).slice(-2);
}

export const supprimerProd = (e, liste) => {
    const listeProd = liste.filter(item => item.id_prod !== e.target.id);
    return listeProd;
}

export const nomDns = 'http://serveur/hdmbanga/';
export const nomServeur = 'http://serveur:3010';