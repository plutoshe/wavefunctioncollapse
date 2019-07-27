class Module {
    constructor() {
        this.position = [0, 0, 0];
        this.entropy = 0;
        this.indexOfHeap = 0;
    }
    compare(another) {
        return this.entropy < another.entropy;
    }
}