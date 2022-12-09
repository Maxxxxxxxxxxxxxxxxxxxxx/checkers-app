export default function Field({ x, y, pawn }) {
  if (pawn) {
    var spritePath = pawn === 'white' 
    ? '../../../public/pawn_white.svg'
    : '../../../public/pawn_black.svg'
  }
  return (
    <div className={`square ${x} ${y}`}>
      {x} {y}
      { spritePath ? <img src={spritePath} alt="" className="sprite" /> : undefined }
    </div>
  )
}