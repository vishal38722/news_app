import { render } from "@testing-library/react";
import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner"
import PropTypes from 'prop-types'


export default class News extends Component {
    static defaultProps = {
        country : "in",
        pageSize : 8
      }
      
    static propTypes = {
        country : PropTypes.string,
        pageSize : PropTypes.number
    }
    // articles = [
    //     {
    //       "source": {
    //         "id": "bbc-sport",
    //         "name": "BBC Sport"
    //       },
    //       "author": "BBC Sport",
    //       "title": "Shane Warne memorial - watch & follow updates",
    //       "description": "Watch live coverage and follow text updates and tributes from the state memorial for Australian cricket legend Shane Warne at the Melbourne Cricket Ground.",
    //       "url": "http://www.bbc.co.uk/sport/live/cricket/60916236",
    //       "urlToImage": "https:////m.files.bbci.co.uk/modules/bbc-morph-sport-seo-meta/1.22.0/images/bbc-sport-logo.png",
    //       "publishedAt": "2022-03-30T08:22:26.498888Z",
    //       "content": "Former England bowler and BBC cricket presenter Isa Guha, who became a colleague of Warne's in the commentary box: \"It has been a strange few weeks - a lot of shock and then we did our own tribute at… [+396 chars]"
    //     },
    //     {
    //       "source": {
    //         "id": "espn-cric-info",
    //         "name": "ESPN Cric Info"
    //       },
    //       "author": null,
    //       "title": "PCB hands Umar Akmal three-year ban from all cricket | ESPNcricinfo.com",
    //       "description": "Penalty after the batsman pleaded guilty to not reporting corrupt approaches | ESPNcricinfo.com",
    //       "url": "http://www.espncricinfo.com/story/_/id/29103103/pcb-hands-umar-akmal-three-year-ban-all-cricket",
    //       "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1099495_800x450.jpg",
    //       "publishedAt": "2020-04-27T11:41:47Z",
    //       "content": "Umar Akmal's troubled cricket career has hit its biggest roadblock yet, with the PCB handing him a ban from all representative cricket for three years after he pleaded guilty of failing to report det… [+1506 chars]"
    //     },
    //     {
    //       "source": {
    //         "id": "espn-cric-info",
    //         "name": "ESPN Cric Info"
    //       },
    //       "author": null,
    //       "title": "What we learned from watching the 1992 World Cup final in full again | ESPNcricinfo.com",
    //       "description": "Wides, lbw calls, swing - plenty of things were different in white-ball cricket back then | ESPNcricinfo.com",
    //       "url": "http://www.espncricinfo.com/story/_/id/28970907/learned-watching-1992-world-cup-final-full-again",
    //       "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1219926_1296x729.jpg",
    //       "publishedAt": "2020-03-30T15:26:05Z",
    //       "content": "Last week, we at ESPNcricinfo did something we have been thinking of doing for eight years now: pretend-live ball-by-ball commentary for a classic cricket match. We knew the result, yes, but we tried… [+6823 chars]"
    //     }
    //   ]

    constructor(){
        super();
        console.log("Hello! I'm a constructor from News component.")
        this.state = {
            articles : [],       // articles : this.articles, ----> if we are using sampleOutput example
            loading : false,
            page : 1
        }
    }

    async componentDidMount(){
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0c6978c3826740158dab336b6eff91d9&page=1&pageSize=${this.props.pageSize}`;
        this.setState({loading : true});
        let data = await fetch(url);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.setState({articles : parsedData.articles,
                    totalResults : parsedData.totalResults,
                    loading : false})
    }

    PreviousClick = async ()=>{
        console.log("Previous button clicked");
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0c6978c3826740158dab336b6eff91d9&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading : true})
        let data = await fetch(url);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.setState({
            page : this.state.page - 1,
            articles : parsedData.articles,
            loading : false
        })
    }

    NextClick = async ()=>{
        if (!(this.state.page + 1>Math.ceil(this.state.totalResults/this.props.pageSize))) {
            
        console.log("Next button clicked");
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0c6978c3826740158dab336b6eff91d9&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading : true})
        let data = await fetch(url);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.setState({
            page : this.state.page + 1,
            articles : parsedData.articles,
            loading : false
        })
    }
    }
    

    render() {
        return (
            <div className="container">
                <h1 className="my-3 text-center">NewsBeta - Top Headlines</h1>
                {this.state.loading && <Spinner/>}
                <div className="row my-4">
                    {!this.state.loading && this.state.articles.map((element)=>{
                        return(
                            <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title?element.title.slice(0, 40):""} description={element.description?element.description.slice(0, 65):""} imageUrl={element.urlToImage} newsUrl={element.url}/>
                            </div>
                        )
                    })}
                    
                </div>
                <div className="container my-4 d-flex justify-content-between">
                    <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.PreviousClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.NextClick}>Next &rarr;</button>
                </div>
                
                </div>
        )
    }
}