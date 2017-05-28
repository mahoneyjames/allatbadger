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
        rule.path = `/themes/${rule.publishDate}.htm`;
        activeThemes[activeThemes.length] = rule;
    }
    else 
    {
        rule.path = `/unpublished/${rule.date}.htm`;
    }
    
    for(var j=0; j<rule.stories.length; j++)
    {
        const story = rule.stories[j];
        if(story.filename==undefined || story.filename==null || story.filename=="")
        {
            story.filename = story.title;
            
        } 
        
        story.filename = sanitisePath(story.filename);
       //console.log(story);
        const storyHtml = pug.renderFile(`${__dirname}/views/story.pug`,{story, helpers, title:story.title});
        fs.writeFileSync(`./_generated/stories/${story.filename}.htm`, storyHtml, 'utf-8');
   
        if(authorStories[story.author]==undefined)
        { 
             authorStories[story.author] = new Array();
        }
 
        authorStories[story.author][authorStories[story.author].length] = story;
    }

    const themeHtml = pug.renderFile(`${__dirname}/views/theme.pug`,{rule:rule, helpers, title: helpers.friendlyDateShort(rule.publishDate) });
    fs.writeFileSync(`./_generated${rule.path}`, themeHtml, 'utf-8');

    
}    

for(var authorName in authorStories)
{  
       
    console.log(authorName);
    generateHtml("author", `authors/${authorName}`, {
        authorName,
        stories: authorStories[authorName]
    });
}

generateHtml("index", "index", {rules:activeThemes});
generateHtml("about","about",{title:"About"});
   
function generateHtml(view, outputFile, options)
{
    options.helpers = helpers;    
    const html = pug.renderFile(`${__dirname}/views/${view}.pug`,options);
    fs.writeFileSync(`./_generated/${outputFile}.htm`, html, 'utf-8');
}

function sanitisePath(path)
{
    return path.split(" ").join("-") + ".htm";
}