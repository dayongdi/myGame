import { _decorator, Component, Node,Vec2,Vec3,CameraComponent, UITransformComponent, CCFloat, EventTouch } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('RouletteController')
export class RouletteController extends Component {
    @property({displayName: "canvas下的相机，只拍UI的那个", tooltip: "canvas下的相机，只拍UI的那个", type: CameraComponent})
    camera: CameraComponent = null!;

    @property({displayName: "父节点", tooltip: "摇杆中心点和背景的父节点，需要用这个节点来做坐标转换", type: UITransformComponent})
    parent: UITransformComponent = null!;

    @property({displayName: "摇杆背景", tooltip: "摇杆背景", type: Node})
    bg: Node = null!;

    @property({displayName: "摇杆中心点", tooltip: "摇杆中心点", type: Node})
    RouteCenter: Node = null!;

    @property({displayName: "最大半径", tooltip: "摇杆移动的最大半径", type: CCFloat})
    max_R: number = 135;

    @property({displayName: "是否禁用摇杆", tooltip: "是否禁用摇杆，禁用后摇杆将不能摇动"})
    is_forbidden: boolean = false;

    // 移动向量
    vector: Vec2 = new Vec2(0, 0);

    onLoad(){
        // 绑定事件
        // 因为摇杆中心点很小，如果给摇杆中心点绑定事件玩家将很难控制，摇杆的背景比较大，所以把事件都绑定在背景上是不错的选择，这样体验更好

        // 手指移动
        this.bg.on(Node.EventType.TOUCH_MOVE,this.move,this);
        // 手指结束
        this.bg.on(Node.EventType.TOUCH_END,this.finish,this);
        // 手指取消
        this.bg.on(Node.EventType.TOUCH_CANCEL,this.finish,this);
    }


    // 手指移动时调用，移动摇杆专用函数
    move(event: EventTouch){
        //如果方向轮盘处于禁用状态，则弹回摇杆
        if(this.is_forbidden){
            this.finish();
            return;
        }

        /*
        通过点击屏幕获得的点的坐标是屏幕坐标
        必须先用相机从屏幕坐标转到世界坐标
        再从世界坐标转到节点坐标
        */
        // 获取触点的位置，屏幕坐标
        let point = new Vec2(event.getLocationX(), event.getLocationY());
        // 屏幕坐标转为世界坐标
        let world_point = this.camera.screenToWorld(new Vec3(point.x, point.y));
        // 世界坐标转节点坐标
        let pos = this.parent.convertToNodeSpaceAR(new Vec3(world_point.x, world_point.y));

        if(pos.length()<this.max_R){
             // 摇杆的坐标为触点坐标
             this.RouteCenter.setPosition(pos.x,pos.y);
        }else{
            // 将向量归一化
            let pos_ = pos.normalize();
            // 归一化的坐标 * 最大半径
            let x = pos_.x * this.max_R;
            let y = pos_.y * this.max_R;
            
            // 赋值给摇杆
            this.RouteCenter.setPosition(x, y);
        }
        // 把摇杆中心点坐标，也就是角色移动向量赋值给vector
        this.vector = new Vec2(this.RouteCenter.position.x, this.RouteCenter.position.y);

    }

    finish(){
        // 摇杆坐标和移动向量都设为（0,0）
        this.RouteCenter.position = new Vec3(0, 0);
        this.vector = new Vec2(0, 0);
    }
}

