export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(val) {
    this.x = val.x;
    this.y = val.y;
    return this;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
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
