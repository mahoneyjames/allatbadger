
console.log(rules.data);
console.log(stories.data);      
axios.get("https://docs.google.com/spreadsheets/d/12wnap9DY3ETN9JW6fDCYhtsNDBIBNvzqzoq4mpgDvxI/pub?gid=1628985131&single=true&output=csv")
    .then((res)=>{
        console.log(res.data);

        csvToJson().fromString(res.data)
        // .on('csv', (csvRow)=>{
        //     console.log(csvRow);
        // })
        .on('json',(json)=>{
            //sconsole.log(json);

            const date = moment(json.Date);
            console.log(date);
            const rule = {
                "date": moment(new Date(date.year(), date.month(), date.day())).format("YYYY-MM-DD"),
                "bah": json.Date,
                "who": json.Who,
                "theme": json.Theme,
                "words": json.Words
            };
            storyRules.rules[storyRules.rules.length]=rule;
        })
        .on('done', writeRuleJson);
    });

    console.log("here");

function writeRuleJson()
{


    fs.writeFileSync('./data/rules.json', JSON.stringify(storyRules,null,2), 'utf-8');
}