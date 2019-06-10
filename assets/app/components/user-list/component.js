

class UserList  {
    constructor(vnode) {
        this.user_list = [
        ]
    }
    oncreate(vnode) {

        if(STORE.ws_connection)
        {
            STORE.rtc_connection = new RTCPeerConnection(ENV.rtc_config);
            console.log(STORE.rtc_connection)

            let self = this;
            STORE.ws_connection.onmessage = (e)=>{


               let data = JSON.parse(e.data);
                console.log(data)
                switch (data.subtype)
                {
                    case 'user-connected':
                        self.user_list.push(data.user);

                        break;
                    case 'user-disconnected':
                        let idx = self.user_list.findIndex((el)=>{return el.connection_id == data.id});
                        self.user_list.splice(idx,1);
                        break;
                    case 'connected-users':

                        if(data.type == 'sync-request')
                        {
                            STORE.ws_connection.send(JSON.stringify({to:data.from,type:'msg',subtype:'connected-users',users:Array.concat(self.user_list,[STORE.user])}));
                        }
                        else
                        {
                            self.user_list = data.users.filter((el)=>{

                                if(STORE.user.connection_id != el.connection_id)
                                {
                                    return el;
                                }

                            });
                        }
                        break;
                }

                m.redraw();

            }
            STORE.ws_connection.send(JSON.stringify({type:"sync-request",subtype:'connected-users'}));
        }

    }



    view(vnode,content) {

        return m(".user-list-container", [
            m("h3.title",`Usuarios en línea (${this.user_list.length})`),
            m("ul.list",[
                this.user_list.map((user)=>{
                    return m("li.user",{key:user.connection_id},user.username);
                })
            ])

        ]);
    }

}
