export function checkCollision(collisionRect, objects) {
  for (let i = 0; i < objects.length; i++) {
    if (isRectCollision(collisionRect, objects[i])) {
      return objects[i];
    }
  }
  return null;
}

function isRectCollision(rect1, rect2) {
  return (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y);
}