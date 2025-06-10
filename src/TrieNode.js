export default class TrieNode {
  constructor() {
    this.children = {};
    this.handlers = null;
    this.paramName = null;
    this.constraint = null;
  }
}
