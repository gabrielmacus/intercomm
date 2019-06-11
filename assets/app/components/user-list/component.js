

class UserList  {
    constructor(vnode) {
        this.user_list = []
        this.current_peer = {};

    }

    hangCall()
    {
        this.current_peer = {};
        if(this.audio)
        {
            this.audio.src = null;
        }
        STORE.rtc_connection.close();
        STORE.rtc_connection.onicecandidate = null;
        STORE.rtc_connection.onaddstream = null;
    }
    callUser(user,event)
    {
        console.log("Calling user...");

            this.current_peer["id"] = user.connection_id;
            this.current_peer["status"] = "offering";
        STORE.rtc_connection.createOffer((offer) => {

            STORE.rtc_connection.setLocalDescription(offer);
            STORE.ws_connection.send(JSON.stringify({"type":"msg","subtype":"offer","to":user.connection_id,"offer":offer}));

        }, (error) => {
            this.hangCall();
            alert("Error al intentar llamar al usuario");
        });
    }


    onWebsocketMessage(e)
    {
        let data = JSON.parse(e.data);
        let self = this;
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
                this.current_peer["id"] = data.from;
                this.current_peer["status"] = "answering";

                STORE.rtc_connection.setRemoteDescription(new RTCSessionDescription(data.offer),function () {

                    STORE.rtc_connection.createAnswer((answer)=>{
                        STORE.rtc_connection.setLocalDescription(answer);
                        STORE.ws_connection.send(JSON.stringify({type:'msg',to:data.from,subtype:'answer',answer:answer}));
                    },(error)=>{
                        self.hangCall();
                        console.log(error);
                    });


                },function () {
                    alert('Error al responder')
                });

                break;
            case 'answer':
                STORE.rtc_connection.setRemoteDescription(new RTCSessionDescription(data.answer),()=>{
                },(e)=>{
                    console.log(e);
                    alert('Error al recibir respuesta');
                });
                break;
            case 'icecandidate':

                STORE.rtc_connection.addIceCandidate(new RTCIceCandidate(data.candidate));
                break;
        }
        m.redraw();
    }

    oncreate(vnode) {

        if(STORE.ws_connection)
        {
            let self = this;
            self.audio = document.querySelector("#voice");
            self.audio.volume = 1;
            STORE.ws_connection.onmessage = this.onWebsocketMessage.bind(self);
            STORE.ws_connection.send(JSON.stringify({type:"sync-request",subtype:'connected-users'}));
            STORE.rtc_connection = new RTCPeerConnection(ENV.rtc_config);

            STORE.rtc_connection.onaddstream = (e) => {

                self.audio.src = window.URL.createObjectURL(e.stream);
            };
            STORE.rtc_connection.onicecandidate = (event)=>{

                if(event.candidate)
                {
                    STORE.ws_connection.send(JSON.stringify({"to":self.current_peer["id"],"type":"msg","subtype":"icecandidate","candidate":event.candidate}));
                }
            };
            STORE.rtc_connection.oniceconnectionstatechange = (e) => {
                console.log(e);
            };


            navigator.mediaDevices.getUserMedia({video:false,audio:true}).then(function(stream) {
                STORE.rtc_connection.addStream(stream);
            }).catch(function(err) {
                console.log(err)
            });
            /*
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            navigator.getUserMedia({ video: false, audio: true },
                (stream)=>{

                    STORE.rtc_connection.addStream(stream);
                },
                (error)=>{console.log(error)})*/

        }

    }

    getUsernameById(id)
    {
        let filter = this.user_list.filter((e)=>{ return e.connection_id == id});
        return filter.length >0?filter[0].username:"";
    }
    view(vnode,content) {
        let self = this;
        return m(".user-list-container", [

            m("h3.title",`Usuarios en línea (${this.user_list.length})`),
            m("ul.list",[
                this.user_list.map((user)=>{
                    return m("li.user",{key:user.connection_id},[
                            m("span.username",user.username),
                            m(".actions",{class:(this.current_peer.status)?"disabled":""},[
                                m(BaseButton,{onclick:self.callUser.bind(self,user)},"Llamar")
                            ])
                        ]);
                }),
                m(".empty",{hidden:(this.user_list.length > 0)},[
                    m("p","No hay usuarios conectados")
                ])

            ]),
            m("audio#voice",{autoplay:true}),
            m(".footer.connecting",{hidden:(this.current_peer.status !== "offering" && this.current_peer.status !== "answering")},[
                m("p",{},`Conectando con ${this.getUsernameById(this.current_peer.id)}...`),
            ]),

            m(".footer.connected",{hidden:this.current_peer.status !== "connected"},[
                m("p",`Hablando con ${this.getUsernameById(this.current_peer.id)}...`)
            ]),



        ]);
    }

}
