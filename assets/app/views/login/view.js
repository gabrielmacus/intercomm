
class LoginView  extends LayoutView{
    constructor(vnode) {
        super(vnode);
        this.class = "login-view-container"

    }


    submit(e){

        STORE.ws_connection = new WebSocket(ENV.ws_url);
        STORE.ws_connection.onmessage = (e)=>{
            let data = JSON.parse(e.data);

            if (data.type == 'conn_id')
            {
                STORE.user.connection_id = data.id;
                STORE.ws_connection.send(JSON.stringify({"type":"","subtype":"user-connected","user":STORE.user}));
                m.route.set("/room")

            }

        }
        STORE.ws_connection.onopen = (e)=>{


        };

        STORE.ws_connection.onerror = (e)=>{
            alert('Error al conectarse al servidor');
        };

        e.preventDefault();
    }

    view(vnode,content) {
        return super.view(vnode,[
            m("form",{onsubmit:this.submit.bind(this)},[
                m(CharInput,{value:STORE.user.username},"Usuario"),
                m(BaseButton,{},"Ingresar"),

            ]),
            content
        ])
    }

}
Router["/"] = LoginView;