class Print {
  public options: {
    noPrintClass: string;
    onStart: () => void;
    onEnd: () => void;
  };
  private dom: HTMLElement;

  constructor(dom: HTMLElement, options: any) {
    this.options = options;
    this.dom = dom;
  }

  init() {
    const content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  }

  getStyle() {
    let str = '';
    const styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += `<style>
    ${this.options.noPrintClass ? this.options.noPrintClass : '.no-print'}
    {display:none;}</style>`;

    return str;
  }

  getHtml() {
    const inputs = document.querySelectorAll('input');
    const textareas = document.querySelectorAll('textarea');

    for (const k in inputs) {
      if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
        if (inputs[k].checked) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type === 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (const k2 in textareas) {
      if (textareas[k2].type === 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }
    return this.dom.outerHTML;
  }

  writeIframe(content: string) {
    const iframe = document.createElement('iframe');
    const f = document.body.appendChild(iframe);
    iframe.id = 'fresume_iframe';
    const w = f.contentWindow || f.contentDocument;
    const doc = f.contentDocument || f.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
    }
    this.toPrint(w, function () {
      document.body.removeChild(iframe);
    });
  }

  toPrint(w: any, cb: () => void) {
    w.onload = function () {
      try {
        setTimeout(function () {
          w.focus();
          if (!w.document.execCommand('print', false, null)) {
            w.print();
          }
          cb();
        });
      } catch (err) {
        console.log('err', err);
      }
    };
  }
}

export default Print;
