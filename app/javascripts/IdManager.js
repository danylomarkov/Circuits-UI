import plumb from 'jsplumb';

export class IdManager {
    static nextNumber() {
        return id++;
    }
    static nextUUID() {
        return jsPlumbUtil.uuid();
    }
}
IdManager.id = new Number(0);
