class BaseView  {
    constructor(vnode) {

    }

    view(vnode,content) {
        return m(".base-view-container",{class:this.class},[

            m("main",content)

        ]);
    }

}
