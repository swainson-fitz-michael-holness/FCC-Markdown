import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import marked from 'marked';
import purify from 'dompurify';
import ContentEditable from 'react-contenteditable';
import turndown from 'turndown';
import Mapping from './Mapping';
let i = 0;
document.execCommand("defaultParagraphSeparator", false, 'br');


const turndownService = new turndown();
turndownService.addRule('div', {
  filter: 'div',
  replacement: function (content) {
    return '\n' + content
  }
})
// const testText = marked('# Marked in browser\n\nRendered by **marked**.');
// const sanitize = purify.sanitize(testText);

function editSelection(callback) {
  document.execCommand('bold');
  callback();
}

marked.setOptions({
  sanitize: true,
  headerIds: false,
  breaks: true,
  gfm: true
});



class App extends Component {
  constructor() {
    super();
    this.state = {
      html: marked('# Marked in browser\n\nRendered by **marked**.'),
      editorMode: false,
      previewMode: false,
      init: false
    }

    // document.onkeydown = (e) => { console.log(e) };
  };
  handleKeyPress = (keyPress) => {

    if (keyPress.keyCode === 13) {
      console.log(keyPress.keyCode)
      document.execCommand('insertBrOnReturn', false, '');
      return false;
    }
  };

  //   handleKeyPress = (keyPress) => {
  //     console.log(keyPress.keyCode)
  //     if (keyPress.keyCode === 13) {
  //         keyPress.preventDefault(); //UGGHHH!!!! I hate content editable. I just don't have the time to mess with it

  //         // document.execCommand('defaultParagraphSeparator', false, 'br');
  //         // document.execCommand('insertHtml', false, '<br>\u200C');
  //         document.execCommand('insertLineBreak', false); //UGH!!!
  //         // document.execCommand('insertHtml', false, '<br><br>');
  //         // document.execCommand('insertBrOnReturn', false, true);
  //         // return false;


  //     }
  // };

  handlePreview = (event) => {
    // console.log(purify.sanitize(event.target.value))
    console.log(document.getElementById('preview').contentEditable)
    this.setState({
      html: purify.sanitize(document.getElementById('preview').innerHTML, {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'code', 'ul', 'li', 'strong', 'em', 'ol', 'br', 'div', 'b'],
        FORBID_TAGS: ['style'],
        FORBID_ATTR: ['style']
      }).replace(/&nbsp;/g, ' '),

      // html: this.state.html + event.key
    }, () => {
      document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
    });


  }

  handleEditor = (event) => {
    // console.log(event.target.value[event.target.value.length - 1].charCodeAt(0));
    // console.log(event.target.value.replace(/\r/gi));
    // console.log(
    //   marked(purify.sanitize(event.target.value, {
    //     ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'code', 'ul', 'li', 'strong', 'em', 'ol', 'br'],
    //     FORBID_TAGS: ['style'],
    //     FORBID_ATTR: ['style']
    //   })).replace(/[\r\n]/gi, '<br>')
    // );

    console.log(
      // event.target.value[event.target.value.length - 1].charCodeAt(0).toString() + ' =? ' + String.fromCharCode(10) + ' =? '
    );

    //   if (event.target.value[event.target.value.length - 1].charCodeAt(0) === 10) {
    //     this.setState({
    //       html: this.state.html + '<br>'
    //     }, () => {
    //       // console.log(marked(this.state.html.toString()))
    //     });
    //   } else {
    //     this.setState({
    //       html: marked(event.target.value.replace(/[\n]/gi, '<br>'))
    //     }, () => {
    //       // console.log(marked(this.state.html.toString()))
    //     });
    //   }
    // }

    this.setState({
      html: marked(event.target.value),
      // html: marked(event.target.value.replace(/ /g, '&nbsp;')),
    }, () => {
      // this.formatPreview();
    });
  }

  enableMode = (event) => {
    event.preventDefault();


    if (!window.getSelection().isCollapsed) {

      document.designMode = 'on';

      editSelection(() => {
        document.designMode = 'off';
        console.log(document.getElementById('preview').innerHTML)
        document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
        this.setState({
          html: document.getElementById('preview').innerHTML
        });
      });
    }

    // document.execCommand('bold', false, null);
    // this.setState({
    //   editorMode: !this.state.editorMode
    // }, () => {
    //   if (this.state.editorMode === true) {
    //     document.designMode = 'off';
    //   }
    // })
  }

  formatPreview = () => {
    this.setState({
      // html: marked(document.getElementById('editor').value).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>'),
      html: marked(document.getElementById('editor').value),
    }, () => {
      // console.log(marked(this.state.html.toString()))
    });
  }
  // .replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>')
  formatPreviewY = () => {
    this.setState({
      html: marked(document.getElementById('editor').value),
    }, () => {
      // console.log(marked(this.state.html.toString()))
    });
  }

  componentDidUpdate() {

  }

  render() {
    // document.onkeydown = (keyPress) => {
    //   // keyPress.preventDefault();
    //   keyPress = keyPress || window.event;
    //   if (keyPress.keyCode === 13) {
    //     // keyPress.preventDefault();
    //     document.getElementById('preview').innerHTML += '<div><br></div>';
    //   }

    //   console.log(keyPress);
    // };

    // document.getElementById('preview').designMode = 'on';
    return (
      <div className='window'>
        <div className='app'>
          {/* <div dangerouslySetInnerHTML={{ __html: testText }}></div> */}

          <textarea id="editor" cols="79" rows="10"
            defaultValue={turndownService.turndown(this.state.html)}
            // onBlur={this.formatPreviewY}
            onChange={this.handleEditor}



          >


          </textarea>


          <ContentEditable id='preview' style={{ backgroundColor: 'beige', minHeight: '330px', width: '572px', textAlign: 'left', border: '5px solid black' }}
            html={this.state.html}

            // onBlur={this.formatPreview}
            // html={purify.sanitize(this.state.html)}
            // html={marked(purify.sanitize(this.state.html))} // It sanitizes the placeholder initiated on page load.
            onChange={this.handlePreview} // Fires if a user is typing in the content box
            onKeyDown={this.handleKeyPress}

          />
          <button onClick={this.enableMode}>trnsfr</button>

          <div>
            {this.state.html}

          </div>

          <Mapping />

        </div>
      </div >
    );
  }
}



export default App;
