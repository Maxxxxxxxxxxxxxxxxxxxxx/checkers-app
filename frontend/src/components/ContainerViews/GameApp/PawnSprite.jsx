export default function PawnSprite({ color }) {
  if (pawn === 'white')      var spritePath = '/pawn_white.svg';
  else if (pawn === 'black') var spritePath = '/pawn_black.svg';

  return spritePath ? <img src={spritePath} alt="" className="sprite" /> : undefined
}