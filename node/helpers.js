const fs = require('fs');

exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.siteName='Story Marmalade'; 

exports.storyBody  = (story, rule) =>
{
        
    const filename = `${__dirname}/data/stories/${story.title}.htm`;
    try
    {
        return fs.readFileSync(filename)
    }
    catch(err)
    {
        return `Failed to find file '${filename}'`;
    }

    //return "haro!";
} 