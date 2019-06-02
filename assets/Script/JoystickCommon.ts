const {ccclass, property} = cc._decorator;
enum JoystickType {
  FIXED = 0,
  FOLLOW = 1,
}

enum DirectionType {
  FOUR = 4,
  EIGHT = 8,
  ALL = 0,
}

enum SpeedType {
  STOP = 0,
  NORMAL = 1,
  FAST = 2
}

export {JoystickType, DirectionType, SpeedType}