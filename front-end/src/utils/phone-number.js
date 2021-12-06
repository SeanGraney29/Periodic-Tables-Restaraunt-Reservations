export default function phoneNumConvert(input) {
  input = input.replace(/[^\d]/g, "");
  if (input.length <= 4) return input;
 if (input.length <= 7) return `${input.slice(0, 3)}-${input.slice(3)}`;
  return `${input.slice(0, 3)}-${input.slice( 3, 6)}-${input.slice(6, 10)}`;
}