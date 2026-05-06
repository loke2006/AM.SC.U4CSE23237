class MinHeap {
  constructor(capacity) {
    this.heap = [];
    this.capacity = capacity;
  }

  // Calculate a priority score for a notification
  // Placement = 3, Result = 2, Event = 1
  // Higher weight is more important.
  // For same weight, newer timestamp is more important.
  // Score = Weight * 1e15 + Timestamp in ms
  getScore(notification) {
    const weights = {
      Placement: 3,
      Result: 2,
      Event: 1
    };
    const weight = weights[notification.Type] || 0;
    const timestampMs = new Date(notification.Timestamp).getTime();
    return (weight * 1e15) + timestampMs;
  }

  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  insert(item) {
    const score = this.getScore(item);

    if (this.heap.length < this.capacity) {
      this.heap.push(item);
      this.heapifyUp();
    } else {
      // If the new item has a higher score than the lowest score in the top 10 (the root)
      if (score > this.getScore(this.peek())) {
        this.heap[0] = item;
        this.heapifyDown();
      }
    }
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.getScore(this.parent(index)) > this.getScore(this.heap[index])) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.getScore(this.rightChild(index)) < this.getScore(this.leftChild(index))) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.getScore(this.heap[index]) < this.getScore(this.heap[smallerChildIndex])) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  getTopElements() {
    // Return elements sorted by score descending (highest priority first)
    const sorted = [...this.heap].sort((a, b) => this.getScore(b) - this.getScore(a));
    return sorted;
  }
}

module.exports = MinHeap;
