class WeatherModel {
  name?: number;
  description?: string;
  temp?: number;
  speed?: number;
  sunrise?: number;
  sunset?: number;
  humidity?: number;

  constructor(json: any) {
    // Binding data trực tiếp
    this.name = this.name;
    this.description = json.weather[0].description;
    // check kiểu dữ liệu "temp"
    this.temp =
      typeof json.main.temp !== "number"
        ? parseFloat(json.main.temp)
        : json.main.temp;
    this.speed = json.wind.speed;
    this.sunrise = json.sys.sunrise;
    this.sunset = json.sys.sunset;
    this.humidity = json.main.humidity;
  }
}
export default WeatherModel;
