import Field from './Field';
import * as board from '@/game/board';

export default function BoardPreview({ gamestate }) {
    return (
        <div className="preview">
            <div className="preview__play-button">
                PLAY
            </div>
            <div className="preview__board">
                {board.fields.map((field) => (
                <Field
                    key={Math.floor(Math.random() * 7890000)}
                    x={field.x}
                    y={field.y}
                    gamestate={gamestate}
                />
                ))}
            </div>
        </div>
    )
}