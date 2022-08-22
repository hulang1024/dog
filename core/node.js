export default class Node {
  constructor() {
    this.root = null;
    this.parent = null;
    this.children = [];
    this.isQueuedForFree = false;
    this._pauseMode = PauseMode.Inherit;
    this.isProcessOnPause = false;
  }

  enterTree() {}

  ready() {}

  exitTree() {}

  update(delta) {}

  setPauseMode(pauseMode) {
    this._pauseMode = pauseMode;
    this._inheritParentPause(this);

    traverseTrees(this.children, (node) => {
      if (node._pauseMode == PauseMode.Inherit) {
        this.isProcessOnPause = node.parent.isProcessOnPause;
        return true;
      } else {
        // 结点的变化只影响直接继承的子结点
        return false;
      }
    });
  }

  add(child) {
    this.children.push(child);
    child.parent = this;
    this._inheritParentPause(child);
  
    if (!this.root) {
      this.root = this.parent.root;
    }
    child.root = this.root;
    child.root.addNode(child);
    child.enterTree();

    // TODO: 正确的时机
    child.ready();
  }

  _inheritParentPause(node) {
    if (node._pauseMode == PauseMode.Inherit) {
      node.isProcessOnPause = node.parent.isProcessOnPause;
    } else {
      node.isProcessOnPause = node._pauseMode == PauseMode.Process;
    }
  }

  removeChild(child) {
    const i = this.children.indexOf(child);
    if (i > -1) {
      this.children.splice(i, 1);
      child.queueFree();
    }
  }

  queueFree() {
    this.isQueuedForFree = true;
    traverseTrees(this.children, (node) => {
      node.queueFree();
      return true;
    });
  }

  onKeyPressed(key) {
    this.children.forEach((child) => {
      child.onKeyPressed(key);
    });
  }

  onKeyReleased(key) {
    this.children.forEach((child) => {
      child.onKeyReleased(key);
    });
  }
}

export class Group extends Node {
  clear() {
    this.children.forEach((node) => {
      node.queueFree();
    });
    this.children = [];
  }

  count() {
    return this.children.length;
  }
}

/* 
@param nodes: 要遍历的结点
@param visit: (node) => boolean
               node: 结点
               return: 是否继续遍历node的子结点
*/
export function traverseTrees(nodes, visit) {
  // DFS
  let node;
  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (node) {
      if (visit(node) && node.children.length) {
        traverseTrees(node.children, visit);
      }
    }
  }
}

export const PauseMode = {
  Inherit: 0,
  Stop: 1,
  Process: 2
};