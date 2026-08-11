import React from "react"

export const Hello = (props) =>{
    return (
        <div className="container">
            <h1>Hello {props.name} </h1>
            <h2>{props.alias ? props.alias :"no alias"}</h2>
        </div>
    )
}


//without JSX
export const HelloWithoutJSX = () =>{
    return React.createElement(
        "div",
        {
            id:"container"
        },
        React.createElement("h1",null,"Hello")
    )
}