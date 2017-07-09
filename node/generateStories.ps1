# Grab the rules.json out of c:\dev\git\allatbadger\node\data\rules.json
# 
#iterate jenny and james folders
# - grab the file name. remove the extension
# - pandoc it into file.htm (convert spaces into hyphens)
# - look for it using these rules
#  		match on author and filename = original filename
#		match on author and title = original filename
#		match on author and title = title pulled out of htm file (need to strip off markup first)

#TODO - take the "publish?" column into account

#download rules.csv and stories.csv
#.\meta.ps1

$stories = (gc c:\dev\git\allatbadger\node\data\rules.json | convertfrom-json).rules.stories

$stories | foreach-object{
	$_.author = $_.author.toLower()
	if($_.filename)
	{
		$_.filename = $_.filename.toLower()
	}
}

function replaceSmartQuotes($in)
{
if ($in.IndexOf($([char]0x2013)) -gt -1) { $in = $in.Replace($([char]0x2013), '-');    }
#if ($in.IndexOf('\u2014') -gt -1) { $in = buffer.Replace('\u2014', '-');    }
#if ($in.IndexOf('\u2015') -gt -1) { $in = buffer.Replace('\u2015', '-');    }
#if ($in.IndexOf('\u2017') -gt -1) { $in = buffer.Replace('\u2017', '_');    }
if ($in.IndexOf($([char]0x2018)) -gt -1) { $in = $in.Replace($([char]0x2018), "'");   }
if ($in.IndexOf($([char]0x2019)) -gt -1) { $in = $in.Replace($([char]0x2019), "'");   }
#if ($in.IndexOf('\u201a') -gt -1) { $in = buffer.Replace('\u201a', ',');    }
if ($in.IndexOf($([char]0x201b)) -gt -1) { $in = $in.Replace($([char]0x201b), "'");   }
if ($in.IndexOf('\u201c') -gt -1) { $in = buffer.Replace('\u201c', '\"');   }
if ($in.IndexOf('\u201d') -gt -1) { $in = buffer.Replace('\u201d', '\"');   }
#if ($in.IndexOf('\u201e') -gt -1) { $in = buffer.Replace('\u201e', '\"');   }
#if ($in.IndexOf('\u2026') -gt -1) { $in = buffer.Replace("\u2026", "...");  }
if ($in.IndexOf($([char]0x2032)) -gt -1) { $in = $in.Replace($([char]0x2032), "'");   }
#if ($in.IndexOf('\u2033') -gt -1) { $in = buffer.Replace('\u2033', '\"');   }

$in
}

function processFolder($path, $author, $outputPath)
{
	ls $path -filter "*.docx" | foreach-object{
	
		
		#convert to html
		pandoc $_.FullName -o "story.htm"
		$markdown = gc "story.htm" -encoding utf8
		
		#ugh, stupid word smart quotes
		$markdown = $markdown | foreach-object { replaceSmartQuotes $_}
		
		
		
		$titleFromFile = ""
		$sourceFilename = $_.Name.Replace(".docx","").ToLower()

		#pick up the title from the first line in the markdown file
		if($markdown[0].Contains("strong"))
		{
			$titleFromFile = $markdown[0]
			$titleFromFile = $titleFromFile.Replace("</p>","").Replace("<p>","").Replace("<strong>","").Replace("</strong>","")
			#strip off the title - we set this in front matter for displaying on the site
			$markdown[0] = ""
		}
		ElseIf($markdown[0].Contains("h1"))
		{		
			#<h1 id="ferocious-phillip">Ferocious Phillip</h1>
			$titleFromFile = $markdown[0]			
			$titleFromFile = $titleFromFile.Substring($titleFromFile.IndexOf(">")+1, $titleFromFile.IndexOf("</")-$titleFromFile.IndexOf(">")-1)		
			#strip off the title - we set this in front matter for displaying on the site
			$markdown[0] = ""
		}
		if($sourceFilename -eq "boots")
		{
		#$markdown
		}
		
		
		$entry = $NULL
		#$sourceFilename
		$entry = $stories | where {$_.author -eq $author -and $_.filename -eq $sourceFilename}		
		if($entry.length -eq 0)
		{
			$entry = $stories | where {$_.author -eq $author -and $_.title.ToLower() -eq $sourceFilename}
		}
		
		if($entry.length -eq 0 -and $titleFromFile -ne "")
		{			
			$entry = $stories | where {$_.author -eq $author -and $_.title.ToLower() -eq $titleFromFile.ToLower()}
			
		}
				
		if($entry.length -eq 0)
		{ 
			"'$($titleFromFile)' - '$($sourceFilename).docx' not found in stories.csv"
		}		
		else
		{



			$outputFileName = $outputPath
			#$entry
			$titleForFilename = $entry.filename
			
			if($titleForFilename -eq $NULL)
			{
				if($entry.title -eq "")
				{
						"'$($titleFromFile)' - '$($sourceFilename).docx' had a blank title in stories.csv"
				}
				$titleForFilename = $entry.title
			}
			
			$titleForFilename = $titleForFilename.Replace("?","")
			$titleForFilename = $titleForFilename.Replace(" ","-")
			
			$outputFileName += "$titleForFilename.htm"
			
			
			#$outputfilename
			[System.IO.File]::WriteAllLines($outputFileName, $markdown);
		}
		
	}

}


processFolder "c:\dropbox\_writing\completed\500 word challenge" "james" "c:\temp\stories\html\" #"C:\dev\git\allatbadger\docs\_posts"

processFolder "c:\temp\stories\jenny" "jenny" "c:\temp\stories\html\" #"C:\dev\git\allatbadger\docs\_posts"
