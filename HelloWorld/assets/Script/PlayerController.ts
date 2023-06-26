
import { __private, _decorator, Component, EventMouse, Input, input, Vec3, Node, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Fri Apr 28 2023 17:36:29 GMT+0800 (中国标准时间)
 * Author = joyy_yh
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/Script/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('PlayerController')
export class PlayerController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type: AnimationComponent })
    public BodyAnim: AnimationComponent  | null = null;

    // 是否接收到跳跃指令
    private _startJump: boolean = false;

    // 跳跃步长
    private _jumpStep: number = 0;
    // 当前角色位置
    private _curPos: Vec3 = new Vec3();
    // 角色目标位置
    private _targetPos: Vec3 = new Vec3();
    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);

    private _curJumpTime: number = 0;
    private _curJumpSpeed : number = 0;
    private _jumpTime :number = 0.2;

    


    start (): void {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    
    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        }
        else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }

    }
    
    update(deltaTime: number): void {
        if( this._startJump){ // 处理跳跃的分支逻辑
            if (this._startJump) {
                this._curJumpTime += deltaTime;
                if (this._curJumpTime > this._jumpTime) { // 跳跃结束
                    // end
                    this.node.setPosition(this._targetPos);  // 强制位移到目标位置
                    this._startJump = false; // 标记跳跃结束
                } else { // 跳跃中
                    // tween
                    this.node.getPosition(this._curPos);  // 获取当前的位置 
                    this._deltaPos.x = this._curJumpSpeed * deltaTime; // 计算本帧应该位移的长度
                    Vec3.add(this._curPos, this._curPos, this._deltaPos); // 将当前位置加上位移的长度
                    this.node.setPosition(this._curPos); // 设置位移后的位置
                }
            }
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true; // 表示开始跳跃
        this._jumpStep = step; // 本次跳跃的步数
        this._curJumpTime = 0; // 重置下跳跃的时间
        this._curJumpSpeed = this._jumpStep / this._jumpTime; // 计算跳跃的速度
        this.node.getPosition(this._curPos); // 获取角色当前的位置
        // 目标位置 = 当前位置 + 步长
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));  

        if(step == 1)
        {
            console.info('step == 1');
            this.BodyAnim.play("jump_OneStep");
        }
        else
        {
            console.info('step == 2');
            this.BodyAnim.play("jump_TwoStep");
        }
    }
}



/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
