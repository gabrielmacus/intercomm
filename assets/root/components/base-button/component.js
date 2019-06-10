

class BaseButton  {
    constructor(vnode) {

        this.class = "";
        this.text = vnode.children[0];
        //m.stream - https://mithril.js.org/stream.html
        this.value = vnode.attrs.value;
        this.onclick = vnode.attrs.onclick;
        this.ondblclick = vnode.attrs.ondblclick;

    }
    oncreate(vnode) {
    }
    view(vnode,content) {


        return m(".button-container",{class:this.class}, [
            m("button",{onclick:this.onclick,ondblclick:this.ondblclick},this.text)
        ]);
    }

}
