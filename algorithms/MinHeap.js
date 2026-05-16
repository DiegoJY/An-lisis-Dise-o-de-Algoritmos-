class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(nodeId, weight, payload = null) {
    this.heap.push({ nodeId, weight, payload });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[current].weight >= this.heap[parent].weight) break;
      
      [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
      current = parent;
    }
  }

  sinkDown(index) {
    let current = index;
    const length = this.heap.length;

    while (true) {
      let leftChild = 2 * current + 1;
      let rightChild = 2 * current + 2;
      let smallest = current;

      if (leftChild < length && this.heap[leftChild].weight < this.heap[smallest].weight) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].weight < this.heap[smallest].weight) {
        smallest = rightChild;
      }
      if (smallest === current) break;

      [this.heap[current], this.heap[smallest]] = [this.heap[smallest], this.heap[current]];
      current = smallest;
    }
  }
}

module.exports = MinHeap;