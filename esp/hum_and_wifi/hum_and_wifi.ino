#include <ESP8266WiFi.h>
#include <Wire.h>
#include "SHT21.h"

SHT21 SHT21;

const char* ssid = "";
const char* password = "";
float sensorData = 0;

WiFiServer server(80);
void setup()
{
  Wire.begin(D1, D2);
  Wire.setClockStretchLimit(1500);
  Serial.begin(9600);
  pinMode(D5, OUTPUT);
  pinMode(D6, OUTPUT);
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  // Start the server
  server.begin();
  Serial.println("Server started");
  // Print the IP address
  Serial.println(WiFi.localIP());
}

void loop()
{
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
  return;
  }
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
  // Read the first line of the request
  String req = client.readStringUntil('\r');
  Serial.println(req);
  client.flush();
  // Match the request
  if (req.indexOf("/sensor/") != -1) {
    //this for sensors
    sensorData = 0.000;
    if (req.indexOf("/sensor/hum") != -1) {
      sensorData = SHT21.getHumidity();
    }
    if (req.indexOf("/sensor/temp") != -1) {
      sensorData = SHT21.getTemperature();
    }
    client.flush();
    String o = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n";
    o += sensorData;
    o += "\n";
    client.print(o);
  }
  if (req.indexOf("/io/") != -1) {
    //outputs
    if(req.indexOf("/pin5/on") != -1 ) digitalWrite(D5, 1);
    if(req.indexOf("/pin5/off") != -1 ) digitalWrite(D5, 0);
    if(req.indexOf("/pin6/on") != -1 ) digitalWrite(D6, 1);
    if(req.indexOf("/pin6/off") != -1 ) digitalWrite(D6, 0);
    client.flush();
    String o = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nDone\r\n";
    client.print(o);
  }
  delay(1);
  client.stop();
  return;

}
