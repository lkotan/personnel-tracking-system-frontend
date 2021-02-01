import * as signalr from "@microsoft/signalr"

export default class HubService {
  connection() {
    let connect = signalr.HubConnection;

    connect = new signalr.HubConnectionBuilder().withUrl("http://localhost:53825/NotificationHub").build();

    return connect;
  }
  connectionChart() {
    let connect = signalr.HubConnection;

    connect = new signalr.HubConnectionBuilder().withUrl("http://localhost:53825/ChartHub").build();

    return connect;
  }
}
