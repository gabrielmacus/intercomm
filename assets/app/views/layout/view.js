class LayoutView {
    constructor(vnode) {

        this.class = ""
    }

    view(vnode,content) {
        return m(".layout-view-container",{class:this.class},[

            m("main",content)

        ]);
    }

}