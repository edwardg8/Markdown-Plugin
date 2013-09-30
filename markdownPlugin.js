/**
 * An Orion plugin that extends the editor in 4 ways for the benefit of Markdown editing.
 * The first part is associating the Markdown file extension which includes an icon.
 * The second is a command extension that converts the selection to and from a Markdown List.
 * The third is a content assist extension that provides either an example document or a link as the two completion paths.
 * The forth is a highlighter extension that provides some very simple syntax highlighting for Markdown text.
 */

// The following comment tells JSLint which variables are globals thus removing the errors.
/*global orion window */

window.onload = function() {

    // create the Markdown List plugin headers
    var headers = {
        name: "Markdown Extensions",
        version: "1.0",
        description: "This plugin provides editor extensions for Markdown lists, content assist and syntax highlighting."
    };

    // Create the provider based on the headers
    var provider = new orion.PluginProvider(headers);

    //===================================== PART 1 ============================================================
    /**
     * The first part is associating the Markdown file extension which includes an icon.
     */

    // Register the content type for all known extensions and the id for Markdown.
    provider.registerServiceProvider("orion.file.contenttype", {}, {
        contentTypes: [{
            id: "text/x-markdown",
            name: "Markdown",
            extension: ["md", "markdown", "mdown", "mkd", "mkdn"],
            image: "http://localhost:8080/file/tutorial/OrionTutorial/solutions/exercise-2/lib/MarkdownSolid.png"
        }]
    });


    //===================================== PART 2 ============================================================
    /**
     * The second is a command extension that converts the selection to and from a Markdown List
     */

    /**
     * A helper function that converts lines of markdown text into a list. If the lines are already
     * a list, it will remove the list markup.
     * @param text input markdown text
     * @return text converted to or from a list
     */
    function convertToFromList(text) {
        // convert or uncovert
        var convert = true;

        //figure out which direction we're going
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var position = lines[i].search("^[ \t]*\\* ");
            if (position > -1) {
                convert = false;
            }
        }
        var result = "";

        // now covert
        for (i = 0; i < lines.length; i++) {
            if (lines[i].replace(/\s/g, "") === "") {
                result += lines[i];
            } else {
                if (convert) {
                    result += (lines[i].replace(new RegExp("^[ \t]*"), " * "));
                } else {
                    result += (lines[i].replace(new RegExp("^[ \t]*\\* "), ""));
                }
            }

            if ((i !== (lines.length - 1))) {
                result += '\n';
            }
        }

        return result;
    }

    // Create the editor command service implementation
    var serviceImpl = {
        run: function(selectedText, text, selection) {
            return convertToFromList(selectedText);
        }
    };

    // Create the service properties including a hotkey to convert selection to/from a list    
    var serviceProps = {
        name: "Convert to Markdown List",
        key: ["l", true, true],
        contentType: ["text/x-markdown"]
    };

    // Register the editor command
    provider.registerServiceProvider("orion.edit.command", serviceImpl, serviceProps);
    
	function isNumber(str) {
	    var n = ~~Number(str);
	    return String(n) === str && n >= 0;
	  //return !isNaN(parseInt(n)) && isFinite(n);
	}
	
	var contentAssistImpl = {
		computeProposals: function(buffer, offset, context) {
			var keywords = [ "#","##","###","####","#####","######",
				"* ","+ ", "- ",
				"===","---",
				"* * *","- - -",
				"_example_","__example__","___example___",
				"*example*","**example**","***example***",
				"<s>this is strike through text</s>",
				">",">>",">>>",">>>>",">>>>>",
				"<http://someurl>","[text to link](http://example.com/)","[like this](http://someurl \"this title shows up when you hover\")",
				"![alternate text](https://sourceforge.net/images/icon_linux.gif)","![tiny arrow](https://sourceforge.net/images/icon_linux.gif \"tiny arrow\")",
				"[[img src=attached-image.jpg alt=foobar]]","[[embed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]"
				];
				
			/*"break", "case", "catch", "continue", "debugger", "default", "delete", "do", "else",
	                        "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch",
	                        "this", "throw", "try", "typeof", "var", "void", "while", "with" ];*/
	        var descs=["First level heading","Second level heading","Third level heading","Fourth level heading","Fifth level heading","Sith level heading",
	        	"List","List","List",
	        	"Huge header","Below a title-smaller header; Below a blank-horizontal line",
	        	"Horizontal Line","Horizontal Line",
	        	"Italic for the text \"example\"","Bold for the text \"example\"","Italic and bold for the text \"example\"",
	        	"Italic for the text \"example\"","Bold for the text \"example\"","Italic and bold for the text \"example\"",
	        	"Strike through text",
	        	"Indentation: One tab","Indentation: Two tabs","Indentation: Three tabs","Indentation: Four tabs","Indentation: Five tabs",
	        	"Explicit Link", "Link", "Link: show link when hover",
	        	"Show an image","Show an image with a title",
	        	"Reference an attached image","Embed a YouTube video"
	        	];
			var proposals = [];
			
			for (var i=0; i < keywords.length; i++) {
				var keyword = keywords[i];
				if (isNumber(context.line)){ //||context.line==="*"|| context.line==="-"
					proposals.push({
						proposal: ". ",
					description: "i. : it formats line to numbered list"
					});
					break;
				}
				else if (keyword.indexOf(context.line) === 0 && keyword !== context.line) {
					proposals.push({
						proposal: keyword.substring(context.line.length),
					description: keyword+" : "+descs[i]
					});
				}
			}
			return proposals;
		}
    };
    

    provider.registerServiceProvider("orion.edit.contentAssist", contentAssistImpl, {
        name: "Markdown content assist",
        contentType: ["text/x-markdown"]
    });


    //===================================== PART 4 ============================================================
    /**
     * The forth part is a highlighter extension that provides some very simple syntax highlighting for Markdown text.
     */

    // Create the syntax highlighting service.
    var markdownGrammar = {
        patterns: [
        // markdown grammar
        // headers
        {
            "match": "^#.*$",
                "name": "entity.name.tag.doctype.html"
        },
        // links
        {
            "match": "(^\\[.*\\]: ?[\\w:/.\\?\\&=_-]+( \".*\")?$)|(\\[.*\\](\\(.*\\))?)",
                "name": "token_keyword"
        },
        // lists
        {
            "begin": "^( )*([\\*\\+\\-]|(\\d.)) ",
                "end": "^$",
                "beginCaptures": {
                "0": {
                    "name": "punctuation.definition.comment.html"
                }
            },
                "endCaptures": {
                "0": {
                    "name": "punctuation.definition.comment.html"
                }
            },
                "contentName": "comment.block.html",
                "patterns": [{
                "match": "\\[.*\\]",
                    "name": "token_keyword"
            }]
        }]
    };

    // Register the highlighter service. Highlighter services can be a grammar or the more complex highlighter.
    provider.registerServiceProvider("orion.edit.highlighter", {}, {
        type: "grammar",
        contentType: ["text/x-markdown"],
        grammar: markdownGrammar
    });

    // Finally, connect the provider
    provider.connect();
};