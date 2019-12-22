var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);
let deck = [];

let deckSize = 10007;

for (let i = 0; i < deckSize; i++) { deck.push(i); }

function shuffle() {
    for (let i = 0; i < input.length; i++) {
        let temp = [];
        
        if (input[i].startsWith("deal with increment")) {
            let increment = Number(input[i].substring(20));
            let pos = 0;

            for (let j = 0; j < deckSize; j++) {
                temp[pos] = deck[j];

                pos += increment;
                if (pos >= deckSize) pos -= deckSize;
            }
        } else if (input[i].startsWith("deal into new stack")) {
            temp = deck.reverse();
        } else if (input[i].startsWith("cut")) {
            let cut = Number(input[i].substring(4));

            if (cut > 0)
                temp = [...deck.slice(cut, deck.length), ...deck.slice(0, cut)];
            
            if (cut < 0)
                temp = [...deck.slice(deck.length + cut, deck.length), ...deck.slice(0, deck.length + cut)];
        }

        deck = temp;
    }

    console.log(deckSize - i);
}

function part1() {
    shuffle();
    for (let i = 0; i < deckSize; i++) {
        if (deck[i] == 2019) console.log(i);
    }
}