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

/*Transforms the array of strings into an array of objects*/
function getCountries(lines: string[]): Country[] {
    let countries: Country[] = [];

    for (let line: number = 1; line < lines.length; line++) {

        let jump: number = lines[line].length;
        let spaces: number = 0;

        let country: string[] = [];

        for (let letter: number = lines[line].length; letter >= 0; letter--) {
            if (lines[line][letter] === " ") {
                country.push(lines[line].substring(jump, letter + 1));
                jump = letter;
                spaces++;
            } else if (letter === 0) {
                country.push(lines[line].substring(jump, letter));
            }
        }

        country = setCountry(country);

        countries.push({
            name: country[0],
            population: Number(country[1]),
            area: Number(country[2]),
            density: getDensity(Number(country[1]), Number(country[2]))
        })
    }

    return countries;
}

/*Set the country with correct values*/
function setCountry(country: string[]): string[] {
    let newCountry: string[] = [];
    let name: string[] = [];

    country.forEach((item: string) => {
        if (!isNaN(Number(item[0]))) {
            newCountry.push(item.split(",").join(""));
        } else {
            name.push(item);
        }
    })

    newCountry.push((name.reverse()).join(" "));
    newCountry = newCountry.reverse();

    if (newCountry.length === 2) {
        newCountry = [...newCountry, "0"];
    } else if (newCountry.length > 3) {
        let sum = 0;

        for (let i = 2; i < newCountry.length; i++) {
            sum += Number(newCountry[i]);
        }
        newCountry[2] = sum.toString();
    }

    return newCountry;
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

    if (population === 0 || area === 0) {
        return 0;
    } else {
        return (population / area);
    }

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
