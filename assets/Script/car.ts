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
    onCollisionEnter (other, self) {
        //console.log('crash:', other, self);
    }

    update(dt) {
        this.move();
    }
    
    onBeginContact(contact, selfCollider, otherCollider) {
        console.log('on begin')
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        console.log('presolve:', contact, selfCollider, otherCollider)
    }

    public onJoyMove(vec: cc.Vec2, rate: number) {
        if (rate)
            this._moveDir = vec;
            
        let rigid = this.node.getComponent(cc.RigidBody)
        //rigid.linearVelocity = vec.mul(rate * 100);
        rigid.applyForceToCenter(vec.mul(rate * 100), true);
        let box = this.node.getComponent(cc.BoxCollider);

        let pos = this.node.convertToWorldSpace(this.node.position);
        let collider = cc.director.getPhysicsManager().testPoint(this.node.position);
        let p2 = this.node.position.add(vec.mul(1000));
        var results = cc.director.getPhysicsManager().rayCast(this.node.position, p2, cc.RayCastType.Any);
        console.log(results);

    }

    private move() {
        this.node.angle = 90 + cc.misc.radiansToDegrees(
            Math.atan2(this._moveDir.y, this._moveDir.x)
        );
        //let newPos = this.node.position.add(this._moveDir.mul(this._movespeed * 5));
        //this.node.setPosition(newPos);
    }
}
