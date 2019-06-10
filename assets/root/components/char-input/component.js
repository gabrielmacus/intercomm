
class CharInput extends BaseInput{
    constructor(vnode) {
        super(vnode);
        this.class = "char-input-container";
        this.maxlength = vnode.attrs.maxlength;
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

        var self = this;
        return super.view(vnode,[
            m("input",{maxlength:self.maxlength,value:self.value(),onkeyup:this.onkeyup.bind(this),onkeydown:this.onkeydown.bind(this),onkeypress:this.onkeypress.bind(this), oninput:(e)=>{ self.value(e.target.value);}}),
            content
        ]);
    }
}
