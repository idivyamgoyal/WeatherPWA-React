import React from 'react';

export default class Display extends React.Component{
    
    render(){
        console.log(this.props);
        return(
            // Displaying fetched details from API
            <div className='container'>
                <div className='text-white justify-content-center' style={{fontFamily: "'Courier New', Courier,monospace"}}>
                    <div className='col col-md-12 col-xs-12' >
                        <div className='font-weight-bold' style={{fontSize: '5vh', textAlign: 'center'}}>
                            {this.props.show.cityName}&nbsp;
                            {this.props.show.temp}&#176;C
                            <hr/>
                        </div>
                    </div>
                    <div className='text-white col col-sm-12 col-xs-12 text-capitalize' style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                    fontSize: '4vh', textAlign: 'center'}}>
                        <div>{this.props.show.weatherDescription}</div>
                        <div>Min. Temp: {this.props.show.tempMin}&#176;C</div>
                        <div>Max. Temp: {this.props.show.tempMax}&#176;C</div>
                        <div>Humidity: {this.props.show.humidity}%</div>
                    </div>
                </div>
            </div>
        )
    }
}