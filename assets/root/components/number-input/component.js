

class NumberInput extends CharInput{
    constructor(vnode) {
        super(vnode);
        this.class ="number-input-container";
        this.step = vnode.attrs.step || 1;
        this.min = vnode.attrs.min;
        this.max = vnode.attrs.max;

    }

    onkeydown(e)
    {
        super.onkeydown(e);

        if(!e.ctrlKey && (["Tab","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ",".","Control","Backspace","-"].indexOf(e.key) === -1 && !e.key.match(/^\d$/gm)))
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


    }

    onkeyup(e){
        super.onkeyup(e);



    }


    onkeypress(e)
    {
        super.onkeypress(e);
        this.value(parseFloat(this.value()));

        switch (e.key)
        {
            case 'ArrowUp':
                this.stepForward();
                break;
            case 'ArrowDown':
                this.stepBackward();
                break;
        }

        if( isNaN(this.value()))
        {
            this.value(0);
        }

    }

    stepForward(){

        if(this.value() + 1 > this.max)
        {
            return false;
        }

        this.value( this.value() + this.step );

        if( isNaN(this.value()))
        {
            this.value(0);
        }
    }

    stepBackward(){

        if(this.value() - 1 < this.min)
        {
            return false;
        }
        this.value( this.value() - this.step );

        if( isNaN(this.value()))
        {
            this.value(0);
        }
    }

    view(vnode) {

        return super.view(vnode,[

            m(".step-buttons",[
                m(BaseButton,{onclick:this.stepForward.bind(this)},"+"), m(BaseButton,{onclick:this.stepBackward.bind(this)},"-")
            ])

        ]);
    }
}
