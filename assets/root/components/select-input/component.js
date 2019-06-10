
class SelectInput extends BaseInput{

    constructor(vnode) {
        super(vnode);
        this.class = "select-input-container";

    }

    onkeyup(e)
    {

    }

    onkeypress(e)
    {

    }

    onkeydown(e){



    }

    view(vnode,content) {
        return super.view(vnode,[
            m("i.arrow","arrow_down"),
            m("select",[
                m("option","DEMO 1"),
                m("option","DEMO 2")
            ]),
            content
        ]);
    }
}
