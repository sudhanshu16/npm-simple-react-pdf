import React from 'react';
import ReactDOM from 'react-dom';
import PDF from 'pdfjs-dist/build/pdf.combined.js';

export default class SimplePDF extends React.Component {
  nodeRef;

  constructor(props) {
    super(props);

    // bind
    this.loadPDF = this.loadPDF.bind(this);
  }

  loadPDF() {

    // get node for this react component
    if (this.nodeRef === null) return;
    var node = this.nodeRef;

    // clean for update
    node.innerHTML = "";

    // set styles
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.overflowX = "hidden";
    node.style.overflowY = "scroll";
    node.style.padding = '0px';

    PDF.getDocument(this.props.file).then((pdf) => {

      // no scrollbar if pdf has only one page
      if (pdf.numPages===1) {
        node.style.overflowY = "hidden";
      }

      for (var id=1,i=1; i<=pdf.numPages; i++) {

        pdf.getPage(i).then((page) => {

          // calculate scale according to the box size
          var boxWidth = node.clientWidth;
          var pdfWidth = page.getViewport(1).width;
          var scale = boxWidth / pdfWidth;
          var viewport = page.getViewport(scale);

          // set canvas for page
          var canvas = document.createElement('canvas');
          canvas.id  = "page-"+id; id++;
          canvas.width  = viewport.width;
          canvas.height = viewport.height;
          node.appendChild(canvas);

          // get context and render page
          var context = canvas.getContext('2d');
          var renderContext = {
            canvasContext : context,
            viewport      : viewport
          };
          page.render(renderContext);
          this.props.onLoad && this.props.onLoad()
        });
      }
    });
  }

  render() {
    return (
      <div className="SimplePDF">
        <div className="S-PDF-ID" ref={(div) => { this.nodeRef = div; }}></div>
      </div>
    );
  }

  componentDidMount() {
    this.loadPDF();
  }

  componentDidUpdate() {
    this.loadPDF();
  }
}

module.exports = { SimplePDF: SimplePDF };
