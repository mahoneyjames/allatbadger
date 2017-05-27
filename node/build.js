const fs = require('fs');
const path = require('path');
const pug = require('pug');
       
const stories = require('./data/rules.json');
const helpers = require('./helpers');
     
           
console.log(helpers.siteName);

       
for(var i = 0; i<stories.rules.length;i++)
{
    const rule = stories.rules[i];
    const themeHtml = pug.renderFile(`${__dirname}/views/theme.pug`,{rule:rule, helpers });

    //console.log(themeHtml);
    if(rule.publishDate && rule.publishDate!="")
    {
        rule.path = `/themes/${rule.publishDate}.htm`;
    }
    else 
    {
        rule.path = `/unpublished/${rule.date}.htm`;
    }
    
    fs.writeFileSync(`./_generated${rule.path}`, themeHtml, 'utf-8');

    for(var j=0; j<rule.stories.length; j++)
    {
        const story = rule.stories[j];
        if(story.filename==undefined || story.filename==null || story.filename=="")
        {
            story.filename = story.title;
            
        }
       //console.log(story);
        const storyHtml = pug.renderFile(`${__dirname}/views/story.pug`,{story, helpers});
        fs.writeFileSync(`./_generated/stories/${story.filename}.htm`, storyHtml, 'utf-8');

    }
   
}

const indexHtml = pug.renderFile(`${__dirname}/views/index.pug`,{rules:stories.rules, helpers });
//console.log(indexHtml);


fs.writeFileSync('./_generated/index.htm', indexHtml, 'utf-8');
   

