const fs = require('fs');
const path = require('path');
const pug = require('pug');
           
const stories = require('./data/rules.json');
const helpers = require('./helpers');
           
const authorStories = [];

           
console.log(helpers.siteName);


const activeThemes = [];

for(var i = 0; i<stories.rules.length;i++)
{
    const rule = stories.rules[i];
    

    //console.log(themeHtml);
    if(rule.publishDate && rule.publishDate!="")
    {
        rule.path = `/themes/${rule.publishDate}`;
        activeThemes[activeThemes.length] = rule;
    }
    else 
    {
        rule.path = `/unpublished/${rule.date}`;
    }
    

    //All the stories come down in a single json Array
    //We need to save them to the author specific weekly folder
    //and set up an array of stories per author to include on their index page
    for(var j=0; j<rule.stories.length; j++)
    {
        const story = rule.stories[j];

        if((story.title===undefined || story.title===null || story.title==="")
          && (story.filename===undefined || story.filename===null || story.filename===""))
          {
            console.log(`Story at index '${j}' for theme at index '${i}' has no title or filename`);
            rule.stories[j] = null;
            continue;
          }

        if(story.filename==undefined || story.filename==null || story.filename=="")
        {
            story.filename = story.title;
            
        } 
        
        
        story.filename = sanitisePath(story.filename);
        generateHtml("story",`/${story.author}/weekly/${story.filename}`,{story, title:story.title})
        
        if(authorStories[story.author]==undefined)
        { 
             authorStories[story.author] = new Array();
        }
 
        authorStories[story.author][authorStories[story.author].length] = story;
    }

    rule.stories = rule.stories.filter((item)=>item!=null);
    generateHtml("theme",`${rule.path}`,{rule:rule, title: helpers.friendlyDateShort(rule.publishDate) } );
    
}    

for(var authorName in authorStories)
{  
       
    console.log(authorName);
    generateHtml("author", `/${authorName}/index`, {
        authorName,
        stories: authorStories[authorName]
    });
}

generateHtml("index", "index", {rules:activeThemes});
generateHtml("about","about",{title:"About"});

//custom stories
//To add a story:
//   Add an entry to this array
//   Add the source html for the story into ~/data/stories using a path that matches the filename 
//      e.g. for "/james/nycflash2017_1.htm" the view will look in ~/data/stories//james/nycflash2017_1.htm
const customStories = [{
          "author": "James",
          "title": "NYC Midnight Flash Fiction 2017 Challenge 1",
          "publish": false,
          "order": 0, 
          "filename": "/james/nycflash2017_1.htm"
        },];

for(var i = 0; i<customStories.length;i++)
{
    const story = customStories[i];
    generateHtml("story",`${story.filename}`,{story, title:story.title})
}
   
function generateHtml(view, outputFile, options)
{
    const extension = outputFile.substring(outputFile.length-4) ===".htm" ? "" : ".htm";

    options.helpers = helpers; 
    options.siteRoot = "";   
    const html = pug.renderFile(`${__dirname}/views/${view}.pug`,options);
    fs.writeFileSync(`./_generated/${outputFile}${extension}`, html, 'utf-8');
}

function sanitisePath(path)
{
    return path.split(" ").join("-") + ".htm";
}