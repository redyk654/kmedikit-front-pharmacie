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
    if (parseInt(stock) === 90)
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

export const ROLES = {
    admin: "admin",
    major: "major",
    vendeur: "vendeur",
    medecin: "medecin",
    medecinAdmin: "medecin-admin"
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

export function cleanAccent(str) {
    return str.trim().normalize('NFD').replace(/\p{Dia}/gu, '');
}

export const formaterNombre = (nombre) => {
    return nombre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function filtrerListe(prop, val, liste) {
    return liste.filter(item => (item[prop].toLowerCase().includes(val.toLowerCase())));
}

export function regrouperParClasse(tableau) {
    const groupes = {}; // Un objet pour stocker les groupes par classe
  
    // Parcourez chaque objet dans le tableau
    tableau.forEach((objet) => {
        let classe = objet.classe;

        // Si la classe est une chaîne de caractères vide, remplacez-la par "autres"
        if (classe === "") {
            classe = "autres";
        }
  

        // Si la classe n'existe pas dans les groupes, créez un tableau vide
        if (!groupes[classe]) {
        groupes[classe] = [];
        }

        // Ajoutez l'objet au groupe correspondant
        groupes[classe].push(objet);
    });

    // Transformez l'objet de groupes en un tableau de groupes
    const groupesTableau = Object.keys(groupes).map((classe) => {
        return { classe, produits: groupes[classe] };
    });
  
    return groupesTableau;
}

export const tipHeureDebut = "Pour les recettes du jour, choisissez l'heure de début à 6h (sauf si vous avez commencé le service avant) et pour les recettes de la nuit, choisissez l'heure de début à 15h (sauf si vous avez commencé le service avant)"
export const tipHeureFin = "Pour les recettes du jour, choisissez l'heure de fin à 18h (sauf si vous avez terminé le service après) et pour les recettes de la nuit, choisissez l'heure de fin à 8h (sauf si vous avez terminé le service après)"

export const genres = {
    "": "non répertorié",
    sp: "spécialité",
    generique: "générique",
}

const ipServeur = "192.168.100.6";
const ipLocal = "localhost";
const ipModem = "192.168.8.101";

export const serveurNodeProd = `http://${ipServeur}:3015`;
export const nomDns = `http://${ipServeur}/backend-cmab/`;