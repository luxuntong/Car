import * as JoystickCommon from "./JoystickCommon"
const {ccclass, property} = cc._decorator;
interface NotifyObj{
  onJoyMove(vec: cc.Vec2, rate: number);
}

@ccclass
export class Joystick extends cc.Component{
  joystickType: JoystickCommon.JoystickType = JoystickCommon.JoystickType.FOLLOW;
  directionType: JoystickCommon.DirectionType = JoystickCommon.DirectionType.ALL;

  dot: cc.Node = null;
  ring: cc.Node = null;
  _stickPos: cc.Vec2 = null;
  _touchLocation: cc.Vec2 = null;
  _radius: number = 0;
  _objs: Array<any> = [];

  onLoad() {
    this.dot = cc.find('dot', this.node);
    this.ring = cc.find('ring', this.node);
    this._radius = this.ring.width / 2;
    this._initTouchEvent();
    // hide joystick when follow
    if (this.joystickType == JoystickCommon.JoystickType.FOLLOW) {
      this.node.opacity = 0;
    }
  }

  public attach(obj: NotifyObj) {
    this._objs.push(obj);
  }

  private _initTouchEvent() {
    // set the size of joystick node to control scale
    this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this);
  }

  private _touchStartEvent(event) {
    const touchPos = this.node.convertToNodeSpaceAR(event.getLocation());

    if (this.joystickType === JoystickCommon.JoystickType.FIXED) {
      this._stickPos = this.ring.getPosition();

      // 触摸点与圆圈中心的距离
      const distance = touchPos.sub(this.ring.getPosition()).mag();

      // 手指在圆圈内触摸,控杆跟随触摸点
      if (this._radius > distance) {
        this.dot.setPosition(touchPos);
      }

    } else if (this.joystickType === JoystickCommon.JoystickType.FOLLOW) {

      // 记录摇杆位置，给 touch move 使用
      this._stickPos = touchPos;
      this.node.opacity = 255;
      this._touchLocation = event.getLocation();
      
      // 更改摇杆的位置
      this.ring.setPosition(touchPos);
      this.dot.setPosition(touchPos);
    }
  }

  private _touchMoveEvent(event) {
    if (this.joystickType === JoystickCommon.JoystickType.FOLLOW) {
      // 如果 touch start 位置和 touch move 相同，禁止移动
      if (this._touchLocation === event.getLocation()) {
        return false;
      }
    }

    // 以圆圈为锚点获取触摸坐标
    const touchPos = this.ring.convertToNodeSpaceAR(event.getLocation());
    const distance = touchPos.mag();

    // 由于摇杆的 postion 是以父节点为锚点，所以定位要加上 touch start 时的位置
    const posX = this._stickPos.x + touchPos.x;
    const posY = this._stickPos.y + touchPos.y;

    // 归一化
    const p = cc.v2(posX, posY).sub(this.ring.getPosition()).normalize();
    let rate = 1;

    if (this._radius > distance) {
      this.dot.setPosition(cc.v2(posX, posY));
      rate = distance / this._radius;
    } else {
      // 控杆永远保持在圈内，并在圈内跟随触摸更新角度
      const x = this._stickPos.x + p.x * this._radius;
      const y = this._stickPos.y + p.y * this._radius;
      this.dot.setPosition(cc.v2(x, y));

    }

    for (let obj of this._objs){
      obj.onJoyMove(p, rate);
    }
  }

  private _touchEndEvent() {
    this.dot.setPosition(this.ring.getPosition());
    if (this.joystickType == JoystickCommon.JoystickType.FOLLOW) {
      this.node.opacity = 0;
    }

    for (let obj of this._objs) {
      obj.onJoyMove(cc.v2(), 0);
    }
  }
}
