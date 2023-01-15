import React from 'react'
import { AreaChart, Grid } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'
import {useState} from 'react';

const dotColor = 'rgb(100,255,255)';
const lineColor = 'rgb(100,255,255)';
class DecoratorExample extends React.PureComponent {



    render() {

        const data = [ 1,2,3,4,3 ]

        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 4 }
                    stroke={ dotColor }
                    fill={ 'white' }
                />
            ))
        }

        const Line = ({ line }) => (
            <Path
                d={ line }
                stroke={ 'rgba(134, 65, 244, 0.5)' }
                fill={ 'none' }
            />
        )

        return (
            <AreaChart
                style={{ height: 200 }}
                data={ this.props.data }
                svg={{ fill:  'rgba(65,50,233, 0.3)' }}
                contentInset={{ left:20 , right:20, top:10, bottom: 30 }}
            >
                <Grid/>
                <Line/>
                <Decorator/>
            </AreaChart>
        )
    }

}

export default DecoratorExample
