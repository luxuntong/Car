const {ccclass, property} = cc._decorator;
import {Joystick} from "./Joystick"

@ccclass
export class Car extends cc.Component {
    @property(Boolean)
    isplayer: Boolean = false;

    _joystick: Joystick = null;
    _moveDir: cc.Vec2 = cc.v2();
    _movespeed: number = 0;

    start () {
        if (this.isplayer) {
            this._joystick = cc.find('Joystick').getComponent(Joystick);
            this._joystick.attach(this);
        }
        // init logic
    }

    update (dt) {
        this.move();
    }

    public onJoyMove(vec: cc.Vec2, rate: number) {
        this._moveDir = vec;
        this._movespeed = rate;
    }

    private move() {
        this.node.angle = 90 + cc.misc.radiansToDegrees(
            Math.atan2(this._moveDir.y, this._moveDir.x)
        );
        let newPos = this.node.position.add(this._moveDir.mul(this._movespeed * 5));
        this.node.setPosition(newPos);
    }
}
