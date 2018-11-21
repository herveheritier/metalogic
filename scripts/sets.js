/*************************************************
*
* manipulation d'ensembles basé sur la classe Set
*
**************************************************/
class Sets {

    constructor() { 
        this.setsMap = new Map()
    }

    // ajoute un nouvel ensemble à l'instance
    //
    // Attention, méthode d'instance
    //
    newSet(name,elementArray) {
        this.setsMap.set(name,elementArray)
        return this.setsMap.get(name)
    }

    // retourne le résulat de la comparaison de 2 ensembles
    // true si les ensembles sont identiques
    // false sinon
    static areEqual(set1,set2) {
        var array1 = [...set1]
        var array2 = [...set2]
        return array1.length === array2.length && array1.sort().every(function(value, index) { return value === array2.sort()[index]});
    }

    // retourne une liste d'élément composé des éléments des ensembles fournis
    // les éléments présents dans plusieurs ensembles ne sont présents qu'une seule fois dans l'ensemble obtenu
    // "ensembleArray" est soit un tableau, soit une liste d'arguments où chacun est un ensemble
    static union(ensembleArray) {
        if(arguments.length>1) ensembleArray = Array.from(arguments)
        return ensembleArray.reduce( (a,e) => {
            var s0 = new Set([...e])
            return new Set([...a, ...s0])
        },new Set([]))
    }

    // vérifie que la valeur est composée d'élément appartenant à l'ensemble
    // valeur peut-être un String, un Array ou un Set
    // si valeur est un String, chaque caractère du string est un élément
    // si valeur est un Array ou un Set, ce sont les éléments qui sont recherchés, pas les caractères qui les composent
    static isInclude(ensemble,valeur) {
        //return Array.from(valeur).reduce((a,c) => a && ensemble.includes(c),true)
        var e0 = [...new Set([...ensemble])]
        var v0 = [...new Set([...valeur])]
        return v0.reduce((a,c) => a && e0.includes(c),true)
    }

    // genere une tableau de n élément appartenant à l'ensemble
    static generate(ensemble,n) {
        //return Array.from(Array(n).keys()).map((a,c)=> ensemble[Math.floor(Math.random()*ensemble.length)])
        var s0 = new Set([...ensemble])
        var a0 = Array.from(s0)
        return Array.from(Array(n).keys()).map((a,c)=> a0[Math.floor(Math.random()*a0.length)])
    }

    // retourne un tableau des noms d'ensembles auxquels appartiennent tous les éléments composants valeur
    // valeur peut-être un String, un Array ou un Set
    // si valeur est un String, chaque caractère du string est un élément
    // si valeur est un Array ou un Set, ce sont les éléments qui sont recherchés, pas les caractères qui les composent
    identifySuperset(valeur) { 
        var res = []
        var v0 = [...new Set([...valeur])]
        this.setsMap.forEach((val,key,map) => {
            var a0 = [...new Set([...val])]
            if(Sets.isInclude(a0,v0)) res.push(key) 
        })
        return res
    }

    // intersection entre 2 ensembles
    static intersection(ensemble1,ensemble2) {
        var e1 = [...new Set([...ensemble1])]
        var e2 = [...new Set([...ensemble2])]
        return e1.filter((c) => e2.includes(c) )
    }

    // ce qui existe seulement dans le 1er ensemble
    static outerLeft(ensemble1,ensemble2) {
        var e1 = [...new Set([...ensemble1])]
        var e2 = [...new Set([...ensemble2])]
        return e1.filter((c) => !e2.includes(c) )
    }

    // compare 2 ensembles
    // retourne un objet résultat de la comparaison
    // { etat : symboles représentant le résultat de la comparaison
    //   court : libellé court représentant le résultat de la comparaison
    //   long : libellé long représentant le résultat de la comparaison
    //   intersection : sous-ensemble des élément communs
    //   seul1 : sous-ensemble des éléments présent seulement dans le 1er ensemble
    //   seul2 : sous-ensemble des éléments présent seulement dans le 2nd ensemble
    //   distincts : sous-ensemble des tous les éléments (union)
    // }
    static compare(ensemble1,ensemble2) {
        var e1 = [...new Set([...ensemble1])]
        var e2 = [...new Set([...ensemble2])]
        var distincts = [...new Set(e1.concat(e2))]
        var l1 = e1.length
        var l2 = e2.length
        var ld = distincts.length
        var etat, court, long
        var intersection = Sets.intersection(ensemble1,ensemble2)
        var seul1 = Sets.outerLeft(ensemble1,ensemble2)
        var seul2 = Sets.outerLeft(ensemble2,ensemble1)
        if(l1==ld & l2==ld) 
            etat = "1=2",
            court = "1 = 2", 
            long = "ensemble 1 et ensemble 2 identiques"
        else if(l1==ld) 
            etat = "1>2",
            court = "1 \u2283 2",
            long = "ensemble 2 inclus dans ensemble 1"
        else if(l2==ld) 
            etat = "1<2",
            court = "1 \u2282 2", 
            long = "ensemble 1 inclus dans ensemble 2"
        else if((l1+l2)==ld) 
            etat = "1#2",
            court = "1 \u2260 2", 
            long = "ensemble 1 et ensemble 2 sont disjointes"
        else 
            etat = "1~2",
            court = "1 \u2229 2 = "+(l1+l2-ld), 
            long = "ensemble 1 et ensemble 2 ont "+(l1+l2-ld)+" elements communs, " + distincts.length + " elements distincts, " + seul1.length + " elements seulement dans l'ensemble 1, " + seul2.length + " elements seulement dans l'ensemble 2"
        return { etat : etat, court : court, long : long, intersection : intersection, seul1 : seul1, seul2 : seul2, distincts : distincts }
    }

