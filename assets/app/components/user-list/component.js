

class UserList  {
    constructor(vnode) {
        this.user_list = []
        this.connected_peer = null;
        this.data_channel = null;
    }

    callUser(user,event)
    {
        console.log("Calling user...");




            this.connected_peer = user.connection_id;
        STORE.rtc_connection.createOffer((offer) => {

            STORE.rtc_connection.setLocalDescription(offer);
            STORE.ws_connection.send(JSON.stringify({"type":"msg","subtype":"offer","to":user.connection_id,"offer":offer}));

        }, (error) => {
            alert("Error al intentar llamar al usuario");
        });
    }


    sendMsg(event)
    {
       this.data_channel.send( event.target.value);
    }

    oncreate(vnode) {
        navigator.getUserMedia({ video: false, audio: true },
            (stream)=>{
            console.log(stream)
            },
            (error)=>{console.log(error)})

        if(STORE.ws_connection)
        {
            let self = this;
            STORE.rtc_connection = new RTCPeerConnection(ENV.rtc_config);

            STORE.rtc_connection.ondatachannel = (event) =>{
                this.data_channel = event.channel;
                this.data_channel.onerror = function (error) {
                    console.log("Error:", error);
                };

                this.data_channel.onopen = (e)=>{
                    console.log("data channel opennecd")
                }
                this.data_channel.onmessage = function (event) {
                    console.log("Got message:", event.data);
                };
            }
            STORE.rtc_connection.onicecandidate = (event)=>{

                if(event.candidate)
                {
                    STORE.ws_connection.send(JSON.stringify({"to":self.connected_peer,"type":"msg","subtype":"icecandidate","candidate":event.candidate}));
                }
            };
            STORE.ws_connection.onmessage = (e)=>{


                let data = JSON.parse(e.data);
                console.log(data);
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
                            STORE.ws_connection.send(JSON.stringify({to:data.from,type:'msg',subtype:'connected-users',users:self.user_list.concat([STORE.user])}));
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
                    case 'offer':
                        this.connected_peer = data.from;
                        STORE.rtc_connection.setRemoteDescription(new RTCSessionDescription(data.offer));
                        STORE.rtc_connection.createAnswer((answer)=>{
                            STORE.rtc_connection.setLocalDescription(answer);
                            STORE.ws_connection.send(JSON.stringify({type:'msg',to:data.from,subtype:'answer',answer:answer}));
                        },(error)=>{
                            console.log(error);
                        });
                        break;
                    case 'answer':
                        STORE.rtc_connection.setRemoteDescription(new RTCSessionDescription(data.answer));
                        break;
                    case 'icecandidate':

                        STORE.rtc_connection.addIceCandidate(new RTCIceCandidate(data.candidate));
                        break;
                }

                m.redraw();

            }
            STORE.ws_connection.send(JSON.stringify({type:"sync-request",subtype:'connected-users'}));
        }

    }

    view(vnode,content) {
        let self = this;
        return m(".user-list-container", [
            m("h3.title",`Usuarios en línea (${this.user_list.length})`),
            m("ul.list",[
                this.user_list.map((user)=>{
                    return [
                        m("li.user",{key:user.connection_id},[
                            m("span.username",user.username),
                            m(".actions",[
                                m("span.call",{onclick:self.callUser.bind(self,user)},"Llamar")
                            ])

                        ]),
                        m("input",{oninput: self.sendMsg.bind(self) })

                    ];
                })
            ])

        ]);
    }

}
