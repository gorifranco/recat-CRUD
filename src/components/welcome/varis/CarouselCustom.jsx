import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';

export default function CarouselCustom(props) {
    return (
        <div className={"text-center mx-auto"}>
            <Carousel
                showArrows={false}
                showStatus={false}
                dynamicHeight={false}
                infiniteLoop={true}
                transitionTime={1000}
                autoPlay={true}
                showThumbs={false}
            >
                {props.imatges.map((value, index) => (
                    <div key={index} style={{height: "100%", width: "100%"}}>
                        <img src={value} alt={"imatge carrusel" + index} style={{objectFit: "cover", maxHeight: "600px", width: "100%"}}/>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
