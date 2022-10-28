export interface IGeolocation {
    lat: number;
    lon: number;
    speed: number;
    localTime: Date;
    batteryLevel: number;
    batteryIsCharging: boolean;
}

export class SetGeolocationDto {
    points: IGeolocation[];
}
