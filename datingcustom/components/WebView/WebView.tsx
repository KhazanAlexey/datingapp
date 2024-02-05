import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {DeviceData} from "../../App.tsx";
import {Text} from "react-native";

interface WebViewComponentProps {
    deviceData: DeviceData;
}
export class WebViewComponent extends Component<WebViewComponentProps> {
    render() {
        return (<>
                <Text>{JSON.stringify(this.props.deviceData)}</Text>
                <WebView
                    source={{uri: 'https://google.com'}}
                    style={{marginTop: 20}}
                />
            </>

        );
    }
}
