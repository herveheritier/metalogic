/*********************************************
 * 
 *    Test object offering test facilities
 * 
 *********************************************/

const Test = {

    level : 1,
    count : 0,
    failed : 0,
    repeat : 1000,
    mute : false,
    testComponent : [],
    testTimer: null,

    // reroutage des fonctions log, group et groupEnd de l'objet console

    done : (function(){
        var devToolsLog = console.log;
        console.log = function (message) {
            var pre = document.createElement('pre')
            pre.appendChild(document.createTextNode(message))
            document.querySelector("body").appendChild(pre)
            pre.style.display = 'none'
            pre.style.display = ''
            if(!Test.mute) devToolsLog.apply(console, arguments)
        };
        var devToolsGroup = console.group
        console.group = function (message) {
            var h = document.createElement('h'+Test.level)
            h.appendChild(document.createTextNode(message))
            document.querySelector("body").appendChild(h)
            if(!Test.mute) devToolsGroup.apply(console, arguments)
            Test.level++
        }
        var devToolsEnd = console.groupEnd
        console.groupEnd = function () {
            Test.level--
            if(!Test.mute) devToolsEnd.apply(console, arguments)
        }
    })(),

    // desactivation / activation de la log de la console du devTools
    // si inactive, le reroutage est exclusif
    // si active, les messages console sont à la fois rerouté et émis dans la console
    devToolsMute : () => Test.mute = true,
    devToolsLoud : () => Test.mute = false,
    setRepeat : (repeat) => Test.repeat = repeat,

    /****************************************************************
    * fonction de pilotage des tests
    * ev : string du code a évaluer
    * attempt : valeur résultat attendue 
    * validFunc (optionnelle) : fonction de validation
    * la fonction de validation est réalisée ssi attempt est à null
    *
    * si le test est ok, l'évaluation est rejouée 1000 fois 
    * pour mesurer les performances
    ******************************************************************/ 
    run : (ev,attempt,validFunc=null) => {
        Test.count++
        console.group(ev)
        //var res = eval(ev)
        var res = ev()
        //console.log(res)
        var ok = false
        if(validFunc!=null) {
            var vf = validFunc(res)
            if(Set.prototype.isPrototypeOf(res)) console.log([...res])
            else if(Array.prototype.isPrototypeOf(res)) console.log(res)
            else console.log(JSON.stringify(res,null,0))
            if(!vf) Test.failed++ 
            else ok = true
        }
        else if(Array.prototype.isPrototypeOf(attempt) || Set.prototype.isPrototypeOf(attempt)) {
            if(Set.prototype.isPrototypeOf(res)) {
                console.log(Object.prototype.isPrototypeOf(res[0]) ? JSON.stringify(res,null,0) : [...res])
            }
            else if(Array.prototype.isPrototypeOf(res)) {
                console.log(Object.prototype.isPrototypeOf(res[0]) ? JSON.stringify(res,null,0) : res)
            }
            else {
                console.log(Object.prototype.isPrototypeOf(res) ? JSON.stringify(res,null,0) : res)
            }
            if(!Sets.areEqual(res,new Set(attempt))) Test.failed++
            else ok = true
        }
        else if(res!=attempt) console.log(res), Test.failed++
        else console.log(Object.prototype.isPrototypeOf(res) ? JSON.stringify(res,null,0) : res), ok = true

        if(ok) {
            console.log("Test passed... ")
            var t0 = performance.now()
            for(var i =0;i<Test.repeat;i++) ev() //eval(ev)
            var t1 = performance.now()
            console.log((t1-t0).toFixed(2)+"ms elapsed for "+Test.repeat+" executions")
        }
        else console.log("Test failed... ")
        
        console.groupEnd()

    },

    // compte-rendu de test

    results : () => {
        console.group('****** Tests Report *******')
        console.log("tests executed : "+Test.count)
        console.log("tests passed   : "+(Test.count-Test.failed))
        console.log("tests failed   : "+Test.failed)
        console.groupEnd()
    }

}