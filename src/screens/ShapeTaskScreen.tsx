import React, {useEffect, useState} from "react";
import {Circle, Layer, Rect, Stage, Star, RegularPolygon} from "react-konva";
import './ShapeTaskScreen.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../utils/Colors';
import moment from "moment";

type SelectableShape = 'rectangle' | 'circle' | 'triangle' | 'star'
type Shape = SelectableShape | 'square'
type ShapeColor = 'blue' | 'yellow' | 'red' | 'green'

export const POSSIBLE_SHAPE_OUTCOMES: { [key in ShapeColor]: { [key in SelectableShape]: [ShapeColor, Shape] } } = {
    blue: {
        'rectangle': ['blue', 'rectangle'],
        'circle': ['blue', 'circle'],
        'triangle': ['blue', 'triangle'],
        'star': ['blue', 'star'],
    },
    yellow: {
        'rectangle': ['yellow', 'rectangle'],
        'circle': ['yellow', 'circle'],
        'triangle': ['yellow', 'triangle'],
        'star': ['yellow', 'star'],
    },
    red: {
        'rectangle': ['green', 'rectangle'],
        'circle': ['yellow', 'circle'],
        'triangle': ['yellow', 'triangle'],
        'star': ['red', 'star'],
    },
    green: {
        'rectangle': ['green', 'rectangle'],
        'circle': ['green', 'circle'],
        'triangle': ['green', 'triangle'],
        'star': ['green', 'star'],
    },
}

interface EvaluationRecord {
    input: [ShapeColor, SelectableShape]
    output: [ShapeColor, Shape]
    moment: moment.Moment
}

export function getShapeAndColorForInput(color: ShapeColor, shape: SelectableShape): [ShapeColor, Shape] {
    return POSSIBLE_SHAPE_OUTCOMES[color][shape]
}

const getColorHex = (color: ShapeColor) => Colors[color]
const renderShape = (shape: Shape, x: number, y: number, onClick?: () => any, color?: ShapeColor) => {

    const fillColor = color ? getColorHex(color) : undefined;
    const result = shape === 'rectangle'
        ?  <Rect fill={fillColor} onClick={onClick} y={y} x={x} width={100} height={50} stroke="black"/>
        : shape === 'square'
            ? <Rect fill={fillColor} onClick={onClick} y={y} x={x} width={50} height={50} stroke="black"/>
            : shape === 'circle'
                ? <Circle fill={fillColor} onClick={onClick} x={x} y={y} stroke="black" radius={25}/>
                : shape ==='star'
                    ? <Star fill={fillColor} onClick={onClick} x={x} y={y} stroke="black" radius={25} numPoints={5}
                            innerRadius={15}
                            outerRadius={30}/>
                    : shape ==='triangle'
                        ? <RegularPolygon fill={fillColor} onClick={onClick} x={x} y={y} stroke="black" radius={35} sides={3} />
                        : null
    return result;
}

const ShapeTaskScreen=() => {
    const [selectedColor, setSelectedColor] = useState<ShapeColor | undefined>('red');
    const [records, setRecords] = useState<EvaluationRecord[]>([]);
    const [latestMomentChecked, setLatestMomentChecked] = useState(moment())

    useEffect(() => {
        if (records.length > 0) {
            if (records[0].moment.isBefore(latestMomentChecked.subtract(5, 'seconds'))) {
                setRecords([])
            }
        }
        setTimeout(() => setLatestMomentChecked(moment()), 1000)

    }, [records, latestMomentChecked])

    const renderColorPicker = (color: ShapeColor) => {
        const isSelected = selectedColor === color
        const colorPickerClassnames = 'color-picker mx-3' + (isSelected ? 'color_picker_checked' : '')
        return <div onClick={() => setSelectedColor(color)}
                    className={colorPickerClassnames}
                    style={{backgroundColor: getColorHex(color)}}>
            {selectedColor === color ?
                <FontAwesomeIcon className='color-picker__check-mark'
                                 icon={faCheck} color={'green'}
                                 size={'2x'}/> : null}
        </div>
    }
    const onShapeClicked = (shape: SelectableShape) => {
         if (selectedColor){
            const newRecord: EvaluationRecord = {
                input: [selectedColor, shape],
                output: getShapeAndColorForInput(selectedColor, shape),
                moment: moment()
            }
            setRecords([newRecord].concat(records))
        }
    }

    return (
        <div className='shape-screen-container px-5 py-5'>
            <div className='pt-5'/>
            <h3 style={{textAlign: 'center'}}>Please click on shape and color</h3>
            <div className='d-flex flex-row justify-content-center mt-4'>
                {renderColorPicker('red')}
                {renderColorPicker('yellow')}
                {renderColorPicker('blue')}
                {renderColorPicker('green')}
            </div>

            <div className='row'>
                <div className='col-2 col-sm-1'/>
                <Stage className='col-12 col-lg-8 d-flex justify-content-center' width={window.innerWidth}
                       height={300}>
                    <Layer>
                        {renderShape('rectangle', 100, 100, () => onShapeClicked('rectangle'))}
                        {renderShape('circle', 330, 125, () => onShapeClicked('circle'))}
                        {renderShape('triangle', 500, 125, () => onShapeClicked('triangle'))}
                        {renderShape('star', 700, 125, () => onShapeClicked('star'))}
                    </Layer>
                </Stage>
                <div className='col-2 col-sm-1'/>
            </div>

            {
                records.length === 0
                    ? null
                    : <div className='evaluation-records-table col-8 mt-3'>
                        {
                            records.map((record, idx) => {
                                    const [color, shape] = record.output
                                    return <div key={idx}
                                                className='py-2 px-2 d-flex flex-row justify-content-center align-items-center'>
                                        <div className='col-auto'>
                                            {`Color ${record.input[1]} and Shape ${record.input[0]} selected. Result is: `}
                                        </div>
                                        <Stage className='col-auto d-flex justify-content-center' width={200} height={100}>
                                            <Layer>
                                                {renderShape(shape, 50, 50, () => {
                                                }, color)}
                                            </Layer>
                                        </Stage>
                                    </div>
                                }
                            )
                        }
                    </div>
            }
        </div>
    )
}
export default ShapeTaskScreen;
