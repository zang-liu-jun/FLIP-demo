export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function shuffle(arr: any[]) {
  for (let i = arr.length; i > 0;) {
    let r = Math.floor(Math.random() * i--);
    [arr[i], arr[r]] = [arr[r], arr[i]]
  }
}
