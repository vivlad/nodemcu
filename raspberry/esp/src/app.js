const mcuQuery = require("../mcuQuery");

import React from "react";
import ReactDOM from "react-dom";

class HelloMessage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            temp: '',
            hum: '',
        }
    }

    getTemp() {
        mcuQuery("sensor/temp", temp => {
            this.setState({temp});
        });
        mcuQuery("sensor/hum", hum => {
            this.setState({hum});
        });
    }

    componentDidMount(){
        this.getTemp();
    }

    render() {
        return (
        <div>
            <h1>{this.props.name}</h1>
            <div>Temp:{this.state.temp}</div>
            <div>Hum:{this.state.hum}</div>
        </div>
        );
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage name="React ESP app" />, mountNode);
