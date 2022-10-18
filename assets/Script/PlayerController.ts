import { _decorator, Component, Node, Vec2,Vec3, RigidBodyComponent, CCFloat  } from 'cc';
const { ccclass, property } = _decorator;

// 导入Joystick脚本
import roulette from "./RouletteController"

@ccclass('PlayerController')
export class PlayerController extends Component {
        // 角色的移动向量
        vector: Vec2 = new Vec2(0, 0);

        @property({displayName: "摇杆脚本所在节点", tooltip: "摇杆脚本Joystick所在脚本", type: roulette})
        roulette: roulette = null!;
        

        @property({displayName: "角色", tooltip: "角色", type: RigidBodyComponent})
        player: RigidBodyComponent = null!;
    
        @property({displayName: "是否禁锢角色", tooltip: "是否禁锢角色，如果角色被禁锢，角色就动不了了"})
        is_fbd_player: boolean = false;
    
        @property({displayName: "角色移动速度", tooltip: "角色移动速度，不建议太大，1-10最好", type: CCFloat})
        speed: number = 3;
    


    start() {

    }

    update() {
        //如果角色处于禁锢状态，则直接返回不进行任何动作
        if(this.is_fbd_player){
            return;
        }
        
         // 获取角色目标移动向量
        this.vector = this.roulette.vector;
        // 归一化(主要是为了让移动不是单一方向时保持运动速率相同)
        let dir = this.vector.normalize();
        // 乘速度
        let x = dir.x * this.speed;
        let y = dir.y * this.speed;
        // 获取角色当前移动向量
        let vc = new Vec3(0, 0, 0);
        // 获得物体运动的线性速度
        this.player.getLinearVelocity(vc);
        let vec = new Vec3(x, vc.y, -y);


        // 向量四元数乘法获得旋转后的方向向量
        Vec3.transformQuat(vec, vec, this.player.node.getRotation());

        // 设置角色移动向量
        this.player.setLinearVelocity(vec);

    }
}

