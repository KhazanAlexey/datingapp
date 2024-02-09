import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {DeviceData} from "../../App.tsx";

interface WebViewComponentProps {
    deviceData: DeviceData;
    uri:string
}
export class WebViewComponent extends Component<WebViewComponentProps> {
    render() {
        return (<>
                {/*<Text>{JSON.stringify(this.props.deviceData)}</Text>*/}
                <WebView
                    source={{uri: this.props.uri}}
                    style={{marginTop: 20}}
                />
            </>

        );
    }
}
