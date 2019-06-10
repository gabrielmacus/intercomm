
class BaseInput  {
    constructor(vnode) {

        this.class = "";
        this.label = vnode.children[0];
        //m.stream - https://mithril.js.org/stream.html
        this.value = vnode.attrs.value || m.stream();
    }

    view(vnode,content) {
        return m(".input-container",{class:this.class}, [
            m("label.input-label",this.label),
            m(".content",content)
        ]);
    }

}
