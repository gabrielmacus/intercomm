class ComponentsDemo extends BaseView {
    constructor(vnode) {
        super(vnode);
        this.class = "components-demo-container";
    }

    view(vnode,content) {
        return super.view(vnode,[
            m(CharInput,{value:m.stream(),maxlength:40},"Chars"),
            m(NumberInput,{value:m.stream(),min:0},"Number"),
            m(SelectInput,{value:m.stream()},"Select"),
            m(BaseButton,{},"Button")
        ]);
    }

}

Router["/components-demo"] = ComponentsDemo;