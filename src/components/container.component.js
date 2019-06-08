import React from 'react';
import axios from 'axios';
import Display from './display.component';
import API from './keys.componenet';

// Function to determine search method
var determineMethod = (props)=>{
    if(isNaN(props)){
        console.log('input is city name');
        return 'q';
    }
    else{
        console.log('input is zip');
        return 'zip';
    }
}

export default class Container extends React.Component{
    constructor(props){
        super(props);

        // binding of funtions
        this.onChangeCityOrZip = this.onChangeCityOrZip.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.selectQuery = this.selectQuery.bind(this);
        this.pageReload = this.pageReload.bind(this);

        this.state={
            cityOrZip: '',
            search: false
        }
    }

    pageReload(){
        window.location.reload();
    }

    // Opitimizing and returning of Image Query
    selectQuery(imageQuery){
        if (imageQuery === 'clouds' || imageQuery === 'Clouds')
        return 'Clouds'
        else if (imageQuery === 'mist' || imageQuery === 'Mist')
        return 'Misty Nature'
        else if (imageQuery === 'haze' || imageQuery === 'Haze')
        return 'Haze Nature'
        else if (imageQuery === 'rain' || imageQuery === 'Rain')
        return 'Rain'
        else if (imageQuery === 'clear' || imageQuery === 'Clear')
        return 'Bright Nature'
        else
        return imageQuery
    }

    onChangeCityOrZip(event){
        this.setState({
            cityOrZip: event.target.value
        })
    }

    onSubmit(event){
        event.preventDefault();

        const weather = {
            cityOrZip: this.state.cityOrZip,
        };

        let method = determineMethod(weather.cityOrZip);
        console.log(method);

        // Fetching Weather info using API
        axios.get(`https://api.openweathermap.org/data/2.5/weather?${method}=${weather.cityOrZip}&APPID=${API.weatherAPI}&units=metric`)
        .then( result => {
            console.log(result.data);

            // storing info for temporary use to fetch image result from API
            let tempDescription = result.data.weather[0].description;

            let imageQuery = this.selectQuery(tempDescription);
        
            // Fetching Images from API
            let apiURL = `https://api.pexels.com/v1/search?query=${imageQuery}`;
            axios.get(apiURL, { 'headers' : { 'Authorization': API.photosAPI } }).then(imageResult => {
                let imageData = imageResult.data;
                console.log(imageData);
                let nosOfImages = imageData.per_page;
                let photos = [];
                for(var i=0; i<nosOfImages; i++){
                    photos.push({
                        index: i,
                        imageURL: imageData.photos[i].src.large2x,
                        photographer: imageData.photos[i].photographer
                    })
                }

                // Selecting image from the page results
                let imageIndex = Math.floor(Math.random() * 15);
                this.setState({
                    search: true,
                    weatherData: {
                        cityName: result.data.name,
                        weatherDescription: result.data.weather[0].description,
                        temp: result.data.main.temp,
                        tempMin: result.data.main.temp_min,
                        tempMax: result.data.main.temp_max,
                        humidity: result.data.main.humidity,
                        weatherImage: photos[imageIndex].imageURL,
                        imagePhotographer: photos[imageIndex].photographer
                    }
                })
            }).catch(err => {
                console.log(err);
            });            
        }).catch( err => {
            window.alert('Input Not Valid!!!')
            console.log(err);
        });
        
        this.setState({
            cityOrZip: '',
        })
    }


    render(){

        // Updating background of page
        if(this.state.search){
            return(
                <div className='view' style={{background: `url(${this.state.weatherData.weatherImage}) no-repeat center center fixed`,
                 backgroundSize: 'cover',height: '100vh'}}>
                    <header style={ {textAlign: 'center', fontWeight: 'bold'}}>
                        <a href='#!'  className='navbar navbar-brand text-dark'>
                            <h2 onClick={this.pageReload} style={{fontWeight: 'bold'}}>
                                Weather Web App
                                <hr />
                            </h2>
                        </a>
                    </header>
                    <div className='container d-flex justify-content-center'>
                        <div className='col-xl-4 col-lg-6 col-md-8 col-xs-12'>
                            <form onSubmit={this.onSubmit} >
                                <div className='form-group' style={{textAlign: 'center'}}>
                                    <label>Enter City or Zip:</label>
                                    <input type='text' id='cityOrZip' name='cityOrZip' placeholder='City or Zip' 
                                    value={this.state.cityOrZip} onChange={this.onChangeCityOrZip} className='form-control' 
                                    style={{textAlign: 'center'}}/>
                                </div>
                                <div className='form-group d-flex justify-content-center'>
                                    <input type='submit' placeholder='Search' className='btn btn-success' />
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* State is being passed to the Display Component */}
                    {this.state.search ? <Display show = {this.state.weatherData} /> : null}
                </div>
            )
        }

        // if no query is present or passed then this part will be rendered
        return(
            <div className='view' style={{background: '#FFFFFF'}}>
                <header style={ {textAlign: 'center', fontWeight: 'bold'}}>
                    <a href='#!'  className='navbar navbar-brand text-dark'>
                        <h2 onClick={this.pageReload} style={{fontWeight: 'bold'}}>
                            Weather Web App
                            <hr />
                        </h2>
                    </a>
                </header>
                <div className='container d-flex justify-content-center'>
                    <div className='col-xl-4 col-lg-6 col-md-8 col-xs-12'>
                        <form onSubmit={this.onSubmit} >
                            <div className='form-group' style={{textAlign: 'center'}}>
                                <label>Enter City or Zip:</label>
                                <input type='text' id='cityOrZip' name='cityOrZip' placeholder='City or Zip' value={this.state.cityOrZip} 
                                onChange={this.onChangeCityOrZip} className='form-control' style={{textAlign: 'center'}}/>
                            </div>
                            <div className='form-group d-flex justify-content-center'>
                                <input type='submit' placeholder='Search' className='btn btn-success' />
                            </div>
                        </form>
                    </div>
                </div>
                {this.state.search ? <Display show = {this.state.weatherData} /> : null}
            </div>
        )
    }
} 