    // recherche l'ensemble référencé dans le tableau "ensembleArray" qui est contenu dans toutes les autres ensembles du tableau
    // "ensembleArray" est soit un tableau, soit une liste d'arguments ; dans les 2 cas chaque c'est une list d'ensembles
    // pour chaque ensemble on peut donner son nom (string) ou l'objet ENSEMBLE.xxxxxx
    // retourne un nom d'ensemble ou null si aucun ensemble ne peut-être contenu dans les autres
    //
    // Attention, méthode d'instance
    //
    // exemples d'utilisation :
    // Sets.minimalCommonSet(Sets.identifySuperset(Sets.outerLeft(ENSEMBLE.FORMULE,ENSEMBLE.CHIFFRE))) ==> "ARITHMETIQUE"
    // - l'ensemble ARITHMETIQUE est celle qui contient tous les elements de l'ensemble FORMULE de laquelle on a retiré les éléments de l'ensemble CHIFFRE
    // Sets.minimalCommonSet(Sets.identifySuperset('PersonnageNumeroUn')) ==> "LETTRE"
    // - tous les caractère de la chaine testée sont des éléments de l'ensemble LETTRE
    // Sets.minimalCommonSet(Sets.identifySuperset(['a','8','+'])) ==> "BASE64"
    // - l'ensemble BASE64 est le plus petit ensemble contenant les éléments du tableau
    // Sets.minimalCommonSet([ENSEMBLE.DIVISE,ENSEMBLE.CHIFFRE,ENSEMBLE.FORMULE]) ==> null
    // - aucun ensemble n'est contenu dans toutes les autres
    minimalCommonSet(ensembleArray) {
        if(arguments.length>1) ensembleArray = Array.from(arguments)
        var l = ensembleArray.length
        if(l==0) return null
        var res = this.getEnsemble(ensembleArray[0])
        if(l!=1) for(var i=1;i<l;i++) {
            var res = this.getEnsemble(Sets.intersection(res,this.getEnsemble(ensembleArray[i])))
            if(res===undefined) return null
        }
        return res
    }

    // vérifie si ce qui lui est passé est bien un ensemble appatenant à l'instance de Sets
    //
    // Attention, méthode d'instance
    //
    isSet(ensemble) {
        // return Array.isArray(ensemble) ? Object.getOwnPropertyNames(ENSEMBLE).find(e => ensemble==ENSEMBLE[e])!=undefined : false
        if(Array.prototype.isPrototypeOf(ensemble) ||Set.prototype.isPrototypeOf(ensemble)) {
            var res = undefined
            this.setsMap.forEach((val,key,map) => { if(Sets.areEqual(ensemble,val)) res=key })
            if(res!==undefined) return true
            return false
        }
        return this.setsMap.has(ensemble)
    }

    // retourne le nom de l'ensemble qui lui est passée sinon undefined
    // exemple :
    // Sets.getName(ENSEMBLE.LETTRE) ==> "LETTRE"
    // Sets.getName(ENSEMBLE.FAUX) ==> undefined
    // Ensemble.getName('toto') ==> undefined
    //
    // Attention, méthode d'instance
    //
    getName(ensemble) {
        //if(Array.isArray(ensemble)) ensemble = Object.getOwnPropertyNames(ENSEMBLE).find(e => Sets.compare(ensemble,ENSEMBLE[e]).etat=="1=2")
        var res = undefined
        if(Array.prototype.isPrototypeOf(ensemble)) this.setsMap.forEach((val,key,map) => { if(Sets.areEqual(new Set([...ensemble]),val)) res=key })
        else if(Set.prototype.isPrototypeOf(ensemble)) this.setsMap.forEach((val,key,map) => { if(Sets.areEqual(ensemble,val)) res=key })
        else if(this.setsMap.has(ensemble)) res = ensemble
        return res
    }

    // vérifie que le nom ou l'ensemble qui lui est passée existe et retourne l'ensemble
    //
    // Attention, méthode d'instance
    //
    getEnsemble(ensemble) {
        var res
        var e = this.getName(ensemble)
        if(e!==undefined) return this.setsMap.get(e)
        if(Array.prototype.isPrototypeOf(ensemble)) return [...ensemble]
        if(Set.prototype.isPrototypeOf(ensemble)) return ensemble
        return undefined
    }

    // retourne un ensemble à partir d'un chaine
    // chaque caractère devient un élément
    static fromString(chaine) {
        return new Set(Array.from(chaine))
    }
    
}
