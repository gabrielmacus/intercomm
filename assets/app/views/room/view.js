
class RoomView  extends LayoutView{
    constructor(vnode) {
        super(vnode);
        this.class = "room-view-container"

    }


    view(vnode,content) {
        return super.view(vnode,[
            m(UserList,{}),
            content
        ])
    }

}
Router["/room"] = RoomView;