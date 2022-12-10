export default function PlayerBar({ isEnemy, playerId }) {
  return (
    <div className={`player ${ isEnemy ? 'enemy' : 'you'}` } 
         style={isEnemy ? {'marginBottom': '1rem'} : {'marginTop': '1rem'} }
    >
      <div className="avatar"></div>
      <div className="info">
        <a href="">{playerId}</a>
        <p>1100</p>
      </div>
    </div>
  )
}