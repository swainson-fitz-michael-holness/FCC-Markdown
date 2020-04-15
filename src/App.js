import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import StrikethroughIcon from '@material-ui/icons/FormatStrikethrough';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';

import './App.css';
import marked from 'marked';
import ContentEditable from 'react-contenteditable';
import turndown from 'turndown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
var turndownPluginGfm = require('turndown-plugin-gfm');

//change from markdown to html
const turndownService = new turndown();
turndownService.use(turndownPluginGfm.gfm);
turndownService.addRule('div', {
    filter: 'div',
    replacement: function (content) {
        return '\n' + content
    }
});

//load fcc script test
var loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    document.getElementById('root').appendChild(tag);
}
loadScript('https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js')

const placeholder =
    `# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
  
Inline code, \`<div></div>\`, between 2 back-ticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
## Emphasis
Emphasis, aka italics, with *asterisks* or _underscores_.
Strong emphasis, aka bold, with **asterisks** or __underscores__.
Combined emphasis with **asterisks and _underscores_**.
Strikethrough uses two tildes. ~~Scratch this.~~
- - - -

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

## Tables
Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

## Lists
- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

// calls edit buttons like bold and Italic
function editSelection(edit, callback) {
    document.execCommand(edit);
    callback();
}

// customize html output from markdown input
marked.setOptions({
    sanitize: true,
    headerIds: false,
    breaks: true,
    gfm: true
});

// Component body
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            html: marked(placeholder), //default loading doc
            blockquote: false
        }

    };


    // for when user is typing in the WYSIWYG previewer. We detect the return key and overide the default behavior of the browser to input a line break. 
    handleKeyPress = (keyPress) => {
        if (keyPress.keyCode === 13) {
            keyPress.preventDefault();
            document.execCommand('insertLineBreak', false);
        }
    };

    // for security reason we prevent paste
    handlePaste = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    handleHighlight = () => {
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
    };

    handlePreview = (event) => {
        this.setState({
            html: event.target.value
        }, () => {
            // alert('UGH!')
            document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
        });


    }

    //turns markup into html for preview. inithighlighting renders code syntax highlighting
    handleEditor = (event) => {
        this.setState({
            html: marked(event.target.value),
        }, () => {
            hljs.initHighlighting.called = false;
            hljs.initHighlighting();
        });

    }

    //logic for editing preview docs
    enableMode = (event) => {
        event.preventDefault();

        if (!window.getSelection().isCollapsed || true) {
            const editName = event.target.id;
            document.designMode = 'on';
            editSelection(editName, () => {

                document.designMode = 'off';
                document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
                this.setState({
                    html: document.getElementById('preview').innerHTML
                }, () => {
                    document.getElementById('preview').focus();
                });
            });
        }
    }

    // make corresponding window fullscreen
    enableFullscreen = (event) => {
        console.log(event.target.id)
        if (event.target.id === 'fullscreen-preview') {
            document.getElementById('edit').style = 'display: none';
            document.getElementById('fullscreen-enter').style = 'display: none';
            document.getElementById('fullscreen-exit').style = 'display: inline;';
            document.querySelector('.preview-container').style = 'max-height: calc(80vh); padding: 0px 30px 30px 30px; ';

        } else if (event.target.id === 'fullscreen-exit-previewer') {
            document.querySelector('.preview-container').style = 'max-height: calc(40vh)';
            document.getElementById('fullscreen-exit').style = 'display: none';
            document.getElementById('fullscreen-enter').style = 'display: inline';
            document.getElementById('edit').style = 'display: block';
        } else if (event.target.id === 'fullscreen-editor') {
            document.getElementById('previewer').style = 'display: none';
            document.getElementById('fullscreen-enter-editor').style = 'display: none';
            document.getElementById('fullscreen-exit-edit').style = 'display: inline;';
            document.getElementById('editor').style = 'min-height: 80vh;';
        } else if (event.target.id === 'fullscreen-exit-edit-btn') {
            document.getElementById('editor').style = 'max-height: calc(40vh);';
            document.getElementById('fullscreen-exit-edit').style = 'display: none';
            document.getElementById('fullscreen-enter-editor').style = 'display: inline';
            document.getElementById('previewer').style = 'display: block';
        }

    }

    render() {

        window.onload = () => {
            this.handleHighlight();
        }

        return (
            <div className='window' onClick={this.test}  >
                <div className='app' >
                    <div id='edit' className='edit-holder'>
                        <div className='toolbar-edit'>
                            <p>Editor</p>
                            <div className='preview-right-btns'>
                                <IconButton id='fullscreen-enter-editor' onClick={this.enableFullscreen} aria-label="fullscreen">
                                    <Fullscreen id='fullscreen-editor' />
                                </IconButton>
                                <IconButton id='fullscreen-exit-edit' onClick={this.enableFullscreen} aria-label="fullscreen">
                                    <FullscreenExit id='fullscreen-exit-edit-btn' />
                                </IconButton>
                            </div>
                        </div>

                        <div className="edit-container">
                            <textarea id="editor"
                                defaultValue={placeholder}
                                onChange={this.handleEditor}
                            ></textarea>
                        </div>

                    </div>



                    <div id='previewer' className='preview-holder'>
                        <div className='toolbar'>

                            <IconButton onClick={this.enableMode} aria-label="bold">
                                <BoldIcon id='bold' />
                            </IconButton>
                            <IconButton onClick={this.enableMode} aria-label="italic">
                                <ItalicIcon id='italic' />
                            </IconButton>
                            <IconButton onClick={this.enableMode} aria-label="strikethrough">
                                <StrikethroughIcon id='strikethrough' />
                            </IconButton>

                            <div className='preview-right-btns'>
                                <IconButton id='fullscreen-enter' onClick={this.enableFullscreen} aria-label="fullscreen">
                                    <Fullscreen id='fullscreen-preview' />
                                </IconButton>
                                <IconButton id='fullscreen-exit' onClick={this.enableFullscreen} aria-label="fullscreen">
                                    <FullscreenExit id='fullscreen-exit-previewer' />
                                </IconButton>
                            </div>
                        </div>
                        <div className='preview-container'>

                            <ContentEditable id='preview'
                                html={this.state.html}
                                onChange={this.handlePreview}
                                onKeyDown={this.handleKeyPress}
                                onPaste={this.handlePaste}

                            />
                        </div>
                    </div>
                </div>
                <p className='credentials'>Developed by Swainson Holness</p>
            </div >
        );
    }
}



export default App;
