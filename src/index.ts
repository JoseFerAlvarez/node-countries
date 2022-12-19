const fs = require("fs");

interface Country {
    name: string,
    population: number,
    area: number,
    density: number
}

const data: string = fs.readFileSync("./countries.txt", {
    encoding: "utf8",
    flag: "r"
});

const lines: string[] = data.split("\n");

let countries: Country[] = getCountries(lines);
countries = orderByDensity(countries);

createCSV(countries);


function getCountries(lines: string[]): Country[] {
    let countries: Country[] = [];

    for (let line: number = 1; line < lines.length; line++) {

        let jump: number = lines[line].length;
        let spaces: number = 0;

        let country: string[] = [];

        for (let letter = lines[line].length; letter >= 0; letter--) {
            if (lines[line][letter] === " " && spaces < 2) {
                country.push(lines[line].substring(jump, letter + 1));
                jump = letter;
                spaces++;
            } else if (letter === 0) {
                country.push(lines[line].substring(jump, letter));
            }
        }

        if (country.length === 3) {
            countries.push({
                name: country[2],
                population: getPopulation(country[1]),
                area: getArea(country[0]),
                density: getDensity(getPopulation(country[1]), getArea(country[0]))
            })
        } else {
            console.log("The country is invalid");
        }
    }

    return countries;
}

/* Get the full area of the country */
function getArea(numbers: string): number {
    let numbs: string[] = numbers.split(",")
    return Number(numbs.join(""));
}

/* Get the full population of the country */
function getPopulation(numbers: string): number {
    let numbs: string[] = numbers.split(",")
    return Number(numbs.join(""));
}

/* Get the density of the country */
function getDensity(population: number, area: number): number {
    return (population / area);
}

/* Sort countries by density in descending order */
function orderByDensity(countries: any[]) {
    return countries.sort((a, b) => {
        return b.density - a.density;
    })
}

/* Create a CSV file with all countries */
function createCSV(countries: any[]) {
    fs.writeFileSync("./countries.csv", `Name, Population, Area, Density\n`);
    countries.forEach((country) => {
        let countrie = `${country.name}, ${country.population}, ${country.area}, ${country.density}\n`
        fs.appendFileSync("./countries.csv", countrie);
    });
}
