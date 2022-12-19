var fs = require("fs");
var data = fs.readFileSync("./countries.txt", {
    encoding: "utf8",
    flag: "r"
});
var lines = data.split("\n");
var countries = getCountries(lines);
countries = orderByDensity(countries);
createCSV(countries);
function getCountries(lines) {
    var countries = [];
    for (var line = 1; line < lines.length; line++) {
        var jump = lines[line].length;
        var spaces = 0;
        var country = [];
        for (var letter = lines[line].length; letter >= 0; letter--) {
            if (lines[line][letter] === " " && spaces < 2) {
                country.push(lines[line].substring(jump, letter + 1));
                jump = letter;
                spaces++;
            }
            else if (letter === 0) {
                country.push(lines[line].substring(jump, letter));
            }
        }
        if (country.length === 3) {
            countries.push({
                name: country[2],
                population: getPopulation(country[1]),
                area: getArea(country[0]),
                density: getDensity(getPopulation(country[1]), getArea(country[0]))
            });
        }
        else {
            console.log("The country is invalid");
        }
    }
    return countries;
}
/* Get the full area of the country */
function getArea(numbers) {
    var numbs = numbers.split(",");
    return Number(numbs.join(""));
}
/* Get the full population of the country */
function getPopulation(numbers) {
    var numbs = numbers.split(",");
    return Number(numbs.join(""));
}
/* Get the density of the country */
function getDensity(population, area) {
    return (population / area);
}
/* Sort countries by density in descending order */
function orderByDensity(countries) {
    return countries.sort(function (a, b) {
        return b.density - a.density;
    });
}
/* Create a CSV file with all countries */
function createCSV(countries) {
    fs.writeFileSync("./countries.csv", "Name, Population, Area, Density\n");
    countries.forEach(function (country) {
        var countrie = "".concat(country.name, ", ").concat(country.population, ", ").concat(country.area, ", ").concat(country.density, "\n");
        fs.appendFileSync("./countries.csv", countrie);
    });
}
