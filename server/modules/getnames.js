
const queries = require("./queries")

//Constructor for name pattern objects, which are a single possible name structure
class namePattern { 
    constructor(pattern, weight){
        //Array of data parameters the pattern needs
        let params = [];
        //Sequence of params and also static text, in order.
        let sequence = pattern.split(" ");
        sequence.forEach((fragment) => {
            if(fragment.startsWith("_")){
                params.push(fragment);
            }
        });
        this.params = params;
        this.sequence = sequence;
        this.weight = weight;
    }
    //Generate name outputs using this pattern
    makeNames(data, quant){
        let names = [];
        for(i=0; i<quant; i++){
            let name_output = this.sequence;
            this.params.forEach((param) => {
                //Get the relevant list of names (pending data structure)
                list = data[param]
                //Get a random item from the list (pending data structure)
                item_index = Math.round(Math.random()*(list.length-1));
                item = list[item_index];
                //Remove the used item from the array. 
                //NOTE: maybe come back here and create a "reuse" condition for some lists
                list.splice(index, 1);
                //Replace param placeholder in name with item name value (pending data structure)
                name_output[indexOf(param)] = item.name;
            });
            names.push(name_output);
        }
        return(names);
    }
}

let name_patterns = {
    knight: [
        new namePattern("_firstname of _lastname", 2),
        new namePattern("Sir _Firstname , _Lastname of _location", 3),
        new namePattern("_Firstname , the _heraldry knight", 1),
        new namePattern("Sir _Firstname _Lastname", 3),
        new namePattern("Sir _Firstname the _adjective", 2),
        new namePattern("_Firstname _Lastname , the knight of _Heraldry", 1)
    ],
    commoner: [
        new namePattern("_Firstname _Lastname", 10),
        new namePattern("Old _Firstname", 1),
        new namePattern("Granny _Lastname", 1),
        new namePattern("Little _Firstname", 1),
        new namePattern("Young _Firstname", 1),
    ],
    monarch: []
}

exports.query = function (role, setting, number) {
    let pattern_system = getPatternSystem(role, number);
    let types = getTypes(pattern_system);
    
    queries.findNames(types, role, setting);
}

function getTypes(pattern_system){
    let types = [];

    pattern_system.patterns.forEach((pattern, index) => {
        if(pattern_system.quant[index]){
            pattern.params.forEach(param => {
                if(!types.includes(param)){
                    types.push(param);
                }
            });
        }

    });
    return(types);
}

function getPatternSystem(role, number){
    let patterns = name_patterns[role];
    let unfilled = number;
    let pattern_system = {
        patterns: patterns,
        quant: []
    };
    
    total_weight = patterns.reduce((x, y) => {
        return x + y.weight;
    }, 0);

    if(total_weight <= number){
        //Fill the slots with name patterns by literally just dumping in a number equal to the weight until no more fit
        let times = Math.floor(number/total_weight);
        pattern_system.quant = patterns.map((pattern) => {
            return pattern.weight*times;
        });
        unfilled -= total_weight*times;
    } else {
        pattern_system.quant = Array(patterns.length).fill(0);
    }

    if(unfilled){
        //Fill the remaining slots with randomly selected patterns
        let rollable_table = patterns.reduce((passthrough, pattern) => {
            return passthrough.concat(
                Array(pattern.weight)
                .fill(pattern)
                );
        }, new Array);
        for(i=0; i<unfilled; i++){
            //Add one to the count of a randomly chosen pattern
            pattern_system.quant[
                patterns
                .indexOf(
                    rollable_table[
                        Math.round(Math.random()*(rollable_table.length-1))
                    ])
                ] += 1;
        }

    }
    
    return(pattern_system);
}
