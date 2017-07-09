//download meta data from the google sheet
//write out to json

console.log("here");

const axios =  require('axios');
const csvToJson = require('csvtojson');
const fs = require('fs');
const moment = require('moment');
const promisify = require('es6-promisify');

const storyRules = {rules:[]};


 axios.all([
        axios.get("https://docs.google.com/spreadsheets/d/12wnap9DY3ETN9JW6fDCYhtsNDBIBNvzqzoq4mpgDvxI/pub?gid=1628985131&single=true&output=csv"),
        axios.get("https://docs.google.com/spreadsheets/d/12wnap9DY3ETN9JW6fDCYhtsNDBIBNvzqzoq4mpgDvxI/pub?gid=0&single=true&output=csv")
     ])
     .then((results)=>{

        csvToJson().fromString(results[0].data)
        .on('json',(json)=>{
            //sconsole.log(json);

            const date = moment(json.Date);
            
  //          console.log(date);
            const rule = {
                "date": date.format("YYYY-MM-DD"),                
                "who": json.Who,
                "theme": json.Theme,
                "words": json.Words,
                "stories": []
            };

            if(json.PublishDate!="" && json.PublishDate!=null)
            {
                const publishDate = moment(json.PublishDate);
                rule.publishDate = publishDate.format("YYYY-MM-DD");
            }
            storyRules.rules[storyRules.rules.length]=rule;
        })
        .on('done',()=>{

            //ugh, nesting of these parsers...
            //must be a way to make them run one after the other...
            //parse the story data
            csvToJson().fromString(results[1].data)
                    .on('json',(json)=>{
                        //sconsole.log(json);

                        const storyDate = moment(json.Date).format("YYYY-MM-DD");
                        const publishString = json.PublishOnWeb;
                        let publish = false;
                        if(publishString==="yes" || publishString==="Yes" || publishString=== "y")
                        {
                            publish = true;
                        }                        
                        const story = {                                      
                            "author": json.Who,
                            "title": json.Title,
                            "publish": publish,
                            "order":0
                        };

                        if(json.Filename!="")
                        {
                            story.filename=json.Filename;
                        }

                        if(json.Order!="")
                        {
                            story.order = parseInt(json.Order);
                        }
//                        console.log(storyDate);
                        
                        
                        let rule = null;
                        for(var index=0;index<storyRules.rules.length;index++)
                        {
                            
                            if(storyDate===storyRules.rules[index].date)
                            {
                                rule = storyRules.rules[index];
                                break;
                            }
                        }                        

                        if(rule==null)
                        {
                            console.log(`No story rule found for story ${json.Title}`);
                        }
                        else
                        {                            
                            rule.stories[rule.stories.length] = story;
                        }                        
                    })
                    .on('done',()=>{

                        for(var i=0;i<1;i++)
                        {
                            
                            const rule = storyRules.rules[i];

                            

                            rule.stories = rule.stories.sort((a,b)=>
                            {
                                console.log(a,b);
                                if(a.order<b.order)
                                {
                                    return -1;
                                }
                                 if (a.order>b.order)
                                {
                                    return 1;
                                }
                                
                                    return 0;
                                
                            });
                        }


                        fs.writeFileSync('./data/rules.json', JSON.stringify(storyRules,null,2), 'utf-8');
                    });
        });

        


     });
