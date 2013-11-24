Markdown-Plugin
===============

A markdown addon for [orion](http://eclipse.org/orion).
The MDList button allows user to convert the selection of text to and from a Markdown List.
For example, if there are 3 lines of selection text that start with normal text, the 3 lines of
text will be inserted an "*" for each line, it converts the selection to Markdown List.

The core of the plugin is content assist which creates content assist template when user enables it. 
The plugin detects the user's attempt for any potential keyword and then helps the user complete the Markdown keyword structure.

In addition, there is an outliner which enables user to see a tree structure of their headings of markdown and important keywords within the headings in the left panel.
When user click to the label in the tree structure, the cursor will automatically move to that line in the markdown file

Also it provides syntax highlighting for Markdown text.
