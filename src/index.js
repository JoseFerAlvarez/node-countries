var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require("fs");
var data = fs.readFileSync("./countries.txt", {
    encoding: "utf8",
    flag: "r"
});
var lines = data.split("\n");
var countries = getCountries(lines);
countries = orderByDensity(countries);
createCSV(countries);
/*Transforms the array of strings into an array of objects*/
function getCountries(lines) {
    var countries = [];
    for (var line = 1; line < lines.length; line++) {
        var jump = lines[line].length;
        var spaces = 0;
        var country = [];
        for (var letter = lines[line].length; letter >= 0; letter--) {
            if (lines[line][letter] === " ") {
                country.push(lines[line].substring(jump, letter + 1));
                jump = letter;
                spaces++;
            }
            else if (letter === 0) {
                country.push(lines[line].substring(jump, letter));
            }
        }
        country = setCountry(country);
        countries.push({
            name: country[0],
            population: Number(country[1]),
            area: Number(country[2]),
            density: getDensity(Number(country[1]), Number(country[2]))
        });
    }
    return countries;
}
/*Set the country with correct values*/
function setCountry(country) {
    var newCountry = [];
    var name = [];
    country.forEach(function (item) {
        if (!isNaN(Number(item[0]))) {
            newCountry.push(item.split(",").join(""));
        }
        else {
            name.push(item);
        }
    });
    newCountry.push((name.reverse()).join(" "));
    newCountry = newCountry.reverse();
    if (newCountry.length === 2) {
        newCountry = __spreadArray(__spreadArray([], newCountry, true), ["0"], false);
    }
    else if (newCountry.length > 3) {
        var sum = 0;
        for (var i = 2; i < newCountry.length; i++) {
            sum += Number(newCountry[i]);
        }
        newCountry[2] = sum.toString();
    }
    return newCountry;
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
    if (population === 0 || area === 0) {
        return 0;
    }
    else {
        return (population / area);
    }
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
