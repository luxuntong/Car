const {ccclass, property} = cc._decorator;
import {Car} from "./car"

@ccclass
export default class World extends cc.Component {
    @property(cc.Prefab)
    carPrefab: cc.Prefab = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        let first = cc.instantiate(this.carPrefab);
        let second = cc.instantiate(this.carPrefab);
        first.getComponent(Car).isplayer = true;
        first.setPosition(-100, 0);
        this.node.addChild(first);
        this.node.addChild(second);
    }
}