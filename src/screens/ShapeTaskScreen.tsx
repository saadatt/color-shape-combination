import React, {useEffect, useState, Fragment} from "react";
import {Circle, Layer, Rect, Stage, Star, RegularPolygon} from "react-konva";
import './ShapeTaskScreen.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../utils/Colors';
import moment from "moment";

type SelectableShape = 'rectangle' | 'circle' | 'triangle' | 'star'
type Shape = SelectableShape | 'square'
type ShapeColor = 'red' | 'yellow' | 'blue' | 'green'

const RESULT_CASES: [ShapeColor, Shape][] = [
    //00 red
    ['green', 'rectangle'],   //00 rectangle => 0 << 2 | 0 ==> index = 0  0000
    ['yellow', 'circle'],   //10 circle =>      0 << 2 | 1 ==> index = 1  0010
    ['yellow', 'triangle'],   //01 triangle =>  0 << 2 | 2 ==> index = 2  0001
    ['red', 'star'],   //11 star =>             0 << 2 | 3 ==> index = 3  0011
    //10 yellow
    ['yellow', 'rectangle'],   //00 rectangle => 1 << 2 | 0 ==> index = 4
    ['yellow', 'circle'],   //10 circle =>       1 << 2 | 1 ==> index = 5
    ['yellow', 'triangle'],   //01 triangle =>   1 << 2 | 2 ==> index = 6
    ['yellow', 'star'],   //11 star =>           1 << 2 | 3 ==> index = 7
    //01 blue
    ['blue', 'rectangle'],   //00 rectangle => 2 << 2 | 0 ==> index = 8
    ['blue', 'circle'],   //10 circle =>      2 << 2 | 1 ==> index = 9
    ['blue', 'triangle'],   //01 triangle =>  2 << 2 | 2 ==> index = 10
    ['blue', 'star'],   //11 star =>             2 << 2 | 3 ==> index = 11
    //11 green
    ['green', 'rectangle'],   //00 rectangle => 3 << 2 | 0 ==> index = 12
    ['green', 'circle'],   //10 circle =>      3 << 2 | 1 ==> index = 13
    ['green', 'triangle'],   //01 triangle =>  3 << 2 | 2 ==> index = 14
    ['green', 'star'],   //11 star =>             3 << 2 | 3 ==> index = 15

];

const ALL_COLORS = ['red', 'yellow', 'blue', 'green'] as const;
const ALL_SHAPES = ['rectangle', 'circle', 'triangle', 'star'] as const;

interface EvaluationRecord {
    input: [ShapeColor, SelectableShape]
    output: [ShapeColor, Shape]
    moment: moment.Moment
}

export function getShapeAndColorForInput(color: ShapeColor, shape: SelectableShape): [ShapeColor, Shape] {
    const colorIdx = ALL_COLORS.indexOf(color);
    const shapeIdx = ALL_SHAPES.indexOf(shape);
    const resultIdx = colorIdx << 2 | shapeIdx;
    return RESULT_CASES[resultIdx];
}

const getColorHex = (color: ShapeColor) => Colors[color];

interface ShapeProps {
    shape: Shape;
    isSelected?: boolean;
    onClick?: () => void;
    color?: ShapeColor;
    className?: string;
}

const Shape = (props: ShapeProps) => {
    const {onClick, shape, color, isSelected, className} = props;
    const fillColor = color ? getColorHex(color) : undefined;
    const resultTable = {
        rectangle: {
            width: 100,
            height: 50,
            markup: <Rect fill={fillColor} y={0} x={0} width={100} height={50} stroke="black"/>
        },
        square: {
            width: 50,
            height: 50,
            markup: <Rect fill={fillColor} y={0} x={0} width={50} height={50} stroke="black"/>
        },
        circle: {
            width: 50,
            height: 50,
            markup: <Circle fill={fillColor} x={25} y={25} stroke="black" radius={24}/>
        },
        star: {
            width: 50,
            height: 50,
            markup: <Star fill={fillColor} x={25} y={25} stroke="black" radius={25} numPoints={5} innerRadius={10}
                          outerRadius={25}/>
        },
        triangle: {
            width: 50,
            height: 50,
            markup: <RegularPolygon fill={fillColor} x={25} y={30} stroke="black" radius={25} sides={3}/>
        }
    } as const;

    const {width, markup, height} = resultTable[shape];

    return (
        <div className={className || 'shape-wrapper'}>
            <Stage width={width} height={height} onClick={onClick} className={'shape-container'}>
                <Layer>{markup}</Layer>
            </Stage>
            {isSelected ? <FontAwesomeIcon className="color-picker__check-mark"
                                           icon={faCheck} color={'green'}
                                           size={'2x'}/> : null}
        </div>
    );
};


const ShapeTaskScreen = () => {
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
        return (
            <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={colorPickerClassnames}
                style={{backgroundColor: getColorHex(color)}}>
                {selectedColor === color ? (
                    <FontAwesomeIcon
                        className='color-picker__check-mark'
                        icon={faCheck}
                        color={'green'}
                        size={'2x'}/>
                ) : null}
            </div>
        );
    };

    const onShapeClicked = (shape: SelectableShape) => {
        if (selectedColor) {
            const newRecord: EvaluationRecord = {
                input: [selectedColor, shape],
                output: getShapeAndColorForInput(selectedColor, shape),
                moment: moment()
            }
            setRecords([newRecord].concat(records))
        }
    };

    const renderShape = (shape: SelectableShape) => {
        const isSelected = records.length > 0 && records[0].input[1] === shape;
        return <Shape key={shape} shape={shape} onClick={() => onShapeClicked(shape)} isSelected={isSelected}/>
    };

    return (
        <div className='shape-screen-container'>
            <div className='pt-5'/>
            <h3 style={{textAlign: 'center'}}>Please pick your shape and color</h3>
            <div className='selection-table'>
                {ALL_COLORS.map(renderColorPicker)}
                {ALL_SHAPES.map(renderShape)}
            </div>

            {records.length === 0 ? null : (
                <div className='evaluation-records-table'>
                    {records.map((record, idx) => {
                        const [color, shape] = record.output;
                        return (
                            <Fragment key={idx}>
                                <div className='col-auto' style={{fontFamily:'sans-serif'}}>
                                    {`Shape ${record.input[1]} and Color ${record.input[0]} selected. Result is: `}
                                </div>
                                <Shape shape={shape} color={color}/>
                            </Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default ShapeTaskScreen;
