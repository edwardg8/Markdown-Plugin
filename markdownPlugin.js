/*******************************************************************************
 * @license
 * Copyright (c) 2011, 2013 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/

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

    // Register the content type for all known extensions and the id for Markdown.
    provider.registerServiceProvider("orion.file.contenttype", {}, {
        contentTypes: [{
            id: "text/x-markdown",
            name: "Markdown",
            extension: ["md", "markdown", "mdown", "mkd", "mkdn"]
        }]
    });

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
        name: "MDList",
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
			var keys=[
				new RegExp("^[^_]*_$"),new RegExp("^[^_]*_$"),new RegExp("^[^_]*_$"),
				new RegExp("^[^_]*__$"),new RegExp("^[^_]*__$"),new RegExp("^[^_]*___$"),
				new RegExp("^[^_]*_[^_]+$"),new RegExp("^[^_]*__[^_]+$"),new RegExp("^[^_]*__[^_]+_$"),new RegExp("^[^_]*___[^_]+$"),new RegExp("^[^_]*___[^_]+_$"),
				new RegExp("^[^_]*___[^_]+__$"),
				new RegExp("^[^*]*[*]$"),new RegExp("^[^*]*[*]$"),new RegExp("^[^*]*[*]$"),
				new RegExp("^[^*]*[*]{2}$"),new RegExp("^[^*]*[*]{2}$"),new RegExp("^[^*]*[*]{3}$"),
				new RegExp("^[^*]*[*][^*]+$"),new RegExp("^[^*]*[*]{2}[^*]+$"),new RegExp("^[^*]*[*]{2}[^*]+[*]$"),new RegExp("^[^*]*[*]{3}.*[^*]$"),
				new RegExp("^[*]{3}.*[^*][*]$"),new RegExp("^[*]{3}.*[^*][*]{2}$"),
				new RegExp("^.*<s>.+<[/]s$"),new RegExp("^.*<s>.+<[/]$"),new RegExp("^.*<s>.+<$"),new RegExp("^.*<s>((?!</s>).)*$"),new RegExp("^.*<s$"),new RegExp("^.*<$"),
				new RegExp("^.*<http:[/][/][^>]*$"),new RegExp("^.*<http:[/]$"),new RegExp("^.*<http:$"),new RegExp("^.*<http$"),new RegExp("^.*<htt$"),
				new RegExp("^.*<ht$"),new RegExp("^.*<h$"),new RegExp("^.*<$"),
				//[[img
				new RegExp("^[^[]*[[][[]img +src=.+ alt=[A-Za-z0-9!@#$%^&*()+<>//.?=_ -]+\]$"),new RegExp("^[^[]*[[][[]img +src=.+ alt=[A-Za-z0-9!@#$%^&*()+<>//.?=_ -]*$"),
				new RegExp("^[^[]*[[][[]img +src=.+ alt$"),new RegExp("^[^[]*[[][[]img +src=.+ al$"),new RegExp("^[^[]*[[][[]img +src=.+ a$"),
				new RegExp("^[^[]*[[][[]img +src=((?! alt).)*$"),new RegExp("^[^[]*[[][[]img +src$"),
				new RegExp("^[^[]*[[][[]img +sr$"),new RegExp("^[^[]*[[][[]img +s$"),new RegExp("^[^[]*[[][[]img *$"),new RegExp("^[^[]*[[][[]im$"),new RegExp("^[^[]*[[][[]i$"),
				new RegExp("^[^[]*[[][[]$"),new RegExp("^[^[]*[[]$"),
				//[[embed
				new RegExp("^[^[]*[[][[]embed +url=http://[A-Za-z0-9!@#$%^&*()+<>//.?=_ -]+\]$"),new RegExp("^[^[]*[[][[]embed +url=http://[A-Za-z0-9!@#$%^&*()+<>//.?=_ -]*$"),
				new RegExp("^[^[]*[[][[]embed +url=http:/$"),new RegExp("^[^[]*[[][[]embed +url=http:$"),new RegExp("^[^[]*[[][[]embed +url=http$"),
				new RegExp("^[^[]*[[][[]embed +url=htt$"),new RegExp("^[^[]*[[][[]embed +url=ht$"),new RegExp("^[^[]*[[][[]embed +url=h$"),new RegExp("^[^[]*[[][[]embed +url=$"),
				new RegExp("^[^[]*[[][[]embed +url$"),new RegExp("^[^[]*[[][[]embed +ur$"),new RegExp("^[^[]*[[][[]embed +u$"),new RegExp("^[^[]*[[][[]embed *$"),
				new RegExp("^[^[]*[[][[]embe$"),new RegExp("^[^[]*[[][[]emb$"),new RegExp("^[^[]*[[][[]em$"),new RegExp("^[^[]*[[][[]e$"),new RegExp("^[^[]*[[][[]$"),new RegExp("^[^[]*[[]$"),
				new RegExp("^[^[]*[[].+\][(]https?:[/][/].*\".*\"$"),new RegExp("^[^[]*[[].+\][(]https?:[/][/][^\"]*\"[^\")]*$"),
				new RegExp("^[^[]*[[].+\][(]https?:[/][/][^\")]*$"),new RegExp("^[^[]*[[].+\][(]https?:[/]$"),new RegExp("^[^[]*[[].+\][(]https?:$"),
				new RegExp("^[^[]*[[].+\][(]https?$"),new RegExp("^[^[]*[[].+\][(]htt$"),new RegExp("^[^[]*[[].+\][(]ht$"),new RegExp("^[^[]*[[].+\][(]h$"),
				new RegExp("^[^[]*[[].+\][(]$"),new RegExp("^[^[]*[[][A-Za-z0-9!@#$%^&*()+<>//.?=_ -]+\]$"),new RegExp("^[^[]*[[][A-Za-z0-9!@#$%^&*()+<>//.?=_ -]*$"),
				new RegExp("^.*[!]$")
			];
			
			var keyActions=[
				"example_","_example__","__example___",
				"example__","_example___","example___",
				"_","__","_","___","__","_",
				"example*","*example**","**example***",
				"example**","*example***","example***",
				"*","**","*","***","**","*",
				">","s>","/s>","</s>",">strike through text</s>","s>strike through text</s>",
				">","/someurl>","//someurl>","://someurl>","p://someurl>","tp://someurl>","ttp://someurl>","http://someurl>",
				"]","]]","=text]]","t=text]]","lt=text]]"," alt=text]]","=attached-image alt=text]]","c=attached-image alt=text]]",
				"rc=attached-image alt=text]]"," src=attached-image alt=text]]","g src=attached-image alt=text]]",
				"mg src=attached-image alt=text]]","img src=attached-image alt=text]]","[img src=attached-image alt=text]]",
				"]","]]","/www.youtube.com/watch?v=6YbBmqUnoQM]]","//www.youtube.com/watch?v=6YbBmqUnoQM]]","://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"p://www.youtube.com/watch?v=6YbBmqUnoQM]]","tp://www.youtube.com/watch?v=6YbBmqUnoQM]]","ttp://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"http://www.youtube.com/watch?v=6YbBmqUnoQM]]","=http://www.youtube.com/watch?v=6YbBmqUnoQM]]","l=http://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"rl=http://www.youtube.com/watch?v=6YbBmqUnoQM]]"," url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]","d url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"ed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]","bed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]","mbed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"embed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]","[embed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				")","\")",
				" \"hover\")","/example.com/ \"hover\")","//example.com/ \"hover\")",
				"://example.com/ \"hover\")","p://example.com/ \"hover\")","tp://example.com/ \"hover\")",
				"ttp://example.com/ \"hover\")","http://example.com/ \"hover\")","(http://example.com/ \"hover\")","](http://example.com/ \"hover\")",
				"[alternate text](https://example.com/ \"hover\")"
			];
			
			var keyDescs=[
				"Italic for the text \"example\"","Bold for the text \"example\"","Italic and bold for the text \"example\"",
				"Bold for the text \"example\"","Italic and bold for the text \"example\"","Italic and bold for the text \"example\"",
				"Italic for the text \"example\"","Bold for the text \"example\"","Italic for the text \"example\"","Italic and bold for the text \"example\"",
				"Bold for the text \"example\"","Italic for the text \"example\"",
				"Italic for the text \"example\"","Bold for the text \"example\"","Italic and bold for the text \"example\"",
				"Bold for the text \"example\"","Italic and bold for the text \"example\"","Italic and bold for the text \"example\"",
				"Italic for the text \"example\"","Bold for the text \"example\"","Italic for the text \"example\"","Italic and bold for the text \"example\"",
				"Bold for the text \"example\"","Italic for the text \"example\"",
				"Strike through text","Strike through text","Strike through text","Strike through text","Strike through text","Strike through text",
				"Explicit Link","Explicit Link","Explicit Link","Explicit Link","Explicit Link","Explicit Link","Explicit Link","Explicit Link",
				"Reference an attached image","Reference an attached image","Reference an attached image","Reference an attached image","Reference an attached image",
				"Reference an attached image","Reference an attached image","Reference an attached image","Reference an attached image","Reference an attached image",
				"Reference an attached image","Reference an attached image","Reference an attached image","Reference an attached image",
				"Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video",
				"Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video",
				"Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video","Embed a YouTube video",
				"Insert link or image","Insert link or image","Insert link or image","Insert link or image","Insert link or image","Insert link or image",
				"Insert link or image","Insert link or image","Insert link or image","Insert link or image","Insert link or image","Insert link or image",
				"Show an image with a title"
			];
			
			
			var keywords = [ "#","##","###","####","#####","######",
				"* ","+ ", "- ",
				"===","---",
				"* * *","- - -",
				"_example_","__example__","___example___",
				"*example*","**example**","***example***",
				"<s>this is strike through text</s>",
				">",">>",">>>",">>>>",">>>>>",
				"<http://someurl>","[text to link](http://example.com/)","[text to link](http://example.com/ \"this title shows up when you hover\")",
				"![alternate text](https://sourceforge.net/images/icon_linux.gif)","![alternate text](https://sourceforge.net/images/icon_linux.gif \"tiny arrow\")",
				"[[img src=attached-image.jpg alt=foobar]]","[[embed url=http://www.youtube.com/watch?v=6YbBmqUnoQM]]",
				"[[include ref=SamplePage]]"
			];
				
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
				"Reference an attached image","Embed a YouTube video",
				"Embed another wiki page"
	        ];
			var proposals = [];
			
			var found=false;
			var skip=200;
			var prefixStart,ind,len,len1,len2,len3,position,position2,position3;
			var i;
			for (i=0; i < keywords.length; i++) {
				var keyword = keywords[i];
				if (isNumber(context.line)){ //||context.line==="*"|| context.line==="-"
					proposals.push({
						proposal: ". ",
						description: "i. : it formats line to numbered list"
					});
					found=true;
					break;
				}
				else if (keyword.indexOf(context.line) === 0 && keyword !== context.line) {
					found=true;
					prefixStart=offset;
					if (i===19){
						ind=3-context.line.length;
						len=27;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len}],
							escapePosition:prefixStart+ind+len
						});
					}
					else if (i===25){
						ind=8-context.line.length;
						len=7;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len}],
							escapePosition:prefixStart+ind+len
						});
					}
					else if (i===26){
						ind=1-context.line.length;
						len1=12;
						position=offset+22-context.line.length;
						len2=12;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1},{offset: position, length: len2}],
							escapePosition:offset+skip
						});
					}
					else if (i===27){
						ind=1-context.line.length;
						len1=12;
						position2=offset+22-context.line.length;
						len2=12;
						position3=offset+36-context.line.length;
						len3=34;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1},{offset: position2, length: len2},
								{offset: position3, length: len3}],
							escapePosition:offset+skip
						});
					}
					else if (i===28){
						ind=2-context.line.length;
						len1=14;
						position2=offset+26-context.line.length;
						len2=37;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1},{offset: position2, length: len2}],
							escapePosition:offset+skip
						});
					}
					else if (i===29){
						ind=2-context.line.length;
						len1=14;
						position2=offset+26-context.line.length;
						len2=37;
						position3=offset+65-context.line.length;
						len3=10;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1},{offset: position2, length: len2},
								{offset: position3, length: len3}],
							escapePosition:offset+skip
						});
					}
					else if (i===30){
						ind=10-context.line.length;
						len1=18;
						position2=offset+33-context.line.length;
						len2=6;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1},{offset: position2, length: len2}],
							escapePosition:offset+skip
						});
					}
					else if (i===31){
						ind=19-context.line.length;
						len1=35;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1}],
							escapePosition:prefixStart+ind+len1
							
						});
					}
					else if (i===32){
						ind=14-context.line.length;
						len1=10;
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i],
							positions: [{offset: prefixStart + ind, length: len1}],
							escapePosition:prefixStart+ind+len1
						});
					}
					else{
						proposals.push({
							proposal: keyword.substring(context.line.length),
							description: keyword+" : "+descs[i]
						});
					}
				}
			}
			
			
			if (!found){
				for (i=0; i<keys.length; i++){
					if (keys[i].test(context.line)){
						var re1,re2,re3,re4,numOfSpace,j;
						if (i>=27 && i<=29){
							re1 = /</;
							re2 =/>/;
							prefixStart=offset;
							ind=2-(context.line.length-1-re1.exec(context.line).index);
							len=19;
							if (context.line.match(re2)!==null){
								len=context.line.length-1-re2.exec(context.line).index;
							}
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: prefixStart + ind, length: len}],
								escapePosition:prefixStart+ind+len
							});
						}
						else if (i>=30 && i<=37){
							re1 = /</;
							re2 =/<http:[/][/]/;
							prefixStart=offset;
							ind=7-(context.line.length-1-re1.exec(context.line).index);
							len=7;
							if (context.line.match(re2)!==null){
								len=context.line.length-1-re2.exec(context.line).index-7;
							}
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: prefixStart + ind, length: len}],
								escapePosition:prefixStart+ind+len
							});
						}
						//[[img src=attached-image alt=text]]
						else if (i>=39 && i<=51){
							re1 = /[[]/;
							re2 =/[[][[]img +src=/;
							re3 =/[[][[]img +$/;
							re4 =/[[][[]img +s/;
							numOfSpace=0;
							prefixStart=offset;
							ind=9-(context.line.length-1-re1.exec(context.line).index);
							len=14;
							len2=4;
							
							if (context.line.match(re3)!==null){
								numOfSpace=context.line.length-context.line.indexOf("img")-3;
							}
							if (context.line.match(re4)!==null){
								for ( j=context.line.indexOf("img")+3;j<context.line.length; j++){
									if (context.line.charAt(j)==='s') {break;}
								}
								numOfSpace=j-context.line.indexOf("img")-4;
							}
							ind+=numOfSpace;
							
							if (context.line.indexOf(" a")!==-1){
								len=context.line.indexOf(" a")-1-re2.exec(context.line).index-9-numOfSpace;
								position2=offset+4-(context.line.length-1-context.line.indexOf(" a"));
								if (context.line.indexOf(" alt=")!==-1){
									len2=context.line.length-1-context.line.indexOf(" a")-4;
								}
								
							}
							else{
								if (context.line.match(re2)!==null){
									len=context.line.length-1-re2.exec(context.line).index-9-numOfSpace;
									position2=offset+5;
								}
								else{
									position2=offset+ind+len+5;
								}
							}
								
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: prefixStart + ind, length: len},{offset: position2, length: len2}],
								escapePosition:offset+skip
							});
						}
						else if (i>=52 && i<=70){
							re1 = /[[]/;
							re2 =/[[][[]embed +url=http:[/][/]/;
							re3 =/[[][[]embed +$/;
							re4 =/[[][[]embed +u/;
							numOfSpace=0;
							prefixStart=offset;
							ind=18-(context.line.length-1-re1.exec(context.line).index);
							len=35;
							
							if (context.line.match(re3)!==null){
								numOfSpace=context.line.length-context.line.indexOf("embed")-5;
							}
							if (context.line.match(re4)!==null){
								for ( j=context.line.indexOf("embed")+5;j<context.line.length; j++){
									if (context.line.charAt(j)==='u') {break;}
								}
								numOfSpace=j-context.line.indexOf("embed")-6;
							}
							ind+=numOfSpace;
							
							if (context.line.match(re2)!==null){
								len=context.line.length-1-re2.exec(context.line).index-18-numOfSpace;
							}
								
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: prefixStart + ind, length: len}],
								escapePosition:prefixStart+ind+len
							});
						}
						
						//[alternate text](http://example.com/ \"hover\")
						else if (i>=72 && i<=82){
							prefixStart=offset;
							ind=-(context.line.length-1-context.line.indexOf("["));
							len=0;
							len2=12;
							len3=5;
							
							if (context.line.indexOf(" \"")!==-1){
								len=context.line.indexOf("]")-context.line.indexOf("[")-1;
								position2=offset-(context.line.length-context.line.indexOf("](http://")-9);
								len2=context.line.indexOf(" \"")-context.line.indexOf("](http://")-9;								
								position3=offset-(context.line.length-2-context.line.indexOf(" \""));
								len3=context.line.length-2-context.line.indexOf(" \"");
								
							}
							else if (context.line.indexOf("]")!==-1){
								len=context.line.indexOf("]")-context.line.indexOf("[")-1;
								if  (context.line.indexOf("](http://")!==-1){
									len2=context.line.length-context.line.indexOf("]")-9;	
									position2=offset-len2;
									position3=offset+2;
								}
								else{
									position2=offset+9-(context.line.length-context.line.indexOf("]"));
									position3=position2+len2+2;
								}
							}
							else{
								len=context.line.length-1-context.line.indexOf("[");
								position2=prefixStart+ind+len+9;
								position3=position2+len2+2;
							}
							
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: prefixStart + ind, length: len},{offset: position2, length: len2},
								{offset: position3, length: len3}],
								escapePosition:offset+skip
							});
						}
						else if (i===83){
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i],
								positions: [{offset: offset+1, length: 14},{offset: offset+25, length: 12},
									{offset:  offset+39, length: 5}],
								escapePosition:offset+skip
							});
						}
						else{
							proposals.push({
								proposal: keyActions[i],
								description: keyActions[i]+" : "+keyDescs[i]
							});
						}
					}
				}
			}
			return proposals;
		}
    };
    

    provider.registerServiceProvider("orion.edit.contentAssist", contentAssistImpl, {
        name: "Markdown content assist",
        contentType: ["text/x-markdown"]
    });


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

