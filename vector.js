export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  mul(n) {
    return new Vector2(this.x * n, this.y * n);
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  toString() {
    return '(' + this.x.toFixed(2) + ',' + this.y.toFixed(2) + ')';
  }
}

Vector2.Zero = () => new Vector2(0, 0);
Vector2.Up = () => new Vector2(0, -1);
Vector2.Right = () => new Vector2(1, 0);
Vector2.Down = () => new Vector2(0, 1);
Vector2.Left = () => new Vector2(-1, 0);

Vector2.ZERO = Vector2.Zero();
Vector2.UP = Vector2.Up();
Vector2.RIGHT = Vector2.Right();
Vector2.DOWN = Vector2.Down();
Vector2.LEFT = Vector2.Left()