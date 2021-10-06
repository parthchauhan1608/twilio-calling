import { Component } from '@angular/core';
import * as Twilio_Client from 'twilio-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'twilio-frontend';
  baseUrl = 'https://api.amealio.in'
  constructor(
    private http : HttpClient,
  ) { }

  ngOnInit(){
    this.getToken().subscribe(
      (response: any)=>{
        console.log({response})
        let device = new Twilio_Client.Device();
        console.log(response)
        device.setup(response);
        // deprecated need to check
        device.on('ready',(ready)=>{
          console.log({ready});
          let params = {number: '+917566114703'}
          device.connect(params)
        })
        device.on('error',(error)=>{
          console.log({error})
        });
        device.on('connect',(connection)=>{
          console.log("connected",connection)
        })
        device.on('incoming',(check)=>{
          console.log("incoming",check)
        })
        device.on('cancel',(check)=>{
          console.log("cancel",check)
        })
        device.on('disconnect',(check)=>{
          console.log("disconnect",check)
        })
        device.on('offline',(check)=>{
          console.log("offline",check)
        })
        

        // Handle muting
        // device.activeConnection().mute(true); //false

        // Handle numeric buttons event
        // device.activeConnection().sendDigits();//digit

        // hang up call in progress
        // device.disconnectAll();
      },
      (error)=>{
        console.log({error});
      }
    );
  }

  getToken(){
    return this.http.get(`${this.baseUrl}/token`);
  }
}